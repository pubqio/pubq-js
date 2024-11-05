import { Rest } from "./core/rest";
import { Socket } from "./core/socket";

export const PubQ = {
    Rest: Rest,
    Socket: Socket,
} as const;

export { Rest, Socket };
