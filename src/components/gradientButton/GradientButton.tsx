// import React from 'react';
// import {
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   ViewStyle,
//   TextStyle,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import {COLORS} from '../../constants/colors';

// interface GradientButtonProps {
//   onPress: () => void;
//   text: string;
//   containerStyle?: ViewStyle;
//   textStyle?: TextStyle;
// }

// const GradientButton: React.FC<GradientButtonProps> = ({
//   onPress,
//   text,
//   containerStyle,
//   textStyle,
// }) => {
//   return (
//     <LinearGradient
//       colors={['#4156a5', '#010203']}
//       start={{x: 1, y: 0}}
//       end={{x: 0, y: 0}}
//       style={[styles.gradientButton, containerStyle]}>
//       <TouchableOpacity onPress={onPress}>
//         <Text style={[styles.buttonText, textStyle]}>{text}</Text>
//       </TouchableOpacity>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   gradientButton: {
//     borderRadius: 16,
//     paddingVertical: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default GradientButton;

// src/components/gradientButton/GradientButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../../constants/colors';

interface GradientButtonProps {
  onPress: () => void;
  text: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  colors?: string[];
}

const GradientButton: React.FC<GradientButtonProps> = ({
  onPress,
  text,
  containerStyle,
  textStyle,
  colors = ['#4156a5', '#010203'],
}) => {
  return (
    <LinearGradient
      colors={colors}
      start={{x: 1, y: 0}}
      end={{x: 0, y: 0}}
      style={[styles.gradientButton, containerStyle]}>
      <TouchableOpacity onPress={onPress}>
        <Text style={[styles.buttonText, textStyle]}>{text}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GradientButton;
