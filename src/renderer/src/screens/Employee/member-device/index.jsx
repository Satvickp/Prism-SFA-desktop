import React from "react";
import PageHeader from "../../../components/common/PageHeader";
import DataTable from "react-data-table-component";
import { customStyles } from "../../../constants/customStyles";
import { useMemberList } from "../../reports/expense-report/useMemberList";

function MemberListDevice() {
  const {
    memberList,
    paginationData,
    columns,
    loading,
    handlePageChange,
    navigate,
  } = useMemberList();

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
        onRowClicked={(row) => {
          navigate("/member-device-details", {
            state: row,
          });
        }}
        paginationRowsPerPageOptions={[10]}
      />
    </div>
  );
}

export default MemberListDevice;
