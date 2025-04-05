import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/common/PageHeader";
import FilterComponent from "./FilterComponent";
import DataTable from "react-data-table-component";
import useClientWiseReportHook from "./useClientWiseReportHook";
import { getCity, getEveryState } from "../../../api/clients/clients-api";
import { useSelector } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Select from "react-select";
import ClientSaleOrder from "./clientSaleOrder";
import { useNavigate } from "react-router-dom";
import { CLIENT_TYPE } from "../../../components/Data/ClientFMCGMemberMenu";
import { customStyles } from "../../../constants/customStyles";
import { useIsSuperAdmin } from "../../../helper/isManager";
function ClientWiseReport() {
  const {
    loading,
    selectedCity,
    selectedState,
    setSelectedCity,
    setSelectedState,
    clientData,
    setClientData,
    getClientData,
    endDate,
    startDate,
  } = useClientWiseReportHook();
  const Cred = useSelector((state) => state.Cred);
  const [allDropdownState, setAllDropdownState] = useState([]);
  const [allDropdownCity, setAllDropdownCity] = useState([]);
  const navigate = useNavigate();
  const isSuperAdmin = useIsSuperAdmin();

  async function getAllState() {
    try {
      if (isSuperAdmin) {
        const resp = await getEveryState(Cred.token, 0, 500);
        let values = resp.map((item) => ({
          label: item.stateName,
          value: item.id,
        }));
        setAllDropdownState(values);
        setSelectedState(values[0]);
      } else {
        let values = Cred.states.map((item) => ({
          label: item.stateName,
          value: item.id,
        }));
        setAllDropdownState(values);
        setSelectedState(values[0]);
      }
    } catch (error) {
      console.log("Error fetching state :", error);
    }
  }

  async function getAllCity() {
    try {
      setAllDropdownCity([]);
      // setClientData([]);
      if (isSuperAdmin) {
        const resp = await getCity(Cred.token, selectedState?.value);
        let values = resp.map((item) => ({
          label: item.cityName,
          value: item.id,
        }));
        setAllDropdownCity(values);
        if (values.length > 0) {
          setSelectedCity(values[0]);
        }
      } else {
        let values = Cred.cities.map((item) => ({
          label: item.cityName,
          value: item.id,
        }));
        setAllDropdownCity(values);
        if (values.length > 0) {
          setSelectedCity(values[0]);
        }
      }
    } catch (error) {
      console.log("Error fetching city:", error);
    }
  }

  useEffect(() => {
    if (selectedState) {
      getAllCity();
    }
  }, [selectedState]);

  const handleAllDropDownState = (selectedStates) => {
    setSelectedCity([]);
    const selectedStatesIds = selectedStates;
    setSelectedState(selectedStatesIds);
  };

  const handleAllDropDownCity = (selectedCities) => {
    const selectedCityIds = selectedCities;
    setSelectedCity(selectedCityIds);
  };

  useEffect(() => {
    // if (isSuperAdmin) {
    getAllState();
    // }
  }, []);

  const columns = [
    {
      name: (
        <span className="text-wrap">
          {CLIENT_TYPE === "FMCG" ? "CLIENT" : "STOCKIST"} CODE
        </span>
      ),
      selector: (row) => row.clientCode || "N/A",
      sortable: true,
      cell: (row) => (
        <span className="text-wrap">
          {row.clientCode ? `${row.clientCode}` : "N/A"}
        </span>
      ),
    },
    {
      name: (
        <span className="text-wrap">
          {CLIENT_TYPE === "FMCG" ? "CLIENT" : "STOCKIST"} NAME
        </span>
      ),
      selector: (row) => row.clientFirstName || "N/A",
      sortable: true,
      cell: (row) => (
        <span className="text-wrap">
          {row.clientFirstName
            ? `${row.clientFirstName} ${row.clientLastName}`
            : "N/A"}
        </span>
      ),
    },
    {
      name: <span className="text-wrap">FIRM NAME</span>,
      selector: (row) => row.firmName || "N/A",
      sortable: true,
      cell: (row) => (
        <span className="text-wrap">
          {row.firmName ? `${row.firmName}` : "N/A"}
        </span>
      ),
    },
    {
      name: <span className="text-wrap">EMAIL</span>,
      selector: (row) => row.email || "N/A",
      sortable: true,
      cell: (row) => (
        <span className="text-wrap">{row.email ? `${row.email}` : "N/A"}</span>
      ),
    },
    {
      name: <span className="text-wrap">MOBILE</span>,
      selector: (row) => row.mobile || "N/A",
      sortable: true,
      cell: (row) => (
        <span className="text-wrap">
          {row.mobile ? `${row.mobile}` : "N/A"}
        </span>
      ),
    },
    {
      name: <span className="text-wrap">ADDRESS</span>,
      selector: (row) => row.address || "N/A",
      sortable: true,
      cell: (row) => (
        <span className="text-wrap">
          {row.address ? `${row.address}` : "N/A"}
        </span>
      ),
    },
    {
      name: <span className="text-wrap">City Type</span>,
      selector: (row) =>row.cityResponse?.cityType || "N/A",
      sortable: true,
      cell: (row) => (
        <span className="text-wrap">
          {row.cityResponse?.cityType? `${row.cityResponse?.cityType}` : "N/A"}
        </span>
      ),
    },
    {
      name: <span className="text-wrap">City</span>,
      selector: (row) => row.cityResponse?.cityName || "N/A",
      sortable: true,
      cell: (row) => (
        <span className="text-wrap">
          {row.cityResponse?.cityName ? `${row.cityResponse?.cityName}` : "N/A"}
        </span>
      ),
    }
  ];

  return (
    <div className="container-xxl" style={{ position: "relative", zIndex: 40 }}>
      <PageHeader
        headerTitle={`${
          CLIENT_TYPE === "FMCG" ? "Client" : "Stockist"
        } Wise Report`}
        renderRight={() => {
          return (
            <div className="d-flex gap-2">
              {isSuperAdmin && (
                <div>
                  <Select
                    // isMulti
                    options={allDropdownState}
                    onChange={handleAllDropDownState}
                    value={selectedState}
                    // value={allDropdownState.filter((option) =>
                    //   selectedState.includes(option.value)
                    // )}
                    placeholder="Select State"
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        width: "200px",
                      }),
                    }}
                  />
                </div>
              )}
              <div>
                <Select
                  // isMulti
                  options={allDropdownCity}
                  onChange={handleAllDropDownCity}
                  // value={allDropdownCity.filter((option) =>
                  //   selectedCity.includes(option.label)
                  // )}
                  value={selectedCity}
                  placeholder="Select Cites"
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      width: "200px",
                    }),
                  }}
                />
              </div>
            </div>
          );
        }}
      />

      <DataTable
        title={`${CLIENT_TYPE === "FMCG" ? "Client" : "Stockist"} Table`}
        columns={columns}
        data={clientData?.content || []}
        responsive
        pagination
        progressPending={loading}
        highlightOnHover
        customStyles={{
          ...customStyles,
          rows: {
            style: {
              cursor: "pointer",
            },
          },
        }}
        onRowClicked={(data) => {
          navigate(`/client-order-details/${data.id}`);
        }}
      />
    </div>
  );
}

export default ClientWiseReport;
