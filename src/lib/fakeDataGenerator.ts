// Brazilian names database for realistic fake data generation

const maleFirstNames = [
  'João', 'Pedro', 'Lucas', 'Gabriel', 'Matheus', 'Rafael', 'Bruno', 'Carlos', 
  'Fernando', 'Ricardo', 'André', 'Marcos', 'Paulo', 'Thiago', 'Diego', 'Gustavo',
  'Leonardo', 'Vinícius', 'Eduardo', 'Rodrigo', 'Felipe', 'Daniel', 'Henrique', 
  'Alexandre', 'Marcelo', 'Roberto', 'Luiz', 'Antônio', 'José', 'Francisco'
];

const femaleFirstNames = [
  'Maria', 'Ana', 'Juliana', 'Fernanda', 'Patrícia', 'Camila', 'Amanda', 'Larissa',
  'Beatriz', 'Letícia', 'Gabriela', 'Bruna', 'Carla', 'Mariana', 'Aline', 'Vanessa',
  'Priscila', 'Raquel', 'Renata', 'Tatiana', 'Débora', 'Luciana', 'Sandra', 'Paula',
  'Cláudia', 'Adriana', 'Cristiane', 'Denise', 'Helena', 'Carolina'
];

const lastNames = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
  'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes',
  'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Andrade',
  'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas', 'Cardoso', 'Ramos',
  'Gonçalves', 'Santana', 'Teixeira', 'Pinto', 'Correia', 'Araújo', 'Monteiro', 'Moura'
];

// DDD to state mapping for more realistic data
const dddToState: Record<string, string> = {
  '11': 'SP', '12': 'SP', '13': 'SP', '14': 'SP', '15': 'SP', '16': 'SP', '17': 'SP', '18': 'SP', '19': 'SP',
  '21': 'RJ', '22': 'RJ', '24': 'RJ',
  '27': 'ES', '28': 'ES',
  '31': 'MG', '32': 'MG', '33': 'MG', '34': 'MG', '35': 'MG', '37': 'MG', '38': 'MG',
  '41': 'PR', '42': 'PR', '43': 'PR', '44': 'PR', '45': 'PR', '46': 'PR',
  '47': 'SC', '48': 'SC', '49': 'SC',
  '51': 'RS', '53': 'RS', '54': 'RS', '55': 'RS',
  '61': 'DF',
  '62': 'GO', '64': 'GO',
  '63': 'TO',
  '65': 'MT', '66': 'MT',
  '67': 'MS',
  '68': 'AC',
  '69': 'RO',
  '71': 'BA', '73': 'BA', '74': 'BA', '75': 'BA', '77': 'BA',
  '79': 'SE',
  '81': 'PE', '87': 'PE',
  '82': 'AL',
  '83': 'PB',
  '84': 'RN',
  '85': 'CE', '88': 'CE',
  '86': 'PI', '89': 'PI',
  '91': 'PA', '93': 'PA', '94': 'PA',
  '92': 'AM', '97': 'AM',
  '95': 'RR',
  '96': 'AP',
  '98': 'MA', '99': 'MA'
};

const stateToCity: Record<string, string[]> = {
  'SP': ['São Paulo', 'Campinas', 'Santos', 'São Bernardo', 'Guarulhos', 'Osasco'],
  'RJ': ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Nova Iguaçu', 'Duque de Caxias'],
  'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim'],
  'RS': ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria'],
  'PR': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel'],
  'SC': ['Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Chapecó'],
  'BA': ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari'],
  'PE': ['Recife', 'Jaboatão', 'Olinda', 'Caruaru', 'Petrolina'],
  'CE': ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú'],
  'GO': ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde'],
  'DF': ['Brasília', 'Taguatinga', 'Ceilândia', 'Samambaia'],
  'PA': ['Belém', 'Ananindeua', 'Santarém', 'Marabá'],
  'AM': ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru'],
  'ES': ['Vitória', 'Vila Velha', 'Serra', 'Cariacica'],
  'MT': ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop'],
  'MS': ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá'],
  'PB': ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos'],
  'RN': ['Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo'],
  'AL': ['Maceió', 'Arapiraca', 'Rio Largo', 'Palmeira dos Índios'],
  'PI': ['Teresina', 'Parnaíba', 'Picos', 'Piripiri'],
  'SE': ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto'],
  'MA': ['São Luís', 'Imperatriz', 'São José de Ribamar', 'Timon'],
  'TO': ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional'],
  'RO': ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena'],
  'AC': ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira'],
  'RR': ['Boa Vista', 'Rorainópolis', 'Caracaraí'],
  'AP': ['Macapá', 'Santana', 'Laranjal do Jari']
};

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const getRandomNumber = (min: number, max: number): number => 
  Math.floor(Math.random() * (max - min + 1)) + min;

