import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function ExercicioFormCard({
  exercicio,
  onExercicioChange,
  onSerieChange,
  onAddSerie,
  onRemoveSerie,
  onRemoveExercicio,
  exerciseListFlat,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = useMemo(() => {
    if (!searchQuery) return exerciseListFlat;
    return exerciseListFlat.filter((ex) =>
      ex.nome.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [exerciseListFlat, searchQuery]);

  const handleSelect = (nome) => {
    onExercicioChange(exercicio.id, nome);
    setModalVisible(false);
    setSearchQuery('');
  };

  const handleSerieChange = (index, campo, valor) => {
    const novasSeries = [...exercicio.series];
    novasSeries[index][campo] = valor;
    onSerieChange(exercicio.id, novasSeries);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => setModalVisible(true)}>
          <Text
            style={[
              styles.selectorText,
              !exercicio.nome && styles.placeholderText,
            ]}>
            {exercicio.nome || 'Selecione ou pesquise...'}
          </Text>
          <Ionicons name="caret-down" size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onRemoveExercicio(exercicio.id)}
          style={styles.trashBtn}>
          <Ionicons name="trash-bin-outline" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.searchContainer}>
                <Ionicons
                  name="search"
                  size={20}
                  color={colors.textSecondary}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Pesquisar exercício..."
                  placeholderTextColor={colors.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus={true}
                />
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>Fechar</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={filteredExercises}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelect(item.nome)}>
                  <Text style={styles.modalItemText}>{item.nome}</Text>
                  <Text style={styles.modalItemSub}>{item.grupo}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyListText}>
                  Nenhum exercício encontrado.
                </Text>
              }
            />
          </View>
        </SafeAreaView>
      </Modal>

      <View style={styles.serieHeader}>
        <Text style={styles.headerText}>Série</Text>
        <Text style={styles.headerText}>Reps</Text>
        <Text style={styles.headerText}>Peso (kg)</Text>
        <View style={styles.removeIconPlaceholder} />
      </View>
      
      {exercicio.series.map((serie, index) => (
        <View key={serie.id} style={styles.serieRow}>
          <Text style={styles.serieText}>{index + 1}</Text>
          <TextInput
            style={styles.serieInput}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={colors.textSecondary}
            value={serie.reps}
            onChangeText={(text) => handleSerieChange(index, 'reps', text)}
          />
          <TextInput
            style={styles.serieInput}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.textSecondary}
            value={serie.peso}
            onChangeText={(text) => handleSerieChange(index, 'peso', text)}
          />
          <TouchableOpacity
            onPress={() => onRemoveSerie(exercicio.id, serie.id)}>
            <Ionicons
              name="remove-circle-outline"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addSerieButton}
        onPress={() => onAddSerie(exercicio.id)}>
        <Ionicons name="add" size={20} color={colors.primary} />
        <Text style={styles.addSerieText}>Adicionar Série</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
    paddingBottom: 10,
  },
  selectorButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 6,
    marginRight: 10,
  },
  selectorText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  placeholderText: {
    color: colors.textSecondary,
    fontWeight: 'normal',
  },
  trashBtn: {
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    paddingVertical: 12,
    fontSize: 16,
  },
  closeText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },
  modalItemText: {
    color: colors.text,
    fontSize: 18,
  },
  modalItemSub: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  emptyListText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  serieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 5,
  },
  headerText: {
    color: colors.textSecondary,
    fontSize: 14,
    width: '25%',
    textAlign: 'center',
  },
  serieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  serieText: {
    color: colors.text,
    fontSize: 16,
    width: '25%',
    textAlign: 'center',
  },
  serieInput: {
    backgroundColor: colors.background,
    color: colors.text,
    borderRadius: 5,
    padding: 8,
    width: '25%',
    textAlign: 'center',
    fontSize: 16,
  },
  removeIconPlaceholder: {
    width: '25%',
    alignItems: 'center',
  },
  addSerieButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.background,
    borderRadius: 5,
  },
  addSerieText: {
    color: colors.primary,
    fontSize: 16,
    marginLeft: 5,
  },
});