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

import WeatherWidget from '../components/WeatherWidget';

const QUOTES_API_URL = 'https://raw.githubusercontent.com/devmatheusguerra/frasesJSON/master/frases.json';

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt-br';

export default function HomeScreen({ navigation, userWorkouts }) {
  const [citacao, setCitacao] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(true);

  useEffect(() => {
    const fetchCitacao = async () => {
      try {
        setLoadingQuote(true);
        const response = await fetch(QUOTES_API_URL);
        const data = await response.json();
        
        if (data && data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          const item = data[randomIndex];
          setCitacao({ texto: item.frase, autor: item.autor });
        }
      } catch (err) {
        setCitacao({ 
          texto: "O único treino ruim é aquele que não aconteceu.", 
          autor: "Desconhecido" 
        });
      } finally {
        setLoadingQuote(false);
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
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const datasComTreino = userWorkouts ? Object.keys(userWorkouts) : [];
    let daysTrainedThisMonth = 0;

    datasComTreino.forEach((dateStr) => {
      const [year, month] = dateStr.split('-');
      if (parseInt(year) === currentYear && parseInt(month) - 1 === currentMonth) {
        daysTrainedThisMonth++;
      }
    });

    const percentage = totalDaysInMonth > 0 
      ? Math.round((daysTrainedThisMonth / totalDaysInMonth) * 100) 
      : 0;

    return { 
      daysTrained: daysTrainedThisMonth, 
      percentage,
      monthName: LocaleConfig.locales['pt-br'].monthNames[currentMonth]
    };
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
        
        <View style={styles.headerRow}>
            <Text style={styles.title}>Home</Text>
            <WeatherWidget />
        </View>

        <Text style={styles.subtitle}>Motivação do Dia</Text>
        {loadingQuote ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
        ) : citacao ? (
          <View style={styles.card}>
            <Text style={styles.quoteText}>"{citacao.texto}"</Text>
            <Text style={styles.authorText}>- {citacao.autor}</Text>
          </View>
        ) : null}

        <View style={styles.sectionHeader}>
            <Text style={styles.subtitle}>Seu Progresso</Text>
            <Text style={styles.monthLabel}>{stats.monthName}</Text>
        </View>
      
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.daysTrained}</Text>
            <Text style={styles.statLabel}>Dias Treinados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.percentage}%</Text>
            <Text style={styles.statLabel}>Frequência</Text>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 20,
    marginBottom: 10,
  },
  monthLabel: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
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
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statCard: {
    backgroundColor: colors.card,
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textTransform: 'uppercase',
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