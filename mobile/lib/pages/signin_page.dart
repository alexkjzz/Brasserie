import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile/services/api_service.dart';
import 'package:mobile/providers/user_provider.dart';

class SignInPage extends StatefulWidget {
  const SignInPage({super.key});

  @override
  _SignInPageState createState() => _SignInPageState();
}

class _SignInPageState extends State<SignInPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;

  Future<void> _login() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final data = await ApiService.login(
        _emailController.text,
        _passwordController.text,
      );

      // Stocker l'ID utilisateur et le token dans UserProvider
      final userProvider = Provider.of<UserProvider>(context, listen: false);
      userProvider.setUser(data['id'], data['token']);

      // Rediriger vers la page principale
      Navigator.pushReplacementNamed(context, '/home');
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                "Bienvenue à la Brasserie",
                style: Theme.of(context).textTheme.titleLarge,
              ),
              SizedBox(height: 20),
              if (_errorMessage != null)
                Padding(
                  padding: const EdgeInsets.only(bottom: 16.0),
                  child: Text(
                    _errorMessage!,
                    style: TextStyle(color: Colors.red, fontSize: 14),
                  ),
                ),
              TextField(
                controller: _emailController,
                decoration: InputDecoration(
                  labelText: "Email",
                  prefixIcon: Icon(Icons.email, color: Color(0xFF1DB954)),
                ),
              ),
              SizedBox(height: 16),
              TextField(
                controller: _passwordController,
                decoration: InputDecoration(
                  labelText: "Mot de passe",
                  prefixIcon: Icon(Icons.lock, color: Color(0xFF1DB954)),
                ),
                obscureText: true,
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: _isLoading ? null : _login,
                child: _isLoading
                    ? CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.black),
                      )
                    : Text("Se connecter"),
              ),
              SizedBox(height: 10),
              TextButton(
                onPressed: () {
                  Navigator.pushNamed(context, '/signup');
                },
                child: Text(
                  "Créer un compte",
                  style: TextStyle(color: Color(0xFF1DB954)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}