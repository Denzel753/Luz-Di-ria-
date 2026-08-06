const fs = require('fs');

const quotes = [
  { text: 'Deus não nos ama porque somos bons, mas porque Ele é bom.', author: 'C.S. Lewis' },
  { text: 'Fizeste-nos para Ti, e inquieto está o nosso coração enquanto não repousar em Ti.', author: 'Santo Agostinho' },
  { text: 'A ansiedade não esvazia o amanhã de suas tristezas, mas esvazia o hoje de sua força.', author: 'Charles Spurgeon' },
  { text: 'Ter fé é assinar uma folha em branco e deixar que Deus nela escreva o que quiser.', author: 'Santo Agostinho' },
  { text: 'Acredito no Cristianismo como acredito que o sol nasce: não apenas porque o vejo, mas porque através dele vejo tudo o mais.', author: 'C.S. Lewis' },
  { text: 'O que vem à nossa mente quando pensamos em Deus é a coisa mais importante sobre nós.', author: 'A.W. Tozer' },
  { text: 'A graça barata é o inimigo mortal de nossa igreja.', author: 'Dietrich Bonhoeffer' },
  { text: 'Aquele que canta reza duas vezes.', author: 'Santo Agostinho' },
  { text: 'Pela perseverança o caracol chegou à arca.', author: 'Charles Spurgeon' },
  { text: 'Deus é mais glorificado em nós quando estamos mais satisfeitos Nele.', author: 'John Piper' },
  { text: 'A cruz não é o fim terrível de uma vida feliz e temente a Deus, mas ela nos encontra no início de nossa comunhão com Cristo.', author: 'Dietrich Bonhoeffer' },
  { text: 'Um homem que se prostra diante de Deus, pode ficar de pé diante de qualquer um.', author: 'A.W. Tozer' },
  { text: 'O Filho de Deus se fez homem para possibilitar que os homens se tornem filhos de Deus.', author: 'C.S. Lewis' },
  { text: 'A medida do amor é amar sem medida.', author: 'Santo Agostinho' },
  { text: 'Se Cristo não é tudo para você, Ele não é nada para você.', author: 'Charles Spurgeon' },
  { text: 'O conhecimento de Deus e o conhecimento de nós mesmos estão intimamente ligados.', author: 'João Calvino' },
  { text: 'A fé é uma confiança viva e ousada na graça de Deus.', author: 'Martinho Lutero' },
  { text: 'O homem propõe, mas Deus dispõe.', author: 'Tomás de Kempis' },
  { text: 'Alegria é o negócio sério do céu.', author: 'C.S. Lewis' },
  { text: 'Deus provê o vento, o homem deve içar a vela.', author: 'Santo Agostinho' },
  { text: 'Uma Bíblia que está caindo aos pedaços geralmente pertence a alguém que não está.', author: 'Charles Spurgeon' },
  { text: 'Deus não se curva à nossa pressa.', author: 'A.W. Tozer' },
  { text: 'O silêncio diante do mal é o próprio mal: Deus não nos terá por inocentes.', author: 'Dietrich Bonhoeffer' },
  { text: 'Não há um milímetro quadrado em todo o domínio da nossa existência sobre o qual Cristo não clame: "É meu!"', author: 'Abraham Kuyper' },
  { text: 'Ame e faça o que quiser.', author: 'Santo Agostinho' },
  { text: 'Estar cristão significa perdoar o inescusável, porque Deus perdoou o inescusável em você.', author: 'C.S. Lewis' },
  { text: 'O Senhor não nos salva por causa de nossos méritos, mas por causa da Sua misericórdia.', author: 'Charles Spurgeon' },
  { text: 'Você não tem uma alma. Você é uma alma. Você tem um corpo.', author: 'C.S. Lewis' },
  { text: 'Não deixe que seus fracassos o definam, deixe que eles o refinem.', author: 'A.W. Tozer' },
  { text: 'A oração não é pedir. É um anseio da alma. É uma admissão diária da própria fraqueza.', author: 'Mahatma Gandhi' },
  { text: 'Um coração grato é o começo da grandeza.', author: 'James E. Faust' },
  { text: 'Deus, dá-me a serenidade para aceitar as coisas que não posso mudar, coragem para mudar as que posso e sabedoria para distinguir entre as duas.', author: 'Reinhold Niebuhr' },
  { text: 'O amor não faz o mundo girar. O amor é o que faz a viagem valer a pena.', author: 'Franklin P. Jones' },
  { text: 'O amor de Deus é como um oceano. Você pode ver o começo, mas não o fim.', author: 'Rick Warren' },
  { text: 'O Senhor te guiará continuamente.', author: 'Isaías 58:11' },
  { text: 'Quando você percebe que Deus te ama, você pode amar os outros.', author: 'Mother Teresa' },
  { text: 'Deus não exige que tenhamos sucesso, Ele só exige que você tente.', author: 'Madre Teresa de Calcutá' },
  { text: 'Fé não é saber o que o futuro guarda, mas saber quem guarda o futuro.', author: 'Autor Desconhecido' },
  { text: 'O perdão é a chave que liberta a alma.', author: 'Billy Graham' },
  { text: 'Cristo é a resposta, mesmo quando não sabemos a pergunta.', author: 'Corrie ten Boom' },
  { text: 'Nós não podemos fazer grandes coisas, apenas pequenas coisas com muito amor.', author: 'Madre Teresa de Calcutá' },
  { text: 'A maior doença do mundo hoje não é a lepra ou a tuberculose, mas sim a sensação de ser indesejado.', author: 'Madre Teresa de Calcutá' },
  { text: 'Quando colocamos nossos problemas nas mãos de Deus, Ele coloca Sua paz em nossos corações.', author: 'Autor Desconhecido' },
  { text: 'Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento.', author: 'Provérbios 3:5' },
  { text: 'A graça de Deus não faz a jornada mais fácil, mas a torna segura.', author: 'Dietrich Bonhoeffer' },
  { text: 'O amor de Deus nunca falha.', author: 'Corrie ten Boom' },
  { text: 'Jesus não é uma bengala; Ele é o caminho.', author: 'Leonard Ravenhill' },
  { text: 'Fé é ousar colocar o seu sonho à prova de Deus.', author: 'Robert Schuller' },
  { text: 'Não tenha medo do amanhã, pois Deus já está lá.', author: 'Autor Desconhecido' },
  { text: 'Quem não sabe perdoar não sabe amar.', author: 'Martin Luther King Jr.' },
  { text: 'A vida cristã não é uma vida livre de problemas, mas uma vida livre de medo.', author: 'A.W. Tozer' },
  { text: 'Seja forte e corajoso. Não se apavore nem desanime, pois o Senhor, o seu Deus, estará com você por onde você andar.', author: 'Josué 1:9' },
  { text: 'As bênçãos de Deus não são recompensas por boas ações, são dons de amor.', author: 'Billy Graham' },
  { text: 'Orar não é pedir coisas, é alinhar seu coração com o coração de Deus.', author: 'Autor Desconhecido' },
  { text: 'Deus não escolhe pessoas capacitadas, Ele capacita os escolhidos.', author: 'Albert Einstein' },
  { text: 'Em tudo, dai graças.', author: '1 Tessalonicenses 5:18' },
  { text: 'Nós aprendemos de nossos erros mais do que de nossos acertos.', author: 'Billy Graham' },
  { text: 'Onde há amor, há paz. Onde há paz, há Deus.', author: 'Autor Desconhecido' },
  { text: 'O Senhor é o meu pastor, nada me faltará.', author: 'Salmos 23:1' },
  { text: 'Se o coração estiver reto perante Deus, os passos serão retos perante os homens.', author: 'John Bunyan' },
  { text: 'Um homem só é verdadeiramente grande quando está de joelhos diante de Deus.', author: 'Ezra Taft Benson' },
  { text: 'A esperança em Deus é uma âncora para a alma.', author: 'Hebreus 6:19' },
  { text: 'Onde quer que o caminho leve, Deus está com você.', author: 'Autor Desconhecido' },
  { text: 'A Bíblia é o pão diário dos cristãos, não o bolo para ocasiões especiais.', author: 'Autor Desconhecido' },
  { text: 'Tente não se tornar um homem de sucesso, mas antes tente se tornar um homem de valor.', author: 'Albert Einstein' },
  { text: 'Quanto mais você lê a Bíblia, mais ela lê você.', author: 'Charles Spurgeon' },
  { text: 'Eu sou a luz do mundo. Quem me segue, nunca andará em trevas, mas terá a luz da vida.', author: 'João 8:12' },
  { text: 'Deus é refúgio e fortaleza, socorro bem presente na angústia.', author: 'Salmos 46:1' },
  { text: 'Tudo posso naquele que me fortalece.', author: 'Filipenses 4:13' },
  { text: 'A paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.', author: 'Filipenses 4:7' },
  { text: 'Se você não tem intenção de ouvir a Deus, por que deveria esperar que Ele o ouça?', author: 'A.W. Tozer' },
  { text: 'Não devemos nos contentar em apenas falar com Deus, mas também devemos ouvir o que Ele nos diz.', author: 'João Calvino' },
  { text: 'Fé não é a crença de que Deus fará o que você quiser. É a crença de que Deus fará o que é certo.', author: 'Max Lucado' },
  { text: 'A graça de Deus é maior que qualquer pecado nosso.', author: 'Paul Washer' },
  { text: 'A oração não muda Deus, mas muda aquele que ora.', author: 'Søren Kierkegaard' },
  { text: 'Você é a única Bíblia que alguns descrentes lerão.', author: 'John MacArthur' },
  { text: 'Deus te ama do jeito que você é, mas te ama demais para te deixar assim.', author: 'Justo L. González' },
  { text: 'Se você está caminhando com Jesus, você está indo na direção certa.', author: 'Rick Warren' },
  { text: 'O verdadeiro amigo é aquele que te aproxima de Deus.', author: 'Santo Agostinho' },
  { text: 'As promessas de Deus não têm data de validade.', author: 'Corrie ten Boom' },
  { text: 'Eu não sou o que eu deveria ser, ah, quão diferente eu sou do que eu serei, mas, pela graça de Deus, não sou o que eu costumava ser.', author: 'John Newton' },
  { text: 'A vontade de Deus nunca irá levá-lo onde a graça de Deus não possa protegê-lo.', author: 'Billy Graham' },
  { text: 'A nossa maior segurança não está em saber o que vai acontecer, mas em saber quem detém o futuro.', author: 'R.C. Sproul' },
  { text: 'Você pode ver Deus em todos os lugares se o seu coração estiver preparado.', author: 'A.W. Tozer' },
  { text: 'Apenas a graça pode nos dar asas para voarmos acima de nós mesmos.', author: 'Santo Agostinho' },
  { text: 'A fé vê o invisível, acredita no inacreditável e recebe o impossível.', author: 'Corrie ten Boom' },
  { text: 'Deus é mais glorificado em nós quando estamos mais satisfeitos nEle.', author: 'John Piper' },
  { text: 'Um homem com Deus é sempre a maioria.', author: 'John Knox' },
  { text: 'Quem não aprende a depender de Deus, não aprende nada útil.', author: 'J.I. Packer' },
  { text: 'Pregar o evangelho em todos os momentos, e se for necessário, usar palavras.', author: 'São Francisco de Assis' },
  { text: 'As lágrimas são orações também, e viajam para Deus quando não podemos falar.', author: 'Charles Spurgeon' },
  { text: 'Perdão é libertar o prisioneiro e descobrir que o prisioneiro era você.', author: 'Lewis B. Smedes' },
  { text: 'A melhor maneira de combater o diabo é com a palavra de Deus.', author: 'Martinho Lutero' },
  { text: 'A cruz não é um acidente, é o plano de Deus.', author: 'Billy Graham' },
  { text: 'Quando as provações chegam, Deus está nos purificando.', author: 'C.S. Lewis' },
  { text: 'Tudo o que Deus faz é com um propósito.', author: 'A.W. Pink' },
  { text: 'A verdadeira paz não é a ausência de tempestades, mas a presença de Deus nas tempestades.', author: 'Desconhecido' },
  { text: 'O cristão que não ora é um cristão derrotado.', author: 'Leonard Ravenhill' },
  { text: 'Nunca pare de orar, porque Deus nunca para de ouvir.', author: 'Max Lucado' },
  { text: 'Confie em Deus, mesmo quando você não entender o caminho.', author: 'C.H. Spurgeon' },
  { text: 'Deus não faz obras em corações que estão cheios de si mesmos.', author: 'Charles Spurgeon' },
  { text: 'Você nunca chegará onde Deus quer que você esteja, se continuar dando desculpas de por que não está lá agora.', author: 'Joyce Meyer' },
  { text: 'Sua vida pode ser a única Bíblia que algumas pessoas irão ler.', author: 'A.W. Tozer' },
  { text: 'As aflições não apenas revelam quem somos, mas também quem Deus é.', author: 'Timothy Keller' },
  { text: 'O evangelho nos lembra de que não há pecado maior que a graça.', author: 'John Piper' },
  { text: 'Somente Cristo pode transformar o luto em dança.', author: 'Jonathan Edwards' },
  { text: 'Uma alma cheia de Deus não teme a escuridão.', author: 'A.W. Pink' },
  { text: 'Cristo não apenas sofreu por nós, Ele também venceu por nós.', author: 'Martinho Lutero' },
  { text: 'Nunca tente viver de uma fé passada. Confie em Deus hoje.', author: 'Charles Spurgeon' },
  { text: 'Se Deus é o seu parceiro, faça os seus planos GRANDES.', author: 'D.L. Moody' },
  { text: 'As respostas de Deus são mais sábias do que as nossas perguntas.', author: 'Santo Agostinho' },
  { text: 'O céu será preenchido com aqueles que sabem que não merecem estar lá.', author: 'C.S. Lewis' },
  { text: 'Cada gota de sofrimento tem um propósito redentor.', author: 'John Piper' },
  { text: 'Se não confiarmos em Deus nas pequenas coisas, falharemos nas grandes.', author: 'Hudson Taylor' },
  { text: 'Não limite o que Deus pode fazer através de você.', author: 'Corrie ten Boom' },
  { text: 'A maior prova do amor de Deus não é que Ele nos salva da fornalha, mas que Ele entra nela conosco.', author: 'Desconhecido' },
  { text: 'A verdadeira adoração não se mede pela emoção, mas pela obediência.', author: 'John MacArthur' },
  { text: 'Fé não é esperar Deus fazer as coisas do seu jeito.', author: 'A.W. Tozer' },
  { text: 'Sua dor não é em vão. Deus a usará para o seu bem.', author: 'Rick Warren' },
  { text: 'A fraqueza não é o fim, é o lugar onde Deus começa.', author: 'C.S. Lewis' },
  { text: 'Deus nunca tem pressa, mas Ele sempre chega na hora certa.', author: 'Charles Spurgeon' },
  { text: 'Nenhum lugar é seguro fora da vontade de Deus.', author: 'Corrie ten Boom' },
  { text: 'Orar não é tentar convencer Deus a fazer a nossa vontade, mas nos render à dEle.', author: 'Billy Graham' },
  { text: 'Não julgue cada dia pela colheita que você colhe, mas pelas sementes que você planta.', author: 'Robert Louis Stevenson' },
  { text: 'Deus não procura pessoas de sucesso, Ele procura pessoas que se submetem.', author: 'A.W. Tozer' },
  { text: 'Fé não elimina as perguntas. Mas a fé sabe onde levá-las.', author: 'Elisabeth Elliot' },
  { text: 'Nossa maior fraqueza pode ser a porta para a força de Deus.', author: 'Hudson Taylor' },
  { text: 'O arrependimento é o abraço que damos na misericórdia de Deus.', author: 'Martinho Lutero' },
  { text: 'A glória de Deus não depende da nossa capacidade de compreendê-la.', author: 'John Piper' },
  { text: 'Nós fomos criados para espelhar a glória de Deus.', author: 'João Calvino' },
  { text: 'Tudo o que não provém da fé é pecado.', author: 'Apostolo Paulo' },
  { text: 'A presença de Cristo é o melhor remédio para uma mente agitada.', author: 'J.C. Ryle' },
  { text: 'O amor incondicional de Deus é a base de nossa esperança.', author: 'Timothy Keller' },
  { text: 'Quando as coisas parecem estar desmoronando, elas podem estar apenas caindo no lugar certo.', author: 'Desconhecido' },
  { text: 'Deus nos dá o necessário, nós pedimos o supérfluo.', author: 'Santo Agostinho' },
  { text: 'A fé é o pássaro que sente a luz e canta quando a madrugada ainda está escura.', author: 'Rabindranath Tagore' },
  { text: 'Nós sabemos que o mundo é de Deus, por isso nós podemos rir.', author: 'G.K. Chesterton' },
  { text: 'Sejamos os servos amados do Senhor, cheios de zelo.', author: 'Madre Teresa de Calcutá' },
  { text: 'Nenhuma verdadeira grandeza pode ser alcançada sem a ajuda de Deus.', author: 'Martinho Lutero' },
  { text: 'Deus escreve certo por linhas tortas.', author: 'Provérbio Popular' },
  { text: 'O Espírito Santo não trabalha através de métodos, mas através de pessoas.', author: 'E.M. Bounds' },
  { text: 'Sem Cristo a vida não tem esperança; sem Cristo a vida não tem sentido.', author: 'Billy Graham' },
  { text: 'Quando as forças falham, Deus assume o controle.', author: 'Autor Desconhecido' },
  { text: 'Para o cristão, o melhor ainda está por vir.', author: 'Richard Baxter' },
  { text: 'Uma alma entregue a Deus não recua.', author: 'João Calvino' },
  { text: 'Confie que a mesma mão que permite a tempestade, também controla os ventos.', author: 'Desconhecido' },
  { text: 'Fé não é sentir que Deus está lá. Fé é agir como se Ele estivesse.', author: 'Neil T. Anderson' },
  { text: 'Tudo coopera para o bem daqueles que amam a Deus.', author: 'Romanos 8:28' },
  { text: 'Lembre-se: Deus está no controle, mesmo quando a vida parece fora de controle.', author: 'Desconhecido' },
  { text: 'Deus muitas vezes quebra o nosso coração para salvar a nossa alma.', author: 'John Piper' },
  { text: 'Não devemos temer as provações, pois é o fogo que purifica o ouro.', author: 'Charles Spurgeon' },
  { text: 'A verdadeira fé não descansa até estar na presença de Deus.', author: 'A.W. Tozer' },
  { text: 'Uma Bíblia fechada não alimenta uma alma faminta.', author: 'Desconhecido' },
  { text: 'Deus não nos salva do sofrimento, Ele nos salva através dele.', author: 'Dietrich Bonhoeffer' },
  { text: 'A luz de Cristo resplandece mais brilhante nas noites mais escuras.', author: 'Charles Spurgeon' },
  { text: 'Você nunca entenderá a grandeza de Deus até que veja a sua própria pequenez.', author: 'A.W. Tozer' },
  { text: 'Deus transforma cicatrizes em estrelas.', author: 'Robert Schuller' },
  { text: 'Seja a luz no meio da escuridão.', author: 'Mateus 5:14' },
  { text: 'Quando perdemos o controle, Deus assume o leme.', author: 'Corrie ten Boom' },
  { text: 'Sua dor de hoje será sua força de amanhã.', author: 'Desconhecido' },
  { text: 'Somente Cristo pode satisfazer o coração que Ele mesmo criou.', author: 'Billy Graham' },
  { text: 'Deixe sua fé ser maior que seus medos.', author: 'Hebreus 11:1' },
  { text: 'Quem vive para agradar aos homens não pode servir a Deus.', author: 'John MacArthur' },
  { text: 'O tempo investido em oração não é tempo perdido.', author: 'E.M. Bounds' },
  { text: 'Nenhuma oração é inútil quando dirigida a um Deus amoroso.', author: 'C.S. Lewis' },
  { text: 'Aquele que perdoa é perdoado.', author: 'Mateus 6:14' },
  { text: 'Na escola de Cristo, sempre há algo novo para aprender.', author: 'J.C. Ryle' },
  { text: 'Nada pode separar-nos do amor de Deus.', author: 'Romanos 8:39' },
  { text: 'O cristão deve ser a Bíblia que o mundo vai ler.', author: 'A.W. Tozer' }
];

