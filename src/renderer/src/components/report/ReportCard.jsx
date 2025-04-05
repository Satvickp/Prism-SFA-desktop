import React from 'react';
import PropTypes from 'prop-types'; // For prop type validation
import './ReportCard.css'; // Importing external CSS for styling

function ReportCard({ label, value, iconClassName, bgColor, textColor }) {
  return (
    <div className="col-md-1 col-lg-3 mb-4">
      <div className={`card border-0 shadow-lg ${bgColor} text-${textColor} report-card`}>
        <div className="card-body d-flex flex-column align-items-center">
          {/* Icon */}
          <div className="icon-container mb-1">
            <i className={`${iconClassName}`} style={{ fontSize: '2rem' }}></i>
          </div>

          {/* Card Content */}
          <div className="text-center">
            <h5 className="card-title fs-10 mb-1">{label}</h5>
            <p className="card-text fs-10 fw-semibold">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

ReportCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  iconClassName: PropTypes.string.isRequired,
  bgColor: PropTypes.string, 
  textColor: PropTypes.string, 
};

ReportCard.defaultProps = {
  bgColor: 'black', 
  textColor: 'dark', 
};

export default ReportCard;
