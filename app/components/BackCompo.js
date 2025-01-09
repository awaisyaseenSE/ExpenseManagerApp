import {View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import colors from '../config/colors';

const BackCompo = ({showBack = true, title = '', style, onPressBack}) => {
  const navigation = useNavigation();
  const backPress = onPressBack ? onPressBack : () => navigation.goBack();

  return (
    <View style={[styles.container, style]}>
      {showBack ? (
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={{top: 10, bottom: 10, left: 20, right: 20}}
          // onPress={() => navigation.goBack()}
          onPress={backPress}>
          <Image source={require('../assets/back.png')} style={styles.backIC} />
        </TouchableOpacity>
      ) : (
        <View style={styles.backIC} />
      )}
      <Text style={styles.heading}>{title}</Text>
      <TouchableOpacity>
        <Image
          source={require('../assets/notification.png')}
          style={styles.rightIc}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: '9%',
  },
  logo: {
    width: 50,
    height: 50,
  },
  backIC: {
    width: 20,
    height: 20,
  },
  rightIc: {
    width: 30,
    height: 30,
  },
  heading: {
    fontSize: 18,
    color: colors.black,
    fontWeight: '700',
  },
});

export default BackCompo;
