import React from "react";
import { useStateList } from "./useStateList";
import PageHeader from "../../../../../components/common/PageHeader";
import DataTable from "react-data-table-component";
import { customStyles } from "../../../../../constants/customStyles";

function SelectState() {
  const { loading, stateList, columns, navigate } = useStateList();

  function onRowClicked(data) {
      navigate('/select-target-city', {
        state: {
          stateId:data.id,
          stateName:data.stateName
        }
      })
  }

  return (
    <div>
      <PageHeader headerTitle={"Select State"} />
      <DataTable
        columns={columns}
        title="State Master"
        data={stateList}
        defaultSortField="stateName"
        pagination={false}
        progressPending={loading}
        selectableRows={false}
        highlightOnHover
        dense
        customStyles={customStyles}
        onRowClicked={onRowClicked}
      />
    </div>
  );
}

export default SelectState;
