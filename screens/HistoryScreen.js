import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import TreinoHistoryCard from '../components/TreinoHistoryCard';

export default function HistoryScreen({ navigation, userWorkouts }) {
  const [treinos, setTreinos] = useState([]);

  useEffect(() => {
    const carregarTreinos = () => {
      const datas = Object.keys(userWorkouts);
      
      const datasOrdenadas = datas.sort((a, b) => new Date(b) - new Date(a));

      const listaFormatada = datasOrdenadas.map((data) => ({
        id: data,
        date: data,
        exercicios: userWorkouts[data],
      }));

      setTreinos(listaFormatada);
    };

    carregarTreinos();
  }, [userWorkouts]);

  const handlePressTreino = (treino) => {
    navigation.navigate('WorkoutDetail', {
      date: treino.date,
      exercicios: treino.exercicios,
    });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Histórico de Treinos</Text>
        <FlatList
          data={treinos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TreinoHistoryCard
              date={item.date}
              exercicios={item.exercicios}
              onPress={() => handlePressTreino(item)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum treino registrado ainda.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 20,
    textAlign: 'center',
  },
});