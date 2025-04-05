import React, { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";
import PageHeader from "../../components/common/PageHeader";
import { HolidaysData } from "../../components/Data/AppData";
import { useDispatch, useSelector } from "react-redux";
import { permissionIds } from "../../constants/constants";
import {
  createHoliday,
  DeleteHoliday,
  getAllHolidays,
  UpdateHoliday,
} from "../../api/holidays/holidays-api";

import {
  setHoliday,
  addHoliday,
  deleteAllHoliday,
  updateHoliday,
  deleteHoliday,
  concatHoliday,
} from "../../redux/features/holidaySlice";

import Swal from "sweetalert2";
import Loading from "../../components/UI/Loading";
import { customStyles } from "../../constants/customStyles";

function Holidays() {
  const Dispatch = useDispatch();
  const Holiday = useSelector((state) => state.Holiday);
  const Cred = useSelector((state) => state.Cred);
  const { memberPermissions } = useSelector((state) => state.Permission);

  const [buttonLoader, setButtonLoader] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [loading, setloading] = useState(false);
  const [isEditModalData, setIsEditModalData] = "";
  const [newHolidayName, setNewHolidayName] = useState("");
  const [holidayName, setHolidayName] = useState("");
  const [newHolidayDate, setNewHolidayDate] = useState(null);
  const [holidayDate, setHolidayDate] = useState(null);
  const [holidayId, setHolidayId] = useState("");
  const [allHolidays, setAllHolidays] = useState([]);

  async function AddHoliday() {
    if (holidayDate == null || holidayName == "") {
      setIsModal(false);
      Swal.fire({
        title: "Please filled every field",
        text: "Can't Fetch Update Holidays. Please Try After Some Time.",
        icon: "warning",
        timer: 2000,
      }).finally(() => setIsModal(true));
      return;
    }
    const payload = {
      holidayDate: holidayDate,
      holidayName: holidayName.toString(),
    };
    setButtonLoader(true);
    try {
      const resp = await createHoliday(Cred.token, payload);
      Dispatch(addHoliday(resp));
      setIsModal(false);
      setHolidayDate(null);
      setHolidayName("");
    } catch (error) {
      setIsModal(false);
      Swal.fire({
        title: "Something went wrong",
        text: "Can't Fetch Update Holidays. Please Try After Some Time.",
        icon: "error",
        timer: 2000,
      }).finally(() => setIsModal(true));
    }
    setButtonLoader(false);
  }

  async function updateSelectedHoliday() {
    const data = {
      id: holidayId,
      holidayName: newHolidayName,
      holidayDate: newHolidayDate,
    };
    setButtonLoader(true);
    try {
      const resp = await UpdateHoliday(data, Cred.token);
      if (resp) {
        Dispatch(updateHoliday(resp));
      }
      setIsEditModal(false);
    } catch (error) {
      //   setModalLoader(false);
      Swal.fire({
        title: "Something went wrong",
        text: "Can't Fetch Update Holidays. Please Try After Some Time.",
        icon: "error",
        timer: 2000,
      });
    }
    setButtonLoader(false);
  }

  const getHolidays = async () => {
    if (Holiday.allHoliday.length > 0) {
      return;
    }
    setloading(true);
    try {
      const resp = await getAllHolidays(Cred.token, 0);
      if (resp) {
        Dispatch(
          setHoliday({
            allHoliday: resp.data,
            paginationData: resp.paginationData,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
    setloading(false);
  };
  useEffect(() => {
    getHolidays();
  }, []);

  const deleteSelectedHoliday = async (row) => {
    try {
      const resp = await DeleteHoliday(Cred.token, row.id);
      if (resp) {
        Dispatch(deleteHoliday(row.id));
        Swal.fire("Success", "Prdocut Deleted Successfully", "success");
      }
    } catch (error) {
      Swal.fire({
        title: "Something went wrong",
        text: "Can't Delete More Holidays. Please Try After Some Time.",
        icon: "error",
        timer: 2000,
      });
    }
  };
  const setData = (row) => {
    setHolidayId(row.id);
    setNewHolidayDate(row.holidayDate ? row.holidayDate : new Date());
    setNewHolidayName(row.holidayName ? row.holidayName : "No details");
  };
  const handlePageChange = async (NextPage) => {
    if (
      Holiday.paginationData.totalPages - 1 == Holiday.paginationData.page ||
      Holiday.paginationData.page > Holiday.paginationData.totalPages
    ) {
      return;
    }

    try {
      const resp = await getAllHolidays(
        Cred.token,
        Holiday.paginationData.page + 1
      );
      Dispatch(
        concatHoliday({
          allHoliday: resp.data,
          paginationData: resp.paginationData,
        })
      );
    } catch (error) {
      Swal.fire("Something Went Wrong", "Can't Fetch More Data");
    }
  };

  var columnsT = "";
  columnsT = [
    {
      name: "HOLIDAY DATE",
      selector: (row) => (
        <span className={row.txtClass}>
          {row.holidayDate ? row.holidayDate : "No details"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "HOLIDAY NAME",
      selector: (row) => (
        <span className={row.txtClass}>
          {row.holidayName ? row.holidayName : "No details"}
        </span>
      ),
      sortable: true,
    },
  ];

  const hasPermission = memberPermissions?.some(
    (item) => item === permissionIds.SUPER_ADMIN
  );

  if (hasPermission) {
    columnsT.push({
      name: "ACTION",
      selector: () => {},
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setIsEditModal(true);
                setData(row);
              }}
            >
              <i className="icofont-edit text-success"></i>
            </button>
            <button
              type="button"
              onClick={() => deleteSelectedHoliday(row)}
              className="btn btn-outline-secondary deleterow"
            >
              <i className="icofont-ui-delete text-danger"></i>
            </button>
          </div>
        </div>
      ),
    });
  }

  // var actionColumnsT = "";
  // actionColumnsT = [
  //   {
  //     name: "ACTION",
  //     selector: () => {},
  //     sortable: true,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {memberPermissions?.some(
  //           (item) => item === permissionIds.SUPER_ADMIN
  //         ) && (
  //           <div className="d-flex gap-2">
  //             <button
  //               type="button"
  //               className="btn btn-outline-secondary"
  //               onClick={() => {
  //                 setIsEditModal(true);
  //                 setData(row);
  //               }}
  //             >
  //               <i className="icofont-edit text-success"></i>
  //             </button>
  //             <button
  //               type="button"
  //               onClick={() => deleteSelectedHoliday(row)}
  //               className="btn btn-outline-secondary deleterow"
  //             >
  //               <i className="icofont-ui-delete text-danger"></i>
  //             </button>
  //           </div>
  //         )}
  //       </div>
  //     ),
  //   },
  // ];

  return (
    <>
      {loading ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            headerTitle="Holidays"
            renderRight={() => {
              return (
                <div className="col-auto d-flex w-sm-100">
                  {memberPermissions.some(
                    (item) => item === permissionIds.SUPER_ADMIN
                  ) && (
                    <button
                      className="btn btn-dark btn-set-task w-sm-100 me-2"
                      onClick={() => {
                        setIsModal(true);
                      }}
                    >
                      <i className="icofont-plus-circle me-2 fs-6"></i>Add
                      Holidays
                    </button>
                  )}
                </div>
              );
            }}
          />
          <div className="row clearfix g-3">
            <div className="card">
              <div className="card-body">
                <DataTable
                  title={HolidaysData.title}
                  // columns={
                  //   memberPermissions.some(
                  //     (item) => item == permissionIds.SUPER_ADMIN
                  //   )
                  //     ? [...columnsT, actionColumnsT]
                  //     : columnsT
                  // }
                  columns={columnsT}
                  // onChangePage={handlePageChange}
                  data={Holiday.allHoliday}
                  defaultSortField="title"
                  // pagination
                  selectableRows={false}
                  highlightOnHover={true}
                  customStyles={customStyles}
                />
              </div>
            </div>
          </div>
          <Modal
            centered
            show={isEditModal}
            onHide={() => {
              setIsEditModal(false);
              setHolidayId("");
              setNewHolidayName("");
              setNewHolidayDate(new Date());
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Edit Holiday</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label className="form-label">Holiday Name</label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Holiday Name"
                  onChange={(e) => setNewHolidayName(e.target.value)}
                  value={newHolidayName}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Holiday Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="exampleFormControlInput2778"
                  onChange={(e) => {
                    setNewHolidayDate(e.target.value);
                  }}
                  value={newHolidayDate}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditModal(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => updateSelectedHoliday()}
              >
                {buttonLoader && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                )}
                Update
              </button>
            </Modal.Footer>
          </Modal>
          <Modal
            centered
            show={isModal}
            onHide={() => {
              setIsModal(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Add Holiday</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label className="form-label">Holiday Name</label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Holiday Name"
                  onChange={(e) => setHolidayName(e.target.value)}
                  value={holidayName}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Holiday Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="exampleFormControlInput2778"
                  onChange={(e) => {
                    setHolidayDate(e.target.value);
                  }}
                  value={holidayDate}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsModal(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => AddHoliday()}
              >
                {buttonLoader && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                )}
                Add
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
}

export default Holidays;
