import React, { memo, useState } from "react";
import { Button } from "react-bootstrap";
import Select from "react-select";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export const ReportIdType = [
  { label: "Member", value: "member" },
];

export const ReportType = [
  { label: "Beet Order Report", value: "beet" },
  { label: "Outlet Order Report", value: "outlet" },
];

const FilterComponent = ({
  dateRange,
  setDateRange,
  selectedReportTypeLevel,
  setSelectedReportTypeLevel,
  selectedReportIdLevel,
  setSelectedReportIdLevel,
  getReportData,
}) => {
  const [filterType, setFilterType] = useState(null);
  const [tempDateRange, setTempDateRange] = useState(
    dateRange || {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    }
  );
  const [selectedMemberClientId, setSelectedMemberClientId] = useState(null);

  const memberIds = useSelector((state) => state.Member.allMembers);
  const Beets = useSelector((state) => state.Beets.content);

  const handleConfirmReportChange = () => {
    if (!selectedReportTypeLevel || !selectedMemberClientId) {
      Swal.fire({
        title: "Invalid Details",
        text: "Make sure you select all required details",
        timer: 2000,
        icon: "warning",
      });
      return;
    }
    setDateRange(tempDateRange)
    getReportData({
      reportType: selectedReportTypeLevel,
      reportId: selectedReportIdLevel,
      memberClientId: selectedMemberClientId,
    });

    setFilterType(null);
  };

  const handleCancelReportChange = () => {
    setFilterType(null);
    setSelectedReportTypeLevel(null);
    setSelectedReportIdLevel(null);
    setSelectedMemberClientId(null);
  };

  const handleDateChange = (ranges) => {
    setTempDateRange(ranges.selection);
  };

  const handleConfirmDateChange = () => {
    setDateRange(tempDateRange);
    setFilterType(null);
    console.log("Filter Data", {
      selectedMemberClientId,
      selectedReportTypeLevel,
      selectedReportIdLevel,
      tempDateRange
    });
    handleConfirmReportChange();
  };

  const handleCancelDateChange = () => {
    setTempDateRange(dateRange);
    setFilterType(null);
  };

  const handleFilterToggle = (type) => {
    setFilterType((prev) => (prev === type ? null : type));
  };

  return (
    <div className="filter-component p-3">
      <div className="filter-buttons mb-3">
        <Button
          variant={
            filterType === "reportType"
              ? "outline-primary"
              : "outline-secondary"
          }
          onClick={() => handleFilterToggle("reportType")}
          className="mr-2"
        >
          Select Report Type
        </Button>
        <Button
          variant={
            filterType === "reportId" ? "outline-primary" : "outline-secondary"
          }
          onClick={() => handleFilterToggle("reportId")}
          className="mr-2"
        >
          Select Member ID Type
        </Button>
        <Button
          variant={
            filterType === "date" ? "outline-primary" : "outline-secondary"
          }
          onClick={() => handleFilterToggle("date")}
          className="custom-btn"
        >
          Filter by Date
        </Button>
      </div>

      {filterType === "reportType" && (
        <div className="mb-3">
          <Select
            options={ReportType}
            value={selectedReportTypeLevel || null}
            onChange={(option) => {
              setSelectedReportTypeLevel(option);
              setSelectedReportIdLevel(null);
              setSelectedMemberClientId(null);
            }}
            placeholder="Select Report Type"
          />
        </div>
      )}

      {filterType === "reportId" && (
        <div className="mb-3">
          {selectedReportTypeLevel?.value === "outlet" ? (
            <Select
              options={Beets.map((item) => ({
                label: `${item.beet} (Outlets: ${item.outlets.length})`,
                value: item.id,
              }))}
              value={selectedMemberClientId || null}
              onChange={setSelectedMemberClientId}
              placeholder="Select Beet Id"
            />
          ) : (
            <Select
              options={memberIds.map((member) => ({
                label: `${member.firstName} ${member.lastName} (${member.employeeId})`,
                value: member.id,
              }))}
              value={selectedMemberClientId || null}
              onChange={setSelectedMemberClientId}
              placeholder="Select Member ID"
            />
          )}
        </div>
      )}

      {filterType === "date" && (
        <div className="date-filter mt-3">
          <div className="date-picker-wrapper">
            <label>Select Date Range</label>
            <DateRange
              ranges={[tempDateRange]}
              onChange={handleDateChange}
              showDateDisplay={false}
              moveRangeOnFirstSelection={false}
              months={1}
              direction="horizontal"
              className="compact-calendar"
            />
            <div className="button-group d-flex gap-1 mt-3">
              <Button variant="secondary" onClick={handleCancelDateChange}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmDateChange}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(FilterComponent);
