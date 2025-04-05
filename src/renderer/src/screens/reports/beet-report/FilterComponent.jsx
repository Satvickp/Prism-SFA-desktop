import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Select from "react-select";

function FilterComponent({
  onConfirm,
  memberList,
  setFilterMemberId,
  filterMemberId,
  exportToExcel,
  noDate,
}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const handleMemberSelectChange = (selectedMembers) => {
    if (selectedMembers.length > 3) return;
    const selectedMemberIds = selectedMembers.map((member) => member.value);
    setFilterMemberId(selectedMemberIds);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeoutId = setTimeout(() => {
      onConfirm(e.target.value);
    }, 300);
    setDebounceTimeout(timeoutId);
  };

  return (
    <div className="d-flex gap-3" style={{marginBottom:'5px'}}>
      {!noDate && (
        <Form>
          <Form.Group controlId="datePicker">
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </Form.Group>
        </Form>
      )}
      <div>
        <Select
          isMulti
          options={memberList}
          onChange={handleMemberSelectChange}
          value={memberList.filter((option) =>
            filterMemberId.includes(option.value)
          )}
          placeholder="Select members"
        />
        {memberList.filter((option) => filterMemberId.includes(option.value))
          ?.length > 0 && (
          <span
            style={{ fontSize: 13, color: "red", marginTop: 4, marginLeft: 3 }}
          >
            MAX SELECT 3
          </span>
        )}
      </div>
      <Button
        style={{
          display: "flex",
          flex: "row",
          gap: "2px",
          alignItems: "center",
        }}
        onClick={() => exportToExcel(true)}
      >
        <i className="icofont-download-alt"></i> Export
      </Button>
    </div>
  );
}

export default FilterComponent;
