import React from 'react';
import {View, Text, TextInput, StyleSheet, TextInputProps} from 'react-native';
import {COLORS} from '../../constants/colors';
import {inputFieldStyle} from '../../styles/inputFieldStyle';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  ...textInputProps
}) => {
  return (
    <View style={inputFieldStyle.container}>
      <Text style={inputFieldStyle.label}>{label}</Text>
      <TextInput
        style={inputFieldStyle.input}
        placeholderTextColor="#999"
        {...textInputProps}
      />
      {error ? <Text style={inputFieldStyle.errorText}>{error}</Text> : null}
    </View>
  );
};

export default InputField;
