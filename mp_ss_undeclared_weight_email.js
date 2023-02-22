/**
 * Module Description
 *
 * NSVersion    Date            			Author
 * 1.00       	2020-07-20 18:06:05   		Ankith
 *
 * Description:
 *
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-06-14T13:58:15+10:00
 *
 */

var adhoc_inv_deploy = 'customdeploy2';
var prev_inv_deploy = null;
var ctx = nlapiGetContext();

function sendEmailSS() {

    var zee = ctx.getSetting('SCRIPT', 'custscript_mass_email_zee');
    // var subject = ctx.getSetting('SCRIPT', 'custscript_mass_email_subject');
    var template = ctx.getSetting('SCRIPT', 'custscript_excess_weight_template');
    var email_count = ctx.getSetting('SCRIPT', 'custscript_email_count');

    prev_inv_deploy = ctx.getDeploymentId();

    // template = null; 

    nlapiLogExecution('DEBUG', 'ZEE', zee)
    nlapiLogExecution('DEBUG', 'template', template)
    nlapiLogExecution('DEBUG', 'email_count', email_count)

    // Search Name: Customer List - Excess Weight Charges Email
    var customerSearch = nlapiLoadSearch('customer',
        'customsearch_cust_list_excess_weight_ema');
    if (!isNullorEmpty(zee) && zee != 0) {
        var addFilterExpression = new nlobjSearchFilter('partner', null, 'anyof',
            zee);
        customerSearch.addFilter(addFilterExpression);

    }
    if (!isNullorEmpty(email_count) && zee != email_count) {
        var addFilterExpression = new nlobjSearchFilter('custentity_count_weight_charges_email', null, 'is',
            zee);
        customerSearch.addFilter(addFilterExpression);
    }

    var resultSetCustomer = customerSearch.runSearch();

    var all_pages = [];

    resultSetCustomer.forEachResult(function (searchResult) {

        var custid = searchResult.getValue('internalid');
        var entityid = searchResult.getValue('entityid');
        var companyname = searchResult.getValue('companyname');

        var partner = searchResult.getValue('partner');

        var salesRep = searchResult.getValue('custrecord_salesrep', 'CUSTRECORD_CUSTOMER', null);
        var salesRepText = searchResult.getText('custrecord_salesrep', 'CUSTRECORD_CUSTOMER', null);
        var contactId = searchResult.getValue('internalid', 'contactPrimary', null);

        var usage_loopstart_cust = ctx.getRemainingUsage();
        if ((usage_loopstart_cust < 400)) {
            var params = {

            }

            reschedule = rescheduleScript(prev_inv_deploy, adhoc_inv_deploy,
                params);
            nlapiLogExecution('AUDIT', 'Reschedule Return', reschedule);
            if (reschedule == false) {
                return false;
            }
        }

        try {


            var recCustomer = nlapiLoadRecord('customer', custid);
            var account_email = recCustomer.getFieldValue('email');
            var sales_email = recCustomer.getFieldValue('custentity_email_sales');
            var service_email = recCustomer.getFieldValue(
                'custentity_email_service');
            var accounts_cc_email = recCustomer.getFieldValue(
                'custentity_accounts_cc_email');

            var originalCount = parseInt(recCustomer.getFieldValue('custentity_count_weight_charges_email'));
            if (isNullorEmpty) {
                var updatedCount = 1;
            } else {
                var updatedCount = originalCount++;
            }
            var updatedCount = originalCount++;


            var url =
                'https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=395&deploy=1&compid=1048144&h=6d4293eecb3cb3f4353e&rectype=customer&template=';
            var template_id = 157;
            var newLeadEmailTemplateRecord = nlapiLoadRecord(
                'customrecord_camp_comm_template', template_id);
            var templateSubject = newLeadEmailTemplateRecord.getFieldValue(
                'custrecord_camp_comm_subject');
            var emailAttach = new Object();
            emailAttach['entity'] = custid;


            url += template_id + '&recid=' + custid + '&salesrep=' +
                salesRep + '&dear=' + null + '&contactid=' + contactId + '&userid=' +
                encodeURIComponent(nlapiGetContext().getUser()) + '&salesRepName=' + salesRepText
            urlCall = nlapiRequestURL(url);
            var emailHtml = urlCall.getBody();
            var subject = "Under-declaring weight: Your account has been flagged";

            var emailAttach = new Object();
            emailAttach['entity'] = custid;

            if (isNullorEmpty(account_email) && isNullorEmpty(service_email)) {

            } else {


                if (!isNullorEmpty(account_email)) {

                    nlapiSendEmail(35031, account_email, subject, emailHtml,
                        null,
                        null, emailAttach, null, true);
                } else if (!isNullorEmpty(service_email)) {
                    nlapiSendEmail(35031, service_email, subject, emailHtml,
                        null,
                        null, emailAttach, null, true);
                }
            }

            recCustomer.setFieldValue('custentity_count_weight_charges_email', updatedCount);
            recCustomer.setFieldValue('custentity_weight_charges_email_datesent', getDate());
            recCustomer.setFieldValue('custentity_weight_charges_email_sent', 1);
            recCustomer.setFieldValue('custentity_weight_charges_email_to_send', 2)

            nlapiSubmitRecord(recCustomer);
        } catch (error) {

        }


        var params = {

        }

        reschedule = rescheduleScript(prev_inv_deploy, adhoc_inv_deploy, params);
        nlapiLogExecution('AUDIT', 'Reschedule Return', reschedule);
        if (reschedule == false) {
            return false;
        }

        return true;
    });

}

function getDate() {
    var date = new Date();
    if (date.getHours() > 6) {
        date = nlapiAddDays(date, 1);
    }
    date = nlapiDateToString(date);

    return date;
}
