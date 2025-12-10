import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from './constants/colors';

import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import ExerciseScreen from './screens/ExerciseScreen';
import LogWorkoutScreen from './screens/LogWorkoutScreen';
import WorkoutDetailScreen from './screens/WorkoutDetailScreen';
import ProgressionChartScreen from './screens/ProgressionChartScreen';
import ProfileScreen from './screens/ProfileScreen';

import { fetchExercises } from './data/mockApiExercicios';
import { mockTreinos } from './data/mockTreinos';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator({ exerciseList, userWorkouts, userName, onSaveName, onResetData }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Histórico') iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          else if (route.name === 'Biblioteca') iconName = focused ? 'book' : 'book-outline';
          else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
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
        {(props) => <HomeScreen {...props} userWorkouts={userWorkouts} userName={userName} />}
      </Tab.Screen>
      
      <Tab.Screen name="Histórico">
        {(props) => <HistoryScreen {...props} userWorkouts={userWorkouts} />}
      </Tab.Screen>
      
      <Tab.Screen name="Biblioteca">
        {(props) => (
          <ExerciseScreen
            {...props}
            exerciseList={exerciseList}
            loading={false}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Perfil">
        {(props) => (
          <ProfileScreen 
            {...props} 
            userName={userName} 
            onSaveName={onSaveName} 
            onResetData={onResetData} 
          />
        )}
      </Tab.Screen>

    </Tab.Navigator>
  );
}

export default function App() {
  const [exerciseList, setExerciseList] = useState([]);
  const [exerciseListFlat, setExerciseListFlat] = useState([]);
  const [appLoading, setAppLoading] = useState(true);
  const [userWorkouts, setUserWorkouts] = useState({});
  const [userName, setUserName] = useState('');

  const persistWorkouts = async (workouts) => {
    try {
      const jsonValue = JSON.stringify(workouts);
      await AsyncStorage.setItem('@my_app_treinos', jsonValue);
    } catch (e) {
      console.error("Erro ao salvar dados", e);
    }
  };

  const handleSaveName = async (name) => {
    try {
      setUserName(name);
      await AsyncStorage.setItem('@my_app_username', name);
    } catch (e) {
      console.error("Erro ao salvar nome", e);
    }
  };

  const handleResetData = async () => {
    try {
      await AsyncStorage.clear();
      setUserWorkouts({});
      setUserName('');
      alert('App resetado com sucesso!');
    } catch (e) {
      console.error("Erro ao resetar", e);
    }
  };

  const handleSaveWorkout = (newExercises, dateToSave) => {
    const today = new Date().toISOString().split('T')[0];
    const targetDate = dateToSave || today;
    
    setUserWorkouts((prevWorkouts) => {
      const updatedWorkouts = { ...prevWorkouts };
      updatedWorkouts[targetDate] = newExercises;
      persistWorkouts(updatedWorkouts);
      return updatedWorkouts;
    });
  };

  const handleDeleteWorkout = useCallback((dateToDelete) => {
    setUserWorkouts((prevWorkouts) => {
      const updatedWorkouts = { ...prevWorkouts };
      if (updatedWorkouts[dateToDelete]) {
        delete updatedWorkouts[dateToDelete];
        persistWorkouts(updatedWorkouts);
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

        const jsonWorkouts = await AsyncStorage.getItem('@my_app_treinos');
        if (jsonWorkouts != null) {
          setUserWorkouts(JSON.parse(jsonWorkouts));
        } else {
          setUserWorkouts(mockTreinos);
        }

        const storedName = await AsyncStorage.getItem('@my_app_username');
        if (storedName) {
          setUserName(storedName);
        }

      } catch (error) {
        console.error("Erro no carregamento inicial:", error);
      } finally {
        setAppLoading(false);
      }
    };

    carregarDadosIniciais();
  }, []);

  if (appLoading) {
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
                userName={userName}
                onSaveName={handleSaveName}
                onResetData={handleResetData}
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

          <Stack.Screen 
            name="ProgressionChart" 
            options={{ title: 'Progresso' }}
          >
            {(props) => (
              <ProgressionChartScreen {...props} userWorkouts={userWorkouts} />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="LogWorkout"
            options={{
              title: 'Registrar/Editar Treino',
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