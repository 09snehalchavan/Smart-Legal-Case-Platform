import type React from 'react';

export interface CaseUpdate {
  id: number;
  date: string;
  text: string;
  author: string;
}

export interface ClientNote {
  id: number;
  date: string;
  text: string;
  author: string;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: ClientNote[];
  createdDate: string;
}

export interface Case {
  id: number;
  caseId: string;
  clientId: number;
  name: string;
  matterType: string;
  status: 'Active' | 'Pending' | 'Closed';
  nextDeadline: string;
  progress?: number;
  description: string;
  clientPhone: string;
  clientLocation: string;
  lawyer: string;
  createdDate: string;
  updates: CaseUpdate[];
}

export interface NavItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface Education {
  degree: string;
  school: string;
  year: string;
}

export interface LawyerProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  age: number;
  bio: string;
  specialties: string[];
  education: Education[];
}

// Fix: Add missing type definitions.
export interface Task {
  id: number;
  title: string;
  details: string;
  completed: boolean;
}

export interface CaseAnalyticsData {
  category: string;
  count: number;
}

export interface Document {
  id: number;
  name: string;
  caseId: string;
  uploadDate: string;
  type: 'pdf' | 'word' | 'image' | 'video' | 'excel' | 'txt';
  content: ArrayBuffer;
  isEncrypted: boolean;
  salt?: Uint8Array;
  iv?: Uint8Array;
}

export interface StatCard {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface StudyMaterial {
  id: number;
  name: string;
  description: string;
  uploadDate: string;
  type: 'pdf' | 'word' | 'image' | 'video';
  content: ArrayBuffer; // This will be the encrypted content
  // ECC Hybrid Encryption fields
  iv: ArrayBuffer;
  ephemeralPubKey: ArrayBuffer;
  signature: ArrayBuffer;
}

// Fix: Define the missing SharedResource type to resolve import errors.
export interface SharedResource {
  id: number;
  name: string;
  description: string;
  uploadDate: string;
  type: 'pdf' | 'word' | 'image' | 'video';
  content: ArrayBuffer;
  isEncrypted: boolean;
  salt?: Uint8Array;
  iv?: Uint8Array;
}


export interface Hearing {
  id: number;
  date: string;
  title: string;
  client: string;
}

export interface Appointment {
  id: number;
  date: string;
  title: string;
  client: string;
  caseNumber: string;
}

export interface AnalysisResult {
  caseContext: string;
  dataAnalysis: string;
  strategicAdvice: string;
  questions: string[];
  relatedCaseId: string;
  relatedCaseName: string;
  type: 'corporate' | 'realEstate' | 'ip' | 'litigation';
}