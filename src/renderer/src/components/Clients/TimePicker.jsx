import React, { useState, useEffect } from "react";

const TimePicker = ({ value, setValue }) => {
  const [time, setTime] = useState({
    hours: "00",
    minutes: "00",
    period: "AM",
  });

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const period = hours >= 12 ? "PM" : "AM";

      if (hours > 12) hours -= 12;
      if (hours === 0) hours = 12;

      setTime({
        hours: hours.toString().padStart(2, "0"),
        minutes,
        period,
      });
    }else{
      setTime({
        hours: "00",
        minutes: "00",
        period: "AM"
      })
    }
  }, [value]);

  useEffect(() => {
    updateISOTime(time);
  }, [time]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTime((prev) => ({ ...prev, [name]: value }));
  };

  const updateISOTime = ({ hours, minutes, period }) => {
    const now = new Date(value || new Date());
    let adjustedHours = parseInt(hours, 10);

    // Convert 12-hour format to 24-hour format
    if (period === "PM" && adjustedHours !== 12) adjustedHours += 12;
    if (period === "AM" && adjustedHours === 12) adjustedHours = 0;

    now.setHours(adjustedHours, parseInt(minutes, 10), 0, 0);
    setValue(now.toISOString()); // Set in ISO format
  };

  return (
    <div className="d-flex gap-2">
      {/* Hours */}
      <select name="hours" value={time.hours} onChange={handleChange} className="form-control">
        {Array.from({ length: 13 }, (_, i) => {
          const hour = (i).toString().padStart(2, "0");
          return <option key={hour} value={hour}>{hour}</option>;
        })}
      </select>
      :
      {/* Minutes */}
      <select name="minutes" value={time.minutes} onChange={handleChange} className="form-control">
        {["00", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((min) => (
          <option key={min} value={min}>{min}</option>
        ))}
      </select>
      {/* AM/PM */}
      <select name="period" value={time.period} onChange={handleChange} className="form-control">
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

export default TimePicker;
