import 'dart:async';

import 'package:axwallet_sdk/src/api/apiSeedPhrase.dart';
import 'package:axwallet_sdk/src/service/basic.dart';
import 'package:axwallet_sdk/src/service/nomination.dart';
import 'package:axwallet_sdk/src/service/transfer.dart';
import 'package:axwallet_sdk/src/webViewRunner.dart';

class Service {
  late ServiceBasic basic;
  late ServiceNomination nomination;
  late ApiSeedPhrase apiSeedPhrase;
  late ServiceTransfer transfer;

  late WebViewRunner _web;

  WebViewRunner get webView => _web;

  Future<void> init({
    WebViewRunner? webViewParam,
    required Function onInitiated,
    String? jsCode,
  }) async {
    basic = ServiceBasic(this);
    nomination = ServiceNomination(this);
    apiSeedPhrase = ApiSeedPhrase(this);
    transfer = ServiceTransfer(this);

    _web = webViewParam ?? WebViewRunner();
    await _web.launch(onInitiated, jsCode: jsCode);
  }
}
