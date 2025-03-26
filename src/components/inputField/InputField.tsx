import React from 'react';
import {View, Text, TextInput} from 'react-native';
import {inputFieldStyle} from '../../styles/inputFieldStyle';
import {InputFieldProps} from '../../constants/types';

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
        placeholderTextColor="#999"
        {...textInputProps}
      />
      {error ? (
        <Text style={[inputFieldStyle.errorText, errorTextStyle]}>{error}</Text>
      ) : null}
    </View>
  );
};

export default InputField;
