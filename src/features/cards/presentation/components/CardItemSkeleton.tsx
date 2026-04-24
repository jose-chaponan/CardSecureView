import React, { FC, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const CardItemSkeleton: FC = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={styles.cardHeader} />
      <View style={styles.body}>
        <View style={styles.linePan} />
        <View style={styles.metaRow}>
          <View style={styles.lineShort} />
          <View style={styles.lineShort} />
        </View>
        <View style={styles.button} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardHeader: {
    height: 60,
    backgroundColor: '#D1D1D6',
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  linePan: {
    height: 20,
    borderRadius: 6,
    backgroundColor: '#D1D1D6',
    width: '75%',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 4,
  },
  lineShort: {
    height: 14,
    borderRadius: 6,
    backgroundColor: '#D1D1D6',
    width: 80,
  },
  button: {
    height: 40,
    borderRadius: 10,
    backgroundColor: '#D1D1D6',
  },
});

export default CardItemSkeleton;
