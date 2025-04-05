import { combineReducers, configureStore } from "@reduxjs/toolkit";

import Credentials from "./features/credentialSlice";
import DropDownsField from "./features/dropdownFieldSlice";
import Members from "./features/memberSlice";
import Clients from "./features/clientSlice";
import DropDownMembers from "./features/dropdownMemberSlice";
import DropDownsClients from "./features/dropdownClientSlice";
import Schedules from "./features/schedulesSlice";
import Samples from "./features/sampleSlice";
import Leaves from "./features/leavesSlice";
import LeaveRequests from "./features/leaveRequestSlice";
import Products from "./features/productsSlice";
import Status from "./features/statusSlice";
import Holiday from "./features/holidaySlice";
import Expenses from "./features/expenseSlice";
import Salary from "./features/salarySlice";
import PermissionSlice from "./features/permissionSlice";
import Dcr from "./features/dcrSlice";
import BeetSlice from "./features/beetSlice";
import Tenant from "./features/tenantSlice";
import attendanceSlice from "./features/attendanceSlice";
import InventorySlice from "./features/inventorySlice";
import RegionMasterSlice from "./features/regionMasterSlice";
import StateMasterSlice from "./features/stateMasterSlice";
import CityMasterSlice from "./features/cityMasterSlice";
import OrderSlice from "./features/orderSlice";
import ClientFMCG from "./features/clientFMCGSlice";
import PrimarySales from "./features/order/primary-sale";
import SecondarySales from "./features/order/secondary-sale";
import orderBeetSlice from "./features/order/beet-slice";
import ReportSlice from "./features/reportSlice";
import SaleReturn from "./features/saleReturnSlice";
import DesignationMasterSlice from "./features/designationMasterSlice";
import OutletSlice from "./features/outletSlice";
import productFeature from './features/product-slice';
import CodeConfigurationMasterSlice from "./features/codeConfigMasterSlice";
import DiscountSlice from "./features/discount-slice";
const rootReducer = combineReducers({
  Cred: Credentials,
  DropDownsField: DropDownsField,
  Member: Members,
  Client: Clients,
  DropDownMembers: DropDownMembers,
  DropDownsClients: DropDownsClients,
  Schedules: Schedules,
  Samples: Samples,
  Expenses: Expenses,
  Leaves: Leaves,
  LeaveRequests: LeaveRequests,
  Products: Products,
  Status: Status,
  Dcr: Dcr,
  Holiday: Holiday,
  Salary: Salary,
  Permission: PermissionSlice.reducer,
  Beets: BeetSlice,
  Tenants: Tenant,
  Attendance: attendanceSlice,
  Inventory: InventorySlice,
  RegionMaster: RegionMasterSlice,
  CodeConfig: CodeConfigurationMasterSlice,
  StatesMaster: StateMasterSlice,
  CityMaster: CityMasterSlice,
  Orders: OrderSlice,
  ClientFMCG: ClientFMCG,
  DesignationMaster: DesignationMasterSlice,
  Reports: ReportSlice,
  PrimarySales,
  SecondarySales,
  orderBeetSlice,
  SaleReturn,
  Outlets: OutletSlice,
  productFeature:productFeature,
  Discount: DiscountSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
