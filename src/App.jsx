/* eslint-disable react/jsx-key */
import { useState } from 'react';

import './App.css';

import LoginPage from './components/organisms/LoginPage';
import BillingDetails from './components/organisms/BillingDetails/BillingDetails';
import Dashboard from './components/organisms/Dashboard/Dashboard';
import Header from './components/molecules/Header';

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const userSession = sessionStorage.getItem('accessToken');

  console.log('***  APP  ***');
  return (
    <>
      {isAuthenticated || userSession ? (
        <>
          <Dashboard />
        </>
      ) : (
        <LoginPage setAuthenticated={setAuthenticated} />
      )}
    </>
  );
}

export default App;
