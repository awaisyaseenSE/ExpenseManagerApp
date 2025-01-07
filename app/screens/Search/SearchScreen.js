import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
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
import TextInputCompo from '../../components/TextInputCompo';
import DatePicker from 'react-native-date-picker';

export default function SearchScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [allData, setAllData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [date, setDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const fetchIncomeSavingsData = async () => {
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
  };

  useEffect(() => {
    if (allData.length == 0) {
      fetchIncomeSavingsData();
    }
  }, []);

  //   console.log('all data: ', allData);

  const handleSearch = query => {
    setSearchQuery(query);
    if (query) {
      const filtered = allData.filter(
        item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(allData);
    }
  };

  useEffect(() => {
    if (searchQuery !== '') {
      handleSearch(searchQuery);
    }
  }, [searchQuery]);

  const onDateSelect = selectedDate => {
    const mydate = new Date(selectedDate);
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    const formattedDate = mydate.toLocaleDateString('en-US', options);
    setDate(formattedDate);
    setDateError('');
  };

  const handleFilterSearch = () => {
    if (date) {
      console.log(date);
    }
  };

  return (
    <TouchableWithoutFeedback
      style={{flex: 1}}
      onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <BackCompo title="Search" />
        <View style={{paddingHorizontal: 20, marginBottom: 24}}>
          <TextInputCompo
            placeholder="Search"
            value={searchQuery}
            onChangeText={text => {
              if (text.trim().length) {
                let finalTxt = text.replace(/\s\s+/g, ' ');
                setSearchQuery(finalTxt);
              } else {
                setSearchQuery('');
              }
            }}
          />
        </View>
        <View style={styles.content}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size={'large'} color={colors.primary} />
            </View>
          )}
          {!loading && (
            <View style={styles.main}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setOpenDatePicker(true)}>
                <TextInputCompo
                  placeholder="date"
                  value={date}
                  editable={false}
                  rightIcon={require('../../assets/date-select.png')}
                  rightIconOnPress={() => setOpenDatePicker(true)}
                  onPressIn={() => setOpenDatePicker(true)}
                />
              </TouchableOpacity>
              <DatePicker
                modal
                mode="date"
                open={openDatePicker}
                date={new Date()}
                minimumDate={new Date('1920-12-10')}
                onConfirm={date => {
                  setOpenDatePicker(false);
                  onDateSelect(date);
                }}
                onCancel={() => {
                  setOpenDatePicker(false);
                }}
              />
              {dateError && <Text style={styles.errorTxt}>{dateError}</Text>}
              <View style={{marginVertical: 10}} />
              <ButtonComponent
                title="search"
                style={styles.btn}
                onPress={handleFilterSearch}
              />

              <FlatList
                data={filteredData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <HomeListCompo data={item} index={index} />
                )}
              />
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
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
  label: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '400',
    paddingHorizontal: 10,
    marginBottom: 4,
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
    alignSelf: 'center',
    marginBottom: '5%',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    paddingTop: '6%',
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
  itemContainer: {
    padding: 16,
    borderBottomColor: colors.grey,
    borderBottomWidth: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemCategory: {
    fontSize: 14,
    color: colors.gray,
  },
});
