import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import ButtonComponent from '../../components/ButtonComponent';
import useAuth from '../../auth/useAuth';
import auth from '@react-native-firebase/auth';
import colors from '../../config/colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.heading}>
          Hi {auth()?.currentUser?.displayName}
        </Text>
        <TouchableOpacity activeOpacity={0.8}>
          <Image
            source={require('../../assets/notification.png')}
            style={styles.ic}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: colors.primary,
  },
  content: {
    backgroundColor: colors.white,
    flex: 1,
    borderTopLeftRadius: 52,
    borderTopRightRadius: 52,
  },
  heading: {
    fontSize: 18,
    color: colors.black,
    fontWeight: '700',
  },
  row: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: '9%',
  },
  ic: {
    width: 30,
    height: 30,
  },
});
