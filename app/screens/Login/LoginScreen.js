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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
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
              <ButtonComponent style={styles.btn} title="Login" />
              <Text style={styles.forgotTxt}>Forgot Password?</Text>
              <ButtonComponent style={styles.btn1} title="SignUp" />
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
});
