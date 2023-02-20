const { ethers, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")

async function getWeth(amount, account) {
    const chainId = network.config.chainId
    const iWeth = await ethers.getContractAt("IWeth", networkConfig[chainId].wethToken, account)
    const tx = await iWeth.deposit({ value: amount })
    await tx.wait()
    const wethBalance = await iWeth.balanceOf(account)
    console.log(`Got ${wethBalance.toString()} WETH`)
}

async function getLendingPool(account) {
    const chainId = network.config.chainId
    const iLendingPoolAddressesProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        networkConfig[chainId].lendingPoolAddressesProvider,
        account
    )
    const lendingPoolAddress = await iLendingPoolAddressesProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, account)
    console.log(`LendingPool address: ${lendingPool.address}`)
    return lendingPool
}

async function getBorrowUserData(lendingPool, account) {
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
        await lendingPool.getUserAccountData(account)
    console.log(`You have ${totalCollateralETH} worth of ETH deposited.`)
    console.log(`You have ${totalDebtETH} worth of ETH borrowed.`)
    console.log(`You can borrow ${availableBorrowsETH} worth of ETH.`)
    return { totalCollateralETH, totalDebtETH, availableBorrowsETH }
}

async function getDaiPrice() {
    const chainId = network.config.chainId
    const daiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        networkConfig[chainId].daiEthPriceFeed
    )
    const { answer: price } = await daiEthPriceFeed.latestRoundData()
    console.log(`The DAI/ETH price is ${price.toString()}`)
    return price
}

async function approveErc20(erc20Address, spenderAddress, amount, signer) {
    console.log("Approving ERC20...")
    const erc20Token = await ethers.getContractAt("IERC20", erc20Address, signer)
    const tx = await erc20Token.approve(spenderAddress, amount)
    await tx.wait()
    console.log("ERC20 approved!")
}

async function depositAsset(lendingPool, asset, amount, account) {
    await approveErc20(asset, lendingPool.address, amount, account)
    console.log("Depositing asset...")
    const tx = await lendingPool.deposit(asset, amount, account, 0)
    await tx.wait()
    console.log("Asset deposited!")
}

async function borrowAsset(lendingPool, asset, amount, account) {
    console.log("Borrowing asset...")
    const tx = await lendingPool.borrow(asset, amount, 1, 0, account)
    tx.wait()
    console.log("Asset borrowed!")
}

async function repayAsset(lendingPool, asset, amount, account) {
    await approveErc20(asset, lendingPool.address, amount, account)
    console.log("Repaying asset...")
    const tx = await lendingPool.repay(asset, amount, 1, account)
    await tx.wait()
    console.log("Asset repaid!")
}

module.exports = {
    getWeth,
    getLendingPool,
    getBorrowUserData,
    getDaiPrice,
    depositAsset,
    borrowAsset,
    repayAsset,
}
