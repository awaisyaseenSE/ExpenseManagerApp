import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import colors from '../../config/colors';
import TotalExpenseIncomeShowingCompo from '../../components/TotalExpenseIncomeShowingCompo';
import auth from '@react-native-firebase/auth';
import BackCompo from '../../components/BackCompo';
import firestore from '@react-native-firebase/firestore';
import HomeListCompo from '../../components/Home/HomeListCompo';

export default function TransactionScreen() {
  const [percentage, setPercentage] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchIncomeSavingsData = useCallback(async () => {
    setLoading(true);
    try {
      const userId = auth()?.currentUser?.uid;
      let data = [];

      // Fetch all incomes
      const incomesSnapshot = await firestore()
        .collection('incomes')
        .where('userId', '==', userId)
        .get();
      incomesSnapshot.forEach(doc => {
        const incomeData = doc.data();
        data.push({
          ...incomeData,
          isIncome: true,
          isSaving: false,
        });
      });

      // Fetch all savings
      const savingsSnapshot = await firestore()
        .collection('savings')
        .where('userId', '==', userId)
        .get();
      savingsSnapshot.forEach(doc => {
        const savingData = doc.data();
        data.push({
          ...savingData,
          isIncome: false,
          isSaving: true,
        });
      });
      setAllData(data);
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncomeSavingsData();
  }, []);

  return (
    <View style={styles.container}>
      <BackCompo title="Transaction" showBack={false} />
      <View style={styles.row}>
        <Text style={styles.h3}>Total Balance</Text>
        <Text style={styles.heading}>${totalBalance}</Text>
      </View>
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
            <FlatList
              style={{marginTop: 14}}
              data={allData}
              renderItem={({item, index}) => (
                <HomeListCompo data={item} index={index} />
              )}
              showsVerticalScrollIndicator={false}
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
  h3: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '700',
  },
  row: {
    marginHorizontal: 20,
    backgroundColor: colors.white,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 14,
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

  h2: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '700',
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    paddingTop: '12%',
    paddingHorizontal: 30,
  },
});
