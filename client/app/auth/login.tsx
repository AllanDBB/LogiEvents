import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from "expo-router";
import React from "react";
import BackArrow from "@/components/BackArrow";


export default function Login() {
  const router = useRouter(); 

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
          <BackArrow onPress={() => router.back()} />
        </ImageBackground>
      </View>

      <View style={styles.rightContainer}>

        <Text style={styles.title}>Inicio de sesión</Text>

        <Text style={styles.label}>Usuario o correo electrónico</Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          keyboardType="default"
          secureTextEntry={true}
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

        <TouchableOpacity style={styles.button} onPress={() => router.push('/home')}>
          <Text style={styles.buttonText}>Ir ahora</Text>
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

  leftImage: {
    width: 150, 
    height: 150, 
    marginTop: 10, 
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
    color: 'color',
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
    color: 'color',
    fontSize: 12,
    textAlign: 'right',
    textDecorationLine: 'underline', 
  },

  
});