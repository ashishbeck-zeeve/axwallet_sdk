import 'dart:convert';

import 'package:axwallet_sdk/src/api/apiBasic.dart';
import 'package:axwallet_sdk/src/api/apiNomination.dart';
import 'package:axwallet_sdk/src/service/index.dart';

class SubstrateApi {
  SubstrateApi(this.service);

  final SubstrateService service;

  late ApiBasic basic;
  late ApiNomination nomination;

  void init() {
    basic = ApiBasic(this, service.basic);
    nomination = ApiNomination(this, service.nomination);
  }
}
