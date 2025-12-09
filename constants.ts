import type { Appointment, Case, CaseAnalyticsData, Client, Hearing, NavItem, StatCard, Task, LawyerProfile, StudyMaterial, AnalysisResult } from './types';
import ClientsIcon from './components/icons/ClientsIcon';
// Fix: Import icons for stats cards.
import BriefcaseIcon from './components/icons/BriefcaseIcon';
import FileTextIcon from './components/icons/FileTextIcon';
import FileClockIcon from './components/icons/FileClockIcon';
import UserIcon from './components/icons/UserIcon';

// Restored Icon Imports for Navigation
import DashboardIcon from './components/icons/DashboardIcon';
import CasesIcon from './components/icons/CasesIcon';
import DocumentsIcon from './components/icons/DocumentsIcon';
import AppointmentIcon from './components/icons/AppointmentIcon';
import AnalyticsIcon from './components/icons/AnalyticsIcon';
import AdvisorIcon from './components/icons/AdvisorIcon';
import TasksIcon from './components/icons/TasksIcon';
import ProfileIcon from './components/icons/ProfileIcon';

const getDynamicDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

export const LAWYER_PROFILE: LawyerProfile = {
  name: 'Priti Patwa',
  title: 'Lawyer',
  email: 'pritipatwa01@gmail.com',
  phone: '(555) 555-5555',
  address: '123 Legal Way, Suite 400, Lawsville, LS 54321',
  age: 34,
  bio: 'Priti Patwa is a seasoned lawyer with over 10 years of experience specializing in corporate law and intellectual property. She is dedicated to providing top-tier legal services and strategic advice to her clients. Priti holds a J.D. from Harvard Law School and is a member of the New York State Bar Association.',
  specialties: ['Corporate Law', 'Intellectual Property', 'Contract Negotiation', 'Litigation'],
  education: [
    { degree: 'Juris Doctor (J.D.)', school: 'Harvard Law School', year: '2014' },
    { degree: 'B.A. in Political Science', school: 'Columbia University', year: '2011' },
  ],
};

export const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', icon: DashboardIcon },
  { name: 'Cases', icon: CasesIcon },
  { name: 'Clients', icon: ClientsIcon },
  { name: 'Documents', icon: DocumentsIcon },
  { name: 'Appointments', icon: AppointmentIcon },
  { name: 'Deadlines & Tasks', icon: TasksIcon },
  { name: 'Analytics', icon: AnalyticsIcon },
  { name: 'My Profile', icon: ProfileIcon },
  { name: 'Legal AI Advisor', icon: AdvisorIcon },
];

