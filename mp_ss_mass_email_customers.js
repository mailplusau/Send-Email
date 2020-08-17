/**
 * Module Description
 * 
 * NSVersion    Date            			Author         
 * 1.00       	2020-07-20 18:06:05   		Ankith
 *
 * Description:         
 * 
 * @Last Modified by:   Ankith
 * @Last Modified time: 2020-08-17 11:02:10
 *
 */

var adhoc_inv_deploy = 'customdeploy2';
var prev_inv_deploy = null;
var ctx = nlapiGetContext();

function sendEmailSS() {

    var letter_type = ctx.getSetting('SCRIPT', 'custscript_letter_type');
    var subject = ctx.getSetting('SCRIPT', 'custscript_subject');
    var template = ctx.getSetting('SCRIPT', 'custscript_template');
    var pdf = ctx.getSetting('SCRIPT', 'custscript_pdf');
    prev_inv_deploy = ctx.getDeploymentId();

    nlapiLogExecution('AUDIT', 'letter_type', letter_type)
    nlapiLogExecution('AUDIT', 'template', template)

    var mpexPricingCustomerList = nlapiLoadSearch('customer', 'customsearch_mpex_price_point_customer_2');
    if (letter_type != '0') {
        var addFilterExpression = new nlobjSearchFilter('custentity_mpex_price_letter_types', null, 'anyof', parseInt(letter_type));
        mpexPricingCustomerList.addFilter(addFilterExpression);
    }


    var resultSetMpexPricing = mpexPricingCustomerList.runSearch();

    var all_pages = [];

    resultSetMpexPricing.forEachResult(function(searchResult) {

        var usage_loopstart_cust = ctx.getRemainingUsage();
        if ((usage_loopstart_cust < 400)) {
            var params = {
                custscript_letter_type: letter_type,
                custscript_subject: subject,
                custscript_template: template,
                custscript_pdf: pdf
            }

            reschedule = rescheduleScript(prev_inv_deploy, adhoc_inv_deploy, params);
            nlapiLogExecution('AUDIT', 'Reschedule Return', reschedule);
            if (reschedule == false) {
                return false;
            }
        }

        var custId = searchResult.getValue('internalid');
        var companyname = searchResult.getValue('companyname');
        var account_email = searchResult.getValue('email');
        var service_email = searchResult.getValue('custentity_email_service');
        var tempName = searchResult.getValue('name');

        var recCustomer = nlapiLoadRecord('customer', custId);
        recCustomer.setFieldValue('custentity_mpex_price_letter_sent', 1);

        var postaladdress = '';

        var siteaddressfull = '';
        var billaddressfull = '';

        for (p = 1; p <= recCustomer.getLineItemCount('addressbook'); p++) {
            if (isNullorEmpty(postaladdress) && recCustomer.getLineItemValue('addressbook', 'isresidential', p) == "T") {
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addressee', p))) {
                    postaladdress += recCustomer.getLineItemValue('addressbook', 'addressee', p) + '\n';
                }

                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr1', p))) {
                    postaladdress += recCustomer.getLineItemValue('addressbook', 'addr1', p) + '\n';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr2', p))) {
                    postaladdress += recCustomer.getLineItemValue('addressbook', 'addr2', p) + '\n';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'city', p))) {
                    postaladdress += recCustomer.getLineItemValue('addressbook', 'city', p) + ' ';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'state', p))) {
                    postaladdress += recCustomer.getLineItemValue('addressbook', 'state', p) + ' ';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'zip', p))) {
                    postaladdress += recCustomer.getLineItemValue('addressbook', 'zip', p);
                }
            }
            if (recCustomer.getLineItemValue('addressbook', 'defaultshipping', p) == "T") {

                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addressee', p))) {
                    siteaddressfull += recCustomer.getLineItemValue('addressbook', 'addressee', p) + '\n';
                }

                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr1', p))) {
                    siteaddressfull += recCustomer.getLineItemValue('addressbook', 'addr1', p) + '\n';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr2', p))) {
                    siteaddressfull += recCustomer.getLineItemValue('addressbook', 'addr2', p) + '\n';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'city', p))) {
                    siteaddressfull += recCustomer.getLineItemValue('addressbook', 'city', p) + ' ';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'state', p))) {
                    siteaddressfull += recCustomer.getLineItemValue('addressbook', 'state', p) + ' ';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'zip', p))) {
                    siteaddressfull += recCustomer.getLineItemValue('addressbook', 'zip', p);
                }
            }
            if (isNullorEmpty(billaddressfull) && recCustomer.getLineItemValue('addressbook', 'defaultbilling', p) == "T") {

                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addressee', p))) {
                    billaddressfull += recCustomer.getLineItemValue('addressbook', 'addressee', p) + '\n';
                }
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
        merge['NLSCBILLADDRESS'] = billaddressfull;
        merge['NLSCDATE'] = getDate();

        // var file = nlapiCreateEmailMerger(template);
        // var mergeResult = file.merge();

        // emailHtml = mergeResult.getBody();
        // subject = mergeResult.getSubject();
        // emailHtml = emailHtml.replace(/<NLEMSALESPERSON>/gi, 'Ankith');
        // 
        // 
        var mergeResult = nlapiCreateEmailMerger(template).merge();
        var emailBody = mergeResult.getBody();

        var emailAttach = new Object();
        emailAttach['entity'] = custId;

        if (isNullorEmpty(account_email) && isNullorEmpty(service_email)) {

        } else {

            if (!isNullorEmpty(account_email)) {
                nlapiSendEmail(112209, account_email, subject, emailBody, null, null, emailAttach, null, true);
            } else if (!isNullorEmpty(service_email)) {
                nlapiSendEmail(112209, service_email, subject, emailBody, null, null, emailAttach, null, true);
            }
        }



        // var fileSCFORM = nlapiMergeRecord(pdf, 'customer', custId, null, null, merge);
        // fileSCFORM.setName('MPEX_Pricing_' + companyname + '.pdf');

        // fileSCFORM.setFolder(2414361);

        // var id = nlapiSubmitFile(fileSCFORM);

        // recCustomer.setFieldValue('custentity_mpex_price_letter', id);
        nlapiSubmitRecord(recCustomer);

        var params = {
            custscript_letter_type: letter_type,
            custscript_subject: subject,
            custscript_template: template,
            custscript_pdf: pdf
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