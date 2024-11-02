import React from 'react';
import { ClientData } from '../types';
import { PhoneIcon, User, Building2, Flag, MapPin, Mail } from 'lucide-react';

interface InitialFormProps {
  data: ClientData;
  onSubmit: (data: ClientData) => void;
  onChange: (data: Partial<ClientData>) => void;
}

export default function InitialForm({ data, onSubmit, onChange }: InitialFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  const isValidPhone = (phone: string) => {
    return /^\+?[\d\s-]{10,}$/.test(phone);
  };

  const isValidDate = (date: string) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date));
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid = () => {
    return (
      data.llcName &&
      data.legalName &&
      isValidDate(data.dateOfBirth) &&
      data.nationality &&
      isValidPhone(data.phoneNumber) &&
      data.address &&
      isValidEmail(data.email)
    );
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Company Formation Details</h2>
      
      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LLC Name
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={data.llcName}
              onChange={(e) => onChange({ llcName: e.target.value })}
              className="pl-10 w-full rounded-lg border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter LLC name"
              required
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Legal Name (as in passport)
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={data.legalName}
              onChange={(e) => onChange({ legalName: e.target.value })}
              className="pl-10 w-full rounded-lg border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter legal name"
              required
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => onChange({ dateOfBirth: e.target.value })}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nationality
          </label>
          <div className="relative">
            <Flag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={data.nationality}
              onChange={(e) => onChange({ nationality: e.target.value })}
              className="pl-10 w-full rounded-lg border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter nationality"
              required
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className={`pl-10 w-full rounded-lg border ${
                data.email && !isValidEmail(data.email)
                  ? 'border-red-500'
                  : 'border-gray-300'
              } bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="your@email.com"
              required
            />
          </div>
          {data.email && !isValidEmail(data.email) && (
            <p className="mt-1 text-sm text-red-500">Please enter a valid email address</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="tel"
              value={data.phoneNumber}
              onChange={(e) => onChange({ phoneNumber: e.target.value })}
              className={`pl-10 w-full rounded-lg border ${
                data.phoneNumber && !isValidPhone(data.phoneNumber)
                  ? 'border-red-500'
                  : 'border-gray-300'
              } bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="+1 (555) 555-5555"
              required
            />
          </div>
          {data.phoneNumber && !isValidPhone(data.phoneNumber) && (
            <p className="mt-1 text-sm text-red-500">Please enter a valid phone number</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
            <textarea
              value={data.address}
              onChange={(e) => onChange({ address: e.target.value })}
              className="pl-10 w-full rounded-lg border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={3}
              placeholder="Enter full address"
              required
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={!isFormValid()}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Continue to Document Upload
        </button>
        <p className="mt-2 text-sm text-gray-500 text-center">
          You'll receive an email with a tracking link to monitor your application status
        </p>
      </div>
    </form>
  );
}