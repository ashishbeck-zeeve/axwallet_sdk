import 'package:axwallet_sdk/src/api/index.dart';
import 'package:axwallet_sdk/src/service/basic.dart';

class ApiBasic {
  ApiBasic(this.apiRoot, this.service);

  final SubstrateApi apiRoot;
  final ServiceBasic service;

  Future getBalance({String? address}) async {
    final res = await service.getBalance(
      address: address,
    );
    return res;
  }

  Future<dynamic> createKeychain() async {
    final res = await service.createKeychain();
    return res;
  }
}
