import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  Dimensions,
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
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import constansts from '../../constants/constansts';

const screenWidth = Dimensions.get('window').width;

export default function AnalysisScreen() {
  const navigation = useNavigation();
  const [lastWeekIncome, setLastWeekIncome] = useState(null);
  const [lastWeekExpense, setLastWeekExpense] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

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
        } catch (error) {
          console.error('Error fetching exchange rate:', error);
        }
      }
    };

    fetchExchangeRate();
  }, []);

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
      return Number(converted.toFixed(0)); // Return with 2 decimal places
    }
  };

  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchIncomeSavingsData = useCallback(async () => {
    setLoading(true);
    try {
      const userId = auth()?.currentUser?.uid;

      if (!userId) {
        console.error('Error: No userId found');
        return;
      }

      let data = [];

      // Fetch all incomes
      const incomesSnapshot = await firestore()
        .collection('incomes')
        .where('userId', '==', userId)
        .get();

      incomesSnapshot.forEach(doc => {
        const incomeData = doc.data();
        if (incomeData) {
          data.push({
            ...incomeData,
            isIncome: true,
            isSaving: false,
          });
        } else {
          console.warn(`Income document with ID ${doc.id} has no data.`);
        }
      });

      console.log('Fetched incomes:', data);

      // Fetch all savings
      const savingsSnapshot = await firestore()
        .collection('savings')
        .where('userId', '==', userId)
        .get();

      savingsSnapshot.forEach(doc => {
        const savingData = doc.data();
        if (savingData) {
          data.push({
            ...savingData,
            isIncome: false,
            isSaving: true,
          });
        } else {
          console.warn(`Saving document with ID ${doc.id} has no data.`);
        }
      });

      console.log('Fetched savings:', data);

      // Update state with combined data
      setAllData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncomeSavingsData();
  }, []);

  const [chartData, setChartData] = useState({
    labels: ['Income', 'Expense', 'Remaining'],
    datasets: [{data: [0, 0, 0]}], // Initial state
  });

  useEffect(() => {
    const totalIncome = allData
      .filter(item => item.isIncome)
      .reduce((total, current) => total + parseFloat(current.amount || 0), 0);

    const totalExpense = allData
      .filter(item => item.isSaving)
      .reduce((total, current) => total + parseFloat(current.amount || 0), 0);

    const remainingIncome = totalIncome - totalExpense;

    console.log(totalIncome, ' total income');
    console.log(totalExpense, 'total exprnse');
    console.log(remainingIncome, ' remainingIncome');

    // Update chart data
    setChartData({
      labels: ['Income', 'Expense', 'Remaining'],
      datasets: [
        {
          data: [
            convertAmount(totalIncome),
            convertAmount(totalExpense),
            convertAmount(remainingIncome),
          ],
        },
      ],
    });
  }, [allData]);

  console.log(chartData?.datasets?.data);

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
            <View
              style={{
                alignItems: 'flex-end',
                marginBottom: 14,
              }}>
              <TouchableOpacity
                hitSlop={{
                  top: 20,
                  bottom: 20,
                  right: 20,
                  left: 20,
                }}
                onPress={() => navigation.navigate(screenNames.searchScreen)}
                activeOpacity={0.8}
                style={{
                  width: 30,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.primary,
                  borderRadius: 15,
                }}>
                <Image
                  source={require('../../assets/magnifying-glass.png')}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                  tintColor={colors.white}
                />
              </TouchableOpacity>
            </View>
            {/* <BarChart
              data={chartData}
              width={screenWidth - 60} // Adjust width to fit your layout
              height={220}
              yAxisLabel="$"
              // chartConfig={{
              //   backgroundColor: colors.primary,
              //   backgroundGradientFrom: colors.primary,
              //   backgroundGradientTo: '#ffa726',
              //   decimalPlaces: 2, // optional, defaults to 2 decimal places
              //   color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              //   labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              //   style: {
              //     borderRadius: 16,
              //   },
              //   propsForDots: {
              //     r: '6',
              //     strokeWidth: '2',
              //     stroke: '#ffa726',
              //   },
              // }}
              chartConfig={{
                backgroundColor: colors.primary,
                backgroundGradientFrom: colors.primary,
                backgroundGradientTo: '#ffa726',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Blue color for bars
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                barPercentage: 0.7, // Adjust the width of the bars
                propsForBackgroundLines: {
                  strokeWidth: 1,
                  stroke: 'rgba(0, 0, 0, 0.1)', // Add grid lines for better visibility
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            /> */}
            {/* <ProgressChart
              data={chartData}
              width={screenWidth - 60}
              height={220}
              strokeWidth={16}
              radius={32}
              chartConfig={chartConfig}
              hideLegend={false}
            /> */}
            {/* <LineChart
              data={data}
              width={screenWidth - 60}
              height={220}
              chartConfig={chartConfig}
            /> */}
            <BarChart
              data={chartData}
              width={screenWidth - 50}
              height={220}
              chartConfig={{
                backgroundColor: '#f5f5f5',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                barPercentage: 0.7,
              }}
              fromZero
              showValuesOnTopOfBars
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
    paddingTop: '8%',
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
