import React, {useState, useEffect} from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { GlobalStyles } from "../../GlobalStyle";
import { Ionicons } from "@expo/vector-icons";
import Grafico from "../../Component/Grafico";
import { useNavigation } from "@react-navigation/native";


export default function Dettaglio({route}) {

 const navigation = useNavigation();
    //costante per la selezione del trend
  const [trendSelezionato, setTrendSelezionato] = useState("hourly");

  const { crypto, valuta, simboloValuta } = route.params;

  const variazioni = (percent) => {
    if (percent > 0) {
      return "green";
    } else {
      return "red";
    }
  };

  // Funzione per ottenere i dati del trend selezionato
  const getDatiTrendSelezionato = () => {
    if (trendSelezionato === "hourly") {
      return crypto.hourly_trends || {};
    } else if (trendSelezionato === "daily") {
      return crypto.daily_trend || {};
    } else if (trendSelezionato === "weekly") {
      return crypto.weekly_trend || {};
    } else if (trendSelezionato === "annual") {
      return crypto.annual_trend || {};
    } else if (trendSelezionato === "bi_monthly") {
      return crypto.bi_monthly_trend || {};
    } else if (trendSelezionato === "quarterly") {
      return crypto.quarterly_trend || {};
    } else {
      return {};
    }
  };


  return (
    <>
      <View style={GlobalStyles.container}>
        {/* ZONA INFORMAZIONI DELLA VALUTA */}
        <View style={styled.contenitoreTutto}>
          <View style={styled.contenitoreInfo}>
            <View style={styled.contenitoreLeft}>
              <Text style={styled.textSuperiore}>{crypto.name}</Text>
              <Text style={styled.textSuperiore}>{crypto.symbol}</Text>
              <Text style={styled.textSuperiore}>
                Valore attuale: {valuta} {simboloValuta}
              </Text>
            </View>
            <View style={styled.contenitoreRight}>
              <Text style={styled.textSuperiore}>
                Fornitura Max: {crypto.max_supply}
              </Text>
              <Text style={styled.textSuperiore}>
                Fornitura Tot: {crypto.total_supply.toFixed(2)}
              </Text>
            </View>
          </View>
          {/* ZONA DELLE VARIAZIONI DELLE VALUTE */}
          <Text style={styled.textTitoletto}>
        Sceglio lo storico trend desiderato:
          </Text>
          <View style={styled.contenitoreVariazioni}>
            <TouchableOpacity onPress={() => setTrendSelezionato("hourly")}>
              <Text
                style={[
                  styled.textVariazioni,
                ]}
              >
               1H
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTrendSelezionato("daily")}>
              <Text
                style={[
                  styled.textVariazioni,
                ]}
              >
               24H
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTrendSelezionato("weekly")}>
              <Text
                style={[
                  styled.textVariazioni,
                ]}
              >
               7D
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTrendSelezionato("annual")}>
              <Text
                style={[
                  styled.textVariazioni,
                ]}
              >
               1Y
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTrendSelezionato("bi_monthly")}>
              <Text
                style={[
                  styled.textVariazioni,
                ]}
              >
               2BM
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTrendSelezionato("quarterly")}>
              <Text
                style={[
                  styled.textVariazioni,
                ]}
              >
                Quarter
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <Grafico dati={getDatiTrendSelezionato()} />
                  </View>
                  <TouchableOpacity
                      style={styled.btnIndietro}
                  onPress={() => navigation.navigate("Home")}>
                      <Text style={styled.textBtn}>Torna alla home</Text>
                  </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styled = StyleSheet.create({
  //Contenitori

  contenitoreTutto: {
    backgroundColor: "#1D2A3D",
    width: "100%",
    height: "100%",
  },

  contenitoreVariazioni: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    borderBottomColor: "white",
    borderBottomWidth: 2,
  },

  contenitoreInfo: {
    height: 100,
    width: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 5,
    marginRight: 5,
    borderBottomColor: "white",
    borderBottomWidth: 2,
  },

  contenitoreRight: {
    marginRight: 5,
  },

  //Testi
  textVariazioni: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 5,
  },

  textTitoletto: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },

  textSuperiore: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
  },

    textBtn: {
    fontWeight: "bold",
    fontSize: 15,
  },

  //----------------------------------------------
  //bottone
  btnIndietro: {
    width: 150,
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    borderRadius: 10,
    marginHorizontal: 5,
    marginTop: 5,
    backgroundColor: "orange",
  },
});