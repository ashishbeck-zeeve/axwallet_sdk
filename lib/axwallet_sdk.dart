library axwallet_sdk;

import 'dart:async';

import 'package:axwallet_sdk/src/api/index.dart';
import 'package:axwallet_sdk/src/service/index.dart';
import 'package:axwallet_sdk/src/webViewRunner.dart';

export 'package:axwallet_sdk/src/api/index.dart';
export 'package:axwallet_sdk/src/service/index.dart';
export 'package:axwallet_sdk/src/webViewRunner.dart';

class AXwalletSDK {
  Api? api;

  late Service _service;

  WebViewRunner get webView => _service.webView;

  Future<void> init({
    WebViewRunner? webView,
    String? jsCode,
  }) async {
    final c = Completer();

    _service = Service();
    await _service.init(
      webViewParam: webView,
      jsCode: jsCode,
      onInitiated: () {
        if (!c.isCompleted) {
          c.complete();
        }
      },
    );

    api = Api(_service)..init();
    return c.future;
  }
}
