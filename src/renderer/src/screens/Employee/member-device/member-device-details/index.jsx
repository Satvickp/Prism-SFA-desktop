import React from "react";
import { useMemberDeviceDetail } from "./useMemberDeviceDetail";
import DataTable from "react-data-table-component";
import { customStyles } from "../../../../constants/customStyles";
import PageHeader from "../../../../components/common/PageHeader";
import { Button } from "react-bootstrap";

function MemberDeviceDetails() {
  
  const {
    columns,
    fetchedDeviceList,
    handleUnBlock,
    isAcceptEnable,
    isLogOutEnable,
    loading,
    logOutMember,
    memberName,
  } = useMemberDeviceDetail();

  return (
    <div className="p-2">
      <PageHeader
        headerTitle={`${memberName} Device List`}
        headerHClass="h4"
        renderRight={() => {
          return (
            <>
              {isLogOutEnable && (
                <Button onClick={logOutMember} variant="secondary">
                  Log out
                </Button>
              )}
              {isAcceptEnable && (
                <Button onClick={handleUnBlock} variant="primary">
                  Un-Block
                </Button>
              )}
            </>
          );
        }}
      />
      <DataTable
        columns={columns}
        data={fetchedDeviceList}
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
      />
    </div>
  );
}

export default MemberDeviceDetails;
