import React from 'react';
import { View, StyleSheet } from 'react-native';

const ThemedView = ({ style, children }) => {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff', // This can switch based on theme
    flex: 1
  }
});

export default ThemedView;