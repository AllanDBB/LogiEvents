import React from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  searchStyles: any;
}

function SearchBar(props: SearchBarProps) {
  return (
    <View style={props.searchStyles.container}>
      <TouchableOpacity style={props.searchStyles.iconContainer}>
        <Icon name="search" size={20} color="#6c757d" /> {/* Ícono de lupa */}
      </TouchableOpacity>

      <TextInput
        style={props.searchStyles.input}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor="#6c757d"
      />
    </View>
  );
}

export default SearchBar;

