import { useEffect, useMemo, useState } from "react";
import { getSalesReportApi } from "../../../api/reports";
import { SalesLevelOptions } from "./FilterComponent";

const useSalesReportHook = () => {
  const [allData, setAllData] = useState({
    totalSales: 0,
    totalOrder: 0,
    totalGstCollected: 0,
    topSellingProductList: [],
  });
  const [loading, setLoading] = useState(false);
  const currentDate = new Date();
  const endDate = new Date(currentDate);
  const startDate = new Date(currentDate);
  startDate.setMonth(currentDate.getMonth() - 1)
  // endDate.setMonth(currentDate.getMonth() + 1);
  const [filterDateRange, setFilteredDateRange] = useState({
    startDate: startDate,
    endDate: currentDate,
    key: "selection",
  });
  const [salesLevel, setSalesLevel] = useState(SalesLevelOptions[0]);
  async function getSalesData(params) {
    setLoading(true);
    try {
      const resp = await getSalesReportApi(params);
      setAllData(resp);
    } catch (error) {}
    setLoading(false);
  }

  useEffect(() => {
    getSalesData({
      startDate: filterDateRange.startDate,
      endDate: filterDateRange.endDate,
      salesLevel: salesLevel.value,
    });
  }, [filterDateRange, salesLevel]);

  const columns = useMemo(() => {
    let def = [
      {
        name: "Product Name",
        selector: (row) => row.name,
        sortable: true,
      },
      {
        name: "Quantity Sold",
        selector: (row) => row.quantitySold,
        sortable: true,
      },
      {
        name: "Revenue",
        selector: (row) => row.revenue,
        sortable: true,
        format: (row) => `₹${row.revenue.toFixed(2)}`,
      },
    ];

    if (salesLevel.value === "WAREHOUSE") {
      def.splice(0, 0, {
        name: "S.No",
        selector: (_, index) => index + 1,
        sortable: true,
      });
      def.splice(3, 2, {
        name: "Client Name",
        selector: (row) =>
          row?.clientFMCGResponse?.clientFirstName ??
          "" + row?.clientFMCGResponse?.clientLastName ??
          "",
        sortable: true,
      });
    } else if (salesLevel.value === "STOCKIST") {
      def.splice(1, 0, {
        name: "Beet",
        selector: (row) => row?.beetRespForOrderDto?.beet ?? "",
        sortable: true,
      });

      def.splice(2, 0, {
        name: "Outlet",
        selector: (row) => row?.outletRespForOrderDto?.outletName ?? "",
        sortable: true,
      });

      def.splice(3, 0, {
        name: "Client Name",
        selector: (row) =>
          row?.clientFMCGResponse?.clientFirstName ??
          "" + row?.clientFMCGResponse?.clientLastName ??
          "",
        sortable: true,
      });
    }

    return def;
  }, [allData]);

  return {
    getSalesData,
    loading,
    filterDateRange,
    setFilteredDateRange,
    salesLevel,
    setSalesLevel,
    allData,
    columns,
  };
};

export default useSalesReportHook;
