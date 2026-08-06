import { getVerseTextInVersion } from './bibleVersions';
import { Verse } from './types';

export const TOPIC_VERSES: Record<string, {reference: string, text: string}[]> = {
  god: [
    { reference: 'João 10:30', text: 'Eu e o Pai somos um.' },
    { reference: '1 João 4:8', text: 'Quem não ama não conhece a Deus, porque Deus é amor.' },
    { reference: 'Isaías 9:6', text: 'Porque um menino nos nasceu, um filho nos foi dado, e o governo está sobre os seus ombros. E ele será chamado Maravilhoso Conselheiro, Deus Poderoso, Pai Eterno, Príncipe da Paz.' },
    { reference: 'João 14:26', text: 'Mas o Conselheiro, o Espírito Santo, que o Pai enviará em meu nome, lhes ensinará todas as coisas e lhes fará lembrar tudo o que eu lhes disse.' }
  ],
  hope: [
    { reference: 'Jeremias 29:11', text: 'Porque sou eu que conheço os planos que tenho para vocês", diz o Senhor, "planos de fazê-los prosperar e não de causar dano, planos de dar a vocês esperança e um futuro.' },
    { reference: 'Romanos 15:13', text: 'Que o Deus da esperança os encha de toda alegria e paz, por sua confiança nele, para que vocês transbordem de esperança, pelo poder do Espírito Santo.' },
    { reference: 'Hebreus 11:1', text: 'Ora, a fé é a certeza daquilo que esperamos e a prova das coisas que não vemos.' },
    { reference: 'Isaías 40:31', text: 'Mas aqueles que esperam no Senhor renovam as suas forças. Voam bem alto como águias; correm e não ficam exaustos, andam e não se cansam.' }
  ],
  compassion: [
    { reference: 'Colossenses 3:12', text: 'Portanto, como povo escolhido de Deus, santo e amado, revistam-se de profunda compaixão, bondade, humildade, mansidão e paciência.' },
    { reference: 'Efésios 4:32', text: 'Sejam bondosos e compassivos uns para com os outros, perdoando-se mutuamente, assim como Deus os perdoou em Cristo.' },
    { reference: 'Zacarias 7:9', text: 'Assim diz o Senhor dos Exércitos: "Administrem a verdadeira justiça, mostrem misericórdia e compaixão uns para com os outros."' }
  ],
  charity: [
    { reference: '2 Coríntios 9:7', text: 'Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria.' },
    { reference: 'Provérbios 19:17', text: 'Quem trata bem os pobres empresta ao Senhor, e ele o recompensará.' },
    { reference: 'Lucas 6:38', text: 'Dêem, e lhes será dado: uma boa medida, calcada, sacudida e transbordante será dada a vocês. Pois a medida que usarem, também será usada para medir vocês.' }
  ],
  family: [
    { reference: 'Efésios 6:1-2', text: 'Filhos, obedeçam a seus pais no Senhor, pois isso é justo. "Honra teu pai e tua mãe" - este é o primeiro mandamento com promessa.' },
    { reference: 'Provérbios 22:6', text: 'Instrua a criança segundo os objetivos que você tem para ela, e mesmo com o passar dos anos não se desviará deles.' },
    { reference: 'Colossenses 3:20', text: 'Filhos, obedeçam a seus pais em tudo, pois isso agrada ao Senhor.' },
    { reference: 'Salmos 127:3', text: 'Os filhos são herança do Senhor, uma recompensa que ele dá.' }
  ],
  forgiveness: [
    { reference: 'Mateus 6:14-15', text: 'Pois se perdoarem as ofensas uns dos outros, o Pai celestial também lhes perdoará. Mas se não perdoarem uns aos outros, o Pai celestial não lhes perdoará as ofensas.' },
    { reference: 'Marcos 11:25', text: 'E quando estiverem orando, se tiverem alguma coisa contra alguém, perdoem-no, para que também o Pai celestial lhes perdoe os seus pecados.' },
    { reference: '1 João 1:9', text: 'Se confessarmos os nossos pecados, ele é fiel e justo para perdoar os nossos pecados e nos purificar de toda injustiça.' }
  ],
  love: [
    { reference: '1 Coríntios 13:4-5', text: 'O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. Não maltrata, não procura seus interesses, não se ira facilmente, não guarda rancor.' },
    { reference: 'Romanos 12:9', text: 'O amor deve ser sincero. Odeiem o que é mau; apeguem-se ao que é bom.' },
    { reference: '1 Pedro 4:8', text: 'Sobretudo, amem-se sinceramente uns aos outros, porque o amor perdoa muitíssimos pecados.' }
  ],
  sin: [
    { reference: 'Romanos 6:23', text: 'Pois o salário do pecado é a morte, mas o dom gratuito de Deus é a vida eterna em Cristo Jesus, nosso Senhor.' },
    { reference: 'Tiago 1:14-15', text: 'Cada um, porém, é tentado pelo próprio mau desejo, sendo por este arrastado e seduzido. Então esse desejo, tendo concebido, dá à luz o pecado, e o pecado, após ter-se consumado, gera a morte.' },
    { reference: '1 Coríntios 10:13', text: 'Não sobreveio a vocês tentação que não fosse comum aos homens. E Deus é fiel; ele não permitirá que vocês sejam tentados além do que podem suportar.' }
  ],
  overcoming: [
    { reference: 'Tiago 1:19-20', text: 'Meus amados irmãos, tenham isto em mente: Sejam todos prontos para ouvir, tardios para falar e tardios para irar-se, pois a ira do homem não produz a justiça de Deus.' },
    { reference: 'Efésios 4:26-27', text: 'Quando vocês se irarem, não pequem. Apaziguem a sua ira antes que o sol se ponha, e não dêem lugar ao Diabo.' },
    { reference: 'Romanos 12:21', text: 'Não se deixem vencer pelo mal, mas vençam o mal com o bem.' }
  ],
  singles: [
    { reference: '1 Coríntios 7:32', text: 'Gostaria de vê-los livres de preocupações. O homem solteiro cuida das coisas do Senhor, em como agradar ao Senhor.' },
    { reference: 'Salmos 37:4', text: 'Deleite-se no Senhor, e ele atenderá aos desejos do seu coração.' },
    { reference: 'Mateus 6:33', text: 'Busquem, pois, em primeiro lugar o Reino de Deus e a sua justiça, e todas essas coisas lhes serão acrescentadas.' }
  ],
  psalms: [
    { reference: 'Salmos 23:1-2', text: 'O Senhor é o meu pastor; de nada me faltará. Em verdes pastagens me faz repousar e me conduz a águas tranquilas.' },
    { reference: 'Salmos 121:1-2', text: 'Levanto os meus olhos para os montes e pergunto: De onde me vem o socorro? O meu socorro vem do Senhor, que fez os céus e a terra.' },
    { reference: 'Salmos 91:1-2', text: 'Aquele que habita no abrigo do Altíssimo e descansa à sombra do Todo-poderoso pode dizer ao Senhor: Tu és o meu refúgio e a minha fortaleza, o meu Deus, em quem confio.' },
    { reference: 'Salmos 46:1', text: 'Deus é o nosso refúgio e a nossa fortaleza, auxílio sempre presente na adversidade.' },
    { reference: 'Salmos 119:105', text: 'A tua palavra é lâmpada que ilumina os meus passos e luz que clareia o meu caminho.' }
  ],
  proverbs: [
    { reference: 'Provérbios 3:5-6', text: 'Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento; reconheça o Senhor em todos os seus caminhos, e ele endireitará as suas veredas.' },
    { reference: 'Provérbios 4:23', text: 'Acima de tudo, guarde o seu coração, pois dele depende toda a sua vida.' },
    { reference: 'Provérbios 16:3', text: 'Consagre ao Senhor tudo o que você faz, e os seus planos serão bem-sucedidos.' },
    { reference: 'Provérbios 18:10', text: 'O nome do Senhor é uma torre forte; os justos correm para ela e estão seguros.' }
  ],
  paul: [
    { reference: 'Filipenses 4:13', text: 'Tudo posso naquele que me fortalece.' },
    { reference: 'Romanos 8:28', text: 'Sabemos que Deus age em todas as coisas para o bem daqueles que o amam, dos que foram chamados de acordo com o seu propósito.' },
    { reference: 'Gálatas 2:20', text: 'Fui crucificado com Cristo. Assim, já não sou eu quem vive, mas Cristo vive em mim. A vida que agora vivo no corpo, vivo-a pela fé no filho de Deus, que me amou e se entregou por mim.' },
    { reference: '2 Coríntios 5:17', text: 'Portanto, se alguém está em Cristo, é nova criação. As coisas antigas já passaram; eis que surgiram coisas novas!' }
  ],
  prosperity: [
    { reference: 'Josué 1:8', text: 'Não deixe de falar as palavras deste Livro da Lei e de meditar nelas de dia e de noite, para que você cumpra fielmente tudo o que nele está escrito. Só então os seus caminhos prosperarão e você será bem-sucedido.' },
    { reference: 'Filipenses 4:19', text: 'O meu Deus suprirá todas as necessidades de vocês, de acordo com as suas gloriosas riquezas em Cristo Jesus.' },
    { reference: '3 João 1:2', text: 'Amado, oro para que você tenha boa saúde e tudo lhe corra bem, assim como vai bem a sua alma.' }
  ],
  sadness: [
    { reference: 'Salmos 34:18', text: 'O Senhor está perto dos que têm o coração quebrantado e salva os de espírito abatido.' },
    { reference: 'Apocalipse 21:4', text: 'Ele enxugará dos seus olhos toda lágrima. Não haverá mais morte, nem tristeza, nem choro, nem dor, pois a velha ordem já passou.' },
    { reference: 'Mateus 5:4', text: 'Bem-aventurados os que choram, pois serão consolados.' },
    { reference: 'Salmos 30:5', text: 'Pois a sua ira só dura um instante, mas o seu favor dura a vida toda; o choro pode persistir uma noite, mas de manhã irrompe a alegria.' }
  ],
  mercy: [
    { reference: 'Lamentações 3:22-23', text: 'Graças ao grande amor do Senhor é que não somos consumidos, pois as suas misericórdias são inesgotáveis. Renovam-se cada manhã; grande é a tua fidelidade!' },
    { reference: 'Efésios 2:4-5', text: 'Todavia, Deus, que é rico em misericórdia, pelo grande amor com que nos amou, deu-nos vida com Cristo quando ainda estávamos mortos em transgressões — pela graça vocês são salvos.' },
    { reference: 'Hebreus 4:16', text: 'Assim, aproximemo-nos do trono da graça com toda a confiança, a fim de recebermos misericórdia e encontrarmos graça que nos ajude no momento da necessidade.' }
  ],
  revelation: [
    { reference: 'Apocalipse 1:3', text: 'Feliz aquele que lê as palavras desta profecia e felizes aqueles que ouvem e guardam o que nela está escrito, porque o tempo está próximo.' },
    { reference: 'Apocalipse 3:20', text: 'Eis que estou à porta e bato. Se alguém ouvir a minha voz e abrir a porta, entrarei e cearei com ele, e ele comigo.' },
    { reference: 'Apocalipse 22:13', text: 'Eu sou o Alfa e o Ômega, o Primeiro e o Último, o Princípio e o Fim.' }
  ]
};

