import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../config/colors';
import BackCompo from '../../components/BackCompo';
import ButtonComponent from '../../components/ButtonComponent';
import {StackActions, useNavigation} from '@react-navigation/native';
import TextInputCompo from '../../components/TextInputCompo';
import DatePicker from 'react-native-date-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function AddSavingScreen({route}) {
  const navigation = useNavigation();
  const categoryName = route?.params?.data;
  const [date, setDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseTitleError, setExpenseTitleError] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const currency = 'usd';
  const predefinedCategories = ['Travel', 'New House', 'Car', 'Wedding'];
  const [categories, setCategories] = useState([]);
  const [categoryNameError, setCategoryNameError] = useState('');
  const [showCategory, setShowCategory] = useState(false);
  const [selectCategory, setSelectCategory] = useState('');

  const onDateSelect = selectedDate => {
    const mydate = new Date(selectedDate);
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    const formattedDate = mydate.toLocaleDateString('en-US', options);
    setDate(formattedDate);
    setDateError('');
  };

  const handleAddSavings = async () => {
    if (date == '') {
      setDateError('Date is required!');
    } else {
      setDateError('');
    }

    if (amount == '') {
      setAmountError('Amount is required!');
    } else {
      if (amount < 1) {
        setAmountError('Amount must be greater then 1');
      } else {
        setAmountError('');
      }
    }

    if (selectCategory == '') {
      setCategoryNameError('Income Category is required!');
    } else {
      setCategoryNameError('');
    }

    if (expenseTitle == '') {
      setExpenseTitleError('Title is required!');
    } else {
      if (expenseTitle.length < 4) {
        setExpenseTitleError('Enter atleast 4 characters!');
      } else {
        setExpenseTitleError('');
      }
    }

    if (date !== '' && amount > 0 && expenseTitle.length > 3) {
      setLoading(true);
      try {
        const savingsRef = firestore().collection('savings').doc();
        const savingsId = savingsRef.id;
        await savingsRef.set({
          title: expenseTitle,
          date: date,
          amount: amount,
          desc: expenseDesc,
          savingsId: savingsId,
          category: categoryName,
          currency,
          userId: auth()?.currentUser?.uid,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
        setLoading(false);
        Alert.alert('Savings added!');
        // navigation.goBack();
        navigation.dispatch(StackActions.replace('BottomTabNavigator'));
      } catch (error) {
        setLoading(false);
        console.log('error while adding booking: ', error);
      }
    }
  };

  useEffect(() => {
    const user = auth().currentUser;

    if (!user) {
      console.log('No user is logged in.');
      return;
    }

    setLoading(true);

    const unsubscribe = firestore()
      .collection('categories')
      .doc(user.uid)
      .collection('userCategories')
      .onSnapshot(
        snapshot => {
          const userCategories = [];
          snapshot.forEach(doc => {
            userCategories.push(doc.data().name);
          });

          const combinedCategories = [
            ...new Set([...predefinedCategories, ...userCategories]),
          ];
          setCategories(combinedCategories);
          console.log(combinedCategories);
          setLoading(false);
        },
        error => {
          console.log('Error listening to user categories:', error);
          setLoading(false);
        },
      );
    return () => unsubscribe();
  }, []);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.cc}
        activeOpacity={0.8}
        onPress={() => {
          setSelectCategory(item);
          setShowCategory(false);
          setCategoryNameError('');
        }}>
        <Text
          style={{
            fontSize: 14,
            color: colors.black,
            fontWeight: '600',
          }}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, width: '100%'}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      enabled
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 14}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <BackCompo title="Add Savings" />
          <View style={styles.content}>
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
            <Text style={styles.label}>Category</Text>

            {/* <TextInputCompo
              placeholder={categoryName}
              value={categoryName}
              editable={false}
            /> */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setShowCategory(true)}>
              <TextInputCompo
                placeholder="Select the category"
                value={selectCategory}
                editable={false}
                rightIcon={require('../../assets/down.png')}
                rightIconStyle={{
                  width: 14,
                  height: 14,
                }}
                rightIconOnPress={() => setShowCategory(true)}
                onPressIn={() => setShowCategory(true)}
              />
            </TouchableOpacity>
            {categories.length > 0 && showCategory && (
              <FlatList
                data={categories}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
              />
            )}
            {categoryNameError && (
              <Text style={styles.errorTxt}>{categoryNameError}</Text>
            )}
            <View style={{marginVertical: 10}} />
            <Text style={styles.label}>Amount</Text>
            <TextInputCompo
              placeholder="Enter amount in dollar"
              value={amount ? `$${amount}` : amount}
              onChangeText={text => {
                // Remove non-numeric characters and trim spaces
                const formattedText = text.replace(/[^0-9]/g, '').trim();
                setAmount(formattedText);
                setAmountError(
                  formattedText > 0 ? '' : 'Amount must be greater then 1',
                );
              }}
              keyboardType="number-pad"
            />
            {amountError && <Text style={styles.errorTxt}>{amountError}</Text>}
            <View style={{marginVertical: 10}} />
            <Text style={styles.label}>Expense Title</Text>
            <TextInputCompo
              placeholder="Enter expense title"
              value={expenseTitle}
              onChangeText={text => {
                if (text.trim().length) {
                  let finalTxt = text.replace(/\s\s+/g, ' ');
                  setExpenseTitle(finalTxt);
                  if (text.length > 0) {
                    setExpenseTitleError('');
                  }
                } else {
                  setExpenseTitle('');
                }
              }}
            />
            {expenseTitleError && (
              <Text style={styles.errorTxt}>{expenseTitleError}</Text>
            )}
            <View style={{marginVertical: 10}} />

            <TextInputCompo
              placeholder="Enter Message"
              placeholderTextColor={colors.primary}
              value={expenseDesc}
              onChangeText={text => {
                if (text.trim().length) {
                  let finalTxt = text.replace(/\s\s+/g, ' ');
                  setExpenseDesc(finalTxt);
                } else {
                  setExpenseDesc('');
                }
              }}
              inputStyle={styles.largetText}
              multiline={true}
              textAlignVertical={'top'}
            />
            <ButtonComponent
              title="Save"
              loading={loading}
              onPress={handleAddSavings}
              style={styles.btn}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  label: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '400',
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  largetText: {
    height: 100,
  },
  errorTxt: {
    fontSize: 12,
    color: 'red',
    fontWeight: '400',
  },
  btn: {
    marginTop: '10%',
    marginBottom: 20,
  },
  cc: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
});
