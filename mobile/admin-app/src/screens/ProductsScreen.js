import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getAllProducts, updateProductStatus } from "../api/services";
import { COLORS, localized } from "../config";

const ProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getAllProducts();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (e) {
      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleStatus = (item) => {
    const next = item.status === "show" ? "hide" : "show";
    Alert.alert("Change visibility", `Set "${localized(item.title)}" to ${next}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: async () => {
          try {
            await updateProductStatus(item._id, next);
            load();
          } catch (e) {
            Alert.alert("Failed", e?.response?.data?.message || "Try again.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: COLORS.bg }}
      data={products}
      keyExtractor={(p) => String(p._id)}
      contentContainerStyle={{ padding: 12 }}
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
      renderItem={({ item }) => {
        const img = Array.isArray(item.image) && item.image.length ? item.image[0] : null;
        const price = item?.prices?.price ?? 0;
        return (
          <View style={styles.card}>
            <Image
              source={{ uri: img || "https://via.placeholder.com/64?text=No" }}
              style={styles.thumb}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text numberOfLines={1} style={styles.title}>
                {localized(item.title)}
              </Text>
              <Text style={styles.meta}>
                ${Number(price).toFixed(2)} · Stock: {item.stock ?? 0}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.badge,
                { backgroundColor: item.status === "show" ? "#ecfdf5" : "#fef2f2" },
              ]}
              onPress={() => toggleStatus(item)}
            >
              <Text
                style={{
                  color: item.status === "show" ? COLORS.primaryDark : COLORS.danger,
                  fontWeight: "700",
                  fontSize: 12,
                }}
              >
                {item.status === "show" ? "Shown" : "Hidden"}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }}
      ListEmptyComponent={<Text style={styles.empty}>No products found.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.bg },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thumb: { width: 56, height: 56, borderRadius: 8, backgroundColor: COLORS.bg },
  title: { fontWeight: "600", color: COLORS.text },
  meta: { color: COLORS.muted, marginTop: 4, fontSize: 13 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  empty: { textAlign: "center", color: COLORS.muted, marginTop: 40 },
});

export default ProductsScreen;
