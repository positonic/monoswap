interface requiredEnv {
    [key: string]: string | undefined;
}
declare class Config {
    env: requiredEnv;
    constructor(envFile: requiredEnv);
    validateEnv(envFile: requiredEnv): void;
    get(envVar: string): string | number | undefined;
}
declare const config: Config;
export default config;
