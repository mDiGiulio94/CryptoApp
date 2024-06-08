import { CRYPTO } from "../Mocks/Crypto-Mock";
import axios from "axios";
import { CRYPTOREALE } from "../Mocks/Mock-Reale";

//chiamata dal sito
// async function getCrypto() {
//     const headers = {
//       headers: {
//      "X-CMC_PRO_API_KEY":'3768ef81-8446-4406-8773-bcb0827afa45'
//       },
//     };
//     try {
//         const response = await axios.get(
//           "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest", headers
//         );
//         return response.data;
// } catch (error) {
//     console.log(error)
// }

// }

async function getCrypto() {
  const headers = {
    headers: {
      "X-CMC_PRO_API_KEY": "3768ef81-8446-4406-8773-bcb0827afa45",
    },
  };
    try {
        const response = await CRYPTOREALE;
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function getEuro() {
  try {
    const response = await axios.get('https://api.frankfurter.app/latest?from=USD&to=EUR')
    return response.data
  } catch (error) {
    console.error("Attenzione: ", error)
  }
}

const CryptoApi = {
  getCrypto: getCrypto,
  getEuro: getEuro,
}



export default CryptoApi;