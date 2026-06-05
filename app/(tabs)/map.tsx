import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Image, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

interface Pin {
  id: string;
  tipo: 'encontro' | 'petshop';
  titulo: string;
  descricao: string;
  lat: number;
  lng: number;
  foto: string;
  avaliacoes: number[];
  tags: string[];
}

export default function MapsScreen() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [filtroAtual, setFiltroAtual] = useState<'todos' | 'encontro' | 'petshop'>('todos');
  const [carregando, setCarregando] = useState(true);
  
  // Coordenadas reais do Usuário
  const [latAtual, setLatAtual] = useState<number | null>(null);
  const [lngAtual, setLngAtual] = useState<number | null>(null);

  // Modais e Seleção
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [modalAvaliarAberto, setModalAvaliarAberto] = useState(false);
  const [pinSelecionado, setPinSelecionado] = useState<Pin | null>(null);

  // Inputs de Criação
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novaFoto, setNovaFoto] = useState("");

  // Sistema de Avaliação Uber
  const [notaUber, setNotaUber] = useState(5);
  const [tagSelecionada, setTagSelecionada] = useState("");
  const tagsDisponiveis = ["Lugar limpo", "Ambiente seguro", "Espaço amplo", "Risco de golpes", "Local sujo", "Cuidado: Cão bravo"];

  const [pins, setPins] = useState<Pin[]>([]);

  // 1. Captura a localização real e gera os petshops/encontros perto do usuário
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão de localização negada! Usando localização padrão.');
        setLatAtual(-23.5505);
        setLngAtual(-46.6333);
        setCarregando(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      
      setLatAtual(latitude);
      setLngAtual(longitude);

      // Injeta os pontos dinamicamente perto da posição REAL do GPS do celular
      setPins([
        {
          id: '1',
          tipo: 'petshop',
          titulo: 'PetShop Premium da Região',
          descricao: 'Banho, tosa e clínica veterinária integrada.',
          lat: latitude + 0.002, 
          lng: longitude + 0.002,
          foto: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300',
          avaliacoes: [5, 5, 4],
          tags: ["Lugar limpo", "Ambiente seguro"]
        },
        {
          id: '2',
          tipo: 'encontro',
          titulo: 'Ponto de Encontro Central',
          descricao: 'Gramado ideal para soltar os pets à tarde.',
          lat: latitude - 0.003, 
          lng: longitude - 0.001,
          foto: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300',
          avaliacoes: [4, 3, 5],
          tags: ["Espaço amplo", "Ambiente seguro"]
        }
      ]);
      setCarregando(false);
    })();
  }, []);

  // Monitora a troca de filtros para evitar travamento de pins órfãos selecionados
  useEffect(() => {
    if (pinSelecionado && filtroAtual !== 'todos' && pinSelecionado.tipo !== filtroAtual) {
      setPinSelecionado(null);
    }
  }, [filtroAtual]);

  const calcularMedia = (avaliacoes: number[]) => {
    if (avaliacoes.length === 0) return "5.0";
    return (avaliacoes.reduce((a, b) => a + b, 0) / avaliacoes.length).toFixed(1);
  };

  // 2. Cadastrar novo Pin baseado estritamente na localização visível
  const salvarNovoPin = () => {
    if (!novoTitulo) {
      alert("O nome do Pin é obrigatório!");
      return;
    }

    const novo: Pin = {
      id: String(Date.now()),
      tipo: 'encontro',
      titulo: novoTitulo,
      descricao: novaDescricao || "Ponto marcado via GPS do tutor.",
      lat: latAtual || -23.5505,
      lng: lngAtual || -46.6333,
      foto: novaFoto || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300",
      avaliacoes: [5],
      tags: ["Novo Local"]
    };

    setPins([novo, ...pins]);
    setModalCriarAberto(false);
    setNovoTitulo("");
    setNovaDescricao("");
    setNovaFoto("");
    alert("Local cadastrado exatamente na sua posição atual!");
  };

  // 3. Submeter avaliação estilo Uber
  const finalizarAvaliacaoUber = () => {
    if (!pinSelecionado) return;

    setPins(prevPins => prevPins.map(p => {
      if (p.id === pinSelecionado.id) {
        return {
          ...p,
          avaliacoes: [...p.avaliacoes, notaUber],
          tags: tagSelecionada ? [...p.tags, tagSelecionada] : p.tags
        };
      }
      return p;
    }));

    setModalAvaliarAberto(false);
    setPinSelecionado(null);
    setTagSelecionada("");
    alert("Avaliação registrada com sucesso!");
  };

  // Variável computada para renderização dinâmica (corrige o bug de sumiço)
  const pinsFiltrados = pins.filter(pin => {
    if (filtroAtual === 'todos') return true;
    return pin.tipo === filtroAtual;
  });

  if (carregando || !latAtual || !lngAtual) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Buscando satélites e petshops próximos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <MapView
  key={pins.length} // <<< ISSO AQUI FORÇA O MAPA A RE-RENDERIZAR E MOSTRAR OS PINS NA HORA
  style={styles.map}
  showsUserLocation={true}
  initialRegion={{
    latitude: latAtual,
    longitude: lngAtual,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  }}
