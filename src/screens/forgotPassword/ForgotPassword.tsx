// src/screens/forgotPassword/ForgotPassword.tsx
import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {forgotPasswordStyle} from '../../styles/forgotPasswordStyle';
import BackButton from '../../components/backButton/BackButton';
import GradientButton from '../../components/gradientButton/GradientButton';
import InputField from '../../components/inputField/InputField';
import {useForgotPassword} from './useForgotPassword';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const {handlePasswordReset, navigation} = useForgotPassword();

  return (
    <View style={forgotPasswordStyle.container}>
      <BackButton onPress={() => navigation.goBack()} />
      <View style={forgotPasswordStyle.middleContainer}>
        <Text style={forgotPasswordStyle.heading}>Forgot Password</Text>
        <Text style={forgotPasswordStyle.subheading}>
          Forgot your password? Don't worry, we'll send you a magic link right
          at your inbox!
        </Text>

        <InputField
          label="Your email"
          placeholder="Your email"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={forgotPasswordStyle.bottomContainer}>
        <GradientButton
          onPress={() => handlePasswordReset(email)}
          text="Reset Password"
        />
      </View>
    </View>
  );
};

export default ForgotPassword;
