import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform, // Importante para verificar se é Web ou Mobile
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const formatarDataHeader = (dataStr) => {
  if (!dataStr) return '';
  const data = new Date(dataStr + 'T00:00:00');
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Intl.DateTimeFormat('pt-BR', options).format(data);
};

export default function WorkoutDetailScreen({ route, navigation, onDelete }) {
  const { date, exercicios } = route.params;

  useLayoutEffect(() => {
    const executarExclusao = () => {
      if (onDelete) {
        console.log('Excluindo treino de:', date);
        onDelete(date);
        navigation.goBack();
      } else {
        console.error('ERRO: Função onDelete não foi recebida!');
      }
    };

    const handlePressDelete = () => {
      // Lógica específica para WEB (Navegador)
      if (Platform.OS === 'web') {
        const confirmado = window.confirm(
          'Tem certeza que deseja apagar todo o treino deste dia?'
        );
        if (confirmado) {
          executarExclusao();
        }
      } 
      // Lógica para MOBILE (Android/iOS)
      else {
        Alert.alert(
          'Excluir Treino',
          'Tem certeza que deseja apagar todo o treino deste dia?',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Excluir',
              style: 'destructive',
              onPress: executarExclusao,
            },
          ]
        );
      }
    };

    if (date) {
      navigation.setOptions({
        title: `Treino de ${formatarDataHeader(date)}`,
        headerRight: () => (
          <TouchableOpacity
            onPress={handlePressDelete}
            style={{ marginRight: 15, padding: 5 }}> 
            {/* Adicionei padding para facilitar o toque */}
            <Ionicons name="trash-outline" size={24} color={colors.error} />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, date, onDelete]);

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
        ListFooterComponent={<View style={{ height: 20 }} />}
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