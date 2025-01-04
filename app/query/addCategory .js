import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const addCategory = async categoryName => {
  const user = auth().currentUser;

  if (!user) {
    alert('No user is logged in.');
    return null;
  }

  if (!categoryName.trim()) {
    alert('Category name cannot be empty!');
    return null;
  }

  try {
    await firestore()
      .collection('categories')
      .doc(user.uid)
      .collection('userCategories')
      .add({name: categoryName});

    return true;
  } catch (error) {
    console.log('Error adding category:', error);
    return null;
  }
};
