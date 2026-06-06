import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Text,
  RefreshControl,
} from "react-native";
import ProductCard from "../components/ProductCard";
import { getStoreProducts, searchProducts } from "../api/services";
import { useCart } from "../context/CartContext";
import { COLORS, localized } from "../config";

const HomeScreen = ({ navigation }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const data = await getStoreProducts();
      // Use popularProducts for the feed; fall back to products array.
      const list =
        (data.popularProducts && data.popularProducts.length
          ? data.popularProducts
          : data.products) || [];
      setProducts(list);
    } catch (e) {
      setError("Could not load products. Check your API URL in src/config.js.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onSearch = async (text) => {
    setQuery(text);
    if (!text) return load();
    try {
      const data = await searchProducts(text);
      setProducts(data.products || []);
    } catch (e) {
      // keep current list
    }
  };

  const toCart = (p) =>
    addToCart({
      _id: p._id,
      title: localized(p.title),
      price: p?.prices?.price ?? 0,
      image: Array.isArray(p.image) ? p.image[0] : null,
    });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search products..."
        value={query}
        onChangeText={onSearch}
        placeholderTextColor={COLORS.muted}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={products}
        keyExtractor={(item) => String(item._id)}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            colors={[COLORS.primary]}
          />
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate("ProductDetail", { product: item })}
            onAdd={() => toCart(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No products found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 6, paddingTop: 8 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.bg },
  search: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    margin: 6,
    color: COLORS.text,
  },
  error: { color: COLORS.danger, paddingHorizontal: 10, paddingBottom: 6 },
  empty: { textAlign: "center", color: COLORS.muted, marginTop: 40 },
});

export default HomeScreen;
