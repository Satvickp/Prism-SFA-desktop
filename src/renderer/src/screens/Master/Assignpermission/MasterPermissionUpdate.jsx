import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { permissionIds } from "../../../constants/constants";
import PageHeader from "../../../components/common/PageHeader";
import {
  getAllMembers,
  getAllMembersWithHierarchy,
  getEveryMemberExist,
  getPermissionOfAMember,
  updatePermissionOfAMember,
} from "../../../api/member/member-api";
import AsyncSelect from "react-select/async";
import {
  setDropdownMembers,
  setMembers,
} from "../../../redux/features/memberSlice";
import {
  setDropdownPermission,
  setMemberPermissions,
} from "../../../redux/features/permissionSlice";
import Swal from "sweetalert2";
// import SubTable from "./SubTable";

const AssignPermission = ({ isViewPurpose = true }) => {
  const { memberPermissions, dropdownPermission } = useSelector(
    (state) => state.Permission
  );
  const Cred = useSelector((state) => state.Cred);
  const Member = useSelector((state) => state.Member);
  const Dispatch = useDispatch();
  //console.log("Cred",Cred.id)

  // Predefined permission pages
  const predefinedPermissions = [
    "Manager",
    // "Expense",
    // "Leave",
    // "Beet",
    // "Outlet",
    // "Product",
  ];

  const permissionsData = predefinedPermissions.map((permission, index) => ({
    id: index + 1,
    name: permission,
    // name: permission === "Manager" ? "Member" : permission,
    create: false,
    edit: false,
    delete: false,
    view: false,
  }));

  const predefinedAdditionalPermissions = [
    "Super_Admin",
    "Reporting_Manager",
    "Manager",
  ];

  const additionalPermissionData = predefinedAdditionalPermissions.map(
    (permission, index) => ({
      id: index + 1,
      name: permission,
      value: false,
    })
  );

  const [data, setData] = useState(permissionsData);
  const [additionalData, setAdditionalData] = useState(
    additionalPermissionData
  );
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const handleIsDisabled = () => setIsDisabled(!isDisabled);
  const [additionalPermission, setAdditionalPermission] = useState([]);

  const hasSuperAdminPermission = memberPermissions?.some(
    (permission) => permission === permissionIds.SUPER_ADMIN
  );

  async function getMember() {
    const Arrays = await getEveryMemberExist(Cred.token, 0, Cred.sub);
    let filteredData = Arrays.data;
    // .filter(
    //   (item) =>
    //     item.id !== Cred.sub &&
    //     !item.userRoleList.includes(permissionIds.SUPER_ADMIN)
    // );
    Dispatch(setDropdownMembers(filteredData));
  }

  useEffect(() => {
    if (Member.dropdownMembers.length <= 0) {
      getMember();
    }
    if (Member.dropdownMembers.length > 0 && !selectedMember) {
      setSelectedMember({
        label: `${Member?.dropdownMembers[0]?.firstName} ${Member?.dropdownMembers[0]?.lastName} (${Member?.dropdownMembers[0]?.employeeId})`,
        value: {
          firstName: Member?.dropdownMembers[0]?.firstName,
          lastName: Member?.dropdownMembers[0]?.lastName,
          id: Member?.dropdownMembers[0]?.id,
        },
      });
    }
  }, [Member.dropdownMembers, selectedMember]);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        if (selectedMember?.value?.id && isViewPurpose) {
          const { permission, status } = await getPermissionOfAMember(
            selectedMember.value.id,
            Cred.token
          );

          // Dispatch permissions to the redux slice
          Dispatch(setDropdownPermission(permission));

          // Update the `data` state based on fetched permissions
          const updatedData = permissionsData.map((permissionItem) => {
            const permissionKey = permissionItem.name;
            return {
              ...permissionItem,
              create: permission.includes(`Create_${permissionKey}`),
              edit: permission.includes(`Edit_${permissionKey}`),
              delete: permission.includes(`Delete_${permissionKey}`),
              view: permission.includes(`View_${permissionKey}`),
            };
          });

          const updatedAdditionalPermission = additionalPermissionData.map(
            (permissionItem) => {
              const permissionKey = permissionItem.name;
              return {
                ...permissionItem,
                value: permission.includes(`${permissionKey}`),
              };
            }
          );

          setData(updatedData);
          setAdditionalData(updatedAdditionalPermission);
        } else {
          const { permission, status } = await getPermissionOfAMember(
            Cred.sub,
            Cred.token
          );

          // Dispatch permissions to the redux slice
          Dispatch(setDropdownPermission(permission));

          // Update the `data` state based on fetched permissions
          const updatedData = permissionsData.map((permissionItem) => {
            const permissionKey = permissionItem.name;
            return {
              ...permissionItem,
              create: permission.includes(`Create_${permissionKey}`),
              edit: permission.includes(`Edit_${permissionKey}`),
              delete: permission.includes(`Delete_${permissionKey}`),
              view: permission.includes(`View_${permissionKey}`),
            };
          });

          const updatedAdditionalPermission = additionalPermissionData.map(
            (permissionItem) => {
              const permissionKey = permissionItem.name;
              return {
                ...permissionItem,
                value: permission.includes(`${permissionKey}`),
              };
            }
          );

          setData(updatedData);
          setAdditionalData(updatedAdditionalPermission);
        }
      } catch (error) {
        console.error("Error fetching permissions: ", error);
      }
    }

    fetchPermissions();
  }, [selectedMember]);

  if (!hasSuperAdminPermission && isViewPurpose) {
    return (
      <div className="container-xxl text-center mt-5">
        <h3>You do not have the required permission to access this page.</h3>
      </div>
    );
  }

  const handleCheckboxChange = (e, rowId, action) => {
    const updatedData = data.map((row) =>
      row.id === rowId ? { ...row, [action]: e.target.checked } : row
    );
    setData(updatedData);
  };

  const handleAdditionalInformationChange = (e, rowId, permissionName) => {
    const updateData = additionalData.map((row) =>
      row.id === rowId ? { ...row, [permissionName]: e.target.checked } : row
    );
    setAdditionalData(updateData);
  };

  async function handleUpdatePermission() {
    try {
      let newPermissionArray = [];
      data.forEach((item) => {
        if (item.create) newPermissionArray.push(`Create_${item.name}`);
        if (item.edit) newPermissionArray.push(`Edit_${item.name}`);
        if (item.delete) newPermissionArray.push(`Delete_${item.name}`);
        if (item.view) newPermissionArray.push(`View_${item.name}`);
      });

      additionalData.forEach((item) => {
        if (item.value) newPermissionArray.push(`${item.name}`);
      });

      let payload = {
        memberId: selectedMember.value.id,
        userRoleList: [...newPermissionArray],
      };

      console.log("payload", payload);
      const resp = await updatePermissionOfAMember(Cred.token, payload);
      if (resp) {
        Swal.fire({
          title: "Successfull",
          text: "Permission Updated Successfully",
          icon: "success",
          timer: 2000,
        });
      }
      handleIsDisabled();
    } catch (error) {
      Swal.fire({
        title: "Something went wrong",
        text: "Unable to update Permission! Please Try again later",
        icon: "error",
        timer: 2000,
      });
      console.log("Error: unable to update Permission ", error);
    }
  }

  const columns = [
    {
      name: "Permission Page",
      selector: (row) => row.name == "Manager" ? "Member" : "Manager",
      sortable: true,
    },
    {
      name: "Create",
      cell: (row) => (
        <input
          type="checkbox"
          checked={row.create}
          onChange={(e) => handleCheckboxChange(e, row.id, "create")}
        />
      ),
    },
    {
      name: "Edit",
      cell: (row) => (
        <input
          type="checkbox"
          checked={row.edit}
          onChange={(e) => handleCheckboxChange(e, row.id, "edit")}
        />
      ),
    },
    {
      name: "Delete",
      cell: (row) => (
        <input
          type="checkbox"
          checked={row.delete}
          onChange={(e) => handleCheckboxChange(e, row.id, "delete")}
        />
      ),
    },
    {
      name: "View",
      cell: (row) => (
        <input
          type="checkbox"
          checked={row.view}
          onChange={(e) => handleCheckboxChange(e, row.id, "view")}
        />
      ),
    },
  ];

  const MainColumns = [
    {
      name: "Permission Page Type",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Number of Pages",
      selector: (row) => row.pages,
      sortable: true,
    },
  ];

  const additionalPermissionColumn = [
    {
      name: "Additional Permission",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      cell: (row) => (
        <input
          type="checkbox"
          checked={row.value}
          onChange={(e) =>
            handleAdditionalInformationChange(e, row.id, "value")
          }
        />
      ),
    },
  ];

  const filterMember = (inputValue) => {
    return Member.dropdownMembers.filter(
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

  // Dependencies to ensure it triggers correctly
  const MainColumnsData = [
    {
      id: 1,
      name: "Employee",
      pages: 1,
      component: (
        <DataTable
          title="Assigned Permissions"
          columns={columns}
          data={data.slice(0, 3)}
          disabled={isDisabled}
          highlightOnHover
          dense
        />
      ),
    },
    // {
    //   id: 2,
    //   name: "Customers",
    //   pages: 3,
    //   component: (
    //     <DataTable
    //       title="Assigned Permissions"
    //       columns={columns}
    //       data={data.slice(3, 6)}
    //       disabled={isDisabled}
    //       highlightOnHover
    //       dense
    //     />
    //   ),
    // },
    {
      id: 2,
      name: "Additional Permissions",
      pages: 1,
      component: memberPermissions.some(
        (item) => item === permissionIds.SUPER_ADMIN
      ) ? (
        <DataTable
          title="Additional Permissions"
          columns={additionalPermissionColumn}
          data={additionalData}
          disabled={
            memberPermissions.some(
              (item) => item === permissionIds.SUPER_ADMIN
            ) && isDisabled
              ? true
              : false
          }
          highlightOnHover
          dense
        />
      ) : (
        <DataTable
          title="Additional Permissions"
          columns={additionalPermissionColumn}
          data={additionalData}
          disabled={true}
          highlightOnHover
          dense
        />
      ),
    },
  ];

  const ExpandableComponent = ({ rowData }) => {
    return rowData.component;
  };

  return (
    <div className="container-xxl">
      {isViewPurpose && (
        <PageHeader
          headerTitle="Assign Permission"
          renderRight={() => {
            return (
              <div className="d-flex gap-2">
                <AsyncSelect
                  placeholder={"Select a member"}
                  cacheOptions
                  defaultOptions={Member.dropdownMembers.map((item) => ({
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
                <button
                  className="btn btn-primary me-2"
                  onClick={handleIsDisabled}
                >
                  {isDisabled ? "Update Permission" : "Cancel"}
                </button>
              </div>
            );
          }}
        />
      )}

      <div className="row clearfix g-3">
        <div className="card">
          <div className="card-body gap-3">
            {dropdownPermission.length > 0 && (
              <div className=" mb-2">
                <DataTable
                  title="Assigned Permissions"
                  columns={MainColumns}
                  data={MainColumnsData}
                  expandableRows
                  expandableRowsComponent={({ data }) => (
                    <ExpandableComponent rowData={data} />
                  )}
                  highlightOnHover
                  dense
                />
              </div>
            )}
            {/* Save and Cancel Buttons */}
            {!isDisabled && (
              <div className="d-flex justify-content-end mt-3">
                <button
                  className="btn btn-primary"
                  onClick={handleUpdatePermission}
                >
                  Update
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignPermission;
