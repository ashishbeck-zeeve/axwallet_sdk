import '../../axwallet_sdk.dart';

class ApiSeedPhrase {
  final Service _serviceRoot;

  ApiSeedPhrase(this._serviceRoot);

  Future genSeedPhrase() async {
    final res =
        await _serviceRoot.webView.evalJavascript("seedPhrase.genSeedPhrase()");
    return res;
  }

  Future getWalletAddresses(String mnemonic) async {
    final res =
        await _serviceRoot.webView.evalJavascript("seedPhrase.getWalletAddresses('$mnemonic')");
    return res;
  }  
  
}
