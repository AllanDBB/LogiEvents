import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, TextInput } from 'react-native';
import React from "react";
import { useRouter } from "expo-router";
import BackArrow from "@/components/BackArrow";

export default function Register() {
  const router = useRouter(); 

  return (
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
        />

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label2}>Nombre</Text>
            <TextInput
              style={styles.inputSmall}
              placeholder="First Name"
              placeholderTextColor="#A9A9A9"
              keyboardType="default"
            />
          </View>
          <View style={styles.column}>
            <Text style={styles.label3}>Apellido</Text>
            <TextInput
              style={styles.inputSmall}
              placeholder="Last Name"
              placeholderTextColor="#A9A9A9"
              keyboardType="default"
            />
          </View>
        </View>

        <Text style={styles.label}>Identificación</Text>
        <TextInput
          style={styles.input}
          placeholder="000000000"
          placeholderTextColor="#A9A9A9"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#A9A9A9"
          keyboardType="default"
          secureTextEntry={true}
        />

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label4}>Número</Text>
            <TextInput
              style={styles.inputSmall}
              placeholder="+506 8888 8888"
              placeholderTextColor="#A9A9A9"
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.termsText}>
          Al registrarse acepta nuestros <Text style={styles.boldUnderline}>Términos de uso</Text> y <Text style={styles.boldUnderline}>Políticas de privacidad</Text>.
        </Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>
            Ya tienes cuenta?{' '}
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
              onPress={() => router.push('/auth/login')} 
            >
              <Text style={styles.organizerButtonText}>Ir ahora</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
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
    backgroundColor: '#151D20', 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    paddingTop: 15, 
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
    marginBottom: 5, 
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
    marginBottom: 6,
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