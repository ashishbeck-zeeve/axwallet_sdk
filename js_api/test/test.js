function expect(actual, matcher) {
  if (actual !== matcher) {
    throw new Error(`expect ${matcher}, got ${actual}`);
  }
}

const chains = ["Swap", "Core", "AX"]
const swapAddr = "Swap-test1hm435mw8ntnqkkglr9nzs0ujqmrv5tna5hmd2u"
const coreAddr = "Core-test1hm435mw8ntnqkkglr9nzs0ujqmrv5tna5hmd2u"
const axAddr = "0x3F3BC634BAc77e34CB4AAAE1133A8238390B054e"

async function runAccountTest() {
  const addresses = await basic.getWallet()
  console.log("Wallet addresses are")
  console.log(addresses)
  expect(swapAddr, addresses["allSwap"][0])
  expect(coreAddr, addresses["allCore"][0])
  expect(axAddr, addresses["ax"])
  console.log("Address Test Passed")
  const balances = await basic.getBalance()
  console.log("Balances are")
  console.log(balances)
}

async function getAllFees() {
  for (e of chains) {
    const exportFee = await transfer.getFee(e, true)
    console.log(e + " export fee is " + exportFee)
    const importFee = await transfer.getFee(e, false)
    console.log(e + " import fee is " + importFee)
    if (e !== "AX") {
      expect("0.001", exportFee)
      expect("0.001", importFee)
    } else {
      expect("0.0003509375", exportFee)
      expect("0.000350875", importFee)
    }
  }
  console.log("Cross Chain Fees Test Passed")

  const gasPrice = await transfer.getAdjustedGasPrice()
  console.log("Gas price is " + gasPrice)
  expect("0.00000003125", gasPrice)
  const gasLimit = await transfer.getEstimatedGasLimit(axAddr, "1000000000000")
  console.log("Gas Limit is " + gasLimit)
  expect(21000, gasLimit)
  const totalFees = gasLimit * gasPrice
  console.log("Total tranaction fee is " + totalFees)
  expect(0.0006562499999999999, totalFees)
  console.log("Gas Price Tests Passed")
}

async function runTests() {
  // await basic.init("item ask cook trumpet foil glance unique outdoor erode address long actual century match valve finish bacon travel uncover pyramid nature balcony purse silk");
  await runAccountTest()
  console.log("All Account Test Passed")
  await getAllFees()
  console.log("All Fees Test Passed")

  console.log("--------------------")
  console.log("All Tests Passed.");
}
window.runTests = runTests;
