import { StyleSheet, View, Text, useWindowDimensions, ScrollView, TouchableOpacity, Platform } from 'react-native';
import React from 'react';
import { useRouter } from "expo-router";
import MainPageContainer from '@/components/MainPageContainer';
import BackArrow from "@/components/BackArrow";
import { BarChart } from 'react-native-chart-kit';
import myEvents from '@/mockups/adminEvents';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as Sharing from 'expo-sharing';
import * as FileSaver from 'file-saver'; 
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'; 

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
  const yAxisInterval = Math.ceil(maxValue / 5);

  const eventCategories = myEvents.reduce<Record<EventCategory, number>>((acc, event: Event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {});

  const sortedCategories = Object.entries(eventCategories)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

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

        let yPosition = height - 80;
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
      } catch (error) {
        console.error('Error al generar el PDF:', error);
        alert('Ocurrió un error al generar el PDF.');
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
        alert('El PDF se generó pero no se puede compartir en esta plataforma');
        return;
      }

      await Sharing.shareAsync(pdf.filePath, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartir Reporte PDF',
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Ocurrió un error al generar el PDF.');
    }
  };

  return (
    <MainPageContainer isAuthenticated={false} showNavbar={true} showFooter={false} showChatButton={false}>
      <View style={styles.container}>
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
  <View
    style={[
      styles.chartAndRankingsContainer,
      isMobile && styles.chartAndRankingsContainerMobile, 
    ]}
  >
    {isMobile ? (
      <>
        <View style={styles.chartContainer}>
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
              color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
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
        <View style={styles.rankingsContainer}>
          {sortedCategories.map((item, index) => (
            <Text key={item.category} style={styles.rankingsItem}>
              {index + 1}. {item.category} ({item.count} eventos)
            </Text>
          ))}
        </View>
      </>
    ) : (
      <>
        <View style={styles.chartContainer}>
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
              color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
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
        <View style={styles.rankingsContainer}>
          {sortedCategories.map((item, index) => (
            <Text key={item.category} style={styles.rankingsItem}>
              {index + 1}. {item.category} ({item.count} eventos)
            </Text>
          ))}
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
});