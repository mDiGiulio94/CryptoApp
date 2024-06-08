import React from "react";
import { Modal, Text, View, TouchableOpacity, StyleSheet } from "react-native";


const ConfirmModal = ( {isVisible, onConfirm, onCancel, item }) => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={onCancel}
      >
        <View style={styled.centeredView}>
          <View style={styled.modalView}>
            <Text style={styled.modalText}>
              Sei sicuro di voler eliminare {item}?
            </Text>
            <View style={styled.btnContainer}>
              <TouchableOpacity
                style={[styled.button, styled.btnCancella]}
                onPress={onCancel}
              >
                <Text style={styled.textStyle}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styled.button, styled.btnConfirm]}
                onPress={onConfirm}
              >
                <Text style={styled.textStyle}>Elimina</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
}



const styled = StyleSheet.create({
  //CONTENITORI
    centeredView: {
      flex:1,
    backgroundColor: "black",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "white",
    width: "70%",
      borderRadius: 10,
    margin:'auto',
    alignItems: "center",
    padding: 20,
  },

  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
      width: "100%",

  },
  //----------------------------------------------
  //BOTTONI
  button: {
      width: 100,
      alignItems: "center",
      height: 40,
      justifyContent: "center",
      borderRadius: 10,
      marginHorizontal: 5,
      marginTop:10
  },

  btnCancella: {
    backgroundColor: "grey",
    },
  
    btnConfirm: {
      backgroundColor:'orange',
  },
  //-----------------------------------------------------
  //TESTI
  modalText: {
    fontWeight: "bold",
    
  },

  textStyle: {
    padding: 5,
  },


});

export default ConfirmModal;