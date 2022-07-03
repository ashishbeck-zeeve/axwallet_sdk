import 'dart:convert';

class NetworkConfig {
  String name;
  String url;
  int networkID;
  String? explorerURL;
  String? explorerSiteURL;
  bool isTestNet;
  NetworkConfig({
    required this.name,
    required this.url,
    required this.networkID,
    this.explorerURL,
    this.explorerSiteURL,
    required this.isTestNet,
  });

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'url': url,
      'networkID': networkID,
      'explorerURL': explorerURL,
      'explorerSiteURL': explorerSiteURL,
      'isTestNet': isTestNet,
    };
  }

  factory NetworkConfig.fromMap(Map<String, dynamic> map) {
    return NetworkConfig(
      name: map['name'] ?? '',
      url: map['url'] ?? '',
      networkID: map['networkID']?.toInt() ?? 0,
      explorerURL: map['explorerURL'],
      explorerSiteURL: map['explorerSiteURL'],
      isTestNet: map['isTestNet'] ?? true,
    );
  }

  String toJson() => json.encode(toMap());

  factory NetworkConfig.fromJson(String source) =>
      NetworkConfig.fromMap(json.decode(source));

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is NetworkConfig &&
        other.name == name &&
        other.url == url &&
        other.networkID == networkID &&
        other.explorerURL == explorerURL &&
        other.explorerSiteURL == explorerSiteURL &&
        other.isTestNet == isTestNet;
  }

  @override
  int get hashCode {
    return name.hashCode ^
        url.hashCode ^
        networkID.hashCode ^
        explorerURL.hashCode ^
        explorerSiteURL.hashCode ^
        isTestNet.hashCode;
  }
}
