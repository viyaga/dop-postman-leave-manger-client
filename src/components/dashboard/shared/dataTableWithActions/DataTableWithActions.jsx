import {
  DataGrid,
  GridToolbar,
} from "@mui/x-data-grid";
import "./dataTableWithActions.scss";
import { MdDelete, MdEdit } from "react-icons/md";

const DataTableWithActions = ({ columns, rows, setOpen, setEditData, setDeleteData }) => {

  const handleEdit = (data) => {
    setEditData(data)
    setOpen(true)
  }

  const actionColumn = {
    field: "action",
    headerName: "Action",
    width: 200,
    disableExport: true,
    renderCell: (params) => {
      return (
        <div className="action">
          <div className="edit" onClick={() => handleEdit(params.row)}>
            <MdEdit size={20} />
          </div>
          <div className="delete" onClick={() => setDeleteData(params.row)}>
            <MdDelete size={20} />
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

export default DataTableWithActions;
