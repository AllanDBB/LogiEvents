import { StyleSheet, View, Text, useWindowDimensions, ScrollView } from 'react-native';
import React from 'react';
import { useRouter } from "expo-router";
import MainPageContainer from '@/components/MainPageContainer';
import BackArrow from "@/components/BackArrow";
import { BarChart } from 'react-native-chart-kit';
import myEvents from '@/mockups/adminEvents'; 

type EventState = string; 
type EventCategory = string; 
type Event = { state?: EventState; category: EventCategory }; 

export default function StatsPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768; 

  const eventStates = myEvents.reduce<Record<EventState, number>>((acc, event: Event) => {
    if (event.state) {
      acc[event.state] = (acc[event.state] || 0) + 1;
    }
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(eventStates), 
    datasets: [
      {
        data: Object.values(eventStates) as number[], 
      },
    ],
  };

  const maxValue = Math.max(...chartData.datasets[0].data);

  const yAxisInterval = Math.ceil(maxValue / 5); // Dividir el máximo en 5 partes

  const eventCategories = myEvents.reduce<Record<EventCategory, number>>((acc, event: Event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {});

  const sortedCategories = Object.entries(eventCategories)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <MainPageContainer isAuthenticated={false} showNavbar={true} showFooter={false} showChatButton={false}>
      <View style={styles.container}>
        {/* Back Arrow */}
        <BackArrow onPress={() => router.back()} color="#000" />

        <View style={isMobile ? styles.headerMobile : styles.headerDesktop}>
          <Text style={styles.name}>Nombre Apellido Apellido</Text>
          <Text style={styles.id}>2024174489</Text>
        </View>

        <View style={isMobile ? styles.titlesContainerMobile : styles.titlesContainerDesktop}>
          <Text style={styles.leftTitle}>Distribución de Estados</Text>
          <Text style={styles.rightTitle}>Rankings</Text>
        </View>

        <ScrollView>
          <View style={styles.chartAndRankingsContainer}>
            <View style={styles.chartContainer}>
              <BarChart
                data={chartData}
                width={(width / 2) - 100} 
                height={220}
                yAxisLabel=""
                yAxisSuffix="" 
                fromZero={true} 
                yAxisInterval={yAxisInterval} // Usar el intervalo dinámico
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`, // Naranja sólido
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  fillShadowGradient: '#FF0000',
                  fillShadowGradientOpacity: 1,
                  style: {
                    borderRadius: 16,
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
                verticalLabelRotation={0} 
              />
            </View>

            {/* Lista de Rankings */}
            <View style={styles.rankingsContainer}>
              {sortedCategories.map((item, index) => (
                <Text key={item.category} style={styles.rankingsItem}>
                  {index + 1}. {item.category} ({item.count} eventos)
                </Text>
              ))}
            </View>
          </View>
        </ScrollView>
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
  headerMobile: {
    marginTop: 20,
    alignItems: 'flex-start', 
  },
  headerDesktop: {
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
  titlesContainerMobile: {
    flexDirection: 'column', 
    alignItems: 'flex-start',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  titlesContainerDesktop: {
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
    marginRight: 130, 
  },
  chartAndRankingsContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  chartContainer: {
    flex: 1,
    marginRight: 80, 
  },
  rankingsContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  rankingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  rankingsItem: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
});