import React, { useEffect, useState } from "react";
import { Badge, Modal, Spinner, Stack } from "react-bootstrap";
import PageHeader from "../../../components/common/PageHeader";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { exportToExcel } from "../../../helper/exportFunction";
import { setMembers, concatMembers } from "../../../redux/features/memberSlice";
import { getAllMembers } from "../../../api/member/member-api";
import { useDispatch } from "react-redux";
import {
  createSchedules,
  deleteSchedule,
  getAllSchedules,
  getAllSchedulesByReportingManager,
} from "../../../api/schedules/schedules-api";

import {
  setSchedules,
  concatSchedules,
  deleteSchedules,
  deleteAllSchedules,
} from "../../../redux/features/schedulesSlice";

import Loading from "../../../components/UI/Loading";
import AsyncSelect from "react-select/async";
import { useBeetApiHook } from "../../../hooks/beetHook";
import CreateScheduleForm from "./CreateScheduleForm";
import Calendar from "./BigCalendar/Calendar";
import { useNavigate, useParams } from "react-router-dom";
import { getDateFormat, getTimeFormat } from "../../../helper/date-functions";
import { useMemberHook } from "../../../hooks/memberHook";

function ScheduleCalendar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Cred = useSelector((state) => state.Cred);
  const Member = useSelector((state) => state.Member);
  const AllSchedules = useSelector((state) => state.Schedules);
  const { memberPermissions } = useSelector((state) => state.Permission);
  const { GetAllBeets, GetAllBeetsByMemberId } = useBeetApiHook();
  const { getEveryMembers } = useMemberHook();

  const [isModal, setIsModal] = useState(false);
  const [isDisplayOverLay, setIsDisplayOverLay] = useState(false);
  const [overLayData, setOverLayData] = useState({});
  const [loading, setLoading] = useState(false);
  const [allSchedule, setAllSchedule] = useState([]);
  const [buttonLoader, setButtonLoader] = useState({
    addSchedule: false,
    gettingDropDowns: false,
    loadMoreMember: false,
    loadMoreClient: false,
    createSchedules: false,
    loadMoreSchedule: false,
  });
  const [selectedMember, setSelectedMember] = useState(null);
  // const [memberOptions, setMemberOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentSlot, setCurrentSlot] = useState(null);

  const filterMember = (inputValue) => {
    return Member.allMembers.filter(
      (i) =>
        i.firstName.toLowerCase().includes(inputValue.toLowerCase()) ||
        i.lastName.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const promiseOptions = async (inputValue) => {
    const value = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(inputValue ? filterMember(inputValue) : Member);
      }, 1000);
    });
    return value.map((item) => ({
      label: `${item.firstName} ${item.lastName} (${item.employeeId})`,
      value: {
        firstName: item.firstName,
        lastName: item.lastName,
        id: item.id,
      },
    }));
  };

  async function getMember() {
    const Arrays = await getAllMembers(0, Cred.token, Cred.sub);
    dispatch(
      setMembers({
        allMembers: Arrays.data,
        paginationData: Arrays.paginationData,
      })
    );
  }

  async function openModal() {
    try {
      setIsModal(true);

      await getMember();
      // await GetAllBeets();
      // if(selectedMember?.value?.id){
      //   GetAllBeetsByMemberId(selectedMember.value.id)
      // }else{
      //   console.log("invalid member selection!")
      // }
      setButtonLoader({
        ...buttonLoader,
        ...{ gettingDropDowns: false },
      });
    } catch (error) {
      setIsModal(false);

      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Necessary Details!. Please try After Some Time",
        icon: "error",
      });
    }
  }

  function getMonthDates(inputDate = null) {
    const today = inputDate || new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const formatDate = (date) => {
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    };

    return {
      start: formatDate(startDate),
      end: formatDate(endDate),
    };
  }

  async function getData(memberId) {
    setLoading(true);
    try {
      const resp = false
        ? await getAllSchedules(0, Cred.token, memberId)
        : await getAllSchedulesByReportingManager(
            startDate,
            endDate,
            Cred.token,
            memberId
          );
      dispatch(
        setSchedules({
          allSchedule: resp.data || [],
          paginationData: resp?.data?.length || 0,
        })
      );
    } catch (error) {
      console.log("Error :", error);
    }
    setLoading(false);
  }

  async function onEndReachMember() {
    setButtonLoader({
      ...buttonLoader,
      ...{ loadMoreMember: true },
    });
    try {
      const resp = await getAllMembers(
        Member.paginationData.number + 1,
        Cred.token,
        Cred.sub
      );
      dispatch(
        concatMembers({
          allMembers: resp.data,
          paginationData: resp.paginationData,
        })
      );
    } catch (error) {
      Swal.fire({
        title: "Something went wrong",
        text: "Can't Fetch More Member. Please Try After Some Time.",
        icon: "error",
        timer: 2000,
      });
    }
    setButtonLoader({
      ...buttonLoader,
      ...{ loadMoreMember: false },
    });
  }

  async function CreateSchedules(selectedDays=[]) {
    try {
      if (allSchedule.length > 0) {
        setButtonLoader({
          ...buttonLoader,
          ...{ createSchedules: true },
        });
        console.log("allSchedule: ", allSchedule);
        const payloadData = allSchedule.map((item) => ({
          beetId: item.beet.id,
          memberId: item.members.id,
          recurrenceType: item.recurrenceType,
          startDate: item.startAt,
          endDate: item.endAt,
          daysOfWeek: selectedDays
        }));
        const resp = await createSchedules(Cred.token, payloadData);
        let dispSch = [];
        allSchedule.forEach((item, index) =>
          dispSch.push({ ...item, id: resp[index] })
        );
        // console.log("dispSch",dispSch)
        dispatch(
          concatSchedules({
            allSchedule: dispSch,
            paginationData: AllSchedules.paginationData,
          })
        );
        setAllSchedule([]);
        setIsModal(false);
        setButtonLoader({
          ...buttonLoader,
          ...{ createSchedules: false },
        });
        Swal.fire(
          "Successfully Created",
          "Your Schedules Has Been Created",
          "success"
        );
        return;
      } else {
        setIsModal(false);
        Swal.fire({
          title: "Incomplete Fields",
          text: "Please give value to each field",
          icon: "warning",
        }).then(() => setIsModal(true));
      }
    } catch (error) {
      setIsModal(false);
      Swal.fire({
        title: "Something went wrong",
        text: "Can't Create Schedules. Please Try After Some Time.",
        icon: "error",
        timer: 2000,
      });
    }
    setButtonLoader({
      ...buttonLoader,
      ...{ createSchedules: false },
    });
  }

  async function deletePendingSchedules(id) {
    try {
      if (!id) {
        setIsDisplayOverLay(false);
        Swal.fire({
          title: "Incomplete Fields",
          text: "Please give value to each field",
          icon: "warning",
          titleText: "plan Id is missing",
          timer: 2000,
        }).then((e) => setIsDisplayOverLay(true));
      }

      const resp = await deleteSchedule(Cred.token, id);
      if (resp.status >= 200 && resp.status < 300) {
        dispatch(deleteSchedules(id));
        setIsDisplayOverLay(false);
      }
    } catch (error) {
      setIsDisplayOverLay(false);
      Swal.fire({
        title: "Something went wrong",
        text: "Can't Delete Schedules. Please Try After Some Time.",
        icon: "error",
        timer: 2000,
      });
      console.log(error);
    }
  }

  // while draging on an event
  const handleEventDrop = async ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    console.log("Event updated successfully:", updatedEvent);
  };

  // while clicking on an event
  const handleEventClick = (event) => {
    console.log("Event clicked:", event);
    setOverLayData(event);
    handleIsDisplayOverLay();
  };

  // while clicking on an empty slot
  const handleSlotClick = (slotInfo) => {
    console.log("Slot clicked:", slotInfo);
    const selectedDate = new Date(slotInfo.start).setHours(0, 0, 0, 0);
    const currentDate = new Date().setHours(0, 0, 0, 0); // Reset time to midnight
  
    if (selectedDate < currentDate) {
      Swal.fire({
        title: "Invalid Date selection",
        text: "Cannot create plan for past dates",
        icon: "info",
        timer: 2000,
      });
      return;
    }
  
    openModal();
    setCurrentSlot(slotInfo);
  };
  

  function handleIsDisplayOverLay() {
    setIsDisplayOverLay(!isDisplayOverLay);
  }

  useEffect(() => {
    if (Member.allMembers.length <= 0) {
      getEveryMembers();
    }
    const { start, end } = getMonthDates();
    setStartDate(start);
    setEndDate(end);
    if (Member.allMembers.length > 0) {
      console.log("working");
      getData(Member?.allMembers[0]?.id);
      setSelectedMember({
        label: `${Member?.allMembers[0]?.firstName} ${Member?.allMembers[0]?.lastName} (${Member?.allMembers[0]?.employeeId})`,
        value: {
          firstName: Member?.allMembers[0]?.firstName,
          lastName: Member?.allMembers[0]?.lastName,
          id: Member?.allMembers[0]?.id,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (selectedMember) {
      getData(selectedMember.value.id);
    }
  }, [selectedMember]);

  const handleNavigate = async (newDate, view, action) => {
    let updatedDate = new Date(newDate);

    console.log(`Navigated to: ${updatedDate}`);
    console.log(`Current view: ${view}`);
    console.log(`Action: ${action}`);

    // Ensure UI updates first
    setTimeout(async () => {
      const { start, end } = getMonthDates(updatedDate);
      try {
        // const resp = await getAllSchedulesByReportingManager(
        //   start,
        //   end,
        //   Cred.token,
        //   selectedMember.value.id
        // );
        // dispatch(
        //   setSchedules({
        //     allSchedule: resp.data || [],
        //     paginationData: resp?.data?.length || 0,
        //   })
        // );
      } catch (error) {
        console.log("Error :", error);
      }
    }, 100);
  };

  return (
    <>
      {loading ? (
        <Loading color="black" animation={"border"} />
      ) : (
        <div
          className="container-xxl"
          style={{ height: "75%", position: "relative", zIndex: 30 }}
        >
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              {/* back button */}
              <button
                className="btn fs-3"
                onClick={() => {
                  dispatch(deleteAllSchedules());
                  navigate(-1);
                }}
              >
                <i className="icofont-rounded-left"></i>
              </button>

              {/* Colour grading information */}
              <Stack direction="horizontal" gap={2}>
                <Badge bg="warning">Pending</Badge>
                <Badge bg="success">Completed</Badge>
                <Badge bg="danger">Incomplete</Badge>
                <Badge bg="info">Progress</Badge>
              </Stack>
            </div>

            {/* Member Filter Dropdown */}
            <div style={{ zIndex: 50, position: "absolute", top: 0, right: 0 }}>
              <AsyncSelect
                placeholder={"Select a member"}
                cacheOptions
                defaultOptions={Member.allMembers.map((item) => ({
                  label: `${item.firstName} ${item.lastName} (${item.employeeId})`,
                  value: {
                    firstName: item.firstName,
                    lastName: item.lastName,
                    id: item.id,
                  },
                }))}
                loadOptions={promiseOptions}
                value={selectedMember}
                onChange={(e) => setSelectedMember(e)}
                styles={{
                  control: (base) => ({ ...base, width: "250px" }),
                }}
              />
            </div>
          </div>

          {/* Schedule Calendar */}

          {selectedMember ? (
            <Calendar
              events={AllSchedules.allSchedule.map((item) => ({
                id: item.id,
                title: `${item?.beet?.beet}`,
                address:
                  `${item?.beet?.address}, ${item?.beet?.city}, ${item?.beet?.state}, ${item?.beet?.postalCode}` ||
                  "No address available",
                start: new Date(item?.visitDate),
                end: new Date(item?.visitDate),
                checkInTime: getTimeFormat(item?.checkIn) || "Not specified",
                checkOutTime: getTimeFormat(item?.checkOut) || "Not specified",
                workingWith: item?.workingWith || "Not specified",
                data: { ...item },
                beetJourneyPlanStatus:
                  item?.beetJourneyPlanStatus || "Not specified",
              }))}
              tooltipAccessor={(event) =>
                `Status: ${event.beetJourneyPlanStatus}\nBeat: ${event.title}\nAddress: ${event.address}\nCheckIn: ${event.checkInTime}\nCheckout: ${event.checkOutTime}\nWorkwith: ${event.workingWith}\n`
              }
              onEventDrop={handleEventDrop}
              isDraggable={false}
              resizable
              onSelectEvent={handleEventClick}
              onSelectSlot={handleSlotClick}
              onNavigate={handleNavigate}
            />
          ) : (
            <p>Kindly Select a Member</p>
          )}

          {/* creating tour plan form */}
          <CreateScheduleForm
            isModal={isModal}
            setIsModal={setIsModal}
            buttonLoader={buttonLoader}
            onEndReachMember={onEndReachMember}
            allSchedule={allSchedule}
            setAllSchedule={setAllSchedule}
            CreateSchedules={CreateSchedules}
            currentSlot={currentSlot}
            setButtonLoader={setButtonLoader}
            selectedMember={selectedMember}
            setSelectedMember={setSelectedMember}
          />

          {/* tour plan information modal view */}
          <Modal show={isDisplayOverLay} onHide={handleIsDisplayOverLay}>
            <Modal.Header closeButton>
              <Modal.Title>
                {overLayData?.title || "Event"} {" : "}
                {`${getDateFormat(overLayData?.start)}`}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="fs-6 d-flex gap-2">
                <span className="fw-bold">Member Name :</span>
                <span>{`${overLayData?.data?.memberGetDto?.firstName} ${overLayData?.data?.memberGetDto?.lastName}`}</span>
              </div>
              <div className="fs-6 d-flex gap-2">
                <span className="fw-bold">Employee Id :</span>
                <span>{`${overLayData?.data?.memberGetDto?.employeeId}`}</span>
              </div>
              <div className="fs-6 d-flex gap-2">
                <span className="fw-bold">Beat Name :</span>
                <span>{`${overLayData?.data?.beet?.beet || "NA"}`}</span>
              </div>
              <div className="fs-6 d-flex gap-2">
                <span className="fw-bold">Address :</span>
                <span>{`${overLayData?.data?.beet?.address}, ${overLayData?.data?.beet?.postalCode}`}</span>
              </div>
              <div className="fs-6 d-flex gap-2">
                <span className="fw-bold">State :</span>
                <span>{`${overLayData?.data?.beet?.state}`}</span>
              </div>
              <div className="fs-6 d-flex gap-2">
                <span className="fw-bold">Plan Status :</span>
                <span>{`${overLayData?.beetJourneyPlanStatus}`}</span>
              </div>
              <div className="fs-6 d-flex gap-2">
                <span className="fw-bold">Working Type :</span>
                <span>{`${overLayData?.workingWith}`}</span>
              </div>
              <div className="fs-6 d-flex gap-2">
                <span className="fw-bold">Outlet Name:</span>
                <span>{`${overLayData?.data?.outletGetDto?.outletName}`}</span>
              </div>
              <div className="fs-6 d-flex gap-2">
                <span className="fw-bold">Outlet Type:</span>
                <span>{`${overLayData?.data?.outletGetDto?.outletType}`}</span>
              </div>
              <div className="fs-6 d-flex gap-2">
                <span className="fw-bold">Outlet Name:</span>
                <span>{`${overLayData?.data?.outletGetDto?.ownerName}`}</span>
              </div>
            </Modal.Body>
            <Modal.Footer>
              {overLayData?.beetJourneyPlanStatus?.toUpperCase() == "PENDING" &&
                new Date(overLayData?.data?.visitDate) > new Date() && (
                  <button
                    className="btn btn-danger"
                    onClick={() => deletePendingSchedules(overLayData.id)}
                  >
                    <i className="icofont-bin"></i>
                    Delete
                  </button>
                )}
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
}

export default ScheduleCalendar;
