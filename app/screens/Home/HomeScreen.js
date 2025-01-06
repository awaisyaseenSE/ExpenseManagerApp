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

export default function HomeScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [lastWeekIncome, setLastWeekIncome] = useState(null);
  const [lastWeekExpense, setLastWeekExpense] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [allData, setAllData] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  const parseDateString = dateString => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const [monthName, day, year] = dateString.replace(',', '').split(' ');

    const monthIndex = months.indexOf(monthName);

    if (monthIndex === -1) {
      console.error('Invalid month name:', monthName);
      return null;
    }

    const date = new Date(year, monthIndex, parseInt(day, 10));
    return date;
  };

  // Helper function to get the date range for the last week
  const getLastWeekDateRange = () => {
    const now = new Date();
    const lastWeekEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const lastWeekStart = new Date(lastWeekEnd);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    return {lastWeekStart, lastWeekEnd};
  };

  const fetchLastWeekData = useCallback(async () => {
    setLoading(true);
    try {
      const userId = auth()?.currentUser?.uid;
      const {lastWeekStart, lastWeekEnd} = getLastWeekDateRange();

      // Fetch last week's income
      const incomesSnapshot = await firestore()
        .collection('incomes')
        .where('userId', '==', userId)
        .get();
      let totalIncomeAmount = 0;
      incomesSnapshot.forEach(doc => {
        const incomeDate = parseDateString(doc.data().date);

        if (incomeDate >= lastWeekStart && incomeDate < lastWeekEnd) {
          totalIncomeAmount += parseFloat(doc.data().amount);
        }
      });

      // Fetch last week's expenses
      const savingsSnapshot = await firestore()
        .collection('savings')
        .where('userId', '==', userId)
        .get();
      let totalExpenseAmount = 0;
      savingsSnapshot.forEach(doc => {
        const expenseDate = parseDateString(doc.data().date);
        if (expenseDate >= lastWeekStart && expenseDate < lastWeekEnd) {
          totalExpenseAmount += parseFloat(doc.data().amount);
        }
      });
      let fullData = [];

      let incomeData = incomesSnapshot.docs;

      setLastWeekIncome(totalIncomeAmount.toFixed(0));
      setLastWeekExpense(totalExpenseAmount.toFixed(0));
    } catch (error) {
      console.log('Error fetching data:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

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

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        await fetchLastWeekData();
        await fetchIncomeSavingsData();
      };

      fetchData();

      // Optionally add cleanup if needed
      return () => {
        // Cleanup tasks if necessary, e.g., cancelling subscriptions
      };
    }, []),
  );

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
            <View style={styles.viewGreen}>
              <View>
                <Text style={styles.heading}>Remaning{'\n'}Income</Text>
                <Text style={styles.h2}>{percentage}%</Text>
              </View>
              <View style={styles.lastWeekTxtContainer}>
                <View style={styles.row1}>
                  <Image
                    source={require('../../assets/Income.png')}
                    style={styles.ic2}
                  />
                  <View>
                    <Text style={styles.h2}>Last week Income</Text>
                    <Text style={styles.h2}>${lastWeekIncome || 0}</Text>
                  </View>
                </View>
                <View style={styles.line} />
                <View style={styles.row1}>
                  <Image
                    source={require('../../assets/Expense.png')}
                    style={styles.ic2}
                  />
                  <View>
                    <Text style={styles.h2}>Last week Expenses</Text>
                    <Text style={styles.h2}>${lastWeekExpense || 0}</Text>
                  </View>
                </View>
              </View>
            </View>
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
      <View style={styles.footer}>
        <ButtonComponent
          style={styles.btn}
          onPress={() => navigation.navigate(screenNames.addIncomeScreen)}
          title="Add Income"
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
