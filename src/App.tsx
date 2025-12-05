import React from 'react';
import { MessageProvider } from './contexts/MessageContext';
import MessageContainer from './components/MessageContainer';
import Header from './components/Header';

function App() {
  return (
    <MessageProvider>
      <Header />
      <MessageContainer />
    </MessageProvider>
  );
}

export default App;
