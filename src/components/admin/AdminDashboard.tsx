import React, { useState } from 'react';
import { Application } from '../../types';
import ApplicationList from './ApplicationList';
import ApplicationDetail from './ApplicationDetail';

interface AdminDashboardProps {
  applications: Application[];
  onUpdateApplication: (applicationId: string, updates: Partial<Application>) => void;
}

export default function AdminDashboard({ applications, onUpdateApplication }: AdminDashboardProps) {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const handleUpdateStatus = (
    type: 'documents' | 'company' | 'ein',
    status: string,
    ein?: string
  ) => {
    if (!selectedApplication) return;

    const updates: Partial<Application> = {
      status: {
        ...selectedApplication.status,
        [`${type}Status`]: status,
      },
    };

    if (ein) {
      updates.status = {
        ...updates.status!,
        ein,
      };
    }

    onUpdateApplication(selectedApplication.id, updates);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Applications</h2>
          <ApplicationList
            applications={applications}
            onSelectApplication={setSelectedApplication}
          />
        </div>
        <div className="lg:col-span-2">
          {selectedApplication ? (
            <ApplicationDetail
              application={selectedApplication}
              onUpdateStatus={handleUpdateStatus}
            />
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center text-gray-500">
              Select an application to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}