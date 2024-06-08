import React, { useState, useEffect } from "react"
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { GlobalStyles } from "../../GlobalStyle";
import { Ionicons } from "@expo/vector-icons";
import { useCrypto } from "../../Context/CryptoContext";
import CryptoApi from "../../Api/CryptoAPI";
import NetInfo from "@react-native-community/netinfo";



//export può essere messo anche alla fine non è necessario scriverlo cosi:
export default function Home() {





  //VARIABILI DI STATO

  const [euro, setEuro] = useState(0);
  
  const [valuta, setValuta] = useState("dollaro");

  const [cryptoValute, setCryptoValute] = useState([]);

const [mostraTutto, setMostraTutto] = useState(false)

  const { cryptos, getCryptos, portfolio } = useCrypto();

  const [valorePortfolio, setValorePortfolio] = useState(0);

  const [isOffline, setIsOffline] = useState(false);

  //----------------------------------------------------------------
  
  //FUNZIONI

function calcolaValorePortfolio() {
  let totale = 0;
  console.log("portfolio", portfolio);


/*Questo era l'esercizio di oggi 30/05, prima di tutto si fa un map di tutto l'array portfolio passato da portfolio attraverso li contex
------------------------------------

dopodiche si fa un find sull'array cryto che lo restituiesce per intero array ma definiamo che deve trovare il campo "symbol" (presente nel mock), e lo deve rendere identico a moneta crypto (valore all'interno dell'array passato da portfolio)

-----------------------------------------

dopodiché, il campo cryptoData se è popolato aggiunge alla costante totale il valore di quantità moltiplicato per quello delle valute 

*/

    portfolio.map((moneta) => {
      console.log("moneta.symbol: ", moneta);
      const crypto = cryptos.find((item) => item.symbol === moneta.crypto);
      console.log("crypto: ", crypto);
      if (crypto) {
        totale += parseFloat(moneta.quantita) * crypto.quote.USD.price;
      }
    });

  setValorePortfolio(totale);
}

  const accorciaListaCrypto = () => {
    const lista = mostraTutto ? cryptos.slice(0, 5) : cryptos.slice(0, 100);
    mostraTutto ? setMostraTutto(false) : setMostraTutto(true);

    setCryptoValute(lista);
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

  //Metodo per il cambio valore sui prezzi delle crypto
  const conversioneValore = (prezzo) => {
    return valuta === "dollaro" ? prezzo : prezzo * euro;
  };


  //---------------------------------------------------------

  //USEEFFECT

useEffect(() => {
  getCryptos();
  onGetEuro();

  //aggiunta di un "listener" che imposta lo stato offline 
  const unsubscribe = NetInfo.addEventListener(state =>{setIsOffline(!state.isConnected)})
  return () => unsubscribe();
}, [])


  //questo useEffect fa si che al montaggio della pagina si esegua la funzione calcolaValorePortfolio, e che questa si aggiorni ai valori di cryptos e portfolio
 useEffect(() => {
   calcolaValorePortfolio();
 }, [portfolio]);


  useEffect(() => {
    const setListaIniziale = () => {
      const listaCrypto = cryptos.slice(0, 5);
      setCryptoValute(listaCrypto);
    };
    setListaIniziale();
  }, [cryptos]);


  // LO SCORRIMENTO é DATO DA SCROLLVIEW
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
            {/* primo Blocco */}
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

            {/* secondo blocco */}
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

              {/* map sull'array per recuperare i dati */}
              <ScrollView>
                {cryptoValute.map((moneta) => (
                  <>
                    <View key={moneta} style={styled.contenitoreValute}>
                      <View>
                        <Text style={styled.textIntermedio}>
                          {moneta.symbol}
                        </Text>
                        <Text style={styled.textTop}>{moneta.name}</Text>
                      </View>
                      <View>
                        <View style={styled.contenitoreTextRight}>
                          <Text style={styled.textIntermedio}>
                            {valuta === "dollaro" ? "$" : "€"}
                            {conversioneValore(moneta.quote.USD.price).toFixed(
                              2
                            )}
                          </Text>
                        </View>
                        <View style={styled.contenitoreTextRight}>
                          <Text style={styled.textVariazioni}>24h </Text>
                          <Text
                            style={[
                              styled.textIntermedio,
                              {
                                color:
                                  moneta.quote.USD.percent_change_24h < 0
                                    ? "red"
                                    : "green",
                              },
                            ]}
                          >
                            {moneta.quote.USD.percent_change_24h.toFixed(2)}%
                          </Text>
                          <Text style={styled.textVariazioni}> || 7g </Text>
                          <Text
                            style={[
                              styled.textIntermedio,
                              {
                                color:
                                  moneta.quote.USD.percent_change_7d < 0
                                    ? "red"
                                    : "green",
                              },
                            ]}
                          >
                            {moneta.quote.USD.percent_change_7d.toFixed(2)}%
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styled.contenitoreTextRight}
                        >
                          <Text style={styled.textIntermedio}>Dettaglio</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
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
    marginTop:4
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

  //--------------------------
  //Immagine
  img: {
    height: "50%",
    width: "50%",
    marginBottom: 15,
  },
});



/*


STEPS:
1)MESSAGGIO DI OFFLINE HOME (FATTO)

2) IN PORTFOLIO QUANDO OFFLINE MOSTRARE SOLO LA PARTE HEADER E MESSAGGIO DI ERRORE (CHIEDI A DANILO DETTAGLI)

3)FARE IN MODO CHE IL CAMBIO VALUTA INFLUENZI ANCHE I VALORI GENERATI NELL'ELENCO(FATTO)

4)CREARE UNA SELECT CONTENENTE LE VARIAZIONI (nel mock che vanno da 24 ore a 90 giorni)

5) implementare un grafico che catturi le variazioni delle singole crypto

6)CREARE PAGINA DI DETTAGLIO DELLE SINGOLE VALUTE AL CLICK SU OGNUNA DI LORO



implemente pagina di dettaglio delle varie valute crypto
dove si mostra il valore iniziale e il valore di crescita negli ultimi 6 mesi

attaccare il tutto alla generazione di un grafico (cerca le librerie)


SE POSSIBILE 
cercare di individuare il picco più alto e più basso nell'ultimo mese

ALTRA DIFFICOLTà 

i range ogni 24 ore e 7 giorni inseriti in un menu a tendina(select) in cui si può scegliere il range (da 24 ore a 90 giorni vedi mock)
 */ 