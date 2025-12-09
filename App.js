import 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './constants/colors';

import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import ExerciseScreen from './screens/ExerciseScreen';
import LogWorkoutScreen from './screens/LogWorkoutScreen';
import WorkoutDetailScreen from './screens/WorkoutDetailScreen';
import ProgressionChartScreen from './screens/ProgressionChartScreen';

import { fetchExercises } from './data/mockApiExercicios';
import { mockTreinos } from './data/mockTreinos';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator({ exerciseList, userWorkouts }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Histórico') iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          else if (route.name === 'Biblioteca') iconName = focused ? 'book' : 'book-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.card,
        },
      })}>
      <Tab.Screen name="Home">
        {(props) => <HomeScreen {...props} userWorkouts={userWorkouts} />}
      </Tab.Screen>
      <Tab.Screen name="Histórico">
        {(props) => <HistoryScreen {...props} userWorkouts={userWorkouts} />}
      </Tab.Screen>
      <Tab.Screen name="Biblioteca">
        {(props) => <ExerciseScreen {...props} exerciseList={exerciseList} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [exerciseList, setExerciseList] = useState([]);
  const [exerciseListFlat, setExerciseListFlat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userWorkouts, setUserWorkouts] = useState(mockTreinos);

  const handleSaveWorkout = (newExercises) => {
    const today = new Date().toISOString().split('T')[0]; 
    
    setUserWorkouts((prevWorkouts) => {
      const updatedWorkouts = { ...prevWorkouts };
      
      if (updatedWorkouts[today]) {
        updatedWorkouts[today] = [...updatedWorkouts[today], ...newExercises];
      } else {
        updatedWorkouts[today] = newExercises;
      }
      return updatedWorkouts;
    });
  };

  const handleDeleteWorkout = useCallback((dateToDelete) => {
    setUserWorkouts((prevWorkouts) => {
      const updatedWorkouts = { ...prevWorkouts };
      if (updatedWorkouts[dateToDelete]) {
        delete updatedWorkouts[dateToDelete];
      }
      return updatedWorkouts;
    });
  }, []);

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        const dadosApi = await fetchExercises();
    
        setExerciseListFlat(dadosApi);

        const agrupados = dadosApi.reduce((acc, ex) => {
          const grupo = ex.grupo || 'Outros';
          if (!acc[grupo]) acc[grupo] = [];
          acc[grupo].push(ex);
          return acc;
        }, {});

        const listaAgrupada = Object.keys(agrupados)
          .map((grupoNome) => ({
            grupo: grupoNome,
            exercicios: agrupados[grupoNome],
          }))
          .sort((a, b) => a.grupo.localeCompare(b.grupo));

        setExerciseList(listaAgrupada);
      } catch (error) {
        console.error("Erro ao preparar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarDadosIniciais();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={DarkTheme}>
        <Stack.Navigator>
          <Stack.Screen name="Main" options={{ headerShown: false }}>
            {(props) => (
              <TabNavigator
                {...props}
                exerciseList={exerciseList}
                userWorkouts={userWorkouts}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="WorkoutDetail"
            options={{ title: 'Detalhes do Treino' }}>
            {(props) => (
              <WorkoutDetailScreen {...props} onDelete={handleDeleteWorkout} />
            )}
          </Stack.Screen>

          <Stack.Screen name="ProgressionChart" component={ProgressionChartScreen} />

          <Stack.Screen
            name="LogWorkout"
            options={{
              title: 'Registrar Treino do Dia',
              presentation: 'modal',
            }}>
            {(props) => (
              <LogWorkoutScreen
                {...props}
                exerciseListFlat={exerciseListFlat}
                onSave={handleSaveWorkout}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}