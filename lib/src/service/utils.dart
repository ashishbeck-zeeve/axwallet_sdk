import 'package:axwallet_sdk/src/service/index.dart';

class ServiceUtils {
  ServiceUtils(this.serviceRoot);

  final Service serviceRoot;

  Future<bool> checkAddrValidity({required String address}) async {
    final res = await serviceRoot.webView.evalJavascript(
        'utils.checkAddrValidity("$address")',
        wrapPromise: false);
    return res;
  }

  Future<String> getIdenticon({required String address}) async {
    final res = await serviceRoot.webView
        .evalJavascript('utils.getIdenticon("$address")', wrapPromise: false);
    return res;
  }
}
