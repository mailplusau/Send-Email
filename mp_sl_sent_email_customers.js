/**
 * Module Description
 * 
 * NSVersion    Date            			Author         
 * 1.00       	2020-07-20 19:00:26   		Ankith
 *
 * Description:         
 * 
 * @Last Modified by:   Ankith
 * @Last Modified time: 2020-07-22 09:30:38
 *
 */

var baseURL = 'https://1048144.app.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
    baseURL = 'https://1048144-sb3.app.netsuite.com';
}

function sendEmails(request, response) {
    if (request.getMethod() == "GET") {

        var params = request.getParameter('custparam_params');
        if (!isNullorEmpty(params)) {
            // Parameters when reloading from updateProgressBar()
            params = JSON.parse(params);
            
            subject = params.custparam_subject;
            template = params.custparam_template;
            zee = params.custparam_zee;
            result_set_length = params.custparam_result_set_length;

        } else if (!isNullorEmpty(request.getParameter('custparam_result_set_length'))) {
            // Parameters when saving record
            zee = request.getParameter('custparam_zee');
            subject = request.getParameter('custparam_subject');
            template = request.getParameter('custparam_template');
            result_set_length = request.getParameter('custparam_result_set_length');

        }

        var form = nlapiCreateForm('Sent Emails');

        // Load jQuery scripts and bootstrap styles.
        var inlineHtml = '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.16/css/jquery.dataTables.css"><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://1048144.app.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><style>.mandatory{color:red;}</style>';

        inlineHtml += progressBar(result_set_length);
        inlineHtml += recordsDataTable();

        form.addField('preview_table', 'inlinehtml', '').setLayoutType('outsidebelow', 'startrow').setLayoutType('midrow').setDefaultValue(inlineHtml);

        form.addField('custpage_zee', 'text', 'Customer ID').setDisplayType('hidden').setDefaultValue(zee);
        form.addField('custpage_subject', 'text', 'Customer ID').setDisplayType('hidden').setDefaultValue(subject);
        form.addField('custpage_template', 'text', 'Customer ID').setDisplayType('hidden').setDefaultValue(template);
        form.addField('custpage_result_set_length', 'text', 'Customer ID').setDisplayType('hidden').setDefaultValue(result_set_length);

        form.setScript('customscript_cl_sent_email');
        response.writePage(form);

    } else {

    }
}

/**
 * Display the progress bar. Initialized at 0, with the maximum value as the number of records that will be moved.
 * Uses Bootstrap : https://www.w3schools.com/bootstrap/bootstrap_progressbars.asp
 * @param   {String}    nb_records_total    The number of records that will be moved
 * @return  {String}    inlineQty : The inline HTML string of the progress bar.
 */
function progressBar(nb_records_total) {
    var inlineQty = '<div class="progress">';
    inlineQty += '<div class="progress-bar progress-bar-warning" id="progress-records" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="' + nb_records_total + '" style="width:0%">SENT EMAILS : 0 / ' + nb_records_total + '</div>';
    inlineQty += '</div>';
    return inlineQty;
}

function recordsDataTable() {
    var inlineQty = '<style>table#reallocated-barcodes-records {font-size: 12px;text-align: center;border: none;}table {font-size: 14px;}table#reallocated-barcodes-records th{text-align: center;}</style>';
    inlineQty += '<table cellpadding="15" id="reallocated-barcodes-records" class="table table-responsive table-striped customer tablesorter" cellspacing="0" style="width: 100%;">';
    inlineQty += '<thead style="color: white;background-color: #607799;">';
    inlineQty += '<tr class="text-center">';
    inlineQty += '</tr>';
    inlineQty += '</thead>';
    inlineQty += '<tbody></tbody>';
    inlineQty += '</table>';
    return inlineQty;
}