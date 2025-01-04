import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../../config/colors';
import BackCompo from '../../components/BackCompo';
import {useNavigation} from '@react-navigation/native';
import TextInputCompo from '../../components/TextInputCompo';

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
            <TextInputCompo
              placeholder="date"
              value={date}
              onChangeText={text => setDate(text)}
            />
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
              onChangeText={text => setAmount(text)}
            />
            <View style={{marginVertical: 10}} />
            <Text style={styles.label}>Expense Title</Text>
            <TextInputCompo
              placeholder="Enter expense title"
              value={expenseTitle}
              onChangeText={text => setExpenseTitle(text)}
            />
            <View style={{marginVertical: 10}} />

            <TextInputCompo
              placeholder="Enter Message"
              placeholderTextColor={colors.primary}
              value={expenseTitle}
              onChangeText={text => setExpenseTitle(text)}
              inputStyle={styles.largetText}
              multiline={true}
              textAlignVertical={'top'}
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
});
