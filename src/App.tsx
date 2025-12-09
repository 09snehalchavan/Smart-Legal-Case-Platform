import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ClientsPage from '../components/ActiveCasesTable';
import ClientProfilePage from '../components/ClientProfilePage';
import { CASES, CLIENTS, LAWYER_PROFILE, UPCOMING_TASKS } from '../constants';
import type { Case, Client, ClientNote, LawyerProfile, StudyMaterial, Task } from '../types';
import { encryptAndSign, keyGenerationPromise } from '../components/cryptoUtils';

// Page Imports
import DashboardStats from '../components/DashboardStats';
import Overview from '../components/Overview';
import CasesPage from '../components/CasesPage';
import AppointmentsPage from '../components/AppointmentsPage';
import CaseAnalytics from '../components/CaseAnalytics';
import LegalAdvisorPage from '../components/LegalAdvisorPage';
import DeadlinesPage from '../components/DeadlinesPage';
import LawyerProfilePage from '../components/LawyerProfilePage';
import StudyMaterialPage from '../components/StudyMaterialPage';
import LoginPage from '../components/LoginPage';

// Auth Screens
import LandingPage from '../components/LandingPage';
import LoginSelectionPage from '../components/LoginSelectionPage';
import RegistrationPage from '../components/RegistrationPage';
import ForgotPasswordPage from '../components/ForgotPasswordPage';
import ClientLoginPage from '../components/ClientLoginPage';
import ClientRegistrationPage from '../components/ClientRegistrationPage';
import ClientDashboardPage from '../components/ClientDashboardPage';
import VerificationPendingPage from '../components/VerificationPendingPage';

// Firebase
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

