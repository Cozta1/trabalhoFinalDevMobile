import React, { useLayoutEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { LineChart } from 'react-native-chart-kit';

const formatarDataLabel = (dateStr) => {
  const [ano, mes, dia] = dateStr.split('-');
  return `${dia}/${mes}`;
};

export default function ProgressionChartScreen({
  route,
  navigation,
  userWorkouts,
}) {
  const { exerciseName } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: exerciseName || 'Progresso',
    });
  }, [navigation, exerciseName]);

  const chartData = useMemo(() => {
    if (!userWorkouts) return null;

    const dataPoints = [];
    const datasOrdenadas = Object.keys(userWorkouts).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    datasOrdenadas.forEach((data) => {
      const treinosDoDia = userWorkouts[data];
      const exercicioFeito = treinosDoDia.find(
        (ex) => ex.nome === exerciseName
      );

      if (exercicioFeito && exercicioFeito.series) {
        const maxPeso = Math.max(
          ...exercicioFeito.series.map((s) => parseFloat(s.peso) || 0)
        );

        if (maxPeso > 0) {
          dataPoints.push({
            label: formatarDataLabel(data),
            value: maxPeso,
          });
        }
      }
    });

    if (dataPoints.length < 2) return null;

    return {
      labels: dataPoints.map((p) => p.label),
      datasets: [
        {
          data: dataPoints.map((p) => p.value),
        },
      ],
    };
  }, [exerciseName, userWorkouts]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{exerciseName}</Text>
        <Text style={styles.subtitle}>Evolução de Carga (Kg)</Text>

        {chartData ? (
          <View style={styles.chartWrapper}>
            <LineChart
              data={chartData}
              width={Dimensions.get('window').width - 32}
              height={220}
              yAxisSuffix="kg"
              yAxisInterval={1}
              chartConfig={{
                backgroundColor: colors.card,
                backgroundGradientFrom: colors.card,
                backgroundGradientTo: colors.card,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(187, 134, 252, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: colors.background,
                },
              }}
              bezier
              style={styles.chart}
            />
            <Text style={styles.tipText}>
              * Gráfico baseado na maior carga levantada em cada treino.
            </Text>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Dados insuficientes para gerar o gráfico.
            </Text>
            <Text style={styles.emptySubText}>
              Registre este exercício em pelo menos 2 dias diferentes para ver sua evolução.
            </Text>
          </View>
        )}
      </ScrollView>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  chartWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  tipText: {
    marginTop: 10,
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  emptyContainer: {
    backgroundColor: colors.card,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});