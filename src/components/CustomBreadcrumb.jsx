import React from "react";
import { ChevronRight } from "@mui/icons-material"; // Import icons
import PropTypes from "prop-types"; // Optional: for type checking

const CustomBreadcrumb = ({ items }) => {
  return (
    <div className="flex items-center gap-5 text-xs">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.icon && <item.icon fontSize="small" />}
          <span>{item.label || 'Data'}</span>
          {index < items.length - 1 && (
            <ChevronRight fontSize="small" className="opacity-50 ml-3" />
          )}
        </div>
      ))}
    </div>
  );
};

// Define PropTypes for type checking (optional)
CustomBreadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.elementType, // Icon component (e.g., HomeOutlined)
      label: PropTypes.string.isRequired, // Text for the CustomBreadcrumb
    })
  ).isRequired,
};

export default CustomBreadcrumb;
