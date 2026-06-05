import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function PostDetailsScreen() {
  const router = useRouter();
  const [likes, setLikes] = useState(42);
  const [isLiked, setIsLiked] = useState(false);
  const [comentarios, setComentarios] = useState([
    { id: "1", usuario: "Clara", texto: "Que fofinho! Lembra muito o meu." },
    { id: "2", usuario: "Marcos", texto: "Onde comprou esse mordedor?" }
  ]);
  const [novoComentario, setNovoComentario] = useState("");

  const enviarComentario = () => {
    if (novoComentario.trim() === "") return;
    setComentarios([...comentarios, { id: String(Date.now()), usuario: "Você", texto: novoComentario }]);
    setNovoComentario("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backText}>❮ Voltar</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Publicação</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView>
        <Image source={{ uri: 'https://images.dog.ceo/breeds/pug/n02110972_1163.jpg' }} style={styles.postImage} />
        
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => { setIsLiked(!isLiked); setLikes(isLiked ? likes - 1 : likes + 1); }}>
            <Text style={{ fontSize: 24 }}>{isLiked ? "❤️" : "🤍"}</Text>
          </TouchableOpacity>
          <Text style={styles.likesText}>{likes} curtidas</Text>
        </View>

        <Text style={styles.description}>
          <Text style={{ fontWeight: 'bold' }}>Snoop: </Text>Hoje o dia rendeu muito passeio no parque com direito a petiscos! 🐾
        </Text>

        <View style={styles.commentSection}>
          <Text style={styles.commentTitle}>Comentários ({comentarios.length})</Text>
          {comentarios.map(c => (
            <View key={c.id} style={styles.commentCard}>
              <Text style={{ fontWeight: 'bold' }}>{c.usuario}: <Text style={{ fontWeight: 'normal', color: '#333' }}>{c.texto}</Text></Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput style={styles.input} placeholder="Adicione um comentário..." value={novoComentario} onChangeText={setNovoComentario} />
        <TouchableOpacity onPress={enviarComentario}><Text style={styles.sendText}>Postar</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { paddingTop: 50, paddingBottom: 15, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEE' },
  backText: { color: '#A29BFE', fontWeight: 'bold' },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  postImage: { width: '100%', height: 350 },
  actions: { flexDirection: 'row', alignItems: 'center', padding: 15, gap: 10 },
  likesText: { fontWeight: 'bold' },
  description: { paddingHorizontal: 15, fontSize: 14, color: '#333' },
  commentSection: { padding: 15, borderTopWidth: 1, borderColor: '#F5F5F5', marginTop: 15 },
  commentTitle: { fontWeight: 'bold', marginBottom: 10, color: '#555' },
  commentCard: { paddingVertical: 6 },
  inputRow: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#EEE', alignItems: 'center', backgroundColor: '#FFF' },
  input: { flex: 1, height: 40, backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: 15 },
  sendText: { color: '#3897f0', fontWeight: 'bold', marginLeft: 10 }
});