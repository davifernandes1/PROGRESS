# 🚀 Progress App - Gerenciador de PDIs

Este é um sistema completo para gerenciamento de Planos de Desenvolvimento Individual (PDI), dividido em um frontend construído com React e um backend com Node.js.

## 📁 Estrutura do Projeto

O projeto é um monorepo com duas pastas principais:

-   `/frontend`: Contém toda a aplicação React criada com Vite.
-   `/backend`: Contém a API Node.js (presumivelmente com Express ou similar).

## 🛠️ Tecnologias Utilizadas

-   **Frontend:**
    -   React.js
    -   Vite
    -   Lucide React (para ícones)
    -   Recharts (para gráficos)
    -   Tailwind CSS (para estilização)
-   **Backend:**
    -   Node.js
    -   (Presumido) Express.js

## ⚙️ Pré-requisitos

Antes de começar, garanta que você tenha o seguinte instalado:
* [Node.js](https://nodejs.org/en/) (versão 18 ou superior recomendada)
* `npm` (geralmente instalado junto com o Node.js)

## 📦 Instalação e Configuração

Siga os passos abaixo para configurar o ambiente de desenvolvimento.

**1. Clone o Repositório:**
```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd <NOME_DA_PASTA_DO_PROJETO>
```

**2. Instale as Dependências do Backend:**
```bash
cd backend
npm install
```

**3. Instale as Dependências do Frontend:**
```bash
cd ../frontend
npm install
```

**4. Configure as Variáveis de Ambiente:**

No frontend, a aplicação precisa de uma chave de API para a funcionalidade de IA da Gemini.

-   Na pasta `/frontend`, crie um arquivo chamado `.env`.
-   Adicione sua chave de API da Google a este arquivo:

    ```env
    # /frontend/.env
    VITE_GEMINI_API_KEY=SUA_CHAVE_DE_API_GERADA_NO_GOOGLE_AI_STUDIO


## ▶️ Executando a Aplicação

Para rodar o projeto, você precisará de **dois terminais abertos** simultaneamente, ambos na raiz do projeto.

**Terminal 1 - Iniciando o Backend:**
```bash
cd backend
npm start
```
> Por padrão, o backend deverá rodar em `http://localhost:3001`.

**Terminal 2 - Iniciando o Frontend:**
```bash
cd frontend
npm run dev
```
> A aplicação frontend estará acessível em `http://localhost:5173` (ou outra porta indicada pelo Vite). Abra este endereço no seu navegador.
