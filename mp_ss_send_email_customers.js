/**
 * Module Description
 *
 * NSVersion    Date            			Author
 * 1.00       	2020-07-20 18:06:05   		Ankith
 *
 * Description:
 *
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-06-09T08:16:00+10:00
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

  var customerSearch = nlapiLoadSearch('customer',
    'customsearch_mass_email_customer_list');
  // var customerSearch = nlapiLoadSearch('customer',
  //   'customsearch_bi_at_active_customers_2__6');

  var addFilterExpression = new nlobjSearchFilter('partner', null, 'anyof',
    parseInt(zee));
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

      reschedule = rescheduleScript(prev_inv_deploy, adhoc_inv_deploy,
        params);
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
    var sales_email = recCustomer.getFieldValue('custentity_email_sales');
    var service_email = recCustomer.getFieldValue(
      'custentity_email_service');
    var accounts_cc_email = recCustomer.getFieldValue(
      'custentity_accounts_cc_email');

    recCustomer.setFieldValue('custentity_mass_email_sent', 1);

    var postaladdress = '';

    var siteaddressfull = '';
    var billaddressfull = '';

    for (p = 1; p <= recCustomer.getLineItemCount('addressbook'); p++) {
      if (isNullorEmpty(postaladdress) && recCustomer.getLineItemValue(
          'addressbook', 'isresidential', p) == "T") {
        if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
            'addressee', p))) {
          postaladdress += recCustomer.getLineItemValue('addressbook',
            'addressee', p) + '\n';
        }

        if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
            'addr1', p))) {
          postaladdress += recCustomer.getLineItemValue('addressbook',
            'addr1', p) + '\n';
        }
        if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
            'addr2', p))) {
          postaladdress += recCustomer.getLineItemValue('addressbook',
            'addr2', p) + '\n';
        }
        if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
            'city', p))) {
          postaladdress += recCustomer.getLineItemValue('addressbook',
            'city', p) + ' ';
        }
        if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
            'state', p))) {
          postaladdress += recCustomer.getLineItemValue('addressbook',
            'state', p) + ' ';
        }
        if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
            'zip', p))) {
          postaladdress += recCustomer.getLineItemValue('addressbook',
            'zip', p);
        }
      }
      if (recCustomer.getLineItemValue('addressbook', 'defaultshipping', p) ==
        "T") {

        if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
            'addressee', p))) {
          siteaddressfull += recCustomer.getLineItemValue('addressbook',
            'addressee', p) + '\n';
        }

        if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
            'addr1', p))) {
          siteaddressfull += recCustomer.getLineItemValue('addressbook',
            'addr1', p) + '\n';
        }
        if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
            'addr2', p))) {
          siteaddressfull += recCustomer.getLineItemValue('addressbook',
            'addr2', p) + '\n';
        }
        if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
            'city', p))) {
          siteaddressfull += recCustomer.getLineItemValue('addressbook',
            'city', p) + ' ';
        }
        if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
            'state', p))) {
          siteaddressfull += recCustomer.getLineItemValue('addressbook',
            'state', p) + ' ';
        }
        if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
            'zip', p))) {
          siteaddressfull += recCustomer.getLineItemValue('addressbook',
            'zip', p);
        }
      }
      if (isNullorEmpty(billaddressfull) && recCustomer.getLineItemValue(
          'addressbook', 'defaultbilling', p) == "T") {

        if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
            'addressee', p))) {
          billaddressfull += recCustomer.getLineItemValue('addressbook',
            'addressee', p) + '\n';
        }
        if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
            'addr1', p))) {
          billaddressfull += recCustomer.getLineItemValue('addressbook',
            'addr1', p) + '\n';
        }
        if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
            'addr2', p))) {
          billaddressfull += recCustomer.getLineItemValue('addressbook',
            'addr2', p) + '\n';
        }
        if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
            'city', p))) {
          billaddressfull += recCustomer.getLineItemValue('addressbook',
            'city', p) + ' ';
        }
        if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
            'state', p))) {
          billaddressfull += recCustomer.getLineItemValue('addressbook',
            'state', p) + ' ';
        }
        if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
            'zip', p))) {
          billaddressfull += recCustomer.getLineItemValue('addressbook',
            'zip', p);
        }
      }
    }



    var merge = new Array();
    merge['NLSCBILLADDRESS'] = billaddressfull;
    merge['NLSCDATE'] = getDate();

    var emailMerger = nlapiCreateEmailMerger(template);
    // var emailMerger = nlapiCreateEmailMerger(354);
    if (template == 298 || template == 326) {
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

        nlapiSendEmail(35031, account_email, subject, emailBody,
          accounts_cc_email,
          null, emailAttach, null, true);
      } else if (!isNullorEmpty(service_email)) {
        nlapiSendEmail(35031, service_email, subject, emailBody,
          accounts_cc_email,
          null, emailAttach, null, true);
      }
    }

    // var fileSCFORM = nlapiMergeRecord(355, 'customer', custid, null, null,
    //   merge);
    // fileSCFORM.setName('Shipping_Surcharge_' + companyname + '.pdf');
    //
    // fileSCFORM.setFolder(3248835); // Update the Documents folder with the date the email has been sent out to makwe it easier to download the PDF's
    //
    // var id = nlapiSubmitFile(fileSCFORM);
    //
    // recCustomer.setFieldValue('custentity_mpex_price_letter', id);
    // recCustomer.setFieldValue('custentity_letter_sent', 1);


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
