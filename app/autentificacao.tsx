import { useRouter } from "expo-router";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from "react-native"; 
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';

export default function LoginScreen() { 
  const router = useRouter();
  
  // Estados para armazenar os dados digitados
  const [usuario, setUsuario] = useState("");
  const [nomePet, setNomePet] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  // Função para abrir a galeria e escolher a foto de perfil
  const selecionarFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissao.granted) {
      alert("Precisamos de permissão para acessar suas fotos!");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1], // Força um corte quadrado (estilo Instagram)
      quality: 0.5,
    });

    if (!resultado.canceled) {
      setFotoPerfil(resultado.assets[0].uri);
    }
  };

  // Função simples para aplicar máscara de CPF (000.000.000-00) enquanto digita
  const lidarComCpf = (texto: string) => {
    const apenasNumeros = texto.replace(/\D/g, "");
    let cpfFormatado = apenasNumeros;

    if (apenasNumeros.length > 3) cpfFormatado = `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
    if (apenasNumeros.length > 6) cpfFormatado = `${cpfFormatado.slice(0, 7)}.${cpfFormatado.slice(7)}`;
    if (apenasNumeros.length > 9) cpfFormatado = `${cpfFormatado.slice(0, 11)}-${cpfFormatado.slice(11, 13)}`;

    setCpf(cpfFormatado);
  };

  // Envia os dados para a Home através dos parâmetros da rota
  const irParaHome = () => {
    router.replace({
      pathname: '/(tabs)/home',
      params: {
        owner: usuario || 'Tutor',
        petName: nomePet || 'Pet',
        profileImage: fotoPerfil || 'https://via.placeholder.com/150'
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.baseText}>Bem Vindo ao BenPet!</Text> 

      {/* Seletor de Foto Estilo Instagram */}
      <TouchableOpacity style={styles.avatarContainer} onPress={selecionarFoto}>
        {fotoPerfil ? (
          <Image source={{ uri: fotoPerfil }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>+ Foto</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nome do Tutor"
        placeholderTextColor="#999"
        value={usuario}
        onChangeText={setUsuario}
      />

      <TextInput
        style={styles.input}
        placeholder="Nome do Pet (Ex: Snoop)"
        placeholderTextColor="#999"
        value={nomePet}
        onChangeText={setNomePet}
      />

      <TextInput
        style={styles.input}
        placeholder="CPF (000.000.000-00)"
        placeholderTextColor="#999"
        keyboardType="numeric"
        maxLength={14}
        value={cpf}
        onChangeText={lidarComCpf}
      />

      <TextInput 
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      /> 

      <TextInput
        style={styles.input} 
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry={true}
        value={senha}
        onChangeText={setSenha}
      /> 

      <TouchableOpacity style={styles.button} onPress={irParaHome}>
        <Text style={styles.buttonText}>Entrar</Text> 
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  baseText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#A29BFE',
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'dashed',
  },
  avatarPlaceholderText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 14,
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#333',
  },
  button: {
    width: '90%',
    backgroundColor: '#000000',
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});