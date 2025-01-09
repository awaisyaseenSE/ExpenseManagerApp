import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../config/colors';
import auth from '@react-native-firebase/auth';
import BackCompo from '../../components/BackCompo';
import firestore from '@react-native-firebase/firestore';
import ListCompo from '../../components/Profile/ListCompo';
import useAuth from '../../auth/useAuth';
import {StackActions, useNavigation} from '@react-navigation/native';
import {screenNames} from '../../navigation/ScreenNames';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const {logout} = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userDoc = await firestore()
            .collection('users')
            .doc(user.uid)
            .get();
          if (userDoc.exists) {
            setUserData(userDoc.data());
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    try {
      Alert.alert('Logout', 'Are you sure to Logout!', [
        {
          text: 'Yes',
          onPress: logout,
        },
        {
          text: 'No',
        },
      ]);
    } catch (error) {
      console.log('ERROR WHILE LOG OUT: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <BackCompo title="Profile" showBack={false} />
      <View style={{marginVertical: 8}} />
      <View style={styles.content}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={colors.primary} />
          </View>
        )}
        {!loading && (
          <View style={styles.main}>
            <Image
              source={require('../../assets/man.png')}
              style={styles.img}
            />
            <Text style={styles.heading}>{userData?.fullName}</Text>
            <Text style={styles.email}>{userData?.email}</Text>
            <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
              <View style={styles.listView}>
                <ListCompo
                  title="Edit Profile"
                  image={require('../../assets/profile.png')}
                  onPress={() =>
                    // navigation.navigate(screenNames.editProfileScreen)
                    navigation.dispatch(
                      StackActions.replace(screenNames.editProfileScreen),
                    )
                  }
                />
                <ListCompo
                  title="Security"
                  image={require('../../assets/security.png')}
                />
                <ListCompo
                  title="Setting"
                  image={require('../../assets/setting.png')}
                />
                <ListCompo
                  title="Help"
                  image={require('../../assets/help.png')}
                />
                <ListCompo
                  title="Logout"
                  image={require('../../assets/logout.png')}
                  onPress={handleLogout}
                />
              </View>
            </ScrollView>
          </View>
        )}
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
  },
  heading: {
    fontSize: 16,
    color: colors.black,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,

    paddingHorizontal: 30,
  },
  img: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.grey,
    alignSelf: 'center',
    marginTop: -34,
  },
  email: {
    fontSize: 12,
    color: colors.grey,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
  },
  listView: {
    marginTop: '10%',
  },
});
