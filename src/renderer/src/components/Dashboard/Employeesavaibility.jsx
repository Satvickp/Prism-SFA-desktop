import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllLeavesByManagerId,
  getLeaveTypes,
} from "../../api/member/member-leave-api";
import { setAllLeaveTypes } from "../../redux/features/dropdownFieldSlice";
import { permissionIds } from "../../constants/constants";
import {
  getAllLeaves,
  getAllLeavesByMemberId,
} from "../../api/member/member-leave-api";
import { setLeaveRequests } from "../../redux/features/leaveRequestSlice";
import { setAllMyLeaveRequest } from "../../redux/features/leaveRequestSlice";
function Employeesavaibility() {
  const navigate = useNavigate();
  const LeaveRequests = useSelector((state) => state.LeaveRequests);
  const numberOfLeaveRequests = LeaveRequests?.allLeaveRequests?.length || 0;
  const Cred = useSelector((state) => state.Cred);
  const { memberPermissions } = useSelector((state) => state.Permission);
  const CredId = Cred.sub;
  const Dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleNavigateToLeave = () => {
    navigate(`/leave-request/${CredId}`);
  };

  const handleNavigateToAttendense = () => {
    navigate(`/attendance/${CredId}`);
  };

  async function getCall() {
    setLoading(true);
    const resp = await getLeaveTypes(Cred.token);
    Dispatch(setAllLeaveTypes(resp));
    if (LeaveRequests.allLeaveRequests.length < 1) {
      await fetchAll();
    }
    setLoading(false);
  }

  const fetchAll = async () => {
    try {
      const resp = memberPermissions.some(
        (item) => item === permissionIds.SUPER_ADMIN
      )
        ? await getAllLeaves(Cred.token, 0, Cred.sub)
        : await getAllLeavesByManagerId(Cred.token, 0, Cred.sub);

      Dispatch(
        setLeaveRequests({
          paginationData: resp.paginationData,
          allLeaveRequests: resp.data,
        })
      );

      const response = await getAllLeavesByMemberId(Cred.token, 0, Cred.sub);
      Dispatch(setAllMyLeaveRequest(response.data));
    } catch (error) {}
  };

  useEffect(() => {
    getCall();
  }, []);
  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold ">Employees Availability</h6>
      </div>
      <div className="card-body">
        <div className="row g-2 row-deck">
          <div
            className="col-md-6 col-sm-6"
            onClick={handleNavigateToAttendense}
            style={{ cursor: "pointer" }}
          >
            <div className="card">
              <div className="card-body ">
                <i className="icofont-checked fs-3"></i>
                <h6 className="mt-3 mb-0 fw-bold small-14">Attendance</h6>
                <span className="text-muted">400</span>
              </div>
            </div>
          </div>
          <div
            className="col-md-6 col-sm-6"
            onClick={handleNavigateToAttendense}
            style={{ cursor: "pointer" }}
          >
            <div className="card">
              <div className="card-body ">
                <i className="icofont-stopwatch fs-3"></i>
                <h6 className="mt-3 mb-0 fw-bold small-14">Late Coming</h6>
                <span className="text-muted">17</span>
              </div>
            </div>
          </div>
          <div
            className="col-md-6 col-sm-6"
            onClick={handleNavigateToAttendense}
            style={{ cursor: "pointer" }}
          >
            <div className="card">
              <div className="card-body ">
                <i className="icofont-ban fs-3"></i>
                <h6 className="mt-3 mb-0 fw-bold small-14">Absent</h6>
                <span className="text-muted">06</span>
              </div>
            </div>
          </div>

          <div
            className="col-md-6 col-sm-6"
            onClick={handleNavigateToLeave}
            style={{ cursor: "pointer" }}
          >
            <div className="card">
              <div className="card-body ">
                <i className="icofont-beach-bed fs-3"></i>
                <h6 className="mt-3 mb-0 fw-bold small-14">Leave Apply</h6>
                {loading ? (
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid #ccc",
                      borderTop: "2px solid #007bff",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  ></div>
                ) : (
                  <span className="text-muted">{numberOfLeaveRequests}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employeesavaibility;
