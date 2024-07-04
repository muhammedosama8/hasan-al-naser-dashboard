import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './store/store';
import  ThemeContext  from "./context/ThemeContext"; 
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Provider store = {store}>
      <BrowserRouter>
        <ThemeContext>
          <App />
        </ThemeContext>
      </BrowserRouter>
    </Provider>
  </>
);
reportWebVitals();