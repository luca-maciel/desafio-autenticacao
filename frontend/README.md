# 📱 Desafio de Autenticação --- Mobile

Aplicativo mobile desenvolvido com **React Native + Expo + TypeScript**,
responsável pela interface do fluxo completo de autenticação.

O aplicativo consome uma API RESTful desenvolvida em Node.js/Express.

------------------------------------------------------------------------

## 📌 Funcionalidades

-   Cadastro
-   Login
-   Armazenamento seguro do token
-   Autenticação persistente
-   Context API para controle de autenticação
-   Rota privada
-   Dashboard/Home
-   Logout
-   Recuperação de senha
-   Solicitação de código por e-mail
-   Validação do código
-   Redefinição de senha
-   Validação dos formulários
-   Tratamento de erros da API

------------------------------------------------------------------------

# 🧱 Stack

  Tecnologia          Função
  ------------------- -------------------------------------
  React Native        Desenvolvimento mobile
  Expo                Ambiente e ferramentas React Native
  TypeScript          Tipagem estática
  React Navigation    Navegação
  Axios               Requisições HTTP
  Expo Secure Store   Armazenamento seguro do token
  Context API         Estado global de autenticação

------------------------------------------------------------------------

# 📁 Estrutura

Uma estrutura aproximada:

``` text
mobile/
├── src/
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── VerifyCodePage.tsx
│   │   └── ResetPasswordPage.tsx
│   │
│   ├── services/
│   │   ├── axios.ts
│   │   └── storage.ts
│   │
│   ├── types/
│   │   └── RoutesTypes.ts
│   │
│   └── routes/
│       └── Routes.tsx
│
├── App.tsx
├── package.json
├── tsconfig.json
└── README.md
```

Os nomes e a organização podem variar conforme a versão final do
projeto.

------------------------------------------------------------------------

# 🚀 Como executar

## 1. Pré-requisitos

Instale:

-   Node.js
-   npm
-   Expo CLI (opcional)
-   Expo Go, caso utilize um dispositivo físico
-   Android Studio, caso utilize emulador Android

Confira:

``` bash
node --version
npm --version
```

------------------------------------------------------------------------

## 2. Clonar o projeto

``` bash
git clone <URL_DO_REPOSITORIO>
cd mobile
```

------------------------------------------------------------------------

## 3. Instalar dependências

``` bash
npm install
```

------------------------------------------------------------------------

# 🔌 Configuração da API

O aplicativo precisa conseguir acessar a API.

Durante o desenvolvimento, a API pode estar executando em:

``` text
http://localhost:8080
```

Porém, existe uma diferença importante:

### Android Emulator

Para um Android Emulator padrão, o computador normalmente é acessado
através de:

``` text
http://10.0.2.2:8080
```

### Dispositivo físico

Se estiver utilizando um celular conectado à mesma rede Wi-Fi do
computador, utilize o IP local da máquina.

Exemplo:

``` text
http://192.168.0.10:8080
```

O celular e o computador precisam estar na mesma rede.

### ⚠️ Não utilize `localhost` no celular

No dispositivo físico:

``` text
http://localhost:8080
```

aponta para o próprio celular, não para o computador onde a API está
rodando.

------------------------------------------------------------------------

# ▶️ Executando o aplicativo

Execute:

``` bash
npx expo start
```

Depois escolha:

``` text
Android
```

ou escaneie o QR Code utilizando o Expo Go.

Para limpar o cache:

``` bash
npx expo start -c
```

------------------------------------------------------------------------

# 🧭 Navegação

O aplicativo utiliza React Navigation.

Fluxo principal:

``` text
Login
 ├── Register
 ├── Forgot Password
 │     └── Verify Code
 │            └── Reset Password
 │
 └── Home
```

------------------------------------------------------------------------

# 🔐 Contexto de autenticação

O `AuthContext` controla o estado global de autenticação.

O fluxo é:

