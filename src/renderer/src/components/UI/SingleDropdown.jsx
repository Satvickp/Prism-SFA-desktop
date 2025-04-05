import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";

function SingleDropdown(props) {
  const {
    placeholder = "Select Member",
    isMandatory = false,
    title,
    data,
    dropdownData,
    handleChange,
    isPagination,
    loadMore,
    buttonLoader,
    accessLabel,
    disabled = false,
    ...rest
  } = props;
  const [handleToggle, setHandleToggle] = useState(false);
  const Cred = useSelector((state) => state.Cred);
  return (
    <div className="col-sm-12 mt-7">
      <p className="form-label">{isMandatory ? title + "*" : title}</p>
      <div className="custom-dropdown">
        <div
          id="assignMember"
          {...rest}
          className="dropdown-header"
          onClick={() => {
            if (!disabled) {
              setHandleToggle(!handleToggle);
            }
          }}
        >
          {data?.id ? accessLabel(data) : placeholder}{" "}
          <i className="icofont-caret-down me-2 fs-6"></i>
        </div>
        {handleToggle && (
          <div className="dropdown-list">
            {dropdownData.length > 0 ? (
              dropdownData.map((item, index) => (
                <div
                  key={item?.id}
                  onClick={() => {
                    handleChange(item);
                    setHandleToggle(!handleToggle);
                  }}
                  className={"dropdown-item"}
                >
                  {accessLabel(item)}
                </div>
              ))
            ) : (
              <div className={"dropdown-item"}>Not available</div>
            )}
            {isPagination ? (
              <button
                className="load-more-button"
                onClick={(e) => {
                  e.preventDefault();
                  loadMore();
                }}
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
                )}{" "}
                Load More
              </button>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SingleDropdown;
