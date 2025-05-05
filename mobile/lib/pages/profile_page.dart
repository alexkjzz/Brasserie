import 'package:flutter/material.dart';
import 'package:mobile/services/api_service.dart';
import 'package:provider/provider.dart';
import 'package:mobile/providers/user_provider.dart';

class ProfilePage extends StatefulWidget {
  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  Map<String, dynamic>? _userInfo;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchUserInfo();
  }

  Future<void> _fetchUserInfo() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final userProvider = Provider.of<UserProvider>(context, listen: false);
      final userInfo = await ApiService.fetchUserProfile(userProvider.token!);
      setState(() {
        _userInfo = userInfo;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur lors de la récupération des informations utilisateur.')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _userInfo == null
              ? Center(child: Text("Aucune information disponible."))
              : Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ListTile(
                        leading: Icon(Icons.person, color: Color(0xFF1DB954)),
                        title: Text("Nom"),
                        subtitle: Text(_userInfo!['nom']),
                      ),
                      ListTile(
                        leading: Icon(Icons.person_outline, color: Color(0xFF1DB954)),
                        title: Text("Prénom"),
                        subtitle: Text(_userInfo!['prenom']),
                      ),
                      ListTile(
                        leading: Icon(Icons.email, color: Color(0xFF1DB954)),
                        title: Text("Email"),
                        subtitle: Text(_userInfo!['email']),
                      ),
                    ],
                  ),
                ),
    );
  }
}