export const CLIENTS: Client[] = [
    { id: 1, name: 'Anjali Satpute', email: 'anjali.s@example.com', phone: '(555) 123-4567', address: '123 Main St, New York, NY 10001', notes: [], createdDate: '2024-07-01' },
    { id: 2, name: 'Rutuja Suryawanshi', email: 'rutuja.suryawanshi@example.com', phone: '(555) 234-5678', address: '456 Oak Ave, Los Angeles, CA 90001', notes: [{ id: 1, date: '2024-07-10', text: 'Initial consultation regarding estate planning.', author: 'Priti Patwa' }], createdDate: '2024-07-05' },
    { id: 3, name: 'Aarti Kite', email: 'aarti.k@example.com', phone: '(555) 345-6789', address: '789 Pine Ln, Chicago, IL 60601', notes: [], createdDate: '2024-07-12' },
    { id: 4, name: 'Snehal Chavan', email: 'snehal.chavan@example.com', phone: '(555) 456-7890', address: '101 Maple Dr, Houston, TX 77001', notes: [], createdDate: '2024-08-01' },
    { id: 5, name: 'Sakshi Patil', email: 'sakshi.p@example.com', phone: '(555) 567-8901', address: '212 Birch Rd, Phoenix, AZ 85001', notes: [{ id: 2, date: '2024-08-11', text: 'Discussed trademark strategy for new logo.', author: 'Priti Patwa' }], createdDate: '2024-08-10' },
    { id: 6, name: 'Aaditya Idate', email: 'aaditya.idate@example.com', phone: '(555) 678-9012', address: '333 Elm Ct, Philadelphia, PA 19101', notes: [], createdDate: '2024-08-15' },
    { id: 7, name: 'Ritesh Sutar', email: 'ritesh.sutar@example.com', phone: '(555) 789-0123', address: '444 Cedar Pl, San Antonio, TX 78201', notes: [], createdDate: '2024-08-20' },
    { id: 8, name: 'Jivan Kamble', email: 'jivan.kamble@example.com', phone: '(555) 890-1234', address: '555 Spruce Way, San Diego, CA 92101', notes: [], createdDate: '2024-09-01' },
    { id: 9, name: 'Rutvik Patil', email: 'rutvik.patil@example.com', phone: '(555) 901-2345', address: '666 Walnut Blvd, Dallas, TX 75201', notes: [], createdDate: '2024-09-05' },
    { id: 10, name: 'Prathmesh Chavan', email: 'prathmesh.c@example.com', phone: '(555) 012-3456', address: '777 Chestnut St, San Jose, CA 95101', notes: [], createdDate: '2024-09-10' },
    { id: 11, name: 'Aniket Kumbhar', email: 'aniket.kumbhar@example.com', phone: '(555) 123-4568', address: '888 Redwood Ave, Austin, TX 78701', notes: [], createdDate: '2024-09-15' },
    { id: 12, name: 'Shree Kore', email: 'shree.kore@example.com', phone: '(555) 234-5679', address: '999 Sequoia Dr, Jacksonville, FL 32201', notes: [], createdDate: '2024-09-20' },
    { id: 13, name: 'Priya Sharma', email: 'priya.s@example.com', phone: '(555) 345-6790', address: '111 Aspen Ct, San Francisco, CA 94101', notes: [], createdDate: '2024-09-25' },
    { id: 14, name: 'Rajesh Kumar', email: 'rajesh.k@example.com', phone: '(555) 456-7901', address: '222 Willow Ln, Columbus, OH 43201', notes: [], createdDate: '2024-10-01' },
    { id: 15, name: 'Deepika Singh', email: 'deepika.singh@example.com', phone: '(555) 567-9012', address: '333 Cypress Blvd, Charlotte, NC 28201', notes: [], createdDate: '2024-10-05' }
];

