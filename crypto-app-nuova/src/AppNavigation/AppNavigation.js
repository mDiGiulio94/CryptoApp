
//importa tutto = *
import * as React from "react";
//VIEW è IL DIV
import { View, Text, TouchableOpacity } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {createStackNavigator} from "@react-navigation/stack"

import { Ionicons } from '@expo/vector-icons';

import Home from "../screens/Home/Home";
import Portfolio from "../screens/Portfolio/Portfolio";
import CustomDrawerContent from "../Component/CustomDrawerContent";
import Dettaglio from "../screens/Dettaglio/Dettaglio";

import { useCrypto } from "../Context/CryptoContext";

//costante per la navigazione del drawer
const Drawer = createDrawerNavigator();



export default function AppNavigation() {

  const { getCryptos } = useCrypto();
  function reload() {
    getCryptos
    console.log('reload')
}

  return (
    <>

      <NavigationContainer>



        {/* Navigazione del DRAWER */}
        <Drawer.Navigator
          initialRouteName="Home"
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerRight: () => (
              <TouchableOpacity onPress={reload} style={{ marginRight: 15 }}>
                <Ionicons name="reload" size={22} color="white" />
              </TouchableOpacity>
            ),

            headerStyle: {
              backgroundColor: "#0f141e",
            },
            // imposta colore elementi header
            headerTintColor: "yellow",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: "20",
              letterSpacing: 7,
            },
            title: "CRYPTO APP",
          }}
        >
          <Drawer.Screen
            name="Home"
            component={Home}
            options={{
              //questo in realtà viene poi gestito e generato da DrawerItemList, in quando lo stiamo passando li come props
              drawerLabel: "Lista",
              drawerLabelStyle: { fontSize: 16, color: "white" },
              drawerIcon: () => (
                <Ionicons name={"list"} size={20} color={"white"} />
              ),
            }}
          />

          <Drawer.Screen
            name="Portfolio"
            component={Portfolio}
            options={{
              //questo in realtà viene poi gestito e generato da DrawerItemList, in quando lo stiamo passando li come props
              drawerLabel: "Portfolio",
              drawerLabelStyle: { fontSize: 16, color: "white" },
              drawerIcon: () => (
                <Ionicons name={"wallet-outline"} size={20} color={"white"} />
              ),
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  );

}
