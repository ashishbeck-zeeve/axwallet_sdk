import 'package:axwallet_sdk/src/service/index.dart';

class ServiceBasic {
  ServiceBasic(this.serviceRoot);

  final Service serviceRoot;

  Future init({String? mnemonic}) async {
    final res = await serviceRoot.webView
        .evalJavascript('basic.init(${mnemonic != null ? "$mnemonic" : null})');
    return res;
  }

  Future getWallet() async {
    final res = await serviceRoot.webView.evalJavascript('basic.getWallet()');
    return res;
  }

  Future getBalance() async {
    final res = await serviceRoot.webView.evalJavascript('basic.getBalance()');
    return res;
  }

  Future changeNetwork({bool isTestNet = true}) async {
    final res = await serviceRoot.webView
        .evalJavascript('basic.changeNetwork($isTestNet)');
    return res;
  }
}
