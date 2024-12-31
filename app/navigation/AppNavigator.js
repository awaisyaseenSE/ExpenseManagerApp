import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Dimensions} from 'react-native';
import HomeScreen from '../screens/Home/HomeScreen';

const Stack = createNativeStackNavigator();

const {width, height} = Dimensions.get('window');

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
export default AppNavigator;
