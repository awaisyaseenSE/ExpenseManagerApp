import {View, Text, ActivityIndicator, StyleSheet, Image} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import colors from '../config/colors';
import {useFocusEffect} from '@react-navigation/native';

const TotalExpenseIncomeShowingCompo = ({setPercentage}) => {
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
      setTotalIncome(totalIncomeAmount.toFixed(0));
      setTotalExpense(totalExpenseAmount.toFixed(0));

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
          <Text style={styles.h1}>${totalIncome}</Text>
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
            -${totalExpense}
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
