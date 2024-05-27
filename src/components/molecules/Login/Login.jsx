/* eslint-disable react/prop-types */

import OTP from '../OTP';

const Login = ({ handleChange, setAuthenticated }) => {
  return (
    <div>
      <h2 className="text-6xl leading-loose mb-8">Login</h2>
      <p className="mb-5">
        Don&apos;t have an account?{' '}
        <a href="#" onClick={() => handleChange()}>
          Create your account
        </a>{' '}
        it takes less than a minute.
      </p>

      <OTP setAuthenticated={setAuthenticated} />
    </div>
  );
};

export default Login;
