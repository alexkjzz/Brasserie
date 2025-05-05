import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/user_provider.dart';
import '../pages/home_page.dart';
import '../pages/products_page.dart';
import '../pages/reservation_page.dart';
import '../pages/profile_page.dart';
import '../pages/settings_page.dart';

class MainLayout extends StatefulWidget {
  @override
  _MainLayoutState createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _currentIndex = 0;

  final List<Widget> _pages = [
    HomePage(),
    ProductsPage(),
    ReservationPage(),
    ProfilePage(),
    SettingsPage(),
  ];

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
      body: _pages[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
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
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: "Profil",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: "Paramètres",
          ),
        ],
        backgroundColor: Color(0xFF121212),
        selectedItemColor: Color(0xFF1DB954),
        unselectedItemColor: Colors.grey[600],
        type: BottomNavigationBarType.fixed,
      ),
    );
  }
}