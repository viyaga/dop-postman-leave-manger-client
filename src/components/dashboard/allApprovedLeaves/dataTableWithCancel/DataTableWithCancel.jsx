import {
  DataGrid,
  GridToolbar,
} from "@mui/x-data-grid";
import "./dataTableWithCancel.scss";
import { MdCancel, MdDelete, MdEdit } from "react-icons/md";

const DataTableWithCancel = ({ columns, rows, setOpen, setEditData, setCancelationData }) => {

  const actionColumn = {
    field: "action",
    headerName: "Action",
    width: 200,
    disableExport: true,
    renderCell: (params) => {
      return (
        <div className="action">
          <div className="delete" onClick={() => setCancelationData(params.row)}>
            <MdCancel size={20} />
          </div>
        </div >
      );
    },
  };

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={rows}
        columns={[...columns, actionColumn]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 300 },
            printOptions: { disableToolbarButton: true }
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />
    </div>
  );
};

export default DataTableWithCancel;
