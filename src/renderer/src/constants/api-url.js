let BASE_URL = "";

export function setBASE_URL() {
  BASE_URL = window.localStorage.getItem("BASE_URL") || "";
}

export const API_URL = {
  get backend_url() {
    return window.localStorage.getItem("BASE_URL") || BASE_URL;
  },
  // SERVICE_URL: "https://staging.prism-sfa-dev.net/",  // development tenant url
  SERVICE_URL: "https://api.prism-sfa-dev.net/",   // production development url
};

export let url = {
  sk: "",
};

export const REGION_MASTER = {
  GETALL_ENDPOINT: "allRegions",
  GETID_ENDPOINT: "getRegionById",
  POST_ENDPOINT: "createRegionList",
  DELETE_ENDPOINT: "deleteRegionById",
  PUT_ENDPOINT: "updateRegionById",
};

export const  EMPLOYEE_CODE_MASTER_ENDPOINTS = {
  GETALL_ENDPOINT: "employee-code/find",
  POST_ENDPOINT: "employee-code/create",
  PUT_ENDPOINT: "employee-code/update",
};

export const  INVOICE_NUMBER_MASTER_ENDPOINTS = {
  GETALL_ENDPOINT: "order-service/invoice-master",
  POST_ENDPOINT: "order-service/invoice-master",
  PUT_ENDPOINT: "order-service/invoice-master",
};

export const DESIGNATION_MASTER = {
  GETALL_ENDPOINT: "designation/getAllDesignation",
  GETID_ENDPOINT: "",
  POST_ENDPOINT: "designation/add",
  DELETE_ENDPOINT: "",
  PUT_ENDPOINT: "",
};

export const STATE_MASTER = {
  GETALL_ENDPOINT: "states/allStates",
  GETID_ENDPOINT: "states/getStateById",
  GET_STATES_BY_REGION_ID_ENDPOINT: "states/getStateById",
  POST_ENDPOINT: "states/createStateList",
  DELETE_ENDPOINT: "states/deleteStateById",
  PUT_ENDPOINT: "states/updateStateById",
};

export const CITY_MASTER = {
  GETALL_ENDPOINT: "allCities",
  GETID_ENDPOINT: "getCityById",
  GET_STATES_BY_REGION_ID_ENDPOINT: "getCityByStateId",
  POST_ENDPOINT: "createCityList",
  PUT_ENDPOINT: "updateCityById",
  DELETE_ENDPOINT: "deleteCityById",
};

export const DISCOUNT_MASTER = {
  GETALL_ENDPOINT: "order-service/discount/getAll?page=0&pageSize=500&sortBy=createdDate&sortDirection=ASC",
  POST_ENDPOINT: "order-service/discount/createDiscount",
  PUT_ENDPOINT: "",
  DELETE_ENDPOINT: "",
  GET_BY_ID_ENDPOINT: "",
  GET_DISCOUNT_BY_PRODUCT_ID_ENDPOINT: "order-service/discount/getDiscountDetailsByProductId",
};

export const CLIENT_FMCG_URL = {
  GETALL_ENDPOINT: "client-fmcg/getAllClientFmcg",
  GETID_ENDPOINT: "client-fmcg/getClientFMCGById",
  POST_ENDPOINT: "client-fmcg/clientFmcg",
  DELETE_ENDPOINT: "client-fmcg/deleteClientFmcg",
  PUT_ENDPOINT: "client-fmcg/updateClientFMCGById",
};

export const OUTLET_CHEMIST_URL_ENDPOINTS = {
  GETALL_ENDPOINT: "outletAll",
  GETALL_BY_MEMBER_ID_ENDPOINT: "getAllOutletByMemberId",
  GETID_ENDPOINT: "getOutletById",
  POST_ENDPOINT: "outletMapWithBeet",
  DELETE_ENDPOINT: "deleteOutletById",
  PUT_ENDPOINT: "updateOutletById",
};

export const HIERARCHY_DATA_ENDPOINT = {
  GET_MEMBER_ENDPOINT: "membersByReportingManager/",
  GET_ATTENDANCE_ENDPOINT:
    "attendance/attendanceByReportingManagerIdWIthMonthAndYear?",
  GET_LEAVE_ENDPOINT: "getEmployeeLeavesByManager/",
  GET_CLIENT_ENDPOINT: "client-fmcg/getAllClientFmcgByMemberId/",
  GET_BEATS_ENDPOINT: "getAllBeetsByMemberId/",
  GET_EXPENSE_ENDPOINT: "getAllExpensesByReportingManager/",
};

export const DOCTORS_DATA_ENDPOINT = {
  GET_ALL_DOCTORS_BY_BEAT_ID_ENDPOINT: "doctors/getAllDoctorsByBeetId",
  GETALL_ENDPOINT: "doctors/getAllDoctors",
};
