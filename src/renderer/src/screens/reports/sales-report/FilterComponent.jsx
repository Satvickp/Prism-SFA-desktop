import React, { memo, useState } from "react";
import { Button } from "react-bootstrap";
import Select from "react-select";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export const SalesLevelOptions = [
  { value: "WAREHOUSE", label: "Primary Sale" },
  { value: "STOCKIST", label: "Secondary Sale" },
];

const FilterComponent = ({
  dateRange,
  setDateRange,
  selectedSalesLevel,
  exportToExcel,
  setSelectedSalesLevel,
}) => {
  const [filterType, setFilterType] = useState(null);
  const [tempDateRange, setTempDateRange] = useState(dateRange);

  const handleFilterToggle = (type) => {
    setFilterType(type === filterType ? null : type);
  };

  const handleSalesLevelChange = (selectedOption) => {
    setSelectedSalesLevel(selectedOption);
    setFilterType(null);
  };

  const handleDateChange = (ranges) => {
    setTempDateRange(ranges.selection);
  };

  const handleConfirmDateChange = () => {
    let startDate = tempDateRange.startDate;
    let endDate = tempDateRange.endDate;
    startDate.setDate(startDate.getDate() + 1);
    endDate.setDate(endDate.getDate() + 1);
    setDateRange({
      startDate,
      endDate,
      key:'"selection"'
    });
    setFilterType(null);
  };

  const handleCancelDateChange = () => {
    setTempDateRange(dateRange);
    setFilterType(null);
  };

  return (
    <div className="filter-component p-3" style={{position: "relative", zIndex: 50}}>
      <div className="filter-buttons">
        <Button onClick={exportToExcel} className="me-2">Export To Excel</Button>
        <Button
          variant={
            filterType === "salesLevel"
              ? "outline-primary"
              : "outline-secondary"
          }
          onClick={() => handleFilterToggle("salesLevel")}
          className="me-2 custom-btn"
        >
          Filter by Sales Level
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

      {filterType === "salesLevel" && (
        <div className="sales-level-filter mt-3">
          <Select
            options={SalesLevelOptions}
            value={selectedSalesLevel}
            onChange={handleSalesLevelChange}
            placeholder="Select Sales Level"
            className="react-select-container"
          />
        </div>
      )}

      {filterType === "date" && (
        <div className="date-filter mt-3 bg-white" style={{position: "absolute", zIndex: 50}}>
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
            <div className="button-group d-flex gap-1">
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
