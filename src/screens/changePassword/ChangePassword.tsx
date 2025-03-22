// src/screens/changePassword/ChangePassword.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAppDispatch, useAppSelector} from '../../hooks/useStore';
import {MainStackParamList} from '../../constants/types';
import {COLORS} from '../../constants/colors';
import GradientHeader from '../../components/gradientHeader/GradientHeader';
import {changeUserPassword} from '../../store/slices/authSlice';
import Toast from 'react-native-toast-message';

const ChangePassword: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useAppDispatch();
  const {loading} = useAppSelector(state => state.auth);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords do not match',
        text2: 'Please ensure the new passwords match.',
      });
      return;
    }

    try {
      await dispatch(
        changeUserPassword({currentPassword, newPassword}),
      ).unwrap();

      Toast.show({
        type: 'success',
        text1: 'Password Updated',
        text2: 'Your password has been changed successfully.',
      });
      navigation.goBack();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Update Password',
        text2: error || 'An unknown error occurred.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <GradientHeader
        title="Change Password"
        isScreenWithBackArrow
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.contentContainer}>
        <View style={styles.formContainer}>
          {/* Current Password */}
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.valueInput}
              placeholder="********"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
          </View>

          {/* New Password */}
          <View style={styles.infoGroup}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.valueInput}
              placeholder="********"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>

          {/* Confirm New Password */}
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.valueInput}
              placeholder="********"
              secureTextEntry
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
            />
          </View>
        </View>

        {/* Button at the bottom */}
        <TouchableOpacity
          style={[styles.updateButton, loading && {opacity: 0.5}]}
          onPress={handleUpdatePassword}
          disabled={loading}>
          <Text style={styles.updateButtonText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  // Content container using space-between to push the button to the bottom
  contentContainer: {
    flex: 1,
    marginTop: -20,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'space-around',
  },
  // Form container to group the input fields at the top
  formContainer: {
    marginBottom: 300,
  },
  infoGroup: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: COLORS.tabBarActiveTintColor,
    fontWeight: '500',
    marginBottom: 4,
  },
  valueInput: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '400',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyTextSubtitle,
    paddingBottom: 8,
  },
  // Button styling like the Profile update button, placed at the bottom
  updateButton: {
    width: '100%',
    backgroundColor: COLORS.tabBarActiveTintColor,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  updateButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