export const CASES: Case[] = [
  { id: 1, caseId: 'CASE-001', clientId: 1, name: 'Anjali Satpute v. Globex Corp', matterType: 'Litigation', status: 'Active', nextDeadline: getDynamicDate(0), progress: 0, description: 'Civil litigation matter regarding a contract dispute.', clientPhone: '(555) 123-4567', clientLocation: 'New York, NY', lawyer: 'Priti Patwa', createdDate: '2024-07-01', updates: [] },
  { id: 2, caseId: 'CASE-002', clientId: 2, name: 'Rutuja Suryawanshi Estate', matterType: 'Probate', status: 'Active', nextDeadline: getDynamicDate(3), progress: 75, description: 'Estate administration and distribution of assets.', clientPhone: '(555) 234-5678', clientLocation: 'Los Angeles, CA', lawyer: 'Priti Patwa', createdDate: '2024-07-05', updates: [] },
  { id: 3, caseId: 'CASE-003', clientId: 3, name: 'Aarti Kite Lease Agreement', matterType: 'Contract', status: 'Active', nextDeadline: getDynamicDate(5), progress: 50, description: 'Review and negotiation of a commercial lease agreement.', clientPhone: '(555) 345-6789', clientLocation: 'Chicago, IL', lawyer: 'Priti Patwa', createdDate: '2024-07-12', updates: [] },
  { id: 4, caseId: 'CASE-004', clientId: 4, name: 'Snehal Chavan Property Purchase', matterType: 'Real Estate', status: 'Active', nextDeadline: '2024-11-15', progress: 0, description: 'Residential property purchase agreement.', clientPhone: '(555) 456-7890', clientLocation: 'Houston, TX', lawyer: 'Priti Patwa', createdDate: '2024-08-01', updates: [] },
  { id: 5, caseId: 'CASE-005', clientId: 5, name: 'Sakshi Patil Trademark Application', matterType: 'Intellectual Property', status: 'Active', nextDeadline: '2024-11-26', progress: 0, description: 'Trademark application for a new business logo.', clientPhone: '(555) 567-8901', clientLocation: 'Phoenix, AZ', lawyer: 'Priti Patwa', createdDate: '2024-08-10', updates: [] },
  { id: 6, caseId: 'CASE-006', clientId: 6, name: 'Aaditya Idate Corporate Restructuring', matterType: 'Corporate', status: 'Active', nextDeadline: '2024-12-05', progress: 95, description: 'Corporate restructuring and shareholder agreements.', clientPhone: '(555) 678-9012', clientLocation: 'Philadelphia, PA', lawyer: 'Priti Patwa', createdDate: '2024-08-15', updates: [] },
  { id: 7, caseId: 'CASE-007', clientId: 7, name: 'State v. Ritesh Sutar', matterType: 'Criminal Defense', status: 'Active', nextDeadline: getDynamicDate(6), progress: 0, description: 'Defense against misdemeanor charges.', clientPhone: '(555) 789-0123', clientLocation: 'San Antonio, TX', lawyer: 'Priti Patwa', createdDate: '2024-08-20', updates: [] },
  { id: 8, caseId: 'CASE-008', clientId: 8, name: 'Jivan Kamble Divorce', matterType: 'Family Law', status: 'Pending', nextDeadline: '2024-12-31', progress: 0, description: 'Divorce proceedings and child custody arrangements.', clientPhone: '(555) 890-1234', clientLocation: 'San Diego, CA', lawyer: 'Priti Patwa', createdDate: '2024-09-01', updates: [] },
  { id: 9, caseId: 'CASE-009', clientId: 9, name: 'Rutvik Patil Licensing Agreement', matterType: 'Tech Law', status: 'Active', nextDeadline: '2025-01-10', progress: 40, description: 'Software licensing agreement negotiation.', clientPhone: '(555) 901-2345', clientLocation: 'Dallas, TX', lawyer: 'Priti Patwa', createdDate: '2024-09-05', updates: [] },
  { id: 10, caseId: 'CASE-010', clientId: 10, name: 'Prathmesh Chavan M&A', matterType: 'Corporate', status: 'Closed', nextDeadline: 'N/A', progress: 100, description: 'Merger and acquisition transaction, successfully closed.', clientPhone: '(555) 012-3456', clientLocation: 'San Jose, CA', lawyer: 'Priti Patwa', createdDate: '2024-09-10', updates: [] },
  { id: 11, caseId: 'CASE-011', clientId: 11, name: 'Aniket Kumbhar IP Litigation', matterType: 'Intellectual Property', status: 'Active', nextDeadline: '2025-01-22', progress: 60, description: 'Patent infringement litigation.', clientPhone: '(555) 123-4568', clientLocation: 'Austin, TX', lawyer: 'Priti Patwa', createdDate: '2024-09-15', updates: [] },
  { id: 12, caseId: 'CASE-012', clientId: 12, name: 'Shree Kore Will Contest', matterType: 'Probate', status: 'Pending', nextDeadline: '2025-02-01', progress: 10, description: 'Contested will and testament.', clientPhone: '(555) 234-5679', clientLocation: 'Jacksonville, FL', lawyer: 'Priti Patwa', createdDate: '2024-09-20', updates: [] },
  { id: 15, caseId: 'CASE-013', clientId: 8, name: 'Jivan Kamble v. IRS', matterType: 'Tax Law', status: 'Pending', nextDeadline: '2025-02-10', progress: 20, description: 'Dispute with the IRS over tax assessment.', clientPhone: '(555) 567-8902', clientLocation: 'Charlotte, NC', lawyer: 'Priti Patwa', createdDate: '2024-10-05', updates: [] },
];

// Fix: Add missing constant definitions.
export const UPCOMING_TASKS: Task[] = [
    { id: 1, title: 'Draft Motion for Summary Judgment', details: 'Case: CASE-001 - Anjali Satpute v. Globex Corp', completed: false },
    { id: 2, title: 'Follow up with opposing counsel', details: 'Case: CASE-003 - Aarti Kite Lease Agreement', completed: false },
    { id: 3, title: 'Prepare for deposition', details: 'Case: CASE-011 - Aniket Kumbhar IP Litigation', completed: false },
];

