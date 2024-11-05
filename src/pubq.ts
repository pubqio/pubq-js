import { Option } from "interfaces/option.interface";
import { Rest } from "./core/rest";
import { Socket } from "./core/socket";

const PubQ = {
    Rest: class {
        constructor(options?: Partial<Option>) {
            return new Rest(options);
        }
    },

    Socket: class {
        constructor(options?: Partial<Option>) {
            return new Socket(options);
        }
    },
};

export { PubQ };
