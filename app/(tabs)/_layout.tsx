// BLOCO 1: Importação das Ferramentas
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// BLOCO 2: A Função Principal e a Casca do Painel
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#A29BFE', // Cor do ícone quando selecionado (Roxo)
        headerShown: true,               // Mostra o título da tela no topo
      }}
    >
      {/* BLOCO 3: O Registro de Cada Tela */}
      
      {/* 1. ABA DO FEED */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'BenPet',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 2. ABA DO MAPA */}
      <Tabs.Screen
        name="map"
        options={{
          title: 'Encontros',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 3. ABA DA IA (CHATBOT) */}
      <Tabs.Screen
        name="chatIA"
        options={{
          title: 'PetChat AI',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 4. ABA DE PARCERIAS */}
      <Tabs.Screen
        name="parcerias"
        options={{
          title: 'Guia Pet',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'business' : 'business-outline'} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
  name="explore" // Certifique-se de manter o nome exato do seu arquivo atual
  options={{
    title: 'Compras', // Mude aqui para o nome que você quiser (ex: Descobrir, Buscar, Pets)
    tabBarIcon: ({ color, focused }) => (
      // Usando um ícone de bússola ou lupa. Altere o nome do ícone se usar outra biblioteca
      <Ionicons name={focused ? 'compass' : 'compass-outline'} size={24} color={color} />
    ),
  }}
/>

    </Tabs>
  ); // BLOCO 4: O Fechamento
}