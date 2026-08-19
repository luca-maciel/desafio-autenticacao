# 📱 Desafio de Autenticação — Frontend

Frontend mobile do desafio técnico de autenticação, desenvolvido com **React Native + Expo + TypeScript**.

O aplicativo consome a API REST do backend e implementa os principais fluxos de autenticação:

- cadastro com confirmação por código enviado por e-mail;
- login;
- armazenamento do JWT;
- carregamento do usuário autenticado;
- acesso à área principal;
- recuperação de senha;
- validação de código de recuperação;
- redefinição de senha;
- validações e tratamento de erros.

---

## 📚 Sumário

- [1. Stack](#1--stack)
- [2. Estrutura do projeto](#2--estrutura-do-projeto)
- [3. Pré-requisitos](#3--pré-requisitos)
- [4. Instalação do zero — Windows](#4--instalação-do-zero--windows)
- [5. Instalação do zero — Linux](#5--instalação-do-zero--linux)
- [6. Configuração do projeto](#6--configuração-do-projeto)
- [7. Configuração da API](#7--configuração-da-api)
- [8. Executando o aplicativo](#8--executando-o-aplicativo)
- [9. Formas de execução](#9--formas-de-execução)
- [10. Fluxos disponíveis](#10--fluxos-disponíveis)
- [11. Variáveis de ambiente](#11--variáveis-de-ambiente)
- [12. Problemas comuns](#12--problemas-comuns)
- [13. Checklist de instalação](#13--checklist-de-instalação)

---

# 1. 🧱 Stack

| Tecnologia | Utilização |
|---|---|
| React Native | Aplicativo mobile |
| Expo | Runtime e ferramentas de desenvolvimento |
| TypeScript | Tipagem estática |
| React Navigation | Navegação entre telas |
| Axios | Requisições HTTP |
| Zod | Validação de dados |
| Expo Secure Store | Armazenamento do token em ambiente nativo |
| Context API | Estado global de autenticação |

O projeto utiliza Expo. Para desenvolvimento com Expo, a documentação oficial recomenda Node.js LTS e suporta Windows e Linux. citeturn691599search0turn691599search6

---

# 2. 📁 Estrutura do projeto

A estrutura atual é aproximadamente:

```text
frontend/
├── assets/
├── src/
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── navigation/
│   │   └── Routes.tsx
│   │
│   ├── schemas/
│   │   ├── login.schema.ts
│   │   └── password-recovery-schema.ts
│   │
│   ├── screens/
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ResetPasswordPage.tsx
│   │   ├── VerifyCodePage.tsx
│   │   └── VerifyPageRegister.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   └── storage.ts
│   │
│   └── types/
│       └── RoutesTypes.ts
│
├── .env.example
├── App.tsx
├── app.json
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

# 3. 📋 Pré-requisitos

Em uma máquina zerada, você precisa de:

- **Node.js LTS**
- **npm** (incluído com Node.js)
- **Git**
- **Expo Go**, caso use um celular físico
- **Android Studio**, caso queira usar um emulador Android
- Um editor de código, como VS Code

Verifique:

```bash
node --version
npm --version
git --version
```

No momento desta documentação, o site oficial do Node.js disponibiliza a linha **24.x como LTS**. Use uma versão LTS compatível com o projeto em vez de depender de uma versão Current. citeturn691599search4

---

# 4. 🪟 Instalação do zero — Windows

## 4.1 Instalar o Node.js

Baixe a versão LTS no site oficial:

https://nodejs.org/

Durante a instalação, mantenha as opções padrão.

Depois, abra um novo **PowerShell**:

```powershell
node --version
npm --version
```

---

## 4.2 Instalar o Git

Baixe o Git:

https://git-scm.com/download/win

Depois:

```powershell
git --version
```

---

## 4.3 Clonar o projeto

```powershell
git clone <URL_DO_REPOSITORIO>
cd Desafio-autenticacao
```

Entre no frontend:

```powershell
cd frontend
```

---

## 4.4 Instalar dependências

```powershell
npm install
```

Não é necessário instalar o Expo CLI globalmente para executar este projeto. Use:

```powershell
npx expo start
```

---

# 5. 🐧 Instalação do zero — Linux

## 5.1 Instalar Git

### Ubuntu/Debian

```bash
sudo apt update
sudo apt install git -y
```

Verifique:

```bash
git --version
```

---

## 5.2 Instalar Node.js LTS

Uma opção prática é utilizar o `nvm`.

Instale:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Carregue o `nvm`:

```bash
source ~/.nvm/nvm.sh
```

Instale a versão LTS 24:

```bash
nvm install 24
nvm use 24
```

Verifique:

```bash
node --version
npm --version
```

O Node oficial também documenta a utilização do nvm no Linux. citeturn691599search4

---

## 5.3 Clonar o projeto

```bash
git clone <URL_DO_REPOSITORIO>
cd Desafio-autenticacao
cd frontend
```

---

## 5.4 Instalar dependências

```bash
npm install
```

---

# 6. ⚙️ Configuração do projeto

Depois de instalar as dependências, crie o `.env` a partir do exemplo.

### Linux/macOS/Git Bash

```bash
cp .env.example .env
```

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

Depois edite o `.env`.

Exemplo:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
```

A URL deve apontar para o endereço em que a API está disponível.

---

# 7. 🌐 Configuração da API

O frontend depende do backend.

Antes de executar o aplicativo, a API precisa estar rodando.

## API no mesmo computador

No navegador/ambiente web:

```text
http://localhost:8080
```

## Android Emulator

Use:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
```

O endereço `10.0.2.2` é usado pelo Android Emulator para acessar o `localhost` da máquina hospedeira.

## Celular físico

Descubra o IP local do computador.

### Windows

```powershell
ipconfig
```

Procure o **IPv4 Address** do adaptador usado pela rede.

Exemplo:

```text
192.168.0.10
```

Então:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
```

### Linux

```bash
ip addr
```

ou:

```bash
hostname -I
```

Exemplo:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
```

O computador e o celular precisam estar na mesma rede.

> Não use `localhost` no celular físico. Nesse caso, `localhost` aponta para o próprio celular.

---

# 8. ▶️ Executando o aplicativo

Dentro de `frontend/`:

```bash
npx expo start
```

O Expo exibirá um QR Code e as opções de execução. A documentação oficial recomenda `npx expo start` para iniciar o servidor de desenvolvimento. citeturn691599search11

Para limpar o cache:

```bash
npx expo start -c
```

---

# 9. 📱 Formas de execução

## Expo Go — celular físico

Instale o Expo Go no Android ou iOS.

Depois:

```bash
npx expo start
```

Escaneie o QR Code.

Para funcionar pela rede local:

- computador e celular devem estar na mesma rede;
- a API também precisa ser acessível pelo IP do computador.

A documentação do Expo recomenda o dispositivo físico para um fluxo simples de desenvolvimento. citeturn691599search6

---

## Android Emulator

Instale o Android Studio e configure um dispositivo virtual.

Inicie:

```bash
npx expo start
```

Depois pressione:

```text
a
```

ou selecione Android no terminal do Expo.

A API, neste caso, normalmente deve usar:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
```

---

## Web

Para executar no navegador:

```bash
npx expo start --web
```

> O comportamento de módulos nativos pode variar no Web. A persistência com Secure Store deve ser validada principalmente no Android/iOS.

---

# 10. 🔐 Fluxos disponíveis

## Cadastro

```text
Register
   ↓
POST /auth/register
   ↓
API cria PendingRegistration
   ↓
Código de 6 dígitos enviado por e-mail
   ↓
VerifyPageRegister
   ↓
POST /auth/verify-register
   ↓
Código válido?
   ├── Não → mensagem de erro
   └── Sim → User criado
              ↓
            Login
```

O código é válido durante a janela definida pela API.

---

## Login

```text
Login
  ↓
POST /auth/login
  ↓
Credenciais válidas?
  ├── Não → Invalid email or password
  └── Sim → JWT
              ↓
        armazenamento
              ↓
         AuthContext
              ↓
            Home
```

Para e-mail inexistente e senha incorreta, o frontend utiliza a mesma mensagem de credenciais inválidas.

---

## Recuperação de senha

```text
Forgot Password
      ↓
informa e-mail
      ↓
POST /auth/forgot-password
      ↓
código enviado por e-mail
      ↓
VerifyCodePage
      ↓
POST /auth/verify-reset-code
      ↓
ResetPasswordPage
      ↓
POST /auth/reset-password
      ↓
Login
```

---

# 11. 🔐 Variáveis de ambiente

O frontend usa:

```env
EXPO_PUBLIC_API_URL=http://IP_DA_API:8080
```

Não coloque no frontend:

```env
JWT_SECRET=...
EMAIL_PASSWORD=...
DATABASE_URL=...
```

Segredos pertencem ao backend.

Tudo que é exposto como `EXPO_PUBLIC_*` deve ser tratado como informação pública do aplicativo.

---

# 12. 🛠️ Problemas comuns

## `Unable to connect to the server`

Verifique:

1. A API está rodando?
2. A URL no `.env` está correta?
3. O celular e o computador estão na mesma rede?
4. O firewall do computador está bloqueando a porta?
5. Você está usando `localhost` em um celular físico?

---

## Android Emulator não acessa a API

Troque:

```env
EXPO_PUBLIC_API_URL=http://localhost:8080
```

por:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
```

---

## Celular físico não acessa a API

Use o IP da máquina:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
```

No Windows, libere a porta 8080 no Firewall caso necessário.

No Linux com UFW:

```bash
sudo ufw allow 8080/tcp
```

---

## Variável `EXPO_PUBLIC_API_URL` não atualizou

Reinicie o Expo limpando o cache:

```bash
npx expo start -c
```

---

## Erro de dependências

Linux/macOS:

```bash
rm -rf node_modules
npm ci
```

Windows PowerShell:

```powershell
Remove-Item node_modules -Recurse -Force
npm ci
```

Se não houver `package-lock.json`, use:

```bash
npm install
```

---

## Erros de navegação

Os nomes das rotas precisam coincidir exatamente.

Exemplo:

```ts
navigation.navigate("Login");
```

não:

```ts
navigation.navigate("login");
```
