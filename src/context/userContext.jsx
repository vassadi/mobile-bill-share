import { createContext } from 'react';

export const UserContext = createContext();

// eslint-disable-next-line react/prop-types
export const UserContextProvider = ({ value, children }) => (
  <UserContext.Provider value={value}> {children} </UserContext.Provider>
);
