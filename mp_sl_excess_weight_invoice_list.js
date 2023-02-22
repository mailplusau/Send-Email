/**
 * Module Description
 * 
 * NSVersion    Date            			Author         
 * 1.00       	2020-07-20 11:05:54   		Ankith
 *
 * Description:         
 * 
 * @Last Modified by:   ankit
 * @Last Modified time: 2021-03-05 08:18:38
 *
 */

var baseURL = 'https://1048144.app.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
    baseURL = 'https://system.sandbox.netsuite.com';
}

var zee = 0;
var role = nlapiGetRole();

if (role == 1000) {
    zee = nlapiGetUser();
}

function sendEmail(request, response) {

    if (request.getMethod() === "GET") {
        var form = nlapiCreateForm('Mass Email Invoices - Excess Weight Charges');

        var inlinehTML = '';

        var inlinehtml2 =
            '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.16/css/jquery.dataTables.css"><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><script src="https://cdn.datatables.net/searchpanes/1.2.1/js/dataTables.searchPanes.min.js"><script src="https://cdn.datatables.net/select/1.3.3/js/dataTables.select.min.js"></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/drilldown.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/export-data.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script><style>.mandatory{color:red;} .body{background-color: #CFE0CE !important;} @-webkit-keyframes animatetop {from {top:-300px; opacity:0} to {top:0; opacity:1}}@keyframes animatetop {from {top:-300px; opacity:0}to {top:0; opacity:1}}</style>';

        if (!isNullorEmpty(request.getParameter('zee'))) {
            zee = request.getParameter('zee');
        }

        form.addField('zee', 'text', 'zee').setDisplayType('hidden').setDefaultValue(zee);


        //Searcf for Campaign Templates
        var searchedCampTemp = nlapiLoadSearch('customrecord_camp_comm_template', 'customsearch_salesp_campaign_templates');


        var newFiltersCampTemp = new Array();

        newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 2);
        newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
        newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', 1);


        searchedCampTemp.addFilters(newFiltersCampTemp);

        var resultSetCampTemp = searchedCampTemp.runSearch();

        inlinehtml2 += dataTable('customers');



        /**
         * Description - Get the list of Customer that have Trial or Signed Status for a particular zee
         */


        // inlineQty += '</tbody>';
        // inlinehtml2 += '</table><br/></div>';
        // inlinehtml2 += '</div>';

        // inlinehtml2 += email_template(resultSetCampTemp);

        form.addField('custpage_template', 'textarea', 'BODY').setDisplayType('hidden');
        form.addField('custpage_subject', 'textarea', 'BODY').setDisplayType('hidden');
        form.addField('custpage_body', 'textarea', 'BODY').setDisplayType('hidden');
        form.addField('custpage_result_set_length', 'textarea', 'BODY').setDisplayType('hidden');
        form.addField('custpage_old_zee', 'textarea', 'BODY').setDisplayType('hidden');

        form.addField('preview_table', 'inlinehtml', '').setLayoutType('outsidebelow', 'startrow').setLayoutType('midrow').setDefaultValue(inlinehtml2);
        form.setScript('customscript_cl_excess_weight_mass_email');
        // form.addButton('pdfprint', 'Print Letters', 'onclick_print()');
        form.addSubmitButton('Send Email');

        response.writePage(form);
    } else {

        // var zee = request.getParameter('zee');
        // var subject = request.getParameter('custpage_subject');
        // var message = request.getParameter('custpage_body');
        // var template = request.getParameter('custpage_template');
        // var result_set = request.getParameter('custpage_result_set_length');
        // var old_zee = request.getParameter('custpage_old_zee');

        var params = {

        };
        var reschedule_status = nlapiScheduleScript('customscript_ss_excess_weight_send_inv', 'customdeploy1', params);
        nlapiLogExecution('DEBUG', 'reschedule_status', reschedule_status);

        var params_progress = {

        };
        nlapiSetRedirectURL('SUITELET', 'customscript_sl_excess_weight_mass_email', 'customdeploy1', null, params_progress);
    }
}

