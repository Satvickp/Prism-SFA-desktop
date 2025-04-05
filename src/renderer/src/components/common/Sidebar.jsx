import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import useMemberMenu from '../Data/MemberMenu'
import useMasterMenu from '../Data/MasterMenu'
import { MasterMenu } from '../Data/MasterMenu'
import { ClientFMCGMenu } from '../Data/ClientFMCGMenu'
import { constants, permissionIds } from '../../constants/constants'
import { useIsClient, useIsManager, useIsSuperAdmin } from '../../helper/isManager'
import useClientFMCGMemberMenu from '../Data/ClientFMCGMemberMenu'
import ProfileImg from '../../assets/images/profile_av.png'
import { Dropdown, Modal } from 'react-bootstrap'
import AssignPermission from '../../screens/Master/Assignpermission/MasterPermissionUpdate'
import { deleteCredentials } from '../../redux/features/credentialSlice'
import { deleteAllClients } from '../../redux/features/clientSlice'
import { deleteAllDropDownMembers } from '../../redux/features/dropdownMemberSlice'
import { deleteAllDropDowns } from '../../redux/features/dropdownClientSlice'
import { deleteAllExpenses } from '../../redux/features/expenseSlice'
import { deleteAllHoliday } from '../../redux/features/holidaySlice'
import { deleteAllLeaveRequests } from '../../redux/features/leaveRequestSlice'
import { deleteAllLeaves } from '../../redux/features/leavesSlice'
import { deleteAllMembers } from '../../redux/features/memberSlice'
import { deleteAllPrimarySale } from '../../redux/features/primarySalesSlice'
import { deleteAllProducts } from '../../redux/features/productsSlice'
import { deleteAllSecondarySales } from '../../redux/features/secondarySalesSlice'
import { deleteAllSchedules } from '../../redux/features/schedulesSlice'
import { deleteAllMemberPermissions } from '../../redux/features/permissionSlice'

