import MainPageContainer from '@/components/MainPageContainer';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const EditEvent = () => {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState(null);

  let oldData = {
    title: "Fiesta",
    description: "Gran fiesta en la playa con musica en vivo y juegos",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-red.png",
    category: "Ocio",
    date: "23/01/2015",
    time: "08:00",
    location: "Liberia, Guanacaste",
    availableSpots: 4, 
    admin: "Starticket",
    capacity: 300,
    price: 7,
  };


  useEffect(() => {
    if (date.length === 8 && !date.includes('/')) {
      const day = date.substring(0, 2);
      const month = date.substring(2, 4);
      const year = date.substring(4, 8);
      setFormattedDate(`${day}/${month}/${year}`);
    }
  }, [date]);

  const handleDateChange = (text) => {
   
    const numericValue = text.replace(/[^0-9]/g, '');
    
 
    const truncatedValue = numericValue.slice(0, 8);
    

    let formatted = '';
    if (truncatedValue.length > 4) {
      formatted = `${truncatedValue.substring(0, 2)}/${truncatedValue.substring(2, 4)}/${truncatedValue.substring(4)}`;
    } else if (truncatedValue.length > 2) {
      formatted = `${truncatedValue.substring(0, 2)}/${truncatedValue.substring(2)}`;
    } else {
      formatted = truncatedValue;
    }
    
    setDate(numericValue);
    setFormattedDate(formatted);
  };

  const handleCapacityChange = (text) => {
    const numericRegex = /^[0-9]*$/;
    if (numericRegex.test(text)) {
      setCapacity(text);
    }
  };

  
  const handlePriceChange = (text) => {
    const decimalRegex = /^[0-9]*(\.[0-9]{0,2})?$/;
    if (decimalRegex.test(text)) {
      setPrice(text);
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

          <Text style={styles.eventTitle}>{oldData.title}</Text>
        

          <View style={styles.infoContainer}>
            <View style={styles.infoColumn}>
              <View style={styles.inputWithIcon}>
                <Text style={styles.inputIcon}>📍</Text>
                <TextInput
                  style={styles.infoInput}
                  value={location}
                  onChangeText={setLocation}
                  placeholder= {oldData.location}
                  placeholderTextColor="#777"
                />
              </View>
              
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
                  placeholder={oldData.date}
                  placeholderTextColor="#777"
                  keyboardType="number-pad"
                  maxLength={10}
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
                placeholder= {oldData.capacity}
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
                placeholder={oldData.price}
                placeholderTextColor="#777"
                keyboardType="decimal-pad"
              />
            </View>
          </View>



          <Text style={styles.descriptionInput}> {oldData.description}
          </Text>
            
          

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.createButton}>
              <Text style={styles.createButtonText}>Guardar cambios</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.createButton}>
              <Text style={styles.createButtonText}>Eliminar evento</Text>
            </TouchableOpacity>
          </View>


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
  
});

export default EditEvent;