import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile/services/api_service.dart';
import 'package:mobile/providers/user_provider.dart';

class ReservationPage extends StatefulWidget {
  @override
  _ReservationPageState createState() => _ReservationPageState();
}

class _ReservationPageState extends State<ReservationPage> {
  List<dynamic> _details = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _fetchDetails();
  }

  Future<void> _fetchDetails() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final userProvider = Provider.of<UserProvider>(context, listen: false);
      final details = await ApiService.fetchUserReservations(userProvider.token!);
      setState(() {
        _details = details;
      });
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
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _errorMessage != null
              ? Center(
                  child: Text(
                    _errorMessage!,
                    style: TextStyle(color: Colors.red, fontSize: 16),
                  ),
                )
              : _details.isEmpty
                  ? Center(
                      child: Text(
                        "Aucune commande trouvée.",
                        style: TextStyle(fontSize: 16, color: Colors.grey),
                      ),
                    )
                  : ListView.builder(
                      itemCount: _details.length,
                      itemBuilder: (context, index) {
                        final detail = _details[index];
                        return Card(
                          margin: EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          elevation: 3,
                          child: Padding(
                            padding: const EdgeInsets.all(12.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  "Commande #${detail['reservation_id']}",
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: Theme.of(context).primaryColor,
                                  ),
                                ),
                                SizedBox(height: 8),
                                Text(
                                  "Date : ${detail['dateReservation']}",
                                  style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                                ),
                                SizedBox(height: 8),
                                Text(
                                  "Produits :",
                                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                                ),
                                ...detail['produits'].map<Widget>((prod) {
                                  return Padding(
                                    padding: const EdgeInsets.only(left: 8.0, top: 4.0),
                                    child: Text(
                                      "- ${prod['nom']} (Quantité : ${prod['quantite']})",
                                      style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                                    ),
                                  );
                                }).toList(),
                                SizedBox(height: 8),
                                Text(
                                  "Statut : ${detail['status']}",
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: detail['status'] == "Confirmée"
                                        ? Colors.green
                                        : Colors.red,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
    );
  }
}