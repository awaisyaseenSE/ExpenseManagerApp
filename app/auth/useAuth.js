import {useContext} from 'react';
import AuthsContext from './AuthsContext';
import auth from '@react-native-firebase/auth';

function useAuth() {
  const {user, setUser} = useContext(AuthsContext);
  const login = user => {
    setUser(user);
    // setUser(true);
  };
  const logout = () => {
    auth()
      .signOut()
      .then(() => {
        setUser(null);
      })
      .catch(er =>
        console.log('error while logout user in useAuth file: ', er),
      );
    // setUser(null);
  };
  return {user, setUser, login, logout};
}

export default useAuth;
