import React from 'react';
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
import {signupStyle} from '../../styles/signupStyle';
import {ICONS} from '../../constants/icons';
import {useSignup} from './useSignup';

const Signup: React.FC = () => {
  const {
    navigation,
    name,
    setName,
    email,
    setEmail,
    emailError,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleSignup,
  } = useSignup();

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}
        keyboardShouldPersistTaps="handled">
        <View style={signupStyle.container}>
          {/* Back Arrow */}
          <TouchableOpacity
            style={signupStyle.backButton}
            onPress={() => navigation.goBack()}>
            <Image source={ICONS.backArrow} style={signupStyle.backArrowIcon} />
          </TouchableOpacity>

          {/* Middle Container: Headings, Inputs, etc. */}
          <View style={signupStyle.middleContainer}>
            <Text style={signupStyle.heading}>Sign up with Email</Text>
            <Text style={signupStyle.subheading}>
              Get chatting with friends and family today by signing up for our
              chat app!
            </Text>

            {/* Name Field */}
            <Text style={signupStyle.label}>Your name</Text>
            <TextInput
              style={signupStyle.input}
              placeholder="Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />

            {/* Email Field */}
            <Text style={[signupStyle.label, {marginTop: 24}]}>Your email</Text>
            <TextInput
              style={signupStyle.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
            />
            {emailError && (
              <Text style={signupStyle.errorText}>{emailError}</Text>
            )}

            {/* Password Field */}
            <Text style={[signupStyle.label, {marginTop: 24}]}>Password</Text>
            <TextInput
              style={signupStyle.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
            />

            {/* Confirm Password Field */}
            <Text style={[signupStyle.label, {marginTop: 24}]}>
              Confirm Password
            </Text>
            <TextInput
              style={signupStyle.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
        </View>

        {/* Bottom Container: Pinned gradient button */}
        <View style={signupStyle.bottomContainer}>
          <LinearGradient
            colors={['#4156a5', '#010203']}
            start={{x: 1, y: 0}}
            end={{x: 0, y: 0}}
            style={signupStyle.gradientButton}>
            <TouchableOpacity onPress={handleSignup}>
              <Text style={signupStyle.buttonText}>Create an account</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signup;
