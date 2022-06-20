import 'package:axwallet_sdk/src/service/index.dart';

class ServiceNomination {
  ServiceNomination(this.serviceRoot);

  final SubstrateService serviceRoot;

  Future getValidators() async {
    final res =
        await serviceRoot.webView.evalJavascript('nomination.getValidators()');
    return res;
  }
}
