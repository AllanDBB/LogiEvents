import { StyleSheet, View, Text, useWindowDimensions, ScrollView, TouchableOpacity, Platform, ActivityIndicator, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from "expo-router";
import MainPageContainer from '@/components/MainPageContainer';
import BackArrow from "@/components/BackArrow";
import { BarChart } from 'react-native-chart-kit';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as Sharing from 'expo-sharing';
import * as FileSaver from 'file-saver'; 
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type EventState = string; 
type EventCategory = string; 
type Event = { 
  state?: EventState; 
  category: EventCategory;
  name?: string;
  title?: string;
  date?: string;
  capacity?: number;
  availableSpots?: number;
  _id?: string;
};

// Componente de pop-up personalizado
const CustomPopup = ({ visible, title, message, buttons, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.popupContainer}>
          <Text style={styles.popupTitle}>{title}</Text>
          <Text style={styles.popupMessage}>{message}</Text>
          <View style={styles.popupButtonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.popupButton,
                  button.style === 'cancel' && styles.cancelButton,
                  button.style === 'destructive' && styles.confirmButton,
                  button.style === 'success' && styles.successButton
                ]}
                onPress={() => {
                  onClose();
                  if (button.onPress) button.onPress();
                }}
              >
                <Text style={styles.popupButtonText}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function StatsPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  
  // Estados para gestionar los datos y la UI
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  
  // Estados para el popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({
    title: '',
    message: '',
    buttons: []
  });

  // Función para mostrar un popup
  const showCustomPopup = (title, message, buttons) => {
    setPopupConfig({
      title,
      message,
      buttons
    });
    setShowPopup(true);
  };
  
  // Obtener los eventos del usuario al cargar el componente
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Obtener el token de autenticación
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setError('No se pudo autenticar. Por favor, inicie sesión nuevamente.');
          setLoading(false);
          return;
        }
        
        // Obtener datos del usuario
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(`${user.firstName || ''} ${user.lastName || ''}`);
          setUserId(user.userId || user._id || '');
        }
        
        // Obtener eventos del usuario
        const response = await axios.get(`http://localhost:3000/event/${userId}`, {
          headers: { Authorization: token }
        });
        
        if (response.data && Array.isArray(response.data)) {
          setEvents(response.data);
        } else if (response.data.events && Array.isArray(response.data.events)) {
          setEvents(response.data.events);
        } else {
          console.warn('Formato de respuesta inesperado:', response.data);
          setEvents([]);
        }
      } catch (err) {
        console.error('Error al obtener eventos:', err);
        setError('No se pudieron cargar los eventos. Intente nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  // Calcular estadísticas basadas en los eventos
  const eventStates = events.reduce<Record<EventState, number>>((acc, event: Event) => {
    if (event.state) {
      acc[event.state] = (acc[event.state] || 0) + 1;
    } else {
      // Si el evento no tiene estado, considerarlo como "Activo"
      acc['Activo'] = (acc['Activo'] || 0) + 1;
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

  const maxValue = Math.max(...(chartData.datasets[0].data.length > 0 ? chartData.datasets[0].data : [0]));
  const yAxisInterval = Math.ceil(maxValue / 5);

  const eventCategories = events.reduce<Record<EventCategory, number>>((acc, event: Event) => {
    if (event.category) {
      acc[event.category] = (acc[event.category] || 0) + 1;
    }
    return acc;
  }, {});

  const sortedCategories = Object.entries(eventCategories)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
    
  // Estadísticas adicionales
  const totalEvents = events.length;
  const totalCapacity = events.reduce((sum, event) => sum + (event.capacity || 0), 0);
  const totalAvailableSpots = events.reduce((sum, event) => sum + (event.availableSpots || 0), 0);
  const totalReservations = totalCapacity - totalAvailableSpots;
  const occupancyRate = totalCapacity > 0 ? (totalReservations / totalCapacity) * 100 : 0;

  const handleExportToPDF = async () => {
    if (Platform.OS === 'web') {
      try {
        const pdfDoc = await PDFDocument.create();

        const page = pdfDoc.addPage([595.28, 841.89]); 
        const { width, height } = page.getSize();

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold); 
        const fontSize = 12;

        page.drawText('Reporte de Estadísticas', {
          x: 50,
          y: height - 50,
          size: 18,
          font: boldFont, 
          color: rgb(0.88, 0.36, 0.27), 
        });
        
        page.drawText(`Usuario: ${userName} (ID: ${userId})`, {
          x: 50,
          y: height - 80,
          size: fontSize,
          font: boldFont, 
          color: rgb(0, 0, 0),
        });

        let yPosition = height - 110;
        
        page.drawText(`Estadísticas Generales:`, {
          x: 50,
          y: yPosition,
          size: fontSize,
          font: boldFont, 
          color: rgb(0, 0, 0),
        });
        yPosition -= 20;
        
        page.drawText(`Total de eventos: ${totalEvents}`, {
          x: 50,
          y: yPosition,
          size: fontSize,
          font, 
          color: rgb(0, 0, 0),
        });
        yPosition -= 15;
        
        page.drawText(`Capacidad total: ${totalCapacity} asistentes`, {
          x: 50,
          y: yPosition,
          size: fontSize,
          font, 
          color: rgb(0, 0, 0),
        });
        yPosition -= 15;
        
        page.drawText(`Reservas totales: ${totalReservations}`, {
          x: 50,
          y: yPosition,
          size: fontSize,
          font, 
          color: rgb(0, 0, 0),
        });
        yPosition -= 15;
        
        page.drawText(`Tasa de ocupación: ${occupancyRate.toFixed(2)}%`, {
          x: 50,
          y: yPosition,
          size: fontSize,
          font, 
          color: rgb(0, 0, 0),
        });
        yPosition -= 30;
        
        page.drawText('Distribución de Estados:', {
          x: 50,
          y: yPosition,
          size: fontSize,
          font: boldFont, 
          color: rgb(0, 0, 0),
        });
        yPosition -= 20;
        Object.entries(eventStates).forEach(([state, count]) => {
          page.drawText(`${state}: ${count} eventos`, {
            x: 50,
            y: yPosition,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          });
          yPosition -= 15;
        });

        yPosition -= 10;
        page.drawText('Ranking de Categorías:', {
          x: 50,
          y: yPosition,
          size: fontSize,
          font: boldFont, 
          color: rgb(0, 0, 0),
        });
        yPosition -= 20;
        sortedCategories.forEach((item, index) => {
          page.drawText(`${index + 1}. ${item.category} (${item.count} eventos)`, {
            x: 50,
            y: yPosition,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          });
          yPosition -= 15;
        });

        yPosition -= 20;
        page.drawText(`Generado el ${new Date().toLocaleDateString()}`, {
          x: 50,
          y: yPosition,
          size: fontSize - 2,
          font,
          color: rgb(0.5, 0.5, 0.5), // Color gris
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        FileSaver.saveAs(blob, `Estadisticas_Eventos_${new Date().toISOString().split('T')[0]}.pdf`);
        
        showCustomPopup(
          'Éxito',
          'El PDF ha sido generado y descargado correctamente.',
          [{ text: 'OK', style: 'success' }]
        );
      } catch (error) {
        console.error('Error al generar el PDF:', error);
        showCustomPopup(
          'Error',
          'Ocurrió un error al generar el PDF.',
          [{ text: 'OK' }]
        );
      }
      return;
    }

    try {
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #E05C45; text-align: center; }
              .section { margin-bottom: 20px; }
              .section-title { font-size: 18px; font-weight: bold; color: #E05C45; margin-bottom: 10px; }
              .item { font-size: 14px; margin-bottom: 5px; }
            </style>
          </head>
          <body>
            <h1>Reporte de Estadísticas</h1>
            <p>Usuario: ${userName} (ID: ${userId})</p>
            
            <div class="section">
              <div class="section-title">Estadísticas Generales</div>
              <div class="item">Total de eventos: ${totalEvents}</div>
              <div class="item">Capacidad total: ${totalCapacity} asistentes</div>
              <div class="item">Reservas totales: ${totalReservations}</div>
              <div class="item">Tasa de ocupación: ${occupancyRate.toFixed(2)}%</div>
            </div>
            
            <div class="section">
              <div class="section-title">Distribución de Estados</div>
              ${Object.entries(eventStates).map(([state, count]) => `
                <div class="item">${state}: ${count} eventos</div>
              `).join('')}
            </div>
            <div class="section">
              <div class="section-title">Ranking de Categorías</div>
              ${sortedCategories.map((item, index) => `
                <div class="item">${index + 1}. ${item.category} (${item.count} eventos)</div>
              `).join('')}
            </div>
            <div style="margin-top: 30px; font-size: 12px; text-align: center;">
              Generado el ${new Date().toLocaleDateString()}
            </div>
          </body>
        </html>
      `;

      const options = {
        html: htmlContent,
        fileName: `Estadisticas_Eventos_${new Date().toISOString().split('T')[0]}`,
        directory: 'Documents', 
      };

      console.log('PDF Options:', options);

      const pdf = await RNHTMLtoPDF.convert(options);

      if (!pdf.filePath) {
        throw new Error('No se pudo generar el archivo PDF');
      }

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        showCustomPopup(
          'Información',
          'El PDF se generó pero no se puede compartir en esta plataforma',
          [{ text: 'OK' }]
        );
        return;
      }

      await Sharing.shareAsync(pdf.filePath, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartir Reporte PDF',
        UTI: 'com.adobe.pdf',
      });
      
      showCustomPopup(
        'Éxito',
        'El PDF ha sido generado correctamente.',
        [{ text: 'OK', style: 'success' }]
      );
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      showCustomPopup(
        'Error',
        'Ocurrió un error al generar el PDF.',
        [{ text: 'OK' }]
      );
    }
  };

  // Pantalla de carga
  if (loading) {
    return (
      <MainPageContainer isAuthenticated={false} showNavbar={true} showFooter={false} showChatButton={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E05C45" />
          <Text style={styles.loadingText}>Cargando estadísticas...</Text>
        </View>
      </MainPageContainer>
    );
  }

  // Pantalla de error
  if (error) {
    return (
      <MainPageContainer isAuthenticated={false} showNavbar={true} showFooter={false} showChatButton={false}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/home/events/stats')}>
            <Text style={styles.retryButtonText}>Intentar nuevamente</Text>
          </TouchableOpacity>
        </View>
      </MainPageContainer>
    );
  }

  // No hay eventos para mostrar estadísticas
  if (events.length === 0) {
    return (
      <MainPageContainer isAuthenticated={false} showNavbar={true} showFooter={false} showChatButton={false}>
        <View style={styles.container}>
          <BackArrow onPress={() => router.back()} color="#000" />
          <View style={isMobile ? styles.headerMobile : styles.headerDesktop}>
            <Text style={styles.name}>{userName}</Text>
            <Text style={styles.id}>{userId}</Text>
          </View>
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No hay eventos disponibles para mostrar estadísticas.</Text>
            <TouchableOpacity 
              style={styles.createEventButton}
              onPress={() => router.push('/home/events/createEvent')}
            >
              <Text style={styles.createEventButtonText}>Crear un evento</Text>
            </TouchableOpacity>
          </View>
        </View>
      </MainPageContainer>
    );
  }

  return (
    <MainPageContainer isAuthenticated={false} showNavbar={true} showFooter={false} showChatButton={false}>
      {/* Pop-up personalizado */}
      <CustomPopup
        visible={showPopup}
        title={popupConfig.title}
        message={popupConfig.message}
        buttons={popupConfig.buttons}
        onClose={() => setShowPopup(false)}
      />
      
      <View style={styles.container}>
        <BackArrow onPress={() => router.back()} color="#000" />

        <View style={isMobile ? styles.headerMobile : styles.headerDesktop}>
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.id}>{userId}</Text>
        </View>
        
        <View style={styles.statsOverviewContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalEvents}</Text>
            <Text style={styles.statLabel}>Eventos</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalCapacity}</Text>
            <Text style={styles.statLabel}>Capacidad</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalReservations}</Text>
            <Text style={styles.statLabel}>Reservas</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{occupancyRate.toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Ocupación</Text>
          </View>
        </View>

        <View style={isMobile ? styles.titlesContainerMobile : styles.titlesContainerDesktop}>
          <Text style={styles.leftTitle}>Distribución de Estados</Text>
          <Text style={styles.rightTitle}>Rankings</Text>
        </View>

        <ScrollView>
          <View
            style={[
              styles.chartAndRankingsContainer,
              isMobile && styles.chartAndRankingsContainerMobile, 
            ]}
          >
            {isMobile ? (
              <>
                <View style={styles.chartContainer}>
                  {chartData.datasets[0].data.length > 0 ? (
                    <BarChart
                      data={chartData}
                      width={width - 40} 
                      height={220}
                      yAxisLabel=""
                      yAxisSuffix=""
                      fromZero={true}
                      yAxisInterval={yAxisInterval}
                      chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(224, 92, 69, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        fillShadowGradient: '#E05C45',
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
                  ) : (
                    <View style={styles.noChartDataContainer}>
                      <Text style={styles.noChartDataText}>No hay datos suficientes para mostrar el gráfico.</Text>
                    </View>
                  )}
                </View>
                <View style={styles.rankingsContainer}>
                  {sortedCategories.length > 0 ? (
                    sortedCategories.map((item, index) => (
                      <Text key={item.category} style={styles.rankingsItem}>
                        {index + 1}. {item.category} ({item.count} eventos)
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.noRankingsText}>No hay categorías para mostrar.</Text>
                  )}
                </View>
              </>
            ) : (
              <>
                <View style={styles.chartContainer}>
                  {chartData.datasets[0].data.length > 0 ? (
                    <BarChart
                      data={chartData}
                      width={(width / 2) - 100}
                      height={220}
                      yAxisLabel=""
                      yAxisSuffix=""
                      fromZero={true}
                      yAxisInterval={yAxisInterval}
                      chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(224, 92, 69, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        fillShadowGradient: '#E05C45',
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
                  ) : (
                    <View style={styles.noChartDataContainer}>
                      <Text style={styles.noChartDataText}>No hay datos suficientes para mostrar el gráfico.</Text>
                    </View>
                  )}
                </View>
                <View style={styles.rankingsContainer}>
                  {sortedCategories.length > 0 ? (
                    sortedCategories.map((item, index) => (
                      <Text key={item.category} style={styles.rankingsItem}>
                        {index + 1}. {item.category} ({item.count} eventos)
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.noRankingsText}>No hay categorías para mostrar.</Text>
                  )}
                </View>
              </>
            )}
          </View>
        </ScrollView>

        <View style={styles.exportButtonContainer}>
          <TouchableOpacity 
            style={styles.exportButton}
            onPress={handleExportToPDF}
          >
            <Text style={styles.exportButtonText}>Exportar a PDF</Text>
          </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankingsContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  rankingsItem: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  exportButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  exportButton: {
    backgroundColor: '#E05C45',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  exportButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  chartAndRankingsContainerMobile: {
    flexDirection: 'column', 
    alignItems: 'center',
    marginTop: 20,
  },
  exportButtonContainerMobile: {
    position: 'relative', 
    marginTop: 2, 
    alignSelf: 'center', 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#E05C45',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#E05C45',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  createEventButton: {
    backgroundColor: '#E05C45',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createEventButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noChartDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  noChartDataText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  noRankingsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  statsOverviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 20,
    marginBottom: 10,
    padding: 10,
  },
  statBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    minWidth: 100,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E05C45',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
  },
  // Estilos para el modal de popup
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  popupMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  popupButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  popupButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    minWidth: 80,
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#5FAA9D',
  },
  popupButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  successButton: {
    backgroundColor: '#5FAA9D',
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  confirmButton: {
    backgroundColor: '#E74C3C',
  },
});