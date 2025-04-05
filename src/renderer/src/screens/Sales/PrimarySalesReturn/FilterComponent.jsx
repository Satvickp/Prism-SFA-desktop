import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Select from "react-select";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./FilterComponent.css";

const FilterComponent = ({ onFilterChange }) => {
  const [filterType, setFilterType] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [range, setRange] = useState({
    startDate: null,
    endDate: null,
    key: "selection",
  });

  const handleFilterToggle = (type) => {
    setFilterType(type === filterType ? null : type);
  };

  const handleMemberChange = (selectedOption) => {
    setSelectedMember(selectedOption);
    onFilterChange("member", selectedOption);
  };

  const handleDateChange = (ranges) => {
    setRange(ranges.selection);
    if (ranges.selection.startDate && ranges.selection.endDate) {
      onFilterChange("date", ranges.selection);
    }
  };

  const memberOptions = [
    { value: "Damon Salvatore", label: "Member 1" },
    { value: "Stephan Salvatore", label: "Member 2" },
    { value: "NiKalus The Original", label: "Member 3" },
  ];

  return (
    <div className="filter-component">
      <div className="filter-buttons">
        <Button
          variant={
            filterType === "member" ? "outline-primary" : "outline-secondary"
          }
          onClick={() => handleFilterToggle("member")}
          className="mr-2 custom-btn"
        >
          Filter by Member
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

      {filterType === "member" && (
        <div className="member-filter mt-3">
          <Select
            options={memberOptions}
            value={selectedMember}
            onChange={handleMemberChange}
            placeholder="Select a member"
            className="react-select-container"
          />
        </div>
      )}

      {filterType === "date" && (
        <div className="date-filter mt-3">
          <div className="date-picker-wrapper">
            <label>Select Date Range</label>
            <DateRange
              ranges={[range]}
              onChange={handleDateChange}
              showDateDisplay={false}
              moveRangeOnFirstSelection={false}
              months={1}
              direction="horizontal"
              className="compact-calendar"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
