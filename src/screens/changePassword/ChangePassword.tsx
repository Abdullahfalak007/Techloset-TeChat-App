// src/screens/changePassword/ChangePassword.tsx
import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import GradientHeader from '../../components/gradientHeader/GradientHeader';
import {useChangePassword} from './useChangePassword';
import {changePasswordStyles} from '../../styles/changePasswordStyle';

const ChangePassword: React.FC = () => {
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    handleUpdatePassword,
    loading,
    navigation,
  } = useChangePassword();

  return (
    <View style={changePasswordStyles.container}>
      <GradientHeader
        title="Change Password"
        isScreenWithBackArrow
        onBackPress={() => navigation.goBack()}
      />

      <View style={changePasswordStyles.contentContainer}>
        <View style={changePasswordStyles.formContainer}>
          {/* Current Password */}
          <View style={changePasswordStyles.infoGroup}>
            <Text style={changePasswordStyles.label}>Current Password</Text>
            <TextInput
              style={changePasswordStyles.valueInput}
              placeholder="********"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
          </View>

          {/* New Password */}
          <View style={changePasswordStyles.infoGroup}>
            <Text style={changePasswordStyles.label}>New Password</Text>
            <TextInput
              style={changePasswordStyles.valueInput}
              placeholder="********"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>

          {/* Confirm New Password */}
          <View style={changePasswordStyles.infoGroup}>
            <Text style={changePasswordStyles.label}>Confirm New Password</Text>
            <TextInput
              style={changePasswordStyles.valueInput}
              placeholder="********"
              secureTextEntry
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
            />
          </View>
        </View>

        {/* Button at the bottom */}
        <TouchableOpacity
          style={[changePasswordStyles.updateButton, loading && {opacity: 0.5}]}
          onPress={handleUpdatePassword}
          disabled={loading}>
          <Text style={changePasswordStyles.updateButtonText}>
            Update Password
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePassword;
