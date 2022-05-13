
export const getExportOptions = ({ fileName }) => {
    return {
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="fa fa-file-excel"></i>   Export to Excel',
                filename: fileName,
                className: 'btn btn-primary btn-md'
            },
            {
                extend: 'print',
                text: '<i class="fa fa-print"></i>  Print',
                className: 'btn btn-primary btn-md'
            }
        ]
    }
}