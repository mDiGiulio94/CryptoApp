import React, {useState, useEffect} from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { GlobalStyles } from "../../GlobalStyle";
import { Ionicons } from "@expo/vector-icons";
import Grafico from "../../Component/Grafico";



export default function Dettaglio({route}) {


    const { crypto, valuta, simboloValuta } = route.params;

 const variazioni = (percent) => {
   if (percent > 0) {
     return "green";
   } else {
     return "red";
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
              Variazione valute ogni ora, 24h, 7d, 30d, 60d, 90d
            </Text>
            <View style={styled.contenitoreVariazioni}>
              <TouchableOpacity>
                <Text
                  style={[
                    styled.textVariazioni,
                    {
                      color: variazioni(
                        crypto.quote.USD.percent_change_1h.toFixed(2)
                      ),
                    },
                  ]}
                >
                  {crypto.quote.USD.percent_change_1h.toFixed(2)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text
                  style={[
                    styled.textVariazioni,
                    {
                      color: variazioni(
                        crypto.quote.USD.percent_change_24h.toFixed(2)
                      ),
                    },
                  ]}
                >
               
                  {crypto.quote.USD.percent_change_24h.toFixed(2)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text
                  style={[
                    styled.textVariazioni,
                    {
                      color: variazioni(
                        crypto.quote.USD.percent_change_7d.toFixed(2)
                      ),
                    },
                  ]}
                >
                  {" "}
                  {crypto.quote.USD.percent_change_7d.toFixed(2)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text
                  style={[
                    styled.textVariazioni,
                    {
                      color: variazioni(
                        crypto.quote.USD.percent_change_30d.toFixed(2)
                      ),
                    },
                  ]}
                >
                  {crypto.quote.USD.percent_change_30d.toFixed(2)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text
                  style={[
                    styled.textVariazioni,
                    {
                      color: variazioni(
                        crypto.quote.USD.percent_change_60d.toFixed(2)
                      ),
                    },
                  ]}
                >
                  {crypto.quote.USD.percent_change_60d.toFixed(2)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text
                  style={[
                    styled.textVariazioni,
                    {
                      color: variazioni(
                        crypto.quote.USD.percent_change_90d.toFixed(2)
                      ),
                    },
                  ]}
                >
                  {crypto.quote.USD.percent_change_90d.toFixed(2)}
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <Grafico crypto={crypto} />
            </View>
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
      marginRight:5
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
});