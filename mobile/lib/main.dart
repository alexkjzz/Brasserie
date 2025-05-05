import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/user_provider.dart';
import 'layouts/main_layout.dart';
import 'pages/signin_page.dart';
import 'pages/signup_page.dart';
import 'pages/profile_page.dart';
import 'pages/settings_page.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => UserProvider(),
      child: MaterialApp(
        title: 'Brasserie App',
        initialRoute: '/signin',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          visualDensity: VisualDensity.adaptivePlatformDensity,
          bottomNavigationBarTheme: BottomNavigationBarThemeData(
            backgroundColor: Colors.white, // Couleur de fond de la barre
            selectedItemColor: Colors.blue, // Couleur des icônes et labels sélectionnés
            unselectedItemColor: Colors.grey, // Couleur des icônes et labels non sélectionnés
          ),
        ),
        debugShowCheckedModeBanner: false,
        routes: {
          '/signin': (context) => SignInPage(),
          '/signup': (context) => SignUpPage(),
          '/home': (context) => MainLayout(),
          '/profile': (context) => ProfilePage(), // Correction du nom de la page
          '/settings': (context) => SettingsPage(), // Ajout de la route Settings
        },
      ),
    );
  }
}
