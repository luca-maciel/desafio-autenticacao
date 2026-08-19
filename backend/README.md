# 🔐 Desafio de Autenticação — Backend

API RESTful do desafio técnico de autenticação, desenvolvida com **Node.js + Express + TypeScript + Prisma + SQLite**.

A API é responsável por:

- cadastro;
- confirmação do cadastro por código enviado por e-mail;
- login;
- geração e validação de JWT;
- rota autenticada;
- consulta do usuário autenticado;
- recuperação de senha;
- validação de código de recuperação;
- redefinição de senha;
- persistência de dados com Prisma/SQLite;
- validação de entradas com Zod;
- envio de e-mails com Nodemailer.

---

## 📚 Sumário

- [1. Stack](#1--stack)
- [2. Estrutura do projeto](#2--estrutura-do-projeto)
- [3. Pré-requisitos](#3--pré-requisitos)
- [4. Instalação do zero — Windows](#4--instalação-do-zero--windows)
- [5. Instalação do zero — Linux](#5--instalação-do-zero--linux)
- [6. Configuração do ambiente](#6--configuração-do-ambiente)
- [7. Configuração do Gmail](#7--configuração-do-gmail)
- [8. Prisma e SQLite](#8--prisma-e-sqlite)
- [9. Executando a API](#9--executando-a-api)
- [10. Endpoints](#10--endpoints)
- [11. Fluxos](#11--fluxos)
- [12. Testando com Postman/Insomnia/curl](#12--testando-com-postmaninsomniacurl)
- [13. Problemas comuns](#13--problemas-comuns)
- [14. Segurança](#14--segurança)
- [15. Checklist](#15--checklist)

---

# 1. 🧱 Stack

| Tecnologia | Utilização |
|---|---|
| Node.js | Runtime |
| TypeScript | Desenvolvimento tipado |
| Express | Servidor HTTP |
| Prisma 7 | ORM |
| SQLite | Banco de dados |
| better-sqlite3 | Adapter do SQLite |
| bcrypt | Hash e comparação de senhas/códigos |
| jsonwebtoken | JWT |
| Zod | Validação dos dados |
| Nodemailer | Envio de e-mails |
| CORS | Comunicação com frontend |
| dotenv | Variáveis de ambiente |
| tsx/nodemon | Desenvolvimento |

O projeto utiliza Prisma 7 com client gerado localmente e SQLite.

---

# 2. 📁 Estrutura do projeto

```text
backend/
├── generated/
│   └── prisma/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── lib/
│   │   └── prisma.ts
│   │
│   ├── middlewares/
│   │   └── auth.middleware.ts
│   │
│   ├── repositories/
│   │   ├── passwordReset.repository.ts
│   │   ├── pendingRegister.repository.ts
│   │   └── user.repository.ts
│   │
│   ├── routes/
│   │   └── auth.routes.ts
│   │
│   ├── schemas/
│   │   └── auth.schema.ts
│   │
│   ├── services/
│   │   ├── email.service.ts
│   │   └── user.service.ts
│   │
│   ├── types/
│   │   └── express.d.ts
│   │
│   ├── utils/
│   │   └── jwt.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── .env.example
├── package.json
├── package-lock.json
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

---

# 3. 📋 Pré-requisitos

Em uma máquina zerada:

- **Node.js LTS**
- **npm**
- **Git**
- uma conta Gmail para o envio dos códigos por e-mail, caso queira testar esse recurso;
- Postman, Insomnia, Thunder Client ou `curl` para testar manualmente a API.

Verifique:

```bash
node --version
npm --version
git --version
```

Use uma versão LTS do Node.js. O site oficial atualmente disponibiliza a série 24.x como LTS. 

---

# 4. 🪟 Instalação do zero — Windows

## 4.1 Node.js

Baixe o Node.js LTS:

https://nodejs.org/

Após instalar, abra o PowerShell:

```powershell
node --version
npm --version
```

---

## 4.2 Git

Instale:

https://git-scm.com/download/win

Verifique:

```powershell
git --version
```

---

## 4.3 Clonar o projeto

```powershell
git clone <URL_DO_REPOSITORIO>
cd Desafio-autenticacao
cd backend
```

---

## 4.4 Instalar dependências

```powershell
npm install
```

---

# 5. 🐧 Instalação do zero — Linux

## 5.1 Git

Ubuntu/Debian:

```bash
sudo apt update
sudo apt install git -y
```

---

## 5.2 Node.js LTS

Instale `nvm`:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Carregue:

```bash
source ~/.nvm/nvm.sh
```

Instale e selecione Node 24:

```bash
nvm install 24
nvm use 24
```

Verifique:

```bash
node --version
npm --version
```

---

## 5.3 Clonar e instalar

```bash
git clone <URL_DO_REPOSITORIO>
cd Desafio-autenticacao/backend
npm install
```

---

# 6. 🔐 Configuração do ambiente

Crie o `.env`.

### Linux/macOS/Git Bash

```bash
cp .env.example .env
```

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

O `.env` deve conter pelo menos:

```env
DATABASE_URL="file:./dev.db"

JWT_SECRET="replace-with-a-long-random-secret"

EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-gmail-app-password"
```

### `DATABASE_URL`

Aponta para o banco SQLite:

```env
DATABASE_URL="file:./dev.db"
```

### `JWT_SECRET`

É a chave usada para assinar os JWTs.

Use uma chave longa e aleatória:

```env
JWT_SECRET="a-very-long-random-secret"
```

Nunca coloque esse valor no Git.

### `EMAIL_USER`

Conta Gmail usada pelo Nodemailer para enviar os e-mails.

### `EMAIL_PASSWORD`

Use uma **Google App Password**, não a senha normal da conta Google.

---

# 7. 📧 Configuração do Gmail

Para o fluxo de cadastro e recuperação de senha funcionar, o backend precisa conseguir enviar e-mails.

No Google Account:

1. habilite a verificação em duas etapas;
2. abra a área de App Passwords;
3. crie uma App Password para o projeto;
4. coloque essa senha no `.env`.

Exemplo:

```env
EMAIL_USER="seuemail@gmail.com"
EMAIL_PASSWORD="abcdefghijklmnop"
```

### Erro `535-5.7.8`

Se aparecer:

```text
535-5.7.8 Username and Password not accepted
```

verifique:

- `EMAIL_USER`;
- `EMAIL_PASSWORD`;
- se está usando App Password;
- se a verificação em duas etapas está habilitada;
- se o `.env` foi carregado;
- se a API foi reiniciada depois de alterar o `.env`.

---

# 8. 🗄️ Prisma e SQLite

Depois de configurar o `.env`:

```bash
npx prisma generate
```

Aplique as migrations:

```bash
npx prisma migrate dev
```

O projeto possui migrations para:

- tabela `User`;
- tabela `PasswordReset`;
- tabela `PendingRegistration`.

O Prisma Client é gerado em:

```text
generated/prisma/
```

---

## Prisma Studio

Para visualizar o banco:

```bash
npx prisma studio
```

Isso permite consultar:

```text
User
PasswordReset
PendingRegistration
```

---

# 9. ▶️ Executando a API

Em desenvolvimento:

```bash
npm run dev
```

A API normalmente ficará disponível em:

```text
http://localhost:8080
```

Caso o `package.json` do seu clone utilize outra porta, siga a porta configurada no servidor.

Para permitir acesso pelo celular na rede local, o servidor precisa estar acessível pelo IP da máquina e a porta deve estar liberada no firewall.

---

# 10. 🔌 Endpoints

Base URL:

```text
http://localhost:8080
```

## Cadastro

```http
POST /auth/register
```

Body:

```json
{
  "name": "Lucas",
  "email": "lucas@email.com",
  "password": "Senha123!"
}
```

A API:

1. valida os dados;
2. verifica se o e-mail já existe;
3. gera código de 6 dígitos;
4. gera hash da senha;
5. gera hash do código;
6. cria/atualiza `PendingRegistration`;
7. envia o código por e-mail.

A conta só é criada em `User` após a confirmação.

---

## Confirmar cadastro

```http
POST /auth/verify-register
```

Body:

```json
{
  "email": "lucas@email.com",
  "code": "123456"
}
```

Se o código for válido:

```text
PendingRegistration
        ↓
User
        ↓
PendingRegistration removido
```

---

## Login

```http
POST /auth/login
```

Body:

```json
{
  "email": "lucas@email.com",
  "password": "Senha123!"
}
```

Resposta de sucesso:

```json
{
  "token": "JWT_TOKEN"
}
```

Quando o e-mail não existe ou a senha está errada, a API retorna `401` com a mesma mensagem:

```json
{
  "error": "Invalid email or password"
}
```

Isso evita revelar se uma conta existe.

---

## Usuário autenticado

```http
GET /auth/me
```

Header:

```http
Authorization: Bearer JWT_TOKEN
```

---

## Teste de rota privada

```http
GET /auth/privateTest
```

Header:

```http
Authorization: Bearer JWT_TOKEN
```

---

## Solicitar recuperação de senha

```http
POST /auth/forgot-password
```

Body:

```json
{
  "email": "lucas@email.com"
}
```

A API gera um código de 6 dígitos, com validade limitada, e o envia por e-mail.

A resposta não revela se o e-mail existe.

---

## Validar código de recuperação

```http
POST /auth/verify-reset-code
```

Body:

```json
{
  "email": "lucas@email.com",
  "code": "123456"
}
```

---

## Redefinir senha

```http
POST /auth/reset-password
```

Body:

```json
{
  "email": "lucas@email.com",
  "code": "123456",
  "password": "NewPassword123!"
}
```

---

# 11. 🔄 Fluxos

## Cadastro

```text
POST /auth/register
        ↓
Validação
        ↓
E-mail já cadastrado?
   ┌────┴────┐
  SIM       NÃO
   │          │
   ▼          ▼
  400    gera código
             ↓
        hash do código
             ↓
        hash da senha
             ↓
    PendingRegistration
             ↓
        envia e-mail
             ↓
     /auth/verify-register
             ↓
      código válido?
       ┌─────┴─────┐
      NÃO         SIM
       │            │
      400       cria User
                    ↓
             remove Pending
                    ↓
                   201
```

---

## Login

```text
POST /auth/login
       ↓
getUserByEmail()
       ↓
usuário existe?
   ┌───┴────┐
  NÃO      SIM
   │         │
  401    bcrypt.compare()
             ↓
        senha válida?
        ┌────┴────┐
       NÃO       SIM
        │          │
       401       JWT
                   ↓
                 200
```

---

## Recuperação de senha

```text
POST /auth/forgot-password
          ↓
   procura usuário
          ↓
   gera código
          ↓
   salva código
          ↓
   envia e-mail
          ↓
POST /auth/verify-reset-code
          ↓
   código válido?
       ┌──┴──┐
      NÃO   SIM
       │      │
      400    OK
              ↓
POST /auth/reset-password
              ↓
        valida código
              ↓
         hash da senha
              ↓
       atualiza User
              ↓
     remove código
              ↓
             200
```

---

# 12. 🧪 Testando com Postman/Insomnia/curl

## Teste de cadastro

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Lucas\",\"email\":\"lucas@example.com\",\"password\":\"Senha123!\"}"
```

---

## Teste de verificação do cadastro

```bash
curl -X POST http://localhost:8080/auth/verify-register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"lucas@example.com\",\"code\":\"123456\"}"
```

Substitua `123456` pelo código recebido.

---

## Teste de login

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"lucas@example.com\",\"password\":\"Senha123!\"}"
```

---

## Teste de `/me`

```bash
curl http://localhost:8080/auth/me \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

# 13. 🛠️ Problemas comuns

## Prisma Client não reconhece um model

Execute:

```bash
npx prisma migrate dev
npx prisma generate
```

Depois reinicie:

```bash
npm run dev
```

---

## `database` não encontrado

Confira:

```env
DATABASE_URL="file:./dev.db"
```

Depois:

```bash
npx prisma migrate dev
npx prisma generate
```

---

## API funciona no PC, mas não no celular

Use o IP da máquina, não `localhost`.

Exemplo:

```text
http://192.168.0.10:8080
```

### Windows

Confirme o IPv4:

```powershell
ipconfig
```

### Linux

```bash
hostname -I
```

Se necessário, libere a porta 8080.

### Linux com UFW

```bash
sudo ufw allow 8080/tcp
```

---

## CORS

O backend possui CORS habilitado para permitir comunicação com o frontend.

Caso haja bloqueio por origem em um ambiente específico, revise a configuração do CORS antes de testar em produção.

---

## E-mail não é enviado

Confira as variáveis:

```env
EMAIL_USER="..."
EMAIL_PASSWORD="..."
```

Confirme também que a API foi reiniciada após alterar o `.env`.

---

# 14. 🔒 Segurança

O projeto utiliza:

- `bcrypt` para senhas;
- `bcrypt` para o código de verificação do cadastro;
- JWT com expiração;
- Zod para validação;
- variáveis sensíveis no `.env`;
- códigos de 6 dígitos gerados aleatoriamente;
- códigos com expiração;
- invalidação dos códigos anteriores no fluxo de recuperação;
- remoção do cadastro pendente após confirmação;
- mesma mensagem para e-mail inexistente e senha incorreta no login;
- resposta genérica no `forgot-password`, evitando revelar a existência de contas.
