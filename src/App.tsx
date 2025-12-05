import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MessageProvider } from './contexts/MessageContext';
import MessageContainer from './components/MessageContainer';
import Header from './components/Header';
import { routes } from './config/routes';

function App() {
  return (
    <BrowserRouter>
      <MessageProvider>
        <Header />
        <Routes>
          {Object.values(routes).map((route) => (
            <Route
              key={route.name}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>
        <MessageContainer />
      </MessageProvider>
    </BrowserRouter>
  );
}

export default App;
