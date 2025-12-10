import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ userName, onSaveName, onResetData }) {
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    if (userName) setNameInput(userName);
  }, [userName]);

  const handleSave = () => {
    if (nameInput.trim() === '') {
      Alert.alert('Atenção', 'Por favor, digite um nome válido.');
      return;
    }
    onSaveName(nameInput);
    Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
  };

  const handleReset = () => {
    Alert.alert(
      'Cuidado! ⚠️',
      'Isso apagará TODOS os seus treinos e configurações permanentemente. Tem certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Apagar Tudo', 
          style: 'destructive', 
          onPress: onResetData 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          
          <Text style={styles.title}>Perfil</Text>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Seus Dados</Text>
            <Text style={styles.label}>Como gostaria de ser chamado?</Text>
            
            <TextInput
              style={styles.input}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Digite seu nome ou apelido"
              placeholderTextColor={colors.textSecondary}
              maxLength={20}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, styles.dangerZone]}>
            <View style={styles.dangerHeader}>
              <Ionicons name="warning-outline" size={24} color={colors.error} />
              <Text style={[styles.sectionTitle, { color: colors.error, marginLeft: 8 }]}>
                Zona de Perigo
              </Text>
            </View>
            
            <Text style={styles.dangerText}>
              Deseja recomeçar do zero? Isso apagará todo o seu histórico de treinos.
            </Text>

            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Ionicons name="trash-bin-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.resetButtonText}>Resetar App</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dangerZone: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dangerText: {
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: colors.error,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});