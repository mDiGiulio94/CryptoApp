//per i css
import { StyleSheet } from "react-native";

//questa impostazione è quella per scrivere dei fogli stile
export const GlobalStyles = StyleSheet.create({
  //la classe si scrive cosi
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: "#0f141E",
  },

  container2: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: "#1D2A3D",
  },

  card: {
    backgroundColor: "0xFF151C27",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "yellow",
  },
  text: {
    color: "white",
  },
  button: {
    backgroundColor: "#050E1C",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#ffff",
    textAlign: "center",
  },
});