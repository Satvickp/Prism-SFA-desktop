import React, { useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import { Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import FilterComponent from "./FilterComponent";
import useAllTimeIntervalReportsHook from "./useAllTimeIntervalReportsHook";
import { useMemberHook } from "../../../hooks/memberHook"
import { useBeetApiHook } from "../../../hooks/beetHook"
import { useDispatch } from "react-redux";
import { clearReportData } from "../../../redux/features/reportSlice";

function TimeIntervalReports() {
  const {
    loading,
    allData,
    columns,
    filterDateRange,
    setFilteredDateRange,
    selectedReportTypeLevel,
    selectedReportIdLevel,
    selectedReportCallLevel,
    setSelectedReportTypeLevel,
    setSelectedReportIdLevel,
    setSelectedReportCallLevel,
    getReportData,
    setSelectedMemberClientId,
    selectedMemberId,
    setSelectedOutletId
  } = useAllTimeIntervalReportsHook();

  const dispatch = useDispatch();

  const {
    get
  } = useMemberHook();

  const {
    GetAllBeets
  } = useBeetApiHook()

  useEffect(()=>{
    dispatch(clearReportData())
    get()
    GetAllBeets()
  },[])

  const exportToExcel = () => {
    // Extract headers and rows from columns and data
    const headers = columns.map((col) => col.name);
    const rows = allData.map((row) =>
      columns.map((col) => col.selector(row))
    );

    const wsData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths
    ws["!cols"] = headers.map(() => ({ width: 20 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders Data");
    XLSX.writeFile(wb, "orders_data.xlsx");
  };

  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="Time Interval Report"
        renderRight={() => (
          <Button onClick={exportToExcel}>Export To Excel</Button>
        )}
      />
      <FilterComponent
        selectedReportTypeLevel={selectedReportTypeLevel}
        setSelectedReportTypeLevel={setSelectedReportTypeLevel}
        selectedReportIdLevel={selectedReportIdLevel}
        setSelectedReportIdLevel={setSelectedReportIdLevel}
        selectedReportCallLevel={selectedReportCallLevel}
        setSelectedReportCallLevel={setSelectedReportCallLevel}
        getReportData={getReportData}
        setSelectedMemberClientId={setSelectedMemberClientId}
        selectedMemberId={selectedMemberId}
        setSelectedOutletId={setSelectedOutletId}
        dateRange={filterDateRange}
        setDateRange={setFilteredDateRange}
      />

      <div className="mt-3">
        <DataTable
          title="Sales Data"
          columns={columns}
          data={allData}
          responsive
          pagination
          progressPending={loading}
        />
      </div>
    </div>
  );
}

export default TimeIntervalReports;
