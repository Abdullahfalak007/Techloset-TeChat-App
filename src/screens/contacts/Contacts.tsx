import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  SectionList,
  ScrollView,
} from 'react-native';
import {useContacts} from './useContacts';
import {contactsStyles} from '../../styles/contactsStyle';
import GradientHeader from '../../components/gradientHeader/GradientHeader';
import {COLORS} from '../../constants/colors';
import ContactItem from '../../components/contactItem/ContactItem';
import {Contact} from '../../constants/types';

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
    addingContacts,
  } = useContacts();

  const renderContactItem = ({item}: {item: Contact}) => {
    const isAdding = addingContacts.has(item.uid);
    return (
      <ContactItem
        contact={item}
        showAddButton={showAddButtons}
        isAdding={isAdding}
        onAddPress={handleAddContact}
      />
    );
  };

  const renderSectionHeader = ({section}: {section: any}) => (
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
    <SafeAreaView style={{flex: 1}}>
      <GradientHeader
        title="Contacts"
        isContactsScreen
        searchActive={showSearchInput}
        searchValue={searchTerm}
        onChangeSearch={setSearchTerm}
        onSearchPress={handleSearchPress}
        onAddPress={handleAddPress}
      />
      <ScrollView style={[contactsStyles.roundedContainer, {flex: 1}]}>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Contacts;
