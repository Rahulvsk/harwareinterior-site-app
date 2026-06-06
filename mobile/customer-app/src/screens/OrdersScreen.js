import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../api/services";
import { COLORS } from "../config";

const OrdersScreen = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const data = await getMyOrders();
      // Endpoint may return an array or { orders: [...] }.
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (e) {
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Log in to see your orders.</Text>
      </View>
    );
  }

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
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.orderId}>
              #{item.invoice || String(item._id).slice(-6)}
            </Text>
            <Text style={styles.status}>{item.status || "Pending"}</Text>
          </View>
          <Text style={styles.amount}>
            Total: ${Number(item.total || 0).toFixed(2)}
          </Text>
          {item.createdAt ? (
            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          ) : null}
        </View>
      )}
      ListEmptyComponent={
        <Text style={[styles.muted, { textAlign: "center", marginTop: 40 }]}>
          No orders yet.
        </Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.bg },
  muted: { color: COLORS.muted },
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
  amount: { marginTop: 8, color: COLORS.text, fontWeight: "600" },
  date: { marginTop: 4, color: COLORS.muted, fontSize: 12 },
});

export default OrdersScreen;
