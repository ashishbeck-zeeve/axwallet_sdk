function expect(actual, matcher) {
  if (actual !== matcher) {
    throw new Error(`expect ${matcher}, got ${actual}`);
  }
}

async function runAccountTest() {
  await basic.getWallet()
  await basic.getBalance()
}

async function runTests() {
  await basic.init("item ask cook trumpet foil glance unique outdoor erode address long actual century match valve finish bacon travel uncover pyramid nature balcony purse silk");
  await runAccountTest()

  console.log("all tests passed.");
}
window.runTests = runTests;
