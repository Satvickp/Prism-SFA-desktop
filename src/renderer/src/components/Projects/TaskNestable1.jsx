import React, { useEffect, useState } from "react";
import NestableCard from "./NestableCard";
import { Draggable, Droppable } from "react-drag-and-drop";
import { Button, Spinner } from "react-bootstrap";
import {
  getCompletedSchedules,
  getInProgressSchedules,
} from "../../helper/array-sort";
import { getAllSchedules } from "../../api/schedules/schedules-api";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";

function TaskNestable1() {
  const [inProgressSchedules, setInProgressSchedules] = useState([]);
  const [completedSchedules, setCompletedSchedules] = useState([]);
  const [loadMoreSchedules, setLoadMoreSchedules] = useState(false);
  const Schedules = useSelector((state) => state.Schedules);
  const Cred = useSelector((state) => state.Cred);
  const Dispatch = useDispatch();
  async function onEndReach() {
    setLoadMoreSchedules(true);
    try {
      const resp = await getAllSchedules(
        Schedules.paginationData.number + 1,
        Cred.token,
        Cred.sub
      );

      Dispatch({
        type: "concatSchedules",
        payload: {
          allSchedule: resp.data,
          paginationData: {
            ...Schedules.paginationData,
            number: Schedules.paginationData.number + 1,
          },
        },
      });
      setInProgressSchedules([
        ...inProgressSchedules,
        ...(await getInProgressSchedules(resp.data)),
      ]);
    } catch (error) {
      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Fetch Schedules . Please try After Some Time",
        icon: "error",
      });
    }
    setLoadMoreSchedules(false);
  }
  useEffect(() => {
    const sortedSch = getInProgressSchedules(Schedules.allSchedule);
    setInProgressSchedules(sortedSch.progress);
    setCompletedSchedules(sortedSch.completed);
  }, [Schedules]);

  return (
    <div className="row taskboard g-3 py-xxl-4" style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto' }}>
      {Schedules.allSchedule.length > 0 && (
        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 mt-xxl-4 mt-xl-4 mt-lg-4 mt-md-4 mt-sm-4 mt-4">
          <h6 className="fw-bold py-3 mb-0">Incomplete</h6>
          {inProgressSchedules
            .filter((item, index) => item.isApproved === "INACTIVE")
            .map((data, i) => {
              return (
                <div key={data.id}>
                  <NestableCard data={data} />
                </div>
              );
            })}
        </div>
      )}
      {Schedules.allSchedule.length > 0 && (
        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 mt-xxl-4 mt-xl-4 mt-lg-4 mt-md-4 mt-sm-4 mt-4">
          <h6 className="fw-bold py-3 mb-0">Not Approved</h6>
          {inProgressSchedules
            .filter((item, index) => item.isApproved === "PENDING")
            .map((data, i) => {
              return (
                <div key={data.id}>
                  <NestableCard data={data} isProgress={true} />
                </div>
              );
            })}
        </div>
      )}
      {Schedules.allSchedule.length > 0 && (
        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 mt-xxl-4 mt-xl-4 mt-lg-4 mt-md-4 mt-sm-4 mt-4">
          <h6 className="fw-bold py-3 mb-0">In Progress</h6>
          {inProgressSchedules
            .filter((item, index) => item.isApproved === "ACTIVE")
            .map((data, i) => {
              return (
                <div key={data.id}>
                  <NestableCard data={data} />
                </div>
              );
            })}
        </div>
      )}

  {/* we only have an enum on isApproved  [ Active, Inactive, Pending, Deleted] 
  - required [ 
  Complete(schedule was approved and completed), 
  Incomplete(schedule was approved but not completed),
  Pending(not approved),
  Inprogress(approved and at work)
    ]*/}
      {Schedules.allSchedule.length > 0 && (
        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 mt-xxl-4 mt-xl-4 mt-lg-4 mt-md-4 mt-sm-4 mt-4">
          <h6 className="fw-bold py-3 mb-0">Completed</h6>
          {inProgressSchedules.filter((item, index) => item.isApproved === "DELETED").map((data, i) => {
            return (
              <div key={data.id}>
                <NestableCard data={data} />
              </div>
            );
          })}
        </div>
      )}

      {/* {inProgressSchedules.length > 0 && (
        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 mt-xxl-4 mt-xl-4 mt-lg-4 mt-md-4 mt-sm-4 mt-4">
          <h6 className="fw-bold py-3 mb-0">In Progress</h6>
          {inProgressSchedules.map((data, i) => {
            return (
              <div key={data.id}>
                <NestableCard data={data} />
              </div>
            );
          })}
        </div>
      )}
      {completedSchedules.length > 0 && (
        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 mt-xxl-4 mt-xl-4 mt-lg-4 mt-md-4 mt-sm-4 mt-4">
          <h6 className="fw-bold py-3 mb-0">Completed</h6>
          {completedSchedules.map((data, i) => {
            return (
              <div key={data.id}>
                <NestableCard data={data} />
              </div>
            );
          })}
        </div>
      )} */}
      {/* {Schedules.paginationData.number <
        Schedules.paginationData.totalPages - 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            variant="primary"
            onClick={onEndReach}
            style={{ width: "200px", marginBottom: "10px" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p style={{ fontSize: 18, marginBottom: -2 }}>Load More</p>
              {loadMoreSchedules && (
                <Spinner
                  animation="border"
                  size="sm"
                  style={{ marginLeft: "10px" }}
                />
              )}
            </div>
          </Button>
        </div>
      )} */}
    </div>
  );
}

export default TaskNestable1;
