import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import colors from '../../config/colors';
import BackCompo from '../../components/BackCompo';
import ButtonComponent from '../../components/ButtonComponent';
import {screenNames} from '../../navigation/ScreenNames';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ShowSavingCompo from '../../components/savings/ShowSavingCompo';

export default function SavingDetailScreen({route}) {
  const navigation = useNavigation();
  const routeData = route?.params?.data;
  const [loading, setLoading] = useState(false);
  const [allSavings, setAllSavings] = useState([]);
  const userUid = auth()?.currentUser?.uid;

  useEffect(() => {
    if (!routeData) return;
    setLoading(true);
    const unsubscribe = firestore()
      .collection('savings')
      .where('category', '==', routeData)
      .where('userId', '==', userUid)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snap => {
          const data = snap.docs.map(doc => ({
            ...doc.data(),
          }));
          console.log(data.length);
          setAllSavings(data);
          setLoading(false);
        },
        error => {
          console.error('Error fetching savings: ', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <BackCompo title={routeData} />
      <View style={styles.content}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={colors.primary} />
          </View>
        )}
        {allSavings.length > 0 && (
          <FlatList
            data={allSavings}
            renderItem={({item, index}) => (
              <ShowSavingCompo data={item} index={index} />
            )}
            // renderItem={({item, index}) => (
            //   <Text style={{color: 'red'}}>{item?.date}</Text>
            // )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <View style={styles.footer}>
        <ButtonComponent
          title="Add savings"
          onPress={() =>
            navigation.navigate(screenNames.addSavingScreen, {
              data: routeData,
            })
          }
          style={styles.btn}
        />
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
    paddingHorizontal: 30,
    paddingTop: 40,
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
