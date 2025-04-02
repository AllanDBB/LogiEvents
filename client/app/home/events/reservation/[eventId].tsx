import MainPageContainer from '@/components/MainPageContainer';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, Picker } from 'react-native';
import { RelativePathString, useRouter } from "expo-router";

const Reservation = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    spots: ''
  });

  const [formErrors, setFormErrors] = useState({
    email: false,
    phone: false,
    spots: false
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [reservationDetails, setReservationDetails] = useState(null);

  const tempData = {
    title: "Fiesta",
    description: "Gran fiesta en la playa con musica en vivo y juegos",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-red.png",
    category: "Ocio",
    date: "23/01/2026",
    time: "08:00",
    location: "Liberia, Guanacaste",
    availableSpots: 45, 
    admin: "Starticket",
    capacity: 300,
    price: 7,
  };

  const [pickerItems, setPickerItems] = useState([]);
  const takenSpots = tempData.capacity - tempData.availableSpots;

  const isFormValid = () => {
    return (
      formData.fullName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.spots !== '' &&
      !formErrors.email &&
      !formErrors.phone &&
      !formErrors.spots
    );
  };

  useEffect(() => {
    const items = [];
    items.push(<Picker.Item key="placeholder" label="Seleccione cantidad" value="" />);
    
    for (let i = 1; i <= tempData.availableSpots; i++) {
      items.push(
        <Picker.Item 
          key={i} 
          label={`${i} espacio${i > 1 ? 's' : ''}`} 
          value={i.toString()} 
        />
      );
    }
    
    setPickerItems(items);
  }, [tempData.availableSpots]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    return phone.length >= 8 && /^\d+$/.test(phone);
  };

  const validateSpots = (spots) => {
    return spots !== '' && parseInt(spots) <= tempData.availableSpots;
  };

  const handleInputChange = (name, value) => {
    if (name === 'email') {
      setFormErrors({...formErrors, email: value.trim() !== '' && !validateEmail(value)});
    }
    if (name === 'phone') {
      setFormErrors({...formErrors, phone: value.trim() !== '' && !validatePhone(value)});
    }
    if (name === 'spots') {
      setFormErrors({...formErrors, spots: value !== '' && !validateSpots(value)});
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;

    const spotsNumber = parseInt(formData.spots);
    const reservationData = {
      event: {
        title: tempData.title,
        date: tempData.date,
        location: tempData.location,
        admin: tempData.admin
      },
      user: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone
      },
      reservation: {
        spots: spotsNumber,
        reservationDate: new Date().toISOString(),
        totalPrice: spotsNumber * tempData.price,
        reservationId: Math.random().toString(36).substring(2, 9).toUpperCase()
      }
    };

    

    console.log('Datos de reserva:', JSON.stringify(reservationData, null, 2));

    setReservationDetails(reservationData);
    setShowSuccess(true);
    
  };

  const handleNewReservation = () => {

    router.push("/home/events/myEvents");
  };

  return (
    <MainPageContainer>
      <ScrollView style={styles.container}>
        <View style={styles.eventContainer}>
          <View style={styles.imagePlaceholder}>
            {tempData.image && (
              <Image 
                source={{ uri: tempData.image }} 
                style={styles.eventImage}
                resizeMode="cover"
              />
            )}
          </View>
  
          <View style={styles.detailsContainer}>
            <Text style={styles.adminText}>{tempData.admin}</Text>
            <Text style={styles.eventTitle}>{tempData.title}</Text>
            <Text style={styles.description}>{tempData.description}</Text>
  
            <View style={styles.infoContainer}>
              <View style={styles.infoColumn}>
                <Text style={styles.infoText}>📍 {tempData.location}</Text>
                <Text style={styles.infoText}>🏷️ {tempData.category}</Text>
              </View>
              <View style={styles.infoColumn}>
                <Text style={styles.infoText}>🗓️ {tempData.date}</Text>
                <Text style={styles.infoText}>⏰ {tempData.time}</Text>
              </View>
            </View>

            <View style={styles.capacityContainer}>
              <Text style={styles.infoText}>👥 {takenSpots} / {tempData.capacity}</Text>
              <Text style={styles.availableText}>Espacios disponibles: {tempData.availableSpots}</Text>
              <Text style={styles.priceText}>Precio por espacio: ₡{tempData.price}</Text>
            </View>

            {!showSuccess ? (
              <View style={styles.formContainer}>
                <Text style={styles.formLabel}>Nombre completo*</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Ingrese su nombre completo"
                  value={formData.fullName}
                  onChangeText={(text) => handleInputChange('fullName', text)}
                />
                
                <Text style={styles.formLabel}>Correo electrónico*</Text>
                <TextInput 
                  style={[styles.input, formErrors.email && styles.inputError]}
                  placeholder="ejemplo@correo.com"
                  keyboardType="email-address"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                />
                {formErrors.email && <Text style={styles.errorText}>Formato de email inválido</Text>}
                
                <Text style={styles.formLabel}>Número telefónico*</Text>
                <TextInput 
                  style={[styles.input, formErrors.phone && styles.inputError]}
                  placeholder="88888888"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange('phone', text)}
                  maxLength={8}
                />
                {formErrors.phone && <Text style={styles.errorText}>Debe tener 8 dígitos</Text>}
                
                <Text style={styles.formLabel}>Espacios a reservar*</Text>
                <View style={[styles.pickerContainer, formErrors.spots && styles.inputError]}>
                  <Picker
                    style={styles.picker}
                    selectedValue={formData.spots}
                    onValueChange={(itemValue) => handleInputChange('spots', itemValue)}
                  >
                    {pickerItems}
                  </Picker>
                </View>
                {formErrors.spots && <Text style={styles.errorText}>Cantidad no disponible</Text>}

                {formData.spots && (
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>
                      Total a pagar: ₡{formData.spots * tempData.price}
                    </Text>
                  </View>
                )}

                <TouchableOpacity 
                  style={[styles.createButton, !isFormValid() && styles.disabledButton]}
                  onPress={handleSubmit}
                  disabled={!isFormValid()}
                >
                  <Text style={styles.createButtonText}>Confirmar reserva</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.successContainer}>
                <Text style={styles.successTitle}>¡Reserva confirmada!</Text>
                <Text style={styles.successText}>ID de reserva: {reservationDetails.reservation.reservationId}</Text>
                <Text style={styles.successText}>Evento: {reservationDetails.event.title}</Text>
                <Text style={styles.successText}>Fecha: {reservationDetails.event.date}</Text>
                <Text style={styles.successText}>Espacios: {reservationDetails.reservation.spots}</Text>
                <Text style={styles.successText}>Total pagado: ₡{reservationDetails.reservation.totalPrice}</Text>
                <Text style={styles.successSubtext}>
                  Se envió un comprobante a {reservationDetails.user.email}
                </Text>

                <TouchableOpacity 
                  style={[styles.createButton, styles.newReservationButton]}
                  onPress={handleNewReservation}
                >
                  <Text style={styles.createButtonText}>
                    Ver más eventos</Text>
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
  eventContainer: {
    padding: 16,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
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
    marginTop: -10,
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
  successContainer: {
    marginTop: 8,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  successTitle: {
    fontSize: 18,
    color: '#27AE60',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  successText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 12,
    fontStyle: 'italic',
  },
  newReservationButton: {
    backgroundColor: '#2980B9',
    marginTop: 16,
  },
});

export default Reservation;