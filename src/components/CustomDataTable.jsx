import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DataGrid, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Box, InputAdornment, styled, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';

const defaultColumns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .no-rows-primary': {
    fill: '#3D4751',
    ...theme.applyStyles('light', {
      fill: '#AEB8C2',
    }),
  },
  '& .no-rows-secondary': {
    fill: '#1D2126',
    ...theme.applyStyles('light', {
      fill: '#E8EAED',
    }),
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={96}
        viewBox="0 0 452 257"
        aria-hidden
        focusable="false"
      >
        <path
          className="no-rows-primary"
          d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
        />
        <path
          className="no-rows-primary"
          d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
        />
        <path
          className="no-rows-primary"
          d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
        />
        <path
          className="no-rows-secondary"
          d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
        />
      </svg>
      <Box sx={{ mt: 2 }}>Tidak Ada Data</Box>
    </StyledGridOverlay>
  );
}

const DataTable = ({
  id = 'data-table',
  rows = [],
  columns = defaultColumns,
  sx = { border: 0, height: 400, width: '100%' },
  dynamicPageSize = true,
  pageSize = 5, // Default page size
  onModal = '',
  toolbar = false,
  export_pdf = {
    file_name: ''
  }, 
  checkbox = false,
  searchable = false,
  searchable_column = [],
  loading = false,
  rowSelect = {
    onChange: () => {},
    value: []
  },
  isRowSelectable = () => {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dynamically set the page size if `dynamicPageSize` is true
  const computedPageSize = dynamicPageSize ? Math.min(rows.length, 10) : pageSize;

  // Filter rows based on searchQuery and searchable_column
  const filteredRows = rows.filter((row) => {
    if (!searchQuery || searchable_column.length === 0) return true;

    return searchable_column.some((column) => {
      const value = column.split('.').reduce((obj, key) => (obj ? obj[key] : ''), row); // Support nested fields
      return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });
  });

  return (
    <Paper sx={{
      ...sx
    }}

    
    >
      {searchable && (
        <div className="p-2">
          <div className="w-1/3">
            <TextField
              fullWidth
              label="Cari data disini"
              size="small"
              placeholder="John Doe"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" className="text-blue-500" />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </div>
      )}
      <DataGrid
        
        rows={filteredRows}
        columns={columns}
        pageSize={computedPageSize}
        pageSizeOptions={[5, 10, 15, 20]} // Available page size options
        pagination
        disableColumnMenu
        disableSelectionOnClick
        disableRowSelectionOnClick
        checkboxSelection={checkbox}
        isRowSelectable={isRowSelectable}
        loading={loading}
        sx={{
          border: 0,
          '& .MuiDataGrid-toolbarContainer': {
            zIndex: 99999, // Ensure it's higher than modal's zIndex
          },
          ...sx,
        }}
        slots={{
          toolbar: toolbar ? () => (
            <GridToolbarContainer>
              <GridToolbarExport
                printOptions={{
                  hideFooter: true,
                  hideToolbar: true,
                  includeCheckboxes: false,
                  fileName: export_pdf.file_name,
                }}
              />
              <GridToolbarFilterButton />
              <GridToolbarColumnsButton />
              <GridToolbarQuickFilter />
            </GridToolbarContainer>
          ) : () => <GridToolbarContainer></GridToolbarContainer>,
          noRowsOverlay: CustomNoRowsOverlay
        }}
        slotProps={{
          loadingOverlay: {
            variant: 'skeleton',
            noRowsVariant: 'skeleton'
          }
        }}
        autosizeOptions={{
          columns: [rows.length > 0 && Object.keys(rows[0])],
          includeOutliers: true,
          includeHeaders: true,
        }}
        
        onRowSelectionModelChange={rowSelect.onChange}
        rowSelectionModel={rowSelect.value}
        PopperProps={{
          container: document.getElementById(onModal), // Append to the modal container
        }}
      />
    </Paper>
  );
};

DataTable.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array,
  sx: PropTypes.object,
  dynamicPageSize: PropTypes.bool, // Enable or disable dynamic page size
  pageSize: PropTypes.number, // Default page size when dynamicPageSize is false
  onModal: PropTypes.string.isRequired, // ID of the modal element to append the popper
  toolbar: PropTypes.bool, // Whether to show the toolbar
  export_pdf: PropTypes.object, // PDF export options
  checkbox: PropTypes.bool, // Enable or disable checkbox selection
  searchable: PropTypes.bool, // Enable or disable search functionality
  searchable_column: PropTypes.arrayOf(PropTypes.string), // Columns to search
};

export default DataTable;
