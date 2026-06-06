import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../config";

const LoginScreen = () => {
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Enter your email and password.");
      return;
    }
    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (e) {
      Alert.alert(
        "Login failed",
        e?.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Hello, {user.name} 👋</Text>
        <Text style={styles.muted}>{user.email}</Text>
        <TouchableOpacity style={[styles.btn, styles.logout]} onPress={logout}>
          <Text style={styles.btnTxt}>Log out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome back</Text>
      <Text style={styles.muted}>Log in to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={COLORS.muted}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={COLORS.muted}
      />
      <TouchableOpacity style={styles.btn} onPress={submit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnTxt}>Log in</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.hint}>
        Use an account created on your store website.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 24, justifyContent: "center" },
  heading: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  welcome: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  muted: { color: COLORS.muted, marginTop: 4, marginBottom: 20 },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    color: COLORS.text,
  },
  btn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  logout: { backgroundColor: COLORS.danger, marginTop: 24 },
  btnTxt: { color: "#fff", fontWeight: "700", fontSize: 16 },
  hint: { color: COLORS.muted, textAlign: "center", marginTop: 16, fontSize: 12 },
});

export default LoginScreen;
