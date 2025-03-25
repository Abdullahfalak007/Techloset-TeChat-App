import React from 'react';
import {View, Text} from 'react-native';
import {signupStyle} from '../../styles/signupStyle';
import BackButton from '../../components/backButton/BackButton';
import GradientButton from '../../components/gradientButton/GradientButton';
import InputField from '../../components/inputField/InputField';
import {useSignup} from './useSignup';

const Signup: React.FC = () => {
  const {
    navigation,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleSignup,
  } = useSignup();

  return (
    <View style={signupStyle.container}>
      <View style={signupStyle.container}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={signupStyle.middleContainer}>
          <Text style={signupStyle.heading}>Sign up with Email</Text>
          <Text style={signupStyle.subheading}>
            Get chatting with friends and family today by signing up for our
            chat app!
          </Text>

          <InputField
            label="Your name"
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <InputField
            label="Your email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <InputField
            label="Password"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <InputField
            label="Confirm Password"
            placeholder="Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
      </View>

      <View style={signupStyle.bottomContainer}>
        <GradientButton onPress={handleSignup} text="Create an account" />
      </View>
    </View>
  );
};

export default Signup;
