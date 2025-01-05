import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../../config/colors';
import BackCompo from '../../components/BackCompo';
import ButtonComponent from '../../components/ButtonComponent';
import {useNavigation} from '@react-navigation/native';
import TextInputCompo from '../../components/TextInputCompo';
import DatePicker from 'react-native-date-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function AddIncomeScreen() {
  const navigation = useNavigation();
  const [categoryName, setCategoryName] = useState('');
  const [categoryNameError, setCategoryNameError] = useState('');
  const [date, setDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [incomeTitle, setIncomeTitle] = useState('');
  const [incomeTitleError, setIncomeTitleError] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const currency = 'usd';

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
      setAmountError('');
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

    if (categoryName == '') {
      setCategoryNameError('Income Category is required!');
    } else {
      setCategoryNameError('');
    }

    if (
      date !== '' &&
      amount !== '' &&
      incomeTitle.length > 3 &&
      categoryName !== ''
    ) {
      setLoading(true);
      try {
        const incomeRef = firestore().collection('incomes').doc();
        const incomeId = incomeRef.id;
        await incomeRef.set({
          title: incomeTitle,
          date: date,
          amount: amount,
          desc: expenseDesc,
          incomeId: incomeId,
          category: categoryName,
          userId: auth()?.currentUser?.uid,
          currency,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
        setLoading(false);
        Alert.alert('Income added!');
        navigation.goBack();
      } catch (error) {
        setLoading(false);
        console.log('error while adding booking: ', error);
      }
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
          <BackCompo title="Add Income" />
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

            <TextInputCompo
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
            />
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
                setAmountError('');
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
  },
});
