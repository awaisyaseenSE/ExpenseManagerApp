import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import colors from '../config/colors';
import {useNavigation} from '@react-navigation/native';
import {screenNames} from '../navigation/ScreenNames';

const screenWidth = Dimensions.get('window').width;
const numColumns = 3;
const gap = 20;
const paddingHorizontal = 30;

const availableSpace =
  screenWidth - (numColumns - 1) * gap - paddingHorizontal * 2;

const itemSize = availableSpace / numColumns;

const ShowCategoryCompo = ({data}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate(screenNames.savingDetailScreen, {data: data})
      }
      style={styles.container}>
      <View style={styles.icContainer}>
        <Image source={require('../assets/category.png')} style={styles.ic} />
      </View>
      <Text style={styles.heading}>{data}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: itemSize,
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
  },
  heading: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.black,
    fontWeight: '700',
    marginTop: 2,
  },
});

export default ShowCategoryCompo;
