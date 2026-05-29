// Autor: Brandon
// Descripción: Configuración de Vite para ejecutar el frontend React del validador CFG.

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
