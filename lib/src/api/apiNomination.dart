import 'package:axwallet_sdk/src/api/index.dart';
import 'package:axwallet_sdk/src/service/nomination.dart';

class ApiNomination {
  ApiNomination(this.apiRoot, this.service);

  final Api apiRoot;
  final ServiceNomination service;

  Future getValidators() async {
    final res = await service.getValidators();
    return res;
  }

  Future delegateNode({
    required String nodeID,
    required String amount,
    required int end,
    String? rewardAddress,
  }) async {
    final res = await service.delegateNode(
      nodeID: nodeID,
      amount: amount,
      end: end,
      rewardAddress: rewardAddress,
    );
    return res;
  }
}
