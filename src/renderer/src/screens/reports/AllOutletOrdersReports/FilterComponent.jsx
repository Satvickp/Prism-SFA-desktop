import React, { memo, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Select from "react-select";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useMemberHook } from "../../../hooks/memberHook";

export const ReportIdType = [
  { label: "Member", value: "member" },
  { label: "ClientFMCG", value: "client" },
];

export const ReportCallType = [
  { label: "By Productive Status", value: "productive" },
  { label: "By Order Medium", value: "order" },
];

export const ReportType = [
  { label: "Beet", value: "beet" },
  { label: "Outlet", value: "outlet" },
];

export const orderCallStatus = [
  { label: "Productive", value: "Productive" },
  { label: "Non Productive", value: "NonProductive" },
];

export const orderMedium = [
  { label: "On Site", value: "OnSite" },
  { label: "On Call", value: "OnCall" },
];

const FilterComponent = ({
  selectedReportIdLevel,
  selectedReportCallLevel,
  selectedReportTypeLevel,
  setSelectedReportTypeLevel,
  setSelectedReportIdLevel,
  setSelectedReportCallLevel,
  getReportData,
  exportToExcel,
}) => {
  const [filterType, setFilterType] = useState(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
  const [selectedOrderMedium, setSelectedOrderMedium] = useState(null);
  const [selectedMemberClientId, setSelectedMemberClientId] = useState(null);
  const [first, setFirst] = useState(false);

  const { getEveryMembers } = useMemberHook();
  const memberIds = useSelector((state) => state.Member.allMembers);
  const clientIds = useSelector((state) => state.ClientFMCG.allClients);

  const handleConfirmReportChange = () => {
    if (
      // !selectedReportTypeLevel ||
      !selectedReportIdLevel ||
      !selectedReportCallLevel ||
      // !selectedOrderStatus ||
      // !selectedOrderMedium ||
      !selectedMemberClientId
    ) {
      Swal.fire({
        title: "Invalid Details",
        text: "Make Sure You Select Each Details",
        timer: 2000,
        icon: "warning",
      });
    }
    console.log("Filters applied:", {
      reportType: ReportType[1],
      reportId: selectedReportIdLevel,
      reportCall: selectedReportCallLevel,
      orderStatus: selectedOrderStatus,
      orderMedium: selectedOrderMedium,
      memberClientId: selectedMemberClientId,
    });
    getReportData({
      reportType: ReportType[1],
      reportId: selectedReportIdLevel,
      reportCall: selectedReportCallLevel,
      orderStatus: selectedOrderStatus || orderCallStatus[0],
      orderMedium: selectedOrderMedium || orderMedium[0],
      memberClientId: selectedMemberClientId,
    });
    setFilterType(null);
  };

  useEffect(() => {
    if(first){
      handleConfirmReportChange();
    }
    setFirst(true)
  }, [selectedMemberClientId, selectedOrderMedium, selectedOrderStatus])


  return (
    <div className="filter-component p-3">
      <div className="filter-buttons">

        {/* adding direct filters */}
        <div className="d-flex gap-2">
          <Select
            options={ReportIdType}
            value={selectedReportIdLevel || ReportIdType[0]}
            onChange={setSelectedReportIdLevel}
            placeholder="Select Report Id Level"
          />
          <Select
              styles={{
                container: (base) => ({
                  ...base,
                  width: "200px",
                }),
                control: (base) => ({
                  ...base,
                  width: "200px",
                }),
              }}
            options={memberIds.map((id) => ({
              label: `${id.firstName} ${id.lastName} (${id.employeeId})`,
              value: id.id,
            }))}
            value={
              selectedMemberClientId || {
                label: `${memberIds[0]?.firstName} ${
                  memberIds[0]?.lastName
                }`,
                value: memberIds[0]?.id,
              }
            }
            onChange={(selectedOption) => {
              setSelectedMemberClientId(selectedOption);
            }}
            placeholder="Select Member ID"
          />
          <Select
            options={ReportCallType}
            value={selectedReportCallLevel || ReportCallType[0]}
            onChange={setSelectedReportCallLevel}
            placeholder="Select Report Call Level"
          />
          <Select
            options={orderCallStatus}
            value={selectedOrderStatus || orderCallStatus[0]}
            onChange={setSelectedOrderStatus}
            placeholder="Select Productive Type"
          />
          <Button onClick={exportToExcel}>
            <i className="icofont-download-alt"></i>
          </Button>
        </div>
      </div>

    </div>
  );
};

export default memo(FilterComponent);
