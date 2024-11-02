import React from 'react';
import { Application } from '../../types';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface ApplicationListProps {
  applications: Application[];
  onSelectApplication: (application: Application) => void;
}

export default function ApplicationList({ applications, onSelectApplication }: ApplicationListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'registered':
      case 'issued':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'reviewing':
      case 'registering':
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-300" />;
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {applications.map((application) => (
          <li key={application.id}>
            <button
              onClick={() => onSelectApplication(application)}
              className="w-full block hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(application.status.documentStatus)}
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {application.clientData.llcName}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {application.clientData.legalName}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        {application.status.documentStatus === 'pending' ? 'Awaiting Review' : 
                         application.status.documentStatus === 'reviewing' ? 'Under Review' :
                         application.status.documentStatus === 'approved' ? 'Documents Approved' :
                         'Documents Rejected'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}