import React from "react";
import { useOutletWiseReport } from "./useOutletWiseReport";
import DataTable from "react-data-table-component";
import Loading from "../../../../components/UI/Loading";
import { customStyles } from "../../../../constants/customStyles";
import PageHeader from "../../../../components/common/PageHeader";

function OutletWiseReport() {
  const { allOutletWiseReport, columns, loading, isFMCG, onRowClicked } =
    useOutletWiseReport();

  return (
    <div className="container">
      <PageHeader headerTitle={`${isFMCG ? "Outlet" : "Chemist"} Wise Report`} />
      {loading ? (
        <Loading />
      ) : (
        <>
          <DataTable
            columns={columns}
            onRowClicked={onRowClicked}
            data={allOutletWiseReport}
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

export default OutletWiseReport;
