import {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const useCategories = () => {
  const predefinedCategories = ['Travel', 'New House', 'Car', 'Wedding'];

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchUserCategories = async () => {
      const user = auth().currentUser;

      if (!user) {
        console.log('No user is logged in.');
        return;
      }

      try {
        const userCategories = [];
        const snapshot = await firestore()
          .collection('categories')
          .doc(user.uid)
          .collection('userCategories')
          .get();

        snapshot.forEach(doc => {
          userCategories.push(doc.data().name);
        });

        // Combine predefined and user-created categories, ensuring uniqueness
        const combinedCategories = [
          ...new Set([...predefinedCategories, ...userCategories]),
        ];
        console.log(combinedCategories);
        setCategories(combinedCategories);
      } catch (error) {
        console.error('Error fetching user categories:', error);
      }
    };

    fetchUserCategories();
  }, []);

  return categories;
};

export default useCategories;
