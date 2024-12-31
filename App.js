import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import LoginScreen from './app/screens/Login/LoginScreen';
import SignUpScreen from './app/screens/SignUp/SignUpScreen';

export default function App() {
  return <SignUpScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
