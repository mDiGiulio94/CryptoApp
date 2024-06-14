import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const Grafico = ({ dati }) => {

    if (!dati || Object.keys(dati).length === 0) {
    // Gestisci il caso in cui non ci siano dati validi da visualizzare nel grafico
    return (
      <View style={styled.contenitoreSenzaDati}>
        <Text style={styled.textSenzaDati}>Nessun dato disponibile</Text>
      </View>
    );
  }

  // Estrai etichette e dati dal oggetto dati
  const etichette = Object.keys(dati);
  const valori = Object.values(dati);

  // Formatta i dati per il grafico
  const datiFormattati = {
    labels: etichette,
    datasets: [
      {
        data: valori,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Colore della linea

      },
    ],
  };

  return (
    <View style={styled.container}>
      <LineChart
        data={datiFormattati}
        width={screenWidth}
        height={450}
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
  contenitoreSenzaDati: {
    backgroundColor: "white",
    justifyContent: "center",
    width: "70%",
    borderRadius: 10,
    margin: "auto",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0F141E",
    borderColor: "grey",
    borderWidth: 1,
  },
  textSenzaDati: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Grafico;
