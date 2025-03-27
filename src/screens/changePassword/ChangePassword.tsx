import React from 'react';
import {View} from 'react-native';
import GradientHeader from '../../components/gradientHeader/GradientHeader';
import UpdateButton from '../../components/updateButton/UpdateButton';
import InputField from '../../components/inputField/InputField';
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
        <View style={{flex: 1}}>
          <View style={changePasswordStyles.formContainer}>
            <InputField
              label="Current Password"
              placeholder="********"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              containerStyle={changePasswordStyles.infoGroup}
              labelStyle={changePasswordStyles.label}
              inputStyle={changePasswordStyles.valueInput}
            />

            <InputField
              label="New Password"
              placeholder="********"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              containerStyle={changePasswordStyles.infoGroup}
              labelStyle={changePasswordStyles.label}
              inputStyle={changePasswordStyles.valueInput}
            />

            <InputField
              label="Confirm New Password"
              placeholder="********"
              secureTextEntry
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              containerStyle={changePasswordStyles.infoGroup}
              labelStyle={changePasswordStyles.label}
              inputStyle={changePasswordStyles.valueInput}
            />
          </View>
        </View>

        {/* Wrap the update button in a relative container */}
        <View>
          <UpdateButton
            onPress={handleUpdatePassword}
            text="Update Password"
            loading={loading}
          />
        </View>
      </View>
    </View>
  );
};

export default ChangePassword;
