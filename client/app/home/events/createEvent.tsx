import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const CreateEvent = () => {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState(null);

  // Validación para capacidad (solo números enteros)
  const handleCapacityChange = (text) => {
    const numericRegex = /^[0-9]*$/;
    if (numericRegex.test(text)) {
      setCapacity(text);
    }
  };

  // Validación para precio (números con hasta 2 decimales)
  const handlePriceChange = (text) => {
    const decimalRegex = /^[0-9]*(\.[0-9]{0,2})?$/;
    if (decimalRegex.test(text)) {
      setPrice(text);
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

  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      label: date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
      value: date.toISOString().split('T')[0],
    };
  });

  return (
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
          <Text style={styles.adminText}>Creando nuevo evento</Text>
          <TextInput
            style={styles.eventTitle}
            value={eventName}
            onChangeText={setEventName}
            placeholder="NOMBRE DEL EVENTO"
            placeholderTextColor="#E74C3C"
          />

          <View style={styles.infoContainer}>
            <View style={styles.infoColumn}>
              <View style={styles.inputWithIcon}>
                <Text style={styles.inputIcon}>📍</Text>
                <TextInput
                  style={styles.infoInput}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Ubicación"
                  placeholderTextColor="#777"
                />
              </View>
              
              <View style={styles.pickerWrapper}>
                <Text style={styles.pickerIcon}>🏷️</Text>
                <RNPickerSelect
                  onValueChange={(value) => setCategory(value)}
                  items={categories}
                  placeholder={{ label: 'Selecciona categoría', value: null }}
                  style={pickerSelectStyles}
                  value={category}
                />
              </View>
            </View>

            <View style={styles.infoColumn}>
              <View style={styles.pickerWrapper}>
                <Text style={styles.pickerIcon}>🗓️</Text>
                <RNPickerSelect
                  onValueChange={(value) => setDate(value)}
                  items={dates}
                  placeholder={{ label: 'Selecciona fecha', value: null }}
                  style={pickerSelectStyles}
                  value={date}
                />
              </View>
              
              <View style={styles.pickerWrapper}>
                <Text style={styles.pickerIcon}>⏰</Text>
                <RNPickerSelect
                  onValueChange={(value) => setTime(value)}
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
                placeholder="Precio (ej: 25.99)"
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
          />

          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>¡Crear evento!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// (Los estilos pickerSelectStyles y styles permanecen IGUAL que en tu versión anterior)
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
    color: '#E74C3C',
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
    backgroundColor: '#2ECC71',
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
});
export default CreateEvent;