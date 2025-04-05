import React from "react";
import DataTable from "react-data-table-component";
import { customStyles } from "../../../constants/customStyles";
import "./index.css";
import PageHeader from "../../../components/common/PageHeader";
import { useBeetReport } from "./hook";
import FilterComponent from "./FilterComponent";
import { Tab, Tabs } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useIsSuperAdmin } from "../../../helper/isManager";

const EmployeeTable = () => {
  const {
    allMemberBeetLogReport,
    columns,
    helperGetCall,
    loading,
    filterMemberId,
    setFilterMemberId,
    filterDataMemberBeetLog,
    exportToExcel,
    isFMCG,
    onRowClicked,
    allMemberWithoutPlan,
    plan_not_created_col,
    planNotCreatedConditionalRowStyles,
    exportToExcelPlanNotCreated,
    activeTabReport,
    setActiveReportTab,
    noPlanFilterMemberId,
    setNoPlanFilterMemberId,
    noPlanFilterMemberBeetLog
  } = useBeetReport();

  const Cred = useSelector((state) => state.Cred);
  const isSuperAdmin = useIsSuperAdmin();
  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <Tabs
        id="controlled-tab-example"
        activeKey={activeTabReport}
        onSelect={(k) => setActiveReportTab(k)}
        className="mb-3"
      >
        <Tab eventKey="plan-created" title="Plan Created">
          <PageHeader
            headerTitle={`Daily Call Report`}
            // headerTitle={`${isFMCG ? "Beet" : "Route"} Journey Report`}
            renderRight={() => (
              <FilterComponent
                setFilterMemberId={setFilterMemberId}
                filterMemberId={filterMemberId}
                memberList={allMemberBeetLogReport?.map((log) => ({
                  label: log.employeeName,
                  value: log.id,
                }))}
                onConfirm={helperGetCall}
                exportToExcel={exportToExcel}
              />
            )}
          />
          <DataTable
            columns={columns}
            data={ isSuperAdmin ? filterDataMemberBeetLog : filterDataMemberBeetLog.filter((item) => item.reportingManager === Cred.sub)}
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
            onRowClicked={onRowClicked}
          />
          <br />
        </Tab>
        <Tab eventKey={"plan-not-created"} title="Plan Not Created">
          <PageHeader
            headerTitle={`Daily Call Report`}
            // headerTitle={`${isFMCG ? "Beet" : "Route"} Journey Not Created`}
            renderRight={() => (
              <FilterComponent
                noDate={true}
                setFilterMemberId={setNoPlanFilterMemberId}
                filterMemberId={noPlanFilterMemberId}
                memberList={allMemberWithoutPlan?.map((log) => ({
                  label: log.memberName,
                  value: log.id,
                }))}
                exportToExcel={() => exportToExcelPlanNotCreated()}
                onConfirm={() => {}}
              />
            )}
          />
          <DataTable
            columns={plan_not_created_col}
            data={ isSuperAdmin ? noPlanFilterMemberBeetLog : noPlanFilterMemberBeetLog.filter((item) => item.reportingManager === Cred.sub)}
            pagination
            conditionalRowStyles={planNotCreatedConditionalRowStyles}
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
        </Tab>
      </Tabs>
    </div>
  );
};

export default EmployeeTable;
