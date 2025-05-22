import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile/services/api_service.dart';
import 'package:mobile/providers/user_provider.dart';

class ProductsPage extends StatefulWidget {
  @override
  _ProductsPageState createState() => _ProductsPageState();
}

class _ProductsPageState extends State<ProductsPage> {
  List<dynamic> _products = [];
  Map<int, int> _quantities = {}; // Stocke les quantités pour chaque produit
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _fetchProducts();
  }

  Future<void> _fetchProducts() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final userProvider = Provider.of<UserProvider>(context, listen: false);
      final products = await ApiService.fetchProducts(userProvider.token!);
      setState(() {
        _products = products;
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

  Future<void> _placeOrder() async {
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    final orderItems = _quantities.entries
        .where((entry) => entry.value > 0) // Inclure uniquement les produits avec une quantité > 0
        .map((entry) => {"id": entry.key, "quantite": entry.value})
        .toList();

    if (orderItems.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Veuillez sélectionner au moins un produit.")),
      );
      return;
    }

    try {
      await ApiService.createReservationWithId(
        userProvider.token!,
        userProvider.userId!,
        orderItems,
      );
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Réservation créée avec succès !")),
      );
      setState(() {
        _quantities.clear(); // Réinitialise les quantités
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Erreur : ${e.toString()}")),
      );
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
              : ListView.builder(
                  itemCount: _products.length,
                  itemBuilder: (context, index) {
                    final product = _products[index];
                    return Card(
                      margin: EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      elevation: 3,
                      child: Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: Row(
                          children: [
                            Image.asset(
                              'assets/images/produits-${product['id'].toString().padLeft(2, '0')}.png',
                              width: 70,
                              height: 70,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) =>
                                  Icon(Icons.image_not_supported, size: 50),
                            )
                            ,
                            SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    product['nom'],
                                    style: TextStyle(
                                      fontSize: 16, 
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  SizedBox(height: 4),
                                  Text(
                                    "Prix : ${product['prix']} €",
                                    style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                                  ),
                                  SizedBox(height: 4),
                                  Text(
                                    "Stock : ${product['quantite']}",
                                    style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                                  ),
                                ],
                              ),
                            ),
                            product['quantite'] > 0
                                ? SizedBox(
                                    width: 120,
                                    child: Row(
                                      children: [
                                        IconButton(
                                          icon: Icon(Icons.remove),
                                          onPressed: (_quantities[product['id']] ?? 0) > 0
                                              ? () {
                                                  setState(() {
                                                    _quantities[product['id']] =
                                                        (_quantities[product['id']] ?? 0) - 1;
                                                  });
                                                }
                                              : null,
                                        ),
                                        Text(
                                          "${_quantities[product['id']] ?? 0}",
                                          style: TextStyle(fontSize: 16),
                                        ),
                                        IconButton(
                                          icon: Icon(Icons.add),
                                          onPressed: (_quantities[product['id']] ?? 0) <
                                                  product['quantite']
                                              ? () {
                                                  setState(() {
                                                    _quantities[product['id']] =
                                                        (_quantities[product['id']] ?? 0) + 1;
                                                  });
                                                }
                                              : null,
                                        ),
                                      ],
                                    ),
                                  )
                                : Text(
                                    "Indisponible",
                                    style: TextStyle(color: Colors.red),
                                  ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _placeOrder,
        label: Text(
          "Commander",
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        icon: Icon(Icons.shopping_cart),
        backgroundColor: Theme.of(context).primaryColor,
      ),
    );
  }
}