import { EventEmitter } from "./event-emitter";
import { OptionManager } from "./option-manager";
import { HttpClient } from "./http-client";
import { JWT } from "utils/jwt";
import { JWTPayload } from "interfaces/jwt.interface";
import {
    AuthResponse,
    TokenOptions,
    TokenRequest,
} from "interfaces/token.interface";
import { Crypto } from "utils/crypto";
import { ApiKey } from "utils/api-key";
import { AuthEvents } from "types/event.type";
import { Logger } from "utils/logger";

class AuthManager extends EventEmitter {
    private static instances: Map<string, AuthManager> = new Map();
    private instanceId: string;
    private optionManager: OptionManager;
    private httpClient: HttpClient;
    private currentToken: string | null = null;
    private refreshTimeout?: NodeJS.Timeout;
    private logger: Logger;

    private constructor(instanceId: string) {
        super();
        this.instanceId = instanceId;
        this.optionManager = OptionManager.getInstance(instanceId);
        this.httpClient = new HttpClient();
        this.logger = new Logger(instanceId, "AuthManager");

        const tokenRequest = this.optionManager.getOption("tokenRequest");
        if (tokenRequest) {
            this.logger.debug("Initial token request found, requesting token");
            this.requestToken(tokenRequest).catch((error) => {
                this.emit(AuthEvents.TOKEN_ERROR, error);
            });
        }
    }

    public static getInstance(instanceId: string): AuthManager {
        if (!AuthManager.instances.has(instanceId)) {
            AuthManager.instances.set(instanceId, new AuthManager(instanceId));
        }
        return AuthManager.instances.get(instanceId)!;
    }

    /**
     * Unified error handler for auth manager
     */
    private handleError(error: unknown, context: string): never {
        const formattedError =
            error instanceof Error
                ? new Error(`${context}: ${error.message}`)
                : new Error(`${context}: Unknown error`);

        this.logger.error(`${context}:`, error);

        // Emit appropriate event based on context
        if (context.includes("token")) {
            this.emit(AuthEvents.TOKEN_ERROR, formattedError);
        } else if (context.includes("auth")) {
            this.emit(AuthEvents.AUTH_ERROR, formattedError);
        }

        throw formattedError;
    }

