import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {authStyle} from './authStyle';
import {COLORS} from '../../constants/colors';
import {useAuth} from './useAuth';
import GoogleButton from '../../components/googleButton/GoogleButton';
import Divider from '../../components/divider/Divider';
import GradientButton from '../../components/gradientButton/GradientButton';
import Loader from '../../components/loader/Loader';

const Auth: React.FC = () => {
  const {navigateToLogin, handleGoogleSignUp, navigateToSignup, googleLoading} =
    useAuth();

  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientEnd]}
      style={authStyle.container}>
      <View style={authStyle.contentContainer}>
        <Text style={authStyle.title}>Connect friends easily & quickly</Text>
        <Text style={authStyle.subtitle}>
          Our chat app is the perfect way to stay connected with friends and
          family.
        </Text>

        {googleLoading ? (
          <View style={authStyle.iconContainer}>
            <Loader />
          </View>
        ) : (
          <GoogleButton onPress={handleGoogleSignUp} />
        )}

        <Divider lineColor={COLORS.white} orTextColor={COLORS.white} />

        <GradientButton
          onPress={navigateToSignup}
          containerStyle={authStyle.signUpButton}
          textStyle={authStyle.signUpButtonText}
          colors={[
            COLORS.signupButtonBackground,
            COLORS.signupButtonBackground,
          ]}>
          <Text style={authStyle.buttonText}>Sign up with mail</Text>
        </GradientButton>

        <View style={authStyle.existingAccountContainer}>
          <Text style={authStyle.existingAccountText}>Existing account?</Text>
          <TouchableOpacity onPress={navigateToLogin}>
            <Text style={authStyle.loginText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Auth;
