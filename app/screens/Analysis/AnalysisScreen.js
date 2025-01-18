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

  const chartData = {
    labels: ['Income', 'Expense'], // Labels for the bars
    datasets: [
      {
        data: [
          // Sum of all income amounts
          allData
            .filter(item => item.isIncome)
            .reduce(
              (total, current) => total + parseFloat(current.amount || 0),
              0,
            ),

          // Sum of all savings amounts
          allData
            .filter(item => item.isSaving)
            .reduce(
              (total, current) => total + parseFloat(current.amount || 0),
              0,
            ),
        ],
      },
    ],
  };

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
            <BarChart
              data={chartData}
              width={screenWidth - 60} // Adjust width to fit your layout
              height={220}
              yAxisLabel="$"
              chartConfig={{
                backgroundColor: colors.primary,
                backgroundGradientFrom: colors.primary,
                backgroundGradientTo: '#ffa726',
                decimalPlaces: 2, // optional, defaults to 2 decimal places
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
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
