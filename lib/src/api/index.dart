import 'dart:convert';

import 'package:axwallet_sdk/src/api/apiBasic.dart';
import 'package:axwallet_sdk/src/api/apiNomination.dart';
import 'package:axwallet_sdk/src/api/apiTransfer.dart';
import 'package:axwallet_sdk/src/api/apiUtils.dart';
import 'package:axwallet_sdk/src/service/index.dart';

class Api {
  Api(this.service);

  final Service service;

  late ApiBasic basic;
  late ApiNomination nomination;
  late ApiTransfer transfer;
  late ApiUtils utils;

  void init() {
    basic = ApiBasic(this, service.basic);
    nomination = ApiNomination(this, service.nomination);
    transfer = ApiTransfer(this, service.transfer);
    utils = ApiUtils(this, service.utils);
  }
}
