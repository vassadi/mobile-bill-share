import { useState } from 'react';

import LoginPage from './components/organisms/LoginPage';
import Dashboard from './components/organisms/Dashboard/Dashboard';
import ErrorBoundary from './components/molecules/ErrorBoundary';
import { ACCESS_TOKEN } from './constants';

import './App.css';

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const userSession = sessionStorage.getItem(ACCESS_TOKEN);

  console.log('***  APP  ***');
  return (
    <>
      {isAuthenticated || userSession ? (
        <ErrorBoundary>
          <Dashboard />
        </ErrorBoundary>
      ) : (
        <LoginPage setAuthenticated={setAuthenticated} />
      )}
    </>
  );
}

export default App;
