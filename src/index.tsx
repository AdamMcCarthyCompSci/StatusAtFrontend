// import React from 'react';
import ReactDOM from "react-dom/client";
import "./index.css";
import {BrowserRouter as Router} from "react-router-dom";

import App from "./App";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import {UserProvider} from "./Context/User.tsx";
import "@mantine/carousel/styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <UserProvider>
      <App />
    </UserProvider>
  </Router>
);
