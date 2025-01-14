import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import LoginScreen from './app/screens/Login/LoginScreen';
import SignUpScreen from './app/screens/SignUp/SignUpScreen';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigator';
import AuthNavigator from './app/navigation/AuthNavigator';
import auth from '@react-native-firebase/auth';
import AuthsContext from './app/auth/AuthsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constansts from './app/constants/constansts';

export default function App() {
  const [user, setUser] = useState(null);

  const checkUser = async () => {
    if (auth().currentUser !== null && auth().currentUser !== undefined) {
      setUser(auth().currentUser);
    } else {
      setUser(null);
    }
  };

  const loadSelectedCurrency = async () => {
    try {
      const savedCurrency = await AsyncStorage.getItem('selectedCurrency');
      if (savedCurrency) {
        let dd = JSON.parse(savedCurrency);
        console.log(dd);
        constansts.currencyCode = dd?.code;
      } else {
        constansts.currencyCode = 'USD';
      }
    } catch (error) {
      console.error('Failed to load the selected currency:', error);
    }
  };

  useEffect(() => {
    loadSelectedCurrency();
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
