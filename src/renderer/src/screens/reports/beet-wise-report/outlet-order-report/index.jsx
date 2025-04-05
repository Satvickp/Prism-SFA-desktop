import React from "react";
import { useOutletOrderReport } from "./useOutletOrderReport";
import PageHeader from "../../../../components/common/PageHeader";
import Loading from "../../../../components/UI/Loading";
import DataTable from "react-data-table-component";
import { customStyles } from "../../../../constants/customStyles";

function OutletOrderReport() {
  const { allOutletOrderData, columns, loading } = useOutletOrderReport();
  return (
    <div className="container">
      <PageHeader headerTitle={`Outlet Order Report`} />
      {loading ? (
        <Loading />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={allOutletOrderData}
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
          />
        </>
      )}
    </div>
  );
}

export default OutletOrderReport;
