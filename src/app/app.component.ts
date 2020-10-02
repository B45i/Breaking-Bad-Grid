import { Component, OnInit } from '@angular/core';
import {
  GridApi,
  GridOptions,
  IServerSideGetRowsParams,
} from 'ag-grid-community';
import { BreakingBadService } from './breaking-bad.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  agOptions: GridOptions;
  readonly PAGE_SIZE = 15;

  constructor(private bbService: BreakingBadService) {}

  ngOnInit(): void {
    this.agOptions = this.initGrid();
  }

  private getCharacters(
    sucessCallback: any,
    failCallback: any,
    limit?: number,
    offset?: number
  ): any {
    return this.bbService.getCharacters(limit, offset).subscribe(
      (r) => {
        const lastIndex = r.length < limit ? r.length + offset : -1;
        sucessCallback(r, lastIndex);
      },
      (err) => failCallback(err)
    );
  }

  private initGrid(): GridOptions {
    return {
      suppressChangeDetection: true,
      columnDefs: [],
      rowData: [],
      suppressRowClickSelection: true,
      suppressCellSelection: true,
      rowHeight: 55,
      enableBrowserTooltips: true,
      suppressContextMenu: true,
      autoSizePadding: 2,
      rowModelType: 'serverSide',
      cacheBlockSize: this.PAGE_SIZE,
      enableCellTextSelection: true,
      defaultColDef: {
        minWidth: 60,
        suppressMenu: true,
        sortable: false,
        resizable: true,
      },
      columnTypes: {
        string: {},
        boolean: {},
        number: {},
      },
      localeText: {
        noRowsToShow: 'No Data',
      },

      onGridReady: ({ api }) => {
        api.setColumnDefs(this.getColumnHeaders());
        this.setServerSideDatasource(api);
        api.sizeColumnsToFit();
      },
    };
  }

  private getColumnHeaders(): Array<any> {
    return [
      {
        headerName: 'Image',
        field: 'img',
        cellRenderer: ({ value }) => `
          <a href="${value}" target="_blank" style="display: flex; align-items: center;"><img src="${value}" alt="Character" style="height: 50px;"></a>`,
      },
      {
        headerName: 'Name',
        field: 'name',
      },
      {
        headerName: 'Nickname',
        field: 'nickname',
      },
      {
        headerName: 'Portrayed By',
        field: 'portrayed',
      },
      {
        headerName: 'Cccupation',
        field: 'occupation',
        valueFormatter: this.arrayFormatter,
      },
      {
        headerName: 'Status',
        field: 'status',
      },
      {
        headerName: 'Seasons',
        field: 'appearance',
        valueFormatter: this.arrayFormatter,
      },
      {
        headerName: 'Category',
        field: 'category',
      },
      {
        headerName: 'Better Call Saul Seasons',
        field: 'better_call_saul_appearance',
        valueFormatter: this.arrayFormatter,
      },
      {
        headerName: 'DoB',
        field: 'birthday',
      },
    ];
  }

  private setServerSideDatasource(api: GridApi): void {
    api.setServerSideDatasource({
      getRows: ({
        successCallback,
        failCallback,
        request,
      }: IServerSideGetRowsParams) => {
        this.getCharacters(
          successCallback,
          failCallback,
          this.PAGE_SIZE,
          request.startRow
        );
      },
    });
  }

  private arrayFormatter = ({ value }) => (value || []).join(', ');
}
