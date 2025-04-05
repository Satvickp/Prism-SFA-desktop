import React, { useEffect, useRef, useState } from 'react'
import { Button, Fade, Modal, Spinner } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import PageHeader from '../../components/common/PageHeader'
import { useDispatch, useSelector } from 'react-redux'
import { permissionIds } from '../../constants/constants'

import {
  getAllExpense,
  createExpense,
  getExpenseType,
  getAllExpenseByReportingManagerId,
  getAllExpenseByMemberId,
  updateExpense
} from '../../api/expense/expense-api'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import {
  setExpenses,
  addExpenses,
  deleteExpenses,
  updateExpenses,
  deleteAllExpenses,
  concatExpenses,
  setAllMyExpense,
  addMyExpense
} from '../../redux/features/expenseSlice'

import { setAllExpenseTypes } from '../../redux/features/dropdownFieldSlice'

import { getAllMemberProjection } from '../../api/member/member-api'
import Loading from '../../components/UI/Loading'
import Swal from 'sweetalert2'
import { getIDSFromExpense, mergeEmployeeNames } from '../../helper/array-sort'
import { useMemberHook } from '../../hooks/memberHook'
import ExpenseTable from './ExpenseTable'

function Expenses() {
  const [isModal, setIsModal] = useState(false)
  const [isEditModalData, setIsEditModalData] = useState(null)
  const { memberPermissions } = useSelector((state) => state.Permission)
  const [loading, setLoading] = useState(false)
  const [actionExpense, setActionOnExpense] = useState(false)
  const [remark, setRemark] = useState('')
  const [approvedAmount, setApproveAmount] = useState(null)
  const [addLoader, setAddLoader] = useState(false)
  const [isDeleteModal, setIsDeleteModal] = useState(false)
  const [isEditModal, setIsEditModal] = useState(false)
  const [page, setPage] = useState(0)
  const [expenseData, setExpenseData] = useState([])

  const [key, setKey] = useState('self')
  const [imagePreview, setImagePreview] = useState(null)
  const dispatch = useDispatch()
  const Cred = useSelector((state) => state.Cred)
  const allExpenses = useSelector((state) => state.Expenses)
  const DropDownsField = useSelector((state) => state.DropDownsField)
  const Member = useSelector((state) => state.Member)
  const SelectedExpense = useRef({})

  //hook
  // const { isError, isLoading, get, getMembersArrayByArrayIds } =
  //   useMemberHook();
  // const allMemberArray = getMembersArrayByArrayIds();

  const { get } = useMemberHook()
  useEffect(() => {
    get()
  }, [])

  const acceptExpense = async (row) => {
    if (!remark) {
      setIsEditModal(false)
      Swal.fire('Reason ?', 'Please Enter Remark').finally(() => setIsEditModal(true))
      return
    }
    setActionOnExpense(true)
    try {
      const resp = await updateExpense(Cred.token, row?.id, {
        ...row,
        expenseStatus: 'ACCEPTED',
        remark: remark,
        approvedAmount: approvedAmount
      })
      dispatch(
        updateExpenses({
          ...row,
          expenseStatus: 'ACCEPTED',
          remark: remark,
          approvedAmount: approvedAmount
        })
      )
      SelectedExpense.current = {}
      setRemark('')
      setApproveAmount(null)
    } catch (error) {
      Swal.fire('Error', "Something Went Wrong Can't Accept Expense")
    }
    setActionOnExpense(false)
    setIsEditModal(false)
  }

  const rejectExpense = async (row) => {
    if (!remark) {
      setIsDeleteModal(false)
      Swal.fire('Reason ?', 'Please Enter Remark').finally(() => setIsDeleteModal(true))
      return
    }
    setActionOnExpense(true)
    try {
      const resp = await updateExpense(Cred.token, row?.id, {
        ...row,
        expenseStatus: 'REJECTED',
        remark: remark
      })
      dispatch(updateExpenses(resp))
    } catch (error) {
      Swal.fire('Error', "Something Went Wrong Can't Accept Expense")
    }
    setActionOnExpense(false)
    setIsDeleteModal(false)
  }

  const getExpense = async () => {
    setLoading(true)

    try {
      if (allExpenses.allExpenses.length <= 0) {
        const resp = memberPermissions.some((item) => item === permissionIds.SUPER_ADMIN)
          ? await getAllExpense(Cred.token, page, Cred.sub)
          : await getAllExpenseByReportingManagerId(Cred.token, page, Cred.sub)
        dispatch(
          setExpenses({
            allExpenses: resp.data,
            paginationData: resp.paginationData
          })
        )
        setExpenseData(resp.data)

        const MyExpense = await getAllExpenseByMemberId(Cred.token, page, Cred.sub)
        dispatch(setAllMyExpense(MyExpense.data))
        // console.log(MyExpense.data);
      }
    } catch (error) {
      console.log(error)
      Swal.fire({
        title: 'Something went wrong!',
        text: "Can't Fetch Expenses. Please try After Some Time",
        icon: 'error'
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    // get();
    getExpense()
  }, [])

  const handlePageChange = async (NextPage) => {
    try {
      if (allExpenses.allExpenses.length >= allExpenses.paginationData.totalElements) return
      setPage((prev) => prev + 1)
      const resp = await getAllExpense(Cred.token, page, Cred.sub)
      setExpenseData(resp.data)
      dispatch(
        concatExpenses({
          allExpenses: resp.data,
          paginationData: resp.paginationData
        })
      )
    } catch (error) {
      Swal.fire('Something Went Wrong', "Can't Fetch More Data")
      console.log('Error fetching Paginated expense ::', error)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        Swal.fire('Error', 'File size exceeds 2MB', 'error')
        return
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        Swal.fire('Error', 'Only JPEG or PNG files are allowed', 'error')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        // setValue("imageUrl", reader.result);
      }
      reader.readAsDataURL(file)
    }
  }

  const isBase64Image = (imagePreview) => {
    const base64Regex = /^data:image\/[a-zA-Z]+;base64,[^\s]+$/
    return base64Regex.test(imagePreview) ? imagePreview.split(',')[1] : ''
  }

  return (
    <>
      {loading ? (
        <Loading animation={'border'} color={'black'} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            headerTitle="Expenses"
            renderRight={() => {
              return (
                <div className="col-auto d-flex w-sm-100">
                  {memberPermissions.some(
                    (item) =>
                      item == permissionIds.SUPER_ADMIN ||
                      item == permissionIds.REPORTING_MANAGER ||
                      item == permissionIds.CREATE_MANAGER
                  ) && (
                    <button
                      className="btn btn-dark btn-set-task w-sm-100"
                      onClick={async () => {
                        setIsModal(true)
                        if (DropDownsField.allExpenseTypes <= 0) {
                          try {
                            // const resp = await getExpenseType(Cred.token);
                            // dispatch(setAllExpenseTypes(resp));
                          } catch (error) {
                            setIsModal(false)
                            Swal.fire('Error', "Can't Fetch Expense Type", 'error')
                          }
                        }
                      }}
                    >
                      <i className="icofont-plus-circle me-2 fs-6"></i>Add My Expense
                    </button>
                  )}
                </div>
              )
            }}
          />
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
              >
                <Tab eventKey="self" title="My Expense">
                  {allExpenses.allMyExpenses.length <= 0 ? (
                    <h1>No expense to show</h1>
                  ) : (
                    <ExpenseTable
                      // allMemberArray={allMemberArray}
                      data={expenseData}
                      SelectedExpense={SelectedExpense}
                      setIsEditModal={setIsEditModal}
                      setIsDeleteModal={setIsDeleteModal}
                      handlePageChange={handlePageChange}
                      expenseData={expenseData}
                      isMemberExpense={false}
                    />
                  )}
                </Tab>
                {Member.allMembers.length > 0 && (
                  <Tab eventKey="member" title="Member Expense">
                    {allExpenses.allExpenses.length <= 0 ? (
                      <h1>No expense to show</h1>
                    ) : (
                      <ExpenseTable
                        // allMemberArray={allMemberArray}
                        data={expenseData}
                        SelectedExpense={SelectedExpense}
                        setIsEditModal={setIsEditModal}
                        setIsDeleteModal={setIsDeleteModal}
                        handlePageChange={handlePageChange}
                        expenseData={expenseData}
                        isMemberExpense={true}
                      />
                    )}
                  </Tab>
                )}
              </Tabs>
            </div>
          </div>

          <Modal
            centered
            show={isModal}
            onHide={() => {
              setIsModal(false)
              setIsEditModalData('')
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">
                {isEditModalData ? `Edit ` : 'Add '} My Expenses
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label htmlFor="item" className="form-label">
                  Spent At
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Spent At"
                  id="item"
                  onChange={(e) => {
                    setIsEditModalData({
                      ...isEditModalData,
                      spentAt: e.target.value
                    })
                  }}
                  value={isEditModalData ? isEditModalData.spentAt : ''}
                />
              </div>
              <div className="deadline-form">
                <form>
                  <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <label htmlFor="abc" className="form-label">
                        Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="abc"
                        placeholder="Date"
                        onChange={(e) => {
                          setIsEditModalData({
                            ...isEditModalData,
                            date: e.target.value
                          })
                        }}
                        value={isEditModalData ? isEditModalData.date : ''}
                      />
                    </div>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <label htmlFor="deptwo" className="form-label">
                        Amount
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="deptwo"
                        placeholder="Amount (Number)"
                        onChange={(e) => {
                          const inputValue = e.target.value

                          // Check if inputValue is a valid number
                          if (!isNaN(inputValue)) {
                            setIsEditModalData({
                              ...isEditModalData,
                              amount: inputValue
                            })
                          } else {
                            // Show alert if inputValue is not a number
                            setIsModal(false)
                            Swal.fire('Wrong Entry', 'Please Enter Number Only', 'warning').finally(
                              (e) => setIsModal(true)
                            )
                          }
                        }}
                        value={isEditModalData ? isEditModalData.amount : ''}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="depthree" className="form-label">
                        Expense Type
                      </label>
                      <select
                        className="form-select"
                        value={isEditModalData ? isEditModalData.expenseType : ''}
                        onChange={(e) => {
                          const selectedValue = e.target.value
                          setIsEditModalData({
                            ...isEditModalData,
                            expenseType: selectedValue
                          })
                        }}
                      >
                        <option value="">Select a Expense Type</option>
                        <option value={0}>Travel Allowance</option>
                        <option value={1}>Meal Expenses</option>
                        <option value={2}>Accommodation</option>
                        <option value={3}>Fuel Expenses</option>
                        <option value={4}>Client Entertainment</option>
                        <option value={5}>Stationery</option>
                        <option value={6}>Parking Fees</option>
                        <option value={7}>Toll Charges</option>
                        <option value={8}>Internet/Mobile Bill</option>
                        <option value={9}>Miscellaneous</option>

                        {/* {[].map((value, i) => {
                          return (
                            <option value={value.id} key={value.id}>
                              {value.name}
                            </option>
                          );
                        })} */}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="image" className="form-label">
                        Bill Image
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="image"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                              width: '100px',
                              height: '100px',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                      )}
                      {/* <p className="text-danger">{errors.imageUrl?.message}</p> */}
                    </div>
                  </div>
                </form>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsModal(false)
                  // setIsEditModalData({});
                }}
              >
                Done
              </button>
              <button
                onClick={async () => {
                  if (
                    !isEditModalData.spentAt ||
                    !isEditModalData.amount ||
                    !isEditModalData.expenseType ||
                    !isEditModalData.date
                  ) {
                    setIsModal(false)
                    Swal.fire('Incomplete', 'Please Fill The Form', 'warning').finally(() =>
                      setIsModal(true)
                    )
                    return
                  }
                  setAddLoader(true)

                  try {
                    if ('geolocation' in navigator) {
                      const position = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(
                          (position) => resolve(position),
                          (error) => reject(error),
                          {
                            enableHighAccuracy: true,
                            timeout: 15000,
                            maximumAge: 10000
                          }
                        )
                      })

                      const { latitude, longitude } = position.coords
                      const commonData = {
                        ...isEditModalData,
                        employeeId: Cred.sub,
                        approvedBy: Cred.reportingManager ? Cred.reportingManager : Cred.sub,
                        location: {
                          latitude,
                          longitude
                        },
                        status: 0,
                        remark: '',
                        amount: Number(isEditModalData.amount),
                        expenseType: Number(isEditModalData.expenseType),
                        imageBase64Url: isBase64Image(imagePreview)
                      }

                      console.log(commonData)
                      const resp = await createExpense(Cred.token, commonData)

                      if (Cred.reportingManager != Cred.sub) {
                        setAddLoader(false)
                        setIsModal(false)
                        Swal.fire('Successfully', 'Expense Added', 'success')
                        dispatch(
                          addMyExpense({
                            ...resp,
                            employeeName: `${resp.firstName} ${resp.lastName}`
                          })
                        )
                      } else {
                        Swal.fire('Successfully', 'Expense Added', 'success')
                        dispatch(
                          addMyExpense({
                            ...resp,
                            employeeName: `${resp.firstName} ${resp.lastName}`
                          })
                        )
                      }
                    } else {
                      setIsModal(false)

                      if ('permissions' in navigator && navigator.permissions.query) {
                        const { state } = await navigator.permissions.query({
                          name: 'geolocation'
                        })

                        if (state === 'denied') {
                          Swal.fire({
                            icon: 'error',
                            title: 'Location Access Denied',
                            text: 'Please allow location access.'
                          })
                        }
                      } else {
                        Swal.fire({
                          icon: 'error',
                          title: 'Geolocation Not Supported',
                          text: 'Geolocation is not supported by your browser.'
                        })
                      }
                    }
                  } catch (error) {
                    setIsModal(false)

                    Swal.fire({
                      icon: 'error',
                      title: 'An error occurred',
                      text: error.message
                    })
                  } finally {
                    setAddLoader(false)
                    setIsModal(false)
                  }
                }}
                type="button"
                className="btn btn-primary"
              >
                {addLoader && <Spinner animation="border" color="black" size="sm" />} Add
              </button>
            </Modal.Footer>
          </Modal>

          <Modal
            centered
            show={isEditModal}
            onHide={() => {
              setIsEditModal(false)
              setRemark('')
              SelectedExpense.current = ''
            }}
          >
            <Modal.Header closeButton>
              <h5 className="modal-title  fw-bold" id="dremovetaskLabel">
                {' '}
                Expense Approve
              </h5>
            </Modal.Header>
            <Modal.Body className="justify-content-center flex-column d-flex">
              {/* <i className="icofont-simple-smile text-success display-2 text-center mt-2"></i> */}
              {/* <p className="mt-4 fs-5 text-center">Expense Approve Successfully</p> */}
              <div className="">
                <label htmlFor="amount" className="form-label">
                  Approve Amount
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="amount"
                  placeholder="Approve Amount"
                  onChange={(e) => setApproveAmount(e.target.value)}
                  value={approvedAmount}
                />
                <label htmlFor="depone" className="form-label">
                  Remark
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="depone"
                  placeholder="Remark"
                  onChange={(e) => {
                    setRemark(e.target.value)
                  }}
                  value={remark}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={(e) => acceptExpense(SelectedExpense.current)}
                className="btn btn-primary"
              >
                {actionExpense && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                )}
                Accept
              </button>
            </Modal.Footer>
          </Modal>

          <Modal
            centered
            show={isDeleteModal}
            onHide={() => {
              setIsDeleteModal(false)
              setRemark('')
              SelectedExpense.current = ''
            }}
          >
            <Modal.Header closeButton>
              <h5 className="modal-title  fw-bold" id="dremovetaskLabel">
                {' '}
                Expense Reject
              </h5>
            </Modal.Header>
            <Modal.Body className="justify-content-center flex-column d-flex">
              {/* <i className="icofont-simple-smile text-success display-2 text-center mt-2"></i> */}
              {/* <p className="mt-4 fs-5 text-center">Expense Approve Successfully</p> */}
              <div className="">
                <label htmlFor="depone" className="form-label">
                  Remark
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="depone"
                  placeholder="Remark"
                  onChange={(e) => {
                    setRemark(e.target.value)
                  }}
                  value={remark}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={(e) => rejectExpense(SelectedExpense.current)}
                className="btn btn-primary"
              >
                {actionExpense && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                )}
                Reject
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  )
}

export default Expenses