    /**
     * Authenticates the client with the provided credentials
     * @returns Promise<string | null> The authenticated token or null if using apiKey directly
     * @throws Error if no authentication credentials are provided
     */
    public async authenticate(): Promise<AuthResponse | null> {
        const retries =
            this.optionManager.getOption("authenticateRetries") || 0;
        const retryInterval =
            this.optionManager.getOption("authenticateRetryIntervalMs") || 1000;
        const tokenRequest = this.optionManager.getOption("tokenRequest");

        this.logger.info(`Starting authentication (retries: ${retries})`);

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                if (tokenRequest) {
                    this.logger.debug("Using token request for authentication");
                    return await this.requestToken(tokenRequest);
                }

                const response = await this._authenticate();

                if (response?.tokenRequest) {
                    this.logger.debug(
                        "Received token request in response, requesting token"
                    );
                    return await this.requestToken(response.tokenRequest);
                }

                return response;
            } catch (error) {
                const isLastAttempt = attempt === retries;
                this.logger.warn(
                    `Authentication attempt ${attempt + 1} failed`
                );

                if (isLastAttempt) {
                    return this.handleError(error, "Authentication failed");
                }

                this.logger.debug(`Retrying in ${retryInterval}ms`);
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval)
                );
            }
        }

        return null;
    }

    private async _authenticate(): Promise<AuthResponse | null> {
        const authUrl = this.optionManager.getOption("authUrl");
        const apiKey = this.optionManager.getOption("apiKey");
        const authOptions = this.optionManager.getOption("authOptions");

        if (!authUrl && !apiKey) {
            return this.handleError(
                new Error("Either authUrl or apiKey must be provided"),
                "Authentication failed"
            );
        }

        if (!authUrl) {
            return null; // Will use apiKey for authentication
        }

        const response = await this.httpClient.post<AuthResponse>(
            authUrl,
            authOptions?.body || {},
            {
                ...authOptions?.headers,
            }
        );

        if (response.token) {
            JWT.decode(response.token);
            this.setToken(response.token);
            return response;
        }

        if (response.tokenRequest) {
            return response;
        }

        return this.handleError(
            new Error("Invalid response: expected token or tokenRequest"),
            "Authentication failed"
        );
    }

    /**
     * Check if auto authentication is enabled
     */
    public shouldAutoAuthenticate(): boolean {
        return this.optionManager.getOption("autoAuthenticate") ?? true;
    }

    private setToken(token: string): void {
        this.logger.debug("Setting new token");
        this.currentToken = token;
        this.emit(AuthEvents.TOKEN_UPDATED, token);
        this.scheduleTokenRefresh(token);
    }

    public getToken(): string | null {
        if (this.currentToken && !JWT.isExpired(this.currentToken)) {
            return this.currentToken;
        }
        if (this.currentToken) {
            this.emit(AuthEvents.TOKEN_EXPIRED);
            this.clearToken();
        }
        return null;
    }

    private scheduleTokenRefresh(token: string): void {
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }

        try {
            const { payload } = JWT.decode(token);
            const buffer = 60000; // 1 minute buffer
            const delay = payload.exp * 1000 - Date.now() - buffer;

            if (delay > 0) {
                this.logger.debug(`Scheduling token refresh in ${delay}ms`);
                this.refreshTimeout = setTimeout(() => {
                    this.logger.info("Token expired, clearing token");
                    this.emit(AuthEvents.TOKEN_EXPIRED);
                    this.clearToken();
                }, delay);
            } else {
                this.logger.warn("Token already expired or about to expire");
                this.emit(AuthEvents.TOKEN_EXPIRED);
                this.clearToken();
            }
        } catch (error) {
            this.logger.error("Error scheduling token refresh:", error);
            this.emit(AuthEvents.TOKEN_ERROR, error);
            this.clearToken();
        }
    }

    public clearToken(): void {
        this.logger.debug("Clearing token");
        this.currentToken = null;
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }
    }

    public getAuthHeaders(): HeadersInit {
        const apiKey = this.optionManager.getOption("apiKey");
        const token = this.getToken();
        const clientId = this.optionManager.getOption("clientId");

        if (token) {
            return {
                Authorization: `Bearer ${token}`,
            };
        } else if (apiKey) {
            const headers: HeadersInit = {
                Authorization: `Basic ${btoa(apiKey)}`,
            };
            
            // Add clientId header for basic auth if provided
            if (clientId) {
                headers["X-Client-ID"] = clientId;
            }
            
            return headers;
        }

        return this.handleError(
            new Error("No authentication credentials provided"),
            "No authentication credentials provided"
        );
    }

    public getAuthQueryParams(): string {
        const apiKey = this.optionManager.getOption("apiKey");
        const token = this.getToken();
        const clientId = this.optionManager.getOption("clientId");

        if (token) {
            return `access_token=${encodeURIComponent(token)}`;
        } else if (apiKey) {
            let params = `api_key=${encodeURIComponent(apiKey)}`;
            
            // Add clientId query param for basic auth if provided
            if (clientId) {
                params += `&client_id=${encodeURIComponent(clientId)}`;
            }
            
            return params;
        }

        return this.handleError(
            new Error("No authentication credentials available"),
            "No authentication credentials available"
        );
    }

    public getAuthenticateUrl(baseUrl: string): string {
        const authQueryParams = this.getAuthQueryParams();
        const separator = baseUrl.includes("?") ? "&" : "?";
        return `${baseUrl}${separator}${authQueryParams}`;
    }

    /**
     * Generates a PubQ-compatible JWT token
     * Medium-low level of security
     * Should be called from server-side only
     * Note: The permissions are not validated by the server, so make sure to set the correct permissions that align with the API key or use the issueToken method instead
     * @param options - Token options
     * @returns Promise<string> The generated JWT token
     * @throws Error if apiKey is not provided or signing fails
     */
    public async generateToken(options: TokenOptions = {}): Promise<string> {
        const apiKey = this.optionManager.getOption("apiKey");

        if (!apiKey) {
            return this.handleError(
                new Error("API key is required"),
                "Token generation failed"
            );
        }

        try {
            const { apiKeyId, privateKey } = ApiKey.parse(apiKey);

            const payload: JWTPayload = {
                exp:
                    Math.floor(Date.now() / 1000) + (options.expiresIn || 3600),
            };

            if (options.clientId !== undefined) {
                payload.clientId = options.clientId;
            }

            if (options.permissions !== undefined) {
                payload.permissions = options.permissions;
            }

            return await JWT.sign(payload, apiKeyId, privateKey);
        } catch (error) {
            return this.handleError(error, "Token generation failed");
        }
    }

    /**
     * Issues a new JWT token from PubQ server
     * Medium level of security
     * Should be called from server-side only
     * @param options - Token options
     * @returns Promise<string> The issued JWT token
     * @throws Error if apiKey is not provided or token request fails
     */
    public async issueToken(options: TokenOptions = {}): Promise<string> {
        const apiKey = this.optionManager.getOption("apiKey");

        if (!apiKey) {
            return this.handleError(
                new Error("API key is required for issuing tokens"),
                "Token issuance failed"
            );
        }

        try {
            const { apiKeyId } = ApiKey.parse(apiKey);

            const host = this.optionManager.getOption("httpHost");
            const port = this.optionManager.getOption("httpPort");
            const isSecure = this.optionManager.getOption("isSecure");
            const protocol = isSecure ? "https" : "http";
            const baseUrl = `${protocol}://${host}${port ? `:${port}` : ""}/v1`;
            const url = `${baseUrl}/key/${apiKeyId}/token/issue`;

            const response = await this.httpClient.post<{ token: string }>(
                url, // PubQ token endpoint
                options, // Token options
                {
                    Authorization: `Basic ${btoa(apiKey)}`,
                }
            );

            if (!response.token) {
                return this.handleError(
                    new Error("Invalid token response from PubQ server"),
                    "Token issuance failed"
                );
            }

            JWT.decode(response.token);

            return response.token;
        } catch (error) {
            return this.handleError(error, "Token issuance failed");
        }
    }

    /**
     * Creates a token request object for client-side token requests
     * High level of security
     * Should be called from server-side only
     * @param options - Token request options
     * @returns Promise<TokenRequest> Object to be used by client for token request
     * @throws Error if apiKey is not provided or signing fails
     */
    public async createTokenRequest(
        options: TokenOptions = {}
    ): Promise<TokenRequest> {
        const apiKey = this.optionManager.getOption("apiKey");

        if (!apiKey) {
            return this.handleError(
                new Error("API key is required for creating token requests"),
                "Token request creation failed"
            );
        }

        try {
            const { apiKeyId, privateKey } = ApiKey.parse(apiKey);

            const timestamp = Math.floor(Date.now() / 1000);

            // Create signature data based on provided options
            let dataToSign = `${apiKeyId}.${timestamp}`;
            if (options.clientId !== undefined) {
                dataToSign += `.${options.clientId}`;
            }
            if (options.permissions !== undefined) {
                dataToSign += `.${JSON.stringify(options.permissions)}`;
            }

            const signature = await Crypto.hmacSign(dataToSign, privateKey);

            const request: TokenRequest = {
                kid: apiKeyId,
                timestamp,
                signature,
            };

            if (options.clientId !== undefined) {
                request.clientId = options.clientId;
            }
            if (options.permissions !== undefined) {
                request.permissions = options.permissions;
            }

            return request;
        } catch (error) {
            return this.handleError(error, "Token request creation failed");
        }
    }

    /**
     * Requests a token from PubQ server using a TokenRequest
     * Should be called from client-side only
     * @param request - The token request object from auth server
     * @returns Promise<AuthResponse> PubQ server's response containing the token
     */
    public async requestToken(request: TokenRequest): Promise<AuthResponse> {
        try {
            const host = this.optionManager.getOption("httpHost");
            const port = this.optionManager.getOption("httpPort");
            const isSecure = this.optionManager.getOption("isSecure");
            const protocol = isSecure ? "https" : "http";
            const baseUrl = `${protocol}://${host}${port ? `:${port}` : ""}/v1`;
            const url = `${baseUrl}/key/${request.kid}/token/request`;

            const response = await this.httpClient.post<AuthResponse>(
                url,
                request,
                {
                    "Content-Type": "application/json",
                }
            );

            if (!response.token) {
                return this.handleError(
                    new Error("Invalid response: token not found"),
                    "Token request failed"
                );
            }

            JWT.decode(response.token);
            this.setToken(response.token);

            return response;
        } catch (error) {
            return this.handleError(error, "Token request failed");
        }
    }

    public reset(): void {
        this.logger.info("Resetting auth manager");
        this.clearToken();
        this.removeAllListeners();
        AuthManager.instances.delete(this.instanceId);
    }
}

export { AuthManager };
