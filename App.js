import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchExercises } from './services/wger';
import { colors } from './constants/colors';

export default function App() {
  const [exercicios, setExercicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      const dados = await fetchExercises();
      setExercicios(dados);
      setLoading(false);
    }
    carregarDados();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.text}>Testando conexão com WGER...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teste de API (WGER)</Text>
      <Text style={styles.subtitle}>Se você vê a lista abaixo, funcionou:</Text>
      
      <FlatList
        data={exercicios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.nome}</Text>
            <Text style={styles.itemGroup}>{item.grupo}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.text,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  item: {
    backgroundColor: colors.card,
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  itemTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemGroup: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});