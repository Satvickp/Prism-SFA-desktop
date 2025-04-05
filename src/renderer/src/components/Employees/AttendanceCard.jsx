import React, { useEffect, useState } from "react";
import AttendanceIcon from "./AttendanceIcon";

function createArrayWithNumbers(count) {
  const result = [];
  for (let i = 1; i <= count; i++) {
    result.push(i);
  }
  return result;
}

function isPresent(checkInDate, day, id) {
  const checkInDay = new Date(checkInDate).getDate();
  return checkInDay === day;
}

function AttendanceCard({ month, data }) {
  const [days, setDays] = useState([]);
  useEffect(() => {
    const arr = createArrayWithNumbers(month);
    setDays(arr);
  }, []);

 
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="atted-info d-flex mb-3 flex-wrap">
          <div className="full-present me-2">
            <i className="icofont-check-circled text-success me-1"></i>
            <span>Full Day Present</span>
          </div>
          <div className="Half-day me-2">
            <i className="icofont-wall-clock text-warning me-1"></i>
            <span>Half Day Present</span>
          </div>
          <div className="absent me-2">
            <i className="icofont-close-circled text-danger me-1"></i>
            <span>Full Day Absence</span>
          </div>
        </div>
        <div className="table-responsive">
          <table
            className="table table-hover align-middle mb-0"
            style={{ width: "90px" }}
          >
            <thead>
              <tr>
                <th>Member</th>

                {days.map((day, i) => (
                  <th style={{ width: "40px" }} key={i + "attCard"}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((e, i) => (
                <tr key={i + e.memberId}>
                  <td style={{ width: "80px" }}>
                    <span style={{ fontSize: 10 }} className="fw-bold small">
                      {e.memberName}
                    </span>
                  </td>

                  {days.map((day, j) => {
                    const { index, attendanceForDay } = e.attendance.reduce(
                      (acc, att, currentIndex) => {
                        const checkInDay = new Date(att.checkIn).getDate();
                        const checkOutDay = new Date(att.checkOut).getDate();

                        if (checkInDay === day && checkOutDay === day) {
                          return {
                            index: currentIndex,
                            attendanceForDay: {
                              isPresent: true,
                              icon: "success",
                            },
                          };
                        } else if (checkInDay === day || checkOutDay === day) {
                          return {
                            index: currentIndex,
                            attendanceForDay: {
                              isPresent: true,
                              icon: "warning",
                            },
                          };
                        }

                        return acc;
                      },
                      {
                        index: -1,
                        attendanceForDay: { isPresent: false, icon: "danger" },
                      }
                    );
                    return (
                    <AttendanceIcon
                    attendanceData={e.attendance[0]}
                    attendanceForDay={attendanceForDay}
                    />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AttendanceCard;
