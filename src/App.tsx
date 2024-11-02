import React, { useState, useCallback } from 'react';
import { ClientData, Documents, OnboardingStatus, OnboardingStep, Application, AdminUser } from './types';
import InitialForm from './components/InitialForm';
import DocumentUpload from './components/DocumentUpload';
import StatusDashboard from './components/StatusDashboard';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { CheckCircle2, Lock } from 'lucide-react';

// Mock admin credentials - In production, this would be handled securely
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  const [step, setStep] = useState<OnboardingStep>('initial-form');
  const [clientData, setClientData] = useState<ClientData>({
    llcName: '',
    legalName: '',
    dateOfBirth: '',
    nationality: '',
    phoneNumber: '',
    address: '',
    email: '',
  });

  const [documents, setDocuments] = useState<Documents>({
    passport: { file: null, status: 'pending' },
    proofOfAddress: { file: null, status: 'pending' },
  });

  const [status, setStatus] = useState<OnboardingStatus>({
    currentStep: 'initial-form',
    documentStatus: 'pending',
    companyStatus: 'pending',
    einStatus: 'pending',
  });

  const handleAdminLogin = (username: string, password: string) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminUser({ username, role: 'admin' });
    } else {
      alert('Invalid credentials');
    }
  };

  const generateTrackingId = () => {
    return `LLC-${Date.now().toString(36).toUpperCase()}`;
  };

  const sendTrackingEmail = (email: string, trackingId: string) => {
    // In a real application, this would send an actual email
    console.log(`Sending tracking email to ${email} with tracking ID: ${trackingId}`);
    console.log(`Tracking URL: ${window.location.origin}/track/${trackingId}`);
  };

  const handleFormSubmit = (data: ClientData) => {
    const trackingId = generateTrackingId();
    setClientData(data);
    setStep('document-upload');
    
    // Create new application with tracking ID
    const newApplication: Application = {
      id: Date.now().toString(),
      clientData: data,
      documents,
      status: {
        ...status,
        trackingId,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setApplications(prev => [...prev, newApplication]);

    // Send tracking email
    sendTrackingEmail(data.email, trackingId);
  };

  const handleDocumentUpload = useCallback((type: keyof Documents, file: File) => {
    setDocuments(prev => ({
      ...prev,
      [type]: { file, status: 'pending' },
    }));
  }, []);

  const handleDocumentSubmit = () => {
    setStep('company-registration');
    setStatus(prev => ({
      ...prev,
      currentStep: 'document-review',
      documentStatus: 'reviewing',
    }));

    // Update application status
    const currentApp = applications.find(app => app.clientData.email === clientData.email);
    if (currentApp) {
      setApplications(prev => prev.map(app => {
        if (app.id === currentApp.id) {
          return {
            ...app,
            documents,
            status: {
              ...app.status,
              currentStep: 'document-review',
              documentStatus: 'reviewing',
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return app;
      }));
    }
  };

  const handleUpdateApplication = (applicationId: string, updates: Partial<Application>) => {
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        const updatedApp = { ...app, ...updates, updatedAt: new Date().toISOString() };
        // Send status update email
        if (updates.status && updates.status !== app.status) {
          sendStatusUpdateEmail(app.clientData.email, updatedApp.status);
        }
        return updatedApp;
      }
      return app;
    }));
  };

  const sendStatusUpdateEmail = (email: string, status: OnboardingStatus) => {
    // In a real application, this would send an actual email
    console.log(`Sending status update email to ${email}`);
    console.log('Status:', status);
  };

  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <button
                onClick={() => setIsAdmin(false)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <AdminDashboard
          applications={applications}
          onUpdateApplication={handleUpdateApplication}
        />
      </div>
    );
  }

  // Check if we're on a tracking page
  const trackingMatch = window.location.pathname.match(/^\/track\/(.+)$/);
  if (trackingMatch) {
    const trackingId = trackingMatch[1];
    const application = applications.find(app => app.status.trackingId === trackingId);
    
    if (application) {
      return (
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-900">Application Status</h1>
            </div>
          </header>
          <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <StatusDashboard
              status={application.status}
              onDownloadArticles={application.status.companyStatus === 'registered' ? handleDownloadArticles : undefined}
              onDownloadEIN={application.status.einStatus === 'issued' ? handleDownloadEIN : undefined}
            />
          </main>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Application Not Found</h2>
          <p className="mt-2 text-gray-600">The tracking ID provided is invalid or expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">LLC Formation Portal</h1>
            <div className="flex items-center space-x-4">
              {step !== 'initial-form' && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Welcome, {clientData.legalName}</span>
                </div>
              )}
              <button
                onClick={() => setShowAdminLogin(true)}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
              >
                <Lock className="h-4 w-4 mr-1" />
                Admin
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {renderStep()}
      </main>
    </div>
  );

  function renderStep() {
    switch (step) {
      case 'initial-form':
        return (
          <InitialForm
            data={clientData}
            onSubmit={handleFormSubmit}
            onChange={(data) => setClientData(prev => ({ ...prev, ...data }))}
          />
        );
      case 'document-upload':
        return (
          <DocumentUpload
            documents={documents}
            onUpload={handleDocumentUpload}
            onSubmit={handleDocumentSubmit}
          />
        );
      case 'company-registration':
        return (
          <div className="max-w-2xl mx-auto p-6">
            <StatusDashboard
              status={status}
              onDownloadArticles={status.companyStatus === 'registered' ? handleDownloadArticles : undefined}
              onDownloadEIN={status.einStatus === 'issued' ? handleDownloadEIN : undefined}
            />
          </div>
        );
      default:
        return null;
    }
  }

  function handleDownloadArticles() {
    alert('Downloading Articles of Organization...');
  }

  function handleDownloadEIN() {
    alert('Downloading EIN Letter...');
  }
}