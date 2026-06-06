import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, localized } from "../config";

const ProductCard = ({ product, onPress, onAdd }) => {
  const img =
    Array.isArray(product.image) && product.image.length
      ? product.image[0]
      : "https://via.placeholder.com/300x300?text=No+Image";
  const price = product?.prices?.price ?? product?.prices?.originalPrice ?? 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: img }} style={styles.image} resizeMode="cover" />
      <Text numberOfLines={2} style={styles.title}>
        {localized(product.title)}
      </Text>
      <View style={styles.row}>
        <Text style={styles.price}>${Number(price).toFixed(2)}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
          <Text style={styles.addTxt}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 8,
    margin: 6,
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: { width: "100%", height: 130, borderRadius: 8, backgroundColor: COLORS.bg },
  title: { marginTop: 8, fontSize: 13, fontWeight: "600", color: COLORS.text, minHeight: 34 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 },
  price: { fontSize: 15, fontWeight: "700", color: COLORS.primaryDark },
  addBtn: {
    backgroundColor: COLORS.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  addTxt: { color: "#fff", fontSize: 20, lineHeight: 22, fontWeight: "700" },
});

export default ProductCard;
