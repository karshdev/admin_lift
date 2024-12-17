import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";
import { Provider } from "react-redux";
import store from "./store/store.jsx";
import { RouterProvider } from "react-router-dom";
import AppRouter from "./Router/AppRouter.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={AppRouter} />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
