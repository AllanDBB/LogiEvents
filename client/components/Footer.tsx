import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.logo}>LogiEvents</Text>
      <View style={styles.columns}>
        <View style={styles.column}>
          <Text style={styles.header}>Aprende</Text>
          <TouchableOpacity><Text style={styles.text}>Información</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.text}>Trabajos</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.text}>Políticas</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.text}>Contacto</Text></TouchableOpacity>
        </View>
        <View style={styles.column}>
          <Text style={styles.header}>Eventos</Text>
          <TouchableOpacity><Text style={styles.text}>Nuevos eventos</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.text}>Tendencias</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.text}>Futuros</Text></TouchableOpacity>
        </View>
        <View style={styles.column}>
          <Text style={styles.header}>Contacto</Text>
          <TouchableOpacity><Text style={styles.text}>Oficina: 123-456-7890</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.text}>Central: 123-456-7890</Text></TouchableOpacity>
        </View>
        <View style={styles.column}>
          <Text style={styles.header}>Social</Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity>
              <Icon name="facebook" size={24} color="#3b5998" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="twitter" size={24} color="#1da1f2" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="instagram" size={24} color="#e1306c" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="linkedin" size={24} color="#0077b5" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Text style={styles.copyright}>© 2025 LogiEvents | Todos los derechos reservados</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e7e7e7',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  columns: {
    flexDirection: Dimensions.get('window').width > 600 ? 'row' : 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
  column: {
    alignItems: Dimensions.get('window').width > 600 ? 'flex-start' : 'center',
    marginBottom: 15,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    marginHorizontal: 10,
  },
  copyright: {
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    marginTop: 10,
  },
});

export default Footer;