import 'package:axwallet_sdk/src/api/index.dart';
import 'package:axwallet_sdk/src/service/basic.dart';

class ApiBasic {
  ApiBasic(this.apiRoot, this.service);

  final Api apiRoot;
  final ServiceBasic service;

  Future init({String? mnemonic}) async {
    final res = await service.init(mnemonic: mnemonic);
    return res;
  }

  Future getWallet() async {
    final res = await service.getWallet();
    return res;
  }

  Future getBalance() async {
    final res = await service.getBalance();
    return res;
  }

  Future changeNetwork({bool isTestNet = true}) async {
    final res = await service.changeNetwork(isTestNet: isTestNet);
    return res;
  }
}
