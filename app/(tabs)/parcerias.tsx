import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Linking } from "react-native";
import { useState } from "react";

const DATA_PARCERIAS = [
  { id: '1', nome: 'PetShop Banho & Cãofre', categoria: 'Estética', cupom: '15% OFF', tel: '5511999999999' },
  { id: '2', nome: 'Clínica Vet Vida', categoria: 'Veterinária', cupom: '10% OFF Consultas', tel: '5511888888888' },
  { id: '3', nome: 'Hotel Estrela Pet', categoria: 'Hospedagem', cupom: '20% OFF Diária', tel: '5511777777777' }
];

export default function ParceriasScreen() {
  const [busca, setBusca] = useState("");

  // Filtro funcional ativo por digitação
  const dadosFiltrados = DATA_PARCERIAS.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) || 
    p.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  const irParaWhats = (tel: string, nome: string) => {
    const url = `whatsapp://send?phone=${tel}&text=Olá, quero resgatar meu cupom do BenPet na ${nome}!`;
    Linking.openURL(url).catch(() => alert("Instale o WhatsApp para resgatar."));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Parcerias BenPet 🎁</Text>
        <TextInput style={styles.search} placeholder="Buscar por nome ou categoria..." value={busca} onChangeText={setBusca} />
      </View>

      <FlatList
        data={dadosFiltrados}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 15 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>Nenhum parceiro encontrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cat}>{item.categoria}</Text>
              <Text style={styles.nome}>{item.nome}</Text>
              <View style={styles.badge}><Text style={styles.badgeText}>{item.cupom}</Text></View>
            </View>
            <TouchableOpacity style={styles.btn} onPress={() => irParaWhats(item.tel, item.nome)}>
              <Text style={styles.btnText}>Cupom</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { backgroundColor: '#FFF', paddingHorizontal: 15, paddingTop: 50, paddingBottom: 15, borderBottomWidth: 1, borderColor: '#EEE' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  search: { backgroundColor: '#F5F5F5', height: 40, borderRadius: 8, paddingHorizontal: 12, fontSize: 14 },
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EAEAEA' },
  cat: { fontSize: 11, fontWeight: 'bold', color: '#A29BFE', textTransform: 'uppercase' },
  nome: { fontSize: 15, fontWeight: 'bold', color: '#333', marginVertical: 2 },
  badge: { backgroundColor: '#E8F5E9', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 5, alignSelf: 'flex-start', marginTop: 4 },
  badgeText: { color: '#2E7D32', fontSize: 12, fontWeight: 'bold' },
  btn: { backgroundColor: '#000', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 6 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 }
});