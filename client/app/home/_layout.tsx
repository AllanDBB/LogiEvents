import React from "react";
import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import Navbar from "@/components/Navbar";

export default function HomeLayout() {
  return (
    <View style={styles.container}>
      <Navbar isLogged={true} onEventClick={() => {}} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="events" options={{ title: "Events" }} />
        <Stack.Screen name="events/[eventId]" options={{ title: "Event Details" }} />
        <Stack.Screen name="profile" options={{ title: "Profile" }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});