export const CASE_ANALYTICS_DATA: CaseAnalyticsData[] = [
    { category: 'Litigation', count: 5 },
    { category: 'Corporate', count: 8 },
    { category: 'Probate', count: 3 },
    { category: 'Real Estate', count: 4 },
    { category: 'IP', count: 6 },
    { category: 'Family Law', count: 2 },
];

export const STATS_DATA: StatCard[] = [
    { title: 'Active Cases', value: 18, description: 'Cases currently in progress', icon: BriefcaseIcon },
    { title: 'Open Tasks', value: 12, description: 'Pending legal tasks', icon: FileTextIcon },
    { title: 'Upcoming Deadlines', value: 5, description: 'In the next 30 days', icon: FileClockIcon },
    { title: 'Total Clients', value: CLIENTS.length, description: 'All clients managed', icon: UserIcon },
];

export const UPCOMING_HEARINGS: Hearing[] = [
    { id: 1, date: getDynamicDate(0), title: 'Motion to Compel Discovery', client: 'Anjali Satpute' },
    { id: 2, date: getDynamicDate(2), title: 'Pre-Trial Conference', client: 'Ritesh Sutar' },
    { id: 3, date: getDynamicDate(7), title: 'Final Custody Hearing', client: 'Jivan Kamble' },
];

export const APPOINTMENTS: Appointment[] = [
    { id: 1, date: getDynamicDate(0), title: 'Initial Consultation', client: 'New Client Inquiry', caseNumber: 'N/A' },
    { id: 2, date: getDynamicDate(0), title: 'Strategy Session', client: 'Sakshi Patil', caseNumber: 'CASE-005' },
    { id: 3, date: getDynamicDate(1), title: 'Document Review', client: 'Aaditya Idate', caseNumber: 'CASE-006' },
];

