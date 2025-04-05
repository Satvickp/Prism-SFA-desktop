import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import SingleDropdown from "../../../components/UI/SingleDropdown";
import { RecurrenceTypes } from "../../../constants/enums";
import { Modal, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getDateFormat } from "../../../helper/date-functions";
import Loading from "../../../components/UI/Loading";
import Offcanvas from "react-bootstrap/Offcanvas";
import Swal from "sweetalert2";
import { useBeetApiHook } from "../../../hooks/beetHook";
import DoctorsModal from "./DoctorsModal";
import WeekDaySelectionModal from "./WeekDaySelectionModal";

function CreateScheduleForm({
  isModal,
  setIsModal,
  buttonLoader,
  setButtonLoader,
  onEndReachMember,
  allSchedule,
  setAllSchedule,
  CreateSchedules,
  currentSlot,
  selectedMember,
  setSelectedMember,
}) {
  const Cred = useSelector((state) => state.Cred);
  const Member = useSelector((state) => state.Member);
  const Beet = useSelector((state) => state.Beets.content);

  const { GetAllBeetsByMemberId } = useBeetApiHook();

  const [selectedBeat, setSelectedBeat] = useState("");
  const [selectedRecurrenceType, setSelectedRecurrenceType] = useState("");
  // const [selectedMember, setSelectedMember] = useState({});
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [width, setWidth] = useState("100%");
  const [isDoctorsList, setIsDoctorsList] = useState(false);
  const [doctorsList, setDoctorsList] = useState([]);

  const [isSelectedDaysList, setIsSelectedDaysList] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);

  let column = [
    {
      name: <span className="text-wrap">MEMBER</span>,
      selector: (row) => row.members.id,
      sortable: true,
      cell: (row) => (
        <p className="fw-bold text-secondary text-wrap">
          {row.members.firstName + " " + row.members.lastName}
        </p>
      ),
    },
    {
      name: <span className="text-wrap">ROUTE NAME</span>,
      selector: (row) => row.beet.id,
      sortable: true,
      cell: (row) => (
        <p className="fw-bold text-secondary text-wrap">{row.beet.name}</p>
      ),
    },

    {
      name: <span className="text-wrap">RECURRENCE</span>,
      selector: (row) => row.recurrenceType,
      sortable: true,
      cell: (row) => (
        <p className="fw-bold text-secondary text-wrap">{row.recurrenceType}</p>
      ),
    },

    {
      name: <span className="text-wrap">ROUTE ADDRESS</span>,
      selector: (row) => row.beet.id,
      sortable: true,
      cell: (row) => (
        <p className="fw-bold text-secondary text-wrap">{row.beet.address}</p>
      ),
    },
    {
      name: <span className="text-wrap">START AT</span>,
      selector: (row) => row.startAt,
      sortable: true,
      cell: (row) => (
        <p className="fw-bold text-secondary text-wrap">
          {getDateFormat(row.startAt)}
        </p>
      ),
    },
    {
      name: <span className="text-wrap">END AT</span>,
      selector: (row) => row.endAt,
      sortable: true,
      cell: (row) => (
        <p className="fw-bold text-secondary text-wrap">
          {getDateFormat(row.endAt)}
        </p>
      ),
    },
    // {
    //   name: <span className="text-wrap">DOCTORS LIST</span>,
    //   cell: (row, index) => (
    //     <button
    //       type="button"
    //       onClick={() => {
    //         setIsDoctorsList(!isDoctorsList)
    //       }}
    //       className="btn btn-outline-secondary"
    //     >
    //       <i className="icofont-eye text-info"></i>
    //     </button>
    //   ),
    // },
    {
      name: "Action",
      cell: (row, index) => (
        <button
          type="button"
          onClick={() => {
            const newSch = allSchedule.filter((sche, ind) => index != ind);
            setAllSchedule(newSch);
          }}
          className="btn btn-outline-secondary"
        >
          <i className="icofont-ui-delete text-danger"></i>
        </button>
      ),
    },
  ];

  const updateWidth = () => {
    if (window.innerWidth >= 992) {
      setWidth("50%"); // Large screens
    } else if (window.innerWidth >= 768) {
      setWidth("75%"); // Medium screens
    } else {
      setWidth("100%"); // Small screens
    }
  };

  useEffect(() => {
    updateWidth(); // Set initial width
    window.addEventListener("resize", updateWidth); // Update on window resize
    return () => window.removeEventListener("resize", updateWidth); // Cleanup
  }, []);

  console.log("selectedmember :", selectedMember);

  useEffect(() => {
    if (selectedMember?.value?.id) {
      GetAllBeetsByMemberId(selectedMember.value.id);
    } else {
      console.log("invalid member selection! :", selectedMember);
    }
  }, [selectedMember]);

  return (
    <>
      <Offcanvas
        // size="xl"
        show={isModal}
        placement={"end"}
        // centered
        onHide={() => {
          setIsModal(false);
        }}
        style={{ width }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold">Create Plan</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SingleDropdown
            buttonLoader={buttonLoader.loadMoreMember}
            title="Select Member"
            placeholder="Select Member"
            isMandatory={true}
            data={selectedMember?.value}
            accessLabel={(item) => item.firstName + " " + item.lastName}
            dropdownData={
              Array.isArray(Member.allMembers)
                ? [
                    ...Member.allMembers,
                    {
                      id: Cred.sub,
                      firstName: Cred.firstName,
                      lastName: Cred.lastName,
                      cities: Cred.cities,
                    },
                  ]
                : []
            }
            disabled={true}
            isPagination={
              Member.paginationData.totalPages &&
              Member.paginationData.totalPages - 1 >
                Member.paginationData.number
            }
            loadMore={onEndReachMember}
            handleChange={(item) => {
              console.log(item);
              setSelectedMember(item);
            }}
            handleClick={() => {
              setSelectedBeat("");
              setStartAt("");
              setEndAt("");
            }}
          />
          <br />

          <SingleDropdown
            buttonLoader={buttonLoader.loadMoreMember}
            title="Assign Route"
            isMandatory={true}
            data={selectedBeat}
            placeholder="Select Route"
            accessLabel={(item) => item.beet + " " + `(${item.address})`}
            dropdownData={
              Array.isArray(Beet)
                ? Beet.filter((item) => item?.outlets?.length > 0)
                : []
            }
            // loadMore={onEndReachMember}
            handleChange={(item) => {
              setSelectedBeat(item);
              setIsDoctorsList(true);
            }}
            handleClick={() => {
              // setSelectedDays([]);
              // setSelectedClient([]);
              setSelectedBeat({});
              // setCities([]);
              setStartAt("");
              setEndAt("");
              // setClients([]);
              // setOption([]);
            }}
          />

          <br />
          <div className="row g-3">
            <div className="col-sm-6">
              <label className="form-label">Start At*</label>
              <input
                type="date"
                className="form-control"
                id="datepickerded"
                min={getDateFormat(
                  startAt ? startAt : new Date(currentSlot?.start)
                )}
                value={getDateFormat(
                  startAt ? startAt : new Date(currentSlot?.start)
                )}
                // disabled
                onChange={(e) => setStartAt(e.target.value)}
              />
            </div>
            <div className="col-sm-6">
              <label htmlFor="datepickerdedone" className="form-label">
                End Date*
              </label>
              <input
                type="date"
                className="form-control"
                value={endAt}
                min={getDateFormat(
                  startAt ? startAt : new Date(currentSlot?.start)
                )}
                id="datepickerdedone"
                onChange={(e) => setEndAt(e.target.value)}
              />
            </div>
          </div>
          <br />
          <div className="mb-3">
            <label htmlFor="firstNameInput" className="form-label">
              Recurrence Type*
            </label>
            <select
              className="form-select"
              value={selectedRecurrenceType}
              disabled={!startAt && !endAt ? true : false}
              onChange={(e) => {
                const selectedValue = e.target.value;
                setSelectedRecurrenceType(selectedValue);
                setIsSelectedDaysList(true);
              }}
            >
              {" "}
              <option value="">Select Recurrence Type</option>
              {RecurrenceTypes?.map((value, i) => {
                return (
                  <option value={value.value} key={i}>
                    {`${value.name}`}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            type="button"
            onClick={async () => {
              if (
                !selectedMember.value ||
                !selectedBeat ||
                !selectedRecurrenceType ||
                !endAt
              ) {
                // setIsModal(false);
                Swal.fire({
                  title: "Warning",
                  text: "Please fill all required fields",
                  icon: "warning",
                  timer: 3000,
                  // willClose: () => setIsModal(true)
                });
                return;
              }

              try {
                const st = new Date(currentSlot?.start);
                const et = endAt ? new Date(endAt) : new Date(currentSlot?.end);
                console.log("selected Beet with data : ", selectedBeat);
                setAllSchedule((prevSchedules) => [
                  ...prevSchedules,
                  {
                    members: {
                      id: selectedMember.value.id,
                      firstName: selectedMember.value.firstName,
                      lastName: selectedMember.value.lastName,
                    },
                    beet: {
                      id: selectedBeat.id,
                      name: selectedBeat.beet,
                      address: selectedBeat.address,
                    },
                    startAt: st.toISOString(),
                    endAt: et.toISOString(),
                    recurrenceType: selectedRecurrenceType,
                  },
                ]);

                setStartAt("");
                setEndAt("");
                // setSelectedMember({});
                setSelectedRecurrenceType("");
                setSelectedBeat("");
              } catch (error) {
                setIsModal(false);
                Swal.fire("Error", `${error.message}`, "error");
              } finally {
                setButtonLoader({
                  ...buttonLoader,
                  addSchedule: false,
                });
              }
            }}
            className="btn btn-primary"
            // className="scheduleAdd"
          >
            {buttonLoader.addSchedule ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-1"
              />
            ) : (
              "Add"
            )}
          </button>
          <br />
          <br />
          <DataTable
            title={"Beat Journey Plan"}
            columns={column}
            data={allSchedule}
            defaultSortField="title"
            pagination
            selectableRows={false}
            className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
            highlightOnHover={true}
            page
            paginationServer
            progressComponent={<Loading animation={"border"} color={"black"} />}
            paginationComponentOptions={{
              noRowsPerPage: true,
            }}
          />

          <div className="d-flex gap-2 ">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsModal(false);
              }}
            >
              Done
            </button>
            <button
              onClick={() => CreateSchedules(selectedDays)}
              type="button"
              className="btn btn-primary"
            >
              {buttonLoader.createSchedules && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-1"
                />
              )}{" "}
              Create
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <DoctorsModal
        isViewPurpose={false}
        isModal={isDoctorsList}
        setIsModal={setIsDoctorsList}
        selectedBeet={selectedBeat}
        doctorsList={doctorsList}
        setDoctorsList={setDoctorsList}
      />

      <WeekDaySelectionModal
        isModal={isSelectedDaysList}
        setIsModal={setIsSelectedDaysList}
        startDate={startAt}
        endDate={endAt}
        selectedDays={selectedDays}
        setSelectedDays={setSelectedDays}
      />
    </>
  );
}

export default CreateScheduleForm;
