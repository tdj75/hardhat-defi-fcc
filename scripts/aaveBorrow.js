const { getWeth } = require("./getWeth")
const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    await getWeth()

    const { deployer } = await getNamedAccounts()
    const lendingPool = await getLendingPool(deployer)
    console.log(`LendingPool address: ${lendingPool.address}`)
}

async function getLendingPool(account) {
    const iLendingPoolAddressesProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        account
    )
    const lendingPoolAddress = await iLendingPoolAddressesProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, account)
    return lendingPool
}

main()
    .then(() => (process.exitCode = 0))
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