function Sidebar(props) {
  const [isSidebarMini, setIsSidebarMini] = useState(false)
  const [menuData, setMenuData] = useState([])
  const [darkLightMode, setDarkLightMode] = useState('light')
  // const [updateRtl, setUpdateRtl] = useState(false);
  const { MemberMenu, MapMenu } = useMemberMenu()
  const navigate = useNavigate()
  const { MasterMenu } = useMasterMenu()

  const { CLIENT_TYPE, ClientFMCGMemberMenu, ClientFMCGSuperAdminMenu, ProductMemberMenu } =
    useClientFMCGMemberMenu()

  const isMember = window.localStorage.getItem('isMember')
  const isClientFmcg = window.localStorage.getItem(constants.clientType)
  const Permission = useSelector((state) => state.Permission.memberPermissions)
  const Cred = useSelector((state) => state.Cred)

  const [isModal, setIsModal] = useState(false)
  const [profileModal, setProfileModal] = useState(false)

  // const isManager = useIsManager();
  const isSuperAdmin = useIsSuperAdmin()
  const isClient = useIsClient()
  const history = useNavigate()
  const Dispatch = useDispatch()
  const handleIsModal = () => {
    setIsModal(!isModal)
  }

  useEffect(() => {
    if (isMember === 'false') {
      setMenuData([...ClientFMCGMenu])
    } else if (isMember === 'true' && isClientFmcg === 'CLIENT_FMCG') {
      if (isSuperAdmin) {
        setMenuData([...MasterMenu, ...ClientFMCGSuperAdminMenu])
      } else {
        setMenuData([...ProductMemberMenu, ...ClientFMCGMemberMenu])
      }
    } else if (isMember === 'true' && isClientFmcg !== 'CLIENT_FMCG') {
      if (isSuperAdmin) {
        setMenuData([...MasterMenu, ...MemberMenu])
      } else {
        setMenuData([...ProductMemberMenu, ...MemberMenu])
      }
    }
    document.documentElement.setAttribute('data-theme', 'light')
  }, [isMember, Permission])

  function openChildren(id) {
    const otherTabs = document.getElementsByClassName('has-children')
    Array.from(otherTabs).forEach((tab) => {
      if (tab.id !== id) {
        tab.classList.remove('show')
        if (tab.parentElement.children.length > 1) {
          tab.parentElement.children[0].setAttribute('aria-expanded', 'false')
        }
      }
    })

    const menutab = document.getElementById(id)
    if (menutab) {
      if (menutab.classList.contains('show')) {
        menutab.classList.remove('show')
        menutab.parentElement.children[0]?.setAttribute('aria-expanded', 'false')
      } else {
        menutab.classList.add('show')
        menutab.parentElement.children[0]?.setAttribute('aria-expanded', 'true')
      }
    }
  }

  function openChildren1(id) {
    const otherTabs = document.getElementsByClassName('has-children')
    Array.from(otherTabs).forEach((tab) => tab.classList.remove('show'))

    const menutab = document.getElementById(id)
    if (menutab) {
      menutab.classList.add('show')
      menutab.parentElement.children[0]?.setAttribute('aria-expanded', 'true')
    }
  }

  function GotoChangeMenu(val) {
    if (val === 'UI Components') {
      history.push('ui-alerts')
      setMenuData([...ClientFMCGMenu])
    } else {
      history.push('hr-dashboard')
      setMenuData([...MasterMenu])
    }
  }

  function onChangeDarkMode() {
    const theme = document.documentElement.getAttribute('data-theme')
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'dark')
      setDarkLightMode('dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      setDarkLightMode('light')
    }
  }

  const { activekey } = props

  return (
    <div
      id="mainSideMenu"
      className={`sidebar px-4 py-4 py-md-5 me-0 ${isSidebarMini ? 'sidebar-mini' : ''}`}
      // style={{position: "absolute", zIndex: 30 }}
    >
      <div className="d-flex flex-column h-100">
        <div className="mb-0 brand-icon">
          <Dropdown
            className="dropdown user-profile ms-2 ms-sm-3 d-flex align-items-center"
            style={{ position: 'relative', zIndex: 12 }}
          >
            <Dropdown.Toggle
              as="a"
              className="nav-link dropdown-toggle pulse p-0 me-2"
              onClick={() => setProfileModal(!profileModal)}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 12
                }}
              >
                <span className="logo-icon">
                  {Cred.uploadFileKey ? (
                    <img
                      style={{
                        cursor: 'pointer'
                      }}
                      className="avatar lg rounded-circle img-thumbnail"
                      src={`https://prismsfa-bucket.s3.ap-south-1.amazonaws.com/${Cred.uploadFileKey}`}
                      alt="profile"
                    />
                  ) : (
                    <img
                      style={{
                        cursor: 'pointer'
                      }}
                      className="avatar lg rounded-circle img-thumbnail"
                      src={ProfileImg}
                      alt="profile"
                    />
                  )}
                </span>

                <span className="logo-text" style={{ display: isSidebarMini ? 'none' : 'block' }}>
                  <div className="u-info me-2">
                    <p className="mb-0 text-start line-height-sm">
                      {Cred?.firstName ? (
                        <span className="d-flex gap-1 flex-wrap">
                          {Cred.firstName.includes(' ') ? (
                            Cred.firstName.split(' ').map((item, index) => (
                              <span key={index} className="fw-bold text-wrap mb-1">
                                {item}
                              </span>
                            ))
                          ) : (
                            <span className="fw-bold text-wrap mb-1">{Cred.firstName}</span>
                          )}
                          <span className="fw-bold text-wrap">{Cred?.lastName || ''}</span>
                        </span>
                      ) : (
                        <span className="fw-bold">
                          {(Cred?.clientFirstName || '') + ' ' + (Cred?.clientLastName || '')}
                        </span>
                      )}

                      {Cred?.topUpBalance && isClient && (
                        <div className="fw-bold text-start my-1">
                          ₹ <span className="text-success">{Cred.topUpBalance.toFixed(2)}</span>
                        </div>
                      )}
                    </p>

                    {Cred?.firstName && (
                      <small style={{ fontWeight: 'normal', fontSize: '12px' }}>Profile</small>
                    )}
                  </div>
                </span>
              </div>
            </Dropdown.Toggle>
            {/* <Dropdown.Menu
              className="rounded-lg shadow border-0 dropdown-animation dropdown-menu-end p-0 m-0"
            >
              
            </Dropdown.Menu> */}
          </Dropdown>

          {/* <span className="logo-text">{constants.website_name}</span> */}
        </div>

        {!isClient && (
          <div className="d-flex">
            <button
              className="btn btn-warning mx-1 mt-3"
              style={{ width: '95%' }}
              onClick={handleIsModal}
            >
              My Permissions
            </button>
          </div>
        )}

        <ul className="menu-list flex-grow-1 mt-3">
          {menuData.map((d, i) => (
            <li key={i} className="collapsed">
              {d?.children?.length > 0 ? (
                <>
                  <a
                    className={`m-link ${
                      d?.children?.some((child) => `/${child?.routerLink[0]}` === activekey)
                        ? 'active'
                        : ''
                    }`}
                    href="#!"
                    onClick={(e) => {
                      e.preventDefault()
                      openChildren(`menu-Pages${i}`)
                    }}
                  >
                    <i className={d.iconClass}></i>
                    <span>{d?.name}</span>
                    <span className="arrow icofont-dotted-down ms-auto text-end fs-5"></span>
                  </a>
                  <ul className="sub-menu collapse has-children" id={`menu-Pages${i}`}>
                    {d?.children.map((child, ind) => {
                      return (
                        <li key={ind}>
                          {child?.state ? (
                            <span
                              className={`ms-link ${
                                activekey === `/${child?.routerLink[0]}` ? 'active' : ''
                              }`}
                              onClick={() =>
                                navigate(child?.routerLink[0], {
                                  state: child?.state
                                })
                              }
                            >
                              {child?.name}
                            </span>
                          ) : (
                            <Link
                              className={`ms-link ${
                                activekey === `/${child?.routerLink[0]}` ? 'active' : ''
                              }`}
                              to={child?.state ? '' : `/${child?.routerLink[0]}`}
                            >
                              {child?.name}
                            </Link>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </>
              ) : (
                <Link
                  to={`/${d?.routerLink[0]}`}
                  className={`m-link ${activekey === `/${d?.routerLink[0]}` ? 'active' : ''}`}
                >
                  <i className={d?.iconClass}></i>
                  <span>{d?.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="btn btn-link sidebar-mini-btn text-light"
          onClick={() => setIsSidebarMini(!isSidebarMini)}
        >
          <span className="ms-2">
            <i className="icofont-bubble-right"></i>
          </span>
        </button>
      </div>

      <Modal
        show={isModal}
        top
        size="lg"
        onHide={() => {
          handleIsModal()
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">My Permission</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="table-responsive">
            <AssignPermission isViewPurpose={false} />
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={profileModal}
        top
        size="md"
        onHide={() => {
          setProfileModal(false)
        }}
      >
        <Modal.Body>
          <div className="table-responsive">
            <div
              className="card border-0"
              // style={{position: "absolute", zIndex: 999999, order: 1}}
            >
              <div className="card-body pb-0">
                <div className="d-flex py-1">
                  {Cred.uploadFileKey ? (
                    <img
                      className="avatar rounded-circle"
                      src={`https://prismsfa-bucket.s3.ap-south-1.amazonaws.com/${Cred.uploadFileKey}`}
                      alt="profile"
                    />
                  ) : (
                    <img className="avatar rounded-circle" src={ProfileImg} alt="profile" />
                  )}
                  <div className="flex-fill ms-3">
                    <p className="mb-0">
                      {Cred.firstName ? (
                        <span className="font-weight-bold">
                          {Cred.firstName + ' ' + Cred.lastName}
                        </span>
                      ) : (
                        <span className="font-weight-bold">
                          {Cred.clientFirstName + ' ' + Cred.clientLastName}
                        </span>
                      )}
                    </p>
                    <small className="">{Cred.email}</small>
                  </div>
                </div>

                <div>
                  <hr className="dropdown-divider border-dark" />
                </div>
              </div>
              <div className="list-group m-2 ">
                {Cred.topUpBalance && (
                  <div className="list-group-item list-group-item-action border-0 ">
                    <i class="icofont-rupee fs-5 me-3 "></i>
                    <span className="text-success font-weight-bold fs-5">
                      {Cred.topUpBalance?.toFixed(2)}
                    </span>
                  </div>
                )}
                <Link
                  to={Cred.firstName ? 'member-profile' : 'client-profile'}
                  className="list-group-item list-group-item-action border-0 "
                >
                  <i className="icofont-user fs-5 me-3"></i>View Profile
                </Link>
                {Cred.employeeId && (
                  <>
                    <Link
                      to={`members-scheduler/${Cred.sub}`}
                      className="list-group-item list-group-item-action border-0 "
                    >
                      <i className="icofont-tasks fs-5 me-3"></i>Schedules
                    </Link>
                    <Link
                      to={`/member/${Cred.sub}`}
                      className="list-group-item list-group-item-action border-0 "
                    >
                      <i className="icofont-ui-user-group fs-5 me-3"></i>
                      Members
                    </Link>
                  </>
                )}
                <div
                  style={{
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    Dispatch(deleteCredentials())
                    Dispatch(deleteAllClients())
                    Dispatch(deleteAllDropDownMembers())
                    Dispatch(deleteAllDropDowns())
                    Dispatch(deleteAllExpenses())
                    Dispatch(deleteAllHoliday())
                    Dispatch(deleteAllLeaveRequests())
                    Dispatch(deleteAllLeaves())
                    Dispatch(deleteAllMembers())
                    Dispatch(deleteAllPrimarySale())
                    Dispatch(deleteAllProducts())
                    Dispatch(deleteAllSecondarySales())
                    Dispatch(deleteAllSchedules())
                    Dispatch(deleteAllMemberPermissions())
                    history('/')
                    window.localStorage.removeItem(constants.token_store)
                    window.localStorage.removeItem(constants.base_url)
                    window.localStorage.removeItem(constants.clientType)
                    window.localStorage.removeItem(constants.tenant_Id)
                    window.localStorage.removeItem('isMember')
                    window.localStorage.removeItem('primary-sale-draft')
                    window.localStorage.removeItem('secondary-sale-draft')
                    window.location.reload()
                  }}
                  className="list-group-item list-group-item-action border-0 "
                >
                  <i className="icofont-logout fs-6 me-3"></i>Signout
                </div>
                <div>
                  <hr className="dropdown-divider border-dark" />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setProfileModal(false)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Sidebar
