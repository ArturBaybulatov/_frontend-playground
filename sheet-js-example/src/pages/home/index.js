import * as xlsx from 'xlsx';

import * as util from '../../lib/baybulatov-util-js-0.7.0-beta';

import '../../modules/common';

import './index.html';
import './index.less';


const { ensure, handleRejection } = util;


const init = function() {
    const $excelFileInput = ensure.jqElement($('[js-excel-file-input]'));

    let excelFile;

    $excelFileInput.on('change', function() {
        if (!_.isObject(this.files[0])) return;

        excelFile = this.files[0];
        ensure.jqElement($('[js-excel-file-name]')).text(excelFile.name);
    });

    const $parseExcelBtn = ensure.jqElement($('[js-parse-excel-btn]'));

    $parseExcelBtn.on('click', async function() {
        let wb;

        try { wb = ensure.object(await excelToWorkbookAsync(excelFile)) }
        catch (err) { return toastr.error(err.message, 'Failed to convert an Excel file to a workbook') }


        try { log(spreadsheetWorkbookToNms(wb)) }
        catch (err) { return toastr.error(err.message, 'Failed to convert a spreadsheet workbook to nms') }
    });
};


const excelToWorkbookAsync = function(excelFile) {
    return new Promise(function(resolve, reject) {
        try {
            ensure.object(excelFile);

            const fileReader = new FileReader();

            fileReader.onload = function(evt) {
                try { resolve(xlsx.read(new Uint8Array(evt.target.result), { type: 'array' })) }
                catch (err) { reject(err) }
            };

            fileReader.readAsArrayBuffer(excelFile);
        }

        catch (err) { reject(err) }
    });
};


const spreadsheetWorkbookToNms = function(wb) {
    ensure.object(wb, wb.Sheets);
    ensure.nonEmptyArray(wb.SheetNames);

    const rows = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 'A' });

    if (!Number.isInteger(rows[0].A)) {
        toastr.info(rows[0].A, 'Removing first non-integer row...');
        rows.shift();
    }

    return rows.map(row => ensure.integer(row.A));
};


init();
