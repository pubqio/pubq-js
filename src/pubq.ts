import { Rest } from "./core/rest";
import { Socket } from "./core/socket";

const PubQ = {
    Rest: class {
        static instance: Rest;

        constructor() {
            if (!PubQ.Rest.instance) {
                PubQ.Rest.instance = new Rest();
            }
            return PubQ.Rest.instance;
        }
    },

    Socket: class {
        static instance: Socket;

        constructor() {
            if (!PubQ.Socket.instance) {
                PubQ.Socket.instance = new Socket();
            }
            return PubQ.Socket.instance;
        }
    },
};

export { PubQ };
