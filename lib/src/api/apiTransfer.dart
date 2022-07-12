import 'package:axwallet_sdk/src/api/index.dart';
import 'package:axwallet_sdk/src/service/transfer.dart';
import 'package:axwallet_sdk/models/index.dart';

class ApiTransfer {
  ApiTransfer(this.apiRoot, this.service);

  final Api apiRoot;
  final ServiceTransfer service;

  Future getFee({required String chainID, required bool isExport}) async {
    final res = await service.getFee(chainID: chainID, isExport: isExport);
    return res;
  }

  Future getAdjustedGasPrice() async {
    final res = await service.getAdjustedGasPrice();
    return res;
  }

  Future getEstimatedGasLimit(
      {required String to, required String amount}) async {
    final res = await service.getEstimatedGasLimit(to: to, amount: amount);
    return res;
  }

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

  Future<List<AXCTransaction>> getTransactions() async {
    final res = await service.getTransactions();
    return res;
  }
}
