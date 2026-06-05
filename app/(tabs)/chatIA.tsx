import { StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native";
import { useState } from "react";

// Dados padronizados com propriedades em minúsculo (boa prática)
const DATA = [
  {
    id: '1', 
    pergunta: 'Qual é o calendário de vacinação?', 
    resposta: 'Filhotes precisam de um ciclo de vacinas (como a V8 ou V10 para cães, e V3, V4 ou V5 para gatos) e da vacina antirrábica.'
  },
  {
    id: '2', 
    pergunta: 'Como proteger contra pulgas e carrapatos?', 
    resposta: 'A prevenção deve ser contínua através de coleiras, comprimidos ou pipetas. A periodicidade varia de acordo com o produto escolhido.'
  },
  {
    id: '3', 
    pergunta: 'Qual ração devo escolher?', 
    resposta: 'A alimentação deve ser adequada à idade (filhote, adulto, sênior) e ao porte do animal. Rações classificadas como Premium ou Super Premium possuem melhor absorção de nutrientes. Evite dar comida de humano, pois muitos alimentos são tóxicos para os pets.'
  },
  {
    id: '4', 
    pergunta: 'Como ensinar o pet a fazer necessidades no lugar certo?', 
    resposta: 'A regra de ouro é o reforço positivo. Sempre que o pet acertar o local correto, recompense-o com um petisco e muito carinho. Brigar ou esfregar o focinho do animal no lugar errado só causa medo e não ensina.'
  },
  {
    id: '5', 
    pergunta: 'Com que frequência devo ir ao veterinário?', 
    resposta: 'A regra geral é realizar check-ups anuais para pets adultos e a cada 6 meses para animais idosos. Isso previne doenças silenciosas e mantém o controle de vermífugos e antipulgas em dia.'
  },
  {
    id: '6', 
    pergunta: 'De quanto em quanto tempo devo alimentar meus peixes?', 
    resposta: '1 a 2 vezes por dia já é o suficiente. Apenas o que eles conseguirem comer em até 2 ou 3 minutos. O excesso de ração apodrece e polui a água rapidamente.'
  },
  {
    id: '7', 
    pergunta: 'Por que meu gato não bebe água na vasilha?', 
    resposta: 'Eles não gostam que os bigodes encostem nas bordas do pote e evitam água perto da comida. Use fontes de água para gatos, espalhe potes largos pela casa e mantenha-os longe da ração e da caixa de areia.'
  },
  {
    id: '8', 
    pergunta: 'O que é o "Enriquecimento Ambiental" e por que é vital?', 
    resposta: 'Animais exóticos mantêm instintos selvagens fortes. Se ficarem trancados sem estímulo, eles estressam e adocem. O ambiente precisa simular a natureza com brinquedos, galhos, túneis ou pedras.'
  },
];

export default function ChatScreen() {
  // Guardamos o ID do item aberto. Se for null, nenhum está aberto.
  const [itemAbertoId, setItemAbertoId] = useState<string | null>(null);

  const alternarItem = (id: string) => {
    // Se clicar no que já está aberto, ele fecha (vira null). Se não, abre o novo.
    setItemAbertoId(itemAbertoId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Central de Ajuda Pet</Text>
      
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const estaAberto = itemAbertoId === item.id;

          return (
            <View style={[styles.card, estaAberto && styles.cardAberto]}>
              <TouchableOpacity 
                style={styles.perguntaButton} 
                onPress={() => alternarItem(item.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.perguntaText, estaAberto && styles.perguntaTextAberto]}>
                  {item.pergunta}
                </Text>
                {/* Indicador visual de abrir/fechar */}
                <Text style={[styles.seta, estaAberto && styles.setaAberta]}>
                  {estaAberto ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {/* A resposta só renderiza se o card estiver aberto */}
              {estaAberto && (
                <View style={styles.respostaContainer}>
                  <Text style={styles.respostaText}>{item.resposta}</Text>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  listContainer: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    // Sombra leve e elegante
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  cardAberto: {
    borderColor: '#4A90E2',
    backgroundColor: '#FFF',
  },
  perguntaButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    gap: 12,
  },
  perguntaText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    lineHeight: 20,
  },
  perguntaTextAberto: {
    color: '#4A90E2',
  },
  seta: {
    fontSize: 12,
    color: '#999999',
  },
  setaAberta: {
    color: '#4A90E2',
  },
  respostaContainer: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderColor: '#F5F5F5',
    paddingTop: 12,
  },
  respostaText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 22,
  },
});