import React from "react";
import { Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider, useCart } from "./src/context/CartContext";
import { COLORS } from "./src/config";

import HomeScreen from "./src/screens/HomeScreen";
import ProductDetailScreen from "./src/screens/ProductDetailScreen";
import CartScreen from "./src/screens/CartScreen";
import LoginScreen from "./src/screens/LoginScreen";
import OrdersScreen from "./src/screens/OrdersScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const headerOpts = {
  headerStyle: { backgroundColor: COLORS.primary },
  headerTintColor: "#fff",
  headerTitleStyle: { fontWeight: "700" },
};

// Home stack so we can push the Product Detail screen.
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={headerOpts}>
      <Stack.Screen
        name="Shop"
        component={HomeScreen}
        options={{ title: "Hardware & Interior" }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: "Details" }}
      />
    </Stack.Navigator>
  );
}

// Simple emoji tab icon (no extra icon lib needed for the scaffold).
const tabIcon = (emoji) => () => <Text style={{ fontSize: 20 }}>{emoji}</Text>;

function CartLabel() {
  const { count } = useCart();
  return (
    <Text style={{ fontSize: 12 }}>{count ? `Cart (${count})` : "Cart"}</Text>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        ...headerOpts,
        tabBarActiveTintColor: COLORS.primaryDark,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ headerShown: false, title: "Home", tabBarIcon: tabIcon("🏠") }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          title: "Cart",
          tabBarIcon: tabIcon("🛒"),
          tabBarLabel: () => <CartLabel />,
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersScreen}
        options={{ title: "My Orders", tabBarIcon: tabIcon("📦") }}
      />
      <Tab.Screen
        name="AccountTab"
        component={LoginScreen}
        options={{ title: "Account", tabBarIcon: tabIcon("👤") }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <Tabs />
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
