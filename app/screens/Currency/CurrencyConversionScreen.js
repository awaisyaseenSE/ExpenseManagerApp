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
  ScrollView,
  Alert,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import constansts from '../../constants/constansts';

const currencyData = [
  {code: 'USD', name: 'Dollar'},
  {code: 'EUR', name: 'Euro'},
  {code: 'JPY', name: 'Yen'},
  {code: 'GBP', name: 'Pound Sterling'},
  {code: 'AUD', name: 'Australian Dollar'},
  {code: 'CAD', name: 'Canadian Dollar'},
  {code: 'CHF', name: 'Swiss Franc'},
  {code: 'CNY', name: 'Yuan'},
  {code: 'SEK', name: 'Swedish Krona'},
  {code: 'NZD', name: 'New Zealand Dollar'},
  {code: 'MXN', name: 'Mexican Peso'},
  {code: 'SGD', name: 'Singapore Dollar'},
  {code: 'HKD', name: 'Hong Kong Dollar'},
  {code: 'NOK', name: 'Norwegian Krone'},
  {code: 'KRW', name: 'South Korean Won'},
  {code: 'TRY', name: 'Turkish Lira'},
  {code: 'INR', name: 'Indian Rupee'},
  {code: 'RUB', name: 'Russian Ruble'},
  {code: 'BRL', name: 'Brazilian Real'},
  {code: 'ZAR', name: 'South African Rand'},
  {code: 'AED', name: 'Emirati Dirham'},
  {code: 'AFN', name: 'Afghan Afghani'},
  {code: 'ALL', name: 'Albanian Lek'},
  {code: 'AMD', name: 'Armenian Dram'},
  {code: 'ANG', name: 'Netherlands Antillean Guilder'},
  {code: 'AOA', name: 'Angolan Kwanza'},
  {code: 'ARS', name: 'Argentine Peso'},
  {code: 'AWG', name: 'Aruban Florin'},
  {code: 'AZN', name: 'Azerbaijani Manat'},
  {code: 'BAM', name: 'Bosnia-Herzegovina Convertible Mark'},
  {code: 'BBD', name: 'Barbadian Dollar'},
  {code: 'BDT', name: 'Bangladeshi Taka'},
  {code: 'BGN', name: 'Bulgarian Lev'},
  {code: 'BHD', name: 'Bahraini Dinar'},
  {code: 'BIF', name: 'Burundian Franc'},
  {code: 'BMD', name: 'Bermudian Dollar'},
  {code: 'BND', name: 'Brunei Dollar'},
  {code: 'BOB', name: 'Bolivian Boliviano'},
  {code: 'BSD', name: 'Bahamian Dollar'},
  {code: 'BTN', name: 'Bhutanese Ngultrum'},
  {code: 'BWP', name: 'Botswana Pula'},
  {code: 'BYN', name: 'Belarusian Ruble'},
  {code: 'BZD', name: 'Belize Dollar'},
  {code: 'CDF', name: 'Congolese Franc'},
  {code: 'CLP', name: 'Chilean Peso'},
  {code: 'COP', name: 'Colombian Peso'},
  {code: 'CRC', name: 'Costa Rican Colón'},
  {code: 'CUP', name: 'Cuban Peso'},
  {code: 'CVE', name: 'Cape Verdean Escudo'},
  {code: 'CZK', name: 'Czech Koruna'},
  {code: 'DJF', name: 'Djiboutian Franc'},
  {code: 'DKK', name: 'Danish Krone'},
  {code: 'DOP', name: 'Dominican Peso'},
  {code: 'DZD', name: 'Algerian Dinar'},
  {code: 'EGP', name: 'Egyptian Pound'},
  {code: 'ERN', name: 'Eritrean Nakfa'},
  {code: 'ETB', name: 'Ethiopian Birr'},
  {code: 'FJD', name: 'Fijian Dollar'},
  {code: 'FKP', name: 'Falkland Islands Pound'},
  {code: 'FOK', name: 'Faroese Króna'},
  {code: 'GEL', name: 'Georgian Lari'},
  {code: 'GGP', name: 'Guernsey Pound'},
  {code: 'GHS', name: 'Ghanaian Cedi'},
  {code: 'GIP', name: 'Gibraltar Pound'},
  {code: 'GMD', name: 'Gambian Dalasi'},
  {code: 'GNF', name: 'Guinean Franc'},
  {code: 'GTQ', name: 'Guatemalan Quetzal'},
  {code: 'GYD', name: 'Guyanese Dollar'},
  {code: 'HNL', name: 'Honduran Lempira'},
  {code: 'HRK', name: 'Croatian Kuna'},
  {code: 'HTG', name: 'Haitian Gourde'},
  {code: 'HUF', name: 'Hungarian Forint'},
  {code: 'IDR', name: 'Indonesian Rupiah'},
  {code: 'ILS', name: 'Israeli New Shekel'},
  {code: 'IMP', name: 'Isle of Man Pound'},
  {code: 'IQD', name: 'Iraqi Dinar'},
  {code: 'IRR', name: 'Iranian Rial'},
  {code: 'ISK', name: 'Icelandic Króna'},
  {code: 'JEP', name: 'Jersey Pound'},
  {code: 'JMD', name: 'Jamaican Dollar'},
  {code: 'JOD', name: 'Jordanian Dinar'},
  {code: 'KES', name: 'Kenyan Shilling'},
  {code: 'KGS', name: 'Kyrgyzstani Som'},
  {code: 'KHR', name: 'Cambodian Riel'},
  {code: 'KID', name: 'Kiribati Dollar'},
  {code: 'KMF', name: 'Comorian Franc'},
  {code: 'KWD', name: 'Kuwaiti Dinar'},
  {code: 'KYD', name: 'Cayman Islands Dollar'},
  {code: 'KZT', name: 'Kazakhstani Tenge'},
  {code: 'LAK', name: 'Lao Kip'},
  {code: 'LBP', name: 'Lebanese Pound'},
  {code: 'LKR', name: 'Sri Lankan Rupee'},
  {code: 'LRD', name: 'Liberian Dollar'},
  {code: 'LSL', name: 'Lesotho Loti'},
  {code: 'LYD', name: 'Libyan Dinar'},
  {code: 'MAD', name: 'Moroccan Dirham'},
  {code: 'MDL', name: 'Moldovan Leu'},
  {code: 'MGA', name: 'Malagasy Ariary'},
  {code: 'MKD', name: 'Macedonian Denar'},
  {code: 'MMK', name: 'Myanmar Kyat'},
  {code: 'MNT', name: 'Mongolian Tögrög'},
  {code: 'MOP', name: 'Macanese Pataca'},
  {code: 'MRU', name: 'Mauritanian Ouguiya'},
  {code: 'MUR', name: 'Mauritian Rupee'},
  {code: 'MVR', name: 'Maldivian Rufiyaa'},
  {code: 'MWK', name: 'Malawian Kwacha'},
  {code: 'MXN', name: 'Mexican Peso'},
  {code: 'MYR', name: 'Malaysian Ringgit'},
  {code: 'MZN', name: 'Mozambican Metical'},
  {code: 'NAD', name: 'Namibian Dollar'},
  {code: 'NGN', name: 'Nigerian Naira'},
  {code: 'NIO', name: 'Nicaraguan Córdoba'},
  {code: 'NOK', name: 'Norwegian Krone'},
  {code: 'NPR', name: 'Nepalese Rupee'},
  {code: 'OMR', name: 'Omani Rial'},
  {code: 'PAB', name: 'Panamanian Balboa'},
  {code: 'PEN', name: 'Peruvian Sol'},
  {code: 'PGK', name: 'Papua New Guinean Kina'},
  {code: 'PHP', name: 'Philippine Peso'},
  {code: 'PKR', name: 'Pakistani Rupee'},
  {code: 'PLN', name: 'Polish Złoty'},
  {code: 'PYG', name: 'Paraguayan Guaraní'},
  {code: 'QAR', name: 'Qatari Riyal'},
  {code: 'RON', name: 'Romanian Leu'},
  {code: 'RSD', name: 'Serbian Dinar'},
  {code: 'RUB', name: 'Russian Ruble'},
  {code: 'RWF', name: 'Rwandan Franc'},
  {code: 'SAR', name: 'Saudi Riyal'},
  {code: 'SBD', name: 'Solomon Islands Dollar'},
  {code: 'SCR', name: 'Seychellois Rupee'},
  {code: 'SDG', name: 'Sudanese Pound'},
  {code: 'SGD', name: 'Singapore Dollar'},
  {code: 'SHP', name: 'Saint Helena Pound'},
  {code: 'SLL', name: 'Sierra Leonean Leone'},
  {code: 'SOS', name: 'Somali Shilling'},
  {code: 'SRD', name: 'Surinamese Dollar'},
  {code: 'SSP', name: 'South Sudanese Pound'},
  {code: 'STN', name: 'São Tomé and Príncipe Dobra'},
  {code: 'SYP', name: 'Syrian Pound'},
  {code: 'SZL', name: 'Eswatini Lilangeni'},
  {code: 'THB', name: 'Thai Baht'},
  {code: 'TJS', name: 'Tajikistani Somoni'},
  {code: 'TMT', name: 'Turkmenistan Manat'},
  {code: 'TND', name: 'Tunisian Dinar'},
  {code: 'TOP', name: 'Tongan Paʻanga'},
  {code: 'TRY', name: 'Turkish Lira'},
  {code: 'TTD', name: 'Trinidad and Tobago Dollar'},
  {code: 'TVD', name: 'Tuvaluan Dollar'},
  {code: 'TWD', name: 'New Taiwan Dollar'},
  {code: 'TZS', name: 'Tanzanian Shilling'},
  {code: 'UAH', name: 'Ukrainian Hryvnia'},
  {code: 'UGX', name: 'Ugandan Shilling'},
  {code: 'UYU', name: 'Uruguayan Peso'},
  {code: 'UZS', name: 'Uzbekistani Soʻm'},
  {code: 'VES', name: 'Venezuelan Bolívar'},
  {code: 'VND', name: 'Vietnamese Đồng'},
  {code: 'VUV', name: 'Vanuatu Vatu'},
  {code: 'WST', name: 'Samoan Tālā'},
  {code: 'XAF', name: 'Central African CFA Franc'},
  {code: 'XCD', name: 'East Caribbean Dollar'},
  {code: 'XDR', name: 'Special Drawing Rights'},
  {code: 'XOF', name: 'West African CFA Franc'},
  {code: 'XPF', name: 'CFP Franc'},
  {code: 'YER', name: 'Yemeni Rial'},
  {code: 'ZAR', name: 'South African Rand'},
  {code: 'ZMW', name: 'Zambian Kwacha'},
  {code: 'ZWL', name: 'Zimbabwean Dollar'},
];

