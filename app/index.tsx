import { useRouter } from "expo-router";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native"; 
import { useState } from "react";

export default function LoginScreen() { 
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLoginSimples = () => {
    // Validação básica ou login simulado com dados padrão
    router.replace({
      pathname: '/(tabs)/home',
      params: {
        owner: "Arthur",
        petName: "Snoop",
        profileImage: "https://via.placeholder.com/150"
      }
    });
  };
 
  return (
    <View style={styles.container}>
      <Text style={styles.baseText}>Bem Vindo ao BenPet!</Text> 

      <TextInput 
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#100"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      /> 

      <TextInput
        style={styles.input} 
        placeholder="Senha"
        placeholderTextColor="#100"
        secureTextEntry={true}
        value={senha}
        onChangeText={setSenha}
      /> 

      <TouchableOpacity 
        style={styles.button}
        onPress={handleLoginSimples}
      >
        <Text style={styles.buttonText}>Entrar</Text> 
      </TouchableOpacity>

      {/* Botão funcional para navegar até a nova tela de cadastro */}
      <TouchableOpacity 
        style={styles.registerLink}
        onPress={() => router.push("/cadastro")}
      >
        <Text style={styles.registerLinkText}>Não tem uma conta? Cadastre-se</Text> 
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
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
  },
  registerLink: {
    marginTop: 20,
    padding: 10,
  },
  registerLinkText: {
    color: '#555',
    fontSize: 14,
    textDecorationLine: 'underline',
  }
});