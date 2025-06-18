import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  Home, Users, MessageSquare, LogOut, Search, PlusCircle, Edit3, Edit, Eye,
  Trash2, ChevronDown, ChevronUp, CheckCircle as CheckCircleIcon, XCircle as XCircleIcon, Briefcase,
  UserCheck, UserX, Target, AlignLeft, ListChecks, UserCog, Sparkles, Clock, AlertTriangle, UserPlus,
  CheckSquare as CheckSquareIcon, ShieldCheck, ClipboardList, Send, Brain, Square, Trash as TrashIcon, Loader2,
  AlertCircle, Info, Archive, X
} from 'lucide-react';

const itDepartments = [
  "Engenharia de Software (Frontend)", "Engenharia de Software (Backend)", "Engenharia de Software (Fullstack)",
  "Engenharia Mobile (iOS/Android)", "DevOps e SRE", "Infraestrutura Cloud (AWS/Azure/GCP)",
  "Segurança da Informação (CyberSecurity)", "Arquitetura de Soluções", "Produto e UX/UI Design",
  "Dados e Analytics (BI, Data Science, Data Engineering)", "Qualidade de Software (QA e Testes)",
  "Suporte Técnico e Service Desk", "Gestão de Projetos de TI / Scrum Master", "Inteligência Artificial e Machine Learning",
  "Redes e Telecomunicações", "Sistemas Embarcados e IoT"
];

const itJobTitles = {
  "Engenharia de Software (Frontend)": ["Desenvolvedor Frontend Jr", "Desenvolvedor Frontend Pleno", "Desenvolvedor Frontend Sênior", "Líder Técnico Frontend", "Arquiteto Frontend"],
  "Engenharia de Software (Backend)": ["Desenvolvedor Backend Jr", "Desenvolvedor Backend Pleno", "Desenvolvedor Backend Sênior", "Líder Técnico Backend", "Arquiteto Backend"],
  "Engenharia de Software (Fullstack)": ["Desenvolvedor Fullstack Jr", "Desenvolvedor Fullstack Pleno", "Desenvolvedor Fullstack Sênior", "Engenheiro de Software Fullstack"],
  "Engenharia Mobile (iOS/Android)": ["Desenvolvedor iOS Jr/Pleno/Sênior", "Desenvolvedor Android Jr/Pleno/Sênior", "Engenheiro Mobile Especialista"],
  "DevOps e SRE": ["Engenheiro DevOps Jr/Pleno/Sênior", "Engenheiro SRE", "Especialista em CI/CD"],
  "Infraestrutura Cloud (AWS/Azure/GCP)": ["Analista de Cloud Jr/Pleno", "Engenheiro Cloud Sênior", "Arquiteto Cloud", "Especialista em Migração Cloud"],
  "Segurança da Informação (CyberSecurity)": ["Analista de Segurança da Informação Jr/Pleno", "Especialista em Segurança Ofensiva (Pentester)", "Engenheiro de Segurança de Aplicações (AppSec)", "Consultor de Segurança"],
  "Arquitetura de Soluções": ["Arquiteto de Software", "Arquiteto de Soluções Cloud", "Arquiteto de Sistemas"],
  "Produto e UX/UI Design": ["Designer UX Jr/Pleno/Sênior", "Designer UI Jr/Pleno/Sênior", "Product Designer", "Product Owner", "Product Manager", "UX Researcher"],
  "Dados e Analytics (BI, Data Science, Data Engineering)": ["Analista de BI", "Cientista de Dados Jr/Pleno/Sênior", "Engenheiro de Dados Jr/Pleno/Sênior", "Analista de Dados"],
  "Qualidade de Software (QA e Testes)": ["Analista de QA Manual", "Analista de QA (Automação)", "Engenheiro de QA", "Líder de QA"],
  "Suporte Técnico e Service Desk": ["Analista de Suporte N1/N2/N3", "Coordenador de Service Desk", "Técnico de Campo"],
  "Gestão de Projetos de TI / Scrum Master": ["Gerente de Projetos de TI", "Scrum Master", "Agile Coach", "Coordenador de Projetos"],
  "Inteligência Artificial e Machine Learning": ["Engenheiro de Machine Learning", "Cientista de Dados (foco em IA)", "Pesquisador em IA"],
  "Redes e Telecomunicações": ["Engenheiro de Redes", "Administrador de Redes Sênior"],
  "Sistemas Embarcados e IoT": ["Engenheiro de Firmware", "Desenvolvedor IoT"]
};


const initialMockUsers = [
  { id: 'adminSim001', name: 'Admin', email: 'admin@progress.com', password: 'admin123', profile: 'admin', department: itDepartments[1], jobTitle: itJobTitles[itDepartments[1]][2], status: 'active', lastLogin: '2025-06-03T10:00:00Z', createdAt: '2023-01-15T00:00:00Z', roleDescription: 'Admin' },
  { id: 'gestorSim002', name: 'Bruno Gestor', email: 'bruno.gestor@progress.com', password: 'gestor123', profile: 'manager', department: itDepartments[0], jobTitle: "Gerente de Engenharia", status: 'active', lastLogin: '2025-06-04T14:30:00Z', createdAt: '2023-02-20T00:00:00Z', roleDescription: 'Gestor' },
  { id: 'colabSim003', name: 'Carlos Dev', email: 'colab.carlos@progress.com', password: 'colab123', profile: 'collaborator', department: itDepartments[0], jobTitle: itJobTitles[itDepartments[0]][1], managerId: 'gestorSim002', status: 'active', lastLogin: '2025-06-05T08:15:00Z', createdAt: '2023-03-10T00:00:00Z', roleDescription: 'Colaborador' },
  { id: 'user004', name: 'Diana Designer', email: 'diana.designer@example.com', password: 'diana123', profile: 'collaborator', department: itDepartments[8], jobTitle: itJobTitles[itDepartments[8]][0], managerId: 'gestorSim005', status: 'active', lastLogin: '2025-06-02T11:00:00Z', createdAt: '2023-04-01T00:00:00Z', roleDescription: 'Colaborador' },
  { id: 'gestorSim005', name: 'Eduardo Líder UX', email: 'eduardo.lider@example.com', password: 'eduardo123', profile: 'manager', department: itDepartments[8], jobTitle: "Líder de Design", status: 'active', lastLogin: '2025-06-01T16:20:00Z', createdAt: '2023-01-25T00:00:00Z', roleDescription: 'Gestor' },
];

const initialMockPDIs = [
  { id: 'pdi001', title: 'Dominar React Avançado', overallDescription: 'Aprofundar conhecimentos em React para desenvolvimento de interfaces complexas e performáticas.', collaboratorId: 'colabSim003', managerId: 'gestorSim002', status: 'Em Andamento', startDate: '2025-03-15T00:00:00Z', dueDate: '2025-09-15T00:00:00Z', department: itDepartments[0], priority: 'Alta', objectives: [{ id: 'obj1_pdi001', text: 'Concluir curso de React Hooks avançados e Context API.', status: 'concluido', activityType: "Curso Online", estimatedDurationDays: 30 }, { id: 'obj2_pdi001', text: 'Aplicar técnicas de otimização (memo, lazy loading) em projeto existente.', status: 'em_andamento', activityType: "Projeto Prático", estimatedDurationDays: 45 }, { id: 'obj3_pdi001', text: 'Desenvolver um componente reutilizável com TDD.', status: 'pendente', activityType: "Projeto Prático", estimatedDurationDays: 30 },], progress: 33 },
  { id: 'pdi002', title: 'Aprimorar UX para Carrinho de Compras', overallDescription: 'Melhorar a experiência do usuário no fluxo de checkout do e-commerce.', collaboratorId: 'user004', managerId: 'gestorSim005', status: 'Em Andamento', startDate: '2025-05-01T00:00:00Z', dueDate: '2025-08-01T00:00:00Z', department: itDepartments[8], priority: 'Alta', objectives: [{ id: 'obj1_pdi002', text: 'Realizar 5 entrevistas com usuários para identificar pontos de dor.', status: 'em_andamento', activityType: "Pesquisa com Usuário", estimatedDurationDays: 15 }, { id: 'obj2_pdi002', text: 'Criar protótipos de baixa e alta fidelidade para 3 novas soluções de checkout.', status: 'pendente', activityType: "Prototipagem", estimatedDurationDays: 30 }, { id: 'obj3_pdi002', text: 'Conduzir testes de usabilidade com os protótipos.', status: 'pendente', activityType: "Teste de Usabilidade", estimatedDurationDays: 20 },], progress: 0 },
  { id: 'pdi003', title: 'Planejamento Estratégico Q3 2025', overallDescription: 'Definir metas e roadmap para o time de Frontend no terceiro trimestre.', collaboratorId: 'gestorSim002', managerId: 'adminSim001', status: 'Pendente', startDate: '2025-07-01T00:00:00Z', dueDate: '2025-07-15T00:00:00Z', department: itDepartments[0], priority: 'Alta', objectives: [{ id: 'obj1_pdi003', text: 'Analisar métricas de performance do Q2.', status: 'pendente', activityType: "Análise de Dados", estimatedDurationDays: 5 }, { id: 'obj2_pdi003', text: 'Conduzir reunião de brainstorming com a equipe.', status: 'pendente', activityType: "Reunião", estimatedDurationDays: 1 }, { id: 'obj3_pdi003', text: 'Apresentar o plano para a diretoria.', status: 'pendente', activityType: "Apresentação", estimatedDurationDays: 2 },], progress: 0 },
];

const initialMockFeedbacks = [
  { id: 'fb001', pdiId: 'pdi001', collaboratorId: 'colabSim003', managerId: 'gestorSim002', feedbackText: 'Carlos, seu progresso no curso de React está ótimo! Continue focado nos próximos módulos sobre Context API.', dateSubmitted: '2025-05-20T10:00:00Z', type: 'Positivo', meetingDate: '2025-05-19T00:00:00Z', nextSteps: 'Agendar revisão do projeto prático em 2 semanas.' },
  { id: 'fb002', pdiId: null, collaboratorId: 'user004', managerId: 'gestorSim005', feedbackText: 'Diana, sua apresentação sobre as heurísticas de Nielsen foi excelente. Muito clara e bem estruturada!', dateSubmitted: '2025-04-08T14:30:00Z', type: 'Reconhecimento', meetingDate: '2025-04-07T00:00:00Z' },
];

const objectiveStatuses = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'concluido', label: 'Concluído' }
];

//==================================================================================
// 1. HELPERS E CONTEXTOS GLOBAIS
//==================================================================================


const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  };
  return [storedValue, setValue];
};

// ----------- Contexto de Loading -----------
const LoadingContext = createContext();
const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const showLoading = useCallback(() => setIsLoading(true), []);
  const hideLoading = useCallback(() => setIsLoading(false), []);
  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
      {isLoading && <LoadingScreen />}
    </LoadingContext.Provider>
  );
};

// ----------- Contexto de Notificações -----------
const NotificationContext = createContext();
const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type = 'success') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(current => current.filter(n => n.id !== id));
        }, 5000); 
    }, []);

    const removeNotification = (id) => {
        setNotifications(current => current.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
        </NotificationContext.Provider>
    );
};
const useNotification = () => useContext(NotificationContext);

