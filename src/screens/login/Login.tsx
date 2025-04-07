import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {loginStyle} from '../../styles/loginStyle';
import BackButton from '../../components/backButton/BackButton';
import GradientButton from '../../components/gradientButton/GradientButton';
import InputField from '../../components/inputField/InputField';
import {useLogin} from './useLogin';
import GoogleButton from '../../components/googleButton/GoogleButton';
import Divider from '../../components/divider/Divider';
import Loader from '../../components/loader/Loader';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {
    handleGoogleSignIn,
    handleLogin,
    handleForgotPassword,
    navigation,
    loginLoading,
    googleLoading,
  } = useLogin();

  return (
    <View style={{flex: 1}}>
      <View style={loginStyle.container}>
        <View>
          <BackButton onPress={() => navigation.goBack()} />
          <View style={loginStyle.topContainer}>
            <Text style={loginStyle.heading}>Log in to Chatbox</Text>
            <Text style={loginStyle.subheading}>
              Welcome back! Sign in using your social account or email to
              continue.
            </Text>

            {googleLoading ? (
              <View style={loginStyle.iconContainer}>
                <Loader />
              </View>
            ) : (
              <GoogleButton onPress={handleGoogleSignIn} />
            )}

            <Divider />
            <InputField
              label="Your email"
              placeholder="Your email"
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
          </View>
        </View>
        <View style={loginStyle.bottomContainer}>
          <GradientButton onPress={() => handleLogin(email, password)}>
            <Text style={loginStyle.buttonText}>Log in</Text>
            {loginLoading && <Loader style={loginStyle.loader} />}
          </GradientButton>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={loginStyle.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
