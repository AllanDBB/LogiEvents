import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import BackArrow from "@/components/BackArrow";
import { useRouter } from "expo-router";
import RequestPopUp from "@/components/RequestPasswordPopUp";

export default function RequestPassword() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [popupVisible, setPopupVisible] = useState(false);

  const handleConfirmPasswordChange = () => {
    setPopupVisible(true); 
  };

  const handleClosePopup = () => {
    setPopupVisible(false); 
    router.push("/auth/confirmPassword"); 
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/fondo_login.webp")}
        style={styles.image}
        resizeMode="cover"
      >
        <View style={isMobile ? styles.centerContainerMobile : styles.centerContainerDesktop}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>LogiEvents</Text>
            <Text style={styles.subtitle}>Solicitar cambio de contraseña</Text>
          </View>

          <Text style={styles.label}>Identificación</Text>
          <TextInput style={styles.input} keyboardType="default" />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput style={styles.input} keyboardType="email-address" />

          <TouchableOpacity style={styles.button} onPress={handleConfirmPasswordChange}>
            <Text style={styles.buttonText}>Cambiar ahora</Text>
          </TouchableOpacity>
        </View>
        <BackArrow onPress={() => router.back()} />
      </ImageBackground>

      {/* Popup */}
      <RequestPopUp
        visible={popupVisible}
        onClose={handleClosePopup}
        message="Hemos enviado un correo con las instrucciones para cambiar tu contraseña."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  centerContainerMobile: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "90%",
    height: "auto",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  centerContainerDesktop: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "50%",
    height: "100%",
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: "center",
    marginTop: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 80,
    textAlign: "center",
  },
  label: {
    color: "black",
    fontSize: 16,
    textAlign: "left",
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginBottom: 10,
  },
  input: {
    width: "80%",
    height: 40,
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
    color: "black",
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "black",
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});