>
  {pinsFiltrados.map(pin => (
    <Marker
      key={pin.id}
      coordinate={{ latitude: pin.lat, longitude: pin.lng }}
      onPress={() => setPinSelecionado(pin)} 
      tracksViewChanges={true} // Mudado para true temporariamente para forçar a primeira aparição física do ícone
      stopPropagation={true} 
      centerOffset={{ x: 0, y: -20 }} 
    >
      <View 
        style={[styles.markerIcon, pin.tipo === 'petshop' ? styles.bgPetshop : styles.bgEncontro]}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Text style={{ fontSize: 18 }}>{pin.tipo === 'encontro' ? '🐾' : '🏪'}</Text>
      </View>
    </Marker>
  ))}
</MapView>

      {/* BALÃO / CARD DE INFORMAÇÕES DO PIN SELECIONADO */}
      {pinSelecionado && !modalAvaliarAberto && (
        <View style={styles.infoCalloutCard}>
          <View style={styles.calloutHeader}>
            <Image source={{ uri: pinSelecionado.foto }} style={styles.calloutImage} />
            <View style={styles.calloutDetails}>
              <Text style={styles.calloutTitle}>{pinSelecionado.titulo}</Text>
              <Text style={styles.calloutRating}>⭐ {calcularMedia(pinSelecionado.avaliacoes)} de 5</Text>
              <Text style={styles.calloutDesc} numberOfLines={2}>{pinSelecionado.descricao}</Text>
              <Text style={styles.calloutTags}>Tags: {pinSelecionado.tags.slice(-2).join(" • ")}</Text>
            </View>
          </View>
          
          <View style={styles.calloutActionsRow}>
            <TouchableOpacity style={styles.btnAvaliarCallout} onPress={() => setModalAvaliarAberto(true)}>
              <Text style={styles.btnAvaliarText}>Avaliar Local</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFecharCallout} onPress={() => setPinSelecionado(null)}>
              <Text style={styles.btnFecharText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* MODAL: CADASTRO DE UM NOVO PIN */}
      <Modal animationType="slide" transparent={true} visible={modalCriarAberto}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Cadastrar Novo Pin Público</Text>
            <Text style={styles.modalSubtitle}>O pin será fixado na sua geolocalização atual automaticamente.</Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="Nome do Pin (Obrigatório)" 
              value={novoTitulo} 
              onChangeText={setNovoTitulo}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Descrição (ex: Parquinho seguro com grama)" 
              value={novaDescricao} 
              onChangeText={setNovaDescricao}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Link de uma foto do local (Opcional)" 
              value={novaFoto} 
              onChangeText={setNovaFoto}
            />

            <TouchableOpacity style={styles.btnConfirmar} onPress={salvarNovoPin}>
              <Text style={styles.btnText}>Salvar e Publicar Pin</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalCriarAberto(false)}>
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL: AVALIAÇÃO ESTILO UBER */}
      <Modal animationType="fade" transparent={true} visible={modalAvaliarAberto}>
        <View style={styles.modalOverlay}>
          <View style={styles.uberCard}>
            <Text style={styles.uberTitle}>Avaliação do Local</Text>
            <Text style={styles.uberSub}>{pinSelecionado?.titulo}</Text>

            {/* Estrelas do Uber */}
            <View style={styles.uberStarsRow}>
              {[1, 2, 3, 4, 5].map((estrela) => (
                <TouchableOpacity key={estrela} onPress={() => setNotaUber(estrela)}>
                  <Text style={[styles.uberStarText, notaUber >= estrela ? styles.starYellow : styles.starGray]}>★</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Deixe uma mensagem rápida:</Text>
            <View style={styles.tagsContainer}>
              {tagsDisponiveis.map((tag) => (
                <TouchableOpacity 
                  key={tag} 
                  style={[styles.tagChip, tagSelecionada === tag && styles.tagChipActive]} 
                  onPress={() => setTagSelecionada(tag)}
                >
                  <Text style={[styles.tagChipText, tagSelecionada === tag && styles.tagChipTextActive]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.btnConfirmar} onPress={finalizarAvaliacaoUber}>
              <Text style={styles.btnText}>Confirmar Nota ({notaUber} ★)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalAvaliarAberto(false)}>
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SUB-MENU EXPANSÍVEL */}
      {menuAberto && (
        <View style={styles.floatingMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setFiltroAtual('encontro'); setMenuAberto(false); }}>
            <Text>🐾 Encontros Disponíveis</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setFiltroAtual('petshop'); setMenuAberto(false); }}>
            <Text>🏪 Petshops Próximos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setFiltroAtual('todos'); setMenuAberto(false); }}>
            <Text>🌍 Ver Todos do Mapa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, styles.bgMenuAction]} onPress={() => { setModalCriarAberto(true); setMenuAberto(false); }}>
            <Text style={styles.textMenuAction}>📍 Criar Novo Pin Aqui</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* BOTÃO + FLUTUANTE */}
      <TouchableOpacity style={styles.fab} onPress={() => setMenuAberto(!menuAberto)}>
        <Text style={styles.fabText}>{menuAberto ? '✕' : '+'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  map: { ...StyleSheet.absoluteFillObject },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  markerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  bgEncontro: { backgroundColor: '#A29BFE' },
  bgPetshop: { backgroundColor: '#00CEC9' },

  infoCalloutCard: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  calloutHeader: { flexDirection: 'row', gap: 12 },
  calloutImage: { width: 75, height: 75, borderRadius: 10, backgroundColor: '#EEE' },
  calloutDetails: { flex: 1 },
  calloutTitle: { fontWeight: 'bold', fontSize: 16, color: '#000' },
  calloutRating: { color: '#F1C40F', fontWeight: 'bold', fontSize: 13, marginVertical: 2 },
  calloutDesc: { fontSize: 12, color: '#555', lineHeight: 16 },
  calloutTags: { fontSize: 11, color: '#888', fontWeight: 'bold', marginTop: 4 },
  calloutActionsRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btnAvaliarCallout: { flex: 2, backgroundColor: '#000', height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  btnAvaliarText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  btnFecharCallout: { flex: 1, height: 40, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  btnFecharText: { color: '#333', fontSize: 13 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  modalSubtitle: { fontSize: 12, color: '#666', marginBottom: 15 },
  input: { backgroundColor: '#F3F3F3', height: 48, borderRadius: 8, paddingHorizontal: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E0E0E0' },

  uberCard: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, alignItems: 'center' },
  uberTitle: { fontSize: 19, fontWeight: 'bold' },
  uberSub: { fontSize: 13, color: '#666', marginTop: 2, marginBottom: 15 },
  uberStarsRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  uberStarText: { fontSize: 44 },
  starYellow: { color: '#F1C40F' },
  starGray: { color: '#E0E0E0' },
  sectionLabel: { fontSize: 13, fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: 8 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tagChip: { backgroundColor: '#F0F0F0', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
  tagChipActive: { backgroundColor: '#000' },
  tagChipText: { color: '#333', fontSize: 12 },
  tagChipTextActive: { color: '#FFF', fontWeight: 'bold' },

  btnConfirmar: { backgroundColor: '#000', width: '100%', height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  btnCancelar: { width: '100%', height: 40, justifyContent: 'center', alignItems: 'center', marginTop: 5 },
  btnCancelarText: { color: '#777', textDecorationLine: 'underline' },

  floatingMenu: { position: 'absolute', bottom: 95, right: 25, backgroundColor: '#FFF', borderRadius: 12, padding: 6, width: 220, elevation: 5 },
  menuItem: { paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  bgMenuAction: { backgroundColor: '#F0EEFF', borderBottomWidth: 0, borderRadius: 8, marginTop: 4 },
  textMenuAction: { color: '#6C5CE7', fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 25, right: 25, backgroundColor: '#000', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { color: '#FFF', fontSize: 26 }
});