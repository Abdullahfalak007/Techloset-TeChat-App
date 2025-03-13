import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {loginStyle} from '../../styles/loginStyle';

const Login: React.FC = () => {
  return (
    <View style={loginStyle.container}>
      <Text style={loginStyle.title}>Login Screen</Text>
      <TouchableOpacity
        style={loginStyle.button}
        onPress={() => console.log('Login pressed')}>
        <Text style={loginStyle.buttonText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
