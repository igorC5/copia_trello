import React from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';

function App() {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex-grow overflow-hidden">
        <Board />
      </main>
    </div>
  );
}

export default App;