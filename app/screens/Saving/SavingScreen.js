import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import BackCompo from '../../components/BackCompo';
import colors from '../../config/colors';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ButtonComponent from '../../components/ButtonComponent';
import ShowCategoryCompo from '../../components/ShowCategoryCompo';
import {addCategory} from '../../query/addCategory ';

export default function SavingScreen() {
  const predefinedCategories = ['Travel', 'New House', 'Car', 'Wedding'];

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async () => {
    await addCategory('Savings');
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
          setLoading(false);
        },
        error => {
          console.log('Error listening to user categories:', error);
          setLoading(false);
        },
      );
    return () => unsubscribe();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <BackCompo title="Savings" showBack={false} />
        <View style={styles.content}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size={'large'} color={colors.primary} />
            </View>
          )}
          {categories.length > 0 && (
            <FlatList
              data={categories}
              renderItem={({item}) => <ShowCategoryCompo data={item} />}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              columnWrapperStyle={{gap: 20}}
              ItemSeparatorComponent={<View style={{marginVertical: 16}} />}
            />
          )}
        </View>
        <View style={styles.footer}>
          <ButtonComponent
            title="Add category"
            style={styles.btn}
            onPress={handleAddCategory}
          />
        </View>
      </View>
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
});
