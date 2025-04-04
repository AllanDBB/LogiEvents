import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEventById } from '@/services/api';
import MainPageContainer from '@/components/MainPageContainer';

const EventDetails = () => {
  const { eventId } = useLocalSearchParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!eventId) {
          setError('No se recibió ID de evento');
          return;
        }

        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setError('No se encontró un token de autenticación');
          return;
        }

        const eventData = await getEventById(eventId, token);
        setEvent(eventData);
      } catch (err) {
        console.error('Error al cargar el evento:', err);
        setError('Error al cargar el evento. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const handleReservation = () => {
    router.push(`/home/events/reservation/${eventId}`);
  };

  const handleBack = () => {
    router.back();
  };

  const compareDates = (dateString, timeString) => {
    if (!dateString || !timeString) return "";
    
    const [day, month, year] = dateString.split('/');
    const [hours, minutes] = timeString.split(':');
    
    const providedDate = new Date(year, month - 1, day, hours, minutes);
    const currentDate = new Date();
    
    if (currentDate > providedDate) {
      return "¡Evento finalizado!";
    } else if (currentDate < providedDate) {
      return "¡Evento activo!";
    } else {
      return "¡Evento en curso!";
    }
  };

  if (loading) {
    return (
      <MainPageContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E74C3C" />
          <Text style={styles.loadingText}>Cargando detalles del evento...</Text>
        </View>
      </MainPageContainer>
    );
  }

  if (error) {
    return (
      <MainPageContainer>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={48} color="#E74C3C" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.errorBackButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorBackButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </MainPageContainer>
    );
  }

  if (!event) {
    return (
      <MainPageContainer>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se encontró información del evento</Text>
          <TouchableOpacity 
            style={styles.errorBackButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorBackButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </MainPageContainer>
    );
  }

  const takenSpots = event.capacity - (event.availableSpots || 0);

  return (
    <MainPageContainer>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBack}
      >
        <Ionicons name="chevron-back" size={28} color="#E74C3C" />
      </TouchableOpacity>
      
      <ScrollView style={styles.container}>
        <View style={styles.eventContainer}>
          <Image 
            source={{ uri: event.image || 'https://www.kasandbox.org/programming-images/avatars/leaf-red.png' }} 
            style={styles.eventImage}
            resizeMode="cover"
          />
  
          <View style={styles.detailsContainer}>
            <Text style={styles.adminText}>{event.admin || 'Organizador'}</Text>
            <Text style={styles.eventTitle}>{event.name || event.title}</Text>
  
            <View style={styles.infoContainer}>
              <View style={styles.infoColumn}>
                <Text style={styles.infoText}>📍 {event.location}</Text>
                <Text style={styles.infoText}>🏷️ {event.category}</Text>
              </View>
              <View style={styles.infoColumn}>
                <Text style={styles.infoText}>🗓️ {event.date}</Text>
                <Text style={styles.infoText}>⏰ {event.hour || event.time}</Text>
              </View>
            </View>
  
            <Text style={styles.infoText}>👥 {takenSpots} / {event.capacity}</Text>
  
            <Text style={styles.description}>{event.description}</Text>
  
            <Text style={styles.activeEvent}>
              {compareDates(event.date, event.hour || event.time)}
            </Text>
  
            <TouchableOpacity 
              style={styles.buyButton}
              onPress={handleReservation}
            >
              <Text style={styles.buyButtonText}>¡Comprar ahora!</Text>
              <Text style={styles.buyButtonPrice}>
                ${event.price || 0} + I.V.A
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </MainPageContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#E74C3C',
    marginVertical: 10,
    textAlign: 'center',
  },
  errorBackButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
  },
  errorBackButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  eventContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  eventImage: {
    width: 400,
    height: 500,
    borderRadius: 10,
    marginRight: 16,
    resizeMode: 'cover'
  },
  detailsContainer: {
    flex: 1,
  },
  adminText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#E74C3C',
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoColumn: {
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    marginBottom: 10,
  },
  activeEvent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2ECC71',
    marginTop: 10,
  },
  buyButton: {
    backgroundColor: '#FFA07A',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    minWidth: 400,
    maxWidth: 400,
    alignSelf: 'center',
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  buyButtonPrice: {
    fontSize: 14,
    color: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 1,
    marginLeft: 10,
    marginTop: 1,
  },
  backButtonText: {
    marginLeft: 5,
    color: '#E74C3C',
    fontSize: 10,
  },
});

export default EventDetails;