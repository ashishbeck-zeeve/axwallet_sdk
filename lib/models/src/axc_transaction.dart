import 'dart:convert';

class AXCTransaction {
  String? id;
  String? type;
  int? timestamp;
  String? memo;
  String? fee;
  String? stakeStart;
  String? stakeEnd;
  String? nodeID;
  String? amount;
  String? amountL;
  bool? isRewarded;
  String? source;
  String? destination;
  List<Tokens>? tokens;
  AXCTransaction({
    this.id,
    this.type,
    this.timestamp,
    this.memo,
    this.fee,
    this.stakeStart,
    this.stakeEnd,
    this.nodeID,
    this.amount,
    this.amountL,
    this.isRewarded,
    this.source,
    this.destination,
    this.tokens,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'type': type,
      'timestamp': timestamp,
      'memo': memo,
      'fee': fee,
      'stakeStart': stakeStart,
      'stakeEnd': stakeEnd,
      'nodeID': nodeID,
      'amount': amount,
      'amountL': amountL,
      'isRewarded': isRewarded,
      'source': source,
      'destination': destination,
      'tokens': tokens?.map((x) => x.toMap()).toList(),
    };
  }

  factory AXCTransaction.fromMap(Map<String, dynamic> map) {
    return AXCTransaction(
      id: map['id'],
      type: map['type'],
      timestamp: map['timestamp']?.toInt(),
      memo: map['memo'],
      fee: map['fee'],
      stakeStart: map['stakeStart'],
      stakeEnd: map['stakeEnd'],
      nodeID: map['nodeID'],
      amount: map['amount'],
      amountL: map['amountL'],
      isRewarded: map['isRewarded'],
      source: map['source'],
      destination: map['destination'],
      tokens: map['tokens'] != null
          ? List<Tokens>.from(map['tokens']?.map((x) => Tokens.fromMap(x)))
          : null,
    );
  }

  String toJson() => json.encode(toMap());

  factory AXCTransaction.fromJson(String source) =>
      AXCTransaction.fromMap(json.decode(source));
}

class Tokens {
  String? amount;
  String? amountDisplayValue;
  List<String>? addresses;
  Asset? asset;

  Tokens({
    this.amount,
    this.amountDisplayValue,
    this.addresses,
    this.asset,
  });

  Map<String, dynamic> toMap() {
    return {
      'amount': amount,
      'amountDisplayValue': amountDisplayValue,
      'addresses': addresses,
      'asset': asset?.toMap(),
    };
  }

  factory Tokens.fromMap(Map<String, dynamic> map) {
    return Tokens(
      amount: map['amount'],
      amountDisplayValue: map['amountDisplayValue'],
      addresses: List<String>.from(map['addresses']),
      asset: map['asset'] != null ? Asset.fromMap(map['asset']) : null,
    );
  }

  String toJson() => json.encode(toMap());

  factory Tokens.fromJson(String source) => Tokens.fromMap(json.decode(source));
}

class Asset {
  String? name;
  String? symbol;
  String? assetID;
  int? denomination;

  Asset({
    this.name,
    this.symbol,
    this.assetID,
    this.denomination,
  });

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'symbol': symbol,
      'assetID': assetID,
      'denomination': denomination,
    };
  }

  factory Asset.fromMap(Map<String, dynamic> map) {
    return Asset(
      name: map['name'],
      symbol: map['symbol'],
      assetID: map['assetID'],
      denomination: map['denomination']?.toInt(),
    );
  }

  String toJson() => json.encode(toMap());

  factory Asset.fromJson(String source) => Asset.fromMap(json.decode(source));
}
