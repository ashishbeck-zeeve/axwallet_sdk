import 'package:axwallet_sdk/src/service/index.dart';

class ServiceNomination {
  ServiceNomination(this.serviceRoot);

  final SubstrateService serviceRoot;

  Future getValidators() async {
    final res =
        await serviceRoot.webView.evalJavascript('nomination.getValidators()');
    return res;
  }

  Future delegateNode({
    required String nodeID,
    required String amount,
    required int end,
  }) async {
    int bufferTime = 600000; // 10 minutes
    int start = DateTime.now().millisecondsSinceEpoch + bufferTime;
    final res = await serviceRoot.webView.evalJavascript(
        'nomination.delegateNode("$nodeID", "$amount", $start, $end)');
    return res;
  }
}
