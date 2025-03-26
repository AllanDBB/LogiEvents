import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';

const EventDetails = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.eventContainer}>
        <View style={styles.imagePlaceholder} />
        
        <View style={styles.detailsContainer}>
          <Text style={styles.adminText}>Administrador de evento</Text>
          <Text style={styles.eventTitle}>FIESTA</Text>
          <Text style={styles.infoText}>📍 Guanacaste</Text>
          <Text style={styles.infoText}>🏷️ Ocio</Text>
          <Text style={styles.infoText}>👥 17 / 21</Text>
          
          <Text style={styles.description}>
            Descripción Descripción Descripción Descripción Descripción Descripción...
          </Text>

          <Text style={styles.activeEvent}>¡Evento Activo!</Text>

          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>¡Comprar ahora!</Text>
            <Text style={styles.buyButtonPrice}>$6 + I.V.A</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  eventContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#ccc',
    borderRadius: 10,
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  adminText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E74C3C',
  },
  infoText: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
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
});

export default EventDetails;
