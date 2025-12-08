import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const formatarData = (dataStr) => {
  const [ano, mes, dia] = dataStr.split('-');
  return `${dia}/${mes}/${ano}`;
};

export default function TreinoHistoryCard({ date, exercicios, onPress }) {
  const resumo = exercicios
    .map((ex) => ex.nome)
    .slice(0, 2)
    .join(', ');

  const count = exercicios.length;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.infoContainer}>
        <Text style={styles.data}>{formatarData(date)}</Text>
        <Text style={styles.resumoTitle}>{count} exercícios</Text>
        <Text style={styles.resumoText} numberOfLines={1}>
          {resumo}{count > 2 ? '...' : ''}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  data: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resumoTitle: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  resumoText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
});