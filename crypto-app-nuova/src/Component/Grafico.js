import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const Grafico = ({ crypto }) => {


    // Costante che contiene i dati necessari estratti dalla props che possono essere il primo o un oggetto vuoto nel caso non ci sia niente in alcune voci
    const hourlyTrends = crypto.hourly_trends || {};
    //come etichette si dichiara che viene usata la chiave dell'oggetto
    const etichette = Object.keys(hourlyTrends); // Etichette per l'asse x
    //come dati viene utilizzato il valore dell'oggetto
  const dati = Object.values(hourlyTrends); // Dati per l'asse y

  if (etichette.length === 0 || dati.length === 0) {
    // Gestisci il caso in cui non ci siano dati validi da visualizzare nel grafico
    return (
      <View style={styled.container}>
        <Text>Nessun dato disponibile</Text>
      </View>
    );
  }

  // Formatta i dati per il grafico
  const datiFormattati = {
    labels: etichette,
    datasets: [
      {
        data: dati,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Colore della linea
      },
    ],
  };

  return (
    
      
      <View style={styled.container}>
      <LineChart
        data={datiFormattati}
        width={screenWidth}
        height={500}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        verticalLabelRotation={90} // Ruota le etichette di 45 gradi
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

const styled = StyleSheet.create({
  container: {
    // Aggiungi eventuali stili per il container
  },
});

export default Grafico;