// Apply blur effect with block characters
const blurText = (text: string, blurLevel: 'light' | 'medium' | 'heavy' = 'medium'): string => {
  const blurChars = ['█', '▓', '▒', '░'];
  const percentToBlur = blurLevel === 'light' ? 0.3 : blurLevel === 'medium' ? 0.5 : 0.7;
  
  return text.split('').map((char, i) => {
    if (char === ' ' || char === '/' || char === '-') return char;
    if (Math.random() < percentToBlur) {
      return blurChars[Math.floor(Math.random() * blurChars.length)];
    }
    return char;
  }).join('');
};

// Generate partial CPF (masked)
const generatePartialCPF = (): string => {
  const visible1 = getRandomNumber(100, 999);
  const visible2 = getRandomNumber(10, 99);
  return `${visible1}.███.███-${visible2}`;
};

// Generate birth date
const generateBirthDate = (): { full: string; blurred: string; age: number } => {
  const currentYear = new Date().getFullYear();
  const birthYear = getRandomNumber(1960, 2005);
  const birthMonth = getRandomNumber(1, 12);
  const birthDay = getRandomNumber(1, 28);
  
  const age = currentYear - birthYear;
  const full = `${birthDay.toString().padStart(2, '0')}/${birthMonth.toString().padStart(2, '0')}/${birthYear}`;
  
  // Show partial date
  const blurred = `██/${birthMonth.toString().padStart(2, '0')}/19██`;
  
  return { full, blurred, age };
};

export interface FakePersonData {
  fullName: string;
  blurredName: string;
  firstName: string;
  lastName: string;
  cpf: string;
  birthDate: string;
  blurredBirthDate: string;
  age: number;
  gender: 'M' | 'F';
  state: string;
  city: string;
  blurredCity: string;
  operator: string;
  phoneType: string;
}

export const generateFakePersonData = (phoneNumber: string): FakePersonData => {
  // Extract DDD from phone
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const ddd = cleanPhone.slice(0, 2);
  
  // Determine gender randomly
  const gender: 'M' | 'F' = Math.random() > 0.5 ? 'M' : 'F';
  
  // Generate name
  const firstName = gender === 'M' 
    ? getRandomItem(maleFirstNames) 
    : getRandomItem(femaleFirstNames);
  const middleName = getRandomItem(lastNames);
  const lastName = getRandomItem(lastNames.filter(n => n !== middleName));
  
  const fullName = `${firstName} ${middleName} ${lastName}`;
  
  // Blur the name (keep first and last parts visible)
  const blurredName = `${firstName} ${blurText(middleName, 'heavy')} ${lastName.charAt(0)}████`;
  
  // Get location
  const state = dddToState[ddd] || 'SP';
  const cities = stateToCity[state] || ['Capital'];
  const city = getRandomItem(cities);
  
  // Birth date
  const birthDateInfo = generateBirthDate();
  
  // Operator based on first digit of number
  const numberPart = cleanPhone.slice(2);
  const operators = ['VIVO', 'TIM', 'CLARO', 'OI'];
  const operator = operators[parseInt(numberPart.charAt(0)) % 4];
  
  // Phone type (9 = mobile, others = landline)
  const phoneType = numberPart.startsWith('9') ? 'CELULAR' : 'FIXO';
  
  return {
    fullName,
    blurredName,
    firstName,
    lastName,
    cpf: generatePartialCPF(),
    birthDate: birthDateInfo.full,
    blurredBirthDate: birthDateInfo.blurred,
    age: birthDateInfo.age,
    gender,
    state,
    city,
    blurredCity: blurText(city, 'medium'),
    operator,
    phoneType
  };
};

// Generate fake messages related to the person
export const generateFakeMessages = (personName: string): Array<{
  from: string;
  text: string;
  time: string;
  unread: boolean;
}> => {
  const firstName = personName.split(' ')[0];
  const messages = [
    { from: 'Alvo', text: `Oi, ${firstName} aqui. Preciso falar com você sobre...`, time: '14:32', unread: true },
    { from: 'Você', text: 'Claro, pode falar! Estou disponível agora...', time: '14:30', unread: false },
    { from: 'Alvo', text: 'Amanhã às 15h no local combinado, ok?', time: '13:45', unread: false },
    { from: 'Você', text: 'Perfeito! Levo os documentos que você pediu...', time: '13:40', unread: false },
    { from: 'Alvo', text: 'Não esquece de trazer aquilo que te pedi...', time: '12:22', unread: false },
  ];
  return messages;
};
