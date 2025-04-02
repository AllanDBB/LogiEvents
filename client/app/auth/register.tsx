import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import React, { useState } from "react";
import { useRouter } from "expo-router";
import BackArrow from "@/components/BackArrow";

import { register } from '@/services/api';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    DNI: '',
    businessID: '', // Nuevo campo
    address: '' // Nuevo campo
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async () => {
    try {
      setLoading(true);

      const requiredFields = ['firstName', 'lastName', 'email', 'password', 'phoneNumber', 'DNI', 'businessID', 'address'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        
        throw new Error(`Faltan campos obligatorios: ${missingFields.join(', ')}`);
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Formato de email inválido');
      }

      if (!/^\d{9}$/.test(formData.DNI)) {
        throw new Error('La cédula debe tener 9 dígitos');
      }

      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)) {
        throw new Error('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');
      }

      if (!/^[A-Z]{4}\d{4}$/.test(formData.businessID)) {
        throw new Error('El Business ID debe tener 4 letras seguidas de 4 números (ej: ABCD1234)');
      }

      let phoneNumber = formData.phoneNumber;
      if (!phoneNumber.startsWith('+')) {
        phoneNumber = `+506${phoneNumber.replace(/\D/g, '')}`;
      }

      if (phoneNumber.length !== 12) {
        throw new Error('El número de teléfono debe tener el formato +506XXXXXXXXX');
      }

      const response = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber,
        DNI: formData.DNI,
        businessID: formData.businessID,
        address: formData.address,
      });

      if (response.status !== 201) {
        throw new Error(response.data?.message || 'Error al registrar el usuario');
      }

      router.push(`/auth/verify-code?email=${encodeURIComponent(formData.email)}`);

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <BackArrow onPress={() => router.back()} />
          <Text style={styles.title}>LogiEvents</Text>
          <Text style={styles.subtitle}>Creemos experiencias juntos</Text>

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="name@logievents.com"
            placeholderTextColor="#A9A9A9"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
          />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label2}>Nombre</Text>
              <TextInput
                style={styles.inputSmall}
                placeholder="First Name"
                placeholderTextColor="#A9A9A9"
                keyboardType="default"
                value={formData.firstName}
                onChangeText={(text) => handleChange('firstName', text)}
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.label3}>Apellido</Text>
              <TextInput
                style={styles.inputSmall}
                placeholder="Last Name"
                placeholderTextColor="#A9A9A9"
                keyboardType="default"
                value={formData.lastName}
                onChangeText={(text) => handleChange('lastName', text)}
              />
            </View>
          </View>

          <Text style={styles.label}>Identificación</Text>
          <TextInput
            style={styles.input}
            placeholder="000000000"
            placeholderTextColor="#A9A9A9"
            keyboardType="numeric"
            value={formData.DNI}
            onChangeText={(text) => handleChange('DNI', text)}
            maxLength={9}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A9A9A9"
            keyboardType="default"
            secureTextEntry={true}
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
          />

          <Text style={styles.label}>Business ID</Text>
          <TextInput
            style={styles.input}
            placeholder="ABCD1234"
            placeholderTextColor="#A9A9A9"
            keyboardType="default"
            value={formData.businessID}
            onChangeText={(text) => handleChange('businessID', text.toUpperCase())}
            maxLength={8}
          />

          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={styles.input}
            placeholder="Costa Rica"
            placeholderTextColor="#A9A9A9"
            keyboardType="default"
            value={formData.address}
            onChangeText={(text) => handleChange('address', text)}
          />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label4}>Número de teléfono</Text>
              <TextInput
                style={styles.inputSmall}
                placeholder="+50688888888"
                placeholderTextColor="#A9A9A9"
                keyboardType="phone-pad"
                value={formData.phoneNumber}
                onChangeText={(text) => handleChange('phoneNumber', text)}
              />
            </View>
          </View>

          <Text style={styles.termsText}>
            Al registrarse acepta nuestros <Text style={styles.boldUnderline}>Términos de uso</Text> y <Text style={styles.boldUnderline}>Políticas de privacidad</Text>.
          </Text>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Cargando...' : 'Continuar'}
            </Text>
          </TouchableOpacity>

          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>
              ¿Ya tienes cuenta?{' '}
              <Text
                style={styles.boldUnderline}
                onPress={() => router.push('/auth/login')} 
              >
                Click aquí
              </Text>
            </Text>
          </View>
        </View>
        
        <View style={styles.rightContainer}>
          <ImageBackground
            source={require('@/assets/images/fondo_register.webp')}
            style={styles.image}
            resizeMode="cover"
          >
            <View style={styles.rightContent}>
              <Text style={styles.rightTitle}>LogiEvents</Text>
              <Text style={styles.rightSubtitle}>Juntamos experiencias</Text>
              <Text style={styles.rightSubtitle}>De los mejores eventos</Text>
              <Image
                source={require('@/assets/images/fondo_user.png')}
                style={styles.rightImage}
                resizeMode="contain"
              />
              <Text style={styles.organizerTitle}>¿Organizador?</Text>
              <TouchableOpacity
                style={styles.organizerButton}
                onPress={() => router.push('/auth/registerAdmin')} 
              >
                <Text style={styles.organizerButtonText}>Ir ahora</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row', 
  },
  leftContainer: {
    flex: 1, 
    backgroundColor: '#151D20', 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    paddingTop: 15,
    paddingBottom: 30, // Añadido para espacio al final
  },
  rightContainer: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  rightContent: {
    alignItems: 'center', 
  },
  rightTitle: {
    color: 'white',
    fontSize: 36, 
    fontWeight: 'bold',
    marginBottom: 10, 
  },
  rightSubtitle: {
    color: 'white',
    fontSize: 16, 
    textAlign: 'center',
    marginBottom: 5, 
  },
  rightImage: {
    width: 150, 
    height: 150, 
    marginTop: 10, 
  },
  organizerTitle: {
    color: 'white',
    fontSize: 20, 
    fontWeight: 'bold',
    marginTop: 20, 
    marginBottom: 10, 
  },
  organizerButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  organizerButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
  },
  label: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
    alignSelf: 'flex-start', 
    marginLeft: '10%', 
    marginBottom: 4,
  },
  label2: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft: '1%',
    marginBottom: 8,
  },
  label3: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft: '1%',
    marginBottom: 8,
  },
  label4: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft: '1%',
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
    marginBottom: 15, // Aumentado para mejor espaciado
  },
  row: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '80%', 
    marginBottom: 6, 
  },
  column: {
    flex: 1, 
    marginHorizontal: 5, 
  },
  inputSmall: {
    width: '100%', 
    height: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
    color: 'black',
    marginBottom: 15, // Aumentado para mejor espaciado
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
  termsText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    width: '80%',
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
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    textDecorationLine: 'underline', 
  },
});