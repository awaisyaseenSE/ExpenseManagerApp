import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';
import colors from '../config/colors';

const TextInputCompo = ({
  value = '',
  onChangeText,
  placeholder = '',
  secureTextEntry = false,
  onPressSecure = () => {},
  secureText = '',
  inputStyle = {},
  textStyle = {},
  placeholderTextColor = colors.grey,
  clearIcon = '',
  onPressClear = () => {},
  closeIconStyle,
  leftIcon,
  leftIconStyle,
  onPress,
  loading = false,
  innerRef,
  showHideIconStyle,
  rightIcon,
  rightIconOnPress,
  leftTxt = '',
  rightIconStyle,
  placeholderStyle,
  ...props
}) => {
  return (
    <View style={{...styles.inputStyle, ...inputStyle}}>
      {leftIcon && (
        <TouchableOpacity
          style={styles.leftIconContainer}
          onPress={onPress}
          activeOpacity={0.6}>
          <Image
            source={leftIcon}
            style={{...styles.leftIcon, ...leftIconStyle}}
          />
        </TouchableOpacity>
      )}
      {leftTxt !== '' && <Text>{leftTxt}</Text>}
      <TextInput
        ref={innerRef}
        // style={
        //   value
        //     ? {...styles.textStyle, ...textStyle}
        //     : {...styles.placeholderStyles, ...placeholderStyle}
        // }
        style={{...styles.textStyle, ...textStyle}}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={secureTextEntry}
        onPressSecure={onPressSecure}
        {...props}
      />
      {!!secureText ? (
        <TouchableOpacity onPress={onPressSecure} activeOpacity={0.6}>
          <Image
            source={secureText}
            style={{...styles.showHideIcon, ...showHideIconStyle}}
          />
        </TouchableOpacity>
      ) : null}
      {rightIcon && (
        <TouchableOpacity
          style={styles.righticonContainer}
          activeOpacity={0.6}
          onPress={rightIconOnPress}>
          <Image
            source={rightIcon}
            style={{...styles.righticon, ...rightIconStyle}}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    height: 44,
    justifyContent: 'space-between',
    borderRadius: 34,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#DFF7E2',
  },
  textStyle: {
    fontSize: 13,
    flex: 1,
    color: colors.black,
    // marginRight: 12,
    height: '100%',
  },
  showHideIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.grey,
  },
  closeIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: colors.grey,
  },
  leftIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.grey,
    marginRight: 12,
  },
  leftIconContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  righticon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  righticonContainer: {
    height: '100%',
    paddingLeft: 10,
    justifyContent: 'center',
  },
  placeholderStyles: {
    fontSize: 12,
    flex: 1,
    height: '100%',
  },
});

export default TextInputCompo;
