/**
 * Module Description
 * 
 * NSVersion    Date            			Author         
 * 1.00       	2020-07-20 18:06:05   		Ankith
 *
 * Description:         
 * 
 * @Last Modified by:   ankit
 * @Last Modified time: 2021-03-05 08:18:45
 *
 */

var adhoc_inv_deploy = 'customdeploy2';
var prev_inv_deploy = null;
var ctx = nlapiGetContext();

function sendEmailSS() {

    var zee = ctx.getSetting('SCRIPT', 'custscript_mass_email_zee');
    var subject = ctx.getSetting('SCRIPT', 'custscript_mass_email_subject');
    var template = ctx.getSetting('SCRIPT', 'custscript_mass_email_template');
    var old_zee = ctx.getSetting('SCRIPT', 'custscript_mass_email_old_zee');

    prev_inv_deploy = ctx.getDeploymentId();

    nlapiLogExecution('DEBUG', 'ZEE', zee)
    nlapiLogExecution('DEBUG', 'template', template)

    var customerSearch = nlapiLoadSearch('customer', 'customsearch_mass_email_customer_list');

    var addFilterExpression = new nlobjSearchFilter('partner', null, 'anyof', parseInt(zee));
    customerSearch.addFilter(addFilterExpression);
    var resultSetCustomer = customerSearch.runSearch();

    var all_pages = [];

    resultSetCustomer.forEachResult(function(searchResult) {

        var usage_loopstart_cust = ctx.getRemainingUsage();
        if ((usage_loopstart_cust < 400)) {
            var params = {
                custscript_mass_email_zee: parseInt(zee),
                custscript_mass_email_subject: subject,
                custscript_mass_email_old_zee: old_zee,
                custscript_mass_email_template: template
            }

            reschedule = rescheduleScript(prev_inv_deploy, adhoc_inv_deploy, params);
            nlapiLogExecution('AUDIT', 'Reschedule Return', reschedule);
            if (reschedule == false) {
                return false;
            }
        }

        var custid = searchResult.getValue('internalid');
        var entityid = searchResult.getValue('entityid');
        var companyname = searchResult.getValue('companyname');

        var recCustomer = nlapiLoadRecord('customer', custid);
        var account_email = recCustomer.getFieldValue('email');
        var service_email = recCustomer.getFieldValue('custentity_email_service');

        recCustomer.setFieldValue('custentity_mass_email_sent', 1);

        var emailMerger = nlapiCreateEmailMerger(template);
        if (template == 298) {
            emailMerger.setEntity('customer', custid);
            emailMerger.setEntity('partner', zee);
        }

        var mergeResult = emailMerger.merge();
        var emailBody = mergeResult.getBody();


        var emailAttach = new Object();
        emailAttach['entity'] = custid;

        if (isNullorEmpty(account_email) && isNullorEmpty(service_email)) {

        } else {

            // nlapiSendEmail(112209, 'ankith.ravindran@mailplus.com.au', subject, emailBody, null, null, emailAttach, null, true);

            if (!isNullorEmpty(account_email)) {
                nlapiSendEmail(112209, account_email, subject, emailBody, null, null, emailAttach, null, true);
            } else if (!isNullorEmpty(service_email)) {
                nlapiSendEmail(112209, service_email, subject, emailBody, null, null, emailAttach, null, true);
            }
        }


        nlapiSubmitRecord(recCustomer);

        var params = {
            custscript_mass_email_zee: parseInt(zee),
            custscript_mass_email_subject: subject,
            custscript_mass_email_template: template
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