/* ============== Shared user data + role catalog ============== */

const ROLES = [
  {
    id:    'offsec',
    name:  'Offensive Security',
    short: 'OffSec',
    desc:  'Pentesters who execute VA/VAPT engagements and own finding write-ups.',
    color: '#dc2626',
    icon:  'security',
  },
  {
    id:    'app-pic',
    name:  'Application PIC',
    short: 'App PIC',
    desc:  'Application owner; primary contact for scoping and remediation.',
    color: '#3b82f6',
    icon:  'badge',
  },
  {
    id:    'sm',
    name:  'Section Manager',
    short: 'SM',
    desc:  'Approves engagements and risk acceptances at the section level.',
    color: '#f59e0b',
    icon:  'manage_accounts',
  },
  {
    id:    'dh',
    name:  'Department Head',
    short: 'DH',
    desc:  'Final approver for risk acceptance; cross-section oversight.',
    color: '#a855f7',
    icon:  'workspace_premium',
  },
  {
    id:    'appsec',
    name:  'Application Security',
    short: 'AppSec',
    desc:  'Reviews findings, maintains controls library, owns SDLC guardrails.',
    color: '#10b981',
    icon:  'shield',
  },
];

function roleById(id) { return ROLES.find(r => r.id === id) || ROLES[0]; }

const USERS = [
  { id:'U-001', name:'Abu Rizal Mahdi',   username:'arizal.mahdi',  email:'arizal.mahdi@offensivesec.id', role:'offsec',  status:'Active',   created:'2024-02-04', lastSeen:'2026-05-25T09:42:00', mfa:true,  projects:9 },
  { id:'U-002', name:'Sarah Park',         username:'sarah.park',    email:'sarah.park@offensivesec.id',   role:'offsec',  status:'Active',   created:'2024-03-18', lastSeen:'2026-05-25T11:08:00', mfa:true,  projects:7 },
  { id:'U-003', name:'John Lee',           username:'john.lee',      email:'john.lee@offensivesec.id',     role:'offsec',  status:'Active',   created:'2024-04-22', lastSeen:'2026-05-24T17:15:00', mfa:true,  projects:6 },
  { id:'U-004', name:'Nur Hasbullah M.',   username:'nhasbullah',    email:'nhasbullah@offensivesec.id',   role:'offsec',  status:'Active',   created:'2024-08-01', lastSeen:'2026-05-25T08:55:00', mfa:false, projects:5 },
  { id:'U-005', name:'Budi Santoso',       username:'budi.santoso',  email:'budi.santoso@offensivesec.id', role:'offsec',  status:'Active',   created:'2024-11-12', lastSeen:'2026-05-23T19:30:00', mfa:true,  projects:4 },
  { id:'U-006', name:'Mark Diaz',          username:'mark.diaz',     email:'mark.diaz@bsi.co.id',          role:'app-pic', status:'Active',   created:'2024-05-09', lastSeen:'2026-05-22T13:21:00', mfa:true,  projects:3 },
  { id:'U-007', name:'Ari Wibowo',         username:'ari.wibowo',    email:'ari.wibowo@ktb.co.id',         role:'app-pic', status:'Active',   created:'2024-06-15', lastSeen:'2026-05-25T07:40:00', mfa:true,  projects:5 },
  { id:'U-008', name:'Maya Lim',           username:'maya.lim',      email:'maya.lim@mmksi.co.id',         role:'app-pic', status:'Active',   created:'2024-07-02', lastSeen:'2026-05-24T15:08:00', mfa:false, projects:4 },
  { id:'U-009', name:'Reza Pratama',       username:'reza.pratama',  email:'reza.pratama@bsi.co.id',       role:'app-pic', status:'Inactive', created:'2024-01-20', lastSeen:'2026-02-10T10:00:00', mfa:false, projects:2 },
  { id:'U-010', name:'Linda Halim',        username:'linda.halim',   email:'linda.halim@offensivesec.id',  role:'sm',      status:'Active',   created:'2023-09-08', lastSeen:'2026-05-25T10:12:00', mfa:true,  projects:0 },
  { id:'U-011', name:'Daniel Kusuma',      username:'daniel.kusuma', email:'daniel.kusuma@offensivesec.id',role:'sm',      status:'Active',   created:'2023-11-14', lastSeen:'2026-05-24T16:45:00', mfa:true,  projects:0 },
  { id:'U-012', name:'Indra Saputra',      username:'indra.saputra', email:'indra.saputra@offensivesec.id',role:'dh',      status:'Active',   created:'2023-07-01', lastSeen:'2026-05-25T08:30:00', mfa:true,  projects:0 },
  { id:'U-013', name:'Putri Anggraini',    username:'putri.a',       email:'putri.anggraini@offensivesec.id', role:'appsec', status:'Active',   created:'2024-02-28', lastSeen:'2026-05-25T11:55:00', mfa:true,  projects:8 },
  { id:'U-014', name:'Kevin Tanudjaja',    username:'kevin.t',       email:'kevin.tanudjaja@offensivesec.id', role:'appsec', status:'Active',   created:'2024-10-04', lastSeen:'2026-05-25T09:18:00', mfa:true,  projects:6 },
  { id:'U-015', name:'Siti Nurhaliza',     username:'siti.nh',       email:'siti.nurhaliza@offensivesec.id',  role:'appsec', status:'Active',   created:'2025-01-13', lastSeen:'2026-05-24T14:02:00', mfa:false, projects:3 },
  { id:'U-016', name:'Tomi Wijaya',        username:'tomi.wijaya',   email:'tomi.wijaya@ktb.co.id',        role:'app-pic', status:'Active',   created:'2025-03-22', lastSeen:'2026-05-23T11:30:00', mfa:false, projects:2 },
  { id:'U-017', name:'Hendra Setiawan',    username:'hendra.s',      email:'hendra.setiawan@mmksi.co.id',  role:'app-pic', status:'Locked',   created:'2024-12-01', lastSeen:'2026-04-18T09:08:00', mfa:false, projects:1 },
  { id:'U-018', name:'Vania Lestari',      username:'vania.l',       email:'vania.lestari@offensivesec.id',role:'sm',      status:'Active',   created:'2024-04-09', lastSeen:'2026-05-25T10:50:00', mfa:true,  projects:0 },
];

function userInitials(name) {
  return name.split(' ').filter(Boolean).map(s => s[0]).slice(0,2).join('').toUpperCase();
}

// Deterministic avatar color: hash name -> pick from palette
function userAvatarColor(name) {
  const palette = ['#dc2626','#3b82f6','#f59e0b','#a855f7','#10b981','#ec4899','#06b6d4','#8b5cf6','#f97316'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}
