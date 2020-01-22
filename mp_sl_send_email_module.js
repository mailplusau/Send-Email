/**
 * Module Description
 * 
 * NSVersion    Date            		Author         
 * 1.00       	2018-02-12 16:42:05   	Ankith 
 *
 * Remarks: New Address Module        
 * 
 * @Last Modified by:   Ankith
 * @Last Modified time: 2020-01-23 08:14:24
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
} else if (role == 3) { //Administrator
    zee = 6; //test
} else if (role == 1032) { // System Support
    zee = 425904; //test-AR
}

function sendEmail(request, response) {

    if (request.getMethod() === "GET") {

        var params = request.getParameter('params');
        var customer_id = request.getParameter('custid');
        var closed_won = request.getParameter('closedwon');
        var opp_with_value = request.getParameter('oppwithvalue');

        if (isNullorEmpty(params)) {
            var params = request.getParameter('custparam_params');
        }

        var callback;

        var nosale = null;

        if (isNullorEmpty(customer_id)) {
            entryParamsString = params;

            params = JSON.parse(params);

            var customer_id = parseInt(params.custid);
            var customer_record = nlapiLoadRecord('customer', customer_id);
            var customer_status = customer_record.getFieldValue('entitystatus');
            var zee = customer_record.getFieldValue('partner');
            var zeeText = customer_record.getFieldText('partner');
            var sales_record_id = parseInt(params.sales_record_id);
            var id = params.id;
            var deployid = params.deploy;
            callback = params.callback;
            nosale = params.nosale;
        } else {
            var customer_id = parseInt(request.getParameter('custid'));
            var customer_record = nlapiLoadRecord('customer', customer_id);
            var customer_status = customer_record.getFieldValue('entitystatus');
            var zee = customer_record.getFieldValue('partner');
            var zeeText = customer_record.getFieldText('partner');

            var sales_record_id = parseInt(request.getParameter('sales_record_id'));
            var id = request.getParameter('script_id');
            var deployid = request.getParameter('script_deploy');
        }



        //Search for Commencement Register
        var newFiltersCommReg = new Array();
        newFiltersCommReg[newFiltersCommReg.length] = new nlobjSearchFilter('custrecord_commreg_sales_record', null, 'anyof', sales_record_id);
        newFiltersCommReg[newFiltersCommReg.length] = new nlobjSearchFilter('custrecord_customer', null, 'anyof', customer_id);
        newFiltersCommReg[newFiltersCommReg.length] = new nlobjSearchFilter('custrecord_trial_status', null, 'anyof', 10);

        var col = new Array();
        col[0] = new nlobjSearchColumn('internalId');
        col[1] = new nlobjSearchColumn('custrecord_date_entry');
        col[2] = new nlobjSearchColumn('custrecord_sale_type');
        col[3] = new nlobjSearchColumn('custrecord_franchisee');
        col[4] = new nlobjSearchColumn('custrecord_comm_date');
        col[5] = new nlobjSearchColumn('custrecord_in_out');
        col[6] = new nlobjSearchColumn('custrecord_customer');
        col[7] = new nlobjSearchColumn('custrecord_trial_status');
        col[7] = new nlobjSearchColumn('custrecord_comm_date_signup');

        var old_comm_reg;
        var commReg = null;
        var customer_comm_reg;
        var comm_reg_results = nlapiSearchRecord('customrecord_commencement_register', null, newFiltersCommReg, col);

        if (!isNullorEmpty(comm_reg_results)) {
            if (comm_reg_results.length == 1) {
                commReg = comm_reg_results[0].getValue('internalid');
            } else if (comm_reg_results.length > 1) {

            }
        }

        //Search for Service Change related to the customer
        var resultSet_service_change = null;

        nlapiLogExecution('DEBUG', 'commReg', commReg)

        if (!isNullorEmpty(commReg)) {
            var searched_service_change = nlapiLoadSearch('customrecord_servicechg', 'customsearch_salesp_service_chg');

            var newFilters = new Array();
            newFilters[newFilters.length] = new nlobjSearchFilter("custrecord_service_customer", "CUSTRECORD_SERVICECHG_SERVICE", 'is', customer_id);
            newFilters[newFilters.length] = new nlobjSearchFilter("custrecord_servicechg_comm_reg", null, 'is', commReg);
            newFilters[newFilters.length] = new nlobjSearchFilter('custrecord_servicechg_status', null, 'anyof', [4]);

            searched_service_change.addFilters(newFilters);

            resultSet_service_change = searched_service_change.runSearch();
        }


        //Search for contact related to the customer
        var searched_contact = nlapiLoadSearch('contact', 'customsearch_salesp_contacts');

        var newFilters_contact = new Array();
        newFilters_contact[newFilters_contact.length] = new nlobjSearchFilter('company', null, 'is', customer_id);
        newFilters_contact[newFilters_contact.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
        newFilters_contact[newFilters_contact.length] = new nlobjSearchFilter('email', null, 'isnotempty', null);

        searched_contact.addFilters(newFilters_contact);

        var resultSet_contacts = searched_contact.runSearch();

        var contactResult = resultSet_contacts.getResults(0, 1);

        //Searcf for Campaign Templates
        var searchedCampTemp = nlapiLoadSearch('customrecord_camp_comm_template', 'customsearch_salesp_campaign_templates');


        var newFiltersCampTemp = new Array();
        if (customer_status == 13) {
            newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 2);
        } else {
            newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 1);
        }

        newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
        if (isNullorEmpty(nosale)) {
            newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', 1);
        } else if (nosale == 'T') {
            newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', 6);
        }

        searchedCampTemp.addFilters(newFiltersCampTemp);

        var resultSetCampTemp = searchedCampTemp.runSearch();

        //Search for Attachments
        var searchedAtt = nlapiLoadSearch('customrecord_comm_attachment', 'customsearch_salesp_attachments');

        var newFiltersAtt = new Array();
        if (customer_status == 13) {
            newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_camptype', null, 'anyof', 2);
        } else {
            newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_camptype', null, 'anyof', 1);
        }

        newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_commtype', null, 'anyof', 1);

        // newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
        // Waiting on Bug Fix on NetSuite. Search cannot retrieve file.URL 
        // newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_commtype', null, 'anyof', 1);

        searchedAtt.addFilters(newFiltersAtt);

        var resultSetAtt = searchedAtt.runSearch();

        if (isNullorEmpty(callback) && isNullorEmpty(nosale)) {
            var form = nlapiCreateForm('Send Email: <a href="' + baseURL + '/app/common/entity/custjob.nl?id=' + customer_id + '">' + customer_record.getFieldValue('entityid') + '</a> ' + customer_record.getFieldValue('companyname'));
        } else if (nosale == 'T') {
            var form = nlapiCreateForm('LOST: <a href="' + baseURL + '/app/common/entity/custjob.nl?id=' + customer_id + '">' + customer_record.getFieldValue('entityid') + '</a> ' + customer_record.getFieldValue('companyname'));
        } else if (callback == 'T') {
            var form = nlapiCreateForm('Set Appointment: <a href="' + baseURL + '/app/common/entity/custjob.nl?id=' + customer_id + '">' + customer_record.getFieldValue('entityid') + '</a> ' + customer_record.getFieldValue('companyname'));
        }


        form.addField('custpage_customer_id', 'integer', 'Customer ID').setDisplayType('hidden').setDefaultValue(customer_id);
        form.addField('custpage_commreg', 'integer', 'Customer ID').setDisplayType('hidden').setDefaultValue(commReg);
        form.addField('custpage_customer_status', 'integer', 'Customer ID').setDisplayType('hidden').setDefaultValue(customer_status);
        form.addField('custpage_sales_record_id', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(sales_record_id);
        if (!isNullorEmpty(id) && !isNullorEmpty(deployid)) {
            form.addField('custpage_suitlet', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(id);
            form.addField('custpage_deploy', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(deployid);
        }

        form.addField('custpage_to', 'textarea', 'TO').setDisplayType('hidden');
        form.addField('custpage_cc', 'textarea', 'CC').setDisplayType('hidden');
        form.addField('custpage_subject', 'textarea', 'SUBJECT').setDisplayType('hidden');
        form.addField('custpage_dear', 'textarea', 'DEAR').setDisplayType('hidden');
        form.addField('custpage_body', 'textarea', 'BODY').setDisplayType('hidden');
        form.addField('custpage_attachments', 'textarea', 'BODY').setDisplayType('hidden');
        form.addField('custpage_scf', 'textarea', 'BODY').setDisplayType('hidden');
        form.addField('custpage_sof', 'textarea', 'BODY').setDisplayType('hidden');
        form.addField('custpage_field_names', 'textarea', 'BODY').setDisplayType('hidden');
        form.addField('custpage_field_values', 'textarea', 'BODY').setDisplayType('hidden');
        form.addField('custpage_closed_won', 'textarea', 'BODY').setDisplayType('hidden').setDefaultValue(closed_won);
        form.addField('custpage_opp_with_values', 'textarea', 'BODY').setDisplayType('hidden').setDefaultValue(opp_with_value);
        form.addField('custpage_save_record', 'textarea', 'BODY').setDisplayType('hidden').setDefaultValue('F');


        form.addField('custpage_callbackdate', 'textarea', 'BODY').setDisplayType('hidden');
        form.addField('custpage_callbacktime', 'textarea', 'BODY').setDisplayType('hidden');
        form.addField('custpage_callnotes', 'textarea', 'BODY').setDisplayType('hidden');

        if (isNullorEmpty(nosale)) {
            form.addField('custpage_outcome', 'textarea', 'BODY').setDisplayType('hidden');
        } else if (nosale == 'T') {
            form.addField('custpage_outcome', 'textarea', 'BODY').setDisplayType('hidden').setDefaultValue('nosale');
        }

        form.addField('custpage_callback', 'textarea', 'BODY').setDisplayType('hidden').setDefaultValue(callback);
        form.addField('custpage_nosalereason', 'textarea', 'BODY').setDisplayType('hidden');



        var inlinehTML = '';

        var inlinehtml2 = '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link type="text/css" rel="stylesheet" href="https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css"><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2060796&amp;c=1048144&amp;h=9ee6accfd476c9cae718&amp;_xt=.css"><script src="https://1048144.app.netsuite.com/core/media/media.nl?id=2060797&amp;c=1048144&amp;h=ef2cda20731d146b5e98&amp;_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2090583&amp;c=1048144&amp;h=a0ef6ac4e28f91203dfe&amp;_xt=.css"><script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script><link type="text/css" rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2090583&amp;c=1048144&amp;h=a0ef6ac4e28f91203dfe&amp;_xt=.css"><link href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.9/summernote.css" rel="stylesheet"><script src="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.9/summernote.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.5/jspdf.debug.js" integrity="sha384-CchuzHs077vGtfhGYl9Qtc7Vx64rXBXdIAZIPbItbNyWIRTdG0oYAqki3Ry13Yzu" crossorigin="anonymous"></script><style>.mandatory{color:red;}ol {margin: 0 0 1.5em;padding: 0;counter-reset: item;}ol > li {margin: 0;padding: 0 0 0 2em;text-indent: -2em;list-style-type: none;counter-increment: item;}ol > li:before {display: inline-block;width: 1em;padding-right: 0.5em;font-weight: bold;text-align: right;content: counter(item) ".";}</style>';


        inlinehtml2 += '<div class="se-pre-con"></div><div id="myModal" class="modal fade" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Modal Header</h4></div><div class="modal-body"><div id="summernote">Hello Summernote</div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div><div style=\"background-color: #cfeefc !important;border: 1px solid #417ed9;padding: 10px 10px 10px 20px;width:96%;position:absolute\"><b><u>Important Instructions:</u></b><br><b>Purpose:</b> This page will send a Quote or Service Commencement Form for the customer to sign. You can also save this information and not email it however you will need to set a callback date to save your work.<br><ol><li> Select either Closed Won or Opportunity with Value</li><li>Complete the Services & Price tab to confirm the services to quote or sign-up</li><li>Select any appropriate forms or brochures you want to complete or email (note: service commencement and standing order are mandatory to sign-up a customer)</li><li>Set a callback and save your work or specify who to send the information to and Select Send Email to finalise.</li></ol></div><br/><br/><br><br><br><br><div class="container" style="padding-top: 3%;"><div id="alert" class="alert alert-danger fade in "></div>';

        if (isNullorEmpty(callback) && isNullorEmpty(nosale)) {
            var email_class = '';
            var callback_class = '';
            var attachments_class = 'active';
        } else if (nosale == 'T') {
            var email_class = 'active';
            var callback_class = 'hide';
            var attachments_class = 'hide';
        } else if (callback == 'T') {
            var callback_class = 'active';
            var email_class = 'hide';
            var attachments_class = 'hide';
        }

        inlinehTML += '<form id="myForm">';
        if (callback == 'T') {
            inlinehTML += '<div class="tabs main_tabs "><ul class="nav nav-pills nav-justified" style="padding-top: 3%;">';

            var tab_content = '';
            inlinehTML += '<li role="presentation" class="callback_li ' + callback_class + '" style="font-weight: bold;"><a href="#callback"><u>SET APPOINTMENT</u></a></li>';
            inlinehTML += '</ul>';
        } else if (nosale == 'T') {
            inlinehTML += '<div class="tabs main_tabs "><ul class="nav nav-pills nav-justified" style="padding-top: 3%;">';

            var tab_content = '';
            inlinehTML += '<li role="presentation" class="email_li ' + email_class + '" style="font-weight: bold;"><a href="#email"><u>EMAIL & CALL BACK</u></a></li>';
            inlinehTML += '</ul>';
        } else {
            inlinehTML += '<div class="form-group container row_form_quote">';
            inlinehTML += '<div class="row">';
            inlinehTML += '<div class="col-xs-4 form_section"><div class="input-group"><input type="text" class="form-control" readonly value="CLOSED WON" /><span class="input-group-addon">';
            if (closed_won == 'T') {
                inlinehTML += '<input type="checkbox" checked id="form" class="" />';
            } else {
                inlinehTML += '<input type="checkbox" id="form" class="" />';
            }
            inlinehTML += '</span></div></div>';
            inlinehTML += '<div class="col-xs-4 quote_section"><div class="input-group"><input type="text" class="form-control" readonly value="OPPORTUNITY WITH VALUE" /><span class="input-group-addon">';
            if (opp_with_value == 'T') {
                inlinehTML += '<input type="checkbox" checked id="quote" class="" />';
            } else {
                inlinehTML += '<input type="checkbox" id="quote" class="" />';
            }

            inlinehTML += '</span></div></div>';
            // inlinehTML += '<div class="col-xs-4 quote_section"><div class="input-group"><input type="text" class="form-control" readonly value="PROGRESS WITHOUT EMAIL" /><span class="input-group-addon"><input type="checkbox" id="no_email" class="" /></span></div></div>';
            inlinehTML += '</div>';
            inlinehTML += '</div>';


            inlinehTML += '<div class="tabs main_tabs hide"><ul class="nav nav-pills nav-justified" style="padding-top: 3%;">';

            var tab_content = '';

            if (isNullorEmpty(callback) && isNullorEmpty(nosale)) {
                inlinehTML += '<li role="presentation" class="services_li ' + attachments_class + '" style="font-weight: bold;"><a href="#services"><u>SERVICES & PRICE</u></a></li>';
                inlinehTML += '<li role="presentation" class="attachments_li" style="font-weight: bold;"><a href="#attachments_link"><u>FORMS & BROCHURES</u></a></li>'
            }

            inlinehTML += '<li role="presentation" class="email_li ' + email_class + '" style="font-weight: bold;"><a href="#email"><u>EMAIL & CALL BACK</u></a></li>';

            if (callback == 'T') {
                inlinehTML += '<li role="presentation" class="callback_li ' + callback_class + '" style="font-weight: bold;"><a href="#callback"><u>SET APPOINTMENT</u></a></li>';
            }



            inlinehTML += '</ul>';
        }


        if (isNullorEmpty(callback)) {


            if (isNullorEmpty(nosale)) {
                //Attachments Tab Contenet
                tab_content += '<div role="tabpanel" class="tab-pane " id="attachments_link">';
                tab_content += attachmentsSection(resultSetAtt);
                tab_content += '</div>';

                //Service Details Tab Content
                tab_content += '<div role="tabpanel" class="tab-pane ' + attachments_class + '" id="services">';
                tab_content += serviceChangeSection(resultSet_service_change);
                tab_content += '</div>';
            }


            //Email Template Tab Contenet
            tab_content += '<div role="tabpanel" class="tab-pane ' + email_class + '" id="email">';
            tab_content += email_template(resultSetCampTemp, contactResult, resultSet_contacts, nosale);
            tab_content += '</div>';


            //Call Back Tab Contenet
        } else if (callback == 'T') {
            tab_content += '<div role="tabpanel" class="tab-pane ' + callback_class + '" id="callback">';
            tab_content += call_back();
            tab_content += '</div>';
        }



        inlinehTML += '<div class="tab-content" style="padding-top: 3%;">';

        inlinehTML += tab_content;

        inlinehTML += '</div></div>';



        form.addField('preview_table', 'inlinehtml', '').setLayoutType('outsidebelow', 'startrow').setDefaultValue(inlinehTML);
        if (callback == 'T') {
            form.addField('sales_rep', 'select', 'Allocate to Sales Rep', 'employee').setLayoutType('outsidebelow', 'startrow');
        }

        form.addField('custpage_html2', 'inlinehtml').setPadding(1).setLayoutType('outsideabove').setDefaultValue(inlinehtml2);

        form.setScript('customscript_cl_send_email_module');

        form.addSubmitButton('Send Email');
        form.addButton('update_record', 'Save', 'onclick_update()');
        form.addButton('back', 'Back', 'onclick_back()');
        form.addButton('reset', 'Reset', 'onclick_reset()');

        response.writePage(form);

    } else {

        var custId = parseInt(request.getParameter('custpage_customer_id'));
        var commRegId = parseInt(request.getParameter('custpage_commreg'));
        var To = request.getParameter('custpage_to');
        var cc = isNullorEmpty(request.getParameter('custpage_cc')) ? null : request.getParameter('custpage_cc');
        var dear = request.getParameter('custpage_dear');
        var subject = request.getParameter('custpage_subject');
        var message = request.getParameter('custpage_body');
        var franchiseeEmail = nlapiLookupField('customer', custId, 'partner.email');
        var attSOForm = request.getParameter('custpage_sof');
        var attSCForm = request.getParameter('custpage_scf');
        var attachments = request.getParameter('custpage_attachments');
        var callback = request.getParameter('custpage_callback');
        var callbackdate = request.getParameter('custpage_callbackdate');
        var callbacktime = request.getParameter('custpage_callbacktime');
        var callnotes = request.getParameter('custpage_callnotes');

        nlapiLogExecution('DEBUG', 'attSOForm', attSOForm)
        nlapiLogExecution('DEBUG', 'attSCForm', attSCForm)

        var sales_rep_id;

        // var stage = request.getParameter('stage');
        var stage = null;
        var start_date = null;
        var end_date = null;
        // var template = request.getParameter('template');
        var sales_record_id = parseInt(request.getParameter('custpage_sales_record_id'));

        var nosalereason = request.getParameter('custpage_nosalereason');


        if (!isNullorEmpty(cc)) {
            cc = cc.replace(/\s/g, "");

            var CC = cc.split(",");
        } else {
            var CC = null;
        }

        var outcome = request.getParameter('custpage_outcome');

        nlapiLogExecution('DEBUG', 'outcome', outcome)

        var recCustomer = nlapiLoadRecord('customer', custId);

        var customerStatus = recCustomer.getFieldValue('entitystatus');

        var recSales = nlapiLoadRecord('customrecord_sales', sales_record_id);
        var sales_emails_count = recSales.getFieldValue('custrecord_sales_email_count');
        var sales_campaign = recSales.getFieldValue('custrecord_sales_campaign');
        sales_emails_count++;
        recSales.setFieldValue('custrecord_sales_email_count', sales_emails_count);
        if (isNullorEmpty(commRegId)) {
            recSales.setFieldValue('custrecord_sales_commreg', commRegId);
        }
        var sales_campaign_record = nlapiLoadRecord('customrecord_salescampaign', sales_campaign);
        var sales_campaign_type = sales_campaign_record.getFieldValue('custrecord_salescampaign_recordtype');
        var sales_campaign_name = sales_campaign_record.getFieldValue('name');


        var phonecall = nlapiCreateRecord('phonecall');
        phonecall.setFieldValue('assigned', recCustomer.getFieldValue('partner'));
        phonecall.setFieldValue('custevent_organiser', nlapiGetUser());
        phonecall.setFieldValue('startdate', getDate());
        phonecall.setFieldValue('company', custId);
        phonecall.setFieldText('status', 'Completed');
        phonecall.setFieldValue('custevent_call_type', 2);


        if (isNullorEmpty(callback)) {

            if (isNullorEmpty(attSOForm) && isNullorEmpty(attSCForm)) {
                var arrAttachments = [];
            } else {
                if (!isNullorEmpty(request.getParameter('custpage_sof'))) {
                    attSOForm = parseInt(request.getParameter('custpage_sof'));
                }
                if (!isNullorEmpty(request.getParameter('custpage_scf'))) {
                    attSCForm = parseInt(request.getParameter('custpage_scf'));
                }
                nlapiLogExecution('DEBUG', 'attSOForm', attSOForm)
                nlapiLogExecution('DEBUG', 'attSCForm', attSCForm)
                var arrAttachments = getAttachments(custId, commRegId, attSCForm, attSOForm, stage, start_date, end_date, sales_record_id);
            }


            var contact_filter = new Array();
            contact_filter[0] = new nlobjSearchFilter('company', null, 'is', custId);
            contact_filter[1] = new nlobjSearchFilter('contactrole', null, 'anyof', [-10, -30]);

            var contact_col = new Array();
            contact_col[0] = new nlobjSearchColumn('internalId');

            var contact_results = nlapiSearchRecord('contact', null, contact_filter, contact_col);
            if (!isNullorEmpty(contact_results)) {
                // if (contact_results.length == 1) {

                nlapiLogExecution('DEBUG', 'attachments', arrAttachments)
                nlapiLogExecution('DEBUG', 'attachments', attachments)

                attachments = attachments.split('|');
                for (m = 0; m < attachments.length; m++) {
                    if (!isNullorEmpty(attachments[m])) {
                        attachments[m] = attachments[m].replace(/[^a-zA-Z0-9]/g, '');
                        arrAttachments.push(nlapiLoadFile(parseInt(attachments[m])));
                    }
                }

                var records = new Array();
                records['entity'] = custId;

                if (!isNullorEmpty(To) && !isNullorEmpty(subject) && !isNullorEmpty(message)) {

                    nlapiSendEmail(nlapiGetUser(), To, subject, message, CC, nlapiGetContext().getEmail(), records, arrAttachments);
                } else if (outcome != 'nosale') {
                    if (To != 0) {
                        error_subject = 'Empty Fields for ' + recCustomer.getFieldValue('entityid');
                        nlapiSendEmail(409635, nlapiGetUser(), error_subject, 'Please enter Mandatory Fields TO/SUBJECT/MESSAGE before attempting to resend Communication. Email has not been sent.', ['ankith.ravindran@mailplus.com.au']);
                    }

                }
                // } else {
                // 	error_subject = 'Multiple Primary Contacts for Customer ID ' + recCustomer.getFieldValue('entityid');
                // 	nlapiSendEmail(409635, nlapiGetUser(), error_subject, 'Please enter Primary Contact Details before attempting to resend Communication. Email has not been sent.', ['ankith.ravindran@mailplus.com.au', 'willian.suryadharma@mailplus.com.au']);
                // }
            } else if (outcome != 'nosale') {
                if (To != 0) {
                    error_subject = 'No Primary Contacts for Customer ID ' + recCustomer.getFieldValue('entityid');
                    nlapiSendEmail(409635, nlapiGetUser(), error_subject, 'Please enter Primary Contact Details before attempting to resend Communication. Email has not been sent.', ['ankith.ravindran@mailplus.com.au']);
                }
            }


        } else if (callback == 'T') {

        }


        if (outcome == 'callback') {

            sales_rep_id = request.getParameter('sales_rep');
            nlapiLogExecution('DEBUG', 'sales_rep_id', sales_rep_id)

            if (sales_campaign_type != 1) {
                if (customerStatus != 13) {
                    recCustomer.setFieldValue('entitystatus', 8);
                }
                recCustomer.setFieldValue('custentity_date_prospect_in_contact', getDate());
                if (isNullorEmpty(sales_rep_id)) {
                    phonecall.setFieldValue('title', 'Sales - ' + sales_campaign_name + ' - Callback');
                } else {
                    phonecall.setFieldValue('title', 'Sales - ' + sales_campaign_name + ' - Assigned to Sales Rep');
                    phonecall.setFieldValue('custevent_call_type', 7);

                }

            } else {
                if (isNullorEmpty(sales_rep_id)) {
                    phonecall.setFieldValue('title', 'XSales - ' + sales_campaign_name + ' - Callback');
                } else {
                    phonecall.setFieldValue('title', 'XSales - ' + sales_campaign_name + ' - Assigned to Sales Rep');
                    phonecall.setFieldValue('custevent_call_type', 7);

                }
            }

            phonecall.setFieldValue('message', callnotes);
            phonecall.setFieldValue('custevent_call_outcome', 17);

            recSales.setFieldValue('custrecord_sales_completed', "F");
            recSales.setFieldValue('custrecord_sales_inuse', "F");
            recSales.setFieldValue('custrecord_sales_outcome', 5);



            if (!isNullorEmpty(sales_rep_id)) {
                recSales.setFieldValue('custrecord_sales_deactivated', 'T');
                recSales.setFieldValue('custrecord_sales_completed', 'T');

                nlapiSubmitRecord(recSales);


                var recordtoCreate = nlapiCreateRecord('customrecord_sales');
                var date2 = new Date();
                var subject = '';
                var body = '';

                var userRole = parseInt(nlapiGetContext().getRole());

                // Set customer, campaign, user, last outcome, callback date
                recordtoCreate.setFieldValue('custrecord_sales_customer', custId);
                recordtoCreate.setFieldValue('custrecord_sales_campaign', sales_campaign);

                recordtoCreate.setFieldValue('custrecord_sales_assigned', sales_rep_id);

                recordtoCreate.setFieldValue('custrecord_sales_outcome', 5);
                recordtoCreate.setFieldValue('custrecord_sales_callbackdate', callbackdate);
                recordtoCreate.setFieldValue('custrecord_sales_callbacktime', callbacktime);
                recordtoCreate.setFieldValue('custrecord_sales_appt', 'T');
                nlapiSubmitRecord(recordtoCreate);

                var cust_id_link = 'https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + custId;

                body = 'New sales record has been created. \n You have been assigned a lead. Please respond in an hour. \n Link: ' + cust_id_link;

                nlapiSendEmail(112209, sales_rep_id, 'Sales Lead', body, null);
            }


        } else if (outcome == 'sendinfo') {
            if (sales_campaign_type != 1) {
                if (customerStatus != 13) {
                    recCustomer.setFieldValue('entitystatus', 19);
                }
                //Set the Date - Prospect Opportunity
                recCustomer.setFieldValue('custentity_date_prospect_opportunity', getDate());
                phonecall.setFieldValue('title', 'Sales - ' + sales_campaign_name + ' - Info Sent');
            } else {
                phonecall.setFieldValue('title', ' X Sales - ' + sales_campaign_name + ' - Info Sent');
            }


            phonecall.setFieldValue('message', callnotes);
            phonecall.setFieldValue('custevent_call_outcome', 17);

            recSales.setFieldValue('custrecord_sales_completed', "F");
            recSales.setFieldValue('custrecord_sales_infosent', "T");
            recSales.setFieldValue('custrecord_sales_inuse', "F");

            recSales.setFieldValue('custrecord_sales_outcome', 4);

        } else if (outcome == 'sendform') {
            if (sales_campaign_type != 1) {
                if (customerStatus != 13) {
                    recCustomer.setFieldValue('entitystatus', 51);
                }
                //Set the Date - Prospect Opportunity & Closed Won
                recCustomer.setFieldValue('custentity_date_prospect_opportunity', getDate());
                recCustomer.setFieldValue('custentity_cust_closed_won', 'T');
                phonecall.setFieldValue('title', 'Sales - ' + sales_campaign_name + ' - Forms Sent');
            } else {
                phonecall.setFieldValue('title', 'X Sales - ' + sales_campaign_name + ' - Forms Sent');
            }


            phonecall.setFieldValue('message', callnotes);
            phonecall.setFieldValue('custevent_call_outcome', 24);

            recSales.setFieldValue('custrecord_sales_completed', "F");
            recSales.setFieldValue('custrecord_sales_formsent', 'T');
            recSales.setFieldValue('custrecord_sales_inuse', "F");
            recSales.setFieldValue('custrecord_sales_outcome', 14);
        } else if (outcome == 'sendquote') {
            if (sales_campaign_type != 1) {
                recCustomer.setFieldValue('entitystatus', 50);
                //Set the Date - Prospect Opportunity.
                recCustomer.setFieldValue('custentity_date_prospect_opportunity', getDate());
                phonecall.setFieldValue('title', 'Sales - ' + sales_campaign_name + ' - Quote Sent');
            } else {
                phonecall.setFieldValue('title', 'X Sales - ' + sales_campaign_name + ' - Quote Sent');
            }


            phonecall.setFieldValue('message', callnotes);
            phonecall.setFieldValue('custevent_call_outcome', 23);

            recSales.setFieldValue('custrecord_sales_completed', "F");
            recSales.setFieldValue('custrecord_sales_quotesent', "T");
            recSales.setFieldValue('custrecord_sales_inuse', "F");
            recSales.setFieldValue('custrecord_sales_outcome', 15);
        } else if (outcome == 'sendformquote') {
            if (sales_campaign_type != 1) {
                if (customerStatus != 13) {
                    recCustomer.setFieldValue('entitystatus', 51);
                }
                recCustomer.setFieldValue('custentity_date_prospect_opportunity', getDate());
                phonecall.setFieldValue('title', 'Sales - ' + sales_campaign_name + ' - Forms Sent');
            } else {
                phonecall.setFieldValue('title', 'X Sales - ' + sales_campaign_name + ' - Forms Sent');
            }


            phonecall.setFieldValue('message', callnotes);
            phonecall.setFieldValue('custevent_call_outcome', 24);

            recSales.setFieldValue('custrecord_sales_completed', "F");
            recSales.setFieldValue('custrecord_sales_formsent', 'T');
            recSales.setFieldValue('custrecord_sales_quotesent', "T");
            recSales.setFieldValue('custrecord_sales_inuse', "F");
            recSales.setFieldValue('custrecord_sales_outcome', 14);
        } else if (outcome == 'nosale') {
            if (sales_campaign_type != 1) {
                if (customerStatus != 13) {
                    recCustomer.setFieldValue('entitystatus', 59);
                }
                recCustomer.setFieldValue('custentity_date_lead_lost', getDate());
                phonecall.setFieldValue('title', 'Sales - ' + sales_campaign_name + ' - LOST');
            } else {
                phonecall.setFieldValue('title', 'X Sales - ' + sales_campaign_name + ' - LOST');
            }


            phonecall.setFieldValue('message', callnotes);
            phonecall.setFieldValue('custevent_call_outcome', 16);

            recSales.setFieldValue('custrecord_sales_completed', "T");
            recSales.setFieldValue('custrecord_sales_inuse', "F");
            recSales.setFieldValue('custrecord_sales_completedate', getDate());
            recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
            recSales.setFieldValue('custrecord_sales_outcome', 10);
            recSales.setFieldValue('custrecord_sales_nosalereason', nosalereason);
            recSales.setFieldValue('custrecord_sales_callbackdate', '');
            recSales.setFieldValue('custrecord_sales_callbacktime', '');
            recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());
        }

        if (isNullorEmpty(sales_rep_id)) {
            recSales.setFieldValue('custrecord_sales_callbackdate', callbackdate);
            recSales.setFieldValue('custrecord_sales_callbacktime', callbacktime);
            recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
            recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());
            nlapiSubmitRecord(recSales);
        }

        nlapiSubmitRecord(recCustomer);
        nlapiSubmitRecord(phonecall);


        response.sendRedirect('RECORD', 'customer', custId, false);

    }
}

function getAttachments(custId, commRegId, attSCForm, attSOForm, stage, start_date, end_date, sales_record_id) {
    var recCustomer = nlapiLoadRecord('customer', custId);

    var customerName = recCustomer.getFieldValue('companyname');
    //var recCommReg = nlapiLoadRecord('customrecord_commencement_register', request.getParameter('commreg'));


    var recSales = nlapiLoadRecord('customrecord_sales', sales_record_id);
    var salesreptext = recSales.getFieldText('custrecord_sales_assigned');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('company', null, 'anyof', custId);
    filters[1] = new nlobjSearchFilter('isinactive', null, 'is', "F");
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('salutation');
    columns[1] = new nlobjSearchColumn('firstname');
    columns[2] = new nlobjSearchColumn('lastname');
    columns[3] = new nlobjSearchColumn('contactrole');

    var searchResults = nlapiSearchRecord('contact', null, filters, columns);

    var primarycontact = '';
    var primaryfirstname = '';
    var decisioncontact = '';
    var decisionfirstname = '';
    var apcontact = '';

    if (!isNullorEmpty(searchResults)) {
        for (m = 0; m < searchResults.length; m++) {
            if (parseInt(searchResults[m].getValue(columns[3])) == 1) {
                apcontact = searchResults[m].getValue(columns[1]) + ' ' + searchResults[m].getValue(columns[2]);
            }

            if (parseInt(searchResults[m].getValue(columns[3])) == -10) {
                primarycontact = searchResults[m].getValue(columns[1]) + ' ' + searchResults[m].getValue(columns[2]);
                primaryfirstname = searchResults[m].getValue(columns[1]);
            }

            if (parseInt(searchResults[m].getValue(columns[3])) == -30) {
                decisioncontact = searchResults[m].getValue(columns[1]) + ' ' + searchResults[m].getValue(columns[2]);
                decisionfirstname = searchResults[m].getValue(columns[1]);
            }


        }
    }

    var searched_service_change = nlapiLoadSearch('customrecord_servicechg', 'customsearch_salesp_service_chg');

    var newFilters = new Array();
    newFilters[newFilters.length] = new nlobjSearchFilter("custrecord_service_customer", "CUSTRECORD_SERVICECHG_SERVICE", 'is', custId);
    newFilters[newFilters.length] = new nlobjSearchFilter("custrecord_servicechg_comm_reg", null, 'is', commRegId);
    newFilters[newFilters.length] = new nlobjSearchFilter('custrecord_servicechg_status', null, 'anyof', [4]);

    searched_service_change.addFilters(newFilters);

    resultSet_service_change = searched_service_change.runSearch();

    var serviceResult = resultSet_service_change.getResults(0, 6);

    var service = [];
    var price = [];

    var service_freq = '';

    var dateEffective = null;

    for (n = 0; n < serviceResult.length; n++) {
        var serviceChangeId = serviceResult[n].getValue('internalid');
        var serviceId = serviceResult[n].getValue('custrecord_servicechg_service');
        var serviceText = serviceResult[n].getText('custrecord_servicechg_service');
        var serviceDescp = serviceResult[n].getValue("custrecord_service_description", "CUSTRECORD_SERVICECHG_SERVICE", null);
        var oldServicePrice = serviceResult[n].getValue("custrecord_service_price", "CUSTRECORD_SERVICECHG_SERVICE", null);
        var serviceNSItem = serviceResult[n].getValue("custrecord_service_ns_item", "CUSTRECORD_SERVICECHG_SERVICE", null);
        var serviceNSItemText = serviceResult[n].getText("custrecord_service_ns_item", "CUSTRECORD_SERVICECHG_SERVICE", null);
        var newServiceChangePrice = serviceResult[n].getValue('custrecord_servicechg_new_price');
        dateEffective = serviceResult[n].getValue('custrecord_servicechg_date_effective');
        var commRegId = serviceResult[n].getValue('custrecord_servicechg_comm_reg');
        var serviceChangeTypeText = serviceResult[n].getText('custrecord_servicechg_type');
        var serviceChangeFreqText = serviceResult[n].getValue('custrecord_servicechg_new_freq');

        service_freq += serviceNSItemText + ' - ' + freqCal(serviceChangeFreqText) + ' | ';

        nlapiLogExecution('DEBUG', 'serviceNSItem', serviceNSItem);
        nlapiLogExecution('DEBUG', 'serviceNSItemText', serviceNSItemText);

        service[service.length] = serviceNSItemText;
        price[price.length] = newServiceChangePrice;
    }



    var postaladdress = '';
    var siteaddress = '';
    var siteaddressfull = '';
    var billaddressfull = '';
    var SOpostaladdress = '';
    var SOpostalcity = '';

    var addr1_addr2 = '';
    var city_state_code = '';

    for (p = 1; p <= recCustomer.getLineItemCount('addressbook'); p++) {
        if (isNullorEmpty(postaladdress) && recCustomer.getLineItemValue('addressbook', 'isresidential', p) == "T") {
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr1', p))) {
                postaladdress += recCustomer.getLineItemValue('addressbook', 'addr1', p) + '\n';
                SOpostaladdress += recCustomer.getLineItemValue('addressbook', 'addr1', p) + ' ';
            }
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr2', p))) {
                postaladdress += recCustomer.getLineItemValue('addressbook', 'addr2', p) + '\n';
                SOpostaladdress += recCustomer.getLineItemValue('addressbook', 'addr2', p);
            }
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'city', p))) {
                postaladdress += recCustomer.getLineItemValue('addressbook', 'city', p) + ' ';
                SOpostalcity += recCustomer.getLineItemValue('addressbook', 'city', p);
            }
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'state', p))) {
                postaladdress += recCustomer.getLineItemValue('addressbook', 'state', p) + ' ';
            }
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'zip', p))) {
                postaladdress += recCustomer.getLineItemValue('addressbook', 'zip', p);
            }
        }
        if (isNullorEmpty(siteaddress) && recCustomer.getLineItemValue('addressbook', 'defaultshipping', p) == "T") {
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr1', p))) {
                siteaddress += recCustomer.getLineItemValue('addressbook', 'addr1', p) + '  ';
                siteaddressfull += recCustomer.getLineItemValue('addressbook', 'addr1', p) + '\n';
                addr1_addr2 += recCustomer.getLineItemValue('addressbook', 'addr1', p) + ', ';
            }
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr2', p))) {
                siteaddress += recCustomer.getLineItemValue('addressbook', 'addr2', p) + '  ';
                siteaddressfull += recCustomer.getLineItemValue('addressbook', 'addr2', p) + '\n';
                addr1_addr2 += recCustomer.getLineItemValue('addressbook', 'addr2', p);
            }
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'city', p))) {
                siteaddress += recCustomer.getLineItemValue('addressbook', 'city', p) + ' ';
                siteaddressfull += recCustomer.getLineItemValue('addressbook', 'city', p) + ' ';
                city_state_code += recCustomer.getLineItemValue('addressbook', 'city', p) + ' ';
            }
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'state', p))) {
                siteaddress += recCustomer.getLineItemValue('addressbook', 'state', p) + ' ';
                siteaddressfull += recCustomer.getLineItemValue('addressbook', 'state', p) + ' ';
                city_state_code += recCustomer.getLineItemValue('addressbook', 'state', p) + ' ';
            }
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'zip', p))) {
                siteaddress += recCustomer.getLineItemValue('addressbook', 'zip', p);
                siteaddressfull += recCustomer.getLineItemValue('addressbook', 'zip', p);
                city_state_code += recCustomer.getLineItemValue('addressbook', 'zip', p);
            }
        }
        if (isNullorEmpty(billaddressfull) && recCustomer.getLineItemValue('addressbook', 'defaultbilling', p) == "T") {
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr1', p))) {
                billaddressfull += recCustomer.getLineItemValue('addressbook', 'addr1', p) + '\n';
            }
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr2', p))) {
                billaddressfull += recCustomer.getLineItemValue('addressbook', 'addr2', p) + '\n';
            }
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'city', p))) {
                billaddressfull += recCustomer.getLineItemValue('addressbook', 'city', p) + ' ';
            }
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'state', p))) {
                billaddressfull += recCustomer.getLineItemValue('addressbook', 'state', p) + ' ';
            }
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'zip', p))) {
                billaddressfull += recCustomer.getLineItemValue('addressbook', 'zip', p);
            }
        }
    }

    var merge = new Array();
    merge['NLDATE'] = getDate();
    if (!isNullorEmpty(decisioncontact)) {
        merge['NLFULLNAME'] = decisioncontact;

    } else if (!isNullorEmpty(primarycontact)) {
        merge['NLFULLNAME'] = primarycontact;

    }

    merge['NLCUSTOMERNAME'] = customerName;
    merge['NLSTREETADDRESS'] = addr1_addr2;
    merge['NLCITYSTATECODE'] = city_state_code;
    if (!isNullorEmpty(decisioncontact)) {
        merge['NLDEAR'] = decisionfirstname;

    } else if (!isNullorEmpty(primarycontact)) {
        merge['NLDEAR'] = primaryfirstname;
    }
    merge['NLCUSTOMERNAME2'] = customerName;
    merge['NLSALESREPNAME'] = salesreptext;
    merge['NLSCPOSTADDRESS'] = postaladdress;
    merge['NLSCSHIPADDRESS'] = siteaddressfull;
    merge['NLSCBILLADDRESS'] = billaddressfull;
    merge['NLSCACONTACT'] = apcontact;

    for (var x = 0; x < service.length; x++) {
        merge['NLSERVICEITEM' + (x + 1)] = service[x];
        merge['NLSCPRICE' + (x + 1)] = price[x];
    }

    var default_note = '*Quoted price excludes GST and applies for the first 16kg of mail. Further increments of 16kg incur a $2.75 charge. Registered mail $2.20 and parcels $1.10. Minimum two weeks written notice to cancel services.\n' + service_freq;

    if (!isNullorEmpty(recCustomer.getFieldValue('custentity_sc_form_notes'))) {
        merge['NLSCNOTES'] = default_note + recCustomer.getFieldValue('custentity_sc_form_notes');
    } else {
        merge['NLSCNOTES'] = default_note;
    }

    merge['NLDATEEFFECTIVE'] = dateEffective;


    if (attSCForm == 94) {
        merge['NLSOPCITY'] = SOpostalcity;
        merge['NLSOADDRESS'] = siteaddress;
        merge['NLSOPADD1'] = SOpostaladdress;
    }

    merge['NLSALESREPNAME2'] = salesreptext;
    if (isNullorEmpty(stage)) {
        merge['NLSCSTARTDATE'] = start_date;
        var fileSCFORM = nlapiMergeRecord(attSCForm, 'customer', custId, null, null, merge);
        fileSCFORM.setName('MP_ServiceCommencement_' + custId + '.pdf');
    } else {
        if (stage == 0) {
            merge['NLSCSTARTDATE'] = start_date;
            merge['NLSCENDDATE'] = end_date;
            merge['NLSCSIGNDATE'] = getDate();
            var fileSCFORM = nlapiMergeRecord(165, 'customer', custId, null, null, merge);
            fileSCFORM.setName('MP_ServiceCommencement_' + custId + '.pdf');

            fileSCFORM.setFolder(1212243);

            var id = nlapiSubmitFile(fileSCFORM);

            var comm_reg_loaded = nlapiLoadRecord('customrecord_commencement_register', commRegId);

            comm_reg_loaded.setFieldValue('custrecord_scand_form', id);

            nlapiSubmitRecord(comm_reg_loaded);
        }
    }



    var nPos = 0;
    var attachments = new Array();
    if (!isNullorEmpty(attSCForm)) {
        attachments[nPos] = fileSCFORM;
        nPos++;
    }
    if (!isNullorEmpty(attSOForm)) {
        var soMerge = new Array();
        soMerge['NLSOPCITY'] = SOpostalcity;
        soMerge['NLSOADDRESS'] = siteaddress;
        soMerge['NLSOPADD1'] = SOpostaladdress;

        var fileSOFORM = nlapiMergeRecord(attSOForm, 'customer', custId, null, null, soMerge);
        fileSOFORM.setName('StandingOrder_' + custId + '.pdf');

        attachments[nPos] = fileSOFORM;
        nPos++;
    }

    return attachments;
}

function attachmentsSection(resultSetAtt) {
    var html = '<div class="form-group container row_form_quote">';
    html += '<div class="row">';
    html += '<div class="col-xs-4"><h4><u> FORMS </u></h4></div>'
        // html += '<div class="col-xs-4 form_section"><div class="input-group"><input type="text" class="form-control" readonly value="SEND FORMS" /><span class="input-group-addon"><input type="checkbox" id="form" class="" /></span></div></div>';
        // html += '<div class="col-xs-4 quote_section"><div class="input-group"><input type="text" class="form-control" readonly value="SEND QUOTE" /><span class="input-group-addon"><input type="checkbox" id="quote" class="" /></span></div></div>';
        // html += '<div class="col-xs-4 quote_section"><div class="input-group"><input type="text" class="form-control" readonly value="PROGRESS WITHOUT EMAIL" /><span class="input-group-addon"><input type="checkbox" id="no_email" class="" /></span></div></div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="form-group container row_scf">';
    html += '</div>';


    html += '<div class="form-group container row_form_quote">';
    html += '<div class="row">';
    html += '<div class="col-xs-4"><h4><u> BROCHURES </u></h4></div>';
    // html += '<div class="col-xs-4 form_section"><div class="input-group"><input type="text" class="form-control" readonly value="SEND FORMS" /><span class="input-group-addon"><input type="checkbox" id="form" class="" /></span></div></div>';
    // html += '<div class="col-xs-4 quote_section"><div class="input-group"><input type="text" class="form-control" readonly value="SEND QUOTE" /><span class="input-group-addon"><input type="checkbox" id="quote" class="" /></span></div></div>';
    // html += '<div class="col-xs-4 quote_section"><div class="input-group"><input type="text" class="form-control" readonly value="PROGRESS WITHOUT EMAIL" /><span class="input-group-addon"><input type="checkbox" id="no_email" class="" /></span></div></div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="form-group container row_attachments">';
    html += '<div class="row">'

    // inlinehTML += '<div class="col-xs-12 template_section">';
    resultSetAtt.forEachResult(function(searchResultAtt) {

        var attId = searchResultAtt.getValue('internalid');
        var attName = searchResultAtt.getValue('name');
        var file = searchResultAtt.getValue('custrecord_comm_attach_file');
        var fileRecord = nlapiLoadFile(file);


        html += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="' + attId + '" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + fileRecord.getURL() + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="' + attName + '"><span class="input-group-addon"><input type="checkbox" id="' + file + '" class="attachments" /></span></div></div>';
        return true;
    });
    html += '</div>';
    html += '</div>';



    return html;
}

function email_template(resultSetCampTemp, contactResult, resultSet_contacts, nosale) {
    var html = '<div class="form-group container row_to ">';
    html += '<div class="row">'

    html += '<div class="col-xs-6 to_section"><div class="input-group"><span class="input-group-addon">TO ';
    if (isNullorEmpty(nosale)) {
        html += '<span class="mandatory">*</span>';
    }
    html += '</span><select id="send_to" class="form-control " ><option value=""></option><option value="' + 0 + '" data-firstname="NO NAME">PROGRESS WITHOUT EMAIL</option>';
    if (contactResult.length != 0) {
        resultSet_contacts.forEachResult(function(searchResult_contacts) {
            var id = searchResult_contacts.getValue('internalid');
            var first_name = searchResult_contacts.getValue('firstname');
            var last_name = searchResult_contacts.getValue('lastname');
            var email = searchResult_contacts.getValue('email');

            html += '<option value="' + id + '" data-firstname="' + first_name + '">' + first_name + ' ' + last_name + ' - ' + email + '</option>'

            return true;
        });
    }
    html += '</select></div></div>';
    html += '<div class="col-xs-6 cc_section"><div class="input-group"><span class="input-group-addon">CC </span><input type="text" id="send_cc" class="form-control " /></div></div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="form-group container row_template">';
    html += '<div class="row">'

    html += '<div class="col-xs-8 template_section"><div class="input-group"><span class="input-group-addon">TEMPLATE';
    if (isNullorEmpty(nosale)) {
        html += '<span class="mandatory">*</span>';
    }
    html += '</span><select  id="template" class="form-control" ><option></option>';
    resultSetCampTemp.forEachResult(function(searchResultCampTemp) {

        var tempId = searchResultCampTemp.getValue('internalid');
        var tempName = searchResultCampTemp.getValue('name');

        html += '<option value="' + tempId + '">' + tempName + '</option>'
        return true;
    });
    html += '</select></div></div>';
    html += '</div>';
    html += '</div>';


    html += '<div class="form-group container row_subject ">';
    html += '<div class="row">'
    html += '<div class="col-xs-8 subject_section"><div class="input-group"><span class="input-group-addon">SUBJECT ';
    if (isNullorEmpty(nosale)) {
        html += '<span class="mandatory">*</span>';
    }
    html += '</span><input type="text" id="subject" class="form-control" /></div></div>';
    html += '</div>';
    html += '</div>';

    if (isNullorEmpty(nosale)) {
        html += '<div class="form-group container row_call_back">';
        html += '<div class="row">';
        html += '<div class="col-xs-4 date_section"><div class="input-group"><span class="input-group-addon">SET APPOINTMENT DATE <span class="mandatory">*</span></span><input type="date" id="date" class="form-control" /></div></div>';
        html += '<div class="col-xs-4 time_section"><div class="input-group"><span class="input-group-addon">SET APPOINTMENT TIME <span class="mandatory">*</span></span><input type="time" id="time" class="form-control" /></div></div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="form-group container row_call_back_notes">';
        html += '<div class="row">';
        html += '<div class="col-xs-8 notes_section"><div class="input-group"><span class="input-group-addon">APPOINTMENT NOTES </span><textarea  id="notes" class="form-control" ></textarea></div></div>';
        html += '</div>';
        html += '</div>';
    } else {
        html += '<div class="form-group container row_call_back">';
        html += '<div class="row">';
        html += '<div class="col-xs-4 date_section"><div class="input-group"><span class="input-group-addon">LOST REASON <span class="mandatory">*</span></span><select id="nosalereason" class="form-control nosalereason" required><option></option>';
        var col = new Array();
        col[0] = new nlobjSearchColumn('name');
        col[1] = new nlobjSearchColumn('internalId');
        var results = nlapiSearchRecord('customlist_nosalereason', null, null, col);
        for (var i = 0; results != null && i < results.length; i++) {
            var res = results[i];
            var listValue = res.getValue('name');
            var listID = res.getValue('internalId');

            html += '<option value="' + listID + '">' + listValue + '</option>';
        }
        html += '</select></div></div>';

        html += '<div class="form-group container row_call_back_notes">';
        html += '<div class="row">';
        html += '<div class="col-xs-8 notes_section"><div class="input-group"><span class="input-group-addon">LOST NOTES </span><textarea  id="nosalenotes" class="form-control" ></textarea></div></div>';
        html += '</div>';
        html += '</div>';
    }

    html += '<div class="form-group container row_body ">';
    html += '<div class="row">'
    html += '<div class="col-xs-12 body_section"><div id="email_body"></div></div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="form-group container row_body ">';
    html += '<div class="row">'
    html += '<div class="col-xs-12 body_section"><textarea id="preview" class="hide"></textarea><iframe id="viewer" frameborder="0" scrolling="no" width="400" height="600" style="display: none;"></iframe></div>';
    html += '</div>';
    html += '</div>';

    return html;
}


function call_back() {
    var html = '<div class="form-group container row_call_back">';
    html += '<div class="row">';
    html += '<div class="col-xs-4 date_section"><div class="input-group"><span class="input-group-addon">SET APPOINTMENT DATE <span class="mandatory">*</span></span><input type="date" id="date" class="form-control" /></div></div>';
    html += '<div class="col-xs-4 time_section"><div class="input-group"><span class="input-group-addon">SET APPOINTMENT TIME <span class="mandatory">*</span></span><input type="time" id="time" class="form-control" /></div></div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="form-group container row_call_back_notes">';
    html += '<div class="row">';
    html += '<div class="col-xs-8 notes_section"><div class="input-group"><span class="input-group-addon">APPOINTMENT NOTES </span><textarea  id="notes" class="form-control" ></textarea></div></div>';
    html += '</div>';
    html += '</div>';

    return html;
}


function serviceChangeSection(resultSet_service_change) {
    var inlinehTML = '';
    if (isNullorEmpty(resultSet_service_change)) {
        inlinehTML += '<div class="form-group container createservicechg_section">';
        inlinehTML += '<div class="row">';
        inlinehTML += '<div class="col-xs-3 createservicechg"><input type="button" value="ADD SERVICES" class="form-control btn btn-success" id="createservicechg" /></div>';
        inlinehTML += '</div>';
        inlinehTML += '</div>';
    }

    inlinehTML += '<div class="form-group container service_chg_section">';
    inlinehTML += '<div class="row">';
    inlinehTML += '<div class="col-xs-12 service_chg_div">';
    inlinehTML += '<table border="0" cellpadding="15" id="service_chg" class="table table-responsive table-striped service_chg tablesorter" cellspacing="0" style="width: 100%;"><thead style="color: white;background-color: #607799;"><tr><th style="vertical-align: middle;text-align: center;"><b>ACTION</b></th><th style="vertical-align: middle;text-align: center;"><b>SERVICE NAME</b></th><th style="vertical-align: middle;text-align: center;"><b>CHANGE TYPE</b></th><th style="vertical-align: middle;text-align: center;"><b>DATE EFFECTIVE</b></th><th style="vertical-align: middle;text-align: center;"><b>OLD PRICE</b></th><th style="vertical-align: middle;text-align: center;"><b>NEW PRICE</b></th><th style="vertical-align: middle;text-align: center;"><b>FREQUENCY</b></th></tr></thead><tbody>';
    if (!isNullorEmpty(resultSet_service_change)) {
        resultSet_service_change.forEachResult(function(searchResult_service_change) {
            var serviceChangeId = searchResult_service_change.getValue('internalid');
            var serviceId = searchResult_service_change.getValue('custrecord_servicechg_service');
            var serviceText = searchResult_service_change.getText('custrecord_servicechg_service');
            var serviceDescp = searchResult_service_change.getValue("custrecord_service_description", "CUSTRECORD_SERVICECHG_SERVICE", null);
            var oldServicePrice = searchResult_service_change.getValue("custrecord_service_price", "CUSTRECORD_SERVICECHG_SERVICE", null);
            var newServiceChangePrice = searchResult_service_change.getValue('custrecord_servicechg_new_price');
            var dateEffective = searchResult_service_change.getValue('custrecord_servicechg_date_effective');
            var commRegId = searchResult_service_change.getValue('custrecord_servicechg_comm_reg');
            var serviceChangeTypeText = searchResult_service_change.getText('custrecord_servicechg_type');
            var serviceChangeFreqText = searchResult_service_change.getText('custrecord_servicechg_new_freq');

            inlinehTML += '<tr>';

            inlinehTML += '<td><button class="btn btn-warning btn-xs edit_class glyphicon glyphicon-pencil" data-dateeffective="' + dateEffective + '" data-commreg="' + commRegId + '" type="button" data-toggle="tooltip" data-placement="right" title="Edit"></button></td>';


            inlinehTML += '<td><input id="service_name" class="form-control service_name" data-serviceid="' + serviceId + '" data-servicetypeid="" readonly value="' + serviceText + '" /></td>';
            inlinehTML += '<td><input id="service_chg_type" class="form-control service_name" readonly value="' + serviceChangeTypeText + '" /></td>';
            inlinehTML += '<td><input id="date_effective" class="form-control service_name" readonly value="' + dateEffective + '" /></td>';
            inlinehTML += '<td><div class="service_price_div input-group"><span class="input-group-addon">$</span><input class="form-control old_service_price_class" disabled value="' + oldServicePrice + '"  type="number" step=".01" /></div></td>';
            inlinehTML += '<td><div class="service_price_div input-group"><span class="input-group-addon">$</span><input class="form-control new_service_price_class" disabled value="' + newServiceChangePrice + '"  type="number" step=".01" /></div></td>';

            inlinehTML += '<td>' + serviceChangeFreqText + '</td>';
            var fileID = searchResult_service_change.getValue("custrecord_scand_form", "CUSTRECORD_SERVICECHG_COMM_REG", null);

            // if (!isNullorEmpty(fileID)) {
            // 	var fileRecord = nlapiLoadFile(fileID);
            // 	inlinehTML += '<td><a href="' + fileRecord.getURL() + '" target="_blank">' + searchResult_service_change.getText("custrecord_scand_form", "CUSTRECORD_SERVICECHG_COMM_REG", null) + '</a></td>';
            // } else {
            // 	inlinehTML += '<td></td>';
            // }


            inlinehTML += '</tr>';
            return true;
        });
    }
    inlinehTML += '</tbody></table>';
    inlinehTML += '</div>';
    inlinehTML += '</div>';
    inlinehTML += '</div>';

    return inlinehTML;
}

function getDate() {
    var date = new Date();
    if (date.getHours() > 6) {
        date = nlapiAddDays(date, 1);
    }
    date = nlapiDateToString(date);
    return date;
}

function freqCal(freq) {

    var multiselect = '';



    if (freq.indexOf(1) != -1) {
        multiselect += 'Mon,';
    }

    if (freq.indexOf(2) != -1) {
        multiselect += 'Tue,';
    }

    if (freq.indexOf(3) != -1) {
        multiselect += 'Wed,';
    }

    if (freq.indexOf(4) != -1) {
        multiselect += 'Thu,';
    }

    if (freq.indexOf(5) != -1) {
        multiselect += 'Fri,';
    }

    if (freq.indexOf(6) != -1) {
        multiselect += 'Adhoc,';
    }
    multiselect = multiselect.slice(0, -1)
    return multiselect;
}


Date.prototype.addHours = function(h) {
    this.setHours(this.getHours() + h);
    return this;
}