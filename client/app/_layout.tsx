import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import ChatBotButton from "@/components/ChatBotButton";

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Welcome" }} />
        <Stack.Screen name="home" options={{ title: "Home" }} />
        <Stack.Screen name="auth/login" options={{ title: "Login" }} />
        <Stack.Screen name="auth/register" options={{ title: "Register" }} />
      </Stack>
      <ChatBotButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});