// Role definitions and permission helpers
export const ROLES = {
  AGENT: 'agent',
  TC: 'tc',
  MLO: 'mlo',
  ADMIN: 'admin',
  BROKER: 'broker',
};

export const PERMISSIONS = {
  // Transactions
  VIEW_ALL_TRANSACTIONS: [ROLES.TC, ROLES.ADMIN, ROLES.BROKER],
  VIEW_OWN_TRANSACTIONS: [ROLES.AGENT, ROLES.MLO],
  CREATE_TRANSACTION: [ROLES.AGENT, ROLES.TC, ROLES.ADMIN, ROLES.MLO],
  EDIT_TRANSACTION: [ROLES.TC, ROLES.ADMIN, ROLES.BROKER],
  CLOSE_TRANSACTION: [ROLES.TC, ROLES.ADMIN, ROLES.BROKER],

  // Documents
  UPLOAD_DOCS: [ROLES.AGENT, ROLES.TC, ROLES.ADMIN, ROLES.MLO],
  SEND_DOCS: [ROLES.TC, ROLES.ADMIN],
  REQUEST_SIGNATURES: [ROLES.TC, ROLES.ADMIN],

  // Tasks
  CREATE_TASK: [ROLES.AGENT, ROLES.TC, ROLES.ADMIN],
  COMPLETE_TASK: [ROLES.AGENT, ROLES.TC, ROLES.ADMIN],
  ASSIGN_TASK: [ROLES.TC, ROLES.ADMIN],

  // Contacts / PII
  VIEW_PII: [ROLES.TC, ROLES.ADMIN, ROLES.BROKER, ROLES.MLO],
  EDIT_CONTACTS: [ROLES.TC, ROLES.ADMIN, ROLES.MLO],

  // Team
  MANAGE_TEAM: [ROLES.ADMIN, ROLES.BROKER],
  VIEW_TEAM: [ROLES.AGENT, ROLES.TC, ROLES.MLO, ROLES.ADMIN, ROLES.BROKER],

  // Loan pipeline (MLO view)
  VIEW_LOAN_PIPELINE: [ROLES.MLO, ROLES.TC, ROLES.ADMIN, ROLES.BROKER],
  EDIT_LOAN_DATA: [ROLES.MLO, ROLES.ADMIN],

  // Messaging
  MESSAGE_ALL: [ROLES.TC, ROLES.ADMIN, ROLES.BROKER],
  MESSAGE_OWN_THREAD: [ROLES.AGENT, ROLES.MLO],

  // Reports
  VIEW_REPORTS: [ROLES.ADMIN, ROLES.BROKER],
  VIEW_OWN_STATS: [ROLES.AGENT, ROLES.MLO, ROLES.TC],
};

export function can(role, permission) {
  const allowed = PERMISSIONS[permission] || [];
  return allowed.includes(role);
}

export function getRoleLabel(role) {
  const labels = {
    agent: 'Agent',
    tc: 'Transaction Coordinator',
    mlo: 'Mortgage Loan Officer',
    admin: 'Admin',
    broker: 'Broker',
  };
  return labels[role] || role;
}

export function getRoleBadgeColor(role) {
  const colors = {
    agent: '#4a90d9',
    tc: '#805ad5',
    mlo: '#38a169',
    admin: '#c9a84c',
    broker: '#c9a84c',
  };
  return colors[role] || '#8a8580';
}
