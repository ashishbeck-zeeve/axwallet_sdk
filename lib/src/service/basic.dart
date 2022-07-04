import 'dart:convert';

import 'package:axwallet_sdk/models/index.dart';
import 'package:axwallet_sdk/src/service/index.dart';

class ServiceBasic {
  ServiceBasic(this.serviceRoot);

  final Service serviceRoot;

  Future init({String? mnemonic, required NetworkConfig network}) async {
    final res = mnemonic != null
        ? await serviceRoot.webView
            .evalJavascript('basic.init("$mnemonic", ${network.toJson()})')
        : await serviceRoot.webView
            .evalJavascript('basic.init(null, ${network.toJson()})');
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

  Future<bool> changeNetwork(NetworkConfig network) async {
    final res = await serviceRoot.webView
        .evalJavascript('basic.changeNetwork(${network.toJson()})');
    return res;
  }
}
