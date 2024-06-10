import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { GlobalStyles } from "../../GlobalStyle";
import { Ionicons } from "@expo/vector-icons";
import { useCrypto } from "../../Context/CryptoContext";
import CryptoApi from "../../Api/CryptoAPI";
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

export default function Home() {
  //Costante per la navigazione
  const navigation = useNavigation();

  //Varibili di stato
  const [euro, setEuro] = useState(0);
  const [valuta, setValuta] = useState("dollaro");
  const [cryptoValute, setCryptoValute] = useState([]);
  const [mostraTutto, setMostraTutto] = useState(false);
  const { cryptos, getCryptos, portfolio } = useCrypto();
  const [valorePortfolio, setValorePortfolio] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const [valoriSelect, setValoriSelect] = useState({});

  //-----------------------------------------------
  //Funzioni

  //Funzione per calcolo del valore del portfolio
  function calcolaValorePortfolio() {
    let totale = 0;

    /*Questo era l'esercizio di oggi 30/05, prima di tutto si fa un map di tutto l'array portfolio passato da portfolio attraverso li contex
------------------------------------

dopodiche si fa un find sull'array cryto che lo restituiesce per intero array ma definiamo che deve trovare il campo "symbol" (presente nel mock), e lo deve rendere identico a moneta crypto (valore all'interno dell'array passato da portfolio)

-----------------------------------------

dopodiché, il campo cryptoData se è popolato aggiunge alla costante totale il valore di quantità moltiplicato per quello delle valute 

*/
    portfolio.map((moneta) => {
      const crypto = cryptos.find((item) => item.symbol === moneta.crypto);
      if (crypto) {
        totale += parseFloat(moneta.quantita) * crypto.quote.USD.price;
      }
    });
    setValorePortfolio(totale);
  }

  //Funzione per l'inizializzazione separata delle varie select
  const initializeCryptoValute = (cryptos) => {
    return cryptos.map((crypto) => ({
      ...crypto,
      selectedValue: valoriSelect[crypto.symbol],
    }));
  };

  //Funzione per accorciare e allargare il numero di cryptovalute visibili
  const accorciaListaCrypto = () => {
    const lista = mostraTutto ? cryptos.slice(0, 5) : cryptos.slice(0, 100);
    setMostraTutto(!mostraTutto);
    //Questa funzione serve a far si che quando il pulsante Mostra viene premuto i valori delle select non vengono resettati
    setCryptoValute(initializeCryptoValute(lista));
  };

  //chiamata asincrona per recuperare il valore di euro
  const onGetEuro = async () => {
    try {
      const response = await CryptoApi.getEuro();
      if (response) {
        setEuro(response.rates.EUR);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // chiamata dal sito (non al mock)
  // async function getCryptos() {
  //   try {
  //     const response = await CryptoApi.getCrypto();
  //     if (response && response.data) {
  //       setCryptos(response.data);
  //     }
  //   }
  //   catch (error) {
  //     console.log(error)
  //   }
  // }

  //Funzione per la conversione della valuta al premere del pulsante da euro a dollaro
  const convertiValuta = (valuta) => {
    let saldo;
    if (valuta === "euro") {
      saldo = valorePortfolio * euro;
      setValuta("euro");
    } else {
      saldo = valorePortfolio / euro;
      setValuta("dollaro");
    }
    setValorePortfolio(saldo);
  };

  //funzione per convertire anche i valori presenti all'interno del menu a tendina
  const conversioneValore = (prezzo) => {
    return valuta === "dollaro" ? prezzo : prezzo * euro;
  };

  //HandleOnChange per la gestione del cambio valore all'interno del picker
  /*

  Utilizzando la funzione di aggiornamento dello stato con la forma (item) => ({ ...item, [symbol]: value }), si aggiorna lo stato valoriSelect, inserendo o sovrascrivendo il valore selezionato value per la chiave symbol all'interno dell'oggetto valoriSelect.
  
  
  
  */
  const handlePickerChange = (value, symbol) => {
    setValoriSelect((item) => ({ ...item, [symbol]: value }));
    setCryptoValute((item) =>
      item.map((crypto) =>
        crypto.symbol === symbol ? { ...crypto, selectedValue: value } : crypto
      )
    );
  };

  useEffect(() => {
    getCryptos();
    onGetEuro();
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    calcolaValorePortfolio();
  }, [portfolio]);

  useEffect(() => {
    const setListaIniziale = () => {
      const listaCrypto = initializeCryptoValute(cryptos.slice(0, 5));
      setCryptoValute(listaCrypto);
    };
    setListaIniziale();
  }, [cryptos]);

  return (
    <>
      {isOffline ? (
        <View style={GlobalStyles.container}>
          <View style={styled.contenitoreOffline}>
            <Image
              source={require("../../img/LogoBTC.jpeg")}
              style={styled.img}
            />
            <Text style={[styled.textOffline]}>
              C'è stato un problema, verifica la tua connessione!
            </Text>
          </View>
        </View>
      ) : (
        <View style={GlobalStyles.container}>
          <View style={styled.contenitoreSaldo}>
            <Text style={styled.textTitle}>Il mio saldo è:</Text>
            <TouchableOpacity
              onPress={() =>
                valuta == "dollaro"
                  ? convertiValuta("euro")
                  : convertiValuta("dollaro")
              }
            >
              <Text style={styled.textTotSal}>
                {valuta === "dollaro" ? "$" : "€"}
                {valorePortfolio.toFixed(2)}
              </Text>
            </TouchableOpacity>
            <Text style={[styled.textIntermedio]}>
              Valore Euro {euro.toFixed(3)}
            </Text>
          </View>

          <View style={styled.sfondo}>
            <View style={styled.contenitore}>
              <View style={styled.contenitoreCrypto}>
                <View>
                  <Text style={styled.textIntermedio}>Elenco Crypto</Text>
                  <Text style={styled.textTop}>
                    Top {mostraTutto ? "100" : "5"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={accorciaListaCrypto}
                  style={styled.contenitoreTextRight}
                >
                  <Text style={styled.icona}>
                    {mostraTutto ? "Mostra Meno" : "Mostra Tutto"}
                  </Text>
                  <Text>
                    <Ionicons
                      name={mostraTutto ? "eye-off-outline" : "eye-outline"}
                      size={23}
                      color={"white"}
                    />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView>
              {cryptoValute.map((moneta) => (
                <View key={moneta.symbol} style={styled.contenitoreValute}>
                  <View>
                    <Text style={styled.textIntermedio}>{moneta.symbol}</Text>
                    <Text style={styled.textTop}>{moneta.name}</Text>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Dettaglio", {
                          crypto: moneta,
                          valuta: conversioneValore(
                            moneta.quote.USD.price
                          ).toFixed(2),
                          simboloValuta: valuta === "dollaro" ? "$" : "€",
                        })
                      }
                    >
                      <View style={styled.btnDettaglio}>
                        <Text style={styled.textBtn}>Dettaglio</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View>
                    <View style={styled.contenitoreTextRight}>
                      <Text style={styled.textIntermedio}>
                        {valuta === "dollaro" ? "$" : "€"}
                        {conversioneValore(moneta.quote.USD.price).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styled.contenitoreTextRight}>
                      <Text style={styled.textChange}>
                        Visualizza vari change:
                      </Text>
                    </View>
                    <View style={styled.contenitoreTextRight}>
                      <View style={styled.containerPicker}>
                        <Picker
                          selectedValue={moneta.selectedValue}
                          style={styled.picker}
                          onValueChange={(itemValue) =>
                            handlePickerChange(itemValue, moneta.symbol)
                          }
                        >
                          <Picker.Item
                            label={`1H: ${moneta.quote.USD.percent_change_1h.toFixed(
                              2
                            )}`}
                            value={moneta.quote.USD.percent_change_1h}
                            color={
                              moneta.quote.USD.percent_change_1h>= 0
                                ? "green"
                                : "red"
                            }
                          />
                          <Picker.Item
                            label={`24H: ${moneta.quote.USD.percent_change_24h.toFixed(
                              2
                            )}`}
                            value={moneta.quote.USD.percent_change_24h}
                            color={
                              moneta.quote.USD.percent_change_24h >= 0
                                ? "green"
                                : "red"
                            }
                          />
                          <Picker.Item
                            label={`7d: ${moneta.quote.USD.percent_change_7d.toFixed(
                              2
                            )}`}
                            value={moneta.quote.USD.percent_change_7d}
                            color={
                              moneta.quote.USD.percent_change_7d >= 0
                                ? "green"
                                : "red"
                            }
                          />
                          <Picker.Item
                            label={`30d: ${moneta.quote.USD.percent_change_30d.toFixed(
                              2
                            )}`}
                            value={moneta.quote.USD.percent_change_30d}
                            color={
                              moneta.quote.USD.percent_change_30d >= 0
                                ? "green"
                                : "red"
                            }
                          />
                          <Picker.Item
                            label={`60d: ${moneta.quote.USD.percent_change_60d.toFixed(
                              2
                            )}`}
                            value={moneta.quote.USD.percent_change_60d}
                            color={
                              moneta.quote.USD.percent_change_60d >= 0
                                ? "green"
                                : "red"
                            }
                          />
                          <Picker.Item
                            label={`90d: ${moneta.quote.USD.percent_change_90d.toFixed(
                              2
                            )}`}
                            value={moneta.quote.USD.percent_change_90d}
                            color={
                              moneta.quote.USD.percent_change_90d >= 0
                                ? "green"
                                : "red"
                            }
                          />
                        </Picker>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </>
  );
}

const styled = StyleSheet.create({
  // CONTENITORI

  sfondo: {
    backgroundColor: "#1D2A3D",
    width: "100%",
    height: "100%",
  },
  contenitore: {
    marginLeft: 13,
    marginRight: 13,
    borderBottomColor: "white",
    borderBottomWidth: 2,
  },

  contenitoreSaldo: {
    height: 100,
    padding: 10,
    backgroundColor: "#1D2A3D",
    marginBottom: 20,
  },

  contenitoreCrypto: {
    backgroundColor: "#1D2A3D",
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  contenitoreValute: {
    backgroundColor: "#1D2A3D",
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 13,
    marginRight: 13,
    marginTop: 13,
    paddingBottom: 5,
    borderBottomColor: "white",
    borderBottomWidth: 2,
  },

  contenitoreTextRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  contenitoreOffline: {
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

  contenitoreGrafico: {
    height: 100,
    justifyContent: "center",
    margin: "auto",
    flex: 1,
  },

  containerPicker: {
    height: 50,
    width: "64%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    overflow: "hidden",
  },

  picker: {
    borderWidth: 0,
    marginHorizontal: -10,
    top: -85,
  },
  // -------------------------------------------------------------------

  // TEXT

  textTitle: {
    color: "#8A7968",
    fontWeight: "bold",
    fontSize: 13,
  },

  textTotSal: {
    fontWeight: "bold",
    fontSize: 30,
    color: "#fff",
  },

  textIntermedio: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 3,
  },

  textVariazioni: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 4,
  },

  icona: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  textTop: {
    color: "white",
    fontSize: 15,
  },

  textOffline: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  textBtn: {
    fontWeight: "bold",
    fontSize:15
  },

  textChange: {
    color: "white",
    fontSize: 15,
    marginBottom: 3,
  },

  //------------------------------------------------------
  //Immagine
  img: {
    height: "30%",
    width: "40%",
    marginBottom: 15,
  },

  //--------------------------------------------------------
  //Bottoni

  btnDettaglio: {
    width: 90,
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    borderRadius: 10,
    marginHorizontal: 5,
    marginTop: 5,
    marginLeft: -3,
    backgroundColor: "orange",
  },
});

/*


STEPS:
1)MESSAGGIO DI OFFLINE HOME (FATTO)

2) IN PORTFOLIO QUANDO OFFLINE MOSTRARE SOLO LA PARTE HEADER E MESSAGGIO DI ERRORE (CHIEDI A DANILO DETTAGLI)

3)FARE IN MODO CHE IL CAMBIO VALUTA INFLUENZI ANCHE I VALORI GENERATI NELL'ELENCO(FATTO)

4)CREARE UNA SELECT CONTENENTE LE VARIAZIONI (nel mock che vanno da 24 ore a 90 giorni)(FATTO)

5) implementare un grafico che catturi le variazioni delle singole crypto

6)CREARE PAGINA DI DETTAGLIO DELLE SINGOLE VALUTE AL CLICK SU OGNUNA DI LORO(FATTO)



implemente pagina di dettaglio delle varie valute crypto
dove si mostra il valore iniziale e il valore di crescita negli ultimi 6 mesi

attaccare il tutto alla generazione di un grafico (cerca le librerie)


SE POSSIBILE 
cercare di individuare il picco più alto e più basso nell'ultimo mese


 */
