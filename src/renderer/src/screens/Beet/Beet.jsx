import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner, Toast } from "react-bootstrap";
import PageHeader from "../../components/common/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { permissionIds } from "../../constants/constants";
import Loading from "../../components/UI/Loading";
import Swal from "sweetalert2";
import AddUpdateModal from "./Form/AddUpdateModal";
import {
  deleteBeet,
  getAllBeet,
  getAllBeetByMemberId,
  getAllBeetWithoutFilter,
} from "../../api/beet/beet-api";
import { deleteSingleBeet, setBeets } from "../../redux/features/beetSlice";
import BeetOutlet from "./BeetOutlet";
import { useBeetApiHook } from "../../hooks/beetHook";
import {
  getAllClients,
  getAllClientsByReportingManager,
} from "../../api/clients/clientfmcg-api";
import { resetSelectedBeet, setClientsFMCG, setSelectedBeet } from "../../redux/features/clientFMCGSlice";
import { Data } from "@react-google-maps/api";
import { useParams } from "react-router-dom";
import { getEveryCity } from "../../api/clients/clients-api";
import { setAllCity } from "../../redux/features/dropdownFieldSlice";
import { useIsSuperAdmin } from "../../helper/isManager";
import Doctors from "../Our Clients/Doctors";
function Beet() {
  //Redux
  const Dispatch = useDispatch();
  const BeetDetails = useSelector((state) => state.Beets);
  const Cred = useSelector((state) => state.Cred);
  const Client = useSelector((state) => state.ClientFMCG);
  const { memberPermissions } = useSelector((state) => state.Permission);
  const { userId } = useParams();
  const DropDownsField = useSelector((state) => state.DropDownsField);

  // UI Manipulation Variables
  const [isModal, setIsModal] = useState(false);
  const [isOutletModal, setIsOutletModal] = useState(false);

  const [isDoctorModal, setIsDoctorModal] = useState(false);
  const [doctorBeetData, setDoctorBeetData] = useState(null);

  const [isModalDelete, setIsModalDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [buttonLoader, setButtonLoader] = useState({
    getDropDowns: false,
    addClient: false,
  });
  //outlet data
  const [outletData, setOutletData] = useState([]);
  const [beetId, setBeetId] = useState(null);
  const [clientFmcgId, setClientFmcgId] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const CLIENT_TYPE = window.localStorage.getItem("CLIENT_TYPE");

  //Pagination Variables
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5000);
  //Get All Beets details when Page is Loaded
  const { GetAllBeets } = useBeetApiHook(page, size);
  const isSuperAdmin = useIsSuperAdmin();
  // get all client/doctors
  async function get() {
    setLoading(true);
    try {
      if (Client.allClients.length <= 0) {
        const resp = memberPermissions.some(
          (item) => item === permissionIds.SUPER_ADMIN
        )
          ? await getAllClients(Cred.token, 0, Cred.sub)
          : await getAllClientsByReportingManager(Cred.token, 0, Cred.sub);
        Dispatch(
          setClientsFMCG({
            allClients: resp.data,
            paginationData: resp.paginationData,
          })
        );
      }
    } catch (error) {
      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Fetch Clients. Please try After Some Time",
        icon: "error",
      });
    }
    setLoading(false);
  }

  async function getAllCity() {
    if (DropDownsField.allCity.length <= 0 && isSuperAdmin) {
      const cityName = await getEveryCity(Cred.token, 0, 500);
      Dispatch(setAllCity(cityName));
    }
  }

  useEffect(() => {
    if (BeetDetails?.content?.length <= 0) {
      GetAllBeets();
      getAllCity();
    }
    get();
  }, []);

  function handleIsModal() {
    setIsModal(!isModal);
  }

  function handleIsOutletModal(data) {
    setIsOutletModal(!isOutletModal);
    setOutletData(data?.outlets);
    setBeetId(data?.id);
    setClientFmcgId(data?.clientFmcgId);
  }

  function handleisModalDelete(data) {
    setIsModalDelete(!isModalDelete);
    setBeetId(data?.id);
  }

  function handleGetUserLocation() {
    if (latitude && longitude) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error Code:", error.code);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("User denied the request for Geolocation.");
              setLocationError("Please provide location access to proceed");
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information is unavailable.");
              setLocationError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.error("The request to get user location timed out.");
              setLocationError("The request to get user location timed out.");
              break;
            case error.UNKNOWN_ERROR:
              console.error("An unknown error occurred.");
              setLocationError("An unknown error occurred.");
              break;
            default:
              console.error("Something went wrong");
              setLocationError("Something went wrong");
              break;
          }
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  function getPageType() {
    return CLIENT_TYPE === "CLIENT_FMCG" ? "Beats" : "Routes";
  }

  return (
    <>
      {loading ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            headerTitle={getPageType()}
            renderRight={() => {
              return (
                <div className="col-auto d-flex">
                  {/* {memberPermissions.some(
                    (item) =>
                      item === permissionIds.SUPER_ADMIN ||
                      item === permissionIds.REPORTING_MANAGER ||
                      item === permissionIds.CREATE_MANAGER
                  ) && ( */}
                  <Button
                    variant="primary"
                    onClick={() => {
                      setIsModal(true);
                      setEditData(null);
                    }}
                    className="btn btn-primary"
                  >
                    {buttonLoader.getDropDowns ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-1"
                      />
                    ) : (
                      <i className="icofont-plus-circle me-2 fs-6"></i>
                    )}
                    Add {getPageType()}
                  </Button>
                  {/* )} */}
                </div>
              );
            }}
          />

          <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-lg-2 py-1 pb-4">
            {BeetDetails.content ? (
              BeetDetails?.content?.map((Data, index) => (
                <div className="col" key={index}>
                  <div className="card teacher-card">
                    <div className="card-body d-flex">
                      <div className="profile-av pe-xl-4 pe-md-2 pe-sm-4 pe-4 text-center w220">
                        <div className="about-info d-flex align-items-center mt-1 justify-content-center flex-column">
                          <h6 className="mb-0 fw-bold d-block fs-6 mt-2">
                            {Data.beet}
                          </h6>
                          <div
                            className="btn-group mt-2 d-flex flex-column gap-2"
                            role="group"
                            aria-label="Basic outlined example"
                          >
                            <button
                              type="button"
                              onClick={() => handleIsOutletModal(Data)}
                              className="btn btn-outline-secondary text-info text-start d-flex gap-2 justify-content-start align-items-center"
                            >
                              <i className="icofont-info-circle text-info"></i>
                              {getPageType() === "Beats"
                                ? "Outlet"
                                : "Chemists"}
                            </button>

                            <div className="d-flex justify-content-center gap-3">
                              {/* Edit Button  */}

                              {(memberPermissions.some(
                                (item) => item == permissionIds.SUPER_ADMIN
                              ) ||
                                Cred.sub == userId) && (
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary text-success d-flex gap-2 justify-content-start align-items-center"
                                  onClick={() => {
                                    setIsModal(true);
                                    setEditData(Data);
                                  }}
                                >
                                  <i className="icofont-edit text-success"></i>
                                </button>
                              )}

                              {/* Delete Button */}

                              {memberPermissions.some(
                                (item) => item == permissionIds.SUPER_ADMIN
                              ) && (
                                <button
                                  type="button"
                                  onClick={() => handleisModalDelete(Data)}
                                  className="btn btn-outline-secondary text-danger d-flex gap-2 justify-content-start align-items-center"
                                >
                                  <i className="icofont-bin text-danger"></i>
                                </button>
                              )}
                            </div>

                            {getPageType() === "Routes" && (
                              <button
                                type="button"
                                onClick={() => {
                                  console.log("Doctor data beet:", Data);
                                  Dispatch(setSelectedBeet(Data.id))
                                  setIsDoctorModal(true);
                                  setDoctorBeetData(Data);
                                }}
                                className="btn btn-outline-secondary text-info text-start d-flex gap-2 justify-content-start align-items-center"
                              >
                                <i className="icofont-info-circle text-info"></i>
                                Doctors
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        className="teacher-info border-start ps-xl-4 ps-md-3 ps-sm-4 ps-4 w-100"
                        style={{ backgroundColor: "#dadada" }}
                      >
                        <div className="video-setting-icon pt-3">
                          <p>
                            Address:{" "}
                            <span className="fs-6 fw-bold">{Data.address}</span>
                          </p>
                        </div>
                        <div className="video-setting-icon mt-3 pt-3 border-top">
                          <p>
                            Postal Code:{" "}
                            <span className="fs-6 fw-bold">
                              {Data.postalCode}
                            </span>
                          </p>
                        </div>
                        {/* <div className="video-setting-icon mt-3 pt-3 border-top">
                          <p>
                            Client:{" "}
                            <span className="fs-6 fw-bold">
                              {Data.clientFmcgId ? (
                                ClientFMCG.find(item => item.id === Data.clientFmcgId)?.clientName
                              ) : "NA"}
                            </span>
                          </p>
                        </div> */}
                        <div className="video-setting-icon mt-3 pt-3 border-top">
                          <p>
                            Number of{" "}
                            {getPageType() === "Beats" ? "Outlets" : "Chemists"}
                            :{" "}
                            <span className="fs-6 fw-bold">
                              {Data.outlets?.length}
                            </span>
                          </p>
                        </div>
                        {getPageType() === "Routes" && (
                          <div className="video-setting-icon mt-3 pt-3 border-top">
                            <p>
                              Number of Doctors: 
                              <span className="fs-6 fw-bold">
                                {Data.doctorResList?.length}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="font-size: 18px; font-weight: bold;">
                No More {getPageType()} To Load.
              </p>
            )}
          </div>

            {/* Beet edit/add modal */}
          <Modal size="xl" centered show={isModal} onHide={handleIsModal}>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">
                {editData ? `Edit ${getPageType()}` : `Add ${getPageType()}`}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddUpdateModal
                editData={editData}
                handleIsModal={handleIsModal} 
                getPageType={getPageType}
              />
            </Modal.Body>
          </Modal>

          {/* Outlet Modal */}
          <Modal
            size="xl"
            centered
            show={isOutletModal}
            onHide={handleIsOutletModal}
          >
            <BeetOutlet
              getPageType={getPageType}
              outlets={outletData}
              beetId={beetId}
              clientFmcgId={clientFmcgId}
              handleOutletViewModal={() => setIsOutletModal(!isOutletModal)}
              handleGetUserLocation={handleGetUserLocation}
              locationError={locationError}
              longitude={longitude}
              latitude={latitude}
            />
          </Modal>

          {/* Doctor Modal */}
          <Modal
            size="xl"
            centered
            show={isDoctorModal}
            onHide={() => {
              Dispatch(resetSelectedBeet(null))
              setIsDoctorModal(false)}}
          >
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
              <div>
                <Doctors beetId={doctorBeetData} />
              </div>
            </Modal.Body>
          </Modal>

          {/* Beet Delete Modal */}
          <Modal show={isModalDelete} centered onHide={handleisModalDelete}>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">
                Delete {getPageType()}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="justify-content-center flex-column d-flex">
              <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
              <p className="mt-4 fs-5 text-center">
                You can only delete this {getPageType()} Permanently
              </p>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsModalDelete(false);
                }}
              >
                Cancel
              </button>
              <Button
                variant="primary"
                className="btn btn-danger color-fff"
                onClick={async () => {
                  try {
                    const resp = await deleteBeet(beetId, Cred.token);
                    if (resp >= 200 && resp < 300) {
                      setIsModalDelete(false);
                      Dispatch(deleteSingleBeet(beetId));
                      Swal.fire({
                        title: "Successfull",
                        text: "Delete Successfully",
                        icon: "success",
                        timer: 2000,
                      });
                    }
                  } catch (error) {
                    console.log("Error Deleting Beat/Route ::", error);
                    Swal.fire({
                      title: "Error",
                      text: "Something Went Wrong",
                      icon: "error",
                      timer: 2000,
                    });
                  }
                }}
              >
                {loading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                ) : (
                  "Delete"
                )}
              </Button>
            </Modal.Footer>
          </Modal>

          <div>
            <Toast show={showToast} onClose={() => setShowToast(false)}>
              <Toast.Header>
                <strong className="mr-auto">
                  No More {getPageType()} to load
                </strong>
              </Toast.Header>
            </Toast>
          </div>
        </div>
      )}{" "}
    </>
  );
}

export default Beet;
