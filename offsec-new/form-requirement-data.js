/* ============== Offensive Sec — Form & Requirement data ============== */

// VAPT projects available to link a form to (mirrors projects.html)
const VAPT_PROJECTS = [
  'Northstar Bank Core Aegis VA — Q2',
  'Wahana Motorindo Nova Pentest',
  'Trimatra Auto Orion Mobile Pentest',
  'Wahana Motorindo Sentinel Web Audit',
  'Trimatra Auto Helios Interface VAPT',
  'Trimatra Auto Vega Q3 Pentest',
  'Trimatra Auto Forge Portal VAPT',
  'Trimatra Auto Nexus Portal VA Infra',
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
    application: 'Wahana Motorindo - Nova',
    project: 'Wahana Motorindo Nova Pentest',
    status: 'Submitted',
    createdBy: 'Sarah Park',
    createdDate: '2025-11-12',
    form: {
      appName: 'Wahana Motorindo Nova',
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
      { url: 'https://staging.nova.wahanamotorindo.co.id',        username: 'pentest_admin',  password: 'P3ntest!Adm2025', info: 'Full administrator access to back-office.' },
      { url: 'https://staging.nova.wahanamotorindo.co.id/dealer', username: 'dealer_demo01',  password: 'Dealer#Demo01',   info: 'Dealer role — limited to own branch data.' },
      { url: 'https://staging.nova.wahanamotorindo.co.id/app',    username: 'user_demo01',    password: 'User#Demo2025',   info: 'Standard registered customer account.' },
    ],
    blacklist: [
      { url: 'https://staging.nova.wahanamotorindo.co.id/api/payment/charge', reason: 'Wired to live Midtrans sandbox webhook — repeated calls flood the finance team inbox.' },
      { url: 'https://staging.nova.wahanamotorindo.co.id/admin/broadcast',    reason: 'Sends bulk SMS/email to a real subscriber list.' },
    ],
  },
  {
    id: 'FR-002',
    application: 'Northstar Bank - Aegis',
    project: 'Northstar Bank Core Aegis VA — Q2',
    status: 'In Review',
    createdBy: 'Abu Rizal Mahdi',
    createdDate: '2025-11-04',
    form: {
      appName: 'Northstar Bank Aegis Banking Platform',
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
      { url: 'https://jump.northstarbank-aegis.internal:8443', username: 'va_auditor', password: 'V@ult-Issued-OTP', info: 'Access brokered through CyberArk — OTP issued per session.' },
      { url: '10.20.0.0/16',                          username: 'n/a',        password: 'n/a',              info: 'Internal subnet range authorised for scanning.' },
    ],
    blacklist: [
      { url: '10.20.4.10', reason: 'SWIFT gateway host — explicitly out of scope.' },
      { url: '10.20.9.0/24', reason: 'ATM management VLAN — out of scope per OJK directive.' },
      { url: 'https://jump.northstarbank-aegis.internal:8443/admin/reset', reason: 'Triggers a full PAM credential rotation across the estate.' },
    ],
  },
  {
    id: 'FR-003',
    application: 'Trimatra Auto - Orion',
    project: 'Trimatra Auto Orion Mobile Pentest',
    status: 'Approved',
    createdBy: 'Nur Hasbullah M.',
    createdDate: '2025-12-01',
    form: {
      appName: 'Trimatra Auto Orion Mobile App',
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
      { url: 'https://uat-orion-api.trimatraauto.co.id', username: 'emp_uat001',  password: 'Emp!Uat2025',   info: 'Employee role — payroll read access.' },
      { url: 'https://uat-orion-api.trimatraauto.co.id', username: 'hradmin_uat', password: 'HrAdm!Uat2025', info: 'HR Admin — full directory and payroll write.' },
    ],
    blacklist: [
      { url: 'https://uat-orion-api.trimatraauto.co.id/v1/payroll/disburse', reason: 'Connects to the Talenta disbursement sandbox; avoid triggering payout jobs.' },
    ],
  },
  {
    id: 'FR-004',
    application: 'Wahana Motorindo - Sentinel',
    project: 'Wahana Motorindo Sentinel Web Audit',
    status: 'Draft',
    createdBy: 'John Lee',
    createdDate: '2026-02-14',
    form: {
      appName: 'Wahana Motorindo Sentinel Tracking System',
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
      { url: 'https://sentinel-staging.wahanamotorindo.co.id', username: 'operator_demo', password: 'Op#Demo2026', info: 'Fleet operator account.' },
    ],
    blacklist: [],
  },
];

function formReqById(id) { return FORMREQS.find(f => f.id === id); }
