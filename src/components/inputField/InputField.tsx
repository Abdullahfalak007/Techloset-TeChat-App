import React from 'react';
import {View, Text, TextInput, TextInputProps} from 'react-native';
import {inputFieldStyle} from '../../styles/inputFieldStyle';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: object;
  labelStyle?: object;
  inputStyle?: object;
  errorTextStyle?: object;
}

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
