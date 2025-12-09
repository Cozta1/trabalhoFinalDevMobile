import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt-br';

const API_URL = 'https://dummyjson.com/quotes/random';

export default function HomeScreen({ navigation, userWorkouts }) {
  const [citacao, setCitacao] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitacao = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setCitacao({ texto: data.quote, autor: data.author });
      } catch (err) {
        setCitacao(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCitacao();
  }, []);

  const markedDates = useMemo(() => {
    const marks = {};
    if (userWorkouts) {
      Object.keys(userWorkouts).forEach((data) => {
        marks[data] = { marked: true, dotColor: colors.primary };
      });
    }
    return marks;
  }, [userWorkouts]);

  const stats = useMemo(() => {
    const totalTreinos = userWorkouts ? Object.keys(userWorkouts).length : 0;
    return { totalTreinos };
  }, [userWorkouts]);

  const handleDayPress = (day) => {
    if (userWorkouts && userWorkouts[day.dateString]) {
      navigation.navigate('WorkoutDetail', {
        date: day.dateString,
        exercicios: userWorkouts[day.dateString],
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Home</Text>

        <Text style={styles.subtitle}>Motivação do Dia</Text>
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : citacao ? (
          <View style={styles.card}>
            <Text style={styles.quoteText}>"{citacao.texto}"</Text>
            <Text style={styles.authorText}>- {citacao.autor}</Text>
          </View>
        ) : null}

        <Text style={styles.subtitle}>Seu Progresso</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalTreinos}</Text>
            <Text style={styles.statLabel}>Treinos Totais</Text>
          </View>
        </View>

        <Calendar
          style={styles.calendar}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          theme={{
            backgroundColor: colors.background,
            calendarBackground: colors.card,
            textSectionTitleColor: colors.textSecondary,
            selectedDayBackgroundColor: colors.primary,
            selectedDayTextColor: '#ffffff',
            todayTextColor: colors.primary,
            dayTextColor: colors.text,
            textDisabledColor: '#444',
            dotColor: colors.primary,
            arrowColor: colors.primary,
            monthTextColor: colors.text,
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('LogWorkout')}>
        <Ionicons name="add" size={32} color={colors.background} />
      </TouchableOpacity>
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
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
    paddingTop: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 8,
    minHeight: 80,
    justifyContent: 'center',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.text,
    textAlign: 'center',
  },
  authorText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  statCard: {
    backgroundColor: colors.card,
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  calendar: {
    borderRadius: 8,
    paddingBottom: 10,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});