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
import { useEvents } from '@/hooks/useEvents';
import MainPageContainer from '@/components/MainPageContainer';

let tempData = {
  title: "Fiesta",
  description: "Gran fiesta en la playa con musica en vivo y juegos",
  image: "https://www.kasandbox.org/programming-images/avatars/leaf-red.png",
  category: "Ocio",
  date: "23/01/2015",
  time: "08:00",
  location: "Liberia, Guanacaste",
  availableSpots: 4, 
  admin: "Starticket",
  capacity: 300,
  price: 7,
};


const EventDetails = () => {
  const params = useLocalSearchParams();
  const { event, loadEvent } = useEvents();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const takenSpots = tempData.capacity-tempData.availableSpots;

 
  const { eventId } = useLocalSearchParams();

  const handleReservation = () => {
    router.push(`/home/events/reservation/${eventId}`);
  };

  /*

  useEffect(() => {
    const fetchData = async () => {
      
      try {
        if (!eventId) {
          setError('No se recibió ID de evento');
          return;
        }

        loadEvent(tempData);

        // Verificar nuevamente después de cargar
        const foundEvent = events.find(e => e.id?.toString() === eventId);
        if (!foundEvent) {
          setError(`Evento con ID ${eventId} no encontrado`);
        }
      } catch (err) {
        //setError('Error al cargar el evento');
      } finally {
        setLoading(false);
      }

      }catch (err) {
        //setError('Error al cargar el evento');
      }
      
      
      setLoading(false);
    
    };

    fetchData();
  }, [eventId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
    */

  /*if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={48} color="#E74C3C" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }*/

  /*const event = events.find(e => e.id?.toString() === eventId);

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text>El evento existe pero no se pudo cargar</Text>
      </View>
    );
  }*/

  const compareDates = (dateString, timeString) => {
    
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

  const handleBack = () => {
    router.back();
  };


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
              source={{ uri: tempData.image }} 
              style={styles.eventImage}
            />
      
              <View style={styles.detailsContainer}>
                <Text style={styles.adminText}>{tempData.admin}</Text>
                <Text style={styles.eventTitle}>{tempData.title}</Text>
      
                <View style={styles.infoContainer}>
                  <View style={styles.infoColumn}>
                    <Text style={styles.infoText}>📍 {tempData.location}</Text>
                    <Text style={styles.infoText}>🏷️ {tempData.category}</Text>
                  </View>
                  <View style={styles.infoColumn}>
                    <Text style={styles.infoText}>🗓️ {tempData.date}</Text>
                    <Text style={styles.infoText}>⏰ {tempData.time}</Text>
                  </View>
                </View>
      
                <Text style={styles.infoText}>👥 {takenSpots} / {tempData.capacity}</Text>
      
                <Text style={styles.description}>{tempData.description}</Text>

                
      
                <Text style={styles.activeEvent}>{compareDates(tempData.date, tempData.time)}</Text>
      
                <TouchableOpacity style={styles.buyButton}
                onPress={() => handleReservation()}>
                  <Text style={styles.buyButtonText}>¡Comprar ahora!</Text>
                  <Text style={styles.buyButtonPrice}>${tempData.price} + I.V.A</Text>
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