const BASE_URL = 'https://wger.de/api/v2';
const LANGUAGE_ID = 2; 

export const fetchExercises = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/exerciseinfo/?language=${LANGUAGE_ID}&limit=20`
    );
    const data = await response.json();

    if (!data.results) return [];

    return data.results.map((item) => ({
      id: item.id,
      nome: item.name,
      grupo: item.category ? item.category.name : 'Geral',
    }));
  } catch (error) {
    console.error('Erro na API WGER:', error);
    return [];
  }
};