type AuthView =
  | 'landing' | 'selection'
  | 'lawyer-login' | 'lawyer-register' | 'lawyer-forgot'
  | 'client-login' | 'client-register' | 'client-forgot'
  | 'verification' | 'dashboard';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('landing');
  const [userType, setUserType] = useState<'lawyer' | 'client' | null>(null);
  const [userEmail, setUserEmail] = useState('');

  const [activePage, setActivePage] = useState('Dashboard');
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [clients, setClients] = useState<Client[]>(CLIENTS);
  const [cases, setCases] = useState<Case[]>(CASES);
  const [searchQuery, setSearchQuery] = useState('');
  const [lawyerProfile, setLawyerProfile] = useState<LawyerProfile>(LAWYER_PROFILE);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [tasks, setTasks] = useState<Task[]>(UPCOMING_TASKS);

  useEffect(() => {
    keyGenerationPromise.catch(error => {
      console.error("Critical error: Could not generate cryptographic keys.", error);
    });
  }, []);

  // ⭐⭐⭐ LAWYER FIXED CREDENTIALS ⭐⭐⭐
  const validLawyer = {
    email: "lawyer@smartlegal.com",
    password: "Lawyer@123"
  };

  // ⭐⭐⭐ LOGIN HANDLER ⭐⭐⭐
  const handleLogin = async (email: string, pass: string) => {
    console.log(`Login attempt: ${email}`);

    if (userType === "lawyer") {
      if (email === validLawyer.email && pass === validLawyer.password) {
        setUserEmail(email);
        setIsLoggedIn(true);
        setAuthView("dashboard");
        return;
      }
      throw new Error("Invalid Lawyer Credentials");
    }

    if (userType === "client") {
      await signInWithEmailAndPassword(auth, email, pass);
      setUserEmail(email);
      setIsLoggedIn(true);
      setAuthView("dashboard");
      return;
    }
  };

  // ⭐⭐⭐ REGISTER ⭐⭐⭐
  const handleRegister = async (email: string, pass: string) => {
    if (userType === "client") {
      await createUserWithEmailAndPassword(auth, email, pass);
      setUserEmail(email);
      setAuthView("verification");
      return;
    }

    setUserEmail(email);
    setAuthView("verification");
  };

  // ⭐⭐⭐ RESET PASSWORD ⭐⭐⭐
  const handleForgotPassword = async (email: string) => {
    if (userType === "client") {
      await sendPasswordResetEmail(auth, email);
      alert(`Password reset link sent to ${email}`);
      setAuthView("client-login");
      return;
    }

    alert(`Password reset link sent to ${email}`);
    setAuthView("lawyer-login");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthView('selection');
    setUserType(null);
    setSelectedClientId(null);
    setActivePage('Dashboard');
  };
  // =============================
  // DASHBOARD + LOGIC FUNCTIONS
  // =============================

  const handleSelectClient = (clientId: number) => {
    setSelectedClientId(clientId);
    setActivePage('Client Profile');
  };

  const handleBackToClients = () => {
    setSelectedClientId(null);
    setActivePage('Clients');
  };

  const handleSaveClient = (clientData: Omit<Client, 'id' | 'notes' | 'createdDate'>, id?: number) => {
    if (id) {
      setClients(clients.map(c => c.id === id ? { ...c, ...clientData } : c));
    } else {
      const newClient: Client = {
        id: Date.now(),
        ...clientData,
        notes: [],
        createdDate: new Date().toISOString().split('T')[0],
      };
      setClients([...clients, newClient]);
    }
  };

  const handleDeleteClient = useCallback((clientId: number) => {
    setClients(prevClients => prevClients.filter(c => c.id !== clientId));
  }, []);

  const handleAddNote = (clientId: number, noteText: string) => {
    const newNote: ClientNote = {
      id: Date.now(),
      text: noteText,
      author: lawyerProfile.name,
      date: new Date().toISOString(),
    };
    setClients(clients.map(c => c.id === clientId ? { ...c, notes: [...c.notes, newNote] } : c));
  };

  const handleUpdateNote = (clientId: number, noteId: number, newText: string) => {
    setClients(clients.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          notes: c.notes.map(n => n.id === noteId ? { ...n, text: newText } : n)
        };
      }
      return c;
    }));
  };

  const handleDeleteNote = (clientId: number, noteId: number) => {
    setClients(clients.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          notes: c.notes.filter(n => n.id !== noteId)
        };
      }
      return c;
    }));
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleSaveCase = (caseData: Omit<Case, 'id' | 'progress'>, id?: number) => {
    if (id) {
      setCases(prevCases =>
        prevCases.map(c => c.id === id ? { ...c, ...caseData } as Case : c)
      );
    } else {
      const newCase: Case = {
        ...caseData,
        id: Date.now(),
        progress: 0,
      };
      setCases(prevCases => [newCase, ...prevCases]);
    }
  };

  const handleDeleteCase = useCallback((caseId: number) => {
    setCases(prevCases => prevCases.filter(c => c.id !== caseId));
  }, []);

  const handleSaveStudyMaterial = (material: StudyMaterial) => {
    const existing = studyMaterials.find(m => m.id === material.id);
    if (existing) {
      setStudyMaterials(studyMaterials.map(m => m.id === material.id ? material : m));
    } else {
      setStudyMaterials([...studyMaterials, material]);
    }
  };

  const handleDeleteStudyMaterial = useCallback((materialId: number) => {
    setStudyMaterials(prevMaterials => prevMaterials.filter(m => m.id !== materialId));
  }, []);

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'completed'>, id?: number) => {
    if (id) {
      setTasks(tasks.map(t => (t.id === id ? { ...t, ...taskData } : t)));
    } else {
      const newTask: Task = {
        id: Date.now(),
        ...taskData,
        completed: false,
      };
      setTasks([newTask, ...tasks]);
    }
  };

  const handleDeleteTask = useCallback((taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
  }, []);

  const handleToggleCompleteTask = (taskId: number) => {
    setTasks(tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
  };

  // ============================
  // MAIN DASHBOARD PAGE RENDER
  // ============================
  const renderLawyerDashboardContent = () => {
    if (selectedClientId) {
      const client = clients.find(c => c.id === selectedClientId);
      const clientCases = cases.filter(c => c.clientId === selectedClientId);
      if (client) {
        return (
          <ClientProfilePage
            client={client}
            cases={clientCases}
            onBack={handleBackToClients}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onUpdateClient={handleUpdateClient}
          />
        );
      }
    }

    switch (activePage) {
      case 'Dashboard':
        return (
          <div className="space-y-6">
            <DashboardStats />
            <div className="grid grid-cols-1 gap-6">
              <Overview />
            </div>
          </div>
        );
      case 'Cases':
        return (
          <CasesPage
            searchQuery={searchQuery}
            cases={cases}
            onSaveCase={handleSaveCase}
            onDeleteCase={handleDeleteCase}
          />
        );
      case 'Clients':
        return (
          <ClientsPage
            clients={clients}
            searchQuery={searchQuery}
            onSelectClient={handleSelectClient}
            onSaveClient={handleSaveClient}
            onDeleteClient={handleDeleteClient}
          />
        );
      case 'Documents':
        return (
          <StudyMaterialPage
            materials={studyMaterials}
            onSave={handleSaveStudyMaterial}
            onDelete={handleDeleteStudyMaterial}
          />
        );
      case 'Appointments':
        return <AppointmentsPage onBack={() => setActivePage('Dashboard')} />;
      case 'Deadlines & Tasks':
        return (
          <DeadlinesPage
            tasks={tasks}
            onSaveTask={handleSaveTask}
            onDeleteTask={handleDeleteTask}
            onToggleCompleteTask={handleToggleCompleteTask}
            onBack={() => setActivePage('Dashboard')}
          />
        );
      case 'Analytics':
        return <CaseAnalytics onBack={() => setActivePage('Dashboard')} />;
      case 'My Profile':
        return (
          <LawyerProfilePage
            profileData={lawyerProfile}
            onSave={setLawyerProfile}
            onLogout={handleLogout}
          />
        );
      case 'Legal AI Advisor':
        return <LegalAdvisorPage documents={[]} />;
      default:
        return <div>Page not found</div>;
    }
  };
  // ============================
  // AUTH SCREENS (BEFORE LOGIN)
  // ============================
  if (!isLoggedIn) {
    switch (authView) {
      case 'landing':
        return <LandingPage onGetStarted={() => setAuthView('selection')} />;

      case 'selection':
        return (
          <LoginSelectionPage
            onSelectLawyer={() => {
              setUserType('lawyer');
              setAuthView('lawyer-login');
            }}
            onSelectClient={() => {
              setUserType('client');
              setAuthView('client-login');
            }}
            onBack={() => setAuthView('landing')}
          />
        );

      case 'lawyer-login':
        return (
          <LoginPage
            onLogin={handleLogin}
            onForgotPassword={() => setAuthView('lawyer-forgot')}
            onGoToRegister={() => setAuthView('lawyer-register')}
            onBack={() => {
              setUserType(null);
              setAuthView('selection');
            }}
          />
        );

      case 'lawyer-register':
        return (
          <RegistrationPage
            onRegister={handleRegister}
            onBackToLogin={() => setAuthView('lawyer-login')}
          />
        );

      case 'lawyer-forgot':
        return (
          <ForgotPasswordPage
            originPortal="lawyer"
            onSubmit={handleForgotPassword}
            onBackToLogin={() => setAuthView('lawyer-login')}
          />
        );

      case 'client-login':
        return (
          <ClientLoginPage
            onLogin={handleLogin}
            onForgotPassword={() => setAuthView('client-forgot')}
            onGoToRegister={() => setAuthView('client-register')}
            onBack={() => {
              setUserType(null);
              setAuthView('selection');
            }}
          />
        );

      case 'client-register':
        return (
          <ClientRegistrationPage
            onRegister={handleRegister}
            onBackToLogin={() => setAuthView('client-login')}
          />
        );

      case 'client-forgot':
        return (
          <ForgotPasswordPage
            originPortal="client"
            onSubmit={handleForgotPassword}
            onBackToLogin={() => setAuthView('client-login')}
          />
        );

      case 'verification':
        return (
          <VerificationPendingPage
            userEmail={userEmail}
            userType={userType || 'lawyer'}
            onBackToLogin={() =>
              setAuthView(userType === 'client' ? 'client-login' : 'lawyer-login')
            }
          />
        );

      default:
        return (
          <LoginSelectionPage
            onSelectLawyer={() => {
              setUserType('lawyer');
              setAuthView('lawyer-login');
            }}
            onSelectClient={() => {
              setUserType('client');
              setAuthView('client-login');
            }}
            onBack={() => setAuthView('landing')}
          />
        );
    }
  }

  // ============================
  // CLIENT DASHBOARD (AFTER LOGIN)
  // ============================
  if (userType === 'client') {
    const clientData = {
        name: userEmail,
        email: userEmail,
        phone: "",
        address: "",
        notes: [],
        id: 0
    };

    const clientCases = cases.filter(c => c.clientId === 0);

    return (
      <ClientDashboardPage
        client={clientData}
        cases={clientCases}
        studyMaterials={studyMaterials}
        lawyerProfile={lawyerProfile}
        onLogout={handleLogout}
      />
    );
}


  // ============================
  // LAWYER DASHBOARD (AFTER LOGIN)
  // ============================
  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar activeItem={activePage} onNavigate={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          lawyerName={lawyerProfile.name}
          lawyerTitle={lawyerProfile.title}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6">
          {renderLawyerDashboardContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
