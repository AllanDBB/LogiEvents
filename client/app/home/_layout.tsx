import React from "react";
import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";

export default function HomeLayout() {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="events/[eventId]" options={{ title: "Event Details" }} />
        <Stack.Screen name="profile" options={{ title: "Profile" }} />
        <Stack.Screen name="events/myEvents" options={{ title: "My Events" }} />
        <Stack.Screen name="events/editEvent/[eventId]" options={{ title: "Edit Event" }} />
        <Stack.Screen name="events/detailsEvent/[eventId]" options={{ title: "Edit Event" }} />
        <Stack.Screen name="events/createEvent" options={{ title: "Create Event" }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});