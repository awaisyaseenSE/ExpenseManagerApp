// AddNewCategoryModal

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  Keyboard,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../config/colors';
import ButtonComponent from '../components/ButtonComponent';
import TextInputCompo from '../components/TextInputCompo';
import {addCategory} from '../query/addCategory ';

const screenWidth = Dimensions.get('window').width;

const AddNewCategoryModal = ({show, setShow}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryNameError, setNewCategoryNameError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddNewCategrory = async () => {
    if (newCategoryName == '') {
      setNewCategoryNameError('Category name is required!');

      return null;
    }

    if (newCategoryName !== '') {
      Keyboard.dismiss();
      setLoading(true);
      let res = await addCategory(newCategoryName);
      if (res) {
        Alert.alert('Added', 'New category is added successfully!');
        setShow(false);
        setNewCategoryName('');
      }
      setLoading(false);
    }
  };

  return (
    <Modal visible={show} transparent animationType="slide">
      <View style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1}}>
        <View style={styles.container}>
          <TouchableOpacity
            activeOpacity={1}
            style={{flex: 1}}
            onPress={() => Keyboard.dismiss()}
          />
          <View style={styles.contentContainer}>
            <Text style={styles.heading}>Add New Category</Text>
            <TextInputCompo
              value={newCategoryName}
              onChangeText={text => {
                if (text.trim().length) {
                  let finalTxt = text.replace(/\s\s+/g, ' ');
                  setNewCategoryName(finalTxt);
                  if (text.length > 0) {
                    setNewCategoryNameError('');
                  }
                } else {
                  setNewCategoryName('');
                }
              }}
              maxLength={10}
              placeholder="Write"
              inputStyle={styles.input}
            />
            <Text style={styles.errorTxt}>{newCategoryNameError}</Text>
            <ButtonComponent
              title="Save"
              loading={loading}
              style={styles.btn}
              onPress={handleAddNewCategrory}
            />
            <ButtonComponent
              title="cancel"
              style={styles.btn1}
              onPress={() => setShow(false)}
            />
          </View>
          <TouchableOpacity
            activeOpacity={1}
            style={{flex: 1}}
            onPress={() => Keyboard.dismiss()}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: colors.white,

    width: screenWidth - 20,
    alignSelf: 'center',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  heading: {
    fontSize: 18,
    color: colors.black,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  input: {
    borderWidth: 0.4,
    borderColor: colors.primary,
  },
  btn: {
    width: '60%',
    alignSelf: 'center',
    marginVertical: 20,
  },
  btn1: {
    width: '60%',
    alignSelf: 'center',
    backgroundColor: colors.input_bg,
  },
  errorTxt: {
    fontSize: 12,
    color: 'red',
    fontWeight: '600',
    paddingHorizontal: 6,
    marginTop: 4,
  },
});

export default AddNewCategoryModal;
