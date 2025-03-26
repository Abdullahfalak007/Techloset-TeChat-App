import React, {FC, useRef, useEffect} from 'react';
import {Animated, View, ViewStyle} from 'react-native';
import {IMAGES} from '../../constants/icons';
import {loaderStyle} from '../../styles/loaderStyle';
import {LoaderProps} from '../../constants/types';

const Loader: FC<LoaderProps> = ({style}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[loaderStyle.loaderContainer, style]}>
      <Animated.Image
        source={IMAGES.loader}
        style={[loaderStyle.loaderImage, {transform: [{rotate: spin}]}]}
        resizeMode="contain"
      />
    </View>
  );
};

export default Loader;
