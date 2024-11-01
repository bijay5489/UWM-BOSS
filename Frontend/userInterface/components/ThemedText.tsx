import React from 'react';
import { Text, type TextProps, StyleSheet } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle'; // make `type` optional
};

const ThemedText: React.FC<ThemedTextProps> = ({ type = 'default', style, children }) => {
  return (
    <Text style={[styles[type], style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: 'bold', color: '#000' },
  subtitle: { fontSize: 20, color: '#666' },
  defaultSemiBold: { fontSize: 16, fontWeight: '600', color: '#000' },
  default: { fontSize: 14, color: '#000' }
});

export default ThemedText;