const INSPIRATIONAL_VERSES = Object.values(TOPIC_VERSES).flat();

// Gerador determinístico baseado na data que não repete até completar o ciclo
function getVerseForDate(date: Date, version: string = 'NVI'): Verse {
  const dateString = date.toISOString().split('T')[0];
  
  // Usamos uma data de "época" fixa para calcular os dias passados
  const epoch = new Date('2024-01-01T00:00:00Z');
  const targetDate = new Date(dateString + 'T00:00:00Z');
  const diffTime = Math.abs(targetDate.getTime() - epoch.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Usar um multiplicador primo grande (que não é divisor do length)
  // faz com que o percurso pule por toda a lista de forma determinística
  // e pareça aleatório sem nunca repetir antes do tempo.
  const primeMultiplier = 37; 
  const index = (diffDays * primeMultiplier) % INSPIRATIONAL_VERSES.length;
  
  const selected = INSPIRATIONAL_VERSES[index];
  
  return {
    id: `verse-${dateString}-${index}`,
    text: getVerseTextInVersion(selected.reference, version, selected.text),
    originalText: selected.text,
    reference: selected.reference,
    date: dateString
  };
}

export const getVerseOfTheDay = (version: string = 'NVI'): Verse => {
  return getVerseForDate(new Date(), version);
};

export const getRandomVerseByTopic = (topicId: string, version: string = 'NVI'): Verse => {
  let filtered = topicId === 'all' ? INSPIRATIONAL_VERSES : (TOPIC_VERSES[topicId] || INSPIRATIONAL_VERSES);
  if (filtered.length === 0) filtered = INSPIRATIONAL_VERSES;

  // Usa localStorage para rastrear os versículos já mostrados e evitar repetição
  const storageKey = `luz_diaria_random_queue_${topicId}`;
  let queue = [];
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      queue = JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to parse random queue', e);
  }

  // Se a fila estiver vazia, cria uma nova fila com todos os índices e embaralha
  if (!queue || queue.length === 0) {
    queue = Array.from({ length: filtered.length }, (_, i) => i);
    // Fisher-Yates shuffle
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
  }

  // Pega o próximo índice (do final do array para ser mais eficiente O(1))
  const index = queue.pop() ?? 0;

  try {
    localStorage.setItem(storageKey, JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to save random queue', e);
  }

  const selected = filtered[index];
  
  return {
    id: `rand-${Date.now()}-${index}`,
    text: getVerseTextInVersion(selected.reference, version, selected.text),
    originalText: selected.text,
    reference: selected.reference,
    date: new Date().toISOString().split('T')[0]
  };
}

export const TOPICS = [
  { id: 'all', name: 'Qualquer tópico', icon: 'Book' },
  { id: 'god', name: 'Deus, Jesus, Espírito Santo', icon: 'Sun' },
  { id: 'hope', name: 'Esperança e Fé', icon: 'Star' },
  { id: 'compassion', name: 'Compaixão', icon: 'HeartHandshake' },
  { id: 'charity', name: 'Caridade e dinheiro', icon: 'Coins' },
  { id: 'family', name: 'Crianças e Familiares', icon: 'Users' },
  { id: 'forgiveness', name: 'Perdão e Arrependimento', icon: 'RefreshCw' },
  { id: 'love', name: 'Amor e Relacionamentos', icon: 'Heart' },
  { id: 'sin', name: 'O pecado e a tentação', icon: 'Flame' },
  { id: 'overcoming', name: 'Ódio e raiva superação', icon: 'Shield' },
  { id: 'singles', name: 'As pessoas solteiras cristãs', icon: 'User' },
  { id: 'psalms', name: 'Salmos', icon: 'BookOpen' },
  { id: 'proverbs', name: 'Provérbios', icon: 'BookText' },
  { id: 'paul', name: 'Epístolas de Paulo', icon: 'ScrollText' },
  { id: 'prosperity', name: 'Prosperidade', icon: 'TrendingUp' },
  { id: 'sadness', name: 'Tristeza', icon: 'CloudRain' },
  { id: 'mercy', name: 'Mercê', icon: 'HandHeart' },
  { id: 'revelation', name: 'Revelação', icon: 'Eye' },
];

// Gerar uma lista de versículos recentes para o Drawer
import { CROSS_REFERENCES_DB, THEME_KEYWORDS } from './crossReferencesDb';

export const getAllVerses = (version: string = 'NVI'): Verse[] => {
  const all: Verse[] = INSPIRATIONAL_VERSES.map(v => ({
    id: `db-${v.reference}`,
    text: getVerseTextInVersion(v.reference, version, v.text), originalText: v.text,
    reference: v.reference,
    date: new Date().toISOString()
  }));
  for (const verses of Object.values(CROSS_REFERENCES_DB)) {
    for (const v of verses) {
      all.push({
        id: `db-${v.reference}`,
        text: v.text,
        originalText: v.text,
        reference: v.reference,
        date: new Date().toISOString()
      });
    }
  }
  
  const unique = Array.from(new Map(all.map(item => [item.reference, item])).values());
  return unique;
};

// Helper function to remove accents
const removeAccents = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const searchVerses = (query: string, filters?: { book?: string, chapter?: string, verse?: string }, version: string = 'NVI'): Verse[] => {
  let all = getAllVerses(version);
  
  if (filters?.book) {
    // Only exact matches on the book portion, handle things like "1 João"
    all = all.filter(v => v.reference.startsWith(filters.book as string + " "));
  }
  if (filters?.chapter) {
    all = all.filter(v => {
       const match = v.reference.match(/^(.+?)\s+(\d+):(\d+)/);
       if (match) return match[1] === filters.book && match[2] === filters.chapter;
       return false;
    });
  }
  if (filters?.verse) {
    all = all.filter(v => {
       const match = v.reference.match(/^(.+?)\s+(\d+):(\d+)/);
       if (match) return match[1] === filters.book && match[2] === filters.chapter && match[3] === filters.verse;
       return false;
    });
  }

  if (!query.trim() && !filters?.book) return [];

  if (query.trim()) {
    const normalizedQuery = removeAccents(query.toLowerCase());
    const terms = normalizedQuery.split(/\s+/).filter(t => t.length > 0);
    
    all = all.filter(v => {
      const normalizedReference = removeAccents(v.reference.toLowerCase());
      const normalizedText = removeAccents(v.text.toLowerCase());
      
      // Match if all words are present somewhere in the verse (either text or reference)
      return terms.every(term => 
        normalizedReference.includes(term) || normalizedText.includes(term)
      );
    });
  }
  
  return all.slice(0, 20);
};

export const getCrossReferences = (reference: string, text: string, version: string = 'NVI'): { reference: string, text: string }[] => {
  const crossRefs: { reference: string, text: string }[] = [];
  
  // First, check our basic topics
  for (const [, verses] of Object.entries(TOPIC_VERSES)) {
    if (verses.some(v => v.reference === reference)) {
      crossRefs.push(...verses.filter(v => v.reference !== reference));
    }
  }

  // Second, check our new extensive cross-reference database by keyword matching
  const lowerText = text.toLowerCase();
  
  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      crossRefs.push(...CROSS_REFERENCES_DB[theme]);
    }
  }
  
  // Remove duplicates and the verse itself
  const uniqueRefs = Array.from(new Map(crossRefs.filter(v => v.reference !== reference).map(item => [item.reference, item])).values());
  
  // Sort randomly to always give a fresh mix of cross-references
  return uniqueRefs.map(v => ({...v, text: getVerseTextInVersion(v.reference, version, v.text)})).sort(() => 0.5 - Math.random());
};

// Gerar uma lista de versículos recentes para o Drawer
export const getRecentVerses = (version: string = 'NVI'): Verse[] => {
  return Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return getVerseForDate(d, version);
  });
};