/**
 * [email_template description]
 * @param  {[campaign types from a search]} resultSetCampTemp [description]
 * @return {[string]}                   	html			  [description]
 */
function email_template(resultSetCampTemp) {
    var html = '<div class="col-xs-6 admin_section" style="margin-top:100px;"><div class="form-group container row_to ">';
    html += '<div class="row">'

    html += '<div class="form-group container row_template">';
    html += '<div class="row">'

    html += '<div class="col-xs-8 template_section hide"><div class="input-group"><span class="input-group-addon">TEMPLATE';

    html += '<span class="mandatory">*</span>';

    html += '</span><select  id="template" class="form-control" ><option></option>';
    resultSetCampTemp.forEachResult(function (searchResultCampTemp) {

        var tempId = searchResultCampTemp.getValue('internalid');
        var tempName = searchResultCampTemp.getValue('name');
        var email_template_id = searchResultCampTemp.getValue('custrecord_camp_comm_email_template');

        if (tempId == 160) {
            html += '<option value="' + tempId + '" >' + tempName + '</option>'
        }

        return true;
    });
    html += '</select></div></div>';
    html += '</div>';
    html += '</div>';


    html += '<div class="form-group container row_subject hide">';
    html += '<div class="row">'
    html += '<div class="col-xs-8 subject_section"><div class="input-group"><span class="input-group-addon">SUBJECT ';
    html += '</span><input type="text" id="subject" class="form-control" /></div></div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="form-group container row_subject hide">';
    html += '<div class="row">'
    html += '<div class="col-xs-8 template_section hide"><div class="input-group"><span class="input-group-addon">SELECT OLD ZEE</span> <select class="form-control old_zee_dropdown" >';

    //WS Edit: Updated Search to SMC Franchisee (exc Old/Inactives)
    //Search: SMC - Franchisees
    var searched_zee = nlapiLoadSearch('partner', 'customsearch_smc_old_franchisee');

    var resultSet_zee = searched_zee.runSearch();

    var count_zee = 0;

    var zee_id;

    html += '<option value=""></option>'

    resultSet_zee.forEachResult(function (searchResult_zee) {
        zee_id = searchResult_zee.getValue('internalid');
        // WS Edit: Updated entityid to companyname
        zee_name = searchResult_zee.getValue('companyname');
        html += '<option value="' + zee_id + '">' + zee_name + '</option>';

        return true;
    });

    html += '</select></div></div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="form-group container row_body hide">';
    html += '<div class="row">'
    html += '<div class="col-xs-12 body_section"><div id="email_body"></div></div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="form-group container row_body ">';
    html += '<div class="row">'
    html += '<div class="col-xs-12 body_section"><textarea id="preview" class="hide"></textarea><iframe id="viewer" frameborder="0" scrolling="no" width="400" height="600" style="display: none;"></iframe></div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    return html;
}

/**
 * The table that will display the differents invoices linked to the
 * franchisee and the time period.
 *
 * @return {String} inlineHtml
 */
function dataTable(name) {
    var inlineHtml = '<style>table#mpexusage-' +
        name +
        ' {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#mpexusage-' +
        name +
        ' th{text-align: center;} .bolded{font-weight: bold;}</style>';
    inlineHtml += '<table id="mpexusage-' +
        name +
        '" class="table table-responsive table-striped customer tablesorter" style="width: 100%;">';
    inlineHtml += '<thead style="color: white;background-color: #095C7B;">';
    inlineHtml += '<tr class="text-center">';

    inlineHtml += '</tr>';
    inlineHtml += '</thead>';

    inlineHtml += '<tbody id="result_usage_' + name + '" ></tbody>';

    inlineHtml += '</table>';
    return inlineHtml;
}

/**
 * [Todays Date]
 * @return {[type]} [description]
 */
function getDate() {
    var date = new Date();
    if (date.getHours() > 6) {
        date = nlapiAddDays(date, 1);
    }
    date = nlapiDateToString(date);

    return date;
}