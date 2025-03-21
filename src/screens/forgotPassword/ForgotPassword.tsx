import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {forgotPasswordStyle} from '../../styles/forgotPasswordStyle';
import {useForgotPassword} from './useForgotPassword';
import {ICONS} from '../../constants/icons';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const {handlePasswordReset, handleBackToLogin, navigation} =
    useForgotPassword();

  return (
    <View style={forgotPasswordStyle.container}>
      {/* Back Arrow */}
      <TouchableOpacity
        style={forgotPasswordStyle.backButton}
        onPress={() => navigation.goBack()}>
        <Image
          source={ICONS.backArrow}
          style={forgotPasswordStyle.backArrowIcon}
        />
      </TouchableOpacity>

      {/* Middle Container - vertically centered content */}
      <View style={forgotPasswordStyle.middleContainer}>
        <Text style={forgotPasswordStyle.heading}>Forgot Password</Text>
        <Text style={forgotPasswordStyle.subheading}>
          Forgot your password? Don't worry, we'll send you a magic link right
          at your inbox!
        </Text>

        <Text style={forgotPasswordStyle.label}>Your email</Text>
        <TextInput
          style={forgotPasswordStyle.input}
          placeholder="Your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Bottom Container - pinned gradient button */}
      <View style={forgotPasswordStyle.bottomContainer}>
        <LinearGradient
          colors={['#4156a5', '#010203']}
          start={{x: 1, y: 0}}
          end={{x: 0, y: 0}}
          style={forgotPasswordStyle.gradientButton}>
          <TouchableOpacity onPress={() => handlePasswordReset(email)}>
            <Text style={forgotPasswordStyle.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

export default ForgotPassword;
