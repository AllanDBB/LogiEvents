import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  useWindowDimensions
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ScrollbarStyles from "@/components/ScrollbarStyles";
import MainPageContainer from '@/components/MainPageContainer';

export default function Policies() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const sections = [
    {
      title: "Términos y Condiciones",
      content: "Bienvenido a LogiEvents. Al utilizar nuestra plataforma, aceptas cumplir con estos Términos y Condiciones. Por favor, léelos cuidadosamente antes de continuar."
    },
    {
      title: "Uso Previsto del Sitio",
      content: "LogiEvents es una plataforma dedicada a la búsqueda, organización y participación en eventos. Nuestros servicios están diseñados para conectar a los usuarios con eventos de su interés, permitir a los organizadores crear y administrar eventos, y facilitar la venta de entradas."
    },
    {
      title: "Registro de Usuario",
      content: "Para utilizar ciertas funciones de LogiEvents, deberás registrarte y crear una cuenta. La información proporcionada durante el registro debe ser precisa, actual y completa. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades realizadas con tu cuenta."
    },
    {
      title: "Obligaciones de la Cuenta Registrada",
      content: "Como usuario registrado, te comprometes a: no compartir tu cuenta con terceros, mantener actualizados tus datos personales, no utilizar nuestra plataforma para actividades ilegales o no autorizadas, y respetar los derechos de otros usuarios y terceros."
    },
    {
      title: "Contenido del Usuario",
      content: "Eres responsable de todo el contenido que publiques o compartas a través de LogiEvents. Este contenido no debe violar derechos de autor, marcas registradas u otros derechos de propiedad intelectual, ni debe ser difamatorio, obsceno o ilegal de cualquier manera."
    },
    {
      title: "Modificaciones a los Términos",
      content: "LogiEvents se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en la plataforma. Es tu responsabilidad revisar periódicamente los términos para estar al tanto de cualquier cambio."
    },
    {
      title: "Terminación",
      content: "LogiEvents puede, a su sola discreción, suspender o terminar tu acceso a la plataforma si viola estos Términos y Condiciones o por cualquier otro motivo justificado."
    },
    {
      title: "Limitación de Responsabilidad",
      content: "LogiEvents no será responsable por daños directos, indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar nuestros servicios."
    },
    {
      title: "Contacto",
      content: "Si tienes preguntas sobre estos Términos y Condiciones, contáctanos a través de los canales oficiales indicados en nuestra plataforma."
    }
  ];

  return (
    <MainPageContainer isAuthenticated={false} showNavbar={false}>
        <SafeAreaView style={styles.container}>
          <ScrollbarStyles />
          
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
            <View style={[styles.content, !isMobile && styles.desktopContent]}>
              <View style={styles.header}>
                <Ionicons 
                  name="arrow-back" 
                  size={24} 
                  color="#333" 
                  onPress={() => router.back()} 
                  style={styles.backIcon}
                />
                <Text style={styles.mainTitle}>Términos y Condiciones</Text>
              </View>

              <View style={styles.termsContainer}>
                <Text style={styles.lastUpdated}>Última actualización: 20 de Marzo, 2025</Text>
                
                {sections.map((section, index) => (
                  <View key={index} style={styles.section}>
                    {index > 0 && <Text style={styles.sectionTitle}>{section.title}</Text>}
                    <Text style={styles.sectionContent}>{section.content}</Text>
                  </View>
                ))}
                
                <Text style={styles.footer}>
                  Al utilizar LogiEvents, confirmas que has leído, entendido y aceptado estos Términos y Condiciones.
                </Text>
              </View>
            </View>
          </ScrollView>
        
        </SafeAreaView>
      </MainPageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    padding: 20,
  },
  desktopContent: {
    maxWidth: 1000,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 20,
  },
  backIcon: {
    marginRight: 15,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#212529",
  },
  termsContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  lastUpdated: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 20,
    fontStyle: "italic",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: "#495057",
    marginBottom: 10,
  },
  footer: {
    fontSize: 16,
    color: "#212529",
    fontWeight: "500",
    marginTop: 20,
    textAlign: "center",
  },
});