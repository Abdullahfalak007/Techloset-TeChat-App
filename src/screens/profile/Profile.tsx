import React from 'react';
import {View, Text, Image, TouchableOpacity, TextInput} from 'react-native';
import GradientHeader from '../../components/gradientHeader/GradientHeader';
import {useProfile} from './useProfile';
import {profileStyles} from '../../styles/profileStyle';
import {ICONS} from '../../constants/icons';

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
  } = useProfile();

  return (
    <View style={profileStyles.container}>
      {/* Gradient Header */}
      <GradientHeader
        title="Profile"
        isScreenWithBackArrow
        onBackPress={() => navigation.goBack()}
      />

      {/* Content Container */}
      <View style={profileStyles.contentContainer}>
        {/* Avatar with Edit Icon */}
        <View style={profileStyles.avatarContainer}>
          {user?.photoURL ? (
            <Image source={{uri: user.photoURL}} style={profileStyles.avatar} />
          ) : (
            <Image source={ICONS.avatar} style={profileStyles.avatar} />
          )}
          <TouchableOpacity
            style={profileStyles.editIconWrapper}
            onPress={handleEditAvatar}>
            <Image source={ICONS.edit} style={profileStyles.editIcon} />
          </TouchableOpacity>
        </View>

        {/* Name */}
        <View style={profileStyles.infoGroup}>
          <Text style={profileStyles.label}>Your name</Text>
          <TextInput
            style={profileStyles.valueInput}
            value={displayName}
            onChangeText={setDisplayName}
          />
        </View>

        {/* Email */}
        <View style={profileStyles.infoGroup}>
          <Text style={profileStyles.label}>Your email</Text>
          <TextInput
            style={profileStyles.valueInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        {/* Status */}
        <View style={profileStyles.infoGroup}>
          <Text style={profileStyles.label}>Your status</Text>
          <TextInput
            style={profileStyles.valueInput}
            value={status}
            onChangeText={setStatus}
          />
        </View>

        {/* Update Profile Button */}
        <TouchableOpacity
          style={profileStyles.updateButton}
          onPress={handleUpdateProfile}>
          <Text style={profileStyles.updateButtonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
