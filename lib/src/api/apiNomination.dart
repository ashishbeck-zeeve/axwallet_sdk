import 'package:axwallet_sdk/src/api/index.dart';
import 'package:axwallet_sdk/src/service/nomination.dart';

class ApiNomination {
  ApiNomination(this.apiRoot, this.service);

  final SubstrateApi apiRoot;
  final ServiceNomination service;

  Future getValidators() async {
    final res = await service.getValidators();
    return res;
  }

  Future delegateNode({
    required String nodeID,
    required String amount,
    required int end,
  }) async {
    final res = await service.delegateNode(
      nodeID: nodeID,
      amount: amount,
      end: end,
    );
    return res;
  }
}
