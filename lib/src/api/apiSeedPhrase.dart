import '../../axwallet_sdk.dart';

class ApiSeedPhrase {
  final SubstrateService _serviceRoot;

  ApiSeedPhrase(this._serviceRoot);

  Future getSeedPhrase() async {
    final res =
        await _serviceRoot.webView.evalJavascript("seedPhrase.getSeedPhrase()");
    return res;
  }

  Future deriveAddress(String mnemonic) async {
    final res =
        await _serviceRoot.webView.evalJavascript("seedPhrase.deriveAddress('$mnemonic')");
    return res;
  }

}
