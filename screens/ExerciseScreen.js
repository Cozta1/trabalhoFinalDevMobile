import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function ExerciseScreen({ navigation, exerciseList, loading }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredList = useMemo(() => {
    if (!searchQuery) return exerciseList;
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    
    return exerciseList
      .map((group) => {
        const filteredExercises = group.exercicios.filter((ex) =>
          ex.nome.toLowerCase().includes(lowerCaseQuery)
        );
        return { ...group, exercicios: filteredExercises };
      })
      .filter((group) => group.exercicios.length > 0);
  }, [exerciseList, searchQuery]);

  const handlePressExercicio = (exercicio) => {
    navigation.navigate('ProgressionChart', {
      exerciseName: exercicio.nome,
    });
  };

  const renderExercicio = (exercicio) => (
    <TouchableOpacity
      key={exercicio.id}
      style={styles.exercicioItem}
      onPress={() => handlePressExercicio(exercicio)}>
      <View style={styles.exercicioInfo}>
        <Ionicons
          name="barbell-outline"
          size={16}
          color={colors.textSecondary}
        />
        <Text style={styles.exercicioText}>{exercicio.nome}</Text>
      </View>
      <Ionicons
        name="stats-chart-outline"
        size={20}
        color={colors.textSecondary}
      />
    </TouchableOpacity>
  );

  const renderGrupoCard = ({ item: grupo }) => (
    <View style={styles.card}>
      <Text style={styles.grupoTitle}>{grupo.grupo}</Text>
      {grupo.exercicios.map(renderExercicio)}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <FlatList
        style={styles.container}
        data={filteredList}
        keyExtractor={(item) => item.grupo}
        renderItem={renderGrupoCard}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Biblioteca de Exercícios</Text>
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color={colors.textSecondary}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar um exercício..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum exercício encontrado para "{searchQuery}"
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  grupoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  exercicioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  exercicioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exercicioText: {
    color: colors.text,
    fontSize: 16,
    marginLeft: 10,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});