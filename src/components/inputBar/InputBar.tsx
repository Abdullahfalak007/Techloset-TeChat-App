import React from 'react';
import {View, TextInput, TouchableOpacity, Image} from 'react-native';
import {ICONS} from '../../constants/icons';
import {inputBarStyles as styles} from '../../styles/inputBarStyle';
import {InputBarProps} from '../../constants/types';

const InputBar: React.FC<InputBarProps> = ({
  inputText,
  setInputText,
  handleSend,
  handleAttach,
  handleCamera,
}) => {
  return (
    <View style={styles.inputBar}>
      <TouchableOpacity style={styles.iconOutside} onPress={handleAttach}>
        <Image source={ICONS.paperclip} style={styles.iconOutsideImage} />
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Write your message"
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendIconWrapper} onPress={handleSend}>
          <Image source={ICONS.send} style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.iconOutside} onPress={handleCamera}>
        <Image source={ICONS.camera} style={styles.iconOutsideImage} />
      </TouchableOpacity>
    </View>
  );
};

export default InputBar;
