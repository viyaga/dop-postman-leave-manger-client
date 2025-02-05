import * as XLSX from 'xlsx';
import moment from 'moment';
import { parse } from 'json2csv';

import { printData } from '@/data';
import { textCapitalize } from '@/services';

const xlsxDownload = (apiRef, leaveType) => {
    const columns = apiRef.current.getAllColumns().filter((col) => col.field !== '__check__' && col.field !== '__detail_panel_toggle__');
    const rows = apiRef.current.getAllRowIds().map((id) => apiRef.current.getRow(id));

    const xlsxData = rows.map(row => {
        const rowData = {};

        columns.forEach(col => {
            const field = col.field;

            if (field === 'from' || field === 'to') {
                rowData[col.headerName] = moment(row[field]).format('DD/MM/YYYY');
            } else if (field === 'name' || field === 'substituteName' || field === 'officeName' || field === 'remarks') {
                rowData[col.headerName] = textCapitalize(row[field]);
            } else if (field === 'designation') {
                let designation = row[field].toUpperCase();
                if (designation.split(' ')[0] === 'DAK') {
                    designation = "Dak sevak";
                }
                rowData[col.headerName] = designation;
            } else if (field === 'accountNo') {
                rowData[col.headerName] = row[field];
            } else {
                rowData[col.headerName] = row[field];
            }
        });
        return rowData;
    });

    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(xlsxData);

    // Set the format of account numbers to text to preserve leading zeros
    const accountNoColumnIndex = columns.findIndex(col => col.field === 'accountNo');
    if (accountNoColumnIndex !== -1) {
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let rowIndex = range.s.r + 1; rowIndex <= range.e.r; rowIndex++) {
            const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: accountNoColumnIndex });
            if (worksheet[cellAddress]) {
                worksheet[cellAddress].z = '@';
                worksheet[cellAddress].t = 's'; // Ensure the cell type is string
            }
        }
    }

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    // Generate the Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    // Create a link to download the Excel file
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${leaveType}-data.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


const csvDownload = (apiRef, leaveType) => {
    const columns = apiRef.current.getAllColumns().filter((col) => col.field !== '__check__' && col.field !== '__detail_panel_toggle__');
    const rows = apiRef.current.getAllRowIds().map((id) => apiRef.current.getRow(id));

    const csvData = rows.map(row => {
        const rowData = {};

        columns.forEach(col => {
            const field = col.field;

            if (field === 'from' || field === 'to') {
                rowData[col.headerName] = moment(row[field]).format('DD/MM/YYYY');
            } else if (field === 'name' || field === 'substituteName' || field === 'officeName' || field === 'remarks') {
                rowData[col.headerName] = textCapitalize(row[field]);
            } else if (field === 'designation') {
                let designation = row[field].toUpperCase();
                if (designation.split(' ')[0] === 'DAK') {
                    designation = "Dak sevak";
                }
                rowData[col.headerName] = designation;
            } else if (field === 'accountNo') {
                rowData[col.headerName] = `="${row[field]}"`;
            } else {
                rowData[col.headerName] = row[field];
            }
        });
        return rowData;
    });

    const csvString = parse(csvData);

    // Create a link to download the CSV file
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${leaveType}-data.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const handlePrint = (apiRef, leaveType) => {
    const columns = apiRef.current.getAllColumns().filter((col) => col.field !== '__check__' && col.field !== '__detail_panel_toggle__');
    const rows = apiRef.current.getAllRowIds().map((id) => apiRef.current.getRow(id));
    const data = printData.find((d) => d.leaveType === leaveType)

    // Create an iframe element
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);

    const printDocument = iframe.contentDocument || iframe.contentWindow.document;

    printDocument.write('<html><head>');
    printDocument.write('<style>');
    printDocument.write(`
    *{
      margin: 0;
      padding: 0;
      text-decoration: none;
    }
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
    }
    .center {
      text-align: center;
    }
    .underline {
      text-decoration: underline;
    }
    .marginBottom {
      margin-bottom: 20px;
    }
    .marginTop {
      margin-top: 20px;
    }
    p {
      font-size: 16px;
      margin-bottom: 20px;
    }
    ol li span{
      font-weight: bold;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid black;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    .copyMemo {
      margin-bottom: 10px;
    }
    ol li {
      margin-left: 40px;
      font-size: 19px;
      margin-bottom: 8px;
    }
    .ip li{
      text-align: right;
      font-weight: bold;
      font-size: 20px;
      list-style: none;
      margin-bottom: 5px;
    }
  `);
    printDocument.write('</style></head><body>');
    printDocument.write(`
    <h2 class="underline center">DEPARTMENT OF POSTS, INDIA</h2>
    <h2 class="underline center">Office of the Inspector Posts Tirumangalam Sub Division Tirumangalam 625706.</h2>
  `)
    printDocument.write(`${data.TopContent}`)
    printDocument.write('<table><thead><tr>');

    columns.forEach((col) => {
        printDocument.write(`<th>${col.headerName}</th>`);
    });

    printDocument.write('</tr></thead><tbody>');

    rows.forEach((row) => {
        printDocument.write('<tr>');
        columns.forEach((col) => {
            const field = col.field

            if (field === 'from' || field === 'to') {
                printDocument.write(`<td>${moment(row[field]).format('DD/MM/YYYY')}</td>`);
            } else if (field === 'name' || field === 'substituteName' || field === 'officeName' || field === 'remarks') {
                printDocument.write(`<td>${textCapitalize(row[field])}</td>`);
            } else if (field === 'designation') {
                let designation = row[field].toUpperCase()
                if (designation.split(' ')[0] === 'DAK') {
                    designation = "Dak sevak"
                }
                printDocument.write(`<td>${designation}</td>`);
            } else {
                printDocument.write(`<td>${row[col.field]}</td>`);
            }
        });
        printDocument.write('</tr>');
    });

    printDocument.write('</tbody></table>');
    printDocument.write(`${data.bottomContent}`)
    printDocument.write(`</br></br></br></br></br>
    <ul class="ip">
      <li>Inspector Posts,</li>
      <li>Tirumangalam sub division,</li>
      <li>Tirumangalam-625 706.</li>
    </ul>  
    `);
    printDocument.write('<h3 class="underline copyMemo">Copy of this Memo is issued to:</h3>');
    printDocument.write(`
    <ol>
      <li>The Senior Postmaster Madurai HO - 625001</li>
      <li>File</li>
    </ol>  
    `);
    printDocument.write('</body></html>');
    printDocument.close();

    // Wait for iframe content to load and then print
    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    // Remove the iframe after printing
    document.body.removeChild(iframe);
};

export { xlsxDownload, csvDownload, handlePrint }
