import {View, Text, ActivityIndicator, StyleSheet, Image} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import colors from '../config/colors';
import {useFocusEffect} from '@react-navigation/native';
import constansts from '../constants/constansts';

const TotalExpenseIncomeShowingCompo = ({setPercentage, setTotalBalance}) => {
  const [totalExpense, setTotalExpense] = useState('');
  const [totalIncome, setTotalIncome] = useState('');
  const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     const fetchTotals = async () => {
  //       try {
  //         const userId = auth()?.currentUser?.uid;

  //         // Fetch total income
  //         const incomesSnapshot = await firestore()
  //           .collection('incomes')
  //           .where('userId', '==', userId)
  //           .get();
  //         let totalIncomeAmount = 0;
  //         incomesSnapshot.forEach(doc => {
  //           totalIncomeAmount += parseFloat(doc.data().amount);
  //         });

  //         // Fetch total expenses
  //         const savingsSnapshot = await firestore()
  //           .collection('savings')
  //           .where('userId', '==', userId)
  //           .get();
  //         let totalExpenseAmount = 0;
  //         savingsSnapshot.forEach(doc => {
  //           totalExpenseAmount += parseFloat(doc.data().amount);
  //         });

  //         // Update state with the calculated totals
  //         setTotalIncome(totalIncomeAmount.toFixed(0));
  //         setTotalExpense(totalExpenseAmount.toFixed(0));
  //       } catch (error) {
  //         console.log('Error fetching data:', error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchTotals();
  //   }, []);

  const fetchTotals = useCallback(async () => {
    setLoading(true);
    try {
      const userId = auth()?.currentUser?.uid;

      // Fetch total income
      const incomesSnapshot = await firestore()
        .collection('incomes')
        .where('userId', '==', userId)
        .get();
      let totalIncomeAmount = 0;
      incomesSnapshot.forEach(doc => {
        totalIncomeAmount += parseFloat(doc.data().amount);
      });

      // Fetch total expenses
      const savingsSnapshot = await firestore()
        .collection('savings')
        .where('userId', '==', userId)
        .get();
      let totalExpenseAmount = 0;
      savingsSnapshot.forEach(doc => {
        totalExpenseAmount += parseFloat(doc.data().amount);
      });

      // Update state with the calculated totals
      setTotalBalance(totalIncomeAmount);
      setTotalIncome(totalIncomeAmount);
      setTotalExpense(totalExpenseAmount);

      const remainingAmount = totalIncomeAmount - totalExpenseAmount;
      const progress =
        totalIncomeAmount > 0 ? remainingAmount / totalIncomeAmount : 0;

      // Log for debugging
      const p = (progress * 100).toFixed(0);
      const fp = parseInt(p);
      // console.log('type of p is: ', typeof fp);
      setPercentage(fp);
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTotals();
    }, [fetchTotals]),
  );

  const selectedCurrency = constansts.currencyCode;

  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (selectedCurrency.code !== 'USD') {
        try {
          const response = await fetch(
            'https://api.exchangerate-api.com/v4/latest/USD',
          );
          const rates = await response.json();
          const rate = rates.rates[selectedCurrency] || 1;
          setExchangeRate(rate);
          console.log('rate: ', rate);
        } catch (error) {
          console.error('Error fetching exchange rate:', error);
        }
      }
    };

    fetchExchangeRate();
  }, [selectedCurrency, totalIncome, totalExpense]);

  const convertAmount = amount => {
    if (!amount) {
      return 0;
    }
    if (selectedCurrency === 'USD') {
      return amount;
    }
    let converted = amount * exchangeRate;
    if (converted % 1 === 0) {
      return converted; // Return as a whole number
    } else {
      return Number(converted.toFixed(2)); // Return with 2 decimal places
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.contentView,
          {
            borderRightWidth: 1,
            borderRightColor: colors.white,
          },
        ]}>
        <View style={styles.row}>
          <Image source={require('../assets/Income.png')} style={styles.ic} />
          <Text style={styles.h2}>Total Balance</Text>
        </View>
        {loading ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <Text style={styles.h1}>
            {selectedCurrency} {convertAmount(totalIncome) || 0}
          </Text>
        )}
      </View>

      <View style={styles.contentView}>
        <View style={styles.row}>
          <Image source={require('../assets/Expense.png')} style={styles.ic} />
          <Text style={styles.h2}>Total Expense</Text>
        </View>
        {loading ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <Text
            style={[
              styles.h1,
              {
                color: colors.blue,
              },
            ]}>
            - {selectedCurrency} {convertAmount(totalExpense) || 0}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: '6%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  contentView: {
    flex: 1,
    alignItems: 'center',
  },
  h2: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '700',
  },
  ic: {
    width: 13,
    height: 13,
    marginRight: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  h1: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '700',
  },
});

export default TotalExpenseIncomeShowingCompo;
