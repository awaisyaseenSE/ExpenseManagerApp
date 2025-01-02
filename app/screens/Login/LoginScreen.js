import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../../config/colors';
import TextInputCompo from '../../components/TextInputCompo';
import ButtonComponent from '../../components/ButtonComponent';
import {useNavigation} from '@react-navigation/native';
import useAuth from '../../auth/useAuth';
import {validateEmail} from '../../utils/validations';
import auth from '@react-native-firebase/auth';
import MyIndicator from '../../components/MyIndicator';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const {user, setUser} = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    let emailValid = false;
    if (email === '') {
      setEmailError('Email is required!');
    } else {
      if (!validateEmail(email)) {
        setEmailError('Email is invalid!');
        emailValid = false;
      } else {
        setEmailError('');
        emailValid = true;
      }
    }

    if (password === '') {
      setPasswordError('Current password is required!');
    } else {
      if (password.length < 6) {
        setPasswordError('Enter correct current password!');
      } else {
        setPasswordError('');
      }
    }

    try {
      if (emailValid && password.length > 5) {
        setLoading(true);
        auth()
          .signInWithEmailAndPassword(email, password)
          .then(result => {
            setEmail('');
            setPassword('');
            setLoading(false);
            setUser(auth().currentUser);
          })
          .catch(error => {
            setLoading(false);

            if (error.code === 'auth/user-not-found') {
              setEmailError('Invalid Email please check your email');
            } else if (error.code === 'auth/invalid-email') {
              setEmailError('Email is invalid!');
            } else if (error.code === 'auth/email-already-in-use') {
              setEmailError('That email address is already in use!');
            } else if (error.code === 'auth/wrong-password') {
              setPasswordError('Password is invalid!');
            } else if (error.code === 'auth/internal-error') {
              Alert.alert('Please enter valid email and password!');
            } else if (error.code === 'auth/invalid-credential') {
              Alert.alert('Please enter valid email and password!');
            } else if (error.code === 'auth/invalid-login') {
              Alert.alert('Please enter valid email and password!');
            } else if (error.code === 'auth/network-request-failed') {
              Alert.alert('Please check your network connection!');
            } else {
              console.log('Error while login: ', error);
            }
          });
      }
    } catch (error) {}
  };

  return (
    <>
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
            <Text style={styles.heading}>Welcome</Text>
            <View style={styles.content}>
              <View style={{marginTop: '24%', paddingHorizontal: 20}}>
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
                <View style={{marginVertical: 14}} />
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
                <ButtonComponent
                  style={styles.btn}
                  title="Login"
                  loading={loading}
                  onPress={handleLogin}
                />
                <Text style={styles.forgotTxt}>Forgot Password?</Text>
                <ButtonComponent
                  style={styles.btn1}
                  title="SignUp"
                  onPress={() => navigation.navigate('SignUpScreen')}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <MyIndicator visible={loading} />
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
    marginTop: '26%',
  },
  btn1: {
    width: '50%',
    alignSelf: 'center',
    backgroundColor: colors.input_bg,
  },
  forgotTxt: {
    fontSize: 12,
    color: colors.black,
    fontWeight: '700',
    marginVertical: 10,
    textAlign: 'center',
  },
  errorTxt: {
    fontSize: 10,
    color: 'red',
    fontWeight: '500',
    paddingHorizontal: 10,
    marginTop: 3,
  },
});
