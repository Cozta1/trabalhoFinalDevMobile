import React, { useState } from 'react';
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
  navigation,
  exerciseListFlat,
  onSave,
}) {
  const [exercicios, setExercicios] = useState([]);

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

  const showAlert = (titulo, mensagem, onOk) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}\n${mensagem}`);
      if (onOk) onOk();
    } else {
      Alert.alert(titulo, mensagem, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
    }
  };

  const handleSalvarTreino = () => {
    const exerciciosInvalidos = exercicios.filter((ex) => !ex.nome);
    
    if (exercicios.length === 0) {
      showAlert('Erro', 'Adicione pelo menos um exercício para salvar.');
      return;
    }
    if (exerciciosInvalidos.length > 0) {
      showAlert('Erro', 'Selecione um nome para todos os exercícios.');
      return;
    }

    if (onSave) {
      onSave(exercicios);
      showAlert('Sucesso!', 'Treino salvo e atualizado!', () => navigation.goBack());
    } else {
      console.error("ERRO CRÍTICO: Função 'onSave' não foi recebida. Verifique o App.js!");
      showAlert('Erro Técnico', 'Não foi possível salvar (Função onSave ausente).');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.safeContainer}>
      <SafeAreaView style={styles.safeContainer}>
        <FlatList
          style={styles.container}
          data={exercicios}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={styles.headerTitle}>
              <Text style={styles.title}>Registrar Treino</Text>
              <Text style={styles.dateText}>
                Data: {new Date().toLocaleDateString('pt-BR')}
              </Text>
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
            title="Salvar Treino"
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
  headerTitle: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  dateText: {
    fontSize: 16,
    color: colors.textSecondary,
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
  },
});