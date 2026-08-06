const fs = require('fs');
let content = fs.readFileSync('src/quotes.ts', 'utf8');

const newQuotes = `
  { id: 'q71', text: 'Se você não tem intenção de ouvir a Deus, por que deveria esperar que Ele o ouça?', author: 'A.W. Tozer' },
  { id: 'q72', text: 'Não devemos nos contentar em apenas falar com Deus, mas também devemos ouvir o que Ele nos diz.', author: 'João Calvino' },
  { id: 'q73', text: 'Fé não é a crença de que Deus fará o que você quiser. É a crença de que Deus fará o que é certo.', author: 'Max Lucado' },
  { id: 'q74', text: 'Deus nunca lhe dará algo que você não possa suportar, então não se estresse.', author: 'Kelly Clarkson' },
  { id: 'q75', text: 'A nossa maior glória não reside no fato de nunca cairmos, mas sim em levantarmo-nos sempre depois de cada queda.', author: 'Confúcio' },
  { id: 'q76', text: 'O amor é a força mais sutil do mundo.', author: 'Mahatma Gandhi' },
  { id: 'q77', text: 'Onde o amor e a compaixão existem, ali está Deus.', author: 'Madre Teresa de Calcutá' },
  { id: 'q78', text: 'As promessas de Deus não têm data de validade.', author: 'Corrie ten Boom' },
  { id: 'q79', text: 'A oração não muda Deus, mas muda aquele que ora.', author: 'Søren Kierkegaard' },
  { id: 'q80', text: 'Se você está caminhando com Jesus, você está indo na direção certa.', author: 'Rick Warren' },
  { id: 'q81', text: 'Não deixe que seus medos tomem o lugar dos seus sonhos.', author: 'Walt Disney' },
  { id: 'q82', text: 'A única coisa necessária para o triunfo do mal é que os homens bons não façam nada.', author: 'Edmund Burke' },
  { id: 'q83', text: 'Deus te ama do jeito que você é, mas te ama demais para te deixar assim.', author: 'Justo L. González' },
  { id: 'q84', text: 'O verdadeiro amigo é aquele que te aproxima de Deus.', author: 'Santo Agostinho' },
  { id: 'q85', text: 'Você é a única Bíblia que alguns descrentes lerão.', author: 'John MacArthur' },
  { id: 'q86', text: 'Um homem sem Deus é um barco sem leme.', author: 'Santo Inácio de Loyola' },
  { id: 'q87', text: 'A tristeza pode durar uma noite, mas a alegria vem pela manhã.', author: 'Salmos 30:5' },
  { id: 'q88', text: 'Fé é dar o primeiro passo mesmo quando você não vê toda a escada.', author: 'Martin Luther King Jr.' },
  { id: 'q89', text: 'A graça de Deus é maior que qualquer pecado nosso.', author: 'Paul Washer' },
  { id: 'q90', text: 'O amor de Deus não se esgota.', author: 'Papa Francisco' }
];
`;

content = content.replace(/];/, newQuotes + '\\n];');
fs.writeFileSync('src/quotes.ts', content);
console.log("Added 20 more quotes.");
