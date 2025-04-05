import React from "react";
import { useBeetRangeHook } from "./useBeetRangeHook";
import DataTable from "react-data-table-component";
import { customStyles } from "../../../../constants/customStyles";
import FilterComponent from "./FilterComponent";
import PageHeader from "../../../../components/common/PageHeader";
import { IoChevronBackCircle } from "react-icons/io5";
function BeetRangeReportMember() {
  const {
    loading,
    allLogs,
    columns,
    exportToExcel,
    employeeName,
    helperCall,
    isFMCG,
    onRowClicked,
    navigate,
  } = useBeetRangeHook();
  return (
    <>
      <IoChevronBackCircle
        size={28}
        color="#484c7f"
        style={{ marginBottom: "-10px" }}
        onClick={() => navigate(-1)}
      />
      <PageHeader
        headerTitle={`Member ${
          isFMCG ? "Beet" : "Patch"
        } Journey Report (${employeeName})`}
        renderRight={() => (
          <FilterComponent
            exportToExcel={exportToExcel}
            onConfirm={helperCall}
          />
        )}
      />
      <DataTable
        columns={columns}
        data={allLogs}
        pagination
        progressPending={loading}
        highlightOnHover
        customStyles={{
          ...customStyles,
          rows: {
            style: {
              cursor: "pointer",
            },
          },
        }}
        onRowClicked={onRowClicked}
      />
    </>
  );
}

export default BeetRangeReportMember;
