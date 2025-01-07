import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import ButtonComponent from '../../components/ButtonComponent';
import useAuth from '../../auth/useAuth';
import auth from '@react-native-firebase/auth';
import colors from '../../config/colors';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {screenNames} from '../../navigation/ScreenNames';
import TotalExpenseIncomeShowingCompo from '../../components/TotalExpenseIncomeShowingCompo';
import firestore from '@react-native-firebase/firestore';
import ShowSavingCompo from '../../components/savings/ShowSavingCompo';
import HomeListCompo from '../../components/Home/HomeListCompo';
import BackCompo from '../../components/BackCompo';

export default function AnalysisScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [lastWeekIncome, setLastWeekIncome] = useState(null);
  const [lastWeekExpense, setLastWeekExpense] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [allData, setAllData] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  return (
    <View style={styles.container}>
      <BackCompo title="Analysis" showBack={false} />
      <TotalExpenseIncomeShowingCompo
        setTotalBalance={setTotalBalance}
        setPercentage={setPercentage}
      />
      <View style={styles.content}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={colors.primary} />
          </View>
        )}
        {!loading && (
          <View style={styles.main}>
            <ButtonComponent
              title="Search"
              onPress={() => navigation.navigate(screenNames.searchScreen)}
            />
          </View>
        )}
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
    marginTop: '9%',
    marginBottom: '5%',
  },
  ic: {
    width: 30,
    height: 30,
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
  main: {
    flex: 1,
    paddingTop: '12%',
    paddingHorizontal: 30,
  },
  viewGreen: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastWeekTxtContainer: {
    flex: 1,
    borderLeftWidth: 1.4,
    borderLeftColor: colors.white,
    marginLeft: 20,
    paddingLeft: 20,
  },
  h2: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '700',
  },
  h1: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '700',
  },
  ic2: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    height: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginVertical: 12,
  },
});
