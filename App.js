import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import LoginScreen from './app/screens/Login/LoginScreen';
import SignUpScreen from './app/screens/SignUp/SignUpScreen';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigator';
import AuthNavigator from './app/navigation/AuthNavigator';
import auth from '@react-native-firebase/auth';

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
      {user !== null ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
