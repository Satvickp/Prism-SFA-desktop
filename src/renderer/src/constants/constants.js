export const constants = {
  token_store: "PRISM_SFA_JWT_TOKEN",
  tenant_Id: "SFA_TENANT_ID",
  website_name: "Prism-SFA",
  google_map_api_key: "AIzaSyAr1KWVTFxA9h_v8NUhgNV2JJxnGxHXArc",
  base_url: "BASE_URL",
  clientType: "CLIENT_TYPE",
};

export const permissionIds = {
  SUPER_ADMIN: "Super_Admin",
  REPORTING_MANAGER: "Reporting_Manager",
  MANAGER: "Manager",
  CREATE_MANAGER: "Create_Manager",
  EDIT_MANAGER: "Edit_Manager",
  DELETE_MANAGER: "Delete_Manager",
  VIEW_MANAGER: "View_Manager",
  CLIENT_FMCG: "ClientFMCG",
  CLIENT: "Client",
};

export const membersAllPermissions = [
  {
    label: "Super Admin (All Permissions including Master)",
    value: "Super_Admin",
  },
  { label: "Reporting Manager", value: "Reporting_Manager" },
  { label: "Manager", value: "Manager" },
  { label: "View Manager", value: "View_Manager" },
  { label: "Create Manager", value: "Create_Manager" },
  { label: "Edit Manager", value: "Edit_Manager" },
  { label: "Delete Manager", value: "Delete_Manager" },
  { label: "Client FMCG", value: "ClientFMCG" },
  { label: "Client", value: "Client" },
];

export const permissionEnum = [
  { label: "Super_Admin", value: 0 },
  { label: "Reporting_Manager", value: 1 },
  { label: "Manager", value: 2 },
  { label: "Create_Manager", value: 3 },
  { label: "Edit_Manager", value: 4 },
  { label: "Delete_Manager", value: 5 },
  { label: "View_Manager", value: 6 },
  { label: "ClientFMCG", value: 7 },
  { label: "Client", value: 8 },
];



export const EXPENSE_WAY = {
  ta_da_expense: 'TA_DA_EXPENSE',
  normalExpense: 'NORMAL_EXPENSE',
};
