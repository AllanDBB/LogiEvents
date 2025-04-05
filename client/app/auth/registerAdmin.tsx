import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import React, { useState } from "react";
import { useRouter } from "expo-router";
import BackArrow from "@/components/BackArrow";
import { makeAdmin } from '@/services/api';

// Componente de pop-up personalizado
const CustomPopup = ({ visible, title, message, onClose, buttonText }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.popupContainer}>
          <Text style={styles.popupTitle}>{title}</Text>
          <Text style={styles.popupMessage}>{message}</Text>
          <TouchableOpacity
            style={styles.popupButton}
            onPress={onClose}
          >
            <Text style={styles.popupButtonText}>{buttonText || 'OK'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default function RegisterAdmin() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    godEmail: '',
    godPassword: '',
    newAdminEmail: ''
  });
  
  // Estado para el popup
  const [popup, setPopup] = useState({
    visible: false,
    title: '',
    message: '',
    buttonText: 'OK',
    onClose: () => {}
  });

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const validateForm = () => {
    const { godEmail, godPassword, newAdminEmail } = formData;
    
    if (!godEmail || !godPassword || !newAdminEmail) {
      showPopup('Error', 'Todos los campos son obligatorios');
      return false;
    }
    
    // Validar formato de correo electrónico
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(godEmail) || !emailRegex.test(newAdminEmail)) {
      showPopup('Error', 'El formato de correo electrónico es inválido');
      return false;
    }
    
    return true;
  };
  
  // Función para mostrar el popup
  const showPopup = (title, message, buttonText = 'OK', onClose = () => {}) => {
    setPopup({
      visible: true,
      title,
      message,
      buttonText,
      onClose: () => {
        setPopup(prev => ({ ...prev, visible: false }));
        onClose();
      }
    });
  };

  const handleRegisterAdmin = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const response = await makeAdmin(
        formData.godEmail, 
        formData.godPassword, 
        formData.newAdminEmail
      );
      
      // Usar el popup personalizado en lugar de Alert
      showPopup(
        '¡Operación Exitosa!', 
        `El usuario ${formData.newAdminEmail} ha sido modificado a administrador correctamente.`,
        'OK',
        () => router.push('/auth/login')
      );
    } catch (error) {
      console.error('Error registrando admin:', error);
      const errorMessage = error.response?.data?.error || 'Error al registrar administrador. Inténtalo de nuevo.';
      showPopup('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Componente Popup */}
      <CustomPopup
        visible={popup.visible}
        title={popup.title}
        message={popup.message}
        buttonText={popup.buttonText}
        onClose={popup.onClose}
      />
      
      <View style={styles.leftContainer}>
        <BackArrow onPress={() => router.back()} />
        <Text style={styles.title}>LogiEvents</Text>
        <Text style={styles.subtitle}>Registro de Administrador</Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Credenciales del Admin GOD</Text>
          
          <Text style={styles.label}>Correo electrónico (Admin GOD)</Text>
          <TextInput
            style={styles.input}
            placeholder="admin@logievents.com"
            placeholderTextColor="#A9A9A9"
            keyboardType="email-address"
            value={formData.godEmail}
            onChangeText={(text) => handleChange('godEmail', text)}
            autoCapitalize="none"
          />
          
          <Text style={styles.label}>Contraseña (Admin GOD)</Text>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#A9A9A9"
            secureTextEntry={true}
            value={formData.godPassword}
            onChangeText={(text) => handleChange('godPassword', text)}
          />
          
          <Text style={styles.sectionTitle}>Nuevo Administrador</Text>
          
          <Text style={styles.label}>Correo electrónico del nuevo Admin</Text>
          <TextInput
            style={styles.input}
            placeholder="nuevo@logievents.com"
            placeholderTextColor="#A9A9A9"
            keyboardType="email-address"
            value={formData.newAdminEmail}
            onChangeText={(text) => handleChange('newAdminEmail', text)}
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.termsText}>
          Al registrar un nuevo administrador, confirmas que tienes los permisos necesarios y que el nuevo usuario cumple con los requisitos de la plataforma.
        </Text>

        <TouchableOpacity 
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleRegisterAdmin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#151D20" />
          ) : (
            <Text style={styles.buttonText}>Registrar Administrador</Text>
          )}
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
            <Text style={styles.rightSubtitle}>Administra tus eventos</Text>
            <Text style={styles.rightSubtitle}>Con privilegios especiales</Text>
            <Image
              source={require('@/assets/images/fondo_user.png')}
              style={styles.rightImage}
              resizeMode="contain"
            />
            <Text style={styles.organizerTitle}>¿Cliente?</Text>
            <TouchableOpacity
              style={styles.organizerButton}
              onPress={() => router.push('/auth/register')} 
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
  // Estilos para el popup
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#151D20',
    textAlign: 'center'
  },
  popupMessage: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20
  },
  popupButton: {
    backgroundColor: '#151D20',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center'
  },
  popupButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  },
  
  // Estilos existentes
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
    paddingBottom: 20,
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
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    width: '90%',
    alignItems: 'center',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginTop: 15,
    marginBottom: 10,
  },
  label: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
    alignSelf: 'flex-start', 
    marginLeft: '10%', 
    marginBottom: 4,
  },
  input: {
    width: '80%',
    height: 40, 
    backgroundColor: 'white', 
    borderRadius: 5, 
    paddingHorizontal: 10,
    fontSize: 14, 
    color: 'black', 
    marginBottom: 15, 
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 20,
    minWidth: 250,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
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
    marginBottom: 10,
    width: '80%',
  },
  boldUnderline: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  linkContainer: {
    marginTop: 15, 
    alignItems: 'center', 
    width: '100%',
  },
  linkText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
});