import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  FlatList,
  Platform
} from "react-native";
import { useRouter } from "expo-router";
import ProfileCard from "@/components/ProfileCard";
import SearchBar from "@/components/SearchBar";
import EventCard from "@/components/EventCard";
import ScrollbarStyles from "@/components/ScrollbarStyles";
import { useUser } from "@/hooks/useUser";
import { useEvents } from "@/hooks/useEvents";
import type { Event } from "@/models/event";
import { Ionicons } from "@expo/vector-icons";

export default function MyEventsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [isMobile, setIsMobile] = useState(false);
  const [numColumns, setNumColumns] = useState(2);
  const [isCompactView, setIsCompactView] = useState(false);
  const [key, setKey] = useState(0);
  
  const { user } = useUser();
  const {
    filteredEvents,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    searchEvents,
    loadAvailableEvents
  } = useEvents();

  useEffect(() => {
    loadAvailableEvents();
  }, [loadAvailableEvents]);

  // Responsive layout setup with improved web detection
  useEffect(() => {
    // Use both current width and innerWidth for web browsers
    const screenWidth = 
      Platform.OS === 'web' && typeof window !== 'undefined' 
        ? Math.min(width, window.innerWidth) 
        : width;
    
    const isMobileView = screenWidth < 768;
    setIsMobile(isMobileView);
    
    // Set columns based on actual screen width
    if (screenWidth > 1400) setNumColumns(6);
    else if (screenWidth > 1100) setNumColumns(4);
    else if (screenWidth > 850) setNumColumns(3);
    else  setNumColumns(2);
    
    // Set compact view based on real width
    setIsCompactView(screenWidth < 600);
    
    // Force layout update when width changes
    if (Platform.OS === 'web') {
      setKey(prevKey => prevKey + 1);
    }
  }, [width]);

  const handleEventPress = (event: Event) => {
    router.push(`/home/events/${event.id}`);
  };

  const handleExploreEvents = () => {
    router.replace("/home");
  };
  
  const handleBack = () => {
    router.back();
  };
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    searchEvents(text);
  };

  // Render events in grid - improved for web
  const renderEventItem = ({ item }: { item: Event }) => (
    <View 
      style={{
        width: `${100 / numColumns}%`,
        padding: 8,
        alignItems: "stretch",
        flex: 1,
        flexDirection: "column",
        maxWidth: `${100 / numColumns}%`,
      }}
    >
      <EventCard 
        event={item} 
        onPress={() => handleEventPress(item)}
        compact={isCompactView}
      />
    </View>
  );

  if (loading && filteredEvents.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollbarStyles />
        <View style={styles.contentContainer}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D9D9D9" />
            <Text style={styles.loadingText}>Cargando mis eventos...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollbarStyles />
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        {isMobile ? (
          <View style={styles.headerMobile}>
            <ProfileCard
              name={user ? `${user.name} ${user.lastname}`.toUpperCase() : ""}
              role={user ? user.role : ""}
              avatar={user?.profileImage}
              profileStyles={profileStyles}
            />
            <View style={styles.searchWrapperMobile}>
              <SearchBar
                value={searchQuery}
                onChangeText={handleSearch}
                placeholder="Buscar"
                searchStyles={searchStylesMobile}
              />
            </View>
          </View>
        ) : (
          <View style={styles.headerDesktop}>
            <ProfileCard
              name={user ? `${user.name} ${user.lastname}`.toUpperCase() : ""}
              role={user ? user.role : ""}
              avatar={user?.profileImage}
              profileStyles={profileStyles}
            />
            <View style={styles.searchWrapper}>
              <SearchBar
                value={searchQuery}
                onChangeText={handleSearch}
                placeholder="Buscar"
                searchStyles={searchStyles}
              />
            </View>
          </View>
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Mis eventos</Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={handleExploreEvents}
          >
            <Text style={styles.exploreButtonText}>¡Descubre más eventos!</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.eventsContainer}>
          {loading ? (
            <ActivityIndicator style={styles.loadingIndicator} size="small" color="#D9D9D9" />
          ) : filteredEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No tienes eventos guardados</Text>
              <TouchableOpacity
                style={styles.exploreButtonLarge}
                onPress={handleExploreEvents}
              >
                <Text style={styles.exploreButtonText}>Explorar eventos</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.scrollContainer}>
              <FlatList
                data={filteredEvents}
                renderItem={renderEventItem}
                keyExtractor={(item) => item.id}
                numColumns={numColumns}
                key={`grid-${numColumns}-${key}`}
                contentContainerStyle={{
                  paddingBottom: 20,
                  paddingHorizontal: 0,
                  width: '100%',
                  alignSelf: 'stretch',
                }}
                showsVerticalScrollIndicator={true}
                indicatorStyle="black"
                scrollIndicatorInsets={{ right: 1 }}
                removeClippedSubviews={true}
                maxToRenderPerBatch={12}
                windowSize={10}
                initialNumToRender={numColumns * 2}
                columnWrapperStyle={numColumns > 1 ? {
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                  alignItems: 'stretch',
                  width: '100%',
                } : undefined}
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  backButton: {
    padding: 8,
    marginLeft: 16,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  headerMobile: {
    marginBottom: 16,
  },
  headerDesktop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  searchWrapper: {
    flex: 1,
    maxWidth: 500,
    marginLeft: 16,
  },
  searchWrapperMobile: {
    width: "100%",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
  },
  exploreButton: {
    backgroundColor: "#D9D9D9",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  exploreButtonLarge: {
    backgroundColor: "#D9D9D9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 16,
  },
  exploreButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 12,
    textAlign: "center",
  },
  eventsContainer: {
    flex: 1,
    width: "100%",
  },
  scrollContainer: {
    flex: 1,
    position: 'relative',
    width: '100%',
  },
  gridContainer: {
    paddingBottom: 20,
    paddingHorizontal: 0,
    width: '100%',
    alignSelf: 'stretch',
  },
  columnWrapper: {
    justifyContent: "flex-start",
    marginBottom: 2,
    flexWrap: 'wrap',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6c757d",
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  emptyState: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 16,
  },
});

const profileStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  initials: {
    color: "#212529",
    fontSize: 18,
    fontWeight: "600",
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212529",
  },
  role: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6c757d",
  },
});

const searchStyles = StyleSheet.create({
  container: {
    backgroundColor: "#D9D9D9",
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    height: 36,
    fontSize: 14,
    color: "#212529",
    flex: 1,
    marginLeft: 10,
  },
  iconContainer: {
    paddingRight: 12,
  },
});

const searchStylesMobile = StyleSheet.create({
  container: {
    backgroundColor: "#D9D9D9",
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    height: 36,
    fontSize: 14,
    color: "#212529",
    flex: 1,
    marginLeft: 10,
  },
  iconContainer: {
    paddingRight: 12,
  },
});