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
        var form = nlapiCreateForm('Under Declaring Package Size Reminder Email');

        var inlinehTML = '';

        var inlinehtml2 = '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2392606&c=1048144&h=a4ffdb532b0447664a84&_xt=.css"/><script type="text/javascript"  src="https://cdn.datatables.net/v/dt/dt-1.10.18/datatables.min.js"></script><script src="https://cdn.datatables.net/fixedheader/3.1.2/js/dataTables.fixedHeader.min.js" type="text/javascript"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedheader/3.1.2/css/fixedHeader.dataTables.min.css"><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://1048144.app.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><link href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.9/summernote.css" rel="stylesheet"><script src="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.9/summernote.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.5/jspdf.debug.js" integrity="sha384-CchuzHs077vGtfhGYl9Qtc7Vx64rXBXdIAZIPbItbNyWIRTdG0oYAqki3Ry13Yzu" crossorigin="anonymous"></script><style>.mandatory{color:red;}ol {margin: 0 0 1.5em;padding: 0;counter-reset: item;}ol > li {margin: 0;padding: 0 0 0 2em;text-indent: -2em;list-style-type: none;counter-increment: item;}ol > li:before {display: inline-block;width: 1em;padding-right: 0.5em;font-weight: bold;text-align: right;content: counter(item) ".";}</style>';

        if (role != 1000) {

            inlinehtml2 += '<div class="col-xs-4 admin_section" style="width: 20%;left: 40%;position: absolute;"><b>Select Zee</b> <select class="form-control zee_dropdown" >';

            //WS Edit: Updated Search to SMC Franchisee (exc Old/Inactives)
            //Search: SMC - Franchisees
            var searched_zee = nlapiLoadSearch('partner', 'customsearch_smc_franchisee');

            var resultSet_zee = searched_zee.runSearch();

            var count_zee = 0;

            var zee_id;

            inlinehtml2 += '<option value=""></option>'

            resultSet_zee.forEachResult(function (searchResult_zee) {
                zee_id = searchResult_zee.getValue('internalid');
                // WS Edit: Updated entityid to companyname
                zee_name = searchResult_zee.getValue('companyname');

                if (request.getParameter('zee') == zee_id) {
                    inlinehtml2 += '<option value="' + zee_id + '" selected="selected">' + zee_name + '</option>';
                } else {
                    inlinehtml2 += '<option value="' + zee_id + '">' + zee_name + '</option>';
                }

                return true;
            });

            inlinehtml2 += '</select></div>';
        }

        if (!isNullorEmpty(request.getParameter('zee'))) {
            zee = request.getParameter('zee');
        }

        form.addField('zee', 'text', 'zee').setDisplayType('hidden').setDefaultValue(zee);
        form.addField('email_count', 'text', 'email_count').setDisplayType('hidden').setDefaultValue(request.getParameter('email_count'));


        //Searcf for Campaign Templates
        var searchedCampTemp = nlapiLoadSearch('customrecord_camp_comm_template', 'customsearch_salesp_campaign_templates');


        var newFiltersCampTemp = new Array();

        newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 2);
        newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
        newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', 1);


        searchedCampTemp.addFilters(newFiltersCampTemp);

        var resultSetCampTemp = searchedCampTemp.runSearch();

        inlinehtml2 += '<br><br><div class="col-xs-6 admin_section" style="margin-top:100px;">'

        inlinehtml2 += dataTable('customers', request.getParameter('email_count'));
        inlinehtml2 += '<br/></div>';

        inlinehtml2 += email_template(resultSetCampTemp);

        form.addField('custpage_template', 'textarea', 'BODY').setDisplayType('hidden');
        form.addField('custpage_subject', 'textarea', 'BODY').setDisplayType('hidden');
        form.addField('custpage_body', 'textarea', 'BODY').setDisplayType('hidden');
        form.addField('custpage_result_set_length', 'textarea', 'BODY').setDisplayType('hidden');
        form.addField('custpage_old_zee', 'textarea', 'BODY').setDisplayType('hidden');

        form.addField('preview_table', 'inlinehtml', '').setLayoutType('outsidebelow', 'startrow').setDefaultValue(inlinehtml2);
        form.setScript('customscript_cl_undeclared_weight_email');
        // form.addButton('pdfprint', 'Print Letters', 'onclick_print()');
        form.addSubmitButton('Send Email');

        response.writePage(form);
    } else {

        var zee = request.getParameter('zee');
        var email_count = request.getParameter('email_count');
        var subject = request.getParameter('custpage_subject');
        var message = request.getParameter('custpage_body');
        var template = request.getParameter('custpage_template');
        var result_set = request.getParameter('custpage_result_set_length');
        var old_zee = request.getParameter('custpage_old_zee');

        var params = {
            custscript_email_count: email_count,
            custscript_excess_weight_template: template
        };
        var reschedule_status = nlapiScheduleScript('customscript_ss_undeclared_weight_email', 'customdeploy1', params);
        nlapiLogExecution('DEBUG', 'reschedule_status', reschedule_status);

        var params_progress = {

        };
        nlapiSetRedirectURL('SUITELET', 'customscript_sl_undeclared_weight_email', 'customdeploy1', null, params_progress);
    }
}

/**
 * [email_template description]
 * @param  {[campaign types from a search]} resultSetCampTemp [description]
 * @return {[string]}                   	html			  [description]
 */
function email_template(resultSetCampTemp) {
    var html = '<div class="col-xs-4 admin_section" style="margin-top:100px;"><div class="form-group container row_to ">';
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

        if (tempId == 157) {
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
function dataTable(name, email_count) {
    var inlineHtml = '<style>table#mpexusage-' +
        name +
        ' {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#mpexusage-' +
        name +
        ' th{text-align: center;} .bolded{font-weight: bold;}</style>';
    inlineHtml += '<div class="form-group container row_template">';
    inlineHtml += '<div class="row">'

    inlineHtml += '<div class="col-xs-8 "><div class="input-group"><span class="input-group-addon">SELECT EMAIL COUNT</span> <select class="form-control email_count" >';
    inlineHtml += '<option value="0"></option>'
    if (!isNullorEmpty(email_count)) {
        if (email_count == '-1') {
            inlineHtml += '<option value="-1" selected>First Time</option>'
            inlineHtml += '<option value="1">1</option>';
            inlineHtml += '<option value="2">2 - 5</option>';
            inlineHtml += '<option value="3">6 - 10</option>';
        } else if (email_count == '1') {
            inlineHtml += '<option value="-1">First Time</option>'
            inlineHtml += '<option value="1" selected>1</option>';
            inlineHtml += '<option value="2">2 - 5</option>';
            inlineHtml += '<option value="3">6 - 10</option>';
        } else if (email_count == '2') {
            inlineHtml += '<option value="-1">First Time</option>'
            inlineHtml += '<option value="1">1</option>';
            inlineHtml += '<option value="2" selected>2 - 5</option>';
            inlineHtml += '<option value="3">6 - 10</option>';
        } else if (email_count == '3') {
            inlineHtml += '<option value="-1">First Time</option>'
            inlineHtml += '<option value="1">1</option>';
            inlineHtml += '<option value="2">2 - 5</option>';
            inlineHtml += '<option value="3" selected>6 - 10</option>';
        }
    }
    inlineHtml += '<option value="-1">First Time</option>'
    inlineHtml += '<option value="1">1</option>';
    inlineHtml += '<option value="2">2 - 5</option>';
    inlineHtml += '<option value="3">6 - 10</option>';
    inlineHtml += '</select></div></div>';
    inlineHtml += '</div>';
    inlineHtml += '</div>';
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