import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import BackArrow from "@/components/BackArrow";
import { login } from "@/services/api";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const router = useRouter(); 
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      
      if (!formData.email || !formData.password) {
        throw new Error('Por favor ingrese su correo y contraseña');
      }
  
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Por favor ingrese un correo electrónico válido');
      }
  
      const response = await login(formData);
      
      if (response.status !== 200) {
        throw new Error(response.data?.message || 'Credenciales inválidas');
      }


      router.push('/home'); 
    } catch (error) {
      setErrorMessage(error.message);
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };  

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <ImageBackground
          source={require('@/assets/images/fondo_login.webp')}
          style={styles.image}
          resizeMode="cover"
        >
          <View style={styles.leftContent}>
            <Text style={styles.leftTitle}>Vive con nosotros</Text>
            <Text style={styles.leftSubtitle}>
              Millones de eventos, compartí experiencias con todos, conseguí tu ticket para los eventos más próximos y de mejor calidad en{' '}
              <Text style={styles.bold}>LogiEvents</Text>
            </Text>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.rightContainer}>
        <Text style={styles.title}>Inicio de sesión</Text>

        <Text style={styles.label}>Usuario o correo electrónico</Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          placeholder="name@logievents.com"
          placeholderTextColor="#A9A9A9"
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          keyboardType="default"
          placeholder="********"
          placeholderTextColor="#A9A9A9"
          value={formData.password}
          onChangeText={(text) => handleInputChange('password', text)}
          secureTextEntry={true}
          autoCapitalize="none"
        />

        <View style={styles.linkContainer2}>
          <Text style={styles.linkText2}>
            ¿Olvidaste tu contraseña?{' '}
            <Text
              style={styles.boldUnderline}
              onPress={() => router.push('/auth/requestPassword')} 
            >
              Click aquí
            </Text>
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.disabledButton]} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Cargando...' : 'Iniciar sesión'}
          </Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>
            ¿No tienes cuenta?{' '}
            <Text
              style={styles.boldUnderline}
              onPress={() => router.push('/auth/register')} 
            >
              Click aquí
            </Text>
          </Text>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Error al iniciar sesión</Text>
            <Text style={styles.modalMessage}>Credeciales incorrectos</Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', 
  },
  
  leftContainer: {
    flex: 1,
  },

  leftContent: {
    alignItems: 'flex-start', 
    justifyContent: 'flex-start', 
    flex: 1,
    paddingTop: 90, 
    paddingHorizontal: 60, 
  },
  
  leftTitle: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  
  leftSubtitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 5,
    width: '100%', 
  },

  rightContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    paddingTop: 95, 
  },
  
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  
  title: {
    color: 'black',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 35,
  },
  
  label: {
    color: 'black',
    fontSize: 16,
    textAlign: 'left',
    alignSelf: 'flex-start', 
    marginLeft: '10%', 
    marginBottom: 10,
  },
  
  input: {
    width: '80%',
    height: 40, 
    backgroundColor: 'white', 
    borderRadius: 5, 
    paddingHorizontal: 10,
    fontSize: 14, 
    color: 'black', 
    marginBottom: 25, 
    borderWidth: 1,
    borderColor: 'black',
  },
  
  bold: {
    fontWeight: 'bold', 
  },
  
  button: {
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 80,
    borderRadius: 20,
    marginTop: 50,
  },

  disabledButton: {
    backgroundColor: '#666',
  },
  
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  boldUnderline: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  
  linkContainer: {
    marginTop: 10, 
    alignItems: 'center', 
    width: '100%',
  },
  
  linkText: {
    color: 'black',
    fontSize: 12,
    textAlign: 'center',
    textDecorationLine: 'underline', 
  },

  linkContainer2: {
    marginTop: -15, 
    alignItems: 'flex-end', 
    width: '80%',
  },

  linkText2: {
    color: 'black',
    fontSize: 12,
    textAlign: 'right',
    textDecorationLine: 'underline', 
  },

  // Estilos para el modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    width: '30%', 
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15, 
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: 'red', 
  },
  modalButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});