import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import LoginScreen from './app/screens/Login/LoginScreen';
import SignUpScreen from './app/screens/SignUp/SignUpScreen';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigator';
import AuthNavigator from './app/navigation/AuthNavigator';
import auth from '@react-native-firebase/auth';
import AuthsContext from './app/auth/AuthsContext';

export default function App() {
  const [user, setUser] = useState(null);

  const checkUser = async () => {
    if (auth().currentUser !== null && auth().currentUser !== undefined) {
      setUser(auth().currentUser);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <NavigationContainer>
      <AuthsContext.Provider value={{user, setUser}}>
        {user !== null ? <AppNavigator /> : <AuthNavigator />}
      </AuthsContext.Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
