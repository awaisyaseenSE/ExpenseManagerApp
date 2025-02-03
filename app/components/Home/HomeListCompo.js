import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../config/colors';
import constants from '../../constants/constansts';

const HomeListCompo = ({data, index}) => {
  const selectedCurrency = constants.currencyCode;

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
  }, [selectedCurrency]);

  const convertAmount = amount => {
    if (selectedCurrency === 'USD') {
      return amount;
    }
    let converted = amount * exchangeRate;
    if (converted % 1 === 0) {
      return converted; // Return as a whole number
    } else {
      return Number(converted.toFixed(2)); // Return with 2 decimal places
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.icContainer}>
        <Image
          source={
            data?.isSaving
              ? require('../../assets/Expense.png')
              : require('../../assets/Income.png')
          }
          style={styles.ic}
        />
      </View>

      <View style={{flex: 1}}>
        <Text style={styles.heading}>{data?.title}</Text>
        <Text style={styles.dateTxt}>{data?.date}</Text>
      </View>
      <Text style={styles.price}>
        {selectedCurrency} {convertAmount(data?.amount)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 14,
    color: colors.black,

    fontWeight: '700',
  },
  dateTxt: {
    fontSize: 13,
    color: colors.blue,

    fontWeight: '700',
  },
  ic: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginVertical: 20,
    tintColor: colors.white,
  },
  icContainer: {
    alignItems: 'center',
    backgroundColor: colors.blue_light,
    borderRadius: 12,
    width: 60,
    height: 60,
    justifyContent: 'center',
    marginRight: 16,
  },
  price: {
    fontSize: 13,
    color: colors.black,

    fontWeight: '700',
  },
});

export default HomeListCompo;
