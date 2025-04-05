import React from "react";
import { Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function PageHeader({
  headerTitle,
  isTabShow,
  renderRight,
  renderLeft,
  headerClass = "",
  headerNavHistory = [],
  handleHeaderNavHistorySlicing,
  isNoMargin = false,
  headerHClass = ''
}) {
  const navigate = useNavigate();
  const Cred = useSelector((state) => state.Cred);

  // Pre-computed values for better performance
  const currentMember = headerNavHistory.length > 0 ? headerNavHistory[0] : [];
  const restMembers = headerNavHistory?.slice(1) || [];

  const handleNavigate = (index, member) => {
    handleHeaderNavHistorySlicing(index);
    navigate(`/member/${member.id}`);
  };

  return (
    <div className="row align-items-center">
      <div className={`border-0 ${isNoMargin ? "" : "mb-4"}`}>
        <div
          className={`card-header no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap ${headerClass}`}
        >
          <div className={`d-flex gap-2 ${isNoMargin ? "" : "mb-0 py-3 pb-2"}`}>
            {renderLeft && renderLeft()}
            <h3 className={`fw-bold ${headerHClass}`} >{headerTitle}</h3>
          </div>

          {isTabShow && (
            <div className="col-auto py-2 w-sm-100">
              <Nav
                variant="pills"
                className="nav nav-tabs tab-body-header rounded invoice-set"
              >
                {["Invoice List", "Simple invoice", "Email invoice"].map(
                  (tabName, idx) => (
                    <Nav.Item key={idx}>
                      <Nav.Link eventKey={tabName}>{tabName}</Nav.Link>
                    </Nav.Item>
                  )
                )}
              </Nav>
            </div>
          )}

          {renderRight && renderRight()}
        </div>

        {headerNavHistory.length > 0 && (
          <div className="d-flex gap-2">
            {currentMember && (
              <span
                role="button"
                className="d-flex justify-content-center align-items-center"
                onClick={() => handleNavigate(0, currentMember)}
              >
                {currentMember.name}
              </span>
            )}

            {restMembers.map((member, index) => (
              <span
                key={member.id}
                role="button"
                className="d-flex justify-content-center align-items-center"
                onClick={() => handleNavigate(index + 1, member)}
              >
                <i className="icofont-simple-right"></i>
                {member.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
