import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  LayoutAnimation,
} from 'react-native';
import React, {useRef, useState} from 'react';
import colors from '../config/colors';

const ShowFaqCompo = ({data}) => {
  const [show, setShow] = useState(false);

  const animationController = useRef(new Animated.Value(0)).current;
  const toggleAnimation = {
    duration: 300,
    update: {
      duration: 300,
      property: LayoutAnimation.Properties.opacity,
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      duration: 200,
      property: LayoutAnimation.Properties.opacity,
      type: LayoutAnimation.Types.easeInEaseOut,
    },
  };

  const toggleListItem = async () => {
    const config = {
      duration: 300,
      toValue: show ? 0 : 1,
      useNativeDriver: true,
    };
    Animated.timing(animationController, config).start();
    LayoutAnimation.configureNext(toggleAnimation);
    setShow(!show);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.titleContainer}
        onPress={toggleListItem}>
        <Text style={styles.title}>{data?.question}</Text>
        <Image
          source={
            show
              ? require('../assets/up-arrow.png')
              : require('../assets/down-2.png')
          }
          style={styles.down}
        />
      </TouchableOpacity>
      {show && <Text style={styles.desc}>{data?.answer}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  titleContainer: {
    backgroundColor: '#DFF7E2',
    paddingHorizontal: 10,
    paddingVertical: 18,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.black,
    flex: 1,
    marginRight: 4,
  },
  desc: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    paddingHorizontal: 10,
    marginVertical: 12,
  },
  down: {
    width: 14,
    height: 14,
    tintColor: colors.black,
  },
});

export default ShowFaqCompo;
