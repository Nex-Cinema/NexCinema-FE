const AdminFilterSelect = ({ children, className = '', ...props }) => (
  <select className={`admin-filter-select ${className}`} {...props}>
    {children}
  </select>
);

export default AdminFilterSelect;
