import 'package:axwallet_sdk/src/service/index.dart';

class ServiceTransfer {
  ServiceTransfer(this.serviceRoot);

  final Service serviceRoot;

  Future getFee({required String chainID, required bool isExport}) async {
    final res = await serviceRoot.webView
        .evalJavascript('transfer.getFee("$chainID", $isExport)');
    return res;
  }

  Future getAdjustedGasPrice() async {
    final res = await serviceRoot.webView
        .evalJavascript('transfer.getAdjustedGasPrice()');
    return res;
  }

  Future getEstimatedGasLimit(
      {required String to, required String amount}) async {
    final res = await serviceRoot.webView
        .evalJavascript('transfer.getEstimatedGasLimit("$to", "$amount")');
    return res;
  }

  Future sameChain({
    required String to,
    required String amount,
    required String chain,
    String? memo,
  }) async {
    final res = await serviceRoot.webView.evalJavascript(
        'transfer.sameChain("$to", "$amount", "$chain", "$memo")');
    return res;
  }

  Future crossChain({
    required String from,
    required String to,
    required String amount,
  }) async {
    final res = await serviceRoot.webView
        .evalJavascript('transfer.crossChain("$from", "$to", "$amount")');
    return res;
  }
}
