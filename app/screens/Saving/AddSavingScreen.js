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

  const onDateSelect = selectedDate => {
    const mydate = new Date(selectedDate);
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    const formattedDate = mydate.toLocaleDateString('en-US', options);
    setDate(formattedDate);
    setDateError('');
  };

  const handleAddSavings = () => {
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

    if (expenseTitle == '') {
      setExpenseTitleError('Amount is required!');
    } else {
      if (expenseTitle.length < 4) {
        setExpenseTitleError('Enter atleast 4 characters!');
      } else {
        setExpenseTitleError('');
      }
    }

    if (date !== '' && amount !== '' && expenseTitle.length > 3) {
      Alert.alert('ok');
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

            <TextInputCompo
              placeholder={categoryName}
              value={categoryName}
              editable={false}
            />
            <View style={{marginVertical: 10}} />
            <Text style={styles.label}>Amount</Text>
            <TextInputCompo
              placeholder="Enter amount"
              value={amount}
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
            <ButtonComponent title="Save" onPress={handleAddSavings} />
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
});
