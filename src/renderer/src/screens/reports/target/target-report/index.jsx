import React from "react";
import TargetAdd from "./add-form";
import PageHeader from "../../../../components/common/PageHeader";
import FilterComponent from "./FilterComponent";

function TargetReport() {
  return (
    <div>
      <PageHeader
        headerTitle={"Target Report"}
        renderRight={() => <FilterComponent />}
      />
    </div>
  );
}

export default TargetReport;
