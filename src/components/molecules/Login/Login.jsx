/* eslint-disable react/prop-types */

import OTP from '../OTP';

const Login = ({ handleChange, setAuthenticated }) => {
  return (
    <>
      <h5>Login</h5>
      <p>
        Don&apos;t have an account?{' '}
        <a href="#" onClick={() => handleChange()}>
          Creat your account
        </a>{' '}
        it takes less than a minute.
      </p>
      <br />
      <OTP setAuthenticated={setAuthenticated} />
      <br /> <br />
    </>
  );
};

export default Login;
