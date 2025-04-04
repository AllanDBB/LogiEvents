import MainPageContainer from '@/components/MainPageContainer';
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  Modal,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEventById, requestReservation, confirmReservation } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';

// Componente de pop-up personalizado
const CustomPopup = ({ visible, title, message, buttons, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.popupContainer}>
          <Text style={styles.popupTitle}>{title}</Text>
          <Text style={styles.popupMessage}>{message}</Text>
          <View style={styles.popupButtonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.popupButton,
                  button.style === 'cancel' && styles.cancelButton,
                  button.style === 'destructive' && styles.confirmButton,
                  button.style === 'success' && styles.successButton
                ]}
                onPress={() => {
                  onClose();
                  if (button.onPress) button.onPress();
                }}
              >
                <Text style={styles.popupButtonText}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Reservation = () => {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();

  // Estados del formulario de reserva
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    spots: ''
  });

  // Estados de validación
  const [formErrors, setFormErrors] = useState({
    fullName: false,
    email: false,
    phone: false,
    spots: false
  });

  // Estados de la pantalla
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [event, setEvent] = useState(null);
  const [currentStep, setCurrentStep] = useState('form'); // form, verification, success
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [reservationDetails, setReservationDetails] = useState(null);
  
  // Estados para el popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({
    title: '',
    message: '',
    buttons: []
  });

  // Función para mostrar un popup
  const showCustomPopup = (title, message, buttons) => {
    setPopupConfig({
      title,
      message,
      buttons
    });
    setShowPopup(true);
  };

  // Cargar datos del evento
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        if (!eventId) {
          showCustomPopup(
            'Error',
            'No se proporcionó ID del evento',
            [{ text: 'Volver', onPress: () => router.back() }]
          );
          return;
        }

        const token = await AsyncStorage.getItem('token');
        if (!token) {
          showCustomPopup(
            'Error de autenticación',
            'No se encontró un token de autenticación. Por favor, inicia sesión nuevamente.',
            [{ text: 'Iniciar sesión', onPress: () => router.push('/auth/login') }]
          );
          return;
        }

        const eventData = await getEventById(eventId, token);
        setEvent(eventData);
      } catch (error) {
        console.error('Error al cargar el evento:', error);
        showCustomPopup(
          'Error',
          'No se pudo cargar la información del evento. Inténtalo nuevamente.',
          [{ text: 'Volver', onPress: () => router.back() }]
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, router]);

  // Validación del formulario
  const isFormValid = () => {
    return (
      formData.fullName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.spots !== '' &&
      !formErrors.fullName &&
      !formErrors.email &&
      !formErrors.phone &&
      !formErrors.spots
    );
  };

  // Validación del código
  const isVerificationValid = () => {
    return verificationCode.length === 6 && /^\d+$/.test(verificationCode);
  };

  // Validaciones de campos
  const validateFullName = (name) => {
    return name.trim().length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    return /^\+\d{11,12}$/.test(phone);
  };

  const validateSpots = (spots, availableSpots) => {
    const spotsNum = parseInt(spots);
    return spotsNum > 0 && spotsNum <= availableSpots;
  };

  // Manejar cambios en los inputs
  const handleInputChange = (name, value) => {
    let error = false;

    if (name === 'fullName') {
      error = value.trim() !== '' && !validateFullName(value);
    } else if (name === 'email') {
      error = value.trim() !== '' && !validateEmail(value);
    } else if (name === 'phone') {
      error = value.trim() !== '' && !validatePhone(value);
    } else if (name === 'spots') {
      error = value !== '' && !validateSpots(value, event?.availableSpots || 0);
    }

    setFormErrors({
      ...formErrors,
      [name]: error
    });

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Enviar el formulario para solicitar código OTP
  const handleSubmit = async () => {
    if (!isFormValid() || submitting) return;

    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        showCustomPopup(
          'Error de autenticación',
          'No se encontró un token de autenticación. Por favor, inicia sesión nuevamente.',
          [{ text: 'Iniciar sesión', onPress: () => router.push('/auth/login') }]
        );
        return;
      }

      await requestReservation(
        eventId, 
        formData.phone, 
        parseInt(formData.spots), 
        token
      );

      setCurrentStep('verification');
    } catch (error) {
      console.error('Error al solicitar la reserva:', error);
      showCustomPopup(
        'Error',
        typeof error === 'string' ? error : 'Error al solicitar la reserva. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Verificar el código OTP
  const handleVerifyCode = async () => {
    if (!isVerificationValid() || submitting) return;

    try {
      setSubmitting(true);
      setVerificationError('');
      
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        showCustomPopup(
          'Error de autenticación',
          'No se encontró un token de autenticación. Por favor, inicia sesión nuevamente.',
          [{ text: 'Iniciar sesión', onPress: () => router.push('/auth/login') }]
        );
        return;
      }

      const response = await confirmReservation(
        eventId,
        {
          phoneNumber: formData.phone,
          code: verificationCode,
          fullName: formData.fullName,
          email: formData.email,
          quantity: parseInt(formData.spots)
        },
        token
      );

      // Crear detalles de reserva para mostrar en la pantalla de éxito
      const reservationData = {
        event: {
          title: event?.name || event?.title,
          date: event?.date,
          location: event?.location,
          admin: event?.admin
        },
        user: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone
        },
        reservation: {
          spots: parseInt(formData.spots),
          reservationDate: new Date().toISOString(),
          totalPrice: parseInt(formData.spots) * (event?.price || 0),
          reservationId: Math.random().toString(36).substring(2, 9).toUpperCase()
        }
      };

      setReservationDetails(reservationData);
      setCurrentStep('success');
    } catch (error) {
      console.error('Error al confirmar la reserva:', error);
      setVerificationError(typeof error === 'string' ? error : 'Código inválido o expirado');
    } finally {
      setSubmitting(false);
    }
  };

  // Manejar solicitud de nuevo código
  const handleResendCode = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        showCustomPopup(
          'Error de autenticación',
          'No se encontró un token de autenticación. Por favor, inicia sesión nuevamente.',
          [{ text: 'Iniciar sesión', onPress: () => router.push('/auth/login') }]
        );
        return;
      }

      await requestReservation(
        eventId, 
        formData.phone, 
        parseInt(formData.spots), 
        token
      );

      showCustomPopup(
        'Código enviado',
        'Se ha enviado un nuevo código de verificación a tu teléfono',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error al reenviar el código:', error);
      showCustomPopup(
        'Error',
        typeof error === 'string' ? error : 'Error al enviar el código. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Navegar a mis eventos al finalizar
  const handleFinish = () => {
    router.push("/home/events/myEvents");
  };

  // Vista de carga
  if (loading) {
    return (
      <MainPageContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E74C3C" />
          <Text style={styles.loadingText}>Cargando información del evento...</Text>
        </View>
      </MainPageContainer>
    );
  }

  // Si no hay evento
  if (!event) {
    return (
      <MainPageContainer>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={48} color="#E74C3C" />
          <Text style={styles.errorText}>No se pudo cargar la información del evento</Text>
          <TouchableOpacity 
            style={styles.errorBackButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorBackButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </MainPageContainer>
    );
  }

  const takenSpots = event.capacity - (event.availableSpots || 0);
  
  // Crear opciones para el selector de espacios
  const pickerItems = [];
  for (let i = 1; i <= (event.availableSpots || 0); i++) {
    pickerItems.push({ label: `${i} espacio${i > 1 ? 's' : ''}`, value: i.toString() });
  }

  return (
    <MainPageContainer>
      {/* Pop-up personalizado */}
      <CustomPopup
        visible={showPopup}
        title={popupConfig.title}
        message={popupConfig.message}
        buttons={popupConfig.buttons}
        onClose={() => setShowPopup(false)}
      />

      <ScrollView style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#E74C3C" />
        </TouchableOpacity>

        <View style={styles.eventContainer}>
          <View style={styles.imagePlaceholder}>
            {event.image && (
              <Image 
                source={{ uri: event.image }} 
                style={styles.eventImage}
                resizeMode="cover"
              />
            )}
          </View>
  
          <View style={styles.detailsContainer}>
            <Text style={styles.adminText}>{event.admin || 'Organizador'}</Text>
            <Text style={styles.eventTitle}>{event.name || event.title}</Text>
            <Text style={styles.description}>{event.description}</Text>
  
            <View style={styles.infoContainer}>
              <View style={styles.infoColumn}>
                <Text style={styles.infoText}>📍 {event.location}</Text>
                <Text style={styles.infoText}>🏷️ {event.category}</Text>
              </View>
              <View style={styles.infoColumn}>
                <Text style={styles.infoText}>🗓️ {event.date}</Text>
                <Text style={styles.infoText}>⏰ {event.hour || event.time}</Text>
              </View>
            </View>

            <View style={styles.capacityContainer}>
              <Text style={styles.infoText}>👥 {takenSpots} / {event.capacity}</Text>
              <Text style={styles.availableText}>Espacios disponibles: {event.availableSpots}</Text>
              <Text style={styles.priceText}>Precio por espacio: ${event.price || 0}</Text>
            </View>

            {/* Formulario de reserva - Paso 1 */}
            {currentStep === 'form' && (
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Datos para la reserva</Text>
                
                <Text style={styles.formLabel}>Nombre completo*</Text>
                <TextInput 
                  style={[styles.input, formErrors.fullName && styles.inputError]} 
                  placeholder="Ingrese su nombre completo"
                  value={formData.fullName}
                  onChangeText={(text) => handleInputChange('fullName', text)}
                />
                {formErrors.fullName && <Text style={styles.errorText}>Nombre inválido</Text>}
                
                <Text style={styles.formLabel}>Correo electrónico*</Text>
                <TextInput 
                  style={[styles.input, formErrors.email && styles.inputError]}
                  placeholder="ejemplo@correo.com"
                  keyboardType="email-address"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                />
                {formErrors.email && <Text style={styles.errorText}>Formato de email inválido</Text>}
                
                <Text style={styles.formLabel}>Número telefónico* (formato: +XXXXXXXXXXXX)</Text>
                <TextInput 
                  style={[styles.input, formErrors.phone && styles.inputError]}
                  placeholder="+50688888888"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange('phone', text)}
                  maxLength={13} // +12 dígitos
                />
                {formErrors.phone && <Text style={styles.errorText}>Debe tener formato internacional, ej: +50661667902</Text>}

                <Text style={styles.formLabel}>Espacios a reservar*</Text>
                <View style={styles.pickerContainer}>
                  {Platform.OS === 'ios' ? (
                    <Picker
                      style={styles.picker}
                      selectedValue={formData.spots}
                      onValueChange={(itemValue) => handleInputChange('spots', itemValue)}
                    >
                      <Picker.Item label="Seleccione cantidad" value="" />
                      {pickerItems.map(item => (
                        <Picker.Item key={item.value} label={item.label} value={item.value} />
                      ))}
                    </Picker>
                  ) : (
                    <Picker
                      style={styles.picker}
                      selectedValue={formData.spots}
                      onValueChange={(itemValue) => handleInputChange('spots', itemValue)}
                    >
                      <Picker.Item label="Seleccione cantidad" value="" />
                      {pickerItems.map(item => (
                        <Picker.Item key={item.value} label={item.label} value={item.value} />
                      ))}
                    </Picker>
                  )}
                </View>
                {formErrors.spots && <Text style={styles.errorText}>Cantidad no disponible</Text>}

                {formData.spots && (
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>
                      Total a pagar: ${parseInt(formData.spots) * (event.price || 0)}
                    </Text>
                  </View>
                )}

                <TouchableOpacity 
                  style={[styles.createButton, (!isFormValid() || submitting) && styles.disabledButton]}
                  onPress={handleSubmit}
                  disabled={!isFormValid() || submitting}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.createButtonText}>Solicitar reserva</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Verificación de código - Paso 2 */}
            {currentStep === 'verification' && (
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Verificación</Text>
                <Text style={styles.verificationText}>
                  Hemos enviado un código de 6 dígitos a tu teléfono {formData.phone}.
                  Por favor, ingrésalo a continuación para confirmar tu reserva.
                </Text>

                <Text style={styles.formLabel}>Código de verificación*</Text>
                <TextInput 
                  style={[styles.input, styles.verificationInput, verificationError && styles.inputError]}
                  placeholder="Ingresa el código de 6 dígitos"
                  keyboardType="number-pad"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  maxLength={6}
                />
                {verificationError && <Text style={styles.errorText}>{verificationError}</Text>}

                <TouchableOpacity 
                  style={styles.resendButton}
                  onPress={handleResendCode}
                  disabled={submitting}
                >
                  <Text style={styles.resendButtonText}>Reenviar código</Text>
                </TouchableOpacity>

                <View style={styles.buttonGroup}>
                  <TouchableOpacity 
                    style={[styles.cancelButton, submitting && styles.disabledButton]}
                    onPress={() => setCurrentStep('form')}
                    disabled={submitting}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.createButton, (!isVerificationValid() || submitting) && styles.disabledButton]}
                    onPress={handleVerifyCode}
                    disabled={!isVerificationValid() || submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.createButtonText}>Verificar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Reserva exitosa - Paso 3 */}
            {currentStep === 'success' && reservationDetails && (
              <View style={styles.successContainer}>
                <Ionicons name="checkmark-circle" size={60} color="#27AE60" style={styles.successIcon} />
                <Text style={styles.successTitle}>¡Reserva confirmada!</Text>
                
                <View style={styles.successDetails}>
                  <Text style={styles.successLabel}>Evento:</Text>
                  <Text style={styles.successValue}>{reservationDetails.event.title}</Text>
                  
                  <Text style={styles.successLabel}>Fecha:</Text>
                  <Text style={styles.successValue}>{reservationDetails.event.date}</Text>
                  
                  <Text style={styles.successLabel}>Ubicación:</Text>
                  <Text style={styles.successValue}>{reservationDetails.event.location}</Text>
                  
                  <Text style={styles.successLabel}>Organizador:</Text>
                  <Text style={styles.successValue}>{reservationDetails.event.admin}</Text>
                  
                  <Text style={styles.successLabel}>Nombre:</Text>
                  <Text style={styles.successValue}>{reservationDetails.user.fullName}</Text>
                  
                  <Text style={styles.successLabel}>Espacios:</Text>
                  <Text style={styles.successValue}>{reservationDetails.reservation.spots}</Text>
                  
                  <Text style={styles.successLabel}>Total pagado:</Text>
                  <Text style={styles.successValue}>${reservationDetails.reservation.totalPrice}</Text>
                </View>

                <Text style={styles.successMessage}>
                  Se ha enviado un comprobante a tu correo electrónico {reservationDetails.user.email}
                </Text>

                <TouchableOpacity 
                  style={styles.createButton}
                  onPress={handleFinish}
                >
                  <Text style={styles.createButtonText}>Ver mis eventos</Text>
                </TouchableOpacity>
              </View>
            )}
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 1,
    marginLeft: 10,
    marginTop: 10,
  },
  eventContainer: {
    padding: 16,
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    flex: 1,
  },
  adminText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E74C3C',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoColumn: {
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  capacityContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  availableText: {
    fontSize: 14,
    color: '#27AE60',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 14,
    color: '#E74C3C',
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 8,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  totalContainer: {
    marginVertical: 12,
    padding: 12,
    backgroundColor: '#e8f4fd',
    borderRadius: 8,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2980B9',
  },
  createButton: {
    backgroundColor: '#E74C3C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
    opacity: 0.7,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  verificationText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    lineHeight: 20,
    textAlign: 'center',
  },
  verificationInput: {
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 4,
  },
  resendButton: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  resendButtonText: {
    fontSize: 14,
    color: '#3498db',
    textDecorationLine: 'underline',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  successContainer: {
    marginTop: 8,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    color: '#27AE60',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  successDetails: {
    width: '100%',
    marginBottom: 20,
  },
  successLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  successValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#E74C3C',
    marginVertical: 10,
    textAlign: 'center',
  },
  errorBackButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
  },
  errorBackButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Estilos para el modal de popup
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  popupMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  popupButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  popupButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    minWidth: 80,
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#5FAA9D',
  },
  popupButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  successButton: {
    backgroundColor: '#5FAA9D',
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  confirmButton: {
    backgroundColor: '#E74C3C',
  },
});

export default Reservation;