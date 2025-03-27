import React from 'react';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import GradientHeader from '../../components/gradientHeader/GradientHeader';
import {useProfile} from './useProfile';
import {profileStyles} from '../../styles/profileStyle';
import {ICONS} from '../../constants/icons';
import UserAvatar from '../../components/userAvatar/UserAvatar';
import InputField from '../../components/inputField/InputField';
import UpdateButton from '../../components/updateButton/UpdateButton';

const Profile: React.FC = () => {
  const {
    user,
    displayName,
    setDisplayName,
    email,
    setEmail,
    status,
    setStatus,
    handleUpdateProfile,
    handleEditAvatar,
    navigation,
    updating,
  } = useProfile();

  return (
    <>
      <GradientHeader
        title="Profile"
        isScreenWithBackArrow
        onBackPress={() => navigation.goBack()}
      />
      <View style={profileStyles.container}>
        <View style={profileStyles.scrollContainer}>
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={profileStyles.contentContainer}>
            <View style={profileStyles.avatarContainer}>
              <UserAvatar
                source={user?.photoURL ? user.photoURL : ICONS.avatar}
                style={profileStyles.avatar}
              />
              <TouchableOpacity
                style={profileStyles.editIconWrapper}
                onPress={handleEditAvatar}>
                <UserAvatar
                  source={ICONS.edit}
                  style={profileStyles.editIcon}
                />
              </TouchableOpacity>
            </View>

            <InputField
              label="Your name"
              value={displayName}
              onChangeText={setDisplayName}
              containerStyle={profileStyles.infoGroup}
              labelStyle={{color: profileStyles.label.color}}
              inputStyle={profileStyles.valueInput}
            />

            <InputField
              label="Your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              containerStyle={profileStyles.infoGroup}
              labelStyle={{color: profileStyles.label.color}}
              inputStyle={profileStyles.valueInput}
            />

            <InputField
              label="Your status"
              value={status}
              onChangeText={setStatus}
              containerStyle={profileStyles.infoGroup}
              labelStyle={{color: profileStyles.label.color}}
              inputStyle={profileStyles.valueInput}
            />

            <UpdateButton
              onPress={handleUpdateProfile}
              text="Update Profile"
              loading={updating}
            />
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default Profile;
