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
import {screenNames} from '../../navigation/ScreenNames';

export default function EditIncomeExpenseScreen({route}) {
  const data = route?.params?.data;
  const type = route?.params?.type;
  const navigation = useNavigation();
  const [categoryName, setCategoryName] = useState('');
  const [categoryNameError, setCategoryNameError] = useState('');
  const [date, setDate] = useState(data?.date || '');
  const [dateError, setDateError] = useState('');
  const predefinedCategories = ['Travel', 'New House', 'Car', 'Wedding'];
  const [amount, setAmount] = useState(data?.amount || '');
  const [amountError, setAmountError] = useState('');
  const [incomeTitle, setIncomeTitle] = useState(data?.title || '');
  const [incomeTitleError, setIncomeTitleError] = useState('');
  const [expenseDesc, setExpenseDesc] = useState(data?.desc || '');
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const currency = 'usd';
  const [categories, setCategories] = useState([]);
  const [showCategory, setShowCategory] = useState(false);
  const [selectCategory, setSelectCategory] = useState(data?.category || '');

  const onDateSelect = selectedDate => {
    const mydate = new Date(selectedDate);
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    const formattedDate = mydate.toLocaleDateString('en-US', options);
    setDate(formattedDate);
    setDateError('');
  };

  //   console.log(data);

  const handleAddSavings = async () => {
    if (!data?.id) {
      return null;
    }
    let collectionName = type == 'income' ? 'incomes' : 'savings';

    console.log('collection name is ', collectionName, ' and type is: ', type);
    // return;

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

    if (incomeTitle == '') {
      setIncomeTitleError('Income Title is required!');
    } else {
      if (incomeTitle.length < 4) {
        setIncomeTitleError('Enter atleast 4 characters!');
      } else {
        setIncomeTitleError('');
      }
    }

    if (selectCategory == '') {
      setCategoryNameError('Income Category is required!');
    } else {
      setCategoryNameError('');
    }

    if (
      date !== '' &&
      amount > 0 &&
      incomeTitle.length > 3 &&
      selectCategory !== ''
    ) {
      setLoading(true);
      try {
        await firestore()
          .collection(collectionName)
          .doc(data.id)
          .update({
            title: incomeTitle,
            date: date,
            amount: amount,
            desc: expenseDesc,
            category: selectCategory,
          })
          .then(() => {
            setLoading(false);
            Alert.alert('Updated', `${type} is updated successfully`);
            // navigation.goBack();
            navigation.dispatch(StackActions.replace('BottomTabNavigator'));
          })
          .catch(er => {
            setLoading(false);
            Alert.alert('Error: ', `${er}`);
          });
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
          // console.log(combinedCategories);
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

  const handleDelete = async () => {
    try {
      let collectionName = type == 'income' ? 'incomes' : 'savings';

      await firestore()
        .collection(collectionName)
        .doc(data?.id)
        .delete()
        .then(() => {
          navigation.goBack();
          Alert.alert('Deleted', `${type} is deleted successfully`);
        })
        .catch(er => {
          console.log(er);
          Alert.alert('Error:', `${er}`);
        });
    } catch (error) {
      console.log(error);
    }
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
          <BackCompo
            title={`Edit ${type}`}
            rightIcon={require('../../assets/delete.png')}
            onPressRightIcon={() => handleDelete()}
          />
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
              placeholder={'Enter category of income'}
              value={categoryName}
              onChangeText={text => {
                if (text.trim().length) {
                  let finalTxt = text.replace(/\s\s+/g, ' ');
                  setCategoryName(finalTxt);
                  if (text.length > 0) {
                    setIncomeTitleError('');
                  }
                } else {
                  setCategoryName('');
                }
              }}
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
            <Text style={styles.label}>Income Title</Text>
            <TextInputCompo
              placeholder="Enter income title"
              value={incomeTitle}
              onChangeText={text => {
                if (text.trim().length) {
                  let finalTxt = text.replace(/\s\s+/g, ' ');
                  setIncomeTitle(finalTxt);
                  if (text.length > 0) {
                    setIncomeTitleError('');
                  }
                } else {
                  setIncomeTitle('');
                }
              }}
            />
            {incomeTitleError && (
              <Text style={styles.errorTxt}>{incomeTitleError}</Text>
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
              title="Update"
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
