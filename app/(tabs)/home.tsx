import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, FlatList, Modal } from "react-native"; 
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';

export default function ScreenHome() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const tutorLogado = (params.owner as string) || "Arthur";
  const petLogado = (params.petName as string) || "Snoop";
  const fotoLogado = (params.profileImage as string) || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";

  const [menuPerfilAberto, setMenuPerfilAberto] = useState(false);
  const [menuMidiaAberto, setMenuMidiaAberto] = useState(false);
  const [imagemPerfilAtual, setImagemPerfilAtual] = useState(fotoLogado);

  const [posts, setPosts] = useState([
    {
      id: '1',
      petName: petLogado,
      owner: tutorLogado,
      image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600',
      description: 'Hoje o dia foi de muita preguiça! 🐾',
      curtido: false,
      totalCurtidas: 12,
      comentarios: [
        { id: '1', autor: 'Carla', texto: 'Que fofura! 😍' }
      ]
    }
  ]);
  
  const [novoTexto, setNovoTexto] = useState("");
  const [imagemSelecionada, setImagemSelecionada] = useState<string | null>(null);
  const [comentarioDigitado, setComentarioDigitado] = useState<{ [key: string]: string }>({});

  const alterarFotoPerfil = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert("Precisamos de permissão para acessar suas fotos!");
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!resultado.canceled) {
      setImagemPerfilAtual(resultado.assets[0].uri);
      setMenuPerfilAberto(false);
      alert("Foto de perfil atualizada!");
    }
  };

  const escolherGaleria = async () => {
    setMenuMidiaAberto(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert("Precisamos de permissão para acessar suas fotos!");
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });
    if (!resultado.canceled) setImagemSelecionada(resultado.assets[0].uri);
  };

  const abrirCamera = async () => {
    setMenuMidiaAberto(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert("Precisamos de permissão para usar a câmera!");
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!resultado.canceled) setImagemSelecionada(resultado.assets[0].uri);
  };

  const criarNovoPost = () => {
    if (novoTexto.trim() === "" && !imagemSelecionada) return;

    const novoPost = {
      id: String(Date.now()),
      petName: petLogado,
      owner: tutorLogado,
      image: imagemSelecionada || 'https://images.dog.ceo/breeds/pug/n02110972_1163.jpg', 
      description: novoTexto,
      curtido: false,
      totalCurtidas: 0,
      comentarios: []
    };

    setPosts([novoPost, ...posts]);
    setNovoTexto("");
    setImagemSelecionada(null);
  };

  const alternarCurtir = (id: string) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          curtido: !post.curtido,
          totalCurtidas: post.curtido ? post.totalCurtidas - 1 : post.totalCurtidas + 1
        };
      }
      return post;
    }));
  };

  const adicionarComentario = (postId: string) => {
    const texto = comentarioDigitado[postId];
    if (!texto || texto.trim() === "") return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comentarios: [...post.comentarios, { id: String(Date.now()), autor: tutorLogado, texto: texto }]
        };
      }
      return post;
    }));

    setComentarioDigitado({ ...comentarioDigitado, [postId]: "" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.logoText}>BenPet</Text>
        <TouchableOpacity 
          style={styles.avatarInstagramContainer} 
          onPress={() => setMenuPerfilAberto(true)}
          activeOpacity={0.8}
        >
          <Image source={{ uri: imagemPerfilAtual }} style={styles.avatarInstagram} />
        </TouchableOpacity>
      </View>

      <FlatList 
        data={posts}
        keyExtractor={(item) => item.id} 
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={(
          <View style={styles.createPostBox}>
            <View style={styles.headerForm}>
              <Image source={{ uri: imagemPerfilAtual }} style={styles.avatarSmall} />
              <TextInput
                style={styles.input}
                placeholder={`O que o ${petLogado} está aprontando?`}
                placeholderTextColor="#999"
                value={novoTexto}
                onChangeText={setNovoTexto}
              />
            </View>

            {imagemSelecionada && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: imagemSelecionada }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removePreviewBtn} onPress={() => setImagemSelecionada(null)}>
                  <Text style={styles.removePreviewText}>✕ Remover</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* SEÇÃO DE MÍDIA ADAPTÁVEL (ABRE PARA BAIXO DINAMICAMENTE) */}
            <View style={styles.mediaSectionContainer}>
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={[styles.mediaPlusButton, menuMidiaAberto && styles.mediaPlusButtonAtivo]} 
                  onPress={() => setMenuMidiaAberto(!menuMidiaAberto)}
                >
                  <Text style={styles.mediaPlusText}>{menuMidiaAberto ? "✕ Fechar" : "＋ Mídia"}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.postButton} onPress={criarNovoPost}>
                  <Text style={styles.postButtonText}>Publicar</Text>
                </TouchableOpacity>
              </View>

              {menuMidiaAberto && (
                <View style={styles.inlineMediaMenu}>
                  <TouchableOpacity style={styles.inlineMediaItem} onPress={escolherGaleria}>
                    <Text style={styles.inlineMediaText}>🖼️ Abrir Galeria</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.inlineMediaItem, { borderLeftWidth: 1, borderColor: '#EAEAEA' }]} onPress={abrirCamera}>
                    <Text style={styles.inlineMediaText}>📸 Abrir Câmera</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}

        renderItem={({item}) => (
          <View style={styles.postCard}> 
            <View style={styles.header}> 
              <Image source={{ uri: item.owner === tutorLogado ? imagemPerfilAtual : fotoLogado }} style={styles.avatarSmall} />
              <Text style={styles.ownerText}>
                {item.petName} 
                <Text style={styles.ownerSubText}> de {item.owner}</Text>
              </Text>
            </View>

            <Image source={{ uri: item.image }} style={styles.postImage} />
            
            <View style={styles.interactionBar}>
              <TouchableOpacity onPress={() => alternarCurtir(item.id)}>
                <Text style={styles.heartIcon}>{item.curtido ? "❤️" : "🤍"}</Text>
              </TouchableOpacity>
              <Text style={styles.likesText}>{item.totalCurtidas} curtidas</Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.description}>
                <Text style={{ fontWeight: 'bold' }}>{item.petName}: </Text>
                {item.description}
              </Text>

              <View style={styles.commentsSection}>
                {item.comentarios.map((coment) => (
                  <Text key={coment.id} style={styles.commentText}>
                    <Text style={{ fontWeight: 'bold' }}>{coment.autor}: </Text>
                    {coment.texto}
                  </Text>
                ))}
              </View>

              <View style={styles.commentInputRow}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Adicione um comentário..."
                  placeholderTextColor="#999"
                  value={comentarioDigitado[item.id] || ""}
                  onChangeText={(txt) => setComentarioDigitado({ ...comentarioDigitado, [item.id]: txt })}
                />
                <TouchableOpacity onPress={() => adicionarComentario(item.id)}>
                  <Text style={styles.sendCommentBtn}>Publicar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={menuPerfilAberto}
        onRequestClose={() => setMenuPerfilAberto(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setMenuPerfilAberto(false)}
        >
          <View style={styles.profileMenuCard}>
            <Text style={styles.menuTitle}>Opções da Conta</Text>
            
            <TouchableOpacity style={styles.menuItem} onPress={alterarFotoPerfil}>
              <Text style={styles.textAlterar}>📷 Alterar foto de perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, { borderTopWidth: 1, borderColor: '#F0F0F0' }]} 
              onPress={() => {
                setMenuPerfilAberto(false);
                router.replace("/autentificacao");
              }}
            >
              <Text style={styles.textSair}>🚪 Sair do aplicativo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnFecharModal} onPress={() => setMenuPerfilAberto(false)}>
              <Text style={styles.textFecharModal}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
} 

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  topBar: { width: '100%', height: 60, backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#EAEAEA', marginTop: 30 },
  logoText: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  
  avatarInstagramContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4A90E2',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInstagram: { width: '100%', height: '100%', borderRadius: 20 },

  createPostBox: { backgroundColor: '#FFF', padding: 15, borderBottomWidth: 1, borderBottomColor: '#EAEAEA' },
  headerForm: { flexDirection: 'row', alignItems: 'center' },
  avatarSmall: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  previewContainer: { marginTop: 15, position: 'relative' },
  imagePreview: { width: '100%', height: 200, borderRadius: 10 },
  removePreviewBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', padding: 6, borderRadius: 15 },
  removePreviewText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  
  // Nova estrutura de controle flexível para a área do botão de mídias
  mediaSectionContainer: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F5F5F5' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mediaPlusButton: { backgroundColor: '#F0F2F5', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  mediaPlusButtonAtivo: { backgroundColor: '#333' },
  mediaPlusText: { fontWeight: 'bold', color: '#333', fontSize: 14 },
  
  // Menu inline em formato de barra horizontal expansível (Empurra a FlatList para baixo perfeitamente)
  inlineMediaMenu: { flexDirection: 'row', backgroundColor: '#FAFAFA', borderRadius: 12, marginTop: 12, borderWidth: 1, borderColor: '#EAEAEA', overflow: 'hidden' },
  inlineMediaItem: { flex: 1, padding: 12, alignItems: 'center', justifyContent: 'center' },
  inlineMediaText: { fontSize: 13, color: '#333', fontWeight: '600' },

  postButton: { backgroundColor: '#000', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
  postButtonText: { color: '#FFF', fontWeight: 'bold' },
  postCard: { backgroundColor: '#FFF', marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#EAEAEA' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  ownerText: { fontWeight: 'bold', fontSize: 16 },
  ownerSubText: { fontWeight: 'normal', color: '#666' },
  postImage: { width: '100%', height: 350 },
  interactionBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 10, gap: 10 },
  heartIcon: { fontSize: 24 },
  likesText: { fontWeight: 'bold', fontSize: 14 },
  footer: { paddingHorizontal: 12, paddingBottom: 15 }, 
  description: { fontSize: 14, marginTop: 5 },
  commentsSection: { marginTop: 8, paddingLeft: 5, gap: 4 },
  commentText: { fontSize: 13, color: '#333' },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 8 },
  commentInput: { flex: 1, fontSize: 13, color: '#333' },
  sendCommentBtn: { color: '#3897f0', fontWeight: 'bold', marginLeft: 10 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  profileMenuCard: { backgroundColor: '#FFF', width: '80%', borderRadius: 16, padding: 20, alignItems: 'center', elevation: 5 },
  menuTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#222' },
  menuItem: { width: '100%', paddingVertical: 14, alignItems: 'center' },
  textAlterar: { color: '#4A90E2', fontWeight: '600', fontSize: 15 },
  textSair: { color: '#E74C3C', fontWeight: '600', fontSize: 15 },
  btnFecharModal: { marginTop: 10, paddingTop: 10, width: '100%', alignItems: 'center' },
  textFecharModal: { color: '#999', fontSize: 14 }
});