``` text
App inicia
   ↓
AuthContext
   ↓
procura token armazenado
   ↓
existe token?
  /       \
não       sim
 |         |
Login   consulta usuário
           |
        usuário válido
           |
          Home
```

O contexto também mantém o usuário autenticado disponível para as telas.

------------------------------------------------------------------------

# 💾 Armazenamento do token

O projeto utiliza um serviço de storage para armazenar o JWT.

No mobile, é utilizado:

``` text
expo-secure-store
```

O objetivo é evitar armazenar o token em texto puro em uma solução
inadequada.

O serviço possui operações equivalentes a:

``` text
saveToken()
getToken()
removeToken()
```

------------------------------------------------------------------------

# 🌐 Comunicação com a API

As requisições são realizadas utilizando Axios.

Exemplo:

``` ts
await axios.post(
  "http://IP_DA_API:8080/auth/login",
  {
    email,
    password,
  }
);
```

Para requisições autenticadas, o token é enviado como:

``` http
Authorization: Bearer SEU_TOKEN
```

------------------------------------------------------------------------

# 👤 Cadastro

Tela:

``` text
RegisterPage
```

O usuário informa:

-   nome;
-   e-mail;
-   senha;
-   confirmação da senha.

A aplicação valida os dados antes de enviar para a API.

A API também valida os dados, pois o backend não deve confiar nas
validações do frontend.

------------------------------------------------------------------------

# 🔑 Login

Tela:

``` text
LoginPage
```

Fluxo:

``` text
e-mail + senha
      ↓
POST /auth/login
      ↓
JWT
      ↓
SecureStore
      ↓
AuthContext
      ↓
Home
```

------------------------------------------------------------------------

# 🔒 Rota privada

Após o login, o aplicativo utiliza o token para acessar recursos
protegidos.

Se não houver token válido, o usuário não deve acessar a área privada.

------------------------------------------------------------------------

# 🚪 Logout

O logout remove o token armazenado.

Fluxo:

``` text
Logout
  ↓
removeToken()
  ↓
usuário desautenticado
  ↓
Login
```

------------------------------------------------------------------------

# 🔁 Recuperação de senha

O aplicativo possui três telas:

``` text
ForgotPasswordPage
        ↓
VerifyCodePage
        ↓
ResetPasswordPage
```

------------------------------------------------------------------------

## 1. Forgot Password

O usuário informa o e-mail.

A aplicação valida localmente:

``` text
campo vazio?
    ↓
email possui formato válido?
```

Se estiver válido:

``` http
POST /auth/forgot-password
```

Body:

``` json
{
  "email": "lucas@email.com"
}
```

A API gera um código e envia por e-mail.

------------------------------------------------------------------------

## 2. Verify Code

O usuário recebe um código de 6 dígitos.

Exemplo:

``` text
731204
```

A tela envia:

``` http
POST /auth/verify-reset-code
```

``` json
{
  "email": "lucas@email.com",
  "code": "731204"
}
```

Se o código:

-   existir;
-   pertencer ao e-mail;
-   não estiver expirado;

o usuário avança para a redefinição de senha.

------------------------------------------------------------------------

## 3. Reset Password

O usuário informa:

-   nova senha;
-   confirmação da nova senha.

A aplicação verifica se as senhas são iguais.

Depois envia:

``` http
POST /auth/reset-password
```

``` json
{
  "email": "lucas@email.com",
  "code": "731204",
  "password": "NovaSenha123"
}
```

A API valida novamente o código e altera a senha utilizando bcrypt.

Depois disso, o usuário pode voltar ao Login.

------------------------------------------------------------------------

# 🎨 Validação de formulários

O frontend realiza validações para melhorar a experiência do usuário.

Exemplo de e-mail:

``` text
lucas
```

Resultado:

``` text
Please enter a valid email address.
```

Exemplo de confirmação de senha:

