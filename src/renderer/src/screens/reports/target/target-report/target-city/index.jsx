import React from "react";
import { useCityList } from "./useCityList";
import PageHeader from "../../../../../components/common/PageHeader";
import { customStyles } from "../../../../../constants/customStyles";
import DataTable from "react-data-table-component";
import { Button } from "react-bootstrap";
import TargetAdd from "../add-form";

function TargetCity() {
  const {
    allCity,
    loading,
    columns,
    setAddTarget,
    addTarget,
    paramData,
    navigate,
  } = useCityList();

  const onRowClicked = (row) => {
    navigate("/target-report", {
      state: {
        ...paramData,
        cityId: row.id,
        cityName: row.cityName,
      },
    });
  };

  return (
    <div>
      <PageHeader
        headerTitle={"Select City"}
        renderRight={() => (
          <Button onClick={() => setAddTarget(true)}>Add Target</Button>
        )}
      />
      <DataTable
        columns={columns}
        title="City List"
        data={allCity}
        defaultSortField="cityName"
        selectableRows={false}
        highlightOnHover
        dense
        customStyles={customStyles}
        progressPending={loading}
        onRowClicked={onRowClicked}
      />
      <TargetAdd
        visible={addTarget}
        setVisible={setAddTarget}
        cityList={allCity}
      />
    </div>
  );
}

export default TargetCity;
