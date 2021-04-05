"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var envVars = [
    'ETHEREUM_NODE_ID',
    'XDAI_NODE_HTTP_URL',
    'MAINNET_NODE_HTTP_URL',
    'XDAI_NODE_WS_URL',
    'MAINNET_NODE_WS_URL'
];
var Config = /** @class */ (function () {
    function Config(envFile) {
        this.env = envFile;
        this.validateEnv(envFile);
    }
    //Have this - replace it!
    Config.prototype.validateEnv = function (envFile) {
        var _this = this;
        envVars.forEach(function (envVar) {
            if (envFile[envVar]) {
                _this.env[envVar] = envFile[envVar];
                // console.log(`envVar ---> : ${this[envVar]}`)
            }
            else {
                throw new Error("Need to provide a " + envVar + " in the .env");
            }
        });
    };
    Config.prototype.get = function (envVar) {
        if (!this.env[envVar]) {
            throw new Error(envVar + " is an invalid env variable");
        }
        return this.env[envVar];
    };
    return Config;
}());
var config = new Config(process.env);
exports["default"] = config;
//# sourceMappingURL=config.js.map