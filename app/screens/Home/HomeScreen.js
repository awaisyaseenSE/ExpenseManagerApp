import {View, Text, Button} from 'react-native';
import React from 'react';
import ButtonComponent from '../../components/ButtonComponent';
import useAuth from '../../auth/useAuth';
import auth from '@react-native-firebase/auth';

export default function HomeScreen() {
  //   const {logout} = useAuth();
  const handleLogout = () => {
    // console.log('sfdsfd');
    // auth()
    //   .signOut()
    //   .then(() => {
    //     console.log('object');
    //   })
    //   .catch(er =>
    //     console.log('error while logout user in useAuth file: ', er),
    //   );

    console.log('object');
  };

  return (
    <View>
      <Text>HomeScreen is the bestr</Text>
      <Button title="asfdkjsnkj" onPress={() => console.log('sfsfjkdkj')} />
    </View>
  );
}
