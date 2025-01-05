import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import colors from '../../config/colors';

const ShowSavingCompo = ({data, index}) => {
  console.log(data);
  return (
    <View style={styles.container}>
      <View style={styles.icContainer}>
        <Image
          source={require('../../assets/category.png')}
          style={styles.ic}
        />
      </View>

      <View style={{flex: 1}}>
        <Text style={styles.heading}>{data?.title}</Text>
        <Text style={styles.dateTxt}>{data?.date}</Text>
      </View>
      <Text style={styles.price}>${data?.amount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 14,
    color: colors.black,

    fontWeight: '700',
  },
  dateTxt: {
    fontSize: 13,
    color: colors.blue,

    fontWeight: '700',
  },
  ic: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginVertical: 20,
    tintColor: colors.white,
  },
  icContainer: {
    alignItems: 'center',
    backgroundColor: colors.blue_light,
    borderRadius: 12,
    width: 60,
    height: 60,
    justifyContent: 'center',
    marginRight: 16,
  },
  price: {
    fontSize: 13,
    color: colors.black,

    fontWeight: '700',
  },
});

export default ShowSavingCompo;