// ----------- Contexto de Autenticação -----------
const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(() => sessionStorage.getItem('authToken'));

  const logout = useCallback(() => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentPage');
    setCurrentUser(null);
    setAuthToken(null);
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const user = sessionStorage.getItem('currentUser');
    if (token && user) {
      try {
        setCurrentUser(JSON.parse(user));
        setAuthToken(token);
      } catch (error) { 
        console.warn("Falha ao analisar o usuário do sessionStorage", error);
        logout(); 
      }
    }
  }, [logout]);

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const allUsers = JSON.parse(localStorage.getItem('progress_app_users') || '[]');
        const matchedUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (matchedUser && matchedUser.password === password) {
            const mockToken = `simulated-jwt-${Date.now()}`;
            sessionStorage.setItem('authToken', mockToken);
            sessionStorage.setItem('currentUser', JSON.stringify(matchedUser));
            setAuthToken(mockToken);
            setCurrentUser(matchedUser);
            resolve(matchedUser);
        } else {
           reject(new Error('Credenciais inválidas.'));
        }
      }, 700);
    });
  };

  return <AuthContext.Provider value={{ currentUser, authToken, login, logout }}>{children}</AuthContext.Provider>;
};
const useAuth = () => useContext(AuthContext);

// ----------- Contexto de Dados -----------
const DataContext = createContext();
const DataProvider = ({ children }) => {
    useEffect(() => {
        const initStorage = (key, data) => {
            const storedData = localStorage.getItem(key);
            if (!storedData || JSON.parse(storedData).length === 0) {
                localStorage.setItem(key, JSON.stringify(data));
            }
        };
        initStorage('progress_app_users', initialMockUsers);
        initStorage('progress_app_pdis', initialMockPDIs);
        initStorage('progress_app_feedbacks', initialMockFeedbacks);
    }, []);

    const [users, setUsers] = useLocalStorage('progress_app_users', initialMockUsers);
    const [pdis, setPdis] = useLocalStorage('progress_app_pdis', initialMockPDIs);
    const [feedbacks, setFeedbacks] = useLocalStorage('progress_app_feedbacks', initialMockFeedbacks);

    const addUser = (newUser) => setUsers(prev => [...prev, newUser]);
    const updateUser = (userId, updatedData) => setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
    const deleteUser = (userId) => setUsers(prev => prev.filter(u => u.id !== userId));

    const addPdi = (newPdi) => setPdis(prev => [...prev, newPdi]);
    const updatePdi = (pdiId, updatedData) => setPdis(prev => prev.map(p => p.id === pdiId ? { ...p, ...updatedData } : p));
    const deletePdi = (pdiId) => setPdis(prev => prev.filter(p => p.id !== pdiId));
    
    const addFeedback = (newFeedback) => setFeedbacks(prev => [...prev, newFeedback]);
    const updateFeedback = (feedbackId, updatedData) => setFeedbacks(prev => prev.map(f => f.id === feedbackId ? { ...f, ...updatedData } : f));
    const deleteFeedback = (feedbackId) => setFeedbacks(prev => prev.filter(f => f.id !== feedbackId));

    const value = {
        users, addUser, updateUser, deleteUser,
        pdis, addPdi, updatePdi, deletePdi,
        feedbacks, addFeedback, updateFeedback, deleteFeedback
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
const useData = () => useContext(DataContext);


//==================================================================================
// 2. Componentes Reutilizáveis
//==================================================================================

const LoadingScreen = () => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
    <div className="text-center">
      <Loader2 className="mx-auto h-12 w-12 animate-spin text-white" />
    </div>
  </div>
);

const NotificationContainer = ({ notifications, removeNotification }) => (
    <div className="fixed top-5 right-5 z-[200] space-y-3 w-80">
        {notifications.map(({ id, message, type }) => {
            const isSuccess = type === 'success';
            const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
            const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
            const iconColor = isSuccess ? 'text-green-500' : 'text-red-500';
            const Icon = isSuccess ? CheckCircleIcon : AlertCircle;

            return (
                <div key={id} className={`relative flex items-start space-x-3 p-4 rounded-lg shadow-lg border ${bgColor} animate-fadeInRight`}>
                    <Icon className={`h-6 w-6 ${iconColor} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1">
                        <p className={`text-sm font-medium ${textColor}`}>{isSuccess ? 'Sucesso!' : 'Erro!'}</p>
                        <p className={`text-sm ${textColor} mt-0.5`}>{message}</p>
                    </div>
                    <button onClick={() => removeNotification(id)} className={`absolute top-2 right-2 p-1 rounded-full hover:bg-black/10`}>
                        <X size={16} className={textColor} />
                    </button>
                </div>
            );
        })}
    </div>
);

const Sidebar = ({ setCurrentPage, currentPage }) => {
  const { currentUser, logout } = useAuth();
  const handleLogout = () => { logout(); };

  const getNavItems = (profile) => {
    switch (profile) {
      case 'admin': return [
        { name: 'Dashboard', page: 'admin-dashboard', icon: Home },
        { name: 'Usuários', page: 'admin-users', icon: Users },
        { name: 'PDIs', page: 'admin-pdis', icon: ClipboardList },
        { name: 'Feedbacks', page: 'admin-feedbacks', icon: MessageSquare },
      ];
      case 'manager': return [
        { name: 'Dashboard', page: 'manager-dashboard', icon: Home },
        { name: 'PDIs da Equipe', page: 'manager-team-pdis', icon: UserCheck },
        { name: 'Meus PDIs', page: 'manager-my-pdis', icon: Target },
        { name: 'Dar Feedback', page: 'manager-give-feedback', icon: Send },
      ];
      case 'collaborator': return [
        { name: 'Meus PDIs', page: 'collaborator-pdis', icon: Target },
        { name: 'Meus Feedbacks', page: 'collaborator-feedbacks', icon: MessageSquare },
      ];
      default: return [];
    }
  };
  
  const navItems = getNavItems(currentUser?.profile);

  return (
    <div className="fixed top-0 left-0 z-20 flex h-screen w-60 flex-col bg-slate-900 p-4 text-white shadow-lg print:hidden">
      <div className="mb-10 pt-3 text-center">
        <div className="flex items-center justify-center space-x-2.5">
          <UserCog size={30} className="text-blue-400" />
          <span className="text-2xl font-bold tracking-wider text-white">PROGRESS</span>
        </div>
      </div>
      <nav className="flex-grow space-y-2">
        {navItems.map(item => (
          <button key={item.name} onClick={() => setCurrentPage(item.page)} title={item.name}
            className={`group flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-all duration-150 ease-in-out ${currentPage === item.page ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-200 hover:bg-slate-700 hover:text-white'}`}>
            <item.icon size={20} className="flex-shrink-0" />
            <span className="truncate">{item.name}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto border-t border-slate-700 pt-6">
        {currentUser && (
          <div className="mb-3 flex items-center space-x-3 p-2">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
              {currentUser.name?.match(/\b(\w)/g)?.join('').substring(0, 2).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="max-w-[130px] truncate font-semibold text-white" title={currentUser.name}>{currentUser.name}</p>
              <p className="text-xs text-slate-400">{currentUser.roleDescription}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout} title="Sair"
          className="group flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 transition-all hover:bg-red-600 hover:text-white">
          <LogOut size={18} className="flex-shrink-0" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};


const MainLayout = ({ children, setCurrentPage, currentPage, pageTitle }) => {
  const { currentUser } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className={currentUser ? "ml-60" : ""}>
        {currentUser && <Sidebar setCurrentPage={setCurrentPage} currentPage={currentPage} />}
        <header className="bg-white p-4 py-4 shadow-sm md:px-8">
          <div className="mx-auto flex max-w-full items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800 md:text-2xl">{pageTitle}</h1>
            {currentUser && (
              <div className="text-sm text-gray-600">
                Logado como: <span className="font-medium">{currentUser.name}</span>
                <span className={`ml-2 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(currentUser.profile)}`}>
                  {currentUser.roleDescription}
                </span>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-full animate-fadeIn">{children}</div>
        </main>
      </div>
    </div>
  );
};

const Modal = ({ title, children, isOpen, onClose, widthClass = "max-w-lg", showActions = true, primaryActionText = "Salvar", onPrimaryAction, primaryActionDisabled = false, secondaryActionText = "Cancelar", onSecondaryAction, isPrimaryActionLoading = false }) => {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) { document.body.style.overflow = 'hidden'; window.addEventListener('keydown', handleEsc); }
    return () => { document.body.style.overflow = 'unset'; window.removeEventListener('keydown', handleEsc); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 animate-fadeIn" onClick={onClose}>
      <div className={`relative w-full ${widthClass} flex max-h-[90vh] flex-col rounded-xl bg-white shadow-2xl animate-scaleUp`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between rounded-t-xl border-b bg-white p-5">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600" aria-label="Fechar">
            <XCircleIcon size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-5 md:p-6 custom-scrollbar">{children}</div>
        {showActions && (
          <div className="flex items-center justify-end space-x-3 rounded-b-xl border-t bg-gray-50 p-4 md:p-5">
            <Button onClick={onSecondaryAction || onClose} variant="outline">{secondaryActionText}</Button>
            <Button onClick={onPrimaryAction} disabled={primaryActionDisabled} isLoading={isPrimaryActionLoading}>{primaryActionText}</Button>
          </div>
        )}
      </div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", isLoading = false }) => (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        showActions={false}
        widthClass="max-w-md"
    >
        <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>
            <div className="mt-2">
                <p className="text-sm text-gray-500">{message}</p>
            </div>
        </div>
        <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>{cancelText}</Button>
            <Button variant="danger" onClick={onConfirm} isLoading={isLoading} disabled={isLoading}>{confirmText}</Button>
        </div>
    </Modal>
);

const FormField = ({ label, name, type = 'text', value, onChange, required = false, children, placeholder, disabled = false, rows = 3, error, helperText, autoComplete }) => {
  const commonClasses = "mt-1 block w-full py-2.5 px-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors";
  const errorClasses = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500";
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {type === 'select' ? (
        <select id={name} name={name} value={value || ''} onChange={onChange} required={required} disabled={disabled} className={`${commonClasses} ${errorClasses}`}>{children}</select>
      ) : type === 'textarea' ? (
        <textarea id={name} name={name} value={value || ''} onChange={onChange} required={required} rows={rows} placeholder={placeholder} disabled={disabled} className={`${commonClasses} ${errorClasses}`}></textarea>
      ) : (
        <input type={type} id={name} name={name} value={value || ''} onChange={onChange} required={required} placeholder={placeholder} disabled={disabled} className={`${commonClasses} ${errorClasses}`} autoComplete={autoComplete} />
      )}
      {error && <p className="mt-1 flex items-center text-xs text-red-600"><AlertCircle size={14} className="mr-1" />{error}</p>}
      {!error && helperText && <p className="mt-1 flex items-center text-xs text-gray-500"><Info size={14} className="mr-1" />{helperText}</p>}
    </div>
  );
};

const RadioGroup = ({ name, value, onChange, options, legend, required = false, disabled = false, error }) => (
  <fieldset className="mb-4" disabled={disabled}>
    {legend && <legend className="block text-sm font-medium text-gray-700 mb-1.5">{legend}{required && <span className="text-red-500 ml-0.5">*</span>}</legend>}
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {options.map(opt => (
        <label key={opt.value} className={`inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
          <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={onChange} disabled={disabled} className="form-radio h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:bg-gray-200" />
          <span className={`ml-2 text-sm ${disabled ? 'text-gray-500' : 'text-gray-700'}`}>{opt.label}</span>
        </label>
      ))}
    </div>
    {error && <p className="mt-1 flex items-center text-xs text-red-600"><AlertCircle size={14} className="mr-1" />{error}</p>}
  </fieldset>
);

const InfoCard = ({ title, value, icon, iconBgColor = 'bg-blue-100', iconTextColor = 'text-blue-600', isLoading = false }) => (
  <div className="flex items-center space-x-4 rounded-lg border border-gray-200 bg-white p-4 shadow transition-shadow hover:shadow-md">
    <div className={`flex items-center justify-center rounded-full p-3 ${iconBgColor}`}>{React.cloneElement(icon, { size: 22, className: iconTextColor })}</div>
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{title}</p>
      {isLoading ? <div className="mt-1 h-7 w-16 animate-pulse rounded bg-gray-200"></div> : <p className="text-2xl font-semibold text-gray-800">{value}</p>}
    </div>
  </div>
);

const FilterInput = ({ label, children, value, onChange, name, disabled = false, placeholder = "Selecionar..." }) => (
  <div className="w-full">
    {label && <label htmlFor={name} className="mb-1 block text-xs font-medium text-gray-600">{label}</label>}
    <select id={name} name={name} value={value || ""} onChange={onChange} disabled={disabled} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-100">
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
  </div>
);

const DashboardCard = ({ title, value, icon, bgColorClass = 'bg-slate-100', textColorClass = 'text-slate-700', subValue, linkTo, setCurrentPage }) => (
  <div className={`flex min-h-[150px] flex-col justify-between rounded-xl bg-white p-5 shadow-lg transition-shadow hover:shadow-xl md:p-6 ${linkTo ? 'cursor-pointer' : ''}`}
    onClick={linkTo && setCurrentPage ? () => setCurrentPage(linkTo) : undefined}>
    <div className="flex items-start space-x-3 md:space-x-4">
      <div className={`flex-shrink-0 rounded-full p-3.5 ${bgColorClass}`}>{React.cloneElement(icon, { size: 24, className: textColorClass })}</div>
      <div className="flex-1">
        <p className="truncate text-sm font-medium text-gray-500" title={title}>{title}</p>
        <p className="text-2xl font-bold text-gray-800 md:text-3xl">{value}</p>
        {subValue && <p className="mt-0.5 text-xs text-gray-400">{subValue}</p>}
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, children, actionButton, note }) => (
  <div className="rounded-xl bg-white p-5 shadow-lg md:p-6">
    <div className="mb-4 flex items-center justify-between md:mb-6">
      <h3 className="text-lg font-semibold text-gray-700 md:text-xl">{title}</h3>
      {actionButton}
    </div>
    <div className="h-72 w-full sm:h-80 md:h-96">{children}</div>
    {note && <p className="mt-3 text-center text-xs text-gray-400">{note}</p>}
  </div>
);

const formatDate = (dateString, options = { day: '2-digit', month: '2-digit', year: 'numeric' }) => {
  if (!dateString) return 'N/A';
  try { return new Date(dateString).toLocaleDateString('pt-BR', options); }
  catch { return 'Data Inválida'; }
};
const formatDateTime = (dateString) => formatDate(dateString, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active': case 'ativo': case 'em andamento': case 'em_andamento': return 'bg-green-100 text-green-700';
    case 'inactive': case 'inativo': return 'bg-gray-100 text-gray-700';
    case 'pending': case 'pendente': return 'bg-yellow-100 text-yellow-700';
    case 'completed': case 'concluído': case 'concluido': return 'bg-blue-100 text-blue-700';
    case 'overdue': case 'atrasado': return 'bg-red-100 text-red-700';
    case 'cancelled': case 'cancelado': return 'bg-orange-100 text-orange-700';
    case 'admin': return 'bg-purple-100 text-purple-700';
    case 'manager': return 'bg-sky-100 text-sky-700';
    case 'collaborator': return 'bg-indigo-100 text-indigo-700';
    default: return 'bg-slate-100 text-slate-700';
  }
};

const Button = ({ children, variant = 'primary', size = 'md', iconLeft, iconRight, disabled = false, isLoading = false, className = '', ...props }) => {
  const baseClasses = "font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-150 ease-in-out shadow-sm inline-flex items-center justify-center";
  const sizeClasses = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-2.5 text-base", };
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400",
    secondary: "bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-500 disabled:bg-slate-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400",
    outline: "bg-transparent text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-400 disabled:text-slate-400 disabled:border-slate-200",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-400 disabled:text-slate-400",
  };
  return (
    <button type="button" disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${isLoading ? 'cursor-wait' : ''} ${disabled ? 'cursor-not-allowed opacity-70' : ''} ${className}`} {...props}>
      {isLoading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
      {iconLeft && !isLoading && <span className="mr-2">{iconLeft}</span>}
      {children}
      {iconRight && !isLoading && <span className="ml-2">{iconRight}</span>}
    </button>
  );
};

const Table = ({ headers, data, renderRow, keyField = "id", isLoading = false, emptyMessage = "Nenhum dado encontrado.", searchTerm = "" }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-white py-10 shadow">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }
  if (!data.length) {
    return (
      <div className="rounded-lg bg-white py-12 text-center shadow">
        <Archive size={56} className="mx-auto mb-4 text-gray-300" />
        <p className="text-xl text-gray-500">{emptyMessage}</p>
        {searchTerm && <p className="mt-2 text-sm text-gray-400">Verifique o termo de busca ou os filtros aplicados.</p>}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow-md custom-scrollbar">
      <table className="min-w-[800px] w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>{headers.map((h, i) => <th key={h.key || i} className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 ${h.className || ''}`}>{h.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((item) => renderRow(item, item[keyField]))}
        </tbody>
      </table>
    </div>
  );
};

//==================================================================================
// 3. Telas e Modais Específicos
//==================================================================================

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(email, password); } 
    catch (err) { setError(err.message || 'Falha no login.'); setLoading(false); }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4 font-sans">
      <div className="w-full max-w-sm space-y-8 rounded-xl bg-white p-8 shadow-2xl animate-scaleUp md:p-10">
        <div className="text-center">
          <UserCog size={56} className="mx-auto mb-3 text-blue-600" />
          <h2 className="text-3xl font-bold tracking-wider text-gray-900">PROGRESS</h2>
          <p className="mt-1.5 text-sm text-gray-500">Gestão de PDIs</p>
        </div>
        {error && <div className="flex items-start rounded-md border-l-4 border-red-400 bg-red-50 p-4 text-red-700" role="alert"><AlertTriangle size={20} className="mr-3 flex-shrink-0 text-red-500" /><span className="block text-sm sm:inline">{error}</span></div>}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <FormField name="email" type="email" label="Endereço de e-mail" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required disabled={loading} autoComplete="email" />
          <FormField name="password" type="password" label="Senha" value={password} onChange={e => setPassword(e.target.value)} placeholder="Sua senha" required disabled={loading} autoComplete="current-password" />
          <Button type="submit" disabled={loading} isLoading={loading} className="w-full py-2.5 text-lg" variant="primary" size="lg">{loading ? 'Entrando...' : 'Entrar'}</Button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = ({ setCurrentPage, currentPage }) => {
    const { users, pdis, feedbacks } = useData();
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ userStats: {}, pdiStats: {}, recentFeedbacks: [], systemHealth: {} });

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const activeUsers = users.filter(u => u.status === 'active');
            const userStats = {
                total: activeUsers.length,
                collaborators: activeUsers.filter(u => u.profile === 'collaborator').length,
                managers: activeUsers.filter(u => u.profile === 'manager').length,
                admins: activeUsers.filter(u => u.profile === 'admin').length,
                inactive: users.length - activeUsers.length,
                byProfile: Object.entries(activeUsers.reduce((acc, u) => {
                    const profileName = u.profile.charAt(0).toUpperCase() + u.profile.slice(1);
                    acc[profileName] = (acc[profileName] || 0) + 1;
                    return acc;
                }, {})).map(([name, value]) => ({ name, value })),
                byDepartment: Object.entries(activeUsers.reduce((acc, user) => {
                    acc[user.department] = (acc[user.department] || 0) + 1; return acc;
                }, {})).map(([name, value]) => ({ name, value }))
            };

            const pdiStats = {
                active: pdis.filter(p => p.status === 'Em Andamento').length,
                completed: pdis.filter(p => p.status === 'Concluído').length,
                pending: pdis.filter(p => p.status === 'Pendente').length,
                overdue: pdis.filter(p => p.status === 'Atrasado').length,
                total: pdis.length,
                byStatus: Object.entries(pdis.reduce((acc, pdi) => {
                    acc[pdi.status] = (acc[pdi.status] || 0) + 1; return acc;
                }, {})).map(([name, value]) => ({ name, value })),
            };
            
            const recentFeedbacks = [...feedbacks]
              .sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted))
              .slice(0, 5)
              .map(fb => ({
                ...fb,
                collaboratorName: users.find(u => u.id === fb.collaboratorId)?.name,
                managerName: users.find(u => u.id === fb.managerId)?.name
              }));

            const systemHealth = { apiStatus: 'Operacional', lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() };
            
            setStats({ userStats, pdiStats, recentFeedbacks, systemHealth });
            setLoading(false);
        }, 500);
    }, [users, pdis, feedbacks]);

    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    const renderCustomizedLabelForPie = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
        if (percent * 100 < 5) return null;
        return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="500">{`${(percent * 100).toFixed(0)}%`}</text>;
    };

    if(loading) return <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Painel Principal"><LoadingScreen /></MainLayout>

    return (
        <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Painel de Administração Principal">
            <div className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                <DashboardCard title="Usuários Ativos" value={stats.userStats.total} icon={<Users />} bgColorClass="bg-blue-100" textColorClass="text-blue-600" linkTo="admin-users" setCurrentPage={setCurrentPage} subValue={`${stats.userStats.inactive} inativo(s)`} />
                <DashboardCard title="Colaboradores" value={stats.userStats.collaborators} icon={<UserCheck />} bgColorClass="bg-green-100" textColorClass="text-green-600" />
                <DashboardCard title="Gestores" value={stats.userStats.managers} icon={<UserCog />} bgColorClass="bg-purple-100" textColorClass="text-purple-600" />
                <DashboardCard title="Administradores" value={stats.userStats.admins} icon={<ShieldCheck />} bgColorClass="bg-pink-100" textColorClass="text-pink-600" />
                <DashboardCard title="PDIs Totais" value={stats.pdiStats.total} icon={<ClipboardList />} bgColorClass="bg-indigo-100" textColorClass="text-indigo-600" linkTo="admin-pdis" setCurrentPage={setCurrentPage} />
                <DashboardCard title="PDIs Ativos" value={stats.pdiStats.active} icon={<Target />} bgColorClass="bg-orange-100" textColorClass="text-orange-600" />
                <DashboardCard title="PDIs Concluídos" value={stats.pdiStats.completed} icon={<CheckSquareIcon />} bgColorClass="bg-teal-100" textColorClass="text-teal-600" />
                <DashboardCard title="PDIs Atrasados" value={stats.pdiStats.overdue} icon={<AlertTriangle />} bgColorClass="bg-red-100" textColorClass="text-red-600" />
            </div>
             <div className="grid grid-cols-1 gap-6 mb-8 xl:grid-cols-3">
                <ChartCard title="Usuários por Perfil">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart><Pie data={stats.userStats.byProfile} dataKey="value" labelLine={false} outerRadius="80%" label={renderCustomizedLabelForPie}>{stats.userStats.byProfile?.map((_, idx) => <Cell key={`cell-profile-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}</Pie><Tooltip /><Legend iconType="circle" /></PieChart>
                    </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="PDIs por Status">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.pdiStats.byStatus} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" allowDecimals={false} /><YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} /><Tooltip formatter={(val) => [`${val} PDI(s)`]} /><Legend /><Bar dataKey="value" name="Quantidade" radius={[0, 4, 4, 0]} barSize={25}>{stats.pdiStats.byStatus?.map((_, idx) => <Cell key={`cell-status-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}</Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
                 <ChartCard title="Usuários por Departamento">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart><Pie data={stats.userStats.byDepartment} dataKey="value" innerRadius="50%" outerRadius="80%" paddingAngle={2} label={renderCustomizedLabelForPie}>{stats.userStats.byDepartment?.map((_, idx) => <Cell key={`cell-dept-${idx}`} fill={PIE_COLORS[(idx+2) % PIE_COLORS.length]} />)}</Pie><Tooltip /><Legend iconType="circle" /></PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-700">Feedbacks Recentes no Sistema</h3>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage('admin-feedbacks')} iconRight={<ChevronUp size={14} style={{ transform: 'rotate(90deg)' }} />}>
                    Ver Todos
                  </Button>
                </div>
                {stats.recentFeedbacks.length > 0 ? (
                  <ul className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                    {stats.recentFeedbacks.map(fb => (
                      <li key={fb.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold text-slate-800">{fb.managerName || "Gestor"}</span> para <span className="font-semibold text-slate-800">{fb.collaboratorName || "Colaborador"}</span>
                          </p>
                          <span className="text-xs text-gray-400 whitespace-nowrap">{formatDateTime(fb.dateSubmitted)}</span>
                        </div>
                        <p className="text-sm text-gray-500 italic truncate" title={fb.feedbackText}>"{fb.feedbackText}"</p>
                        {fb.pdiId && <p className="text-xs text-blue-500 mt-1">Relacionado ao PDI: {pdis.find(p => p.id === fb.pdiId)?.title || fb.pdiId}</p>}
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-gray-500 py-8 text-center">Nenhum feedback recente para exibir.</p>}
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Saúde do Sistema</h3>
                <div className="space-y-3">
                  <div className={`flex items-center p-3 rounded-md ${stats.systemHealth.apiStatus === 'Operacional' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {stats.systemHealth.apiStatus === 'Operacional' ? <CheckCircleIcon size={20} className="mr-2" /> : <AlertTriangle size={20} className="mr-2" />}
                    <span>Status da API: <span className="font-semibold">{stats.systemHealth.apiStatus}</span></span>
                  </div>
                  <div className="flex items-center p-3 rounded-md bg-slate-50 text-slate-700">
                    <Clock size={20} className="mr-2" />
                    <span>Último Backup: <span className="font-semibold">{stats.systemHealth.lastBackup ? formatDateTime(stats.systemHealth.lastBackup) : 'N/A'}</span></span>
                  </div>
                  <Button variant="outline" className="w-full mt-2" onClick={() => addNotification("Verificação de saúde simulada concluída.", "success")}>
                    Verificar Agora
                  </Button>
                </div>
              </div>
            </div>
        </MainLayout>
    );
};

const AdminUserManagement = ({ setCurrentPage, currentPage }) => {
    const { users, deleteUser } = useData();
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ profile: '', status: '', department: '' });

    const filteredUsers = React.useMemo(() => {
        return users
            .filter(u => {
                const lowerSearch = searchTerm.toLowerCase();
                const matchesSearch = !searchTerm || u.name.toLowerCase().includes(lowerSearch) || u.email.toLowerCase().includes(lowerSearch);
                const matchesProfile = !filters.profile || u.profile === filters.profile;
                const matchesStatus = !filters.status || u.status === filters.status;
                const matchesDept = !filters.department || u.department === filters.department;
                return matchesSearch && matchesProfile && matchesStatus && matchesDept;
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [users, searchTerm, filters]);

    useEffect(() => { setLoading(true); setTimeout(() => setLoading(false), 500); }, []);

    const handleAddUser = () => { setEditingUser(null); setShowUserModal(true); };
    const handleEditUser = (user) => { setEditingUser(user); setShowUserModal(true); };
    const requestDeleteUser = (user) => { setUserToDelete(user); };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;
        setIsDeleteLoading(true);
        await new Promise(res => setTimeout(res, 500));
        deleteUser(userToDelete.id);
        addNotification('Usuário excluído com sucesso!', 'success');
        setIsDeleteLoading(false);
        setUserToDelete(null);
    };
    
    const tableHeaders = [
        { label: "Nome", key: "name" }, { label: "Email", key: "email" }, { label: "Cargo", key: "jobTitle" }, { label: "Departamento", key: "department" }, { label: "Perfil", key: "profile" }, { label: "Status", key: "status" }, { label: "Ações", key: "actions", className: "text-right" }
    ];
    
    const renderUserRow = (user) => (
        <tr key={user.id} className="transition-colors hover:bg-gray-50/50">
            <td className="px-5 py-4 whitespace-nowrap"><div className="flex items-center"><div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold border-2 border-white shadow-sm">{user.name.match(/\b(\w)/g)?.join('').substring(0, 2).toUpperCase() || 'N/A'}</div><div className="ml-3"><div className="text-sm font-semibold text-gray-800">{user.name}</div><div className="text-xs text-gray-500">{user.id}</div></div></div></td>
            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{user.jobTitle || 'N/A'}</td>
            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{user.department}</td>
            <td className="px-5 py-4 whitespace-nowrap"><span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.profile)}`}>{user.profile.charAt(0).toUpperCase() + user.profile.slice(1)}</span></td>
            <td className="px-5 py-4 whitespace-nowrap"><span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
            <td className="px-5 py-4 whitespace-nowrap text-sm font-medium space-x-2.5 text-right">
                <Button onClick={() => handleEditUser(user)} variant="ghost" size="sm" title="Editar Usuário" className="text-blue-600 hover:text-blue-700"><Edit size={16} /></Button>
                <Button onClick={() => requestDeleteUser(user)} variant="ghost" size="sm" title="Excluir Usuário" className="text-red-500 hover:text-red-600" disabled={user.profile === 'admin'}><TrashIcon size={16} /></Button>
            </td>
        </tr>
    );

    return (
        <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Gerenciamento de Usuários">
            <div className="space-y-6">
                <div className="p-5 bg-white rounded-lg shadow-md">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                        <div className="relative flex-grow w-full lg:flex-1">
                            <input id="search-users" type="text" placeholder="Buscar por nome ou email..." className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full shadow-sm text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                        <div className="w-full lg:w-auto flex-shrink-0"><Button onClick={handleAddUser} variant="primary" iconLeft={<UserPlus size={18} />} className="w-full">Adicionar Usuário</Button></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FilterInput label="Perfil" name="profile" value={filters.profile} onChange={e => setFilters(p => ({ ...p, profile: e.target.value }))} placeholder="Todos os Perfis"><option value="admin">Admin</option><option value="manager">Gestor</option><option value="collaborator">Colaborador</option></FilterInput>
                        <FilterInput label="Departamento" name="department" value={filters.department} onChange={e => setFilters(p => ({ ...p, department: e.target.value }))} placeholder="Todos os Departamentos">{itDepartments.map(d => <option key={d} value={d}>{d}</option>)}</FilterInput>
                        <FilterInput label="Status" name="status" value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value }))} placeholder="Todos os Status"><option value="active">Ativo</option><option value="inactive">Inativo</option></FilterInput>
                    </div>
                </div>
                <Table headers={tableHeaders} data={filteredUsers} renderRow={renderUserRow} isLoading={loading} emptyMessage="Nenhum usuário encontrado." searchTerm={searchTerm} />
            </div>
            
            <UserModal isOpen={showUserModal} onClose={() => setShowUserModal(false)} userToEdit={editingUser} />
            
            <ConfirmationModal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={confirmDeleteUser}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja excluir o usuário "${userToDelete?.name}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                isLoading={isDeleteLoading}
            />
        </MainLayout>
    );
};

const UserModal = ({ isOpen, onClose, userToEdit }) => {
    const { users, addUser, updateUser } = useData();
    const { addNotification } = useNotification();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            const initialData = userToEdit
                ? { ...userToEdit, password: '', confirmPassword: '' }
                : { name: '', email: '', profile: 'collaborator', department: itDepartments[0], jobTitle: '', status: 'active', password: '', confirmPassword: '' };
            setFormData(initialData);
            setErrors({});
        }
    }, [userToEdit, isOpen]);

    const availableJobTitles = formData.department ? itJobTitles[formData.department] || [] : [];
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === "department") { setFormData(prev => ({ ...prev, jobTitle: '' })); }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name?.trim()) newErrors.name = "Nome é obrigatório.";
        if (!formData.email?.trim()) newErrors.email = "Email é obrigatório.";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido.";
        else if (users.some(u => u.email.toLowerCase() === formData.email.toLowerCase() && u.id !== formData.id)) newErrors.email = "Este email já está em uso.";
        if (!formData.jobTitle) newErrors.jobTitle = "Cargo é obrigatório.";
        if ((!userToEdit || formData.password) && (formData.password?.length || 0) < 6) newErrors.password = "Senha deve ter no mínimo 6 caracteres.";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "As senhas não coincidem.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true);
        await new Promise(res => setTimeout(res, 500));
        
        const payload = { ...formData };
        if (!userToEdit || (userToEdit && payload.password)) {
            // A senha é salva diretamente
        } else {
            const oldUser = users.find(u => u.id === userToEdit.id);
            payload.password = oldUser.password;
        }

        delete payload.confirmPassword;
        payload.roleDescription = payload.profile.charAt(0).toUpperCase() + payload.profile.slice(1);

        if (userToEdit) {
            updateUser(userToEdit.id, payload);
            addNotification('Usuário atualizado com sucesso!', 'success');
        } else {
            const newId = `userSim${Date.now()}`;
            addUser({ ...payload, id: newId, createdAt: new Date().toISOString() });
            addNotification('Usuário criado com sucesso!', 'success');
        }
        setLoading(false);
        onClose();
    };
    
    return (
        <Modal title={userToEdit ? "Editar Usuário" : "Adicionar Novo Usuário"} isOpen={isOpen} onClose={onClose} onPrimaryAction={handleSubmit} primaryActionText={userToEdit ? "Salvar" : "Criar"} isPrimaryActionLoading={loading} widthClass="max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <FormField label="Nome Completo" name="name" value={formData.name || ''} onChange={handleChange} required error={errors.name} />
                <FormField label="Email" name="email" type="email" value={formData.email || ''} onChange={handleChange} required error={errors.email} />
                <FormField label="Perfil" name="profile" type="select" value={formData.profile || ''} onChange={handleChange} required error={errors.profile}>
                    <option value="collaborator">Colaborador</option><option value="manager">Gestor</option><option value="admin">Admin</option>
                </FormField>
                <FormField label="Departamento" name="department" type="select" value={formData.department || ''} onChange={handleChange} required error={errors.department}>
                    {itDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                </FormField>
                <FormField label="Cargo" name="jobTitle" type="select" value={formData.jobTitle || ''} onChange={handleChange} required error={errors.jobTitle} disabled={availableJobTitles.length === 0}>
                    <option value="">Selecione...</option>
                    {availableJobTitles.map(title => <option key={title} value={title}>{title}</option>)}
                </FormField>
                 <div className="md:col-span-2 mt-2">
                    <p className="text-sm text-gray-600 mb-1">{userToEdit ? "Alterar Senha (opcional)" : "Definir Senha"}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 p-4 border rounded-md bg-slate-50">
                        <FormField label={userToEdit ? "Nova Senha" : "Senha"} name="password" type="password" value={formData.password || ''} onChange={handleChange} required={!userToEdit} error={errors.password} helperText={userToEdit ? "Deixe em branco para não alterar." : "Mínimo 6 caracteres."} />
                        <FormField label={userToEdit ? "Confirmar Nova Senha" : "Confirmar Senha"} name="confirmPassword" type="password" value={formData.confirmPassword || ''} onChange={handleChange} required={!!formData.password} error={errors.confirmPassword} />
                    </div>
                </div>
                <div className="md:col-span-2"><RadioGroup legend="Status" name="status" value={formData.status || ''} onChange={handleChange} options={[{value: 'active', label: 'Ativo'}, {value: 'inactive', label: 'Inativo'}]} required /></div>
            </div>
        </Modal>
    );
};

const AdminGlobalPDIs = ({ setCurrentPage, currentPage }) => {
    const { pdis, users, deletePdi } = useData();
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [showPDIModal, setShowPDIModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPDI, setSelectedPDI] = useState(null);
    const [pdiToDelete, setPdiToDelete] = useState(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    useEffect(() => { setLoading(true); setTimeout(() => setLoading(false), 500); }, [pdis]);

    const handleAddPDI = () => { setSelectedPDI(null); setShowPDIModal(true); };
    const handleEditPDI = (pdi) => { setSelectedPDI(pdi); setShowPDIModal(true); };
    const handleViewPDI = (pdi) => { setSelectedPDI(pdi); setShowViewModal(true); };
    const requestDeletePDI = (pdi) => { setPdiToDelete(pdi); };

    const confirmDeletePDI = async () => {
        if (!pdiToDelete) return;
        setIsDeleteLoading(true);
        await new Promise(res => setTimeout(res, 500));
        deletePdi(pdiToDelete.id);
        addNotification("PDI excluído com sucesso.", "success");
        setIsDeleteLoading(false);
        setPdiToDelete(null);
    };

    const tableHeaders = [
        { label: "Título", key: "title" }, { label: "Colaborador", key: "collaborator" }, { label: "Gestor", key: "manager" },
        { label: "Status PDI", key: "status" }, { label: "Progresso", key: "progress" }, { label: "Prazo", key: "dueDate" }, { label: "Ações", key: "actions", className: "text-right" }
    ];

    const renderPDIRow = (pdi) => {
        const collaborator = users.find(u => u.id === pdi.collaboratorId);
        const manager = users.find(u => u.id === pdi.managerId);
        const progress = pdi.progress || 0;
        return (
            <tr key={pdi.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-4">
                    <div className="text-sm font-semibold text-gray-800">{pdi.title}</div>
                    <div className="text-xs text-gray-500">{pdi.objectives?.length || 0} objetivo(s)</div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{collaborator?.name || 'N/A'}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{manager?.name || 'N/A'}</td>
                <td className="px-5 py-4"><span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(pdi.status)}`}>{pdi.status}</span></td>
                <td className="px-5 py-4 text-sm text-gray-500">
                    <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
                    <span className="text-xs">{progress}%</span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{formatDate(pdi.dueDate)}</td>
                <td className="px-5 py-4 space-x-1.5 text-right">
                    <Button onClick={() => handleViewPDI(pdi)} variant="ghost" size="sm" title="Visualizar PDI" className="text-gray-600 hover:text-gray-800"><Eye size={16} /></Button>
                    <Button onClick={() => handleEditPDI(pdi)} variant="ghost" size="sm" title="Editar PDI" className="text-blue-600 hover:text-blue-700"><Edit size={16} /></Button>
                    <Button onClick={() => requestDeletePDI(pdi)} variant="ghost" size="sm" title="Excluir PDI" className="text-red-500 hover:text-red-600"><TrashIcon size={16} /></Button>
                </td>
            </tr>
        );
    };

    return (
        <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Gerenciamento Global de PDIs">
            <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                    <h2 className="text-lg font-medium text-gray-700">Todos os Planos de Desenvolvimento</h2>
                    <Button onClick={handleAddPDI} variant="primary" iconLeft={<PlusCircle size={18} />}>Novo PDI</Button>
                </div>
                <Table headers={tableHeaders} data={pdis} renderRow={renderPDIRow} isLoading={loading} emptyMessage="Nenhum PDI encontrado." />
            </div>
            <PDIModal isOpen={showPDIModal} onClose={() => setShowPDIModal(false)} pdiToEdit={selectedPDI} />
            {selectedPDI && <PDIViewModal isOpen={showViewModal} onClose={() => setShowViewModal(false)} pdi={selectedPDI} />}
            <ConfirmationModal 
                isOpen={!!pdiToDelete}
                onClose={() => setPdiToDelete(null)}
                onConfirm={confirmDeletePDI}
                isLoading={isDeleteLoading}
                title="Excluir PDI"
                message={`Tem certeza que deseja excluir o PDI "${pdiToDelete?.title}"?`}
            />
        </MainLayout>
    );
};

const PDIModal = ({ isOpen, onClose, pdiToEdit }) => {
    const { users, feedbacks, addPdi, updatePdi } = useData();
    const { addNotification } = useNotification();
    const initialObjective = () => ({ id: `obj_${Date.now()}_${Math.random().toString(16).slice(2)}`, text: '', status: 'pendente', activityType: '', estimatedDurationDays: null });
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if(isOpen) {
            if (pdiToEdit) {
                setFormData({
                    ...pdiToEdit,
                    startDate: pdiToEdit.startDate?.split('T')[0] || '',
                    dueDate: pdiToEdit.dueDate?.split('T')[0] || '',
                    objectives: pdiToEdit.objectives?.length ? pdiToEdit.objectives : [initialObjective()]
                });
            } else {
                setFormData({
                    title: '', overallDescription: '', collaboratorId: '', managerId: '',
                    status: 'Pendente', priority: 'Média', department: '',
                    startDate: new Date().toISOString().split('T')[0], dueDate: '',
                    objectives: [initialObjective()]
                });
            }
            setErrors({});
        }
    }, [pdiToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };
    
    const handleObjectiveChange = (index, field, value) => {
        const updatedObjectives = formData.objectives.map((obj, i) => i === index ? { ...obj, [field]: value } : obj);
        setFormData(prev => ({ ...prev, objectives: updatedObjectives }));
    };

    const addObjective = () => setFormData(prev => ({ ...prev, objectives: [...prev.objectives, initialObjective()] }));
    const removeObjective = (index) => {
        if (formData.objectives.length <= 1) return;
        setFormData(prev => ({ ...prev, objectives: prev.objectives.filter((_, i) => i !== index) }));
    };

    const suggestWithAI = async () => {
        const apiKey = "AIzaSyCVP7T9_0rHV4IPFYZURMNpQFL94w06vyo";
        if (!apiKey) {
            addNotification("Chave da API da IA não encontrada.", "error");
            return;
        }

        if (!formData.title?.trim() || !formData.collaboratorId) {
            addNotification("Título do PDI e Colaborador são necessários para sugestões.", "error");
            return;
        }
        setIsAiLoading(true);

        const collaborator = users.find(u => u.id === formData.collaboratorId);
        const collaboratorFeedbacks = feedbacks.filter(fb => fb.collaboratorId === formData.collaboratorId).map(fb => `- ${fb.feedbackText}`).join("\n");

        const prompt = `
            Você é um especialista em desenvolvimento de talentos de TI. Crie um PDI para:
            - Colaborador: ${collaborator.name}
            - Cargo: ${collaborator.jobTitle}
            - Departamento: ${collaborator.department}
            - Foco Principal (Título do PDI): "${formData.title}"
            - Feedbacks Anteriores: ${collaboratorFeedbacks || "Nenhum."}
            
            Gere uma descrição geral e de 2 a 4 objetivos específicos, acionáveis e mensuráveis, com tipo de atividade e duração estimada em dias. Responda APENAS com o objeto JSON.
        `;

        const pdiSuggestionSchema = {
            type: "OBJECT",
            properties: {
                suggestedOverallDescription: { type: "STRING" },
                suggestedObjectives: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            text: { type: "STRING" },
                            activityType: { type: "STRING" },
                            estimatedDurationDays: { type: "NUMBER" }
                        },
                        required: ["text", "activityType", "estimatedDurationDays"]
                    }
                }
            },
            required: ["suggestedOverallDescription", "suggestedObjectives"]
        };

        try {
            const payload = {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: pdiSuggestionSchema,
                }
            };

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`Erro da API: ${response.status}`);
            
            const result = await response.json();
            const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!jsonText) throw new Error("Resposta da IA inválida.");
            
            const parsedJson = JSON.parse(jsonText);

            if (parsedJson.suggestedObjectives) {
                const totalDuration = parsedJson.suggestedObjectives.reduce((sum, obj) => sum + (obj.estimatedDurationDays || 0), 0);
                const startDate = new Date();
                const dueDate = new Date();
                dueDate.setDate(startDate.getDate() + totalDuration);

                setFormData(prev => ({
                    ...prev,
                    overallDescription: parsedJson.suggestedOverallDescription || prev.overallDescription,
                    startDate: startDate.toISOString().split('T')[0],
                    dueDate: dueDate.toISOString().split('T')[0],
                    objectives: parsedJson.suggestedObjectives.map(obj => ({
                        ...initialObjective(),
                        text: obj.text,
                        activityType: obj.activityType,
                        estimatedDurationDays: obj.estimatedDurationDays,
                    }))
                }));
                addNotification("Sugestões da IA aplicadas!", "success");
            }

        } catch (error) {
            console.error("Erro ao usar IA:", error);
            addNotification(`Falha ao gerar sugestões: ${error.message}`, "error");
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.collaboratorId || !formData.managerId) {
            addNotification("Título, Colaborador e Gestor são obrigatórios.", "error");
            return;
        }
        setLoading(true);
        await new Promise(res => setTimeout(res, 500));
        
        const completedObjs = formData.objectives.filter(o => o.status === 'concluido').length;
        const progress = formData.objectives.length > 0 ? Math.round((completedObjs / formData.objectives.length) * 100) : 0;
        
        const payload = { ...formData, progress };

        if (pdiToEdit) {
            updatePdi(pdiToEdit.id, payload);
            addNotification("PDI atualizado com sucesso!", "success");
        } else {
            addPdi({ ...payload, id: `pdiSim${Date.now()}` });
            addNotification("PDI criado com sucesso!", "success");
        }
        setLoading(false);
        onClose();
    };

    const collaborators = users.filter(u => u.profile === 'collaborator');
    const managers = users.filter(u => u.profile === 'manager' || u.profile === 'admin');

    return (
        <Modal title={pdiToEdit ? "Editar PDI" : "Novo PDI"} isOpen={isOpen} onClose={onClose} onPrimaryAction={handleSubmit} primaryActionText={pdiToEdit ? "Salvar" : "Criar PDI"} isPrimaryActionLoading={loading} widthClass="max-w-3xl">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <FormField label="Título do PDI" name="title" value={formData.title || ''} onChange={handleChange} required />
                <FormField label="Colaborador" name="collaboratorId" type="select" value={formData.collaboratorId || ''} onChange={handleChange} required>
                    <option value="">Selecione...</option>
                    {collaborators.map(u => <option key={u.id} value={u.id}>{`${u.name} (${u.jobTitle})`}</option>)}
                </FormField>
                <FormField label="Gestor Responsável" name="managerId" type="select" value={formData.managerId || ''} onChange={handleChange} required>
                    <option value="">Selecione...</option>
                    {managers.map(u => <option key={u.id} value={u.id}>{`${u.name} (${u.jobTitle})`}</option>)}
                </FormField>
                <FormField label="Status Geral" name="status" type="select" value={formData.status || ''} onChange={handleChange}>
                    {["Pendente", "Em Andamento", "Concluído", "Atrasado", "Cancelado"].map(s => <option key={s} value={s}>{s}</option>)}
                </FormField>
                <div className="md:col-span-2">
                    <FormField label="Descrição Geral (Contexto)" name="overallDescription" type="textarea" rows={2} value={formData.overallDescription || ''} onChange={handleChange} placeholder="Forneça um contexto geral ou use a IA para gerar..."/>
                </div>
            </div>
            <hr className="my-6" />
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-md font-semibold text-gray-700">Objetivos Específicos do PDI</h4>
                <Button onClick={suggestWithAI} variant="outline" size="sm" iconLeft={<Brain size={16} />} isLoading={isAiLoading} disabled={isAiLoading || !formData.title || !formData.collaboratorId}>
                    {isAiLoading ? "Sugerindo..." : "Sugerir com IA"}
                </Button>
            </div>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar mb-4">
                {formData.objectives?.map((obj, index) => (
                    <div key={obj.id || index} className="p-4 border rounded-lg bg-slate-50 relative">
                        <FormField label={`Objetivo ${index + 1}`} name={`objective_text_${index}`} type="textarea" rows={2} value={obj.text || ''} onChange={e => handleObjectiveChange(index, 'text', e.target.value)} required placeholder="Descreva o objetivo específico..."/>
                        <FormField label="Tipo de Atividade" name={`objective_activityType_${index}`} type="text" value={obj.activityType || ''} onChange={(e) => handleObjectiveChange(index, 'activityType', e.target.value)} placeholder="Ex: Curso, Projeto, Mentoria" />
                        <RadioGroup name={`objective_status_${index}`} value={obj.status} onChange={e => handleObjectiveChange(index, 'status', e.target.value)} options={objectiveStatuses} legend="Status do Objetivo"/>
                        {formData.objectives.length > 1 && <Button onClick={() => removeObjective(index)} variant="ghost" size="sm" className="absolute top-2 right-2 text-red-500 hover:text-red-700 !p-1"><TrashIcon size={16} /></Button>}
                    </div>
                ))}
            </div>
            <Button onClick={addObjective} variant="outline" size="sm" iconLeft={<PlusCircle size={16} />}>Adicionar Novo Objetivo</Button>

             <hr className="my-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                 <FormField label="Data de Início" name="startDate" type="date" value={formData.startDate || ''} onChange={handleChange} required />
                 <FormField label="Data de Prazo Final" name="dueDate" type="date" value={formData.dueDate || ''} onChange={handleChange} required />
             </div>
        </Modal>
    );
};

// **NOVO** Componente de Visualização do PDI
const PDIViewModal = ({ isOpen, onClose, pdi }) => {
    const { users } = useData();
    if (!pdi) return null;

    const collaborator = users.find(u => u.id === pdi.collaboratorId);
    const manager = users.find(u => u.id === pdi.managerId);

    const DetailItem = ({ label, value }) => (
        <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-sm text-gray-800">{value || "N/A"}</p>
        </div>
    );

    return (
        <Modal title="Detalhes do PDI" isOpen={isOpen} onClose={onClose} showActions={false} widthClass="max-w-2xl">
            <div className="space-y-4">
                <div>
                    <h4 className="text-lg font-semibold text-gray-900">{pdi.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 italic">"{pdi.overallDescription}"</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-b py-4">
                    <DetailItem label="Colaborador" value={collaborator?.name} />
                    <DetailItem label="Gestor Responsável" value={manager?.name} />
                    <DetailItem label="Status" value={<span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pdi.status)}`}>{pdi.status}</span>} />
                    <DetailItem label="Prioridade" value={pdi.priority} />
                    <DetailItem label="Data de Início" value={formatDate(pdi.startDate)} />
                    <DetailItem label="Prazo Final" value={formatDate(pdi.dueDate)} />
                </div>
                <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Objetivos</h5>
                    <ul className="space-y-3">
                        {pdi.objectives.map(obj => (
                            <li key={obj.id} className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-800">{obj.text}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                                    <span>Tipo: {obj.activityType}</span>
                                    <span>Status: {objectiveStatuses.find(s => s.value === obj.status)?.label}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div className="text-right mt-4">
                    <Button onClick={onClose}>Fechar</Button>
                </div>
            </div>
        </Modal>
    );
};


const AdminGlobalFeedbacks = ({ setCurrentPage, currentPage }) => {
    const { feedbacks, users, deleteFeedback } = useData();
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [editingFeedback, setEditingFeedback] = useState(null);
    const [feedbackToDelete, setFeedbackToDelete] = useState(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFeedbacks = React.useMemo(() => {
        return feedbacks
            .map(fb => ({
                ...fb,
                collaboratorName: users.find(u => u.id === fb.collaboratorId)?.name || 'N/A',
                managerName: users.find(u => u.id === fb.managerId)?.name || 'N/A',
            }))
            .filter(fb => {
                const lowerSearch = searchTerm.toLowerCase();
                return !searchTerm || fb.collaboratorName.toLowerCase().includes(lowerSearch) || fb.managerName.toLowerCase().includes(lowerSearch) || fb.feedbackText.toLowerCase().includes(lowerSearch);
            })
            .sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted));
    }, [feedbacks, users, searchTerm]);
    
    useEffect(() => { setLoading(true); setTimeout(() => setLoading(false), 500); }, []);

    const handleAdd = () => { setEditingFeedback(null); setShowFeedbackModal(true); };
    const handleEdit = (fb) => { setEditingFeedback(fb); setShowFeedbackModal(true); };
    const requestDelete = (fb) => { setFeedbackToDelete(fb); };

    const confirmDelete = async () => {
        if (!feedbackToDelete) return;
        setIsDeleteLoading(true);
        await new Promise(res => setTimeout(res, 500));
        deleteFeedback(feedbackToDelete.id);
        addNotification("Feedback excluído.", "success");
        setIsDeleteLoading(false);
        setFeedbackToDelete(null);
    };

    const tableHeaders = [
        { label: "Data", key: "date" }, { label: "Gestor", key: "manager" }, { label: "Colaborador", key: "collaborator" },
        { label: "Tipo", key: "type" }, { label: "Feedback (Prévia)", key: "preview" }, { label: "Ações", key: "actions", className: "text-right" }
    ];

    const renderRow = (fb) => (
        <tr key={fb.id} className="hover:bg-gray-50/50">
            <td className="px-5 py-4 text-sm text-gray-500">{formatDateTime(fb.dateSubmitted)}</td>
            <td className="px-5 py-4 text-sm font-medium text-gray-700">{fb.managerName}</td>
            <td className="px-5 py-4 text-sm font-medium text-gray-700">{fb.collaboratorName}</td>
            <td className="px-5 py-4"><span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(fb.type)}`}>{fb.type || '-'}</span></td>
            <td className="px-5 py-4 text-sm text-gray-600 max-w-xs truncate" title={fb.feedbackText}>{fb.feedbackText}</td>
            <td className="px-5 py-4 space-x-2.5 text-right">
                <Button onClick={() => handleEdit(fb)} variant="ghost" size="sm"><Edit size={16} /></Button>
                <Button onClick={() => requestDelete(fb)} variant="ghost" size="sm"><TrashIcon size={16} /></Button>
            </td>
        </tr>
    );

    return (
        <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Gerenciamento Global de Feedbacks">
            <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                    <div className="relative w-full sm:max-w-md">
                        <input type="text" placeholder="Buscar..." className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-md w-full" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    <Button onClick={handleAdd} variant="primary" iconLeft={<PlusCircle size={18} />}>Novo Feedback</Button>
                </div>
                <Table headers={tableHeaders} data={filteredFeedbacks} renderRow={renderRow} isLoading={loading} emptyMessage="Nenhum feedback encontrado." searchTerm={searchTerm} />
            </div>
            <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} feedbackToEdit={editingFeedback} isAdminCreating={true} />
            <ConfirmationModal isOpen={!!feedbackToDelete} onClose={() => setFeedbackToDelete(null)} onConfirm={confirmDelete} isLoading={isDeleteLoading} title="Excluir Feedback" message="Tem certeza que deseja excluir este feedback?" />
        </MainLayout>
    );
};

const FeedbackModal = ({ isOpen, onClose, feedbackToEdit, isAdminCreating = false, currentUserIdForManagerScreen }) => {
    const { users, pdis, addFeedback, updateFeedback } = useData();
    const { addNotification } = useNotification();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(isOpen) {
            if (feedbackToEdit) {
                setFormData({ ...feedbackToEdit, meetingDate: feedbackToEdit.meetingDate?.split('T')[0] });
            } else {
                setFormData({
                    collaboratorId: '', managerId: isAdminCreating ? '' : currentUserIdForManagerScreen,
                    pdiId: '', feedbackText: '', type: 'Positivo', meetingDate: '', nextSteps: ''
                });
            }
        }
    }, [feedbackToEdit, isOpen, isAdminCreating, currentUserIdForManagerScreen]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async () => {
        if (!formData.collaboratorId || !formData.feedbackText) {
            addNotification("Colaborador e texto do feedback são obrigatórios.", "error");
            return;
        }
        setLoading(true);
        await new Promise(res => setTimeout(res, 500));
        
        const payload = { ...formData, dateSubmitted: new Date().toISOString() };

        if (feedbackToEdit) {
            updateFeedback(feedbackToEdit.id, payload);
            addNotification("Feedback atualizado.", "success");
        } else {
            addFeedback({ ...payload, id: `fbSim${Date.now()}` });
            addNotification("Feedback enviado.", "success");
        }
        setLoading(false);
        onClose();
    };
    
    const collaborators = users.filter(u => u.profile === 'collaborator' || (isAdminCreating && u.profile === 'manager'));
    const managers = users.filter(u => u.profile === 'manager' || u.profile === 'admin');
    const relevantPDIs = pdis.filter(p => p.collaboratorId === formData.collaboratorId || !formData.collaboratorId);

    return (
        <Modal title={feedbackToEdit ? "Editar Feedback" : "Novo Feedback"} isOpen={isOpen} onClose={onClose} onPrimaryAction={handleSubmit} primaryActionText={feedbackToEdit ? "Salvar" : "Enviar"} isPrimaryActionLoading={loading} widthClass="max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <FormField label="Para (Colaborador/Gestor)" name="collaboratorId" type="select" value={formData.collaboratorId || ''} onChange={handleChange} required>
                    <option value="">Selecione...</option>
                    {collaborators.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </FormField>
                {isAdminCreating ? (
                    <FormField label="De (Gestor/Admin)" name="managerId" type="select" value={formData.managerId || ''} onChange={handleChange} required>
                        <option value="">Selecione...</option>
                        {managers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </FormField>
                ) : <FormField label="De (Você)" name="managerIdDisplay" value={users.find(u => u.id === currentUserIdForManagerScreen)?.name || ''} disabled />}
                <FormField label="PDI Relacionado (Opcional)" name="pdiId" type="select" value={formData.pdiId || ''} onChange={handleChange}>
                    <option value="">Nenhum PDI específico</option>
                    {relevantPDIs.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </FormField>
                <FormField label="Tipo de Feedback" name="type" type="select" value={formData.type || ''} onChange={handleChange} required>
                    {["Positivo", "Construtivo", "Reconhecimento", "Alinhamento", "Outro"].map(t => <option key={t} value={t}>{t}</option>)}
                </FormField>
                <div className="md:col-span-2"><FormField label="Texto do Feedback" name="feedbackText" type="textarea" rows={5} value={formData.feedbackText || ''} onChange={handleChange} required placeholder="Descreva o feedback..."/></div>
                <FormField label="Data da Conversa (Opcional)" name="meetingDate" type="date" value={formData.meetingDate || ''} onChange={handleChange} />
                <div className="md:col-span-2"><FormField label="Próximos Passos (Opcional)" name="nextSteps" type="textarea" rows={3} value={formData.nextSteps || ''} onChange={handleChange} placeholder="Defina ações..."/></div>
            </div>
        </Modal>
    );
};

const ManagerDashboard = ({ setCurrentPage, currentPage }) => {
    const { currentUser } = useAuth();
    const { users, pdis, feedbacks } = useData();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({ teamSize: 0, activePDIsTeam: 0, myActivePDIs: 0, teamFeedbacksGiven: 0, teamPDIStatus: [], myPDIsUpcoming: [] });

    useEffect(() => {
        if (!currentUser) return;
        setLoading(true);
        setTimeout(() => {
            const teamMembers = users.filter(u => u.managerId === currentUser.id);
            const teamPDIs = pdis.filter(pdi => teamMembers.some(tm => tm.id === pdi.collaboratorId));
            const myPDIsList = pdis.filter(pdi => pdi.collaboratorId === currentUser.id);
            setDashboardData({
                teamSize: teamMembers.length,
                activePDIsTeam: teamPDIs.filter(p => p.status === 'Em Andamento' || p.status === 'Atrasado').length,
                myActivePDIs: myPDIsList.filter(p => p.status !== 'Concluído').length,
                teamFeedbacksGiven: feedbacks.filter(f => f.managerId === currentUser.id).length,
                teamPDIStatus: Object.entries(teamPDIs.reduce((acc, pdi) => { acc[pdi.status] = (acc[pdi.status] || 0) + 1; return acc; }, {})).map(([name, value]) => ({ name, value })),
                myPDIsUpcoming: myPDIsList.filter(p => p.status !== 'Concluído').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 3)
            });
            setLoading(false);
        }, 500);
    }, [currentUser, users, pdis, feedbacks]);
    
    if (loading) return <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Painel do Gestor"><LoadingScreen /></MainLayout>

    return (
        <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle={`Painel do Gestor: ${currentUser?.name || ''}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <DashboardCard title="Membros da Equipe" value={dashboardData.teamSize} icon={<Users />} bgColorClass="bg-blue-100" textColorClass="text-blue-600" />
                <DashboardCard title="PDIs Ativos (Equipe)" value={dashboardData.activePDIsTeam} icon={<Target />} bgColorClass="bg-orange-100" textColorClass="text-orange-600" linkTo="manager-team-pdis" setCurrentPage={setCurrentPage}/>
                <DashboardCard title="Meus PDIs Ativos" value={dashboardData.myActivePDIs} icon={<Briefcase />} bgColorClass="bg-green-100" textColorClass="text-green-600" linkTo="manager-my-pdis" setCurrentPage={setCurrentPage} />
                <DashboardCard title="Feedbacks Enviados" value={dashboardData.teamFeedbacksGiven} icon={<MessageSquare />} bgColorClass="bg-yellow-100" textColorClass="text-yellow-700" linkTo="manager-give-feedback" setCurrentPage={setCurrentPage} />
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Status dos PDIs da Equipe">
                    <ResponsiveContainer width="100%" height="100%"><BarChart data={dashboardData.teamPDIStatus}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Legend /><Bar dataKey="value" fill="#8884d8" /></BarChart></ResponsiveContainer>
                </ChartCard>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Meus Próximos PDIs</h3>
                     {dashboardData.myPDIsUpcoming.length > 0 ? (
                        <ul className="space-y-3">{dashboardData.myPDIsUpcoming.map(pdi => <li key={pdi.id} className="p-3 bg-slate-50 rounded-lg border"><p className="font-semibold">{pdi.title}</p><p className="text-sm text-gray-500">Prazo: {formatDate(pdi.dueDate)}</p></li>)}</ul>
                    ) : <p className="text-gray-500 text-center py-4">Nenhum PDI ativo.</p>}
                </div>
            </div>
        </MainLayout>
    );
};

const ManagerTeamPDIs = ({ setCurrentPage, currentPage }) => {
    const { currentUser } = useAuth();
    const { pdis, users } = useData();
    const [loading, setLoading] = useState(true);
    const [showPDIModal, setShowPDIModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPDI, setSelectedPDI] = useState(null);

    const teamPDIs = React.useMemo(() => {
        if (!currentUser) return [];
        return pdis
            .filter(pdi => pdi.managerId === currentUser.id)
            .map(pdi => ({ ...pdi, collaboratorName: users.find(u => u.id === pdi.collaboratorId)?.name || 'N/A' }))
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    }, [currentUser, pdis, users]);

    useEffect(() => { setLoading(true); setTimeout(() => setLoading(false), 500); }, [teamPDIs]);

    const handleViewPDI = (pdi) => { setSelectedPDI(pdi); setShowViewModal(true); };
    const handleEditPDI = (pdi) => { setSelectedPDI(pdi); setShowPDIModal(true); };

    const tableHeaders = [
        { label: "Título PDI", key: "title" }, { label: "Colaborador", key: "collaboratorName" },
        { label: "Status", key: "status" }, { label: "Progresso", key: "progress" }, { label: "Prazo", key: "dueDate" }, { label: "Ações", key: "actions", className: "text-right" }
    ];

    const renderRow = (pdi) => (
        <tr key={pdi.id} className="hover:bg-gray-50/50">
            <td className="px-5 py-4"><div className="text-sm font-semibold">{pdi.title}</div><div className="text-xs text-gray-500">{pdi.objectives?.length || 0} objetivo(s)</div></td>
            <td className="px-5 py-4 text-sm">{pdi.collaboratorName}</td>
            <td className="px-5 py-4"><span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(pdi.status)}`}>{pdi.status}</span></td>
            <td className="px-5 py-4"><div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${pdi.progress || 0}%` }}></div></div><span className="text-xs">{pdi.progress || 0}%</span></td>
            <td className="px-5 py-4 text-sm">{formatDate(pdi.dueDate)}</td>
            <td className="px-5 py-4 text-right space-x-1.5">
                <Button onClick={() => handleViewPDI(pdi)} variant="ghost" size="sm" title="Visualizar PDI"><Eye size={16} /></Button>
                <Button onClick={() => handleEditPDI(pdi)} variant="ghost" size="sm" title="Editar PDI"><Edit size={16} /></Button>
            </td>
        </tr>
    );

    return (
        <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="PDIs da Equipe">
            <div className="space-y-6">
                <Table headers={tableHeaders} data={teamPDIs} renderRow={renderRow} isLoading={loading} emptyMessage="Nenhum PDI encontrado para sua equipe." />
            </div>
            <PDIModal isOpen={showPDIModal} onClose={() => setShowPDIModal(false)} pdiToEdit={selectedPDI} />
            {selectedPDI && <PDIViewModal isOpen={showViewModal} onClose={() => setShowViewModal(false)} pdi={selectedPDI} />}
        </MainLayout>
    );
};

const ManagerMyPDIs = ({ setCurrentPage, currentPage }) => {
    const { currentUser } = useAuth();
    const { pdis, updatePdi } = useData();
    const [loading, setLoading] = useState(true);

    const myPDIs = React.useMemo(() => {
        if (!currentUser) return [];
        return pdis.filter(pdi => pdi.collaboratorId === currentUser.id).sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    }, [currentUser, pdis]);
    
    useEffect(() => { setLoading(true); setTimeout(() => setLoading(false), 300); }, [myPDIs]);

    const handleObjectiveStatusChange = (pdiId, objectiveId, newStatus) => {
        const pdiToUpdate = myPDIs.find(p => p.id === pdiId);
        if (!pdiToUpdate) return;

        const updatedObjectives = pdiToUpdate.objectives.map(o => o.id === objectiveId ? { ...o, status: newStatus } : o);
        const completedCount = updatedObjectives.filter(o => o.status === 'concluido').length;
        const newProgress = Math.round((completedCount / updatedObjectives.length) * 100);
        
        let newPdiStatus = pdiToUpdate.status;
        if (newProgress === 100) newPdiStatus = 'Concluído';
        else if (newProgress > 0) newPdiStatus = 'Em Andamento';

        updatePdi(pdiId, { objectives: updatedObjectives, progress: newProgress, status: newPdiStatus });
    };

    if (loading) return <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Meus PDIs"><LoadingScreen /></MainLayout>;
    
    return (
        <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Meus PDIs">
            <div className="space-y-6">
                {myPDIs.length === 0 ? 
                    <div className="text-center py-12 bg-white rounded-lg shadow"><Archive size={48} className="mx-auto text-gray-300 mb-4" /><p className="text-xl text-gray-500">Você ainda não possui Planos de Desenvolvimento.</p></div> 
                : myPDIs.map(pdi => (
                    <div key={pdi.id} className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                            <div><h3 className="text-xl font-semibold text-gray-800">{pdi.title}</h3><p className="text-sm text-gray-500">Prazo: {formatDate(pdi.dueDate)}</p></div>
                            <div className="text-right"><p className="text-sm font-semibold text-blue-600">{pdi.progress || 0}%</p><div className="w-24 bg-gray-200 rounded-full h-2.5 mt-1"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${pdi.progress || 0}%` }}></div></div></div>
                        </div>
                        <h4 className="text-md font-medium text-gray-700 mt-4 mb-2">Objetivos:</h4>
                        <ul className="space-y-2">{pdi.objectives.map(obj => (
                            <li key={obj.id} className="flex items-center p-3 rounded-md bg-slate-50 border border-slate-200">
                                <button onClick={() => handleObjectiveStatusChange(pdi.id, obj.id, obj.status === 'concluido' ? 'em_andamento' : 'concluido')} className="mr-3">{obj.status === 'concluido' ? <CheckSquareIcon size={20} className="text-green-600" /> : <Square size={20} className="text-gray-400" />}</button>
                                <span className={`text-sm ${obj.status === 'concluido' ? 'line-through text-gray-500' : 'text-gray-800'}`}>{obj.text}</span>
                            </li>
                        ))}</ul>
                    </div>
                ))}
            </div>
        </MainLayout>
    );
};

const ManagerGiveFeedbackScreen = ({ setCurrentPage, currentPage }) => {
    const { currentUser } = useAuth();
    const { users, pdis, feedbacks } = useData();
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    const teamMembers = users.filter(u => u.managerId === currentUser?.id);
    const feedbacksGiven = feedbacks.filter(fb => fb.managerId === currentUser?.id)
        .map(fb => ({ ...fb, collaboratorName: users.find(u => u.id === fb.collaboratorId)?.name || 'N/A' }))
        .sort((a,b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted))
        .slice(0, 5);

    return (
        <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Dar Feedback para Equipe">
            <div className="space-y-6">
                <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Registrar Novo Feedback</h2>
                    <Button onClick={() => setShowFeedbackModal(true)} variant="primary" iconLeft={<Send size={18} />}>Dar Feedback</Button>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Últimos Feedbacks Enviados</h3>
                    {feedbacksGiven.length > 0 ? (
                        <ul className="space-y-3">
                            {feedbacksGiven.map(fb => (
                                <li key={fb.id} className="p-3 bg-slate-50 rounded-md border">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-700">Para: <span className="font-medium">{fb.collaboratorName}</span> (<span className={`text-xs ${fb.type === 'Positivo' ? 'text-green-600' : 'text-yellow-700'}`}>{fb.type}</span>)</p>
                                        <span className="text-xs text-gray-400">{formatDateTime(fb.dateSubmitted)}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1 truncate italic">"{fb.feedbackText}"</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center py-4">Nenhum feedback enviado recentemente.</p>
                    )}
                </div>
            </div>
            <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} users={teamMembers} pdis={pdis} isAdminCreating={false} currentUserIdForManagerScreen={currentUser?.id} />
        </MainLayout>
    );
};

const CollaboratorPDIs = ({ setCurrentPage, currentPage }) => {
    const { currentUser } = useAuth();
    const { pdis, updatePdi } = useData();
    const myPDIs = pdis.filter(p => p.collaboratorId === currentUser?.id);

    const handleObjectiveStatusChange = (pdiId, objectiveId, currentStatus) => {
        const pdiToUpdate = myPDIs.find(p => p.id === pdiId);
        if (!pdiToUpdate) return;
        
        const newStatus = currentStatus === 'concluido' ? 'em_andamento' : 'concluido';
        const updatedObjectives = pdiToUpdate.objectives.map(o => o.id === objectiveId ? { ...o, status: newStatus } : o);
        const completedCount = updatedObjectives.filter(o => o.status === 'concluido').length;
        const newProgress = Math.round((completedCount / updatedObjectives.length) * 100);
        
        let newPdiStatus = newProgress === 100 ? 'Concluído' : 'Em Andamento';

        updatePdi(pdiId, { objectives: updatedObjectives, progress: newProgress, status: newPdiStatus });
    };
    
    return (
        <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Meus Planos de Desenvolvimento">
            <div className="space-y-6">
                 {myPDIs.length === 0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><Archive size={48} className="mx-auto text-gray-300 mb-4" /><p className="text-xl text-gray-500">Você ainda não possui Planos de Desenvolvimento.</p></div> : myPDIs.map(pdi => (
                    <div key={pdi.id} className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                         <div className="flex justify-between items-start mb-3">
                            <div><h3 className="text-xl font-semibold text-gray-800">{pdi.title}</h3><p className="text-sm text-gray-500">Prazo: {formatDate(pdi.dueDate)}</p></div>
                            <div className="text-right"><p className="text-sm font-semibold text-blue-600">{pdi.progress || 0}%</p><div className="w-24 bg-gray-200 rounded-full h-2.5 mt-1"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${pdi.progress || 0}%` }}></div></div></div>
                        </div>
                        <h4 className="text-md font-medium text-gray-700 mt-4 mb-2">Objetivos:</h4>
                        <ul className="space-y-2">{pdi.objectives.map(obj => (
                            <li key={obj.id} className="flex items-center p-3 rounded-md bg-slate-50 border border-slate-200">
                                <button onClick={() => handleObjectiveStatusChange(pdi.id, obj.id, obj.status)} className="mr-3">{obj.status === 'concluido' ? <CheckSquareIcon size={20} className="text-green-600" /> : <Square size={20} className="text-gray-400" />}</button>
                                <span className={`text-sm ${obj.status === 'concluido' ? 'line-through text-gray-500' : 'text-gray-800'}`}>{obj.text}</span>
                            </li>
                        ))}</ul>
                    </div>
                 ))}
            </div>
        </MainLayout>
    );
};

