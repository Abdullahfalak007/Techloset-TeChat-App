import React from 'react';
import {View, Text, TextInput} from 'react-native';
import {inputFieldStyle} from './inputFieldStyle';
import {InputFieldProps} from '../../constants/types';
import {COLORS} from '../../constants/colors';

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  errorTextStyle,
  ...textInputProps
}) => {
  return (
    <View style={[inputFieldStyle.container, containerStyle]}>
      <Text style={[inputFieldStyle.label, labelStyle]}>{label}</Text>
      <TextInput
        style={[inputFieldStyle.input, inputStyle]}
        placeholderTextColor={COLORS.placeholderTextColor}
        {...textInputProps}
      />
      {error ? (
        <Text style={[inputFieldStyle.errorText, errorTextStyle]}>{error}</Text>
      ) : null}
    </View>
  );
};

export default InputField;
