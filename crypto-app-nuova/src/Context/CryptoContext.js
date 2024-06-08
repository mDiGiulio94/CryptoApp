import React, { Children } from "react";
import { createContext, useContext, useState, useEffect } from "react";
import CryptoApi from "../Api/CryptoAPI";
import AsyncStorage from '@react-native-async-storage/async-storage';

//variabile che conterrà il contesto
const CryptoContext = createContext();

//metodo che userà come context il crypto context
export const useCrypto = () => useContext(CryptoContext)

//il provider definisce valore a tutti i suoi figli e componendi che saranno avvolti
export const CryptoProvider = ({ children }) => {

  const [cryptos, setCryptos] = useState([]);

  const [portfolio, setPortfolio] = useState([]);

  const caricaPortfolioSalvato = async () => {
    try {
    //controlla se esiste l'oggetto portfolio
      const jsonValue = await AsyncStorage.getItem('portfolio')
      if (jsonValue !== null) {
        //tasforma la stringa in JSON
        setPortfolio(JSON.parse(jsonValue))
      }
  } catch (error) {
    console.error("Errore nel caricamento del portfolio: ", error)
  }
}


  const salvaPortfolio = async (nuovoPortfolio) => {
    setPortfolio(nuovoPortfolio)

    try {
      const jsonValue = JSON.stringify(nuovoPortfolio);
      //asyncStorage può essere anche trasformato in localstorage è la stessa cosa
      await AsyncStorage.setItem('portfolio', jsonValue)
    } catch (error) {
console.error("errore nel salvataggio del portfolio", error)
    }

  }

  //rimozione elementi dalla localstorage
  const rimuoviPortfolio = async () => {
    setPortfolio([])
    try {
      await AsyncStorage.removeItem('portfolio')
    } catch (error) {
      console.error("errore nella rimozione del portfolio", error)
    }
  }



    async function getCryptos() {
      try {
        const response = await CryptoApi.getCrypto();
        if (response) {
          setCryptos(response);
        }
      } catch (error) {
        console.log(error);
      }
  }

  //richiamo la funzione all'interno di un useEFFECT perché cosi all'avvio dell'applicazione si avvia subito, e crea permanenza dei dati
  useEffect(() => {
caricaPortfolioSalvato()
  }, [])

    return (
        //tutto ciò che viene avvolto da questo provider potrà accedere ai dati in cryptos e il metodo getCryptos
        <CryptoContext.Provider value={{cryptos, getCryptos, salvaPortfolio, rimuoviPortfolio, portfolio, setPortfolio}}>
{children}
        </CryptoContext.Provider>
    )

}


/*
In local storage non puoi innietare direttamente oggetti, vanno prima trasformati in stinga e poi ficcati la dentro


*/