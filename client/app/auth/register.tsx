import { StyleSheet, View, Text, ImageBackground, TouchableOpacity, TextInput } from 'react-native';
import React from "react";

export default function Register() {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
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

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rightContainer}>
        <ImageBackground
          source={require('@/assets/images/fondo_register.webp')}
          style={styles.image}
          resizeMode="cover"
        />
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
    paddingTop: 50, 
  },
  rightContainer: {
    flex: 1, 
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 8,
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
    marginBottom: 8,
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
    marginBottom: 8,
  },
  label5: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft: '1%',
    marginBottom: 8,
  },
  
  input: {
    width: '80%',
    height: 40, 
    backgroundColor: 'white', 
    borderRadius: 5, 
    paddingHorizontal: 10,
    fontSize: 14, 
    color: 'black', 
    marginBottom: 16, 
  },
  row: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '80%', 
    marginBottom: 16, 
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
    marginBottom: 16,
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