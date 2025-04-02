import MainPageContainer from '@/components/MainPageContainer';
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';

const EventDetails = () => {
    return (
      <MainPageContainer>
      <ScrollView style={styles.container}>
        <View style={styles.eventContainer}>
          <View style={styles.imagePlaceholder} />
  
          <View style={styles.detailsContainer}>
            <Text style={styles.adminText}>Administrador de evento</Text>
            <Text style={styles.eventTitle}>FIESTA</Text>
  
            <View style={styles.infoContainer}>
              <View style={styles.infoColumn}>
                <Text style={styles.infoText}>📍 Guanacaste</Text>
                <Text style={styles.infoText}>🏷️ Ocio</Text>
              </View>
              <View style={styles.infoColumn}>
                <Text style={styles.infoText}>🗓️ Domingo, 23 de marzo 2025</Text>
                <Text style={styles.infoText}>⏰ 19:00</Text>
              </View>
            </View>
  
            <Text style={styles.infoText}>👥 17 / 21</Text>
  
            <Text style={styles.description}>
              Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción 
              Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción 
              Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción 
              Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción Descripción 
            </Text>
  
            <Text style={styles.activeEvent}>¡Evento Activo!</Text>
  
            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buyButtonText}>¡Comprar ahora!</Text>
              <Text style={styles.buyButtonPrice}>$6 + I.V.A</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </MainPageContainer>
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
      width: 400,
      height: 500,
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
  });
  
  export default EventDetails;
  