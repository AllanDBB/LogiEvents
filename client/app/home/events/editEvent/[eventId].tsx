import MainPageContainer from '@/components/MainPageContainer';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Platform, ActivityIndicator, Modal } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEventById, updateEvent, requestEventDeletion, confirmEventDeletion } from '@/services/api';

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

const EditEvent = () => {
  const { eventId } = useLocalSearchParams();
  const router = useRouter();
  
  // Estados para los datos del evento
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para los campos editables
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState(''); 
  const [description, setDescription] = useState('');
  
  // Estados de error para campos editables
  const [dateError, setDateError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [capacityError, setCapacityError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  
  // Estados para los popups
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({
    title: '',
    message: '',
    buttons: []
  });
  
  // Estados para la confirmación OTP
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [confirmingDeletion, setConfirmingDeletion] = useState(false);

  // Función para mostrar un popup
  const showCustomPopup = (title, message, buttons) => {
    setPopupConfig({
      title,
      message,
      buttons
    });
    setShowPopup(true);
  };

  // Cargar datos del evento desde la API
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        
        if (!token) {
          showCustomPopup(
            'Error', 
            'No se encontró un token de autenticación', 
            [{ text: 'OK', onPress: () => router.push('/auth/login') }]
          );
          return;
        }
        
        const eventData = await getEventById(eventId, token);
        setEvent(eventData);
        
        // Inicializar los estados con los datos del evento
        setLocation(eventData.location || '');
        setCapacity(eventData.capacity?.toString() || '');
        setPrice(eventData.price?.toString() || '');
        
        // Formatear la fecha si es necesario
        if (eventData.date) {
          let dateStr = eventData.date;
          if (typeof dateStr === 'string' && dateStr.includes('/')) {
            setFormattedDate(dateStr);
            // Extraer solo los números de la fecha formateada
            setDate(dateStr.replace(/\//g, ''));
          } else if (dateStr instanceof Date) {
            const day = String(dateStr.getDate()).padStart(2, '0');
            const month = String(dateStr.getMonth() + 1).padStart(2, '0');
            const year = dateStr.getFullYear();
            const formatted = `${day}/${month}/${year}`;
            setFormattedDate(formatted);
            setDate(`${day}${month}${year}`);
          }
        }
        
        setTime(eventData.hour || eventData.time || '');
        setImage(eventData.image || eventData.eventCover || ''); // Solo para mostrar
        setDescription(eventData.description || '');
      } catch (error) {
        console.error('Error al obtener los datos del evento:', error);
        setError('No se pudo cargar el evento. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    if (eventId) {
      fetchEventData();
    }
  }, [eventId, router]);

  useEffect(() => {
    if (date.length === 8 && !date.includes('/')) {
      const day = date.substring(0, 2);
      const month = date.substring(2, 4);
      const year = date.substring(4, 8);
      setFormattedDate(`${day}/${month}/${year}`);
    }
  }, [date]);

  const handleSaveEvent = async () => {
    let hasErrors = false;
  
    // Validaciones
    if (!location.trim()) {
      setLocationError('Por favor ingresa una ubicación');
      hasErrors = true;
    } else {
      setLocationError('');
    }
  
    if (!date || dateError) {
      setDateError(dateError || 'Por favor ingresa una fecha válida');
      hasErrors = true;
    } else {
      setDateError('');
    }
  
    if (!capacity.trim()) {
      setCapacityError('Por favor ingresa la capacidad');
      hasErrors = true;
    } else if (parseInt(capacity) <= 0) {
      setCapacityError('Capacidad inválida');
      hasErrors = true;
    } else if (event && event.availableSpots !== undefined && 
              parseInt(capacity) < (event.capacity - event.availableSpots)) {
      setCapacityError(`La capacidad actualizada debe ser mayor a las reservas actuales. Reservas actuales: ${event.capacity - event.availableSpots}`);
      hasErrors = true;
    } else {
      setCapacityError('');
    }
  
    if (!price.trim()) {
      setPriceError('Por favor ingresa un precio');
      hasErrors = true;
    } else if (parseFloat(price) < 0) {
      setPriceError('El precio no puede ser negativo');
      hasErrors = true;
    } else {
      setPriceError('');
    }
  
    if (!description.trim()) {
      setDescriptionError('Por favor ingresa una descripción');
      hasErrors = true;
    } else {
      setDescriptionError('');
    }
  
    if (hasErrors) {
      return;
    }
  
    // Mostrar indicador de carga
    setLoading(true);
  
    try {
      // Obtener token de autenticación
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        showCustomPopup(
          'Error', 
          'No se encontró un token de autenticación', 
          [{ text: 'OK', onPress: () => router.push('/auth/login') }]
        );
        return;
      }
      
      // Preparar datos del evento - omitiendo la imagen
      const eventData = {
        name: event?.name || event?.title, 
        location,
        category: event?.category,
        capacity: parseInt(capacity),
        price: parseFloat(price),
        date: formattedDate,
        hour: time || event?.time || event?.hour,
        description
      };
      
      console.log('Actualizando evento con datos:', eventData);
      
      // Llamar a la API para actualizar el evento
      await updateEvent(eventId, eventData, token);
      
      showCustomPopup(
        'Éxito', 
        'Evento actualizado correctamente', 
        [{ text: 'OK', style: 'success', onPress: () => router.push("/home") }]
      );
    } catch (error) {
      console.error('Error al actualizar el evento:', error);
      showCustomPopup(
        'Error', 
        'No se pudo actualizar el evento. Inténtalo de nuevo más tarde.', 
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveEvent = () => {
    showCustomPopup(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: requestDeletion }
      ]
    );
  };

  const requestDeletion = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        showCustomPopup(
          'Error', 
          'No se encontró un token de autenticación', 
          [{ text: 'OK', onPress: () => router.push('/auth/login') }]
        );
        return;
      }
      
      // Solicitar el código OTP para eliminar el evento
      const response = await requestEventDeletion(eventId, token);
      
      // Mostrar el modal para ingresar el código OTP
      setShowOtpModal(true);
      
      showCustomPopup(
        'Código de verificación enviado',
        'Hemos enviado un código de verificación a tu teléfono y correo electrónico. Por favor, ingrésalo para confirmar la eliminación del evento.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error al solicitar la eliminación del evento:', error);
      showCustomPopup(
        'Error', 
        'No se pudo solicitar la eliminación del evento. Inténtalo de nuevo más tarde.', 
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDeletion = async () => {
    if (!otpCode.trim()) {
      setOtpError('Por favor ingresa el código de verificación');
      return;
    }
    
    if (otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
      setOtpError('El código debe tener 6 dígitos');
      return;
    }
    
    setOtpError('');
    setConfirmingDeletion(true);
    
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        showCustomPopup(
          'Error', 
          'No se encontró un token de autenticación', 
          [{ text: 'OK', onPress: () => router.push('/auth/login') }]
        );
        return;
      }
      
      // Confirmar la eliminación con el código OTP
      await confirmEventDeletion(eventId, otpCode, token);
      
      setShowOtpModal(false);
      setOtpCode('');
      
      showCustomPopup(
        'Éxito', 
        'Evento eliminado correctamente', 
        [{ text: 'OK', style: 'success', onPress: () => router.push("/home") }]
      );
    } catch (error) {
      console.error('Error al confirmar la eliminación del evento:', error);
      setOtpError('Código inválido o expirado. Inténtalo de nuevo.');
    } finally {
      setConfirmingDeletion(false);
    }
  };

  const handleCancelDeletion = () => {
    setShowOtpModal(false);
    setOtpCode('');
    setOtpError('');
  };

  const handleDateChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    const truncatedValue = numericValue.slice(0, 8);
    
    let formatted = '';
    if (truncatedValue.length > 4) {
      formatted = `${truncatedValue.substring(0, 2)}/${truncatedValue.substring(2, 4)}/${truncatedValue.substring(4)}`;
      
      // Solo validar cuando tenemos fecha completa (8 dígitos)
      if (truncatedValue.length === 8) {
        const day = parseInt(truncatedValue.substring(0, 2), 10);
        const month = parseInt(truncatedValue.substring(2, 4), 10);
        const year = parseInt(truncatedValue.substring(4), 10);
        validateDate(day, month, year);
      } else {
        setDateError('La fecha debe tener el formato DD/MM/YYYY');
      }
    } else if (truncatedValue.length > 2) {
      formatted = `${truncatedValue.substring(0, 2)}/${truncatedValue.substring(2)}`;
      setDateError('La fecha debe tener el formato DD/MM/YYYY');
    } else {
      formatted = truncatedValue;
      setDateError('La fecha debe tener el formato DD/MM/YYYY');
    }
    
    setDate(numericValue);
    setFormattedDate(formatted);
  };
  
  const validateDate = (day, month, year) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; 
    const currentDay = currentDate.getDate();
  
    // Validar que el año tenga exactamente 4 dígitos y sea razonable
    if (year.toString().length !== 4 || year < 2000 || year > 2100) {
      setDateError('Ingrese un año válido (4 dígitos, entre 2000-2100)');
      return false;
    }
  
    if (month < 1 || month > 12) {
      setDateError('Mes inválido (1-12)');
      return false;
    }
    
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
      setDateError(`Día inválido para el mes (1-${daysInMonth})`);
      return false;
    }
    
    if (year < currentYear || 
        (year === currentYear && month < currentMonth) || 
        (year === currentYear && month === currentMonth && day < currentDay)) {
      setDateError('La fecha no puede ser anterior a hoy');
      return false;
    }
  
    setDateError(''); 
    return true;
  };

  const handleLocationChange = (text) => {
    setLocation(text);
    if (text) setLocationError('');
  };

  const handleCapacityChange = (text) => {
    const numericRegex = /^[0-9]*$/;
    if (numericRegex.test(text)) {
      setCapacity(text);
      if (text) setCapacityError('');
    }
  };

  const handlePriceChange = (text) => {
    const decimalRegex = /^[0-9]*(\.[0-9]{0,2})?$/;
    if (decimalRegex.test(text)) {
      setPrice(text);
      if (text) setPriceError('');
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => ({
    label: `${i}:00`,
    value: `${i}:00`,
  }));

  // Renderizar pantalla de carga mientras se obtienen los datos
  if (loading) {
    return (
      <MainPageContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5FAA9D" />
          <Text style={styles.loadingText}>Cargando información del evento...</Text>
        </View>
      </MainPageContainer>
    );
  }

  // Renderizar mensaje de error si ocurrió algún problema
  if (error) {
    return (
      <MainPageContainer>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.createButton} onPress={() => router.back()}>
            <Text style={styles.createButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </MainPageContainer>
    );
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
        <View style={styles.eventContainer}>
          {/* Área de imagen - ahora solo para mostrar, no para editar */}
          <View style={styles.imagePlaceholder}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.placeholderContent}>
                <Text style={styles.placeholderSubText}>Sin imagen</Text>
              </View>
            )}
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.adminText}>Editar evento</Text>

            {/* Nombre del evento - no editable */}
            <Text style={styles.eventTitle}>{event?.name || event?.title}</Text>
        
            <View style={styles.infoContainer}>
              <View style={styles.infoColumn}>
                <View style={styles.inputWithIcon}>
                  <Text style={styles.inputIcon}>📍</Text>
                  <TextInput
                    style={styles.infoInput}
                    value={location}
                    onChangeText={handleLocationChange}
                    editable={true}
                    placeholder="Ubicación"
                  />
                </View>
                
                {/* Categoría - no editable */}
                <View style={styles.categorySpace}>
                  <Text style={styles.pickerIcon}>🏷️</Text>
                  <Text style={styles.infoInput}>{event?.category}</Text>
                </View>
              </View>

              <View style={styles.infoColumn}>
                <View style={styles.inputWithIcon}>
                  <Text style={styles.inputIcon}>🗓️</Text>
                  <TextInput
                    style={styles.infoInput}
                    value={formattedDate}
                    onChangeText={handleDateChange}
                    keyboardType="number-pad"
                    maxLength={10}
                    editable={true}
                    placeholder="DD/MM/AAAA"
                  />
                </View>
                
                <View style={styles.pickerWrapper}>
                  <Text style={styles.pickerIcon}>⏰</Text>
                  <RNPickerSelect
                    onValueChange={(value) => setTime(value)}
                    items={hours}
                    placeholder={{ label: time || "Seleccionar hora", value: null }}
                    style={pickerSelectStyles}
                    value={time}
                  />
                </View>
              </View>
            </View>

            <View style={styles.capacityPriceContainer}>
              <View style={styles.inputWithIcon}>
                <Text style={styles.inputIcon}>👥</Text>
                <TextInput
                  style={styles.capacityInput}
                  value={capacity}
                  onChangeText={handleCapacityChange}
                  keyboardType="number-pad"
                  editable={true}
                  placeholder="Capacidad"
                />
              </View>
              
              <View style={styles.inputWithIcon}>
                <Text style={styles.inputIcon}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={price}
                  onChangeText={handlePriceChange}
                  editable={true}
                  keyboardType="decimal-pad"
                  placeholder="Precio"
                />
              </View>
            </View>

            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                if (text.trim()) setDescriptionError('');
              }}
              multiline={true}
              editable={true}
              placeholder="Descripción del evento..."
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[
                  styles.createButton, 
                  (dateError || locationError || capacityError || priceError || descriptionError) && styles.disabledButton
                ]}
                onPress={handleSaveEvent}
                disabled={
                  !!dateError || !!locationError || !!capacityError || !!priceError || !!descriptionError
                }
              >
                <Text style={styles.createButtonText}>Guardar cambios</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.createButton, styles.deleteButton]}
                onPress={handleRemoveEvent}
              >
                <Text style={styles.createButtonText}>Eliminar evento</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.errorMessagesContainer}>
              {locationError ? <Text style={styles.errorText}>{locationError}</Text> : null}
              {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
              {capacityError ? <Text style={styles.errorText}>{capacityError}</Text> : null}
              {priceError ? <Text style={styles.errorText}>{priceError}</Text> : null}
              {descriptionError ? <Text style={styles.errorText}>{descriptionError}</Text> : null}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal para ingresar código OTP */}
      <Modal
        visible={showOtpModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelDeletion}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Verificación de seguridad</Text>
            <Text style={styles.modalDescription}>
              Ingresa el código de 6 dígitos que enviamos a tu teléfono y correo electrónico para confirmar la eliminación del evento.
            </Text>

            <View style={styles.inputWithIcon}>
              <Text style={styles.inputIcon}>🔐</Text>
              <TextInput
                style={styles.otpInput}
                value={otpCode}
                onChangeText={(text) => {
                  setOtpCode(text);
                  if (text) setOtpError('');
                }}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="Código de verificación"
                editable={!confirmingDeletion}
              />
            </View>
            
            {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelDeletion}
                disabled={confirmingDeletion}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.modalButton, 
                  styles.confirmButton,
                  confirmingDeletion && styles.disabledButton
                ]}
                onPress={handleConfirmDeletion}
                disabled={confirmingDeletion}
              >
                {confirmingDeletion ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.modalButtonText}>Confirmar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </MainPageContainer>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    color: '#777',
    paddingVertical: 10,
    paddingLeft: 35,
    marginLeft: -5,
    flex: 1,
  },
  inputAndroid: {
    fontSize: 14,
    color: '#777',
    paddingVertical: 10,
    paddingLeft: 35,
    marginLeft: -5,
    flex: 1,
  },
  placeholder: {
    color: '#777',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  errorMessagesContainer: {
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  eventContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  imagePlaceholder: {
    width: 400,
    height: 500,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
  },
  adminText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#5FAA9D',
    marginBottom: 20,
    paddingVertical: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoColumn: {
    flex: 1,
    marginRight: 10,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
  },
  categorySpace: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inputIcon: {
    width: 25,
    fontSize: 16,
    textAlign: 'center',
  },
  pickerIcon: {
    width: 25,
    fontSize: 16,
  },
  infoInput: {
    flex: 1,
    fontSize: 14,
    color: '#777',
    paddingVertical: 10,
  },
  capacityPriceContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    flex: 1,
  },
  capacityInput: {
    flex: 1,
    fontSize: 14,
    color: '#777',
    marginRight: 10,
    paddingVertical: 10,
    paddingLeft: 25,
  },
  priceInput: {
    flex: 1,
    fontSize: 14,
    color: '#777',
    paddingVertical: 10,
    paddingLeft: 25,
  },
  descriptionInput: {
    fontSize: 14,
    color: '#666',
    padding: 10,
    minHeight: 100,
    marginBottom: 20,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 20, 
  },
  createButton: {
    backgroundColor: '#5FAA9D',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  placeholderContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 48,
    color: '#5FAA9D',
    marginBottom: 8,
  },
  placeholderSubText: {
    fontSize: 16,
    color: '#5FAA9D',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  
  // Estilos para el modal OTP
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  otpInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
    letterSpacing: 2,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#E74C3C',
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  // Estilos para popup personalizado
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
  }
});

export default EditEvent;