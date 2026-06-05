# 🐾 BenPet

O **BenPet** é um aplicativo mobile desenvolvido para tutores de pets que desejam compartilhar os momentos mais marcantes do dia a dia dos seus animais de estimação, além de contar com funcionalidades indispensáveis de localização através de mapas integrados. O projeto traz uma interface moderna e fluida inspirada nas principais redes sociais do mercado.

---

## 🚀 Funcionalidades Principais

* **Feed de Notícias Dinâmico:** Visualize postagens dos pets com suporte a curtidas em tempo real e sistema de comentários integrado.
* **Menu de Mídias Inteligente:** Compartilhe novas fotos escolhendo diretamente da galeria do seu celular ou abrindo a câmera na hora.
* **Gerenciamento de Perfil:** Menu lateral flutuante para configurações da conta e alteração rápida da foto de avatar do tutor.
* **Integração com Mapas:** Sistema de mapas nativo para localização e marcação de pontos de interesse (essencial para passeios e segurança).
* **Layout Adaptável:** Interface responsiva que previne sobreposição de componentes e garante boa usabilidade tanto em dispositivos Android quanto iOS.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando as ferramentas mais modernas do ecossistema Javascript para desenvolvimento mobile:

* **React Native** — Biblioteca para construção de interfaces nativas.
* **Expo (Expo Router)** — Framework para gerenciamento de rotas, navegação eficiente e acesso aos recursos do hardware.
* **TypeScript** — Tipagem estática para maior segurança e consistência do código.
* **Expo Image Picker** — Integração com a câmera e a biblioteca de fotos do dispositivo.
* **React Native Maps** — Renderização de mapas e coordenadas geográficas (GPS).

---

## 📦 Como Executar o Projeto

Para rodar o aplicativo localmente na sua máquina, siga os passos abaixo:

### Pré-requisitos
Certifique-se de ter o **Node.js** e o **Expo CLI** instalados em seu computador, além do aplicativo **Expo Go** no seu celular (ou um emulador configurado).

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/SEU_USUARIO/benpet.git](https://github.com/SEU_USUARIO/benpet.git) 
   cd benpet 
   npm install
   npx expo start 
   Abra o aplicativo:

Leia o QR Code gerado no terminal usando o aplicativo Expo Go no seu celular.

Ou pressione a para abrir no emulador Android / i para o simulador iOS.

👤 Autor
Desenvolvido por Arthur e equipe para fins acadêmicos e apresentação de projeto. 
---

### 💡 Como adicionar ao seu projeto pelo terminal:

Como você já está com o terminal do VS Code aberto na pasta `benpet`, você pode criar e salvar esse arquivo direto pelo Git seguindo estes passos rápidos:

1. No VS Code, crie um novo arquivo na raiz do projeto chamado exatamente **`README.md`**.
2. Cole o texto acima dentro dele (ajuste o link do clone na linha 38 com o seu link do GitHub).
3. Salve o arquivo (`Ctrl + S`).
4. No terminal, envie essa atualização para o seu GitHub rodando:
   ```powershell
   git add README.md
   git commit -m "Adicionando o README do projeto"
   git push
