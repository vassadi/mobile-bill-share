/* eslint-disable react/prop-types */
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { store } from '../../../config/getClientConfig';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import OTP from '../OTP';

const SignUp = ({ handleChange, setAuthenticated }) => {
  const [name, setName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validatePhone, setValidatePhone] = useState(false);

  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [genericError, setGenericError] = useState(false);

  const pattern = new RegExp(/^\d{1,10}$/);

  const signUpUser = async () => {
    const groupsRef = collection(store, 'groups');
    const usersRef = collection(store, 'users');

    const groupData = {
      name: name,
      number: phoneNumber,
      groupName: groupName,
    };
    const { id: groupId } = await addDoc(groupsRef, groupData);

    const userData = {
      groupId: groupId,
      name: name,
      number: phoneNumber,
      isAdmin: true,
      isActive: true,
    };

    await addDoc(usersRef, userData);
  };
  const regiserHandler = async (e) => {
    e.preventDefault();

    setNameError(false);
    setPhoneError(false);
    setGenericError(false);

    const isInvalid = [name, phoneNumber].some((x) => !x);

    if (isInvalid) {
      if (!name) {
        setNameError(true);
      }
      if (!phoneNumber) {
        setPhoneError(true);
      }
    } else {
      console.log('Submitting..');

      const usersRef = collection(store, 'users');

      const snap = query(usersRef, where('number', '==', phoneNumber));
      const docs = await getDocs(snap);

      if (docs.empty) {
        setValidatePhone(true);
      } else {
        setGenericError('User already existed.');
      }
    }
  };

  return (
    <>
      <h5>Signup</h5>
      <p>
        Are you a returning user? If so, you can{' '}
        <a href="#" onClick={() => handleChange()}>
          access your account
        </a>{' '}
        here.
      </p>

      {!validatePhone ? (
        <>
          <p className="error-msg">{genericError}</p>
          <p>Please fill in this form to create an account.</p>
          <form onSubmit={regiserHandler}>
            <TextField
              value={name}
              error={nameError}
              id="pref-name"
              label="Peferred name"
              variant="standard"
              margin="dense"
              onChange={(e) => setName(e.target.value)}
              helperText={nameError ? 'Name is required' : ''}
              fullWidth
            />
            <br />
            <TextField
              value={phoneNumber}
              error={phoneError}
              id="phoneNumber"
              label="Phone number"
              variant="standard"
              margin="dense"
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setPhoneError(!pattern.test(e.target.value));
              }}
              helperText={phoneError ? 'Phone number is required' : ''}
              fullWidth
            />
            <br />
            <TextField
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              id="groupNmme"
              label="Group name"
              variant="standard"
              margin="dense"
              fullWidth
              helperText="Optional"
            />
            <br />
            <br />

            <Button
              className="register"
              variant="contained"
              type="submit"
              size="medium"
            >
              Register
            </Button>
          </form>
        </>
      ) : (
        <OTP
          setAuthenticated={setAuthenticated}
          prefilled={phoneNumber}
          successCallback={signUpUser}
          action={'verify'}
        />
      )}
    </>
  );
};

export default SignUp;
