import React from 'react';
import './App.css';
import MainRoute from './routes/main-route';
import { Provider } from "unistore/react";
import { store } from "./store";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <MainRoute />
      </Provider>
    </div>
  );
}

export default App;
