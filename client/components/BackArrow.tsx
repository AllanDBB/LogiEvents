import React, { useEffect } from 'react';
import { Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const BackArrow = ({ onPress }: { onPress: () => void }) => {
  useEffect(() => {
    // Only run in web environment
    if (Platform.OS === 'web') {
      console.log('BackArrow component loaded for web');
    }
  }, []);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Ionicons name="arrow-back" size={19} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Posiciona la flecha de forma independiente
    top: 10,              // Ajusta la altura desde la parte superior
    left: 20,             // Ajusta la posición horizontal
    padding: 8,
  },
});

export default BackArrow;