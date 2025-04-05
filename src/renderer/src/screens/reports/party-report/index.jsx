import React from "react";
import PageHeader from "../../../components/common/PageHeader";
import { Button } from "react-bootstrap";
import ReportCard from "../../../components/report/ReportCard";
import useSalesReportHook from "./useSalesReportHook";
import FilterComponent from "./FilterComponent";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
function SalesReport() {
  const {
    filterDateRange,
    loading,
    allData,
    salesLevel,
    setFilteredDateRange,
    setSalesLevel,
    columns,
  } = useSalesReportHook();

  const exportToExcel = () => {
    const wsData = [
      ["Product ID", "Product Name", "Quantity Sold", "Revenue", "GST Amount"], // Header Row
      ...allData.topSellingProductList.map((row) => [
        row.productId,
        row.name,
        row.quantitySold,
        row.revenue,
        row.gstAmount,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    ws["!cols"] = [
      { width: 15 },
      { width: 30 },
      { width: 18 },
      { width: 18, numFmt: '"$"#,##0.00' },
      { width: 18, numFmt: '"$"#,##0.00' },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Data");
    XLSX.writeFile(wb, "sales_data_formatted.xlsx");
  };

  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="Party Report"
        renderRight={() => {
          return (
              <FilterComponent
                selectedSalesLevel={salesLevel}
                setSelectedSalesLevel={setSalesLevel}
                dateRange={filterDateRange}
                setDateRange={setFilteredDateRange}
                exportToExcel={exportToExcel}
              />
          );
        }}
      />

      {/* <div className="row mt-3">
        <ReportCard
          label="Total Sales"
          value={`₹ ${allData?.totalSales?.toFixed(0) ?? "N/A"}`}
          iconClassName="icofont-wallet"
        />
        <ReportCard
          label="Total Orders"
          value={`${allData?.totalOrder ?? "N/A"}`}
          iconClassName="icofont-cart"
        />
        <ReportCard
          label="Total GST Collected"
          value={`₹ ${allData?.totalGstCollected?.toFixed(0) ?? "N/A"}`}
          iconClassName="icofont-clip-board"
        />
      </div> */}

      <DataTable
        title="Sales Data"
        columns={columns}
        data={allData.topSellingProductList}
        responsive
        pagination
        progressPending={loading}
      />
    </div>
  );
}

export default SalesReport;
