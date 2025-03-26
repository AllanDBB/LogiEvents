import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, ScrollView, useWindowDimensions, ActivityIndicator } from "react-native";
import { RelativePathString, useRouter } from "expo-router";
import ProfileCard from "@/components/ProfileCard";
import EventCategoryTabs from "@/components/EventCategoryTabs";
import SearchBar from "@/components/SearchBar";
import EventList from "@/components/EventList";
import type { EventCategory, Event } from "@/models/event";
import type { userRole } from "@/models/user";
import { useEvents } from "@/hooks/useEvents"; 

function HomeScreen() {
  const router = useRouter();
  //TODO: Implement userRole state
  const [userRole] = useState<userRole>("user"); 
  const { width } = useWindowDimensions();
  const [isMobile, setIsMobile] = useState(false);
  
  const {
    filteredEvents,
    loading,
    error,
    selectedCategory,
    searchQuery,
    changeCategory,
    searchEvents,
    loadUserEvents,
    loadAdminEvents,
    getCategories,
    setSearchQuery
  } = useEvents("Ocio"); 
  
  const [categories, setCategories] = useState<EventCategory[]>([]);
  
  useEffect(() => {
    if (userRole === "admin") {
      loadAdminEvents();
    } else {
      loadUserEvents();
    }
  }, [userRole, loadUserEvents, loadAdminEvents]);
  
  useEffect(() => {
    const fetchCategories = () => {
      try {
        const uniqueCategories = getCategories();
        setCategories(uniqueCategories as EventCategory[]);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      }
    };
    
    fetchCategories();
  }, [getCategories]);
  
  useEffect(() => {
    setIsMobile(width < 768);
  }, [width]);

  const handleEventPress = (event: Event) => {
    router.push(`/home/events/${event.id}`);
  };

  const handleCreateEvent = () => {
    router.push("/home/events/create");
  };

  const handleViewStats = () => {
    router.push("/home/stats" as RelativePathString);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    searchEvents(text);
  };

  const handleCategoryChange = (category: EventCategory) => {
    changeCategory(category);
  };

  if (loading && !filteredEvents.length) {
    return (
      <SafeAreaView style={[styles.container, !isMobile && styles.webContainer]}>
        <View style={styles.contentContainer}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D9D9D9" />
            <Text style={styles.loadingText}>Cargando eventos...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !filteredEvents.length) {
    return (
      <SafeAreaView style={[styles.container, !isMobile && styles.webContainer]}>
        <View style={styles.contentContainer}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={userRole === "admin" ? loadAdminEvents : loadUserEvents}
            >
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Admin view
  if (userRole === "admin") {
    return (
      <SafeAreaView style={[styles.container, !isMobile && styles.webContainer]}>
        <View style={styles.contentContainer}>
          {isMobile ? (
            // Mobile
            <View>
              <View style={styles.header}>
                <ProfileCard 
                  name="Nombre Apellido Apellido" 
                  role="2024099161" 
                  profileStyles={profileStyles} 
                />
              </View>
              
              <View style={styles.searchWrapperMobile}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={handleSearch}
                  placeholder="Buscar"
                  searchStyles={isMobile ? searchStylesMobile : searchStyles}
                />
              </View>
            </View>
          ) : (
            // Desktop
            <View style={styles.header}>
              <ProfileCard 
                name="Nombre Apellido Apellido" 
                role="2024099161" 
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

          <View style={styles.tabsWrapper}>
            <Text style={styles.categoryTitle}>Mis eventos</Text>
          </View>

          <View style={styles.adminActions}>
            <TouchableOpacity style={styles.adminButton} onPress={handleCreateEvent}>
              <Text style={styles.adminButtonText}>Crear evento</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.adminButton} onPress={handleViewStats}>
              <Text style={styles.adminButtonText}>Ver estadísticas</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.eventsContainer} showsVerticalScrollIndicator={false}>
            {loading && (
              <ActivityIndicator style={styles.loadingIndicator} size="small" color="#D9D9D9" />
            )}
            
            {filteredEvents.length === 0 && !loading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No hay eventos para mostrar</Text>
              </View>
            ) : (
              <EventList events={filteredEvents} onEventPress={handleEventPress} />
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  // User view
  return (
    <SafeAreaView style={[styles.container, !isMobile && styles.webContainer]}>
      <View style={styles.contentContainer}>
        {isMobile ? (
          // Mobile 
          <View>
            <View style={styles.header}>
              <ProfileCard 
                name="Nombre Apellido Apellido" 
                role="2024099161" 
                profileStyles={profileStyles} 
              />
            </View>
            
            <View style={styles.searchWrapperMobile}>
              <SearchBar
                value={searchQuery}
                onChangeText={handleSearch}
                placeholder="Buscar"
                searchStyles={isMobile ? searchStylesMobile : searchStyles}
              />
            </View>
          </View>
        ) : (
          // Desktop 
          <View style={styles.header}>
            <ProfileCard 
              name="Nombre Apellido Apellido" 
              role="2024099161" 
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

        <View style={styles.tabsWrapper}>
          <EventCategoryTabs
            categories={categories}
            selectedCategory={selectedCategory || "Ocio"}
            onSelectCategory={handleCategoryChange}
          />
        </View>

        <ScrollView style={styles.eventsContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.categoryTitle}>{selectedCategory}</Text>
          
          {loading && (
            <ActivityIndicator style={styles.loadingIndicator} size="small" color="#D9D9D9" />
          )}
          
          {filteredEvents.length === 0 && !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No hay eventos en esta categoría</Text>
            </View>
          ) : (
            <EventList events={filteredEvents} onEventPress={handleEventPress} />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  webContainer: {
    paddingHorizontal: '5%',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 8,
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
  tabsWrapper: {
    marginBottom: 12,
  },
  eventsContainer: {
    flex: 1,
    marginTop: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    marginLeft: 4,
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 20,
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#dc3545",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#D9D9D9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#000",
    fontWeight: "600",
  },
  emptyState: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
  },
  adminActions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 16,
    gap: 12,
  },
  adminButton: {
    backgroundColor: "#D9D9D9",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 100,
  },
  adminButtonText: {
    color: "#000",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 12,
  },
});

const profileStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    marginLeft: 20,
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
    marginRight: 20,
    paddingRight: 100,
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

export default HomeScreen;