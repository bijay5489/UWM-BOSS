import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';
import { Ionicons } from '@expo/vector-icons';

// @ts-ignore
const Card = ({ title, description, buttonLabel, onPress, iconName }) => (
  <ThemedView style={styles.card}>
    <View style={styles.header}>
      {iconName && <Ionicons name={iconName} size={24} style={styles.icon} />}
      <ThemedText type="defaultSemiBold" style={styles.cardTitle}>{title}</ThemedText>
    </View>
    <ThemedText type="default" style={styles.cardDescription}>{description}</ThemedText>
    {buttonLabel && onPress && (
      <TouchableOpacity style={styles.cardButton} onPress={onPress}>
        <ThemedText type="defaultSemiBold" style={styles.cardButtonText}>{buttonLabel}</ThemedText>
      </TouchableOpacity>
    )}
  </ThemedView>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#e3e3e3', padding: 20, borderRadius: 10, marginVertical: 10 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  icon: { marginRight: 10, color: '#007bff' },
  cardTitle: { fontSize: 18 },
  cardDescription: { fontSize: 14, color: 'gray', marginBottom: 10 },
  cardButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, alignItems: 'center' },
  cardButtonText: { color: 'white', fontSize: 16 },
});

export default Card;