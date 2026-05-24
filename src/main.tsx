import React from 'react';
import ReactDOM from 'react-dom/client';
import BattleScreen from './BattleScreen';

const rootElement = document.getElementById('app');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    React.createElement(BattleScreen)
  );
}