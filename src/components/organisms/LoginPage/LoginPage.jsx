/* eslint-disable react/prop-types */
import { useState } from 'react';

import SignUp from '../../molecules/SignUp';
import Login from '../../molecules/Login/Login';

import './styles.scss';

const LoginPage = ({ setAuthenticated }) => {
  const [register, setRegister] = useState(true);

  const handleChange = () => {
    setRegister(!register);
  };

  return (
    <div className="min-h-dvh box-form">
      <div className="left">
        <div className="overlay">
          <h1>
            Bill <br />
            Share
          </h1>
          <p className="text-2xl">
            Share your mobile bills easily with your group members.
          </p>
        </div>
      </div>

      <div className="right">
        {register ? (
          <SignUp
            handleChange={handleChange}
            setAuthenticated={setAuthenticated}
          />
        ) : (
          <Login
            handleChange={handleChange}
            setAuthenticated={setAuthenticated}
          />
        )}
        <br />
      </div>
    </div>
  );
};

export default LoginPage;
