import React from 'react';
import { CheckCircle2, Clock, AlertCircle, FileText, Building2, Hash } from 'lucide-react';
import { OnboardingStatus } from '../types';

interface StatusDashboardProps {
  status: OnboardingStatus;
  onDownloadArticles?: () => void;
  onDownloadEIN?: () => void;
}

export default function StatusDashboard({ status, onDownloadArticles, onDownloadEIN }: StatusDashboardProps) {
  const steps = [
    {
      title: 'Document Verification',
      icon: FileText,
      status: status.documentStatus,
      description: {
        pending: 'Awaiting document upload',
        reviewing: 'Documents under review',
        approved: 'Documents verified',
        rejected: 'Documents rejected',
      },
    },
    {
      title: 'Company Registration',
      icon: Building2,
      status: status.companyStatus,
      description: {
        pending: 'Waiting to begin',
        registering: 'Registration in progress',
        registered: 'Company registered successfully',
      },
    },
    {
      title: 'EIN Issuance',
      icon: Hash,
      status: status.einStatus,
      description: {
        pending: 'Waiting to begin',
        processing: 'EIN application processing',
        issued: 'EIN issued successfully',
      },
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'registered':
      case 'issued':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'reviewing':
      case 'registering':
      case 'processing':
        return <Clock className="h-6 w-6 text-blue-500 animate-pulse" />;
      case 'rejected':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-300" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Formation Progress</h2>

      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={step.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <step.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600">
                    {step.description[step.status as keyof typeof step.description]}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">{getStatusIcon(step.status)}</div>
            </div>

            {/* Download buttons for completed steps */}
            {step.status === 'registered' && index === 1 && onDownloadArticles && (
              <button
                onClick={onDownloadArticles}
                className="mt-4 inline-flex items-center px-4 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileText className="mr-2 h-4 w-4" />
                Download Articles of Organization
              </button>
            )}

            {step.status === 'issued' && index === 2 && onDownloadEIN && (
              <div className="mt-4 space-y-4">
                <p className="text-sm font-medium text-gray-900">
                  Your EIN: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{status.ein}</span>
                </p>
                <button
                  onClick={onDownloadEIN}
                  className="inline-flex items-center px-4 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Download EIN Letter
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}