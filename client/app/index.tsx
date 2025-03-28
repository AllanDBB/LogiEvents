import { StyleSheet, View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import Navbar from '@/components/Navbar';
import React from 'react';

export default function Header() {
  return (
    <View style={styles.container}>
      <Navbar isLogged={false} />
      <ImageBackground
        source={require('@/assets/images/fondo_header.webp')} // Asegúrate de que la ruta sea correcta
        style={styles.imageBackground}
        resizeMode="cover" // Cambié a "cover" para eliminar los márgenes blancos
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Los mejores eventos</Text>
          <Text style={styles.subtitle}>
            A tan solo un click de <Text style={styles.bold}>una nueva experiencia</Text>
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Ir ahora</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
  },
  title: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 80,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});