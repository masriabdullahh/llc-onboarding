export interface ClientData {
  llcName: string;
  legalName: string;
  dateOfBirth: string;
  nationality: string;
  phoneNumber: string;
  address: string;
  email: string;
}

export interface Document {
  file: File | null;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  error?: string;
}

export interface Documents {
  passport: Document;
  proofOfAddress: Document;
}

export type OnboardingStep = 
  | 'initial-form'
  | 'document-upload'
  | 'document-review'
  | 'company-registration'
  | 'ein-issuance'
  | 'complete';

export interface OnboardingStatus {
  currentStep: OnboardingStep;
  documentStatus: 'pending' | 'reviewing' | 'approved' | 'rejected';
  companyStatus: 'pending' | 'registering' | 'registered';
  einStatus: 'pending' | 'processing' | 'issued';
  ein?: string;
  trackingId?: string;
}

export interface AdminUser {
  username: string;
  role: 'admin' | 'processor';
}

export interface Application {
  id: string;
  clientData: ClientData;
  documents: Documents;
  status: OnboardingStatus;
  createdAt: string;
  updatedAt: string;
}