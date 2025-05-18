import 'package:flutter/material.dart';

class UserProvider with ChangeNotifier {
  int? _userId;
  String? _token;

  int? get userId => _userId;
  String? get token => _token;

  void setUser(int userId, String token) {
    _userId = userId;
    _token = token;
    notifyListeners();
  }

  void clearUser() {
    _userId = null;
    _token = null;
    notifyListeners();
  }

  // Méthode pour déconnecter l'utilisateur
  void disconnect() {
    clearUser();

  }
}