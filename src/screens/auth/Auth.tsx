// src/screens/auth/Auth.tsx
import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // yarn add react-native-linear-gradient
import {authStyle} from '../../styles/authStyle';
import {colors} from '../../constants/colors';
import {icons} from '../../constants'; // or wherever your icons are exported

const Auth: React.FC = () => {
  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={authStyle.container}>
      <View style={authStyle.contentContainer}>
        {/* Title */}
        <Text style={authStyle.title}>Connect friends easily & quickly</Text>

        {/* Subtitle */}
        <Text style={authStyle.subtitle}>
          Our chat app is the perfect way to stay connected with friends and
          family.
        </Text>

        {/* Google Sign In Button */}
        <TouchableOpacity style={authStyle.googleButton} onPress={() => {}}>
          <Image source={icons.google} style={authStyle.googleIcon} />
          <Text>Continue with Google</Text>
        </TouchableOpacity>

        {/* OR Divider */}
        <Text style={authStyle.dividerText}>OR</Text>

        {/* Sign Up with Mail Button */}
        <TouchableOpacity style={authStyle.signUpButton} onPress={() => {}}>
          <Text style={authStyle.signUpButtonText}>Sign up with mail</Text>
        </TouchableOpacity>

        {/* Existing Account? Login */}
        <View style={authStyle.existingAccountContainer}>
          <Text style={authStyle.existingAccountText}>Existing account?</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={authStyle.loginText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Auth;
