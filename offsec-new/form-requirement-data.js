/* ============== Offensive Sec — Form & Requirement data ============== */

// VAPT projects available to link a form to (mirrors projects.html)
const VAPT_PROJECTS = [
  'BSI Core Infra VA — Q2',
  'MMKSI Microsite Pentest',
  'KTB HRIS Mobile Pentest',
  'MMKSI VTS Web Audit',
  'KTB D-Net Interface VAPT',
  'KTB FDMA Q3 Pentest',
  'KTB Karoseri Portal VAPT',
  'KTB Supplier Portal VA Infra',
];

const APP_TYPES = [
  'Web Application',
  'Mobile Application',
  'API / Web Service',
  'Infrastructure / Network',
  'Desktop / Thick Client',
];

const ENVIRONMENTS = ['Production', 'Staging', 'UAT', 'Development'];

// Drives both the create form and the read-only detail view, in order.
const FORM_QUESTIONS = [
  { key: 'appName',       q: 'What is the name of the application?',                          type: 'text' },
  { key: 'reason',        q: 'What is the reason for testing?',                               type: 'textarea' },
  { key: 'appType',       q: 'What is the type of the application?',                          type: 'select', options: APP_TYPES },
  { key: 'hasThirdParty', q: 'Are there any third-party integrations or dependencies?',        type: 'bool' },
  { key: 'thirdParty',    q: 'If yes, list the integrations / dependencies in scope.',         type: 'textarea', dependsOn: 'hasThirdParty' },
  { key: 'userRoles',     q: 'What user roles exist in the application?',                      type: 'text' },
  { key: 'environment',   q: 'Which environment will be tested?',                             type: 'select', options: ENVIRONMENTS },
  { key: 'sensitiveData', q: 'What sensitive data does the application handle?',              type: 'textarea' },
  { key: 'notes',         q: 'Any additional information or testing constraints?',            type: 'textarea' },
];

const FR_STATUS_PILL = {
  'Draft':     'pill-todo',
  'Submitted': 'pill-progress',
  'In Review': 'pill-review',
  'Approved':  'pill-done',
};

