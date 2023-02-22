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


    prev_inv_deploy = ctx.getDeploymentId();

    // nlapiLogExecution('DEBUG', 'ZEE', zee)
    // nlapiLogExecution('DEBUG', 'template', template)

    // Search Name: Excess Weight - Invoice List - Invoice to be sent
    var excessWeightInvoiceEmailSearch = nlapiLoadSearch('invoice',
        'customsearch_excess_weight_invoice_list');

    var resultSetExcessWeightInvoiceEmailSearch = excessWeightInvoiceEmailSearch.runSearch();
    var count = 0;
    var customer_count = 0;

    resultSetExcessWeightInvoiceEmailSearch.forEachResult(function (searchResult) {

        nlapiLogExecution('AUDIT', 'Inside Loop', searchResult.getValue('internalid', null, "GROUP"));

        var invoiceInternalId = searchResult.getValue('internalid', null, "GROUP");
        var documentNumber = searchResult.getValue('tranid', null, "GROUP");
        var invoiceDate = searchResult.getValue('trandate', null, "GROUP");
        var invocieDateFrom = searchResult.getValue('custbody_inv_date_range_from', null, "GROUP");
        var invoiceDateTo = searchResult.getValue('custbody_inv_date_range_to', null, "GROUP");

        var invoiceCustomerInternalId = searchResult.getValue("internalid", "customer", "GROUP");
        var invoiceCustomerId = searchResult.getValue("entityid", "customer", "GROUP");
        var invoiceCustomerCompanyName = searchResult.getValue("companyname", "customer", "GROUP");

        var usage_loopstart_cust = ctx.getRemainingUsage();
        // if ((usage_loopstart_cust < 400)) {
        //     var params = {

        //     }

        //     reschedule = rescheduleScript(prev_inv_deploy, adhoc_inv_deploy,
        //         params);
        //     nlapiLogExecution('AUDIT', 'Reschedule Return', reschedule);
        //     if (reschedule == false) {
        //         return false;
        //     }
        // }

        // try {

        var custRec = nlapiLoadRecord('customer', invoiceCustomerInternalId);
        var emailCCEmail = custRec.getFieldValue('custentity_accounts_cc_email');
        if (!isNullorEmpty(emailCCEmail)) {
            var emailCCArray = emailCCEmail.split(',');
        } else {
            var emailCCArray = null;
        }
        var file = nlapiCreateEmailMerger(386);
        file.setEntity('customer', invoiceCustomerInternalId);
        var mergeResult = file.merge();
        // Determine the subject and body.
        var emailBody = mergeResult.getBody();

        // email subject not declared in template due to other uses. Need to manually set.
        var emailSubject = 'MailPlus invoice: overweight fees and how to avoid them';

        var emailAttach = new Object();
        emailAttach['transaction'] = invoiceInternalId;
        emailAttach['entity'] = invoiceCustomerInternalId;

        // Retrieve the file to be emailed.
        var emailFile = nlapiPrintRecord('TRANSACTION', invoiceInternalId, 'PDF', null);

        arrAttachments = [];

        arrAttachments.push(nlapiPrintRecord('TRANSACTION', invoiceInternalId, 'PDF', null));

        // Send an email only if the file is available.
        if (!isNullorEmpty(emailFile)) {
            nlapiSendEmail(35031, invoiceCustomerInternalId, emailSubject, emailBody, emailCCArray, null, emailAttach, arrAttachments);

            nlapiLogExecution('debug', 'Email invoice', 'Email Sent : ' + invoiceInternalId);

            nlapiSubmitField('invoice', invoiceInternalId, ['custbody_invoice_emailed_date', 'custbody_invoice_emailed'], [nlapiDateToString(new Date()), 'T']);
        }
        // } catch (error) {

        // }


        // var params = {

        // }

        // reschedule = rescheduleScript(prev_inv_deploy, adhoc_inv_deploy, params);
        // nlapiLogExecution('AUDIT', 'Reschedule Return', reschedule);
        // if (reschedule == false) {
        //     return false;
        // }

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
