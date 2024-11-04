interface Permissions {
    [resource: string]: string[];
}

export interface JWTHeader {
    alg: string;
    typ: string;
    kid: string;
}

export interface JWTPayload {
    clientId?: string;
    permissions?: Permissions;
    exp: number;
}
