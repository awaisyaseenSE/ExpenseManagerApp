import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../config/colors';
import auth from '@react-native-firebase/auth';
import BackCompo from '../../components/BackCompo';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import TextInputCompo from '../../components/TextInputCompo';
import ButtonComponent from '../../components/ButtonComponent';
import {validatePhoneNumber} from '../../utils/validations';

export default function EditProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [mobile, setMobile] = useState('');
  const [mobileError, setMobileError] = useState('');

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
            let udata = userDoc.data();
            setName(udata?.fullName);
            setMobile(udata?.mobile);
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

  const handleUpdateProfile = async () => {
    try {
      if (name == '') {
        setNameError('Full name is required!');
      } else {
        if (name.length < 2) {
          setNameError('Enter atleast 2 characters!');
        } else {
          setNameError('');
        }
      }

      if (mobile == '') {
        setMobileError('Mobile number is required!');
      } else {
        if (!validatePhoneNumber(mobile)) {
          setMobileError('Mobile number is invalid!');
        } else {
          setMobileError('');
        }
      }

      if (name.length > 1 && validatePhoneNumber(mobile)) {
        setLoading(true);
        await auth().currentUser?.updateProfile({
          displayName: name,
        });
        await firestore()
          .collection('users')
          .doc(auth().currentUser.uid)
          .update({
            fullName: name,
            mobile: mobile,
          });
        Alert.alert('Profile is updated!');
        navigation.navigate('BottomTabNavigator');
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <BackCompo
        title="Edit Profile"
        onPressBack={() => navigation.navigate('BottomTabNavigator')}
      />
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
                <Text style={styles.label}>User Name</Text>
                <TextInputCompo
                  placeholder="Enter User name"
                  value={name}
                  onChangeText={text => {
                    if (text.trim().length) {
                      let finalTxt = text.replace(/\s\s+/g, ' ');
                      setName(finalTxt);
                      if (text.length > 0) {
                        setMobileError('');
                      }
                    } else {
                      setName('');
                    }
                  }}
                />
                {nameError !== '' && (
                  <Text style={styles.errorTxt}>{nameError}</Text>
                )}
                <View style={{marginVertical: 6}} />
                <Text style={styles.label}>Email</Text>
                <TextInputCompo
                  placeholder="Email"
                  value={userData?.email}
                  editable={false}
                  textStyle={{color: colors.grey}}
                />
                <View style={{marginVertical: 6}} />
                <Text style={styles.label}>Mobile</Text>
                <TextInputCompo
                  placeholder="Ener your mobile number"
                  value={mobile}
                  keyboardType="phone-pad"
                  onChangeText={text => {
                    if (text.trim().length) {
                      let finalTxt = text.replace(/\s\s+/g, ' ');
                      setMobile(finalTxt);
                      if (text.length > 0) {
                        setMobileError('');
                      }
                    } else {
                      setMobile('');
                    }
                  }}
                />
                {mobileError !== '' && (
                  <Text style={styles.errorTxt}>{mobileError}</Text>
                )}
                <ButtonComponent
                  title="Update Profile"
                  style={styles.btn}
                  onPress={handleUpdateProfile}
                  loading={loading}
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
  label: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '400',
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  btn: {
    marginTop: '10%',
    width: '54%',
    alignSelf: 'center',
  },
  errorTxt: {
    fontSize: 10,
    color: 'red',
    fontWeight: '500',
    paddingHorizontal: 10,
    marginTop: 3,
  },
});
