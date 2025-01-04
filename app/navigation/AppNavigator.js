import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Dimensions} from 'react-native';
import HomeScreen from '../screens/Home/HomeScreen';
import BottomTabNavigator from './BottomTabNavigator';
import SavingDetailScreen from '../screens/Saving/SavingDetailScreen';
import AddSavingScreen from '../screens/Saving/AddSavingScreen';

const Stack = createNativeStackNavigator();

const {width, height} = Dimensions.get('window');

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SavingDetailScreen"
        component={SavingDetailScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddSavingScreen"
        component={AddSavingScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
export default AppNavigator;
