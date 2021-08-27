"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
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