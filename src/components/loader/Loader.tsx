import React, {useRef, useEffect} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {IMAGES} from '../../constants/icons';

const Loader: React.FC = () => {
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
    <View style={styles.loaderContainer}>
      <Animated.Image
        source={IMAGES.loader}
        style={[styles.loaderImage, {transform: [{rotate: spin}]}]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  loaderImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
});

export default Loader;