``` text
Senha:           NovaSenha123
Confirmação:     NovaSenha456
```

Resultado:

``` text
Passwords do not match.
```

Essas validações não substituem as validações do backend.

------------------------------------------------------------------------

# 🧪 Testando o aplicativo

## Fluxo de cadastro

1.  Abra o aplicativo.
2.  Acesse Register.
3.  Informe nome, e-mail e senha.
4.  Finalize o cadastro.
5.  Volte para Login.

------------------------------------------------------------------------

## Fluxo de login

1.  Informe e-mail.
2.  Informe senha.
3.  Faça login.
4.  O token será armazenado.
5.  O usuário será direcionado para Home.

------------------------------------------------------------------------

## Fluxo de recuperação

1.  Na tela de Login, selecione `Forgot password?`.
2.  Informe um e-mail cadastrado.
3.  Solicite o código.
4.  Verifique o e-mail.
5.  Digite o código de 6 dígitos.
6.  Crie uma nova senha.
7.  Volte para Login.
8.  Entre utilizando a nova senha.

------------------------------------------------------------------------

# 🐛 Problemas comuns

## API não conecta no celular

Se estiver usando um celular físico, não utilize:

``` text
localhost
```

Use o IP local da máquina:

``` text
http://192.168.x.x:8080
```

Confira também:

-   celular e computador na mesma rede;
-   firewall;
-   porta 8080 liberada;
-   API em execução.

------------------------------------------------------------------------

## Android Emulator não acessa localhost

Use:

``` text
http://10.0.2.2:8080
```

------------------------------------------------------------------------

## Expo apresenta problemas de cache

Execute:

``` bash
npx expo start -c
```

------------------------------------------------------------------------

## Token não persiste

Confira:

-   `expo-secure-store` instalado;
-   `storage.ts`;
-   `AuthContext`;
-   logs de `getToken()` e `saveToken()`.

------------------------------------------------------------------------

## Erro de dependências

Execute:

``` bash
rm -rf node_modules
npm install
```

Se o projeto estiver utilizando `package-lock.json`, normalmente é
preferível:

``` bash
rm -rf node_modules
npm ci
```

------------------------------------------------------------------------

# 🔐 Segurança

O aplicativo não deve armazenar:

-   senha do usuário;
-   App Password do Gmail;
-   JWT_SECRET;
-   credenciais da API.

O token de autenticação é armazenado através do SecureStore no mobile.

As credenciais do e-mail ficam exclusivamente no backend.

------------------------------------------------------------------------

# 🔗 Comunicação entre projetos

O sistema completo possui duas aplicações:

``` text
┌─────────────────────┐
│       MOBILE        │
│ React Native / Expo │
└──────────┬──────────┘
           │
           │ HTTP / JSON
           ▼
┌─────────────────────┐
│         API         │
│ Node + Express      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│       SQLite        │
│       Prisma        │
└─────────────────────┘
```

Para recuperação de senha:

``` text
Mobile
  ↓
API
  ↓
Prisma / SQLite
  ↓
Nodemailer
  ↓
Gmail
  ↓
E-mail do usuário
```

------------------------------------------------------------------------

# 📋 Checklist para executar o projeto

## Backend

-   [ ] Node.js instalado
-   [ ] Repositório clonado
-   [ ] `npm install`
-   [ ] `.env` configurado
-   [ ] App Password do Gmail configurada
-   [ ] Prisma migration executada
-   [ ] Prisma Client gerado
-   [ ] API iniciada na porta 8080

## Mobile

-   [ ] Node.js instalado
-   [ ] Expo configurado
-   [ ] `npm install`
-   [ ] URL da API configurada
-   [ ] Celular/emulador conectado
-   [ ] `npx expo start`
-   [ ] Aplicativo aberto

------------------------------------------------------------------------

# 👨‍💻 Autor

Lucas

Projeto desenvolvido para estudo e avaliação técnica.