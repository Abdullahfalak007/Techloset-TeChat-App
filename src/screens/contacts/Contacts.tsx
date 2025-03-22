// import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SectionList,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import {useContacts} from './useContacts';
import {contactsStyles} from '../../styles/contactsStyle';
import GradientHeader from '../../components/gradientHeader/GradientHeader';
import {ICONS} from '../../constants/icons';
import {COLORS} from '../../constants/colors';

const Contacts: React.FC = () => {
  const {
    loading,
    sections,
    searchTerm,
    setSearchTerm,
    showSearchInput,
    handleSearchPress,
    showAddButtons,
    handleAddPress,
    handleAddContact,
    dismissKeyboard,
  } = useContacts();

  const renderContactItem = ({item}: {item: any}) => {
    const avatarSource = item.base64Photo
      ? {uri: item.base64Photo}
      : item.photoURL
      ? {uri: item.photoURL}
      : ICONS.avatar;

    return (
      <View style={contactsStyles.contactRow}>
        <View style={contactsStyles.leftContainer}>
          <Image source={avatarSource} style={contactsStyles.avatar} />
          <View style={contactsStyles.textContainer}>
            <Text style={contactsStyles.name}>
              {item.displayName || item.email}
            </Text>
            <Text style={contactsStyles.subtitle}>{item.status}</Text>
          </View>
        </View>
        {showAddButtons && (
          <TouchableOpacity
            onPress={() => handleAddContact(item.uid)}
            style={contactsStyles.addButtonContainer}>
            <Image source={ICONS.addContact} style={contactsStyles.addIcon} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderSectionHeader = ({section}: any) => (
    <Text style={contactsStyles.sectionHeader}>{section.title}</Text>
  );

  if (loading) {
    return (
      <View style={contactsStyles.centered}>
        <ActivityIndicator size="large" color={COLORS.black} />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={{flex: 1}}>
        <GradientHeader
          title="Contacts"
          isContactsScreen
          searchActive={showSearchInput}
          searchValue={searchTerm}
          onChangeSearch={setSearchTerm}
          onSearchPress={handleSearchPress}
          onAddPress={handleAddPress}
        />

        <View style={contactsStyles.roundedContainer}>
          {sections.length === 0 ? (
            <Text>No other users found or all are in your chat list.</Text>
          ) : (
            <SectionList
              sections={sections}
              keyExtractor={item => item.uid}
              renderItem={renderContactItem}
              renderSectionHeader={renderSectionHeader}
              ListHeaderComponent={() => (
                <Text style={contactsStyles.myContactLabel}>My Contact</Text>
              )}
              stickySectionHeadersEnabled={false}
            />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Contacts;
