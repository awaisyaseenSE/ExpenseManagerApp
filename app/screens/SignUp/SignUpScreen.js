import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../../config/colors';
import TextInputCompo from '../../components/TextInputCompo';
import ButtonComponent from '../../components/ButtonComponent';
import {validateEmail, validatePhoneNumber} from '../../utils/validations';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobile, setMobile] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [securePassword, setSecurePassword] = useState(true);

  const [loading, setLoading] = useState(false);

  const handleUploadUserData = async () => {
    try {
      await auth().currentUser?.updateProfile({
        displayName: name,
      });
      await firestore().collection('users').doc(auth().currentUser.uid).set({
        fullName: name,

        email: email,
        userUid: auth().currentUser.uid,
        imageUrl: '',
        // dateOfBirth: dateOfBirth,
        dateOfJoin: new Date(),
      });
      setLoading(false);
      // setUser(auth().currentUser);
    } catch (error) {
      setLoading(false);
      console.log('Error while uploading data of user to firestore: ', error);
    }
  };

  const signUpUser = () => {
    try {
      setLoading(true);
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(result => {
          handleUploadUserData();
          console.log('User account created & signed in!');
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            setLoading(false);
            console.log('That email address is already in use!');
            Alert.alert('That email address is already in use!');
          }
          if (error.code === 'auth/invalid-email') {
            setLoading(false);
            console.log('That email address is invalid!');
            Alert.alert('That email address is invalid!');
          }
          if (error.code == 'auth/weak-password') {
            setLoading(false);
            console.log(
              'Password is weak, password must be 6 characters or more!',
            );
            Alert.alert('Password is weak, try again!');
          }
          if (error.code === 'auth/network-request-failed') {
            setLoading(false);
            console.log(
              'auth/network-request-failed. Please check your network connection!',
            );
            Alert.alert('Please check your network connection!');
          }
          setLoading(false);
          console.log('getting ERROR while Sign up with Eamil: ', error);
        });
    } catch (error) {
      console.log(
        'Error in creating user account in userIneterest Screen: ',
        error,
      );
    }
  };

  const handleSignUp = () => {
    if (name == '') {
      setNameError('Full name is required!');
    } else {
      if (name.length < 2) {
        setNameError('Enter atleast 2 characters!');
      } else {
        setNameError('');
      }
    }

    if (email == '') {
      setEmailError('Email is required!');
    } else {
      if (!validateEmail(email)) {
        setEmailError('Email is invalid!');
      } else {
        setEmailError('');
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

    // validateEmail

    let confirmPass = false;

    if (password === '') {
      setPasswordError('Current password is required!');
    } else {
      if (password.length < 6) {
        setPasswordError('Enter correct current password!');
      } else {
        setPasswordError('');
      }
    }

    if (confirmPassword === '') {
      setConfirmPasswordError('Confirm password is required!');
    } else {
      if (confirmPassword.length < 6) {
        setConfirmPasswordError('Password must be 6 characters or more!');
      } else {
        setConfirmPasswordError('');
      }
    }

    if (confirmPassword === '') {
      setConfirmPasswordError('Confirm password is required!');
    } else {
      if (confirmPassword.length < 6) {
        setConfirmPasswordError('Password must be 6 characters or more!');
      } else {
        if (password !== confirmPassword) {
          setConfirmPasswordError('Confirm password is not same!');
        } else {
          setConfirmPasswordError('');
        }
      }
    }

    if (password === confirmPassword) {
      confirmPass = true;
    } else {
      confirmPass = false;
    }

    if (
      confirmPass &&
      name.length > 1 &&
      validateEmail(email) &&
      validatePhoneNumber(mobile)
    ) {
      signUpUser();
    } else {
      console.log('hhhh');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, width: '100%'}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      enabled
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 8}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.heading}>Create Account</Text>
          <View style={styles.content}>
            <View style={{marginTop: '8%', paddingHorizontal: 20}}>
              <Text style={styles.label}>Full Name</Text>
              <TextInputCompo
                placeholder="Enter full name"
                value={name}
                onChangeText={text => setName(text)}
              />
              {nameError !== '' && (
                <Text style={styles.errorTxt}>{nameError}</Text>
              )}
              <View style={{marginVertical: 6}} />

              <Text style={styles.label}>Email</Text>
              <TextInputCompo
                placeholder="example@gmail.com"
                value={email}
                keyboardType="email-address"
                onChangeText={text => setEmail(text)}
              />
              {emailError !== '' && (
                <Text style={styles.errorTxt}>{emailError}</Text>
              )}
              <View style={{marginVertical: 6}} />

              <Text style={styles.label}>Mobile Number</Text>
              <TextInputCompo
                placeholder="Enter mobile number"
                value={mobile}
                onChangeText={text => setMobile(text)}
                keyboardType="phone-pad"
              />
              {mobileError !== '' && (
                <Text style={styles.errorTxt}>{mobileError}</Text>
              )}
              <View style={{marginVertical: 6}} />

              <Text style={styles.label}>Password</Text>
              <TextInputCompo
                placeholder="********"
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry={securePassword}
                secureText={
                  !securePassword
                    ? require('../../assets/eye.png')
                    : require('../../assets/eye-close.png')
                }
                onPressSecure={() => setSecurePassword(!securePassword)}
              />
              {passwordError !== '' && (
                <Text style={styles.errorTxt}>{passwordError}</Text>
              )}
              <View style={{marginVertical: 6}} />

              <Text style={styles.label}>Confirm Password</Text>
              <TextInputCompo
                placeholder="********"
                value={confirmPassword}
                onChangeText={text => setConfirmPassword(text)}
                secureTextEntry={securePassword}
                secureText={
                  !securePassword
                    ? require('../../assets/eye.png')
                    : require('../../assets/eye-close.png')
                }
                onPressSecure={() => setSecurePassword(!securePassword)}
              />
              {confirmPasswordError !== '' && (
                <Text style={styles.errorTxt}>{confirmPasswordError}</Text>
              )}
              <ButtonComponent
                onPress={handleSignUp}
                style={styles.btn}
                title="Sign Up"
                loading={loading}
              />
              <Text style={styles.forgotTxt}>
                Already have an account?{' '}
                <Text style={styles.loginTxt}>Login</Text>
              </Text>
            </View>
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
  },
  heading: {
    fontSize: 18,
    color: colors.black,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: '12%',
  },
  label: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '400',
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  btn: {
    width: '50%',
    alignSelf: 'center',
    marginTop: '6%',
  },
  btn1: {
    width: '50%',
    alignSelf: 'center',
    backgroundColor: colors.input_bg,
  },
  forgotTxt: {
    fontSize: 12,
    color: colors.grey,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  loginTxt: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  errorTxt: {
    fontSize: 10,
    color: 'red',
    fontWeight: '500',
    paddingHorizontal: 10,
    marginTop: 3,
  },
});
