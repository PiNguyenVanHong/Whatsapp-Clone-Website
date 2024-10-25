import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import "@/index.css";

import { ThemeProvider } from "@/providers/theme-provider";
import { StateProvider } from "@/context/state-context";
import reducer, { initialState } from "@/context/state-reducers";
import { Toaster as ToasterSonner } from "@/components/ui/sonner";
import ModalProvider from "@/providers/modal-provider";
import QueryProvider from "@/providers/query-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <StateProvider initialState={initialState} reducer={reducer}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <ModalProvider />
          {/* <Toaster /> */}
          <ToasterSonner theme="light" />
          <App />
        </ThemeProvider>
      </StateProvider>
    </QueryProvider>
  </StrictMode>
);
