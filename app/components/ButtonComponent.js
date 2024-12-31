import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React from 'react';
import colors from '../config/colors';

const ButtonComponent = ({
  title = '',
  style,
  onPress,
  textStyle,
  loading = false,
  activeOpacity = 0.7,
  loadingColor = colors.white,
  loadingSize = 16,
}) => {
  return (
    <TouchableOpacity
      style={{...styles.buttonContainer, ...style}}
      activeOpacity={activeOpacity}
      onPress={onPress}
      disabled={loading}>
      {loading ? (
        <ActivityIndicator size={loadingSize} color={loadingColor} />
      ) : (
        <Text style={{...styles.buttonText, ...textStyle}}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    borderCurve: 'continuous',
  },
  buttonText: {
    fontSize: 15,
    color: colors.black,
    fontWeight: '500',
  },
});

export default ButtonComponent;
