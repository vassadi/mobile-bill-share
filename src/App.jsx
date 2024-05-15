import { useState } from 'react';

import LoginPage from './components/organisms/LoginPage';
import Dashboard from './components/organisms/Dashboard/Dashboard';
import ErrorBoundary from './components/molecules/ErrorBoundary';
import { ACCESS_TOKEN } from './constants';

import './App.css';

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const userSession = sessionStorage.getItem(ACCESS_TOKEN);

  const themeSwitch = () => {
    document.body.classList.toggle('billVariant');
  };
  console.log('***  APP  ***');
  return (
    <>
      <button className="themeSwitcher" onClick={themeSwitch}>
        &#x2022;
      </button>
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
