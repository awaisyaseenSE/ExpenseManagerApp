import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import colors from '../../config/colors';
import BackCompo from '../../components/BackCompo';
import ButtonComponent from '../../components/ButtonComponent';
import {screenNames} from '../../navigation/ScreenNames';

export default function SavingDetailScreen({route}) {
  const navigation = useNavigation();
  const routeData = route?.params?.data;

  return (
    <View style={styles.container}>
      <BackCompo title={routeData} />
      <View style={styles.content}>
        <Text>SavingDetailScreen</Text>
      </View>
      <View style={styles.footer}>
        <ButtonComponent
          title="Add savings"
          onPress={() =>
            navigation.navigate(screenNames.addSavingScreen, {
              data: routeData,
            })
          }
          style={styles.btn}
        />
      </View>
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
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  footer: {
    paddingVertical: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  btn: {
    width: '40%',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
