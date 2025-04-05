import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import PageHeader from "../../components/common/PageHeader";
import { Button, Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { getCurrentCoordinates } from "../../helper/getCurrentCoordinates";
import {
  apiGetCityIdByCityName,
  apiGetRegionIdByName,
  apiGetStateIdByName,
  apiGetMemberIdByMemberCode,
  apiUploadClientInBulk,
} from "../../api/clients/bulkUploadClient-api";
import { concatClientsFMCG } from "../../redux/features/clientFMCGSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

export default function UploadClients() {
  const [clientExcelData, setClientExcelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const Cred = useSelector((state) => state.Cred);
  const dispatch = useDispatch();

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryData = event.target?.result;
      const workbook = XLSX.read(binaryData, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      setClientExcelData(data);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleUploadClients = async () => {
    setLoading(true);
    const coordinates = await getCurrentCoordinates();
    const clientBulkPayload = [];

    for (let client of clientExcelData) {
      try {
        const cityId = await apiGetCityIdByCityName(client.City, Cred.token);
        const stateId = await apiGetStateIdByName(client.State, Cred.token);
        const regionId = await apiGetRegionIdByName(client.Region, Cred.token);
        const memberId = await apiGetMemberIdByMemberCode(
          client.MemberCode,
          Cred.token
        );

        clientBulkPayload.push({
          clientCode: client.ClientCode,
          clientFirstName: client.ClientFirstName,
          clientLastName: client.ClientLastName,
          firmName: client.FirmName,
          password: client.Password,
          email: client.Email,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          mobile: client.Mobile,
          address: client.Address,
          region: regionId.id,
          state: stateId.id,
          city: cityId.id,
          userRoleList: ["ClientFMCG"],
          topUpBalance: client.TopUpBalance,
          memberId: memberId.id,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Failed to fetch IDs for ${client.ClientFirstName} ${client.ClientLastName}.`,
        });
        setLoading(false);
        return;
      }
    }

    try {
      const response = apiUploadClientInBulk(clientBulkPayload, Cred.token);
      dispatch(concatClientsFMCG(response));
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Clients uploaded successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error.message,
      });
    }

    setLoading(false);
    setClientExcelData([]);
  };

  // const handleEditRow = (index) => {
  //   const newData = [...clientExcelData];
  //   const editedValue = prompt("Edit Row", JSON.stringify(newData[index]));
  //   if (editedValue) {
  //     newData[index] = JSON.parse(editedValue);
  //     setClientExcelData(newData);
  //   }
  // };

  // const handleDeleteRow = (index) => {
  //   if (window.confirm("Are you sure?")) {
  //     const newData = clientExcelData.filter((_, i) => i !== index);
  //     setClientExcelData(newData);
  //   }
  // };

  const columns =
    clientExcelData.length > 0
      ? [
          ...Object.keys(clientExcelData[0]).map((key) => ({
            name: key,
            selector: (row) => <span className={"text-wrap"}>{row[key]}</span>,
            width: "150px",
            sortable: true,
          })),
          //   {
          //     name: "Actions",
          //     cell: (row, index) => (
          //       <>
          //         <button
          //           className="btn btn-outline-secondary me-2"
          //           onClick={() => handleEditRow(index)}
          //         >
          //           <i className="icofont-edit text-success"></i>
          //         </button>
          //         <button
          //           className="btn btn-outline-secondary deleterow"
          //           onClick={() => handleDeleteRow(index)}
          //         >
          //           <i className="icofont-ui-delete text-danger"></i>
          //         </button>
          //       </>
          //     ),
          //   },
        ]
      : [];
  const customStyles = {
    headCells: {
      style: {
        borderRight: "1px solid #ccc",
      },
    },
    cells: {
      style: {
        borderRight: "1px solid #eee",
      },
    },
  };
  return (
    <>
      <div className="container-xxl">
        <PageHeader
          headerTitle={"Bulk Upload Clients"}
          renderRight={() => {
            return (
              <>
                <div>
                  <Button
                    onClick={handleUploadClients}
                    variant="primary"
                    className="me-2"
                    disabled={clientExcelData.length === 0}
                  >
                    Upload{" "}
                    {loading ? <Spinner size="sm" variant="warning" /> : null}
                  </Button>
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />

                  <Button
                    onClick={handleButtonClick}
                    variant="primary"
                    className="me-2"
                  >
                    Choose Excel File
                  </Button>
                </div>
              </>
            );
          }}
        />
      </div>
      {clientExcelData.length > 0 ? (
        <DataTable
          columns={columns}
          data={clientExcelData}
          pagination
          defaultSortField
          highlightOnHover
          customStyles={customStyles}
        />
      ) : (
        <p>No data to display</p>
      )}
    </>
  );
}
