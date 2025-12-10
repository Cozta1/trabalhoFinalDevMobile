import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import * as Location from 'expo-location';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState('Carregando...');
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const fetchLocationAndWeather = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationName('Sem permissão');
        setLoading(false);
        return;
      }
      setPermissionGranted(true);

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      let addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
      
      if (addressResponse.length > 0) {
         const addr = addressResponse[0];
         const bairro = addr.district || addr.subregion || addr.city;
         setLocationName(bairro || 'Local Desconhecido');
      }

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const data = await response.json();
      setWeather(data.current_weather);

    } catch (err) {
      console.error("Erro ao buscar localização/clima:", err);
      setLocationName('Erro na conexão');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationAndWeather();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (!weather && !loading) {
    return (
        <TouchableOpacity style={styles.container} onPress={fetchLocationAndWeather}>
            <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.errorText}>
               {permissionGranted ? 'Tentar Novamente' : 'Ativar Localização'}
            </Text>
        </TouchableOpacity>
    );
  }

  let iconName = 'sunny';
  if (weather.weathercode > 3) iconName = 'cloud';
  if (weather.weathercode > 50) iconName = 'rainy';
  if (weather.weathercode > 80) iconName = 'thunderstorm';

  return (
    <View style={styles.container}>
      <View style={styles.weatherInfo}>
        <Ionicons name={iconName} size={20} color={colors.primary} />
        <Text style={styles.tempText}>{Math.round(weather.temperature)}°C</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.locationInfo}>
        <Ionicons name="navigate" size={14} color={colors.textSecondary} />
        <Text style={styles.locationText} numberOfLines={1}>
            {locationName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    maxWidth: '50%',
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tempText: {
    color: colors.text,
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 14,
  },
  separator: {
    width: 1,
    height: 14,
    backgroundColor: '#555',
    marginHorizontal: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    color: colors.textSecondary,
    marginLeft: 4,
    fontSize: 12,
  },
  errorText: {
      color: colors.textSecondary,
      marginLeft: 6,
      fontSize: 12
  }
});