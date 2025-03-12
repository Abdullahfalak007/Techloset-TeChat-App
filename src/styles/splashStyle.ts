// src/styles/splashStyle.ts
import {StyleSheet} from 'react-native';

export const splashStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23234C', // or a gradient if you prefer
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
