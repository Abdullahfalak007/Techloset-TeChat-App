// src/screens/login/Login.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {loginStyle} from '../../styles/loginStyle';
import {ICONS} from '../../constants';
import {useLogin} from './useLogin';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {handleGoogleSignIn, handleLogin, handleForgotPassword, navigation} =
    useLogin();

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: '#fff'}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}
        keyboardShouldPersistTaps="handled">
        <View>
          {/* Back Arrow */}
          <TouchableOpacity
            style={loginStyle.backButton}
            onPress={() => navigation.goBack()}>
            <Image source={ICONS.backArrow} style={loginStyle.backArrowIcon} />
          </TouchableOpacity>

          {/* Top Container: Headings, Google Button, Divider, Inputs */}
          <View style={loginStyle.topContainer}>
            <Text style={loginStyle.heading}>Log in to Chatbox</Text>
            <Text style={loginStyle.subheading}>
              Welcome back! Sign in using your social account or email to
              continue us
            </Text>

            {/* Google Button */}
            <TouchableOpacity
              style={loginStyle.googleButton}
              onPress={handleGoogleSignIn}>
              <Image source={ICONS.google} style={loginStyle.googleIcon} />
            </TouchableOpacity>

            {/* Divider with OR */}
            <View style={loginStyle.dividerContainer}>
              <View style={loginStyle.divider} />
              <Text style={loginStyle.orText}>OR</Text>
              <View style={loginStyle.divider} />
            </View>

            {/* Email Field */}
            <Text style={loginStyle.label}>Your email</Text>
            <TextInput
              style={loginStyle.input}
              placeholder="Your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
            />

            {/* Password Field */}
            <Text style={[loginStyle.label, {marginTop: 24}]}>Password</Text>
            <TextInput
              style={loginStyle.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        {/* Bottom Container: Gradient Button & Forgot Password Link */}
        <View style={loginStyle.bottomContainer}>
          <LinearGradient
            colors={['#4156a5', '#010203']}
            start={{x: 1, y: 0}}
            end={{x: 0, y: 0}}
            style={loginStyle.gradientButton}>
            <TouchableOpacity onPress={() => handleLogin(email, password)}>
              <Text style={loginStyle.buttonText}>Log in</Text>
            </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={loginStyle.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
