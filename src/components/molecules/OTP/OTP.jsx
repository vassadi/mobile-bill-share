/* eslint-disable react/prop-types */
import { useState } from 'react';

import OtpInput from 'react-otp-input';
// import PhoneInput from 'react-phone-input-2';
import { Toaster, toast } from 'react-hot-toast';
import { BsFillShieldLockFill } from 'react-icons/bs';
import { CgSpinner } from 'react-icons/cg';
import { auth, firebaseClientApp } from '../../../config/getClientConfig';
import {
  RecaptchaVerifier,
  getAuth,
  signInWithPhoneNumber,
} from 'firebase/auth';

import { TextField } from '@mui/material';
import { isUserAvailable } from '../../../api';

const OTP = ({
  prefilled = '',
  action = '',
  setAuthenticated,
  successCallback,
}) => {
  const [otp, setOtp] = useState('');
  const [ph, setPh] = useState(prefilled);
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [otpError, setOtpError] = useState(false);

  const handlePhoneChange = ({ target }) => {
    const value = target?.value;
    setPhoneError(!value);
    setPh(value);
  };

  function onCaptchaVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          // callback: () => {
          //   onLogin();
          // },
          'expired-callback': () => {},
        }
      );
    }
  }

  const onLogin = async (event) => {
    if (event) {
      event.preventDefault();
    }

    if (!ph) {
      setPhoneError(true);
    } else {
      setLoading(true);
      const isEmpty = await isUserAvailable(ph);

      console.log(isEmpty);
      if (action !== 'verify' && isEmpty) {
        setOtpError('User is not registered yet. Please create your account');
        setLoading(false);
      } else {
        setPhoneError(false);
        setOtpError(false);
        onCaptchaVerify();
        const appVerifier = window.recaptchaVerifier;
        const phoneNumber = '+1' + ph;
        signInWithPhoneNumber(
          getAuth(firebaseClientApp),
          phoneNumber,
          appVerifier
        )
          .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            setLoading(false);
            setShowOtp(true);
            toast.success('OTP Sent Sucessfully');
          })
          .catch((e) => {
            setLoading(false);
            setOtpError(e.message);
          });
        window.recaptchaVerifier = null;
      }
    }
  };

  function onOtpverify() {
    window.confirmationResult
      .confirm(otp)
      .then(async (result) => {
        // User signed in successfully.
        console.log(result);
        const user = result.user;
        setUser(user);
        setLoading(false);
        toast.success('OTP verified Sucessfully');
        setAuthenticated(true);
        successCallback?.();
        window.sessionStorage.setItem('userInfo', JSON.stringify(user));
        window.sessionStorage.setItem('accessToken', user.accessToken);
        // console.log('********************', auth.currentUser);
      })
      .catch((error) => {
        console.log(error.message);
        setOtpError('The OTP you entered is not valid.');
      });
  }

  const headerMsg = action
    ? 'Please verify your mobile number'
    : 'Sign in using your mobile number';
  return (
    <div className={`d-flex justify-content-center`}>
      <Toaster toastOptions={{ duration: 4000 }} />
      {/* <img src={bgimg} alt="bgimg" className={` ${Style.loginimg}`} /> */}
      {!user ? (
        <div className={`row position-absolute mt-5  `}>
          <div className="signuppage mt-5 bg-dark text-white p-5 ">
            {showOtp ? (
              <div className="optvarificationcontent">
                <p className="error-msg">{otpError}</p>
                <span className="d-flex justify-content-center">
                  <BsFillShieldLockFill size={40} />
                </span>
                <h6 className="alignTextCenter mt-3">Enter Your OTP </h6>
                <div className="d-flex justify-content-center">
                  <OtpInput
                    className="justify-content-center"
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    shouldAutoFocus
                    renderInput={(props) => (
                      <input
                        {...props}
                        style={{
                          width: '35px',
                          height: '35px',
                          marginRight: '12px',
                          textAlign: 'center',
                          fontSize: '16px',
                        }}
                      />
                    )}
                  ></OtpInput>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-primary mt-3 w-75 "
                    onClick={onOtpverify}
                  >
                    {loading && (
                      <span
                        className="spinner-border spinner-border-sm"
                        style={{ marginRight: '10px' }}
                      ></span>
                    )}
                    <span> Verify OTP</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="signup-wrapper">
                  <p className="error-msg">{otpError}</p>
                  <h6 className="mt-3">{headerMsg}*</h6>
                  <TextField
                    value={ph}
                    error={phoneError}
                    id="standard-basic5"
                    label="Mobile number"
                    variant="standard"
                    margin="dense"
                    fullWidth
                    onChange={(e) => handlePhoneChange(e)}
                    disabled={prefilled ? true : false}
                    helperText={phoneError ? 'Phone number is required' : ''}
                  />
                  <br />

                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-primary mt1 w-75 "
                      onClick={onLogin}
                    >
                      {loading && (
                        <CgSpinner size={20} className="mt-1 animate-spin" />
                      )}
                      <span>Send OTP via SMS</span>
                    </button>
                  </div>
                  <div id="recaptcha-container" className="mt-6"></div>
                  <p className="disclosure">
                    *message and data rates may apply
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className=" row position-absolute  text-white p-5">
          <p style={{ marginTop: '70%' }}>Login Sucessfully</p>
        </div>
      )}
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default OTP;