export default function CurrencyConversionScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currencies, setCurrencies] = useState(currencyData);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={[
          styles.listView,
          {
            borderWidth: selectedCurrency == item ? 1 : 0,
            borderColor: colors.primary,
          },
        ]}
        activeOpacity={0.8}
        onPress={() => setSelectedCurrency(item)}>
        <Text style={styles.txt}>{item?.name}</Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (searchQuery !== '') {
      const filteredData = currencyData.filter(
        currency =>
          currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          currency.code.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setCurrencies(filteredData);
    } else {
      setCurrencies(currencyData);
    }
  }, [searchQuery]);

  const handleStore = async () => {
    try {
      if (selectedCurrency) {
        setLoading(true);
        await AsyncStorage.setItem(
          'selectedCurrency',
          JSON.stringify(selectedCurrency),
        );
        constansts.currencyCode = selectedCurrency?.code;
        setLoading(false);
        Alert.alert('Currency is saved!');
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback
      style={{flex: 1}}
      onPress={() => Keyboard.dismiss()}>
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <BackCompo title="Convert Currency" />
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
            <FlatList
              data={currencies}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <ButtonComponent
            title="Confirm"
            style={styles.btn}
            onPress={handleStore}
            loading={loading}
          />
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
    paddingTop: '8%',
    paddingHorizontal: 30,
  },
  heading: {
    fontSize: 18,
    color: colors.black,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    paddingTop: '4%',
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
  listView: {
    backgroundColor: '#DFF7E2',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  footer: {
    paddingBottom: 12,
    paddingTop: 6,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  btn: {
    width: '50%',
  },
  txt: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '500',
  },
});
