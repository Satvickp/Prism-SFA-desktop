import React from "react";
import { useMemberList } from "./useMemberList";
import PageHeader from "../../../components/common/PageHeader";
import DataTable from "react-data-table-component";
import { customStyles } from "../../../constants/customStyles";

function ExpenseReport() {
  const { memberList, paginationData, columns, loading, handlePageChange, onRowClicked} =
    useMemberList();

  return (
    <div>
      <PageHeader headerTitle={`Member List`} />
      <DataTable
        columns={columns}
        data={memberList}
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
        onChangePage={handlePageChange}
        paginationPerPage={10}
        onRowClicked={onRowClicked}
        paginationRowsPerPageOptions={[10]}
      />
    </div>
  );
}

export default ExpenseReport;
