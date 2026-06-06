import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { getDashboardCount } from "../api/services";
import { COLORS } from "../config";

const Stat = ({ label, value, color }) => (
  <View style={[styles.stat, { borderLeftColor: color }]}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const DashboardScreen = () => {
  const { admin, logout } = useAuth();
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const data = await getDashboardCount();
      setCounts(data);
    } catch (e) {
      setError("Could not load dashboard. Check API URL / your login.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 16 }}
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
    >
      <Text style={styles.hello}>Hi, {admin?.name || "Admin"} 👋</Text>
      <Text style={styles.muted}>Here's your store at a glance.</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Stat label="Total Orders" value={counts?.totalOrder ?? 0} color={COLORS.primary} />
      <Stat label="Pending" value={counts?.totalPendingOrder ?? 0} color={COLORS.warn} />
      <Stat label="Processing" value={counts?.totalProcessingOrder ?? 0} color="#3b82f6" />
      <Stat label="Delivered" value={counts?.totalDeliveredOrder ?? 0} color={COLORS.primaryDark} />

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutTxt}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.bg },
  hello: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  muted: { color: COLORS.muted, marginTop: 4, marginBottom: 16 },
  error: { color: COLORS.danger, marginBottom: 12 },
  stat: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 5,
  },
  statValue: { fontSize: 28, fontWeight: "800", color: COLORS.text },
  statLabel: { color: COLORS.muted, marginTop: 2 },
  logout: {
    marginTop: 16,
    backgroundColor: COLORS.danger,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutTxt: { color: "#fff", fontWeight: "700" },
});

export default DashboardScreen;
