<h1 align="center">
  PROGRESS - Sistema de Gestão de PDI 🚀
</h1>

<p align="center">
  Um sistema completo para gestão e acompanhamento de Planos de Desenvolvimento Individual (PDI), construído com React, Vite e Tailwind CSS.
</p>


## 🎯 Sobre o Projeto

**PROGRESS** é uma aplicação web moderna para a gestão de Planos de Desenvolvimento Individual (PDI). A plataforma foi desenhada para permitir que empresas estruturem, acompanhem e impulsionem o crescimento profissional dos seus colaboradores de forma eficiente e organizada.

Atualmente, o projeto funciona com dados simulados (`mock`) armazenados no `localStorage` do navegador, permitindo uma demonstração completa das suas funcionalidades de frontend.


## ✨ Funcionalidades Principais

-   📊 **Dashboards por Perfil:** Visões personalizadas para Administradores, Gestores e Colaboradores com métricas e gráficos relevantes.
-   👥 **Gestão de Usuários (Admin):** Criação, edição e exclusão de usuários, com atribuição de perfis e departamentos.
-   📋 **Gestão de PDIs:** Criação e acompanhamento de Planos de Desenvolvimento, com definição de objetivos, prazos e prioridades.
-   💬 **Sistema de Feedback:** Registro de feedbacks construtivos e de reconhecimento, podendo ser associados a um PDI específico.
-   🤖 **Integração com IA (Gemini):** Funcionalidade para sugerir objetivos de PDI com base no cargo e no título do plano, utilizando a API do Google Gemini.
-   📱 **Interface Responsiva:** Design que se adapta a diferentes tamanhos de tela.

## 🛠️ Tecnologias Utilizadas

As seguintes ferramentas e tecnologias foram usadas na construção do projeto:

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-8884d8?style=for-the-badge&logo=recharts&logoColor=white)
![Lucide React](https://img.shields.io/badge/Lucide-Icons-2dd4bf?style=for-the-badge&logo=lucide&logoColor=white)

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e executar o projeto no seu ambiente local.

### Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 18 ou superior)
-   `npm` ou outro gerenciador de pacotes (`yarn`, `pnpm`)

### Instalação e Execução

1.  **Clone o repositório** (se ainda não o fez):
    ```bash
    git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)
    cd SEU_REPOSITORIO/frontend
    ```
    **Nota:** Não se esqueça de substituir `SEU_USUARIO/SEU_REPOSITORIO` pelo link real do seu projeto.

2.  **Instale as dependências:**
    Este comando irá ler o `package.json` e instalar todos os pacotes necessários.
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Para usar a funcionalidade de sugestão com IA, crie um ficheiro `.env` na pasta `frontend` e adicione a sua chave da API do Google Gemini:
    ```
    VITE_GEMINI_API_KEY=SUA_CHAVE_API_AQUI
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

5.  Abra o seu navegador e acesse [http://localhost:5173/](http://localhost:5173/) (ou o endereço que aparecer no seu terminal).




## 🗺️ Roadmap (Futuras Melhorias)

-   [ ] **Integração com Backend:** Substituir o `localStorage` por uma API real com banco de dados (Java, PostgreSQL).
-   [ ] **Autenticação Real:** Implementar sistema de login com JWT (JSON Web Tokens).
-   [ ] **Testes:** Adicionar testes unitários e de integração (Jest, React Testing Library).
-   [ ] **Notificações em Tempo Real:** Implementar notificações (ex: novo feedback recebido) usando WebSockets.
-   [ ] **Deploy:** Configurar pipeline de CI/CD para fazer o deploy da aplicação (Vercel, Netlify).

---