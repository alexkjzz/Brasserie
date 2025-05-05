import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = "http://127.0.0.1:8000/api";

  // Méthode pour le login
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse("$baseUrl/login"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"email": email, "password": password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['utilisateur'] == null || data['token'] == null) {
        throw Exception("L'ID utilisateur ou le token est manquant dans la réponse.");
      }
      return {
        'id': data['utilisateur']['id'],
        'token': data['token'],
      };
    } else {
      throw Exception(jsonDecode(response.body)['message'] ?? "Erreur de connexion");
    }
  }

  // Méthode pour l'inscription
  static Future<void> register(String nom, String prenom, String email, String password) async {
    final response = await http.post(
      Uri.parse("$baseUrl/register"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "nom": nom,
        "prenom": prenom,
        "email": email,
        "password": password,
      }),
    );

    if (response.statusCode != 201) {
      throw Exception(jsonDecode(response.body)['message'] ?? "Erreur lors de l'inscription");
    }
  }

  // Méthode pour récupérer les produits
  static Future<List<dynamic>> fetchProducts(String token) async {
    final response = await http.get(
      Uri.parse("$baseUrl/produit"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Erreur lors de la récupération des produits.");
    }
  }

  // Méthode pour créer une réservation
  static Future<void> createReservationWithId(String token, int userId, List<Map<String, dynamic>> produits) async {
    final response = await http.post(
      Uri.parse("$baseUrl/reservation/$userId"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
      body: jsonEncode({
        "produits": produits,
      }),
    );

    if (response.statusCode != 201) {
      throw Exception("Erreur lors de la création de la réservation.");
    }
  }

  // Méthode pour récupérer les commandes utilisateur
  static Future<List<dynamic>> fetchUserOrders(String token) async {
    final response = await http.get(
      Uri.parse("$baseUrl/reservation/user-orders"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Erreur lors de la récupération des commandes utilisateur.");
    }
  }

  // Récupérer les informations utilisateur
  static Future<Map<String, dynamic>> fetchUserProfile(String token) async {
    final response = await http.get(
      Uri.parse("$baseUrl/utilisateur/me"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Erreur lors de la récupération des informations utilisateur.");
    }
  }

  // Changer le mot de passe
  static Future<void> changePassword(String token, String oldPassword, String newPassword) async {
    final response = await http.post(
      Uri.parse("$baseUrl/utilisateur/change-password"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
      body: jsonEncode({
        "oldPassword": oldPassword,
        "newPassword": newPassword,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception("Erreur lors du changement de mot de passe.");
    }
  }
}