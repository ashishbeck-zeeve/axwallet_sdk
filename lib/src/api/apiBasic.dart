import 'package:axwallet_sdk/src/api/index.dart';
import 'package:axwallet_sdk/models/network_config.dart';
import 'package:axwallet_sdk/src/service/basic.dart';

class ApiBasic {
  ApiBasic(this.apiRoot, this.service);

  final Api apiRoot;
  final ServiceBasic service;

  Future init({String? mnemonic, required NetworkConfig network}) async {
    final res = await service.init(mnemonic: mnemonic, network: network);
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

  Future<bool> changeNetwork(NetworkConfig network) async {
    final res = await service.changeNetwork(network);
    return res;
  }
}
