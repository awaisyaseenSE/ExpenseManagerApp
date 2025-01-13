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
import MyIndicator from '../../components/MyIndicator';
import HelpCompo from '../../components/HelpCompo';
import ShowFaqCompo from '../../components/ShowFaqCompo';

export default function FaqScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [faqs, setFAQs] = useState([]);
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const faqSnapshot = await firestore().collection('faqs').get();
      if (!faqSnapshot.empty) {
        const faqList = faqSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFAQs(faqList);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('Error fetching FAQs: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <BackCompo title="Help & FAQS" />
        <View style={{marginVertical: 8}} />
        <View style={styles.content}>
          <Text style={styles.heading}>How can we help you?</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.btn1,
                {
                  backgroundColor:
                    selectedIndex === 0 ? colors.primary : '#DFF7E2',
                },
              ]}
              onPress={() => setSelectedIndex(0)}>
              <Text style={styles.label}>FAQ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btn1,
                {
                  backgroundColor:
                    selectedIndex === 1 ? colors.primary : '#DFF7E2',
                },
              ]}
              onPress={() => setSelectedIndex(1)}>
              <Text style={styles.label}>Contact Us</Text>
            </TouchableOpacity>
          </View>
          {selectedIndex === 0 ? (
            <View style={styles.flexView}>
              <FlatList
                data={faqs}
                keyExtractor={item => item.id}
                renderItem={({item}) => <ShowFaqCompo data={item} />}
                ListEmptyComponent={() => {
                  if (!loading && faqs.length < 1) {
                    <Text style={styles.textEmpty}>No FAQs available.</Text>;
                  }
                }}
                showsVerticalScrollIndicator={false}
              />
            </View>
          ) : (
            <View style={styles.flexView}>
              <HelpCompo
                title="Customer Service"
                image={require('../../assets/support.png')}
              />
              <HelpCompo
                title="Website"
                image={require('../../assets/website.png')}
              />
              <HelpCompo
                title="Facebook"
                image={require('../../assets/facebook.png')}
              />
              <HelpCompo
                title="Whatsapp"
                image={require('../../assets/whatsapp.png')}
              />
              <HelpCompo
                title="Instagram"
                image={require('../../assets/insta.png')}
              />
            </View>
          )}
        </View>
      </View>
      <MyIndicator visible={loading} isLoaderShow={true} />
    </>
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
    paddingTop: '6%',
    paddingHorizontal: 30,
  },
  btn1: {
    backgroundColor: colors.primary,
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  heading: {
    fontSize: 18,
    color: colors.black,
    fontWeight: '600',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DFF7E2',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: '4%',
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
  flexView: {
    flex: 1,
    marginTop: 14,
    marginBottom: 6,
  },
});
