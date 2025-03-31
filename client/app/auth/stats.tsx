import { StyleSheet, View, Text } from 'react-native';
import React from 'react';
import { useRouter } from "expo-router";
import MainPageContainer from '@/components/MainPageContainer';
import BackArrow from "@/components/BackArrow";

export default function StatsPage() {
  const router = useRouter();

  return (
    <MainPageContainer isAuthenticated={false} showNavbar={true} showFooter={false} showChatButton={false}>
      <View style={styles.container}>
        {/* Back Arrow */}
        <BackArrow onPress={() => router.back()} color="#000" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>Nombre Apellido Apellido</Text>
          <Text style={styles.id}>2024174489</Text>
        </View>

        {/* Titles */}
        <View style={styles.titlesContainer}>
          <Text style={styles.leftTitle}>Distribución de Eventos</Text>
          <Text style={styles.rightTitle}>Rankings</Text>
        </View>
      </View>
    </MainPageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', 
    padding: 20,
  },
  header: {
    marginTop: 40,
    alignItems: 'flex-start', 
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  id: {
    fontSize: 16,
    color: 'black',
  },
  titlesContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: 30, 
    paddingHorizontal: 140, 
  },
  leftTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E05C45',
  },
  rightTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E05C45',
    marginRight: 90,
  },
});