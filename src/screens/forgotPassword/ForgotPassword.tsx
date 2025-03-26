// src/screens/forgotPassword/ForgotPassword.tsx
import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {forgotPasswordStyle} from '../../styles/forgotPasswordStyle';
import BackButton from '../../components/backButton/BackButton';
import GradientButton from '../../components/gradientButton/GradientButton';
import InputField from '../../components/inputField/InputField';
import {useForgotPassword} from './useForgotPassword';
import Loader from '../../components/loader/Loader';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const {handlePasswordReset, navigation, resetLoading} = useForgotPassword();

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
        <GradientButton onPress={() => handlePasswordReset(email)}>
          <Text style={forgotPasswordStyle.buttonText}>Reset Password</Text>
          {resetLoading && <Loader style={forgotPasswordStyle.loader} />}
        </GradientButton>
      </View>
    </View>
  );
};

export default ForgotPassword;
