import React, { useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import { Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import useAllOrdersReportHook from "./useAllOrdersReportHook";
import FilterComponent, { orderCallStatus, orderMedium, ReportCallType, ReportIdType, ReportType } from "./FilterComponent";
import { useMemberHook } from "../../../hooks/memberHook";
import { useClientFMCGHook } from "../../../hooks/clientFMCGHook";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { clearReportData } from "../../../redux/features/reportSlice";
import { AGGridTable } from "./reportTable";

function SalesReport() {
  const {
    loading,
    columns,
    selectedReportTypeLevel,
    selectedReportIdLevel,
    selectedReportCallLevel,
    setSelectedReportTypeLevel,
    setSelectedReportIdLevel,
    setSelectedReportCallLevel,
    getReportData,
  } = useAllOrdersReportHook();
  const allData = useSelector((state) => state.Reports);

  const { allMembers, paginationData } = useSelector((state) => state.Member);
  const dispatch = useDispatch();
  const { get, getEveryMembers } = useMemberHook();
  const { getClientFMCG } = useClientFMCGHook();

  useEffect(() => {
    const fetchDataSequentially = async () => {
      try {
        // Clear report data first
        dispatch(clearReportData());
  
        // Call getEveryMembers and wait for it to complete
        const membersData = await getEveryMembers();
  
        // Call getClientFMCG and wait for it to complete
        await getClientFMCG();
  
        // Call getReportData after previous promises are resolved
        await getReportData({
          reportType: ReportType[1],
          reportId: ReportIdType[0],
          reportCall: ReportCallType[0],
          orderStatus: orderCallStatus[0],
          orderMedium: orderMedium[0],
          memberClientId: {
            label: `${membersData[0]?.firstName} ${membersData[0]?.lastName}`,
            value: membersData[0]?.id,
          },
        });
      } catch (error) {
        console.error("Error in fetching data sequentially:", error);
      }
    };
  
    fetchDataSequentially();
  }, []); // Empty dependency array ensures it runs only once.
  

  const exportToExcel = () => {
    // Dynamically define headers based on selectedReportTypeLevel
    const headers =
      selectedReportTypeLevel === "beet"
        ? ["Beet", "Address", "Postal Code", "Total Sales (₹)", "Total Orders"]
        : [
            "Outlet Name",
            "Outlet Type",
            "Owner Name",
            "Total Sales (₹)",
            "Total Orders",
          ];

    try {
      console.log("selectedReportType", selectedReportTypeLevel);
      const rows = allData.content.map((row) => {
        console.log("row :", row);
        if (selectedReportTypeLevel.value === "beet") {
          return [
            row.beetRespForOrderDto.beet,
            row.beetRespForOrderDto.address,
            row.beetRespForOrderDto.postalCode,
            row.totalSales,
            row.totalOrder,
          ];
        } else if (selectedReportTypeLevel.value === "outlet") {
          return [
            row.outletRespForOrderDto.outletName,
            row.outletRespForOrderDto.outletType,
            row.outletRespForOrderDto.ownerName,
            row.totalSales,
            row.totalOrder,
          ];
        }
      });

      const wsData = [headers, ...rows];
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Set column widths
      ws["!cols"] = headers.map(() => ({ width: 20 }));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Orders Data");
      XLSX.writeFile(wb, "orders_data.xlsx");
    } catch (error) {
      console.log("Error :", error);
      Swal.fire("Error Exporting Data", "Unable to Export Data", "error");
    }
  };

  return (
    <div className="container-xxl">
      <PageHeader
        isNoMargin={true}
        headerTitle="Outlet Order Report"
        renderRight={() => (
          <FilterComponent
            selectedReportTypeLevel={selectedReportTypeLevel}
            setSelectedReportTypeLevel={setSelectedReportTypeLevel}
            selectedReportIdLevel={selectedReportIdLevel}
            setSelectedReportIdLevel={setSelectedReportIdLevel}
            selectedReportCallLevel={selectedReportCallLevel}
            setSelectedReportCallLevel={setSelectedReportCallLevel}
            getReportData={getReportData}
            exportToExcel={exportToExcel}
          />
        )}
      />

      <div className="mt-3" style={{ height: "100vh" }}>
        <DataTable
          title="Outlet Order Data"
          columns={columns}
          data={allData.content}
          responsive
          pagination
          progressPending={loading}
        />
        {/* <AGGridTable
        /> */}
      </div>
    </div>
  );
}

export default SalesReport;
