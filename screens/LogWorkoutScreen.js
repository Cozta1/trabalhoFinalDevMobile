import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import ExercicioFormCard from '../components/ExercicioFormCard';

export default function LogWorkoutScreen({
  route,
  navigation,
  exerciseListFlat,
  onSave,
}) {
  const { initialExercises, dateToEdit, isEditing } = route.params || {};

  const [exercicios, setExercicios] = useState([]);
  
  const [selectedDate, setSelectedDate] = useState(() => {
    if (isEditing && dateToEdit) {
      return new Date(dateToEdit + 'T00:00:00');
    }
    return new Date();
  });

  useEffect(() => {
    if (isEditing && initialExercises) {
      setExercicios(JSON.parse(JSON.stringify(initialExercises)));
    }
  }, [isEditing, initialExercises]);

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const formatDateForSave = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().split('T')[0];
  };

  const handleAddExercicio = () => {
    const novoExercicio = {
      id: Date.now().toString(),
      nome: null,
      series: [{ id: Date.now().toString() + '-s1', reps: '', peso: '' }],
    };
    setExercicios((prev) => [...prev, novoExercicio]);
  };

  const handleRemoveExercicio = (id) =>
    setExercicios((prev) => prev.filter((ex) => ex.id !== id));

  const handleExercicioChange = (id, nome) =>
    setExercicios((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, nome } : ex))
    );

  const handleAddSerie = (exercicioId) => {
    const novaSerie = { id: Date.now().toString(), reps: '', peso: '' };
    setExercicios((prev) =>
      prev.map((ex) =>
        ex.id === exercicioId
          ? { ...ex, series: [...ex.series, novaSerie] }
          : ex
      )
    );
  };

  const handleRemoveSerie = (exercicioId, serieId) => {
    setExercicios((prev) =>
      prev.map((ex) =>
        ex.id === exercicioId
          ? { ...ex, series: ex.series.filter((s) => s.id !== serieId) }
          : ex
      )
    );
  };

  const handleSerieChange = (exercicioId, novasSeries) => {
    setExercicios((prev) =>
      prev.map((ex) =>
        ex.id === exercicioId ? { ...ex, series: novasSeries } : ex
      )
    );
  };

  const handleSalvarTreino = () => {
    const exerciciosInvalidos = exercicios.filter((ex) => !ex.nome);
    if (exercicios.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um exercício para salvar.');
      return;
    }
    if (exerciciosInvalidos.length > 0) {
      Alert.alert('Erro', 'Selecione um nome para todos os exercícios.');
      return;
    }

    const dateToSave = formatDateForSave(selectedDate);
    
    onSave(exercicios, dateToSave, isEditing ? dateToEdit : null);

    Alert.alert('Sucesso!', `Treino salvo para o dia ${dateToSave.split('-').reverse().join('/')}!`);
    
    if (isEditing) {
        navigation.navigate('Main');
    } else {
        navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.safeContainer}>
      <SafeAreaView style={styles.safeContainer}>
        <FlatList
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 100 }}
          data={exercicios}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              <Text style={styles.label}>
                {isEditing ? 'Editar Data do Treino:' : 'Selecione a Data:'}
              </Text>
              
              <View style={styles.dateControl}>
                <TouchableOpacity onPress={() => changeDate(-1)} style={styles.arrowBtn}>
                  <Ionicons name="chevron-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                
                <Text style={styles.dateText}>
                  {formatDateForDisplay(selectedDate)}
                </Text>
                
                <TouchableOpacity onPress={() => changeDate(1)} style={styles.arrowBtn}>
                  <Ionicons name="chevron-forward" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <ExercicioFormCard
              exercicio={item}
              onExercicioChange={handleExercicioChange}
              onSerieChange={handleSerieChange}
              onAddSerie={handleAddSerie}
              onRemoveSerie={handleRemoveSerie}
              onRemoveExercicio={handleRemoveExercicio}
              exerciseListFlat={exerciseListFlat}
            />
          )}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddExercicio}>
              <Ionicons name="add-circle" size={24} color={colors.primary} />
              <Text style={styles.addButtonText}>Adicionar Exercício</Text>
            </TouchableOpacity>
          }
        />
        <View style={styles.footerButtons}>
          <Button
            title="Cancelar"
            onPress={() => navigation.goBack()}
            color={colors.textSecondary}
          />
          <Button
            title={isEditing ? "Atualizar" : "Salvar"}
            onPress={handleSalvarTreino}
            color={colors.primary}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  dateControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dateText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    minWidth: 120,
    textAlign: 'center',
  },
  arrowBtn: {
    padding: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.card,
    backgroundColor: colors.background,
  },
});