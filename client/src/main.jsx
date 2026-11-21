
/**
 * CampusConnect AI - Entry Point
 * Author: SPA
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';
import "./index.css";

// Connect React frontend to the deployed backend
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
