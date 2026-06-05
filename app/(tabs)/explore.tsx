import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useState } from "react";

const PRODUTOS_FORNECEDORES: { [key: string]: any[] } = {
  "PetShop Banho & Cãofre": [
    { id: "1", nome: "Ração Premium Adulto", marca: "BenNutri", preco: 10.99, imagem: "https://images.unsplash.com/photo-1589924691106-0741494abc9e?q=80&w=150" },
    { id: "2", nome: "Mordedor de Borracha", marca: "BenPlay", preco: 8.99, imagem: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=150" }
  ],
  "Clínica Vet Vida": [
    { id: "3", nome: "Shampoo Antialérgico", marca: "VetCare", preco: 24.50, imagem: "https://images.unsplash.com/photo-1608454504242-a42227869434?q=80&w=150" },
    { id: "4", nome: "Petisco Funcional Articulações", marca: "VetCare", preco: 15.00, imagem: "https://images.unsplash.com/photo-1591561954555-6079686b5156?q=80&w=150" }
  ]
};

export default function ExploreScreen() {
  const [fornecedor, setFornecedor] = useState("PetShop Banho & Cãofre");
  const [carrinho, setCarrinho] = useState<{ [key: string]: number }>({ "1": 1, "2": 1 });
  const [freteExpresso, setFreteExpresso] = useState(false);
  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);

  const produtosAtuais = PRODUTOS_FORNECEDORES[fornecedor];

  const alterarQuantidade = (id: string, operacao: 'mais' | 'menos') => {
    setCarrinho(prev => {
      const qtdAtual = prev[id] || 0;
      if (operacao === 'mais') return { ...prev, [id]: qtdAtual + 1 };
      if (operacao === 'menos' && qtdAtual > 0) return { ...prev, [id]: qtdAtual - 1 };
      return prev;
    });
  };

  const aplicarCupom = () => {
    if (cupom.toUpperCase() === "BENPET10") {
      setDesconto(5.00);
    } else {
      alert("Cupom inválido");
      setDesconto(0);
    }
  };

  // Cálculos matemáticos reais
  let subtotal = 0;
  produtosAtuais.forEach(p => {
    const qtd = carrinho[p.id] || 0;
    subtotal += p.preco * qtd;
  });

  const valorFrete = freteExpresso ? 7.50 : 0;
  const valorTotal = Math.max(0, subtotal + valorFrete + 2.00 - desconto);

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}><Text style={styles.headerTitle}>Fornecedores</Text></View>
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Abas funcionais de Fornecedores */}
        <Text style={styles.sectionTitle}>1. SELECIONE O FORNECEDOR</Text>
        <View style={styles.tabContainer}>
          {Object.keys(PRODUTOS_FORNECEDORES).map(f => (
            <TouchableOpacity 
              key={f} 
              style={[styles.tab, fornecedor === f && styles.tabAtiva]} 
              onPress={() => { setFornecedor(f); setCarrinho({}); setDesconto(0); }}
            >
              <Text style={[styles.tabText, fornecedor === f && styles.tabTextAtivo]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Opções de Entrega na tela */}
        <Text style={styles.sectionTitle}>2. TIPO DE ENTREGA</Text>
        <View style={styles.deliveryRow}>
          <TouchableOpacity style={[styles.checkBtn, !freteExpresso && styles.checkBtnAtivo]} onPress={() => setFreteExpresso(false)}>
            <Text style={styles.checkText}>Padrão (Grátis)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.checkBtn, freteExpresso && styles.checkBtnAtivo]} onPress={() => setFreteExpresso(true)}>
            <Text style={styles.checkText}>Expressa (+$7.50)</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Itens do Fornecedor Atual */}
        <Text style={styles.sectionTitle}>3. PRODUTOS DISPONÍVEIS</Text>
        {produtosAtuais.map(item => {
          const qtd = carrinho[item.id] || 0;
          return (
            <View key={item.id} style={styles.itemCard}>
              <Image source={{ uri: item.imagem }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemBrand}>{item.marca}</Text>
                <Text style={styles.itemName}>{item.nome}</Text>
                <Text style={styles.itemPrice}>${item.preco.toFixed(2)}</Text>
                <View style={styles.quantityRow}>
                  <TouchableOpacity style={styles.qBtn} onPress={() => alterarQuantidade(item.id, 'menos')}><Text>-</Text></TouchableOpacity>
                  <Text style={styles.qText}>{qtd}</Text>
                  <TouchableOpacity style={styles.qBtn} onPress={() => alterarQuantidade(item.id, 'mais')}><Text>+</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}

        {/* Input de cupom funcional */}
        <Text style={styles.sectionTitle}>4. CUPOM DE DESCONTO</Text>
        <View style={styles.couponRow}>
          <TextInput style={styles.couponInput} placeholder="Digite BENPET10" value={cupom} onChangeText={setCupom} />
          <TouchableOpacity style={styles.couponBtn} onPress={aplicarCupom}><Text style={{color:'#FFF', fontWeight:'bold'}}>Aplicar</Text></TouchableOpacity>
        </View>

        {/* Resumo Financeiro Dinâmico */}
        <View style={styles.billingContainer}>
          <View style={styles.bRow}><Text>Subtotal</Text><Text>${subtotal.toFixed(2)}</Text></View>
          <View style={styles.bRow}><Text>Frete</Text><Text>${valorFrete.toFixed(2)}</Text></View>
          <View style={styles.bRow}><Text>Taxas</Text><Text>$2.00</Text></View>
          {desconto > 0 && <View style={styles.bRow}><Text style={{color:'green'}}>Desconto</Text><Text style={{color:'green'}}>-${desconto.toFixed(2)}</Text></View>}
          <View style={[styles.bRow, {borderTopWidth:1, borderColor:'#EEE', paddingTop:10, marginTop:10}]}><Text style={{fontWeight:'bold'}}>Total</Text><Text style={{fontWeight:'bold', fontSize:16}}>${valorTotal.toFixed(2)}</Text></View>
        </View>

        <TouchableOpacity style={styles.orderBtn} onPress={() => { alert(`Pedido feito no valor de $${valorTotal.toFixed(2)}!`); setCarrinho({}); }}><Text style={styles.orderBtnText}>Place Order</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerBar: { paddingTop: 50, paddingBottom: 15, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#555', marginTop: 20, marginBottom: 10 },
  tabContainer: { flexDirection: 'row', gap: 10 },
  tab: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, alignItems: 'center', backgroundColor: '#F9F9F9' },
  tabAtiva: { backgroundColor: '#000', borderColor: '#000' },
  tabText: { color: '#555', fontWeight: '500' },
  tabTextAtivo: { color: '#FFF' },
  deliveryRow: { flexDirection: 'row', gap: 10 },
  checkBtn: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#EEE', borderRadius: 8, alignItems: 'center' },
  checkBtnAtivo: { borderColor: '#A29BFE', backgroundColor: '#F4F3FF' },
  checkText: { fontWeight: 'bold', fontSize: 13 },
  itemCard: { flexDirection: 'row', padding: 10, borderWidth: 1, borderColor: '#F0F0F0', borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  itemImage: { width: 65, height: 65, borderRadius: 8 },
  itemDetails: { flex: 1, marginLeft: 12 },
  itemBrand: { fontSize: 11, color: '#999' },
  itemName: { fontSize: 14, fontWeight: 'bold' },
  itemPrice: { fontSize: 14, color: '#000', fontWeight: 'bold', marginTop: 2 },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 5 },
  qBtn: { backgroundColor: '#EAEAEA', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  qText: { fontSize: 14, fontWeight: 'bold' },
  couponRow: { flexDirection: 'row', gap: 10 },
  couponInput: { flex: 1, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: 10, height: 45 }, // <-- CORRIGIDO AQUI
  couponBtn: { backgroundColor: '#000', justifyContent: 'center', paddingHorizontal: 15, borderRadius: 8 },
  billingContainer: { marginTop: 20, backgroundColor: '#FAFAFA', padding: 12, borderRadius: 8 },
  bRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  orderBtn: { backgroundColor: '#000', padding: 15, borderRadius: 25, alignItems: 'center', marginTop: 20 },
  orderBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});