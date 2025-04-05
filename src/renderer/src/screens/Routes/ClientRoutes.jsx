import React from "react";
import { Route, Routes } from "react-router-dom";
import Inventory from "../Inventory/Inventory";
import PrimarySales from "../Sales/PrimarySales/PrimarySales";
import SecondarySales from "../Sales/SecondarySales/SecondarySales";
import Page404 from "../../components/Auth/Page404";
import ClientProfile from "../Our Clients/ClientProfile";
import SaleDetailsPage from "../Sales/sales-detail/SaleDetailsPage";
import PrimarySalesReturn from "../Sales/PrimarySalesReturn/PrimarySalesReturn";
import SalesReturn from "../Sales/sales-return/SalesReturn";
import ReturnSaleDetailsPage from "../Sales/return-sales-detail/ReturnSaleDetailsPage";

function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Inventory />} />
      <Route path="/client-profile" element={<ClientProfile />} />
      <Route path="primarySales" element={<PrimarySales />} />
      <Route path="secondarySales" element={<SecondarySales />} />
      <Route path="sale-detail" element={<SaleDetailsPage />} />
      <Route path="return-sale-detail" element={<ReturnSaleDetailsPage />} />
      <Route path="salesReturn" element={<SalesReturn />} />
      <Route path="primarySalesReturn" element={<PrimarySalesReturn />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default ClientRoutes;
