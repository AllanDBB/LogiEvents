import React, { useState } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  Text, 
  SafeAreaView,
  useColorScheme,
  useWindowDimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import MenuPopup from './menuPopUp';

type navProps = {
  children?: React.ReactNode;
  isLogged: boolean;
  onEventClick: () => void;
};

function Navbar(props: navProps)  {
  const [isMobileMenuVisible, setMobileMenuVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter(); // Using Expo Router
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!isMobileMenuVisible);
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      
      <View style={styles.header}>
        <Text style={[styles.logo, isDarkMode ? styles.darkText : styles.lightText]}>LogiEvents</Text>
        
        {!isMobile && (
          <View style={styles.navLinks}>
            <TouchableOpacity>
              <Text 
                style={[styles.navLink, isDarkMode ? styles.darkText : styles.lightText]}
                onPress={() => props.isLogged ? router.push("/") : router.push("/auth/register")}
              >
                Inicio
              </Text>
            </TouchableOpacity>
          
            <TouchableOpacity>
              <Text 
                style={[styles.navLink, isDarkMode ? styles.darkText : styles.lightText]}
                onPress={props.onEventClick}
              >
                Eventos
              </Text>
            </TouchableOpacity>
          
            <TouchableOpacity>
              <Text 
                style={[styles.navLink, isDarkMode ? styles.darkText : styles.lightText]}
                onPress={() => router.push("/home" )}
              >
                Políticas
              </Text>
            </TouchableOpacity>
          </View> 
        )}
        
        <View style={styles.btnSection}>
          <TouchableOpacity 
            style={[styles.btnGeneral, styles.btn1, isDarkMode ? styles.darkBtn1 : styles.lightBtn1]}
            onPress={() => props.isLogged ? router.push("/home/events") : router.push("/auth/login")}>
            <Text style={[styles.btnSectionText, isDarkMode ? styles.darkBtn1Text : styles.lightBtn1Text]}>
              {props.isLogged ? 'Mis eventos' : 'Iniciar sesión'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.btnGeneral, styles.btn2, isDarkMode ? styles.darkBtn2 : styles.lightBtn2]}
            onPress={() => props.isLogged ? router.push("/home/profile") : router.push("/auth/register")}
          >
            <Text style={[styles.btnSectionText, isDarkMode ? styles.darkBtn2Text : styles.lightBtn2Text]}>
              {props.isLogged ? 'Perfil' : 'Registrarse'}
            </Text>
          </TouchableOpacity>
        </View>
        {isMobile && (
          <TouchableOpacity style={styles.menuButton} onPress={toggleMobileMenu}>
            <Text style={[styles.menuText, isDarkMode ? styles.darkText : styles.lightText]}>☰</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {props.children}

      <MenuPopup 
        visible={isMobileMenuVisible} 
        onClose={toggleMobileMenu} 
        isLogged={props.isLogged} 
        onEventClick={props.onEventClick}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  lightContainer: {
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#1a1d21',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  lightText: {
    color: '#333333',
  },
  darkText: {
    color: '#ffffff',
  },
  navLinks: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  navLink: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  btnSection: {
    flexDirection: 'row',
  },
  btnGeneral: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 5,
    maxWidth: 90,
  },
  btn1: {
    borderWidth: 1,
  },
  lightBtn1: {
    borderColor: '#333333',
  },
  darkBtn1: {
    borderColor: '#ffffff',
  },
  btn2: {
    marginRight: 10,
  },
  lightBtn2: {
    backgroundColor: '#333333',
  },
  darkBtn2: {
    backgroundColor: '#ffffff',
  },
  btnSectionText: {
    fontSize: 8,
  },
  lightBtn1Text: {
    color: '#333333',
  },
  darkBtn1Text: {
    color: '#ffffff',
  },
  lightBtn2Text: {
    color: '#ffffff',
  },
  darkBtn2Text: {
    color: '#333333',
  },
  menuButton: {
    padding: 5,
  },
  menuText: {
    fontSize: 24,
  },
});

export default Navbar;