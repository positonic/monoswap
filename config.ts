import * as dotenv from 'dotenv'

dotenv.config()

const envVars: string[] = [
  'ETHEREUM_NODE_ID',
  'XDAI_NODE_HTTP_URL',
  'MAINNET_NODE_HTTP_URL',
  'XDAI_NODE_WS_URL',
  'MAINNET_NODE_WS_URL'
]

// type requiredOptions = {
//   [key: string]: string
// }

interface requiredEnv {
  //SOCKET_PORT: string
  [key: string]: string | undefined
}

class Config {
  env: requiredEnv

  constructor (envFile: requiredEnv) {
    this.env = envFile
    this.validateEnv(envFile)
  }

  //Have this - replace it!
  validateEnv (envFile: requiredEnv) {
    envVars.forEach((envVar: any) => {
      if (envFile[envVar]) {
        this.env[envVar] = envFile[envVar]
        // console.log(`envVar ---> : ${this[envVar]}`)
      } else {
        throw new Error(`Need to provide a ${envVar} in the .env`)
      }
    })
  }

  get (envVar: string): string | number | undefined {
    if (!this.env[envVar]) {
      throw new Error(`${envVar} is an invalid env variable`)
    }
    return this.env[envVar]
  }
}

const config = new Config(process.env)

export default config
