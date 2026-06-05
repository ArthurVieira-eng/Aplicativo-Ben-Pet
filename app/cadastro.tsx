import { useRouter } from "expo-router";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from "react-native"; 
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';

export default function CadastroScreen() { 
  const router = useRouter();

  // Estados dos dados de cadastro
  const [usuario, setUsuario] = useState("");
  const [nomePet, setNomePet] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  // Lógica para abrir a galeria
  const escolherFotoPerfil = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert("Precisamos de permissão para acessar suas fotos!");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!resultado.canceled) {
      setFotoPerfil(resultado.assets[0].uri);
    }
  };

  // Máscara de CPF automática (000.000.000-00)
  const formatarCpf = (texto: string) => {
    const apenasNumeros = texto.replace(/\D/g, "");
    let cpfFormatado = apenasNumeros;

    if (apenasNumeros.length > 3) cpfFormatado = `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
    if (apenasNumeros.length > 6) cpfFormatado = `${cpfFormatado.slice(0, 7)}.${cpfFormatado.slice(7)}`;
    if (apenasNumeros.length > 9) cpfFormatado = `${cpfFormatado.slice(0, 11)}-${cpfFormatado.slice(11, 13)}`;

    setCpf(cpfFormatado);
  };

  // Envia os dados criados direto para a Home
  const handleFinalizarCadastro = () => {
    if (!usuario || !nomePet || !email || !senha) {
      alert("Por favor, preencha os campos obrigatórios!");
      return;
    }

    router.replace({
      pathname: '/(tabs)/home',
      params: {
        owner: usuario,
        petName: nomePet,
        profileImage: fotoPerfil || "https://via.placeholder.com/150"
      }
    });
  };
 
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>❮ Voltar para o Login</Text>
      </TouchableOpacity>

      <Text style={styles.titleText}>Crie sua conta BenPet</Text> 

      {/* Seletor do Avatar */}
      <TouchableOpacity style={styles.avatarContainer} onPress={escolherFotoPerfil}>
        {fotoPerfil ? (
          <Image source={{ uri: fotoPerfil }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>+ Foto do Perfil</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Seu Nome de Usuário"
        placeholderTextColor="#100"
        value={usuario}
        onChangeText={setUsuario}
      />

      <TextInput
        style={styles.input}
        placeholder="Nome do seu Pet"
        placeholderTextColor="#100"
        value={nomePet}
        onChangeText={setNomePet}
      />

      <TextInput
        style={styles.input}
        placeholder="CPF (000.000.000-00)"
        placeholderTextColor="#100"
        keyboardType="numeric"
        maxLength={14}
        value={cpf}
        onChangeText={formatarCpf}
      />

      <TextInput 
        style={styles.input}
        placeholder="Seu melhor Email"
        placeholderTextColor="#100"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      /> 

      <TextInput
        style={styles.input} 
        placeholder="Crie uma Senha estável"
        placeholderTextColor="#100"
        secureTextEntry={true}
        value={senha}
        onChangeText={setSenha}
      /> 

      <TouchableOpacity 
        style={styles.button}
        onPress={handleFinalizarCadastro}
      >
        <Text style={styles.buttonText}>Cadastrar e Entrar</Text> 
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 40,
    backgroundColor: '#fff', 
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginBottom: 10,
    padding: 10,
  },
  backButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55, 
    borderWidth: 2,
    borderColor: '#000',
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  avatarPlaceholderText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 12,
  },
  input: {
    width: '90%',           
    height: 50,             
    backgroundColor: '#F3F3F3', 
    borderRadius: 10,       
    paddingHorizontal: 15,  
    fontSize: 16,
    marginTop: 15,          
    borderWidth: 1,         
    borderColor: '#E0E0E0',
  },
  button: {
    width: '90%',
    backgroundColor: '#000000', 
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});