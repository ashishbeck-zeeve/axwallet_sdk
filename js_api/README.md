# AXwallet API SDK

Wraps `@axiawallet_sdk/js-api` inside a headless inapp webview in flutter to provide APIs for AXwallet.

## Build & Test

### To build:

```bash
npm install
npm run build
```
or
```bash
yarn install
yarn build
```

### To test:
- Open `./test/index.html` in chrome.
- Open dev console
- Wait for the test wallet to load
- Run `runTests()`
- All the other functions are available to be executed through the console- `basic`, `transfer` and `nomination`