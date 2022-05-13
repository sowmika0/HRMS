import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatatableService {

  constructor() { }

  // drawDatatable(
  //   listTableId: string,
  //   columnsToShowWhenPrint?: number[],
  //   showButtons?: boolean,
  //   showPagination?: boolean,
  //   header?: string,
  //   subHeader?: string
  // ) {
  //   if ($('#' + listTableId).DataTable()) {
  //     $('#' + listTableId)
  //       .DataTable()
  //       .destroy();
  //   }
  //   setTimeout(() => {
  //     const table = $('#' + listTableId).DataTable({
  //       select: true,
  //       paging: true,
  //       pageLength: 50,
  //       lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'All']],
  //       dom: (showButtons ? 'B' : '') + (showPagination ? 'lfrtip' : ''),
  //       buttons:
  //         columnsToShowWhenPrint !== undefined &&
  //           columnsToShowWhenPrint !== null
  //           ? [
  //             {
  //               extend: 'print',
  //               text: 'Print Table',
  //               className: 'btn btn-small btn-default',
  //               exportOptions: {
  //                 columns: columnsToShowWhenPrint,
  //                 modifier: {
  //                   selected: null
  //                 }
  //                 // stripHtml: false
  //               },
  //               messageTop: subHeader !== undefined ? subHeader : '',
  //               messageBottom: 'Produced by Cabinetly.',
  //               customize: function (win) {
  //                 $(win.document.body)
  //                   .addClass('print-body')
  //                   .css('font-size', '10pt');

  //                 $(win.document.body)
  //                   .find('table')
  //                   .css('font-size', 'inherit');

  //                 $(win.document.body)
  //                   .find('h1')
  //                   .css('margin-bottom', '2rem')
  //                   .addClass('print-header');

  //                 if (header !== undefined) {
  //                   $(win.document.body)
  //                     .find('h1')
  //                     .text(header);
  //                 }

  //                 $($(win.document.body).children('div')[0]).addClass(
  //                   'print-table-header'
  //                 );

  //                 $($(win.document.body).children('div')[1]).addClass(
  //                   'print-table-footer'
  //                 );
  //               }
  //               // autoPrint: false
  //             }
  //           ]
  //           : null
  //     });

  //     return table;
  //   }, 50);
  // }
}
