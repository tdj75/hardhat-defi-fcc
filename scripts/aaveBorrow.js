const { getNamedAccounts, ethers, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
const {
    getWeth,
    getLendingPool,
    getBorrowUserData,
    getDaiPrice,
    depositAsset,
    borrowAsset,
    repayAsset,
} = require("./auxFunctions")

const AMOUNT = ethers.utils.parseEther("1") // ETH -> WEI
const LOAN_TO_VALUE = 1.0

async function main() {
    const { deployer } = await getNamedAccounts()

    // Scambio ETH per WETH
    await getWeth(AMOUNT, deployer)

    const lendingPool = await getLendingPool(deployer)

    const chainId = network.config.chainId
    const wethTokenAddress = networkConfig[chainId].wethToken
    await depositAsset(lendingPool, wethTokenAddress, AMOUNT, deployer)

    const { availableBorrowsETH } = await getBorrowUserData(lendingPool, deployer)

    const daiPrice = await getDaiPrice()
    const amountDaiToBorrow =
        availableBorrowsETH.toString() * LOAN_TO_VALUE * (1 / daiPrice.toNumber())
    console.log(`You can borrow ${amountDaiToBorrow.toString()} DAI`)

    const amountDaiToBorrowWei = ethers.utils.parseEther(amountDaiToBorrow.toString())
    const daiTokenAddress = networkConfig[chainId].daiToken
    await borrowAsset(lendingPool, daiTokenAddress, amountDaiToBorrowWei, deployer)

    await getBorrowUserData(lendingPool, deployer)

    await repayAsset(lendingPool, daiTokenAddress, amountDaiToBorrowWei, deployer)

    await getBorrowUserData(lendingPool, deployer)
}

main()
    .then(() => (process.exitCode = 0))
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