export const MOCK_ANALYSIS_RESULTS: { [key in AnalysisResult['type']]: AnalysisResult } = {
  corporate: {
    type: 'corporate',
    caseContext: "This document appears to be a corporate Merger & Acquisition agreement. It details the terms under which one company will acquire another, including financial considerations, representations, and warranties. The analysis is based on a simulated offline model.",
    dataAnalysis: "Key entities identified: AcquiringCo, TargetCo.\nKey dates: Signing Date, Closing Date.\nCore clauses: Purchase Price, Representations and Warranties, Covenants, Closing Conditions.\nJurisdiction: The agreement is governed by the laws of Delaware.",
    strategicAdvice: "1. Conduct thorough due diligence on TargetCo's financials and liabilities.\n2. Ensure all closing conditions are met or waived appropriately.\n3. Verify that all representations and warranties are accurate and complete.\n4. Prepare for post-merger integration challenges.",
    questions: [
      "What is the total purchase price and payment structure?",
      "Are there any indemnification caps or baskets?",
      "What are the key employee retention agreements in place?",
      "Are there any outstanding litigation or regulatory issues with TargetCo?",
      "What approvals are required from shareholders or regulatory bodies?",
      "What are the key closing conditions and are there any potential roadblocks?",
      "How will intellectual property be transferred and valued?",
      "Are there any significant environmental or real estate liabilities?",
      "What is the plan for post-merger integration of the two companies' operations?",
      "Are there any change-of-control provisions in TargetCo's major contracts that could be triggered by the acquisition?",
      "Have we reviewed the company's data privacy and security policies for compliance?",
      "What are the tax implications of the transaction structure?"
    ],
    relatedCaseId: "CASE-006",
    relatedCaseName: "Aaditya Idate Corporate Restructuring",
  },
  realEstate: {
    type: 'realEstate',
    caseContext: "This document is identified as a Commercial Lease Agreement for a retail property. It establishes the rights and obligations of the Landlord and Tenant over a specified term. The analysis is based on a simulated offline model.",
    dataAnalysis: "Key entities identified: Landlord Properties LLC, Tenant Retail Inc.\nKey dates: Commencement Date, Expiration Date.\nCore clauses: Rent, Term, Use of Premises, Maintenance and Repairs, Insurance.\nJurisdiction: The agreement is governed by the laws of the state where the property is located.",
    strategicAdvice: "1. Verify the 'Use of Premises' clause allows for the client's intended business operations.\n2. Clarify responsibilities for CAM (Common Area Maintenance) charges.\n3. Negotiate any personal guarantees required from the tenant.\n4. Review the clauses regarding assignment and subletting.",
    questions: [
      "What is the base rent and how are escalations calculated?",
      "Who is responsible for structural repairs vs. routine maintenance?",
      "What are the insurance requirements for the tenant?",
      "Are there any options to renew or extend the lease term?",
      "What are the default and remedy provisions?",
      "Does the lease include an exclusivity clause preventing the landlord from renting to competitors?",
      "Are there any restrictions on signage or alterations to the premises?",
      "Has a title search been conducted to identify any liens or encumbrances on the property?",
      "Are there any zoning restrictions or upcoming changes that could affect the intended use of the property?",
      "What are the provisions for force majeure events (e.g., natural disasters)?",
      "Has an environmental site assessment (Phase I) been completed?",
      "What are the specific terms for surrender of the premises at the end of the lease?"
    ],
    relatedCaseId: "CASE-003",
    relatedCaseName: "Aarti Kite Lease Agreement",
  },
  ip: {
    type: 'ip',
    caseContext: "This document appears to be a Software Licensing Agreement, granting a licensee rights to use proprietary software under specific conditions. The analysis is based on a simulated offline model.",
    dataAnalysis: "Key entities identified: Licensor Tech Corp, Licensee Solutions Ltd.\nKey dates: Effective Date, Term of License.\nCore clauses: License Grant, Restrictions, Fees, Intellectual Property Ownership, Warranty Disclaimers.\nJurisdiction: The agreement is governed by the laws of California.",
    strategicAdvice: "1. Ensure the scope of the license grant meets the client's needs without being overly broad.\n2. Scrutinize restrictions on use, modification, and reverse engineering.\n3. Clarify data privacy and security obligations related to the software's use.\n4. Understand the support and maintenance terms (SLAs).",
    questions: [
      "Is this a perpetual or subscription-based license?",
      "Can the software be used by affiliates or subsidiaries?",
      "Who owns any modifications or improvements made to the software?",
      "What are the licensor's liability limits in case of a software failure?",
      "What is the process for auditing the licensee's compliance?",
      "How is confidential information defined and protected under the agreement?",
      "What are the specific service level agreements (SLAs) for support and uptime?",
      "What are the procedures for handling a data breach involving the software?",
      "Are there any restrictions on using third-party contractors to work with the software?",
      "What is the process for escalating technical support issues?",
      "How does the agreement handle open-source software components used within the licensed product?",
      "What are the termination clauses and data extraction rights upon termination?"
    ],
    relatedCaseId: "CASE-009",
    relatedCaseName: "Rutvik Patil Licensing Agreement",
  },
  litigation: {
    type: 'litigation',
    caseContext: "The provided text appears to be a complaint filed in a civil litigation case. It outlines the plaintiff's allegations against the defendant and the legal basis for the claims. The analysis is based on a simulated offline model.",
    dataAnalysis: "Key entities identified: Plaintiff, Defendant.\nKey dates: Date of Incident.\nCore clauses: Statement of Facts, Causes of Action (e.g., Breach of Contract, Negligence), Prayer for Relief.\nJurisdiction: United States District Court for the Northern District.",
    strategicAdvice: "1. Immediately assess the statute of limitations for all claims.\n2. Begin evidence preservation and issue a litigation hold notice to the client.\n3. Analyze each cause of action for legal sufficiency and identify potential defenses.\n4. Consider filing a motion to dismiss based on procedural or substantive grounds.",
    questions: [
      "What is the exact timeline of events leading to this dispute?",
      "Are there any written contracts or correspondence between the parties?",
      "Who are the key witnesses for our side?",
      "What evidence exists to support or refute the plaintiff's claims?",
      "Has there been any prior communication or settlement discussion with the opposing party?",
      "What are the potential damages we could be facing if we lose?",
      "Are there any insurance policies that might cover the claims in this lawsuit?",
      "What is our budget for the discovery phase of this litigation?",
      "Are there any counterclaims we should consider filing against the plaintiff?",
      "What are the strengths and weaknesses of our case as you see them right now?",
      "What are the likely costs associated with taking this case to trial versus settling?",
      "Have you preserved all relevant documents, emails, and other data (litigation hold)?"
    ],
    relatedCaseId: "CASE-001",
    relatedCaseName: "Anjali Satpute v. Globex Corp",
  }
};
