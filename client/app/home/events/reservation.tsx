import MainPageContainer from '@/components/MainPageContainer';
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, Picker } from 'react-native';

const Reservation = () => {
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

            <View style={styles.formContainer}>
              <Text style={styles.formLabel}>Nombre completo</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ingrese su nombre completo"
              />
              
              <Text style={styles.formLabel}>Correo electrónico</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ingrese su correo electrónico"
                keyboardType="email-address"
              />
              
              <Text style={styles.formLabel}>Número telefónico</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ingrese su número telefónico"
                keyboardType="phone-pad"
              />
              
              <Text style={styles.formLabel}>Espacios a reservar</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  <Picker.Item label="Seleccione cantidad" value="" />
                  <Picker.Item label="1 espacio" value="1" />
                  <Picker.Item label="2 espacios" value="2" />
                  <Picker.Item label="3 espacios" value="3" />
                  <Picker.Item label="4 espacios" value="4" />
                  <Picker.Item label="5 espacios" value="5" />
                </Picker>
              </View>

                <TouchableOpacity style={styles.createButton}>
                    <Text style={styles.createButtonText}>Confirmar</Text>
                </TouchableOpacity>

            </View>

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
      marginBottom: 1,
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
      backgroundColor: '#E74C3C',
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
      color: '#E74C3C',
    },
    // Nuevos estilos agregados
    formContainer: {
      marginTop: 3,
      padding: 10,
      backgroundColor: '#f9f9f9',
      borderRadius: 10,
    },
    formLabel: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#555',
      marginTop: 0,
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      backgroundColor: '#fff',
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      marginBottom: 10,
      backgroundColor: '#fff',
      overflow: 'hidden',
    },
    picker: {
      width: '100%',
      height: 30,
    },
    pickerItem: {
      fontSize: 12,
    },
    createButton: {
        backgroundColor: '#E74C3C',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 10,
    },
        createButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
  });
  
  export default Reservation;