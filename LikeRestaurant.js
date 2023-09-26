import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Velkommen til</Text>
        <Text style={styles.appName}>RestoFinder</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.description}>
          Find de bedste restauranter i Danmark!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6D55C', // Baggrundsfarve
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3A86FF', // Overskriftsfarve
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#EF476F', // App-navn farve
    marginTop: 10,
  },
  content: {
    marginTop: 20,
  },
  description: {
    fontSize: 18,
    color: '#333', // Tekstfarve
    textAlign: 'center',
  },
});

export default HomeScreen;


