"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const envVars = [
    'ETHEREUM_NODE_ID',
    'XDAI_NODE_HTTP_URL',
    'MAINNET_NODE_HTTP_URL',
    'XDAI_NODE_WS_URL',
    'MAINNET_NODE_WS_URL'
];
class Config {
    constructor(envFile) {
        this.env = envFile;
        this.validateEnv(envFile);
    }
    //Have this - replace it!
    validateEnv(envFile) {
        envVars.forEach((envVar) => {
            if (envFile[envVar]) {
                this.env[envVar] = envFile[envVar];
                // console.log(`envVar ---> : ${this[envVar]}`)
            }
            else {
                throw new Error(`Need to provide a ${envVar} in the .env`);
            }
        });
    }
    get(envVar) {
        if (!this.env[envVar]) {
            throw new Error(`${envVar} is an invalid env variable`);
        }
        return this.env[envVar];
    }
}
const config = new Config(process.env);
exports.default = config;
//# sourceMappingURL=config.js.map