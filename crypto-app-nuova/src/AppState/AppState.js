import React, { useState, useEffect } from "react";
import AppNavigation from "../AppNavigation/AppNavigation";
import { CryptoProvider } from "../Context/CryptoContext";

export default function AppState() {
    return (
      <>
        <CryptoProvider>
          <AppNavigation />
        </CryptoProvider>
      </>
    );
}
