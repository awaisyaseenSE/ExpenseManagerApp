import {Image, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import colors from '../config/colors';
import {screenNames} from './ScreenNames';
import HomeScreen from '../screens/Home/HomeScreen';
import AnalysisScreen from '../screens/Analysis/AnalysisScreen';
import TransactionScreen from '../screens/Transaction/TransactionScreen';
import SavingScreen from '../screens/Saving/SavingScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const isIOS = Platform.OS === 'ios';

  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarButton: props => (
          <TouchableOpacity {...props} activeOpacity={1} />
        ),
        tabBarLabelStyle: {
          fontSize: 11,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.black,
        tabBarStyle: {
          backgroundColor: '#DFF7E2',
          shadowColor: colors.grey,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          paddingVertical: 3,
          height: 66,
          paddingBottom: isIOS ? 20 : 16,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
        },
      }}>
      <BottomTab.Screen
        component={HomeScreen}
        name={screenNames.homeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={
                  focused
                    ? require('../assets/Home.png')
                    : require('../assets/Home.png')
                }
                style={[
                  styles.iconStyle,
                  {tintColor: focused ? colors.primary : colors.black},
                ]}
              />
            );
          },
        }}
      />
      <BottomTab.Screen
        component={AnalysisScreen}
        name={screenNames.analysisScreen}
        options={{
          tabBarLabel: 'Analysis',
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={
                  focused
                    ? require('../assets/SearchTabBar.png')
                    : require('../assets/SearchTabBar.png')
                }
                style={[
                  styles.iconStyle,
                  {tintColor: focused ? colors.primary : colors.black},
                ]}
              />
            );
          },
        }}
      />
      <BottomTab.Screen
        component={TransactionScreen}
        name={screenNames.transactionScreen}
        options={{
          tabBarLabel: 'Transaction',
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={
                  focused
                    ? require('../assets/transactionTabBar.png')
                    : require('../assets/transactionTabBar.png')
                }
                style={[
                  styles.iconStyle,
                  {tintColor: focused ? colors.primary : colors.black},
                ]}
              />
            );
          },
        }}
      />
      <BottomTab.Screen
        component={SavingScreen}
        name={screenNames.savingScreen}
        options={{
          tabBarLabel: 'Saving',
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={
                  focused
                    ? require('../assets/savingTabBar.png')
                    : require('../assets/savingTabBar.png')
                }
                style={[
                  styles.iconStyle,
                  {tintColor: focused ? colors.primary : colors.black},
                ]}
              />
            );
          },
        }}
      />
      <BottomTab.Screen
        component={ProfileScreen}
        name={screenNames.profileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={
                  focused
                    ? require('../assets/profile.png')
                    : require('../assets/profile.png')
                }
                style={[
                  styles.iconStyle,
                  {tintColor: focused ? colors.primary : colors.black},
                ]}
              />
            );
          },
        }}
      />
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

export default BottomTabNavigator;
