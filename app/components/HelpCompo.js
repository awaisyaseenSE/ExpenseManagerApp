import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../config/colors';

const HelpCompo = ({title = '', onPress, image}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}>
      <Image source={image} style={{width: 32, height: 32}} />
      <Text style={styles.heading}>{title}</Text>
      <Image
        source={require('../assets/rightArrow.png')}
        style={{width: 12, height: 12}}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  imgContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#6DB6FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 15,
    color: colors.black,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
});

export default HelpCompo;
