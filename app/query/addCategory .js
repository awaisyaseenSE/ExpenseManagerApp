import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const addCategory = async categoryName => {
  const user = auth().currentUser;

  if (!user) {
    alert('No user is logged in.');
    return;
  }

  if (!categoryName.trim()) {
    alert('Category name cannot be empty!');
    return;
  }

  try {
    await firestore()
      .collection('categories')
      .doc(user.uid)
      .collection('userCategories')
      .add({name: categoryName});

    alert('Category added successfully!');
  } catch (error) {
    console.error('Error adding category:', error);
  }
};
