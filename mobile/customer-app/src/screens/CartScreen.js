import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { placeOrder } from "../api/services";
import { COLORS } from "../config";

const CartScreen = ({ navigation }) => {
  const { items, changeQty, removeFromCart, total, clearCart } = useCart();
  const { user } = useAuth();

  const checkout = async () => {
    if (!user) {
      Alert.alert("Please log in", "You need an account to place an order.", [
        { text: "Cancel" },
        { text: "Log in", onPress: () => navigation.navigate("AccountTab") },
      ]);
      return;
    }
    try {
      const payload = {
        cart: items.map((i) => ({
          id: i._id,
          title: i.title,
          price: i.price,
          quantity: i.qty,
        })),
        user_info: { name: user.name, email: user.email },
        subTotal: total,
        total,
        paymentMethod: "Cash",
      };
      await placeOrder(payload);
      clearCart();
      Alert.alert("Order placed", "Thank you! Your order has been received.");
      navigation.navigate("OrdersTab");
    } catch (e) {
      Alert.alert(
        "Order failed",
        e?.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  if (!items.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Your cart is empty.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(i) => String(i._id)}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image
              source={{
                uri: item.image || "https://via.placeholder.com/80?text=No",
              }}
              style={styles.thumb}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text numberOfLines={2} style={styles.title}>
                {item.title}
              </Text>
              <Text style={styles.price}>
                ${Number(item.price).toFixed(2)}
              </Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => changeQty(item._id, -1)}
                >
                  <Text style={styles.qtyTxt}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qty}>{item.qty}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => changeQty(item._id, 1)}
                >
                  <Text style={styles.qtyTxt}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.remove}
                  onPress={() => removeFromCart(item._id)}
                >
                  <Text style={styles.removeTxt}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.cta} onPress={checkout}>
          <Text style={styles.ctaTxt}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.bg },
  empty: { color: COLORS.muted, fontSize: 16 },
  row: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thumb: { width: 70, height: 70, borderRadius: 8, backgroundColor: COLORS.bg },
  title: { fontWeight: "600", color: COLORS.text },
  price: { color: COLORS.primaryDark, fontWeight: "700", marginTop: 2 },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyTxt: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  qty: { marginHorizontal: 12, fontWeight: "700", color: COLORS.text },
  remove: { marginLeft: "auto" },
  removeTxt: { color: COLORS.danger, fontWeight: "600" },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: 16,
    backgroundColor: COLORS.card,
  },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  totalLabel: { fontSize: 16, color: COLORS.muted },
  totalValue: { fontSize: 20, fontWeight: "800", color: COLORS.text },
  cta: { backgroundColor: COLORS.primary, paddingVertical: 15, borderRadius: 12, alignItems: "center" },
  ctaTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

export default CartScreen;
