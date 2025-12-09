const EXERCICIOS_DB = [
  // PEITO
  { id: 101, nome: 'Supino Reto (Barra)', grupo: 'Peito' },
  { id: 102, nome: 'Supino Inclinado (Halteres)', grupo: 'Peito' },
  { id: 103, nome: 'Crucifixo (Máquina)', grupo: 'Peito' },
  { id: 104, nome: 'Flexão de Braço', grupo: 'Peito' },
  { id: 105, nome: 'Crossover (Polia Alta)', grupo: 'Peito' },
  { id: 106, nome: 'Supino Declinado', grupo: 'Peito' },
  { id: 107, nome: 'Peck Deck (Voador)', grupo: 'Peito' },
  { id: 108, nome: 'Pullover', grupo: 'Peito' },

  // COSTAS
  { id: 201, nome: 'Puxada Frontal (Pulley)', grupo: 'Costas' },
  { id: 202, nome: 'Remada Curvada', grupo: 'Costas' },
  { id: 203, nome: 'Levantamento Terra', grupo: 'Costas' },
  { id: 204, nome: 'Barra Fixa', grupo: 'Costas' },
  { id: 205, nome: 'Remada Unilateral (Serrote)', grupo: 'Costas' },
  { id: 206, nome: 'Remada Baixa (Triângulo)', grupo: 'Costas' },
  { id: 207, nome: 'Puxada Triângulo', grupo: 'Costas' },
  { id: 208, nome: 'Hiperextensão Lombar', grupo: 'Costas' },

  // PERNA
  { id: 301, nome: 'Agachamento Livre', grupo: 'Pernas' },
  { id: 302, nome: 'Leg Press 45', grupo: 'Pernas' },
  { id: 303, nome: 'Cadeira Extensora', grupo: 'Pernas' },
  { id: 304, nome: 'Mesa Flexora', grupo: 'Pernas' },
  { id: 305, nome: 'Afundo (Passada)', grupo: 'Pernas' },
  { id: 306, nome: 'Stiff', grupo: 'Pernas' },
  { id: 307, nome: 'Elevação Pélvica', grupo: 'Pernas' },
  { id: 308, nome: 'Panturrilha Sentado', grupo: 'Pernas' },
  { id: 309, nome: 'Panturrilha em Pé', grupo: 'Pernas' },
  { id: 310, nome: 'Agachamento Búlgaro', grupo: 'Pernas' },

  // OMBRO
  { id: 401, nome: 'Desenvolvimento Militar', grupo: 'Ombros' },
  { id: 402, nome: 'Elevação Lateral', grupo: 'Ombros' },
  { id: 403, nome: 'Elevação Frontal', grupo: 'Ombros' },
  { id: 404, nome: 'Desenvolvimento Arnold', grupo: 'Ombros' },
  { id: 405, nome: 'Remada Alta', grupo: 'Ombros' },
  { id: 406, nome: 'Crucifixo Invertido', grupo: 'Ombros' },
  { id: 407, nome: 'Encolhimento de Ombros', grupo: 'Ombros' },

  // BRAÇO
  { id: 501, nome: 'Rosca Direta (Barra)', grupo: 'Bíceps' },
  { id: 502, nome: 'Rosca Martelo', grupo: 'Bíceps' },
  { id: 503, nome: 'Rosca Scott', grupo: 'Bíceps' },
  { id: 504, nome: 'Rosca Concentrada', grupo: 'Bíceps' },
  { id: 505, nome: 'Tríceps Pulley (Corda)', grupo: 'Tríceps' },
  { id: 506, nome: 'Tríceps Testa', grupo: 'Tríceps' },
  { id: 507, nome: 'Tríceps Francês', grupo: 'Tríceps' },
  { id: 508, nome: 'Mergulho no Banco', grupo: 'Tríceps' },

  // ABS
  { id: 601, nome: 'Abdominal Supra', grupo: 'Abdômen' },
  { id: 602, nome: 'Prancha Isométrica', grupo: 'Abdômen' },
  { id: 603, nome: 'Elevação de Pernas', grupo: 'Abdômen' },
  { id: 604, nome: 'Abdominal Infra', grupo: 'Abdômen' },
  { id: 605, nome: 'Russian Twist', grupo: 'Abdômen' },

  // CARDIO
  { id: 701, nome: 'Esteira (Corrida)', grupo: 'Cardio' },
  { id: 702, nome: 'Bicicleta Ergométrica', grupo: 'Cardio' },
  { id: 703, nome: 'Elíptico', grupo: 'Cardio' },
  { id: 704, nome: 'Pular Corda', grupo: 'Cardio' },
];

export const fetchExercises = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(EXERCICIOS_DB);
    }, 500); 
  });
};