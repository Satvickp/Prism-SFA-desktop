import React from "react";
import { useMemberList } from "../../reports/expense-report/useMemberList";
import PageHeader from "../../../components/common/PageHeader";
import DataTable from "react-data-table-component";
import { customStyles } from "../../../constants/customStyles";

function MemberBirthDay() {
  const {
    columns,
    handlePageChange,
    loading,
    memberList,

    paginationData,
  } = useMemberList();
  return (
    <div>
      <PageHeader headerTitle={"Member List"} />
      <DataTable
        columns={columns}
        data={memberList}
        pagination
        // paginationServer
        // paginationTotalRows={paginationData.totalElement}
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
        // onChangePage={handlePageChange}
        // paginationPerPage={10}
        // paginationRowsPerPageOptions={[10]}
      />
    </div>
  );
}

export default MemberBirthDay;
