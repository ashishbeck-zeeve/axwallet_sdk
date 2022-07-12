import 'package:axwallet_sdk/src/api/index.dart';
import 'package:axwallet_sdk/src/service/utils.dart';

class ApiUtils {
  ApiUtils(this.apiRoot, this.service);

  final Api apiRoot;
  final ServiceUtils service;

  Future<bool> checkAddrValidity({required String address}) async {
    final res = await service.checkAddrValidity(address: address);
    return res;
  }

  Future<String> getIdenticon({required String address}) async {
    final res = await service.getIdenticon(address: address);
    return res;
  }
}
