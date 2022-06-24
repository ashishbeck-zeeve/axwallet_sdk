import 'package:axwallet_sdk/src/api/index.dart';
import 'package:axwallet_sdk/src/service/transfer.dart';

class ApiTransfer {
  ApiTransfer(this.apiRoot, this.service);

  final Api apiRoot;
  final ServiceTransfer service;

  Future sameChain({
    required String to,
    required String amount,
    required String chain,
    String? memo,
  }) async {
    final res = await service.sameChain(
      to: to,
      amount: amount,
      chain: chain,
      memo: memo,
    );
    return res;
  }

  Future crossChain({
    required String from,
    required String to,
    required String amount,
    String? memo,
  }) async {
    final res = await service.crossChain(
      from: from,
      to: to,
      amount: amount,
    );
    return res;
  }
}
