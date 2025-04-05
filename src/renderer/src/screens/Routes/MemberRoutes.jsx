import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Members from '../Employee/members/Members'
import MemberBirthDay from '../Employee/members/MemberBirthDay'
import Expenses from '../Accounts/Expenses'
import Attendance from '../Employee/Attendance'
import Clients from '../Our Clients/Clients'
import Profile from '../Employee/Profile'
import LeaveRequest from '../Employee/LeaveRequest'
import Status from '../Status/Status'
import Inventory from '../Inventory/Inventory'
import ProductMaster from '../Products/Master/ProductMaster'
import PrimarySales from '../Sales/PrimarySales/PrimarySales'
import Beet from '../Beet/Beet'
import Tenant from '../Tenant/Tenant'
import RegionMaster from '../Master/RegionMaster'
import StateMaster from '../Master/StateMaster'
import CityMaster from '../Master/CityMaster'
import SecondarySales from '../Sales/SecondarySales/SecondarySales'
import Holidays from '../Employee/Holidays'
import Page404 from '../../components/Auth/Page404'
import FMCGClients from '../Our Clients/FMCGClients'
import ProtectedRoute from './route-util'
import SalesReport from '../reports/sales-report'
import PartyReport from '../reports/party-report'
import TimeIntervalReports from '../reports/TimeIntervalReports'
import AllBeetOrderReport from '../reports/AllBeetOrdersReports'
import AllOutletOrderReport from '../reports/AllOutletOrdersReports'
import SaleDetailsPage from '../Sales/sales-detail/SaleDetailsPage'
import BeetJourneyReport from '../reports/BeetJourneyReports'
import MemberMapView from '../Employee/member-map-view/MemberMapView'
import MasterPermissionUpdate from '../Master/Assignpermission/MasterPermissionUpdate'
import BeetReport from '../reports/beet-report'
import BeetRangeReportMember from '../reports/beet-report/member-range-report'
import BeetLogDetail from '../reports/beet-report/beet-log-detail'
import Sample from '../Employee/Sample'
import ScheduleCalendar from '../Employee/schedules/ScheduleCalendar'
import BeetWiseReport from '../reports/beet-wise-report'
import OutletWiseReport from '../reports/beet-wise-report/outlet-wise-report'
import OutletOrderReport from '../reports/beet-wise-report/outlet-order-report'
import PharmaStockist from '../Our Clients/PharmaStockist'
import Doctors from '../Our Clients/Doctors'
import DesignationMaster from '../Master/DesignationMaster'
import Outlets from '../Outlet/Outlet'
import ExpenseReport from '../reports/expense-report'
import MemberExpenseReport from '../reports/expense-report/member-data-range-expense'
import ExpenseDayDetail from '../reports/expense-report/expense-day-detail'
import ClientWiseReport from '../reports/client-wise-report'
import ClientSaleOrder from '../reports/client-wise-report/clientSaleOrder'
import TargetReport from '../reports/target/target-report'
import MemberListDevice from '../Employee/member-device'
import MemberDeviceDetails from '../Employee/member-device/member-device-details'
import ProductOrderDetails from '../reports/client-wise-report/ProductOrderDetails'
import ProjectDashboard from '../Dashboard/ProjectDashboard'
import HrDashboard from '../Dashboard/HrDashboard'
import SelectState from '../reports/target/target-report/state-list'
import TargetCity from '../reports/target/target-report/target-city'
import CodeConfigMaster from '../Master/CodeConfigMaster'
import DiscountMaster from '../Master/DiscountMaster'
import UploadClients from '../Our Clients/UploadClients'
function MemberRoutes() {
  return (
    <Routes>
      <Route path="member/:userId" element={<Members />} />
      {/* <Route path="/" element={<MemberMapView />} /> */}
      <Route path="membermap" element={<MemberMapView />} />

      <Route path="expenses/:userId" element={<Expenses />} />

      <Route path="attendance/:userId" element={<Attendance />} />
      <Route path="/clientsFmcg/:userId" element={<FMCGClients />} />
      <Route path="/doctors/:userId" element={<Doctors />} />
      <Route path="/stockist/:userId" element={<PharmaStockist />} />
      <Route path="clients" element={<Clients />} />
      <Route path="members-scheduler/:userId" element={<ScheduleCalendar />} />
      {/* <Route
        path="/member-schedule-plan/:userId"
        element={<ScheduleCalendar />}
      /> */}
      <Route path="member-profile" element={<Profile />} />
      <Route path="leave-request/:userId" element={<LeaveRequest />} />
      <Route path="status-report" element={<Status />} />
      <Route path="primarySales/:userId" element={<PrimarySales />} />
      <Route path="beets/:userId" element={<Beet />} />
      <Route path="outlet/:userId" element={<Outlets />} />
      <Route path="chemist/:userId" element={<Outlets />} />
      <Route path="routes/:userId" element={<Beet />} />
      <Route path="tenant" element={<Tenant />} />
      <Route path="secondarySales/:userId" element={<SecondarySales />} />
      <Route path="holidays" element={<Holidays />} />
      <Route path="*" element={<Page404 />} />
      <Route path="/sample/:userId" element={<Sample />} />
      <Route path="/bulk-upload-client" element={<UploadClients />} />

      {/* Protected routes */}

      <Route path="regionMaster" element={<ProtectedRoute element={<RegionMaster />} />} />

      <Route
        path="code-config-master"
        element={<ProtectedRoute element={<CodeConfigMaster />} />}
      />

      <Route
        path="designation-master"
        element={<ProtectedRoute element={<DesignationMaster />} />}
      />
      <Route path="stateMaster" element={<ProtectedRoute element={<StateMaster />} />} />
      <Route path="cityMaster" element={<ProtectedRoute element={<CityMaster />} />} />
      <Route path="discount-master" element={<ProtectedRoute element={<DiscountMaster />} />} />
      <Route
        path="assign-permission"
        element={<ProtectedRoute element={<MasterPermissionUpdate />} />}
      />
      <Route path="member-list" element={<ProtectedRoute element={<MemberBirthDay />} />} />

      {/* Reports Routes */}
      {/* All the reports route are been removed from the protected to public because as per the new requirement by shailendra bhaiya everyone including the sales person can view reports its just super admin can see all the data the reporting manager can see the data of his sales person and the sales person can view his own data in the reports */}
      <Route path="dcr-report" element={<BeetReport />} />
      <Route path="beet-wise-report" element={<BeetWiseReport />} />
      <Route path="outlet-wise-report" element={<OutletWiseReport />} />
      <Route path="outlet-order-report" element={<OutletOrderReport />} />
      <Route path="beet-report-member-detail" element={<BeetRangeReportMember />} />
      <Route path="expense-report" element={<ExpenseReport />} />
      <Route path="member-expense-report" element={<MemberExpenseReport />} />
      <Route path="expense-day-detail" element={<ExpenseDayDetail />} />
      <Route path="beet-report-detail" element={<BeetLogDetail />} />
      <Route path="sales-report" element={<SalesReport />} />
      <Route path="client-wise-report" element={<ClientWiseReport />} />
      <Route path="client-order-details/:userId" element={<ClientSaleOrder />} />
      <Route path="product-order-details/:userId/:dataId" element={<ProductOrderDetails />} />
      <Route path="party-report" element={<PartyReport />} />
      <Route path="time-interval-report/:userId" element={<TimeIntervalReports />} />
      <Route path="all-beet-order-report/:userId" element={<AllBeetOrderReport />} />
      <Route path="all-outlet-order-report/:userId" element={<AllOutletOrderReport />} />
      <Route path="beet-journey-report/:userId" element={<BeetJourneyReport />} />

      {/* Reports Routes ends here */}

      <Route path="member-device" element={<MemberListDevice />} />
      <Route path="member-device-details" element={<MemberDeviceDetails />} />

      <Route path="target-report" element={<ProtectedRoute element={<TargetReport />} />} />
      <Route path="select-state" element={<ProtectedRoute element={<SelectState />} />} />
      <Route path="select-target-city" element={<ProtectedRoute element={<TargetCity />} />} />
      {/* <Route
        path="productprice"
        element={<ProtectedRoute element={<ProductPrice />} />}
      /> */}
      {/* <Route
        path="productmaster"
        element={<ProtectedRoute element={<ProductMaster />} />}
      /> */}
      <Route path="inventory" element={<Inventory />} />
      <Route path="productmaster" element={<ProductMaster />} />
      <Route path="sale-detail" element={<SaleDetailsPage />} />

      <Route path="project-dashboard" element={<ProjectDashboard />} />
      <Route path="/" element={<HrDashboard />} />
    </Routes>
  )
}

export default MemberRoutes
