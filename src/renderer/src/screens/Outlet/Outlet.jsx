import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner, Toast } from "react-bootstrap";
import PageHeader from "../../components/common/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { permissionIds } from "../../constants/constants";
import Loading from "../../components/UI/Loading";
import Swal from "sweetalert2";
// import AddUpdateModal from "../Form/AddUpdateModal";
// import BeetOutlet from "./BeetOutlet";
// import { useBeetApiHook } from "../../hooks/beetHook";
import {
  getAllClients,
  getAllClientsByReportingManager,
} from "../../api/clients/clients-api";
import { setClientsFMCG } from "../../redux/features/clientFMCGSlice";
import { useOutletHook } from "../../hooks/outletHook";
import DataTable from "react-data-table-component";
import { customStyles } from "../../constants/customStyles";
import { useParams } from "react-router-dom";
function Outlets() {
  //Redux
  const Dispatch = useDispatch();
  const { userId } = useParams();
  const BeetDetails = useSelector((state) => state.Beets);
  const allOutlets = useSelector((state) => state.Outlets.allOutlets);
  const Cred = useSelector((state) => state.Cred);
  const Client = useSelector((state) => state.ClientFMCG);
  const { memberPermissions } = useSelector((state) => state.Permission);

  // UI Manipulation Variables
  const [isModal, setIsModal] = useState(false);
  const [isOutletModal, setIsOutletModal] = useState(false);
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
  const [size, setSize] = useState(500);
  //Get All Beets details when Page is Loaded
  //   const { GetAllBeets } = useBeetApiHook(page, size);
  const { addOutlet, deleteOutlet, getAllOutlets, updateOutlet } =
    useOutletHook();

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

  useEffect(() => {
    if (allOutlets?.content?.length <= 0) {
      getAllOutlets();
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
    console.log(data);
  }
  function handleisModalDelete() {
    setIsModalDelete(!isModalDelete);
  }

  function handleGetUserLocation() {
    if (latitude && longitude) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Latitude:", position.coords.latitude);
          console.log("Longitude:", position.coords.longitude);
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
    return CLIENT_TYPE === "CLIENT_FMCG" ? "Outlets" : "Chemist";
  }

  function getBeatType() {
    return CLIENT_TYPE === "CLIENT_FMCG" ? "Beat" : "Route";
  }

  let isShowStockistLevel =
    getBeatType() === "CLIENT_FMCG"
      ? [
          {
            name: <span className="text-wrap">SALES LEVEL</span>,
            selector: (row) => (
              <span className={"text-wrap"}>
                {row.salesLevel ? row.salesLevel : "NA"}
              </span>
            ),
            sortable: true,
            width: "120px",
          },
        ]
      : [];

  var columnsT = "";

  columnsT = [
    {
      // name: "STOCKIST(₹)",
      name: (
        <span className="text-wrap">{getBeatType().toUpperCase()} NAME</span>
      ),
      selector: (row) => (
        <span className={"text-wrap"}>
          {row?.dcrDto?.beet ? row?.dcrDto?.beet : "NA"}
        </span>
      ),
      sortable: true,
      width: "130px",
    },
    {
      name: (
        <span className="text-wrap">{getPageType().toUpperCase()} NAME</span>
      ),
      selector: (row) => (
        <span className={"text-wrap"}>
          {row.outletName ? row.outletName : "NA"}
        </span>
      ),
      sortable: true,
      width: "180px",
    },
    {
      // name: "SKU",
      name: (
        <span className="text-wrap">{getPageType().toUpperCase()} TYPE</span>
      ),
      selector: (row) => (
        <span className={"text-wrap"}>
          {row.outletType ? row.outletType : "NA"}
        </span>
      ),
      sortable: true,
      width: "120px",
    },
    {
      // name: "UNIT",
      name: (
        <span className="text-wrap">{getPageType().toUpperCase()} ADDRESS</span>
      ),
      selector: (row) => (
        <span className={"text-wrap"}>
          {row.actualAddress ? row.actualAddress : "NA"}
        </span>
      ),
      sortable: true,
    },
    {
      // name: "BUNDLE",
      name: <span className="text-wrap">OWNER NAME</span>,
      selector: (row) => (
        <span className={"text-wrap"}>
          {row.ownerName ? row.ownerName : "NA"}
        </span>
      ),
      sortable: true,
      width: "120px",
    },
    {
      // name: "GST(%)",
      name: <span className="text-wrap">MOBILE NUMBER</span>,
      selector: (row) => (
        <span className={"text-wrap"}>{row.mobile ? row.mobile : "NA"}</span>
      ),
      sortable: true,
      width: "120px",
    },
    ...isShowStockistLevel,
  ];

  return (
    <>
      {loading ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            headerTitle={getPageType()}
            // renderRight={() => {
            //   return (
            //     <div className="col-auto d-flex">
            //       {memberPermissions.some(
            //         (item) =>
            //           item === permissionIds.SUPER_ADMIN ||
            //           item === permissionIds.REPORTING_MANAGER ||
            //           item === permissionIds.CREATE_MANAGER
            //       ) && (
            //         <Button
            //           variant="primary"
            //           onClick={() => {
            //             setIsModal(true);
            //             console.log("Add Beet");
            //           }}
            //           className="btn btn-primary"
            //         >
            //           {buttonLoader.getDropDowns ? (
            //             <Spinner
            //               as="span"
            //               animation="border"
            //               size="sm"
            //               role="status"
            //               aria-hidden="true"
            //               className="me-1"
            //             />
            //           ) : (
            //             <i className="icofont-plus-circle me-2 fs-6"></i>
            //           )}
            //           Add {getPageType()}
            //         </Button>
            //       )}
            //     </div>
            //   );
            // }}
          />

          <div className=" g-3 py-1 pb-4">
            {allOutlets.length > 0 ? (
              <DataTable
                columns={columnsT}
                title={"Outlet Details"}
                data={allOutlets}
                defaultSortField="title"
                pagination
                selectableRows={false}
                // className="table myDataTable table-hover align-middle mb-0 d-row dataTable no-footer dtr-inline" // Removed "nowrap"
                highlightOnHover={true}
                dense
                customStyles={customStyles}
              />
            ) : (
              <p className="font-size: 18px; font-weight: bold;">
                No More {getPageType()} To Load.
              </p>
            )}
          </div>

          <Modal size="xl" centered show={isModal} onHide={handleIsModal}>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">
                {editData ? `Edit ${getPageType()}` : `Add ${getPageType()}`}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* <AddUpdateModal
                editData={null}
                handleIsModal={handleIsModal}
                getPageType={getPageType}
              /> */}
            </Modal.Body>
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

export default Outlets;
