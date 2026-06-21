# 🚀 PROGRESS

PROGRESS é uma plataforma web em formato desktop-style voltada para a gestão de **Planos de Desenvolvimento Individual (PDIs)** e **Feedbacks** corporativos. O sistema permite que administradores e gestores acompanhem a evolução dos colaboradores, definam metas claras e forneçam avaliações construtivas e de reconhecimento.

O grande diferencial do projeto é a **integração nativa com Inteligência Artificial (Google Gemini)**, que auxilia gestores a gerar automaticamente objetivos e cronogramas de desenvolvimento com base no contexto do PDI.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando uma arquitetura Full-Stack moderna:

### Front-end
* **React** (via Vite)
* **Tailwind CSS** (para estilização rápida e responsiva)
* **Lucide React** (biblioteca de ícones)
* Gerenciamento de estado complexo nativo (Context API)

### Back-end & Banco de Dados
* **Node.js** com **Express** (API RESTful)
* **Supabase / PostgreSQL** (Persistência de dados relacional e autenticação)
* **Google Gemini API** (Integração operacional para geração de sugestões inteligentes)

---

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de que possui as seguintes ferramentas instaladas na sua máquina:
* [Node.js](https://nodejs.org/) (Versão 18 ou superior)
* [Git](https://git-scm.com/)
* Uma conta no [Supabase](https://supabase.com/) para o banco de dados
* Uma chave de API gratuita do [Google AI Studio](https://aistudio.google.com/)

---

## 🚀 Como Iniciar o Projeto Localmente

O projeto está dividido em duas pastas principais: `frontend` e `backend`. É necessário configurar e rodar ambas simultaneamente.

### 1. Clonar o Repositório

git clone https://github.com/seu-usuario/progress.git
cd progress


### 2. Configurar o Back-end
Abra um terminal e aceda à pasta do servidor:

cd backend
npm install


Crie um ficheiro `.env` na raiz da pasta `backend` e adicione as suas credenciais:

PORT=3000
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_anon_do_supabase
GEMINI_API_KEY=sua_chave_gratuita_do_gemini


Inicie o servidor de desenvolvimento:

npm run dev

*(O servidor estará a rodar em `http://localhost:3000`)*

### 3. Configurar o Front-end
Abra um **novo terminal** (mantenha o do back-end a rodar) e aceda à pasta do cliente:

cd frontend
npm install


Crie um ficheiro `.env` na raiz da pasta `frontend` com as seguintes variáveis:

VITE_API_URL=http://localhost:3000/api
VITE_GEMINI_API_KEY=sua_chave_gratuita_do_gemini


Inicie a aplicação React:

npm run dev

*(A aplicação estará acessível no navegador, geralmente em `http://localhost:5173`)*

---

## 🧠 Funcionalidades Principais

* **Dashboard Interativo:** Visão geral rápida do progresso dos colaboradores e pendências.
* **Gestão de PDIs:** Criação, edição e acompanhamento de planos de desenvolvimento.
* **Sugestões com IA:** Geração automática de metas e estimativas de tempo para PDIs utilizando a API do Gemini.
* **Sistema de Feedbacks:** Envio e recebimento de feedbacks (Reconhecimento, Construtivo, Orientação).
* **Painel do Colaborador:** Área dedicada para o funcionário visualizar as suas próprias metas, atualizar o seu progresso (checklists) e ler os seus feedbacks.
* **Navegação Desktop-style:** Transição fluida entre telas sem recarregamento da página (Single Page Application otimizada).