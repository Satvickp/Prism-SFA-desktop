import React, { useState } from "react";
import { Dropdown, Modal } from "react-bootstrap";
// import ProfileImg from "../../assets/images/profile_av.png";
import { Link, useNavigate } from "react-router-dom";
import { constants } from "../../constants/constants";
import AddNewUserModal from "./AddNewUserModal";
import { useDispatch, useSelector } from "react-redux";
// import searchPages from "../Data/searchPages.json";

import { deleteCredentials } from "../../redux/features/credentialSlice";
import { deleteAllClients } from "../../redux/features/clientSlice";
import { deleteAllDropDownMembers } from "../../redux/features/dropdownMemberSlice";
import { deleteAllDropDowns } from "../../redux/features/dropdownClientSlice";
import { deleteAllExpenses } from "../../redux/features/expenseSlice";
import { deleteAllHoliday } from "../../redux/features/holidaySlice";
import { deleteAllLeaveRequests } from "../../redux/features/leaveRequestSlice";
import { deleteAllLeaves } from "../../redux/features/leavesSlice";
import { deleteAllMembers } from "../../redux/features/memberSlice";
import { deleteAllPrimarySale } from "../../redux/features/primarySalesSlice";
import { deleteAllProducts } from "../../redux/features/productsSlice";
import { deleteAllSecondarySales } from "../../redux/features/secondarySalesSlice";
import { deleteAllSchedules } from "../../redux/features/schedulesSlice";
import { deleteAllMemberPermissions } from "../../redux/features/permissionSlice";
import { useIsClient } from "../../helper/isManager";
import AssignPermission from "../../screens/Master/Assignpermission/MasterPermissionUpdate";

function Header() {
  const [isAddUserModa, setIsAddUserModa] = useState(false);
  const Cred = useSelector((state) => state.Cred);
  const { memberPermissions } = useSelector((state) => state.Permission);
  // const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedPage, setSelectedpage] = useState("");
  // const isClient = useIsClient();
  const Dispatch = useDispatch();
  const history = useNavigate();
  const [isModal, setIsModal] = useState(false);
  // const handleIsModal = () => {
  //   setIsModal(!isModal);
  // };
  // const toggleDropdownSearch = () => {
  //   setIsSearchOpen(!isSearchOpen);
  // };
  const onChange = (e) => {
    setSelectedpage(e.target.value);
  };
  // const onSearch = (searchTerm) => {
  //   setIsSearchOpen(false);

  //   setSelectedpage("");
  // };

  return (
    <div className="header">
      <nav className="navbar py-1">
        <div className="container-xxl">
          <div className="h-right d-flex align-items-center order-1">
            {/* {!isClient && (
              <div className="d-flex">
                <button className="btn btn-primary" onClick={handleIsModal}>
                  My Permissions
                </button>
              </div>
            )} */}
            <Dropdown className="dropdown user-profile ms-2 ms-sm-3 d-flex align-items-center">
              <Dropdown.Toggle
                as="a"
                className="nav-link dropdown-toggle pulse p-0"
              >
              </Dropdown.Toggle>
              <Dropdown.Menu className="rounded-lg shadow border-0 dropdown-animation dropdown-menu-end p-0 m-0">
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <button
            className="navbar-toggler p-0 pt-3 border-0 menu-toggle order-3"
            onClick={() => {
              var side = document.getElementById("mainSideMenu");
              if (side) {
                if (side.classList.contains("open")) {
                  side.classList.remove("open");
                } else {
                  side.classList.add("open");
                }
              }
            }}
            // style={{display: document.getElementById("mainSideMenu") ? "none": "block"}}
          >
            <span className="fa fa-bars"></span>
          </button>
          <div className="order-0 col-lg-4 col-md-4 col-sm-12 col-12 mb-3 mb-md-0 ">
            <div className="input-group flex-nowrap input-group-lg">
              {/* <Dropdown show={isSearchOpen} className="d-inline-flex m-1">
                <Dropdown.Toggle as="a" variant="" id="dropdown-basic">
                  <input
                    type="text"
                    value={selectedPage}
                    className="form-control"
                    id="dropdown-basic"
                    onChange={onChange}
                    onClick={toggleDropdownSearch}
                    placeholder="Search"
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu
                  as="ul"
                  className="border-0 shadow bg-light-dark"
                >
                  {/* {searchPages
                    .filter((item) => {
                      const searchedPage = selectedPage.toLocaleLowerCase();
                      const pageName = item.name.toLocaleLowerCase();
                      return pageName.startsWith(
                        searchedPage.toLocaleLowerCase()
                      );
                    })
                    .map((e) => (
                      <ul style={{ listStyleType: "none" }}>
                        <li onClick={() => onSearch(e.name)}>
                          <Link to={process.env.PUBLIC_URL + e.routerLink}>
                            {e.name}
                          </Link>
                        </li>
                      </ul>
                    ))} */}

              {/* <ul style={{ listStyleType: "none" }}>
                    {searchPages
                      .filter((item) => {
                        const searchedPage = selectedPage.toLowerCase();
                        const pageName = item.name.toLowerCase();
                        return pageName.startsWith(searchedPage);
                      })
                      .map((e, index) => (
                        <li key={index} onClick={() => onSearch(e.name)}>
                          <Link to={process.env.PUBLIC_URL + e.routerLink}>
                            {e.name}
                          </Link>
                        </li>
                      ))}
                  </ul> */}
              {/* </Dropdown.Menu> */}
              {/* </Dropdown> */}
              {/* 
              <button
                type="button"
                className="input-group-text add-member-top"
                onClick={() => {
                  setIsAddUserModa(true);
                }}
              >
                <i className="fa fa-info"></i>
              </button> */}

              {/* <Modal
                show={isModal}
                top
                size="lg"
                onHide={() => {
                  handleIsModal();
                }}
              >
                <Modal.Header closeButton>
                  <Modal.Title className="fw-bold">My Permission</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  <div className="table-responsive">
                    <AssignPermission isViewPurpose={false}/>
                  </div>
                </Modal.Body>
              </Modal> */}
            </div>
          </div>
        </div>
      </nav>
      <AddNewUserModal
        show={isAddUserModa}
        onClose={() => {
          setIsAddUserModa(false);
        }}
      />
    </div>
  );
}

export default Header;
