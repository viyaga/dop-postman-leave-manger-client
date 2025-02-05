import {
  DataGrid,
  GridToolbar,
} from "@mui/x-data-grid";
import "./dataTable.scss";
import CustomToolbar from "./customToolbar/CustomToolbar";

const DataTable = (props) => {

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={props.rows}
        columns={[...props.columns]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{ toolbar: CustomToolbar }}
        // slotProps={{
        //   toolbar: {
        //     showQuickFilter: true,
        //     quickFilterProps: { debounceMs: 300 },
        //     // printOptions: { disableToolbarButton: true }
        //   },
        // }}
        //rowCount={100}
        // paginationMode="server"
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

export default DataTable;
