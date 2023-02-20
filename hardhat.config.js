require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const GANACHE_RPC_URL = process.env.GANACHE_RPC_URL

const MNEMONIC_SEED = process.env.MNEMONIC_SEED

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

const REPORT_GAS = process.env.REPORT_GAS

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            forking: {
                url: MAINNET_RPC_URL,
            },
            accounts: {
                mnemonic: MNEMONIC_SEED,
            },
        },
        localhost: {
            chainId: 31337,
            forking: {
                url: MAINNET_RPC_URL,
            },
            accounts: {
                mnemonic: MNEMONIC_SEED,
            },
        },
        ganache: {
            chainId: 1337,
            url: GANACHE_RPC_URL,
            accounts: {
                mnemonic: MNEMONIC_SEED,
            },
        },
        goerli: {
            chainId: 5,
            url: GOERLI_RPC_URL,
            accounts: {
                mnemonic: MNEMONIC_SEED,
            },
            saveDeployments: true,
        },
        mainnet: {
            chainId: 1,
            url: MAINNET_RPC_URL,
            accounts: {
                mnemonic: MNEMONIC_SEED,
            },
            saveDeployments: true,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.8",
            },
            {
                version: "0.6.12",
            },
            {
                version: "0.4.19",
            },
            {
                version: "0.6.6",
            },
        ],
    },
    etherscan: {
        apiKey: {
            goerli: ETHERSCAN_API_KEY,
            mainnet: ETHERSCAN_API_KEY,
        },
    },
    gasReporter: {
        enabled: REPORT_GAS,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 1,
        },
    },
    mocha: {
        timeout: 200000, // 200 seconds max for running tests
    },
}
