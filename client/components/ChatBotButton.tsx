import React, { useState } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity,  
  useColorScheme,
  Platform,
  View 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import ChatPopUp from './ChatPopUp';


function ChatBotButton() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [isChatVisible, setIsChatVisible] = useState(false);
  
  // Function to handle chat button press
  const handleChatPress = () => {
    if (Platform.OS !== 'web') {
      impactAsync(ImpactFeedbackStyle.Medium);
    }
    
    setIsChatVisible(true);
  };

  // Handle closing the chat
  const handleCloseChat = () => {
    setIsChatVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.chatButton,
          isDarkMode ? styles.chatButtonDark : styles.chatButtonLight
        ]}
        onPress={handleChatPress}
        activeOpacity={0.8}
      >
        <Ionicons 
          name="chatbubble-ellipses-outline" 
          size={24} 
          color={isDarkMode ? "#ffffff" : "#212529"} 
        />
      </TouchableOpacity>
      
      <ChatPopUp 
        visible={isChatVisible} 
        onClose={handleCloseChat} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chatButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 1000,
  },
  chatButtonLight: {
    backgroundColor: '#D9D9D9',
  },
  chatButtonDark: {
    backgroundColor: '#333',
  },
});

export default ChatBotButton;