const CollaboratorFeedbacks = ({ setCurrentPage, currentPage }) => {
    const { currentUser } = useAuth();
    const { feedbacks, users, pdis } = useData();
    const myFeedbacks = feedbacks.filter(fb => fb.collaboratorId === currentUser?.id)
        .map(fb => ({ ...fb, managerName: users.find(u => u.id === fb.managerId)?.name || 'N/A' }));

    return (
        <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Meus Feedbacks Recebidos">
             <div className="space-y-6">
                {myFeedbacks.length === 0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><Archive size={48} className="mx-auto text-gray-300 mb-4" /><p className="text-xl text-gray-500">Você ainda não recebeu feedbacks.</p></div> : myFeedbacks.map(fb => (
                    <div key={fb.id} className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">Feedback de <span className="text-blue-600">{fb.managerName}</span></h3>
                            <span className="text-sm text-gray-500">{formatDateTime(fb.dateSubmitted)}</span>
                        </div>
                        {fb.pdiId && <p className="text-sm text-gray-600 mb-1"><strong>PDI:</strong> {pdis.find(p=>p.id === fb.pdiId)?.title}</p>}
                        <p className="text-gray-700 bg-slate-50 p-3 rounded-md my-2 whitespace-pre-wrap">{fb.feedbackText}</p>
                    </div>
                ))}
             </div>
        </MainLayout>
    );
};

