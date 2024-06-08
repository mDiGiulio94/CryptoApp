import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Image , TouchableOpacity,} from "react-native";
import { GlobalStyles } from "../../GlobalStyle";
import { Picker } from "@react-native-picker/picker";
import { useCrypto } from "../../Context/CryptoContext";
import { Ionicons } from "@expo/vector-icons";
import ConfirmModal from "../../Component/ConfirmModal";

export default function Portfolio() {
  const { cryptos,
  getCryptos,
  salvaPortfolio,
  rimuoviPortfolio,
  portfolio,
    setPortfolio } = useCrypto();

  const [isButtonEnabled, setIsButtonEnabled] = useState(false)

  const [valoriSelect, setValoriSelect] = useState([]);

  //immagazzina i dati delle valute nel portfolio, PASSATA AL CONTEXT
  // const [portfolio, setPortfolio] = useState([]);

  const [quantita, setQuantita] = useState("");

  //gestione crypto selezionata dal select
  const [selectedCrypto, setSelectedCrypto] = useState("");

  const [modalVisible, setModalVisible] = useState(false)

  const [itemToDelate, setItemToDelate] = useState(null)

  function showModal(item)
  {
    setItemToDelate(item);
    setModalVisible(true)
    console.log("Aperto")
    console.log(item)
    console.log(modalVisible)
  }

  function confirmDelete(item) {
    setModalVisible(false)
    removeCrypto(item)
    
}


  function filtraCrypto() {
    const cryptoFiltrate = cryptos.map((moneta) => moneta.symbol);
    setValoriSelect(cryptoFiltrate);
  }

  function removeCrypto(crypto) {
    //rintraccia tramite index
    const indiceEsistente = portfolio.findIndex(moneta => moneta.crypto === crypto)
    //lo spreadOperator fa una deepcopy o shallowcopy? Risposta shallowcopy ovvero copia solo delle chiavi in superfice
    let portfolioAggiornato = [...portfolio];
    //splice per tagliare degli elementi, qui si indica che vanno tagliati da indiceEsistente e ne va tagliato solo 1 alla volta, modificare quell'"1" con altri valori numerici significa che ne taglia altri
    portfolioAggiornato.splice(indiceEsistente, 1)

    setPortfolio(portfolioAggiornato)

  }


    function aggiungiAlPortfolio() {
    //accesso a portfolio "array" e trovami l'indice corrispondente alle crypto se moneta.crypto è uguale a quella selezionata la individua altrimenti restituisce -1 (non l'ha trovata)
    const indiceEsistente = portfolio.findIndex(
      (moneta) => moneta.crypto === selectedCrypto
    );

    if (indiceEsistente >= 0) {
      //la crypto esiste già nel portfolio, e quindi va aggiornata la quantità
      const nuovoPortfolio = portfolio.map((item, index) => {
        //indice uguale a quello dell'oggetto cercato
        if (index === indiceEsistente) {
          return {
            //spread operator
            ...item,
            quantita: (
              parseFloat(item.quantita.replace(",", ".")) +
              parseFloat(quantita.replace(",", "."))
            )
              .toString()
              .replace(",", "."),
            //oggetto preso (ad esempio BTC) il replace sostituisce la virgola col punto
            //qui si fa oggetto quantità + la quantità scelta dall'utente e lo si riconverte in string
          };
        }
        //ritornami l'oggetto modificato
        return item;
      });
      //aggiorna il portfolio con il valore di nuovo portfolio //temporanea fino al refresh
      //commentato perché prende i metodi dal contex
      // setPortfolio(nuovoPortfolio);

      //aggiunge anche al localStorage //
      salvaPortfolio(nuovoPortfolio);
    } else {
      //commentato perché prende i metodi dal contex
      //se la crypto non c'è nel portfolio si svolge:
      // setPortfolio([
      //   duplica portfolio cosi non perde i valori al suo interno
      //   ...portfolio,
      //   {
      //     crypto: selectedCrypto,
      //     quantita,
      //   },
      // ]);
      //per il localSession
      salvaPortfolio([
        ...portfolio,
        {
          crypto: selectedCrypto,
          quantita,
        },
      ]);
    }
    //resetto tutti i campi selected e quantità per evitare somme indesiderate
    setSelectedCrypto("");
    setQuantita("");
  }

  //funzione per svuotare il portfolio completamente, semplicemente settare il portfolio ad array vuoto
  //Sostituito perché abbiamo uno svuota portfolio preso dal context
  // function svuotaPortfolio() {
  //   setPortfolio([]);

  // }


    useEffect(() => {
      getCryptos;
      if (cryptos.length) {
        filtraCrypto();
      }
    }, [cryptos, getCryptos]);

//aggiorna se il pulsante ha i suoi
  useEffect(() => {
    setIsButtonEnabled(quantita.length > 0 && selectedCrypto !== "");
  }, [quantita, selectedCrypto]);


  return (
    <>
      <View style={GlobalStyles.container2}>
        <View style={styled.contenitoreTitolo}>
          <View style={styled.allineamentoL}>
            <Ionicons
              name="wallet-outline"
              style={styled.textGenerico}
            ></Ionicons>
          </View>
          <View style={styled.allineamentoR}>
            <Text style={styled.textGenerico}>Portfolio</Text>
          </View>
        </View>

        {/* contenitore delle crypto totali possedute */}
        <View>
          {portfolio.map((moneta) => (
            <View style={styled.contenitoreValute}>
              <Text style={styled.testoValute}>
                {moneta.quantita} {moneta.crypto}
              </Text>
              <TouchableOpacity style={styled.contenitoreBottoneTrash}>
                <Ionicons
                  name={"trash-outline"}
                  size={30}
                  color={"white"}
                  onPress={() => showModal(moneta.crypto)}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View>
          <Text style={styled.textGenerico}>Qtà:</Text>
          <TextInput
            style={[styled.input]}
            keyboardType="numeric"
            value={quantita}
            onChangeText={(text) => {
              // Consenti solo numeri (e, opzionalmente, un punto per i decimali)
              const filteredText = text.replace(/[^0-9.]/g, "");
              setQuantita(filteredText);
            }}
          />
          <View style={styled.pickerCon}>
            <Picker
              selectedValue={selectedCrypto}
              style={styled.picker}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedCrypto(itemValue)
              }
            >
              <Picker.Item label="Seleziona crypto" value="" color="white" />
              {valoriSelect.map((crypto) => (
                <Picker.Item
                  key={crypto}
                  label={crypto}
                  value={crypto}
                  color="white"
                />
              ))}
            </Picker>
          </View>
          <View style={styled.contenitoreBottoneA}>
            <TouchableOpacity
              onPress={aggiungiAlPortfolio}
              disabled={!isButtonEnabled}
              style={[styled.bottoni, { opacity: isButtonEnabled ? 1 : 0.3 }]}
            >
              <Text>Aggiungi Crypto</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styled.contenitoreBottoneB}>
          <TouchableOpacity style={[styled.bottoni]} onPress={rimuoviPortfolio}>
            <Text>Svuota Portfolio</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ConfirmModal
        isVisible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={() => setModalVisible(false)}
        item={itemToDelate}
      />
    </>
  );
}

const styled = StyleSheet.create({
  //Container

  contenitoreTitolo: {
    backgroundColor: "#1D2A3D",
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  contenitoreValute: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  contenitoreBottoneA: {
    backgroundColor: "orange",
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
  },

  contenitoreBottoneTrash: {
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
  },

  contenitoreBottoneB: {
    backgroundColor: "orange",
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    marginTop: 10,
  },

  pickerCon: {
    height: 85,
    overflow: "hidden",
    marginBottom: 20,
  },

  //allineamenti

  allineamentoL: {
    marginLeft: 120,
  },

  allineamentoR: {
    marginRight: 120,
  },

  //Text
  textGenerico: {
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
  },

  testoValute: {
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
  },

  textInput: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },

  //--------------------------------------

  //Input

  input: {
    color: "#fff",
    fontSize: 20,
    backgroundColor: "#0F141E",
    paddingHorizontal: 5,
    marginBottom: 10,
    height: 50,
  },

  //---------------------------

  picker: {
    position: "relative",
    top: -80,
    color: "white",
  },

  //Bottoni
  bottoni: {
    padding: 10,
    alignItems: "center",
  },

  //---------------------------------

});



/*
RICORDA:

La session storage è molto più temporale, a chiusura di scheda e browser si perdono tutti i dati

-------------------------------------------------------

La local storage invece è più permanente perché a meno che non si decide di svuotarla volutamente, continua a persistere


*/