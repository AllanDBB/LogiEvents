import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEvents } from '@/hooks/useEvents';

const EventDetails = () => {
  const params = useLocalSearchParams();
  const { events, loadAvailableEvents } = useEvents();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extraer ID de forma segura
  const eventId = params.id?.toString();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!eventId) {
          setError('No se recibió ID de evento');
          return;
        }

        // Si no hay eventos, cargarlos
        if (events.length === 0) {
          await loadAvailableEvents();
        }

        // Verificar nuevamente después de cargar
        const foundEvent = events.find(e => e.id?.toString() === eventId);
        if (!foundEvent) {
          setError(`Evento con ID ${eventId} no encontrado`);
        }
      } catch (err) {
        setError('Error al cargar el evento');
      } finally {
        setLoading(false);
      }
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

  if (error) {
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
  }

  const event = events.find(e => e.id?.toString() === eventId);

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text>El evento existe pero no se pudo cargar</Text>
      </View>
    );
  }

  // Renderizar el evento encontrado
  return (
    <ScrollView style={styles.container}>
      {/* Tu código para mostrar los detalles del evento */}
      <Text style={styles.title}>{event.title}</Text>
      {/* ... más detalles */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
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
  backButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#FFA07A',
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  // ... más estilos
});

export default EventDetails;