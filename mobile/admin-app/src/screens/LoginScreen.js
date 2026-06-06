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
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Enter your admin email and password.");
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

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        Admin<Text style={{ color: COLORS.text }}> Panel</Text>
      </Text>
      <Text style={styles.muted}>Hardware & Interior Studio</Text>

      <TextInput
        style={styles.input}
        placeholder="Admin email"
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
          <Text style={styles.btnTxt}>Sign in</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 24, justifyContent: "center" },
  logo: { fontSize: 30, fontWeight: "800", color: COLORS.primary, textAlign: "center" },
  muted: { color: COLORS.muted, textAlign: "center", marginTop: 4, marginBottom: 28 },
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
  btnTxt: { color: "#fff", fontWeight: "700", fontSize: 16 },
});

export default LoginScreen;
