import 'package:axwallet_sdk/src/service/index.dart';

class ServiceBasic {
  ServiceBasic(this.serviceRoot);

  final SubstrateService serviceRoot;

  Future getBalance({String? address}) async {
    final res = await serviceRoot.webView
        .evalJavascript('basic.getBalance("$address")');
    return res;
  }

  Future<dynamic> createKeychain() async {
    final res =
        await serviceRoot.webView.evalJavascript('basic.createKeychain()');
    return res;
  }
}
