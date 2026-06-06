import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useCart } from "../context/CartContext";
import { COLORS, localized } from "../config";

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart } = useCart();

  const img =
    Array.isArray(product.image) && product.image.length
      ? product.image[0]
      : "https://via.placeholder.com/600x600?text=No+Image";
  const price = product?.prices?.price ?? product?.prices?.originalPrice ?? 0;
  const original = product?.prices?.originalPrice;

  const handleAdd = () => {
    addToCart({
      _id: product._id,
      title: localized(product.title),
      price,
      image: Array.isArray(product.image) ? product.image[0] : null,
    });
    navigation.navigate("CartTab");
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={{ uri: img }} style={styles.image} resizeMode="cover" />
        <View style={styles.body}>
          <Text style={styles.title}>{localized(product.title)}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${Number(price).toFixed(2)}</Text>
            {original && original > price ? (
              <Text style={styles.original}>${Number(original).toFixed(2)}</Text>
            ) : null}
          </View>
          {product.stock != null ? (
            <Text style={styles.stock}>
              {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
            </Text>
          ) : null}
          <Text style={styles.descHeading}>Description</Text>
          <Text style={styles.desc}>
            {localized(product.description) || "No description available."}
          </Text>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.cta} onPress={handleAdd}>
        <Text style={styles.ctaTxt}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  image: { width: "100%", height: 320, backgroundColor: COLORS.card },
  body: { padding: 16 },
  title: { fontSize: 20, fontWeight: "700", color: COLORS.text },
  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  price: { fontSize: 22, fontWeight: "800", color: COLORS.primaryDark },
  original: {
    fontSize: 16,
    color: COLORS.muted,
    textDecorationLine: "line-through",
    marginLeft: 10,
  },
  stock: { marginTop: 8, color: COLORS.muted },
  descHeading: { marginTop: 18, fontSize: 16, fontWeight: "700", color: COLORS.text },
  desc: { marginTop: 6, color: COLORS.muted, lineHeight: 20 },
  cta: {
    backgroundColor: COLORS.primary,
    margin: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

export default ProductDetailScreen;
