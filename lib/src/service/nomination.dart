import 'package:axwallet_sdk/src/service/index.dart';

class ServiceNomination {
  ServiceNomination(this.serviceRoot);

  final Service serviceRoot;

  Future getValidators() async {
    final res =
        await serviceRoot.webView.evalJavascript('nomination.getValidators()');
    return res;
  }

  Future addValidator({
    required String nodeID,
    required String amount,
    required int end,
    required int fee,
    String? rewardAddress,
  }) async {
    DateTime endDate = DateTime.fromMillisecondsSinceEpoch(end);
    Duration period = const Duration(days: 120);
    int start = endDate.subtract(period).millisecondsSinceEpoch;
    final res = await serviceRoot.webView.evalJavascript(rewardAddress == null
        ? 'nomination.addValidator("$nodeID", "$amount", $start, $end, $fee)'
        : 'nomination.addValidator("$nodeID", "$amount", $start, $end, $fee, "$rewardAddress")');
    return res;
  }

  Future nominateNode({
    required String nodeID,
    required String amount,
    required int end,
    String? rewardAddress,
  }) async {
    DateTime endDate = DateTime.fromMillisecondsSinceEpoch(end);
    Duration period = const Duration(days: 120);
    int start = endDate.subtract(period).millisecondsSinceEpoch;
    final res = await serviceRoot.webView.evalJavascript(rewardAddress == null
        ? 'nomination.nominateNode("$nodeID", "$amount", $start, $end)'
        : 'nomination.nominateNode("$nodeID", "$amount", $start, $end, "$rewardAddress")');
    return res;
  }
}