let content = `import { Verse } from './types';

export const christianQuotes = [\n`;

quotes.forEach((q, i) => {
  content += `  { id: 'q${i+1}', text: '${q.text.replace(/'/g, "\\'")}', author: '${q.author.replace(/'/g, "\\'")}' },\n`;
});

content += `];

export function getRandomQuote(): Verse {
    let unseen: string[] = [];
    let lastAuthor: string | null = null;
    
    try {
        const stored = localStorage.getItem('unseenQuotes');
        if (stored) {
            unseen = JSON.parse(stored);
        }
        lastAuthor = localStorage.getItem('lastQuoteAuthor');
    } catch (e) {
        console.error('Failed to parse unseenQuotes', e);
    }

    // Se estiver vazio ou todos já foram vistos, reseta o ciclo
    if (!unseen || unseen.length === 0) {
        unseen = christianQuotes.map(q => q.id);
    }
    
    // Tenta encontrar uma frase com autor diferente do último (máx 10 tentativas para não travar)
    let randomIndex = Math.floor(Math.random() * unseen.length);
    let quoteId = unseen[randomIndex];
    let quote = christianQuotes.find(q => q.id === quoteId);
    
    let attempts = 0;
    while (quote && quote.author === lastAuthor && unseen.length > 1 && attempts < 10) {
        randomIndex = Math.floor(Math.random() * unseen.length);
        quoteId = unseen[randomIndex];
        quote = christianQuotes.find(q => q.id === quoteId);
        attempts++;
    }

    // Remove o id escolhido da lista de não vistos
    unseen.splice(randomIndex, 1);
    
    try {
        localStorage.setItem('unseenQuotes', JSON.stringify(unseen));
        if (quote) {
            localStorage.setItem('lastQuoteAuthor', quote.author);
        }
    } catch (e) {
        console.error('Failed to save unseenQuotes', e);
    }

    if (!quote) {
        // fallback
        quote = christianQuotes[0];
    }

    return {
        id: quote.id,
        text: quote.text,
        reference: quote.author,
    };
}
`;

fs.writeFileSync('src/quotes.ts', content);
console.log('Successfully generated quotes file.');
