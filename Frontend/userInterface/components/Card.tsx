import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';

const Card = ({ title, description, buttonLabel }) => (
  <ThemedView style={styles.card}>
    <ThemedText type="defaultSemiBold" style={styles.cardTitle}>{title}</ThemedText>
    <ThemedText type="default" style={styles.cardDescription}>{description}</ThemedText>
    <TouchableOpacity style={styles.cardButton}>
      <ThemedText type="defaultSemiBold" style={styles.cardButtonText}>{buttonLabel}</ThemedText>
    </TouchableOpacity>
  </ThemedView>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#f5f5f5', padding: 20, borderRadius: 10, marginVertical: 10 },
  cardTitle: { fontSize: 18, marginBottom: 5 },
  cardDescription: { fontSize: 14, color: 'gray', marginBottom: 10 },
  cardButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, alignItems: 'center' },
  cardButtonText: { color: 'white', fontSize: 16 }
});

export default Card;