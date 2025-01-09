import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../../config/colors';

const ListCompo = ({title = '', onPress, image}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}>
      <View style={styles.imgContainer}>
        <Image
          source={image}
          resizeMode="contain"
          tintColor={colors.white}
          style={{width: 20, height: 20}}
        />
      </View>
      <Text style={styles.heading}>{title}</Text>
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
  },
});

export default ListCompo;
