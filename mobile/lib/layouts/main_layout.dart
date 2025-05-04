import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/user_provider.dart';
import '../pages/home_page.dart';
import '../pages/products_page.dart';
import '../pages/reservation_page.dart';

class MainLayout extends StatefulWidget {
  @override
  _MainLayoutState createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _currentIndex = 0;

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  void _logout(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    userProvider.disconnect();
    Navigator.pushReplacementNamed(context, '/signin'); // Redirige vers la page de connexion
  }

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context);

    // Vérifiez si l'utilisateur est connecté
    if (userProvider.userId == null || userProvider.token == null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.pushReplacementNamed(context, '/signin');
      });
      return SizedBox.shrink(); // Retourne un widget vide temporairement
    }

    // Liste des pages accessibles via la BottomNavigationBar
    final List<Widget> pages = [ // Renommé pour éviter l'erreur de variable commençant par un underscore
      HomePage(),
      ProductsPage(), // Suppression des paramètres non définis
      ReservationPage(), // Suppression des paramètres non définis
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text("Brasserie"),
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () => _logout(context),
            tooltip: "Déconnexion",
          ),
        ],
      ),
      body: pages[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: _onTabTapped,
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: "Accueil",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_cart),
            label: "Produits",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_today),
            label: "Réservations",
          ),
        ],
      ),
    );
  }
}