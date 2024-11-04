import { Option } from "interfaces/option.interface";
import { Rest } from "./core/rest";
import { Socket } from "./core/socket";

const PubQ = {
    Rest: class {
        constructor(option?: Partial<Option>) {
            return new Rest(option);
        }
    },

    Socket: class {
        constructor(option?: Partial<Option>) {
            return new Socket(option);
        }
    },
};

export { PubQ };
