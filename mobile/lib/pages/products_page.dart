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
        .where((entry) => entry.value > 0)
        .map((entry) => {"id": entry.key, "quantite": entry.value})
        .toList();

    if (orderItems.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Veuillez sélectionner au moins un produit.")),
      );
      return;
    }

    try {
      await ApiService.createReservation(
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
      appBar: AppBar(title: Text("Produits")),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _errorMessage != null
              ? Center(child: Text(_errorMessage!))
              : ListView.builder(
                  itemCount: _products.length,
                  itemBuilder: (context, index) {
                    final product = _products[index];
                    final productId = product['id'];
                    return Card(
                      margin: EdgeInsets.all(8.0),
                      child: ListTile(
                        title: Text(product['nom']),
                        subtitle: Text("Prix : ${product['prix']} €"),
                        trailing: SizedBox(
                          width: 120,
                          child: Row(
                            children: [
                              IconButton(
                                icon: Icon(Icons.remove),
                                onPressed: () {
                                  setState(() {
                                    _quantities[productId] =
                                        (_quantities[productId] ?? 0) - 1;
                                    if (_quantities[productId]! < 0) {
                                      _quantities[productId] = 0;
                                    }
                                  });
                                },
                              ),
                              Text(
                                "${_quantities[productId] ?? 0}",
                                style: TextStyle(fontSize: 16),
                              ),
                              IconButton(
                                icon: Icon(Icons.add),
                                onPressed: () {
                                  setState(() {
                                    _quantities[productId] =
                                        (_quantities[productId] ?? 0) + 1;
                                  });
                                },
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _placeOrder,
        label: Text("Commander"),
        icon: Icon(Icons.shopping_cart),
      ),
    );
  }
}