import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  useWindowDimensions, 
  ActivityIndicator,
  FlatList,
  Platform
} from "react-native";
import { useRouter } from "expo-router";
import ProfileCard from "@/components/ProfileCard";
import EventCategoryTabs from "@/components/EventCategoryTabs";
import SearchBar from "@/components/SearchBar";
import EventCard from "@/components/EventCard";
import MainPageContainer from "@/components/MainPageContainer";
import type { EventCategory, Event } from "@/models/event";
import type { userRole } from "@/models/user";
import { useEvents } from "@/hooks/useEvents"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  
  const [userRole, setUserRole] = useState<userRole>("user");
  const [isMobile, setIsMobile] = useState(false);
  const [numColumns, setNumColumns] = useState(2);
  const [isCompactView, setIsCompactView] = useState(false);
  const [key, setKey] = useState(0);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [user, setUser ] = useState<any>(null);

  const {
    filteredEvents,
    loading,
    error,
    selectedCategory,
    searchQuery,
    changeCategory,
    searchEvents,
    loadUserEvents,
    loadAvailableEvents,
    getCategories,
    setSearchQuery
  } = useEvents("Ocio");

  const checkTokenAndLoadUser  = async () => {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      router.push('/auth/login');
      return; 
    }

    const userData = await AsyncStorage.getItem('user');

    if (!userData) {
      router.push('/auth/login');
      return; 
    }

    const user = JSON.parse(userData);
    setUser (user);
    setUserRole(user.role);
  };

  // useFocusEffect to check token and load user every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      checkTokenAndLoadUser ();
    }, [])
  );

  useEffect(() => {
    const screenWidth = 
      Platform.OS === 'web' && typeof window !== 'undefined' 
        ? Math.min(width, window.innerWidth) 
        : width;
    
    const isMobileView = screenWidth < 768;
    setIsMobile(isMobileView);
    
    if (screenWidth > 1400) setNumColumns(6);
    else if (screenWidth > 1100) setNumColumns(4);
    else if (screenWidth > 850) setNumColumns(3);
    else setNumColumns(2);
    
    setIsCompactView(screenWidth < 600);
    
    if (Platform.OS === 'web') {
      setKey(prevKey => prevKey + 1);
    }
  }, [width]);
  
  useEffect(() => {
    const isAdmin = user?.role === "admin";
    setUserRole(isAdmin ? "admin" : "user");
    
    if (isAdmin) loadUserEvents();
    else loadAvailableEvents();
  }, [user, loadUserEvents, loadAvailableEvents]);
  
  useEffect(() => {
    try {
      const uniqueCategories = getCategories();
      setCategories(uniqueCategories as EventCategory[]);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  }, [getCategories]);

  const handleEventPress = (event: Event) => {

    if (userRole === "admin") {
      router.push(`/home/events/editEvent/${event._id}`);
    } else {
      router.push(`/home/events/${event._id}`);
    }
  };

  const handleCreateEvent = () => {
    router.push("/home/events/createEvent");
  };

  const handleViewStats = () => {
    router.push("/home/events/stats");
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    searchEvents(text);
  };

  const handleCategoryChange = (category: EventCategory) => {
    changeCategory(category);
  };

  const handleRetry = () => {
 if (userRole === "admin") loadUserEvents();
    else loadAvailableEvents();
  };

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

  const renderHeader = () => (
    isMobile ? (
      <View>
        <View style={styles.header}>
          <ProfileCard 
            name={user ? `${user.firstName} ${user.lastName}`.toUpperCase() : ""}
            role={user ? user.role : ""}
            avatar={user?.profileImage}
            profileStyles={profileStyles} 
          />
        </View>
        
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
      <View style={styles.header}>
        <ProfileCard 
          name={user ? `${user.firstName} ${user.lastName}`.toUpperCase() : ""}
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
    )
  );

  const renderEventsList = () => (
    <View style={styles.eventsContainer}>
      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="small" color="#D9D9D9" />
      ) : filteredEvents.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {userRole === "admin" ? 
              "No hay eventos para mostrar" : 
              "No hay eventos en esta categoría"}
          </Text>
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
  );

  if (loading && filteredEvents.length === 0) {
    return (
      <MainPageContainer showNavbar={false} showFooter={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D9D9D9" />
          <Text style={styles.loadingText}>Cargando eventos...</Text>
        </View>
      </MainPageContainer>
    );
  }

  if (error && filteredEvents.length === 0) {
    return (
      <MainPageContainer showNavbar={false} showFooter={false}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleRetry}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </MainPageContainer>
    );
  }

  if (userRole === "admin") {
    return (
      <MainPageContainer>
        <View style={styles.contentContainer}>
          {renderHeader()}

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

          {renderEventsList()}
        </View>
      </MainPageContainer>
    );
  }

  return (
    <MainPageContainer>
      <View style={styles.contentContainer}>
        {renderHeader()}

        <View style={styles.tabsWrapper}>
          <EventCategoryTabs
            categories={categories}
            selectedCategory={selectedCategory || "Ocio"}
            onSelectCategory={handleCategoryChange}
          />
        </View>

        <View style={styles.eventsContainer}>
          <Text style={styles.categoryTitle}>{selectedCategory}</Text>
          {renderEventsList()}
        </View>
      </View>
    </MainPageContainer>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 8,
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
  tabsWrapper: {
    marginBottom: 12,
    width: "100%",
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
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    marginLeft: 4,
    marginTop: 10,
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
    flex: 1,
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
    flexWrap: "wrap",
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

export default HomeScreen;