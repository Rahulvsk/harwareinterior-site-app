import React from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { COLORS } from "./src/config";

import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import OrdersScreen from "./src/screens/OrdersScreen";
import ProductsScreen from "./src/screens/ProductsScreen";

const Tab = createBottomTabNavigator();

const headerOpts = {
  headerStyle: { backgroundColor: COLORS.primary },
  headerTintColor: "#fff",
  headerTitleStyle: { fontWeight: "700" },
};

const tabIcon = (emoji) => () => <Text style={{ fontSize: 20 }}>{emoji}</Text>;

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{ ...headerOpts, tabBarActiveTintColor: COLORS.primaryDark }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarIcon: tabIcon("📊") }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ tabBarIcon: tabIcon("🧾") }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{ tabBarIcon: tabIcon("📦") }}
      />
    </Tab.Navigator>
  );
}

function Root() {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.bg }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      {admin ? <Tabs /> : <LoginScreen />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
