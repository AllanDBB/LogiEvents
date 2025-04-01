import MainPageContainer from '@/components/MainPageContainer';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const EditEvent = () => {
  let oldData = {
    title: "Fiesta",
    description: "Gran fiesta en la playa con musica en vivo y juegos",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-red.png",
    category: "Ocio",
    date: "23/01/2026",
    time: "08:00",
    location: "Liberia, Guanacaste",
    availableSpots: 4, 
    admin: "Starticket",
    capacity: 300,
    price: 7,
  };

  const [location, setLocation] = useState(oldData.location);
  const [capacity, setCapacity] = useState(oldData.capacity.toString());
  const [price, setPrice] = useState(oldData.price.toString());
  const [date, setDate] = useState(oldData.date.replace(/\//g, ''));
  const [formattedDate, setFormattedDate] = useState(oldData.date);
  const [time, setTime] = useState(oldData.time);
  const [image, setImage] = useState(oldData.image);
  const [description, setDescription] = useState(oldData.description);
  
  // Estados de error solo para campos editables
  const [dateError, setDateError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [capacityError, setCapacityError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  useEffect(() => {
    if (date.length === 8 && !date.includes('/')) {
      const day = date.substring(0, 2);
      const month = date.substring(2, 4);
      const year = date.substring(4, 8);
      setFormattedDate(`${day}/${month}/${year}`);
    }
  }, [date]);

  const handleCreateEvent = () => {
    let hasErrors = false;

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
      setCapacityError('La capacidad debe ser mayor a 0');
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
  
    const eventData = {
      eventName: oldData.title, // Usamos el nombre original
      location,
      category: oldData.category, // Usamos la categoría original
      capacity: parseInt(capacity),
      price: parseFloat(price),
      date: formattedDate,
      time: time || oldData.time,
      image,
      description
    };
    
    console.log('Datos del evento:', eventData);
    
    return eventData;
  };

  const handleDateChange = (text) => {
    // Eliminar cualquier carácter que no sea número
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

  return (
    <MainPageContainer>
      <ScrollView style={styles.container}>
        <View style={styles.eventContainer}>
          <TouchableOpacity style={styles.imagePlaceholder}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Text>Cambiar imagen</Text>
            )}
          </TouchableOpacity>

          <View style={styles.detailsContainer}>
            <Text style={styles.adminText}>Editar evento</Text>

            {/* Nombre del evento - no editable */}
            <Text style={styles.eventTitle}>{oldData.title}</Text>
        
            <View style={styles.infoContainer}>
              <View style={styles.infoColumn}>
                <View style={styles.inputWithIcon}>
                  <Text style={styles.inputIcon}>📍</Text>
                  <TextInput
                    style={styles.infoInput}
                    value={location}
                    onChangeText={handleLocationChange}
                    editable={true}
                  />
                </View>
                
                
                {/* Categoría - no editable */}
                <View style={styles.categorySpace}>
                  <Text style={styles.pickerIcon}>🏷️</Text>
                  <Text style={styles.infoInput}>{oldData.category}</Text>
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
                  />
                </View>
                
                
                <View style={styles.pickerWrapper}>
                  <Text style={styles.pickerIcon}>⏰</Text>
                  <RNPickerSelect
                    onValueChange={(value) => setTime(value)}
                    items={hours}
                    placeholder={{ label: oldData.time, value: null }}
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
            />
            

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[
                  styles.createButton, 
                  (dateError || locationError || capacityError || priceError || descriptionError) && styles.disabledButton
                ]}
                onPress={handleCreateEvent}
                disabled={
                  !!dateError || !!locationError || !!capacityError || !!priceError || !!descriptionError
                }
              >
                <Text style={styles.createButtonText}>Guardar cambios</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.createButton}>
                <Text style={styles.createButtonText}>Eliminar evento</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.errorContainer}>

              {locationError ? <Text style={styles.errorText}>{locationError}</Text> : null}
              {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
              {capacityError ? <Text style={styles.errorText}>{capacityError}</Text> : null}
              {priceError ? <Text style={styles.errorText}>{priceError}</Text> : null}
              {descriptionError ? <Text style={styles.errorText}>{descriptionError}</Text> : null}

            </View>
            



          </View>
        </View>
      </ScrollView>
    </MainPageContainer>
  );
};

// Estilos permanecen igual...
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
  errorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20,
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
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
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
    borderRadius:5,
  },
  categorySpace:{
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
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 25,
  },
});

export default EditEvent;