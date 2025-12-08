import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function ExerciseScreen({ exerciseList }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biblioteca de Exercícios</Text>
      <Text style={styles.text}>
        {exerciseList?.length || 0} exercícios carregados da API WGER
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});