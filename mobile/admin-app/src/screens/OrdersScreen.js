import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getAllOrders, updateOrderStatus } from "../api/services";
import { COLORS } from "../config";

const STATUSES = ["Pending", "Processing", "Delivered", "Cancel"];

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getAllOrders();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (e) {
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = (order) => {
    Alert.alert(
      "Update status",
      `Order #${order.invoice || String(order._id).slice(-6)}`,
      [
        ...STATUSES.map((s) => ({
          text: s,
          onPress: async () => {
            try {
              await updateOrderStatus(order._id, s);
              load();
            } catch (e) {
              Alert.alert("Failed", e?.response?.data?.message || "Try again.");
            }
          },
        })),
        { text: "Cancel", style: "cancel" },
      ]
    );
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
      data={orders}
      keyExtractor={(o) => String(o._id)}
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
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => changeStatus(item)}>
          <View style={styles.rowBetween}>
            <Text style={styles.orderId}>
              #{item.invoice || String(item._id).slice(-6)}
            </Text>
            <Text style={styles.status}>{item.status || "Pending"}</Text>
          </View>
          <Text style={styles.name}>
            {item?.user_info?.name || item?.user_info?.email || "Customer"}
          </Text>
          <Text style={styles.amount}>
            ${Number(item.total || 0).toFixed(2)} · {item.paymentMethod || "—"}
          </Text>
          <Text style={styles.tap}>Tap to change status</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <Text style={styles.empty}>No orders found.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.bg },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderId: { fontWeight: "700", color: COLORS.text },
  status: {
    color: COLORS.primaryDark,
    fontWeight: "700",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 12,
  },
  name: { marginTop: 8, color: COLORS.text },
  amount: { marginTop: 4, color: COLORS.muted },
  tap: { marginTop: 8, color: COLORS.primary, fontSize: 12, fontWeight: "600" },
  empty: { textAlign: "center", color: COLORS.muted, marginTop: 40 },
});

export default OrdersScreen;
