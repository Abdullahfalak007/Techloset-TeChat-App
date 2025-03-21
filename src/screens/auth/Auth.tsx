import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {authStyle} from '../../styles/authStyle';
import {COLORS} from '../../constants/colors';
import {ICONS} from '../../constants/icons';
import {useAuth} from './useAuth';

const Auth: React.FC = () => {
  const {navigateToLogin, handleGoogleSignUp, navigateToSignup} = useAuth();

  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientEnd]}
      style={authStyle.container}>
      <View style={authStyle.contentContainer}>
        {/* Title */}
        <Text style={authStyle.title}>Connect friends easily & quickly</Text>

        {/* Subtitle */}
        <Text style={authStyle.subtitle}>
          Our chat app is the perfect way to stay connected with friends and
          family.
        </Text>

        {/* Circular Google Button */}
        <TouchableOpacity
          style={authStyle.googleButton}
          onPress={handleGoogleSignUp}>
          <Image source={ICONS.google} style={authStyle.googleIcon} />
        </TouchableOpacity>

        {/* Divider with OR */}
        <View style={authStyle.dividerContainer}>
          <View style={authStyle.dividerLine} />
          <Text style={authStyle.orText}>OR</Text>
          <View style={authStyle.dividerLine} />
        </View>

        {/* Sign Up with Mail Button */}
        <TouchableOpacity
          style={authStyle.signUpButton}
          onPress={navigateToSignup}>
          <Text style={authStyle.signUpButtonText}>Sign up with mail</Text>
        </TouchableOpacity>

        {/* Existing Account? Log in */}
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
