// Import useState
import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { ImCross } from "react-icons/im";

function MultiDropdown(props) {
  const {
    isMandatory = false,
    title,
    data,
    dropdownData,
    handleChange,
    isPagination,
    loadMore,
    buttonLoader,
    dropdownRef,
    checkingField = 'cityName',
  } = props;
  
  const [handleToggle, setHandleToggle] = useState(false);
  const [localData, setLocalData] = useState(data);
  
  const handleDocumentClick = (e) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target)
    ) {
      setHandleToggle(false);
    }
  };
  useEffect(() => {
    // console.log(dropdownRef)
    document.body.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.body.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);
  return (
    <div ref={dropdownRef} className="col-sm-12">
      <p className="form-label">Select {isMandatory ? title+"*" : title}</p>
      <div className="custom-dropdown">
        <div
          id="assignClient"
          className="multiDropdown"
          onClick={() => setHandleToggle(!handleToggle)}
        >
          <div className="multiDropdownSubHeader">
            {Array.isArray(localData) && localData.length > 0 ? (
              localData.map((e, i) => (
                <p className="multiDropdownHeaderList" key={i}>
                  {e[`${checkingField}`]}{" "}
                  <ImCross
                    onClick={() => {
                      const updatedData = localData.filter(
                        (c) => c.id !== e.id
                      );
                      setLocalData(updatedData);
                      handleChange(updatedData);
                    }}
                    className="ml-2"
                    size={8}
                  />
                </p>
              ))
            ) : (
              <p className="multiSelectNotSelected">Select {title}</p>
            )}
          </div>
          <i className="icofont-caret-down me-2 fs-6"></i>
        </div>
        {handleToggle && (
          <div className="dropdown-list">
            {dropdownData.length > 0 ? (
              dropdownData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!localData.some((e) => e.id === item.id)) {
                      const updatedData = [...localData, item];
                      setLocalData(updatedData);
                      handleChange(updatedData);
                    }
                    setHandleToggle(false);
                  }}
                  className={`dropdown-item ${
                    localData.some((e) => e.id === item.id) ? "selected" : ""
                  }`}
                >
                  {item[`${checkingField}`]}
                </div>
              ))
            ) : (
              <div
                onClick={() => {
                  setHandleToggle(false);
                }}
                className={"dropdown-item"}
              >
                No {title} available
              </div>
            )}
            {isPagination && (
                <button
                  className="load-more-button"
                  onClick={(e) => {
                    e.preventDefault();
                    loadMore();
                  }}
                >
                  {buttonLoader.loadMoreMember && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-1"
                    />
                  )}{" "}
                  Load More
                </button>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MultiDropdown;
