import 'package:axwallet_sdk/src/service/index.dart';

class ServiceNomination {
  ServiceNomination(this.serviceRoot);

  final Service serviceRoot;

  Future getValidators() async {
    final res =
        await serviceRoot.webView.evalJavascript('nomination.getValidators()');
    return res;
  }

  Future nominateNode({
    required String nodeID,
    required String amount,
    required int end,
    String? rewardAddress,
  }) async {
    int bufferTime = 300000; // 5 minutes
    int start = DateTime.now().millisecondsSinceEpoch + bufferTime;
    final res = await serviceRoot.webView.evalJavascript(rewardAddress == null
        ? 'nomination.nominateNode("$nodeID", "$amount", $start, $end)'
        : 'nomination.nominateNode("$nodeID", "$amount", $start, $end, "$rewardAddress")');
    return res;
  }
}
