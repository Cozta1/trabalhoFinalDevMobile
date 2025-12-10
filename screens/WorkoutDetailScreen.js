import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const formatarDataHeader = (dataStr) => {
  const data = new Date(dataStr + 'T00:00:00');
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Intl.DateTimeFormat('pt-BR', options).format(data);
};

export default function WorkoutDetailScreen({ route, navigation, onDelete }) {
  const { date, exercicios } = route.params;

  useLayoutEffect(() => {
    const handlePressDelete = () => {
      Alert.alert(
        'Excluir Treino',
        'Tem certeza que deseja apagar todo o treino deste dia?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: () => {
              if (onDelete) {
                onDelete(date);
                navigation.goBack();
              }
            },
          },
        ]
      );
    };

    const handlePressEdit = () => {
      navigation.navigate('LogWorkout', {
        initialExercises: exercicios,
        dateToEdit: date,
        isEditing: true,
      });
    };

    if (date) {
      navigation.setOptions({
        title: `${formatarDataHeader(date)}`,
        headerRight: () => (
          <View style={{ flexDirection: 'row', marginRight: 15 }}>
            <TouchableOpacity onPress={handlePressEdit} style={{ marginRight: 20 }}>
              <Ionicons name="pencil" size={24} color={colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handlePressDelete}>
              <Ionicons name="trash-outline" size={24} color={colors.error} />
            </TouchableOpacity>
          </View>
        ),
      });
    }
  }, [navigation, date, onDelete, exercicios]);

  const renderExercicio = ({ item: exercicio }) => (
    <View style={styles.card}>
      <Text style={styles.exercicioNome}>{exercicio.nome}</Text>
      {exercicio.series.map((serie, index) => (
        <View key={serie.id} style={styles.serieRow}>
          <Text style={styles.serieText}>Série {index + 1}</Text>
          <Text style={styles.serieText}>{serie.reps} reps</Text>
          <Text style={styles.serieText}>{serie.peso} kg</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <FlatList
        style={styles.container}
        data={exercicios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExercicio}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 16 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  exercicioNome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
    paddingBottom: 10,
  },
  serieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  serieText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});