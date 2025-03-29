import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Event } from "../models/event";

interface EventCardProps {
  event: Event;
  onPress?: (event: Event) => void;
  compact?: boolean;
}

function EventCard({ event, onPress, compact = false }: EventCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress(event);
    }
  };

  const defaultImage = { uri: "https://www.kasandbox.org/programming-images/avatars/leaf-blue.png" };
  
  const containerStyle = compact ? styles.compactContainer : styles.container;
  const contentStyle = compact ? styles.compactCardContent : styles.cardContent;
  const imageStyle = compact ? styles.compactImage : styles.image;
  const titleStyle = compact ? styles.compactTitle : styles.title;
  
  return (
    <TouchableOpacity 
      style={containerStyle} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={contentStyle}>
        
        {(event.date || event.time) && (
          <View style={styles.dateTimeContainer}>
            {event.date && (
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={compact ? 12 : 14} color="#6c757d" />
                <Text style={compact ? styles.compactDateText : styles.dateText}>{event.date}</Text>
              </View>
            )}
            {event.time && (
              <View style={styles.timeRow}>
                <Ionicons name="time-outline" size={compact ? 12 : 14} color="#6c757d" />
                <Text style={compact ? styles.compactTimeText : styles.timeText}>{event.time}</Text>
              </View>
            )}
          </View>
        )}
        
        <Image
          source={{ uri: event.image || defaultImage.uri }}
          style={imageStyle}
          defaultSource={defaultImage}
        />
        
        <View style={styles.infoContainer}>
          <Text style={titleStyle} numberOfLines={1}>
            {event.title}
          </Text>
          
          {event.location && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={compact ? 12 : 14} color="#6c757d" />
              <Text 
                style={compact ? styles.compactLocationText : styles.locationText} 
                numberOfLines={1}
              >
                {event.location}
              </Text>
            </View>
          )}
          
          {event.availableSpots !== undefined && (
            <Text style={compact ? styles.compactAvailableSpotsText : styles.availableSpotsText}>
              ¡Quedan solo {event.availableSpots} espacios disponibles!
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D9D9D9", 
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    width: "100%",
    maxWidth: 200,
    height: 300,
    marginRight: 16,
    alignSelf: "stretch",
  },
  cardContent: {
    padding: 10,
    flex: 1,
    width: "100%",
  },
  dateTimeContainer: {
    marginBottom: 8,
    width: "100%",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    color: "#333",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  timeText: {
    color: "#333",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  image: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
    borderRadius: 8,
  },
  infoContainer: {
    marginTop: 10,
    paddingHorizontal: 5,
    width: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
    color: "#333",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  locationText: {
    fontSize: 14,
    marginLeft: 4,
    color: "#333",
    flex: 1,
  },
  availableSpotsText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
    color: "#333",
  },
  
  compactContainer: {
    backgroundColor: "#D9D9D9", 
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    width: "100%",
    height: 250,
    alignSelf: "stretch",
  },
  compactCardContent: {
    padding: 8,
    flex: 1,
    width: "100%",
  },
  compactDateText: {
    color: "#333",
    fontSize: 10,
    fontWeight: "500",
    marginLeft: 3,
  },
  compactTimeText: {
    color: "#333",
    fontSize: 10,
    fontWeight: "500",
    marginLeft: 3,
  },
  compactImage: {
    width: "100%",
    height: 110,
    resizeMode: "cover",
    borderRadius: 6,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
    color: "#333",
  },
  compactLocationText: {
    fontSize: 12,
    marginLeft: 3,
    color: "#333",
    flex: 1,
  },
  compactAvailableSpotsText: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: 3,
    color: "#333",
  }
});

export default EventCard;