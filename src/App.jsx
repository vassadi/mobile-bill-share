import { useState } from 'react';

import LoginPage from './components/organisms/LoginPage';
import Dashboard from './components/organisms/Dashboard/Dashboard';

import './App.css';

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const userSession = sessionStorage.getItem('accessToken');

  console.log('***  APP  ***');
  return (
    <>
      {isAuthenticated || userSession ? (
        <Dashboard />
      ) : (
        <LoginPage setAuthenticated={setAuthenticated} />
      )}
    </>
  );
}

export default App;