//==================================================================================
// 6. Roteador e Componente Raiz App
//==================================================================================

function ApplicationRoutes() {
    const { currentUser } = useAuth();

    const getDefaultPage = useCallback((p) => {
        if (p === 'admin') return 'admin-dashboard';
        if (p === 'manager') return 'manager-dashboard';
        if (p === 'collaborator') return 'collaborator-pdis';
        return 'login';
    }, []);

    const [currentPage, setCurrentPageInternal] = useState(() => {
        const storedPage = sessionStorage.getItem('currentPage');
        return storedPage || (currentUser ? getDefaultPage(currentUser.profile) : 'login');
    });

    const setAndStorePage = useCallback((page) => {
        sessionStorage.setItem('currentPage', page);
        setCurrentPageInternal(page);
    }, []);

    useEffect(() => {
        if (currentUser) {
            const accessiblePages = {
                admin: ['admin-dashboard', 'admin-users', 'admin-pdis', 'admin-feedbacks'],
                manager: ['manager-dashboard', 'manager-team-pdis', 'manager-my-pdis', 'manager-give-feedback'],
                collaborator: ['collaborator-pdis', 'collaborator-feedbacks'],
            };
            const userPages = accessiblePages[currentUser.profile] || [];
            if (!userPages.includes(currentPage)) {
                setAndStorePage(getDefaultPage(currentUser.profile));
            }
        } else if (currentPage !== 'login') {
            setAndStorePage('login');
        }
    }, [currentUser, currentPage, getDefaultPage, setAndStorePage]);


    if (!currentUser) return <LoginScreen />;

    const renderPage = () => {
        const props = { setCurrentPage: setAndStorePage, currentPage };
        switch (currentPage) {
            case 'admin-dashboard': return <AdminDashboard {...props} />;
            case 'admin-users': return <AdminUserManagement {...props} />;
            case 'admin-pdis': return <AdminGlobalPDIs {...props} />;
            case 'admin-feedbacks': return <AdminGlobalFeedbacks {...props} />;
            
            case 'manager-dashboard': return <ManagerDashboard {...props} />;
            case 'manager-team-pdis': return <ManagerTeamPDIs {...props} />;
            case 'manager-my-pdis': return <ManagerMyPDIs {...props} />;
            case 'manager-give-feedback': return <ManagerGiveFeedbackScreen {...props} />;

            case 'collaborator-pdis': return <CollaboratorPDIs {...props} />;
            case 'collaborator-feedbacks': return <CollaboratorFeedbacks {...props} />;
            
            default: 
                // Fallback to default page if current page is somehow invalid
                setAndStorePage(getDefaultPage(currentUser.profile));
                return <LoadingScreen />;
        }
    };
    
    return <div className="min-h-screen bg-gray-100 font-sans">{renderPage()}</div>;
}

export default function App() {
  return (
    <AuthProvider>
        <DataProvider>
            <LoadingProvider>
                <NotificationProvider>
                    <ApplicationRoutes />
                </NotificationProvider>
            </LoadingProvider>
        </DataProvider>
    </AuthProvider>
  );
}