const FORMREQS = [
  {
    id: 'FR-001',
    application: 'MMKSI - Microsite',
    project: 'MMKSI Microsite Pentest',
    status: 'Submitted',
    createdBy: 'Sarah Park',
    createdDate: '2025-11-12',
    form: {
      appName: 'MMKSI Microsite',
      reason: 'Annual security assessment ahead of the Q1 marketing campaign launch. Management requires a clean VAPT report before exposing the new dealer-onboarding flow to the public.',
      appType: 'Web Application',
      hasThirdParty: true,
      thirdParty: 'Midtrans payment gateway (sandbox), Google Maps Embed API, Google reCAPTCHA v3, Sentry error tracking.',
      userRoles: 'Guest, Registered User, Dealer, Administrator',
      environment: 'Staging',
      sensitiveData: 'Customer PII (name, email, phone), dealer business documents, payment tokens (tokenised, no PAN stored).',
      notes: 'Please avoid automated load testing during 09:00–17:00 WIB. The staging DB is shared with the QA team.',
    },
    requirements: [
      { url: 'https://staging.microsite.mmksi.co.id',        username: 'pentest_admin',  password: 'P3ntest!Adm2025', info: 'Full administrator access to back-office.' },
      { url: 'https://staging.microsite.mmksi.co.id/dealer', username: 'dealer_demo01',  password: 'Dealer#Demo01',   info: 'Dealer role — limited to own branch data.' },
      { url: 'https://staging.microsite.mmksi.co.id/app',    username: 'user_demo01',    password: 'User#Demo2025',   info: 'Standard registered customer account.' },
    ],
    blacklist: [
      { url: 'https://staging.microsite.mmksi.co.id/api/payment/charge', reason: 'Wired to live Midtrans sandbox webhook — repeated calls flood the finance team inbox.' },
      { url: 'https://staging.microsite.mmksi.co.id/admin/broadcast',    reason: 'Sends bulk SMS/email to a real subscriber list.' },
    ],
  },
  {
    id: 'FR-002',
    application: 'BSI - Infra',
    project: 'BSI Core Infra VA — Q2',
    status: 'In Review',
    createdBy: 'Abu Rizal Mahdi',
    createdDate: '2025-11-04',
    form: {
      appName: 'BSI Core Banking Infrastructure',
      reason: 'Regulatory (OJK) mandated infrastructure vulnerability assessment of the core banking perimeter and internal segmentation.',
      appType: 'Infrastructure / Network',
      hasThirdParty: true,
      thirdParty: 'Active Directory (federated), F5 BIG-IP WAF, CyberArk PAM for jump-host access.',
      userRoles: 'Network read-only auditor, Jump-host operator',
      environment: 'Production',
      sensitiveData: 'Cardholder data environment (CDE), internal network topology, credentials in transit.',
      notes: 'No exploitation that could cause service disruption. Testing window strictly 22:00–04:00 WIB. SWIFT gateway and ATM network are OUT of scope.',
    },
    requirements: [
      { url: 'https://jump.bsi-infra.internal:8443', username: 'va_auditor', password: 'V@ult-Issued-OTP', info: 'Access brokered through CyberArk — OTP issued per session.' },
      { url: '10.20.0.0/16',                          username: 'n/a',        password: 'n/a',              info: 'Internal subnet range authorised for scanning.' },
    ],
    blacklist: [
      { url: '10.20.4.10', reason: 'SWIFT gateway host — explicitly out of scope.' },
      { url: '10.20.9.0/24', reason: 'ATM management VLAN — out of scope per OJK directive.' },
      { url: 'https://jump.bsi-infra.internal:8443/admin/reset', reason: 'Triggers a full PAM credential rotation across the estate.' },
    ],
  },
  {
    id: 'FR-003',
    application: 'KTB - HRIS',
    project: 'KTB HRIS Mobile Pentest',
    status: 'Approved',
    createdBy: 'Nur Hasbullah M.',
    createdDate: '2025-12-01',
    form: {
      appName: 'KTB HRIS Mobile App',
      reason: 'Pre-release security assessment of the new employee self-service mobile application (iOS & Android).',
      appType: 'Mobile Application',
      hasThirdParty: true,
      thirdParty: 'Firebase Auth & Cloud Messaging, OneSignal push, Talenta payroll API.',
      userRoles: 'Employee, Line Manager, HR Admin',
      environment: 'UAT',
      sensitiveData: 'Employee PII, salary & payslip data, attendance / geolocation.',
      notes: 'Test builds (.apk / .ipa) provided via TestFlight and internal MDM. Please report any hardcoded secrets found in the bundle.',
    },
    requirements: [
      { url: 'https://uat-hris-api.ktb.co.id', username: 'emp_uat001',  password: 'Emp!Uat2025',   info: 'Employee role — payroll read access.' },
      { url: 'https://uat-hris-api.ktb.co.id', username: 'hradmin_uat', password: 'HrAdm!Uat2025', info: 'HR Admin — full directory and payroll write.' },
    ],
    blacklist: [
      { url: 'https://uat-hris-api.ktb.co.id/v1/payroll/disburse', reason: 'Connects to the Talenta disbursement sandbox; avoid triggering payout jobs.' },
    ],
  },
  {
    id: 'FR-004',
    application: 'MMKSI - VTS',
    project: 'MMKSI VTS Web Audit',
    status: 'Draft',
    createdBy: 'John Lee',
    createdDate: '2026-02-14',
    form: {
      appName: 'MMKSI Vehicle Tracking System',
      reason: 'New module (geofencing & alerts) added — scoped VA before go-live.',
      appType: 'Web Application',
      hasThirdParty: false,
      thirdParty: '',
      userRoles: 'Fleet Operator, Supervisor',
      environment: 'Staging',
      sensitiveData: 'Vehicle GPS telemetry, driver identities.',
      notes: '',
    },
    requirements: [
      { url: 'https://vts-staging.mmksi.co.id', username: 'operator_demo', password: 'Op#Demo2026', info: 'Fleet operator account.' },
    ],
    blacklist: [],
  },
];

function formReqById(id) { return FORMREQS.find(f => f.id === id); }
