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

type NavbarProps = {
  children?: React.ReactNode;
  isLogged: boolean;
};

function Navbar({ children, isLogged }: NavbarProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const [isMobileMenuVisible, setMobileMenuVisible] = useState(false);
  
  const isDarkMode = colorScheme === 'dark';
  const isMobile = width < 600;

  // Event handlers
  const toggleMobileMenu = () => setMobileMenuVisible(!isMobileMenuVisible);
  
  const handleHomeClick = () => {
    if (isLogged) router.push("/home");
    else router.push("/auth/register");
  };
  
  const handleMyEventsClick = () => {
    if (isLogged) router.push("/home/events/myEvents");
    else router.push("/auth/login");
  };
  
  const handleProfileClick = () => {
    if (isLogged) router.push("/home/profile");
    else router.push("/auth/register");
  };
  
  const handlePoliciesClick = () => router.push("/policies");

  // Component renderers
  const renderLogo = () => (
    <Text style={[styles.logo, isDarkMode ? styles.darkText : styles.lightText]}>
      LogiEvents
    </Text>
  );
  
  const renderNavLinks = () => {
    if (isMobile) return null;
    
    return (
      <View style={styles.navLinks}>
        <TouchableOpacity onPress={handleHomeClick}>
          <Text style={[styles.navLink, isDarkMode ? styles.darkText : styles.lightText]}>
            Inicio
          </Text>
        </TouchableOpacity>
        
        {isLogged && <TouchableOpacity onPress={handleMyEventsClick}>
          <Text style={[styles.navLink, isDarkMode ? styles.darkText : styles.lightText]}>
            Eventos
          </Text>
        </TouchableOpacity>}
        
        <TouchableOpacity onPress={handlePoliciesClick}>
          <Text style={[styles.navLink, isDarkMode ? styles.darkText : styles.lightText]}>
            Políticas
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const renderActionButtons = () => (
    <View style={styles.btnSection}>
      <TouchableOpacity 
        style={[
          styles.btnGeneral, 
          styles.btn1, 
          isDarkMode ? styles.darkBtn1 : styles.lightBtn1
        ]}
        onPress={handleMyEventsClick}
      >
        <Text style={[
          styles.btnSectionText, 
          isDarkMode ? styles.darkBtn1Text : styles.lightBtn1Text
        ]}>
          {isLogged ? 'Mis eventos' : 'Iniciar sesión'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.btnGeneral, 
          styles.btn2, 
          isDarkMode ? styles.darkBtn2 : styles.lightBtn2
        ]}
        onPress={handleProfileClick}
      >
        <Text style={[
          styles.btnSectionText, 
          isDarkMode ? styles.darkBtn2Text : styles.lightBtn2Text
        ]}>
          {isLogged ? 'Perfil' : 'Registrarse'}
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderMobileMenuButton = () => {
    if (!isMobile) return null;
    
    return (
      <TouchableOpacity style={styles.menuButton} onPress={toggleMobileMenu}>
        <Text style={[styles.menuText, isDarkMode ? styles.darkText : styles.lightText]}>
          ☰
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[
      styles.container, 
      isDarkMode ? styles.darkContainer : styles.lightContainer
    ]}>
      <View style={styles.header}>
        {renderLogo()}
        {renderNavLinks()}
        {renderActionButtons()}
        {renderMobileMenuButton()}
      </View>
      
      {children}

      <MenuPopup 
        visible={isMobileMenuVisible} 
        onClose={toggleMobileMenu} 
        isLogged={isLogged} 
      />
    </SafeAreaView>
  );
}

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