import React from "react";
import { useBeetWiseReport } from "./useBeetWiseReport";
import PageHeader from "../../../components/common/PageHeader";
import FilterComponent from "./FilterComponent";
import Loading from "../../../components/UI/Loading";
import DataTable from "react-data-table-component";
import { customStyles } from "../../../constants/customStyles";

function BeetWiseReport() {
  const {
    isFMCG,
    fetchReportProgress,
    filterBeetWiseReport,
    columns,
    helperCall,
    exportToExcelFn,
    allUniqueCityList,
    allUniqueStateList,
    selectedCities,
    selectedStates,
    setSelectedCities,
    setSelectedStates,
    onRowClicked,
  } = useBeetWiseReport();

  return (
    <div className="container">
      <PageHeader
        headerTitle={`${isFMCG ? "Beet-Outlet" : "Route-Chemist"} Report`}
        renderRight={() => (
          <FilterComponent
            citiesList={allUniqueCityList}
            stateList={allUniqueStateList}
            setSelectedStates={setSelectedStates}
            selectedStates={selectedStates}
            selectedCities={selectedCities}
            setSelectedCites={setSelectedCities}
            exportToExcel={() => exportToExcelFn()}
            onConfirm={(startDate, endDate) =>
              helperCall(
                `${startDate}T00:00:00.000Z`,
                `${endDate}T00:00:00.000Z`
              )
            }
          />
        )}
      />
      {fetchReportProgress ? (
        <Loading />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={filterBeetWiseReport}
            pagination
            progressPending={fetchReportProgress}
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
      )}
    </div>
  );
}

export default BeetWiseReport;
