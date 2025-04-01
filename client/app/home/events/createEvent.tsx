import MainPageContainer from '@/components/MainPageContainer';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { RelativePathString, useRouter } from "expo-router";

const CreateEvent = () => {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [dateError, setDateError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [eventNameError, setEventNameError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [capacityError, setCapacityError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const router = useRouter();

  const handleCreateEvent = () => {
    let hasErrors = false;

    if (!eventName) {
      setEventNameError('Por favor ingresa un nombre para el evento');
      hasErrors = true;
    } else {
      setEventNameError('');
    }

    if (!location) {
      setLocationError('Por favor ingresa una ubicación');
      hasErrors = true;
    } else {
      setLocationError('');
    }

    if (!category) {
      setCategoryError('Por favor selecciona una categoría');
      hasErrors = true;
    } else {
      setCategoryError('');
    }

    if (!time) {
      setTimeError('Por favor selecciona una hora');
      hasErrors = true;
    } else {
      setTimeError('');
    }

    if (!capacity) {
      setCapacityError('Por favor ingresa la capacidad');
      hasErrors = true;
    } else {
      setCapacityError('');
    }

    if (!price) {
      setPriceError('Por favor ingresa un precio');
      hasErrors = true;
    } else {
      setPriceError('');
    }

    if (!description) {
      setDescriptionError('Por favor ingresa una descripción');
      hasErrors = true;
    } else {
      setDescriptionError('');
    }
  
    if (dateError) {
      hasErrors = true;
    }
  
    if (hasErrors) {
      return;
    }
  
    
    const eventData = {
      eventName,
      location,
      category,
      capacity: capacity ? parseInt(capacity) : null,
      price: price ? parseFloat(price) : null,
      date: formattedDate,
      time,
      image,
      description
    };
    
    console.log('Datos del evento:', eventData);

    router.push("/home/events/myEvents");
    
    return eventData;
  };

  const handleEventCreated = () => {
    router.push("/home/events/myEvents");
  };

  useEffect(() => {
    if (date.length === 8 && !date.includes('/')) {
      const day = date.substring(0, 2);
      const month = date.substring(2, 4);
      const year = date.substring(4, 8);
      setFormattedDate(`${day}/${month}/${year}`);
    }
  }, [date]);

  const validateDate = (day, month, year) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; 
    const currentDay = currentDate.getDate();

  
    if (year < currentYear) {
      setDateError('El año no puede ser anterior al actual');
      return false;
    }

  
    if (month < 1 || month > 12) {
      setDateError('Mes inválido (debe ser entre 1 y 12)');
      return false;
    }

    
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
      setDateError(`Día inválido para el mes seleccionado (máx ${daysInMonth})`);
      return false;
    }

    
    if (year === currentYear) {
      if (month < currentMonth || (month === currentMonth && day < currentDay)) {
        setDateError('La fecha no puede ser anterior a hoy');
        return false;
      }
    }

    setDateError(''); 
    return true;
  };

  const handleDateChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    const truncatedValue = numericValue.slice(0, 8);
    
    let formatted = '';
    if (truncatedValue.length > 4) {
      formatted = `${truncatedValue.substring(0, 2)}/${truncatedValue.substring(2, 4)}/${truncatedValue.substring(4)}`;
      
      
      if (truncatedValue.length === 8) {
        const day = parseInt(truncatedValue.substring(0, 2));
        const month = parseInt(truncatedValue.substring(2, 4));
        const year = parseInt(truncatedValue.substring(4));
        validateDate(day, month, year);
      } else {
        setDateError(''); 
      }
    } else if (truncatedValue.length > 2) {
      formatted = `${truncatedValue.substring(0, 2)}/${truncatedValue.substring(2)}`;
      setDateError(''); 
    } else {
      formatted = truncatedValue;
      setDateError(''); 
    }
    
    setDate(numericValue);
    setFormattedDate(formatted);
  };

  const handleEventNameChange = (text) => {
    setEventName(text);
    if (text) setEventNameError('');
  };

  const handleLocationChange = (text) => {
    setLocation(text);
    if (text) setLocationError('');
  };

  const handleTimeChange = (value) => {
    setTime(value);
    if (value) setTimeError('');
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

  const handleDescriptionChange = (text) => {
    setDescription(text);
    if (text) setDescriptionError('');
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    if (value) {
      setCategoryError('');
    }
  };

  const categories = [
    { label: 'Música', value: 'music' },
    { label: 'Deportes', value: 'sports' },
    { label: 'Arte', value: 'art' },
    { label: 'Gastronomía', value: 'food' },
    { label: 'Tecnología', value: 'tech' },
  ];

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
            <Text>Agregar imagen</Text>
          )}
        </TouchableOpacity>

        <View style={styles.detailsContainer}>
          <Text style={styles.adminText}>Crear nuevo evento</Text>


          <TextInput
            style={styles.eventTitle}
            value={eventName}
            onChangeText={handleEventNameChange} 
            placeholder="NOMBRE DEL EVENTO"
            placeholderTextColor="#5FAA9D"
            editable={true} 
            maxLength={60} 
          />

          <View style={styles.infoContainer}>
            <View style={styles.infoColumn}>
              <View style={styles.inputWithIcon}>
                <Text style={styles.inputIcon}>📍</Text>
                <TextInput
                  style={styles.infoInput}
                  value={location}
                  onChangeText={handleLocationChange}
                  placeholder="Ubicación"
                  placeholderTextColor="#777"
                />
              </View>
              
              <View style={styles.pickerWrapper}>
                <Text style={styles.pickerIcon}>🏷️</Text>
                <RNPickerSelect
                  onValueChange={handleCategoryChange}
                  items={categories}
                  placeholder={{ label: 'Selecciona categoría', value: null }}
                  style={pickerSelectStyles}
                  value={category}
                />
              </View>
            </View>

            <View style={styles.infoColumn}>
              <View style={styles.inputWithIcon}>
                <Text style={styles.inputIcon}>🗓️</Text>
                <TextInput
                  style={styles.infoInput}
                  value={formattedDate}
                  onChangeText={handleDateChange}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#777"
                  keyboardType="number-pad"
                  maxLength={10}
                />
              </View>
              
              <View style={styles.pickerWrapper}>
                <Text style={styles.pickerIcon}>⏰</Text>
                <RNPickerSelect
                  onValueChange={handleTimeChange}
                  items={hours}
                  placeholder={{ label: 'Selecciona hora', value: null }}
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
                placeholder="Capacidad"
                placeholderTextColor="#777"
                keyboardType="number-pad"
              />
            </View>
            
            <View style={styles.inputWithIcon}>
              <Text style={styles.inputIcon}>$</Text>
              <TextInput
                style={styles.priceInput}
                value={price}
                onChangeText={handlePriceChange}
                placeholder="Precio"
                placeholderTextColor="#777"
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <TextInput
            style={styles.descriptionInput}
            multiline
            placeholder="Descripción del evento..."
            placeholderTextColor="#777"
            numberOfLines={4}
            onChangeText={handleDescriptionChange}
            editable={true} 
          />

          <TouchableOpacity 
            style={[
              styles.createButton, 
              (dateError || categoryError || timeError || eventNameError || 
              locationError || capacityError || priceError || descriptionError) && styles.disabledButton
            ]}
            onPress={handleCreateEvent}
            disabled={
              !!dateError || !!categoryError || !!timeError || !!eventNameError || 
              !!locationError || !!capacityError || !!priceError || !!descriptionError
            }
          >
            <Text style={styles.createButtonText}
            >¡Crear evento!</Text>
          </TouchableOpacity>

          {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
          {categoryError ? <Text style={styles.errorText}>{categoryError}</Text> : null}
          {eventNameError ? <Text style={styles.errorText}>{eventNameError}</Text> : null}
          {locationError ? <Text style={styles.errorText}>{locationError}</Text> : null}
          {timeError ? <Text style={styles.errorText}>{timeError}</Text> : null}
          {capacityError ? <Text style={styles.errorText}>{capacityError}</Text> : null}
          {priceError ? <Text style={styles.errorText}>{priceError}</Text> : null}
          {descriptionError ? <Text style={styles.errorText}>{descriptionError}</Text> : null}



        </View>
      </View>
    </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#5FAA9D',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 400,
    maxWidth: 400,
    alignSelf: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 15,
    alignSelf: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
});

export default CreateEvent;