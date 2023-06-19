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
  var subject = ctx.getSetting('SCRIPT', 'custscript_mass_email_subject');
  var template = ctx.getSetting('SCRIPT', 'custscript_mass_email_template');
  var old_zee = ctx.getSetting('SCRIPT', 'custscript_mass_email_old_zee');

  prev_inv_deploy = ctx.getDeploymentId();

  nlapiLogExecution('DEBUG', 'ZEE', zee)
  nlapiLogExecution('DEBUG', 'template', template)

  // var customerSearch = nlapiLoadSearch('customer',
  //   'customsearch_mass_email_customer_list');
  // var customerSearch = nlapiLoadSearch('customer',
  //   'customsearch_bi_at_active_customers_2__6');

  // var customerSearch = nlapiLoadSearch('customer',
  //   'customsearch7005'); // Shopify Update Customer List
  var customerSearch = nlapiLoadSearch('customer',
    'customsearch_cust_contact_mail_parcel__5'); // MP Express - Manual Usage - Contact List


  // var addFilterExpression = new nlobjSearchFilter('partner', null, 'anyof',
  //   parseInt(zee));
  // customerSearch.addFilter(addFilterExpression);
  var resultSetCustomer = customerSearch.runSearch();

  // var all_pages = [];

  // resultSetCustomer.forEachResult(function (searchResult) {

  //   var custid = searchResult.getValue('internalid');
  //   var entityid = searchResult.getValue('entityid');
  //   var companyname = searchResult.getValue('companyname');

  //   var usage_loopstart_cust = ctx.getRemainingUsage();
  //   if ((usage_loopstart_cust < 400)) {
  //     var params = {
  //       custscript_mass_email_zee: parseInt(zee),
  //       custscript_mass_email_subject: subject,
  //       custscript_mass_email_old_zee: old_zee,
  //       custscript_mass_email_template: template
  //     }

  //     reschedule = rescheduleScript(prev_inv_deploy, adhoc_inv_deploy,
  //       params);
  //     nlapiLogExecution('AUDIT', 'Reschedule Return', reschedule);
  //     if (reschedule == false) {
  //       return false;
  //     }
  //   }

  //   try {


  //     var recCustomer = nlapiLoadRecord('customer', custid);
  //     var account_email = recCustomer.getFieldValue('email');
  //     var sales_email = recCustomer.getFieldValue('custentity_email_sales');
  //     var service_email = recCustomer.getFieldValue(
  //       'custentity_email_service');
  //     var accounts_cc_email = recCustomer.getFieldValue(
  //       'custentity_accounts_cc_email');

  //     recCustomer.setFieldValue('custentity_mass_email_sent', 1);

  //     var postaladdress = '';

  //     var siteaddressfull = '';
  //     var billaddressfull = '';

  //     // for (p = 1; p <= recCustomer.getLineItemCount('addressbook'); p++) {
  //     //   if (isNullorEmpty(postaladdress) && recCustomer.getLineItemValue(
  //     //     'addressbook', 'isresidential', p) == "T") {
  //     //     if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
  //     //       'addressee', p))) {
  //     //       postaladdress += recCustomer.getLineItemValue('addressbook',
  //     //         'addressee', p) + '\n';
  //     //     }

  //     //     if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
  //     //       'addr1', p))) {
  //     //       postaladdress += recCustomer.getLineItemValue('addressbook',
  //     //         'addr1', p) + '\n';
  //     //     }
  //     //     if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
  //     //       'addr2', p))) {
  //     //       postaladdress += recCustomer.getLineItemValue('addressbook',
  //     //         'addr2', p) + '\n';
  //     //     }
  //     //     if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
  //     //       'city', p))) {
  //     //       postaladdress += recCustomer.getLineItemValue('addressbook',
  //     //         'city', p) + ' ';
  //     //     }
  //     //     if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
  //     //       'state', p))) {
  //     //       postaladdress += recCustomer.getLineItemValue('addressbook',
  //     //         'state', p) + ' ';
  //     //     }
  //     //     if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
  //     //       'zip', p))) {
  //     //       postaladdress += recCustomer.getLineItemValue('addressbook',
  //     //         'zip', p);
  //     //     }
  //     //   }
  //     //   if (recCustomer.getLineItemValue('addressbook', 'defaultshipping', p) ==
  //     //     "T") {

  //     //     if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
  //     //       'addressee', p))) {
  //     //       siteaddressfull += recCustomer.getLineItemValue('addressbook',
  //     //         'addressee', p) + '\n';
  //     //     }

  //     //     if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
  //     //       'addr1', p))) {
  //     //       siteaddressfull += recCustomer.getLineItemValue('addressbook',
  //     //         'addr1', p) + '\n';
  //     //     }
  //     //     if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
  //     //       'addr2', p))) {
  //     //       siteaddressfull += recCustomer.getLineItemValue('addressbook',
  //     //         'addr2', p) + '\n';
  //     //     }
  //     //     if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
  //     //       'city', p))) {
  //     //       siteaddressfull += recCustomer.getLineItemValue('addressbook',
  //     //         'city', p) + ' ';
  //     //     }
  //     //     if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
  //     //       'state', p))) {
  //     //       siteaddressfull += recCustomer.getLineItemValue('addressbook',
  //     //         'state', p) + ' ';
  //     //     }
  //     //     if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
  //     //       'zip', p))) {
  //     //       siteaddressfull += recCustomer.getLineItemValue('addressbook',
  //     //         'zip', p);
  //     //     }
  //     //   }
  //     //   if (isNullorEmpty(billaddressfull) && recCustomer.getLineItemValue(
  //     //     'addressbook', 'defaultbilling', p) == "T") {

  //     //     if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
  //     //       'addressee', p))) {
  //     //       billaddressfull += recCustomer.getLineItemValue('addressbook',
  //     //         'addressee', p) + '\n';
  //     //     }
  //     //     if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
  //     //       'addr1', p))) {
  //     //       billaddressfull += recCustomer.getLineItemValue('addressbook',
  //     //         'addr1', p) + '\n';
  //     //     }
  //     //     if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
  //     //       'addr2', p))) {
  //     //       billaddressfull += recCustomer.getLineItemValue('addressbook',
  //     //         'addr2', p) + '\n';
  //     //     }
  //     //     if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
  //     //       'city', p))) {
  //     //       billaddressfull += recCustomer.getLineItemValue('addressbook',
  //     //         'city', p) + ' ';
  //     //     }
  //     //     if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
  //     //       'state', p))) {
  //     //       billaddressfull += recCustomer.getLineItemValue('addressbook',
  //     //         'state', p) + ' ';
  //     //     }
  //     //     if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
  //     //       'zip', p))) {
  //     //       billaddressfull += recCustomer.getLineItemValue('addressbook',
  //     //         'zip', p);
  //     //     }
  //     //   }
  //     // }



  //     var merge = new Array();
  //     merge['NLSCBILLADDRESS'] = billaddressfull;
  //     merge['NLSCDATE'] = getDate();

  //     // var emailMerger = nlapiCreateEmailMerger(template);
  //     var emailMerger = nlapiCreateEmailMerger(391);
  //     var subject = "Notice: Update to Terms & Conditions";
  //     // if (template == 298 || template == 326 || template == 358) {
  //     //   emailMerger.setEntity('customer', custid);
  //     //   emailMerger.setEntity('partner', zee);
  //     // }

  //     var mergeResult = emailMerger.merge();
  //     var emailBody = mergeResult.getBody();


  //     var emailAttach = new Object();
  //     emailAttach['entity'] = custid;

  //     if (isNullorEmpty(account_email) && isNullorEmpty(service_email) && isNullorEmpty(sales_email)) {

  //     } else {

  //       // nlapiSendEmail(112209, 'ankith.ravindran@mailplus.com.au', subject, emailBody, null, null, emailAttach, null, true);
  //       if (!isNullorEmpty(service_email)) {
  //         nlapiSendEmail(112209, service_email, subject, emailBody,
  //           null,
  //           null, emailAttach, null, true);
  //       }
  //       if (!isNullorEmpty(sales_email)) {

  //         nlapiSendEmail(112209, sales_email, subject, emailBody,
  //           null,
  //           null, emailAttach, null, true);
  //       }

  //       if (isNullorEmpty(service_email) && isNullorEmpty(sales_email)) {
  //         if (!isNullorEmpty(account_email)) {

  //           nlapiSendEmail(112209, account_email, subject, emailBody,
  //             null,
  //             null, emailAttach, null, true);
  //         }
  //       }
  //       // if (!isNullorEmpty(account_email)) {

  //       //   nlapiSendEmail(35031, account_email, subject, emailBody,
  //       //     null,
  //       //     null, emailAttach, null, true);
  //       // }
  //     }

  //     // var fileSCFORM = nlapiMergeRecord(356, 'customer', custid, null, null,
  //     //   merge);
  //     // fileSCFORM.setName('Fuel_Surcharge_' + companyname + '.pdf');

  //     // fileSCFORM.setFolder(3284100); // Update the Documents folder with the date the email has been sent out to makwe it easier to download the PDF's

  //     // var id = nlapiSubmitFile(fileSCFORM);

  //     // recCustomer.setFieldValue('custentity_mpex_price_letter', id);
  //     recCustomer.setFieldValue('custentity_letter_sent', 1);


  //     nlapiSubmitRecord(recCustomer);
  //   } catch (error) {

  //   }


  //   var params = {
  //     custscript_mass_email_zee: parseInt(zee),
  //     custscript_mass_email_subject: subject,
  //     custscript_mass_email_template: template
  //   }

  //   reschedule = rescheduleScript(prev_inv_deploy, adhoc_inv_deploy, params);
  //   nlapiLogExecution('AUDIT', 'Reschedule Return', reschedule);
  //   if (reschedule == false) {
  //     return false;
  //   }

  //   return true;
  // });

  var oldCustomerId = null;
  var oldCustomerEntityId = null;
  var oldcustomerAccountsEmail = null;
  var oldcustomerServiceEmail = null;
  var oldcustomerSalesEmail = null;

  var count = 0;
  var toEmails = [];

  resultSetCustomer.forEachResult(function (searchResult) {

    var customerInternalId = searchResult.getValue('internalid');
    var customerId = searchResult.getValue('entityid');
    var companyName = searchResult.getValue('companyname');
    var customerAccountsEmail = searchResult.getValue('email');
    var customerServiceEmail = searchResult.getValue('custentity_email_service');
    var customerSalesEmail = searchResult.getValue('custentity_email_sales');
    var customerContactEmail = searchResult.getValue("email", "contact", null);

    var file = nlapiCreateEmailMerger(400);
    var mergeResult = file.merge();

    emailHtml = mergeResult.getBody();
    subject = mergeResult.getSubject();

   

    var emailAttach = new Object();

    if (oldCustomerId != customerInternalId && oldCustomerId != null) {

      if (isNullorEmpty(oldcustomerAccountsEmail) && isNullorEmpty(oldcustomerServiceEmail) && isNullorEmpty(oldcustomerSalesEmail)) {

      } else {

        emailHtml = emailHtml.replace(/<nlemcustomerid>/gi, oldCustomerEntityId);

        emailAttach['entity'] = oldCustomerId;

        // nlapiSendEmail(112209, 'ankith.ravindran@mailplus.com.au', subject, emailBody, null, null, emailAttach, null, true);
        if (!isNullorEmpty(oldcustomerServiceEmail)) {
          toEmails[toEmails.length] = oldcustomerServiceEmail
          // nlapiSendEmail(112209, oldcustomerServiceEmail, subject, emailHtml,
          //   null,
          //   null, emailAttach, null, true);
        }
        if (!isNullorEmpty(oldcustomerSalesEmail)) {
          toEmails[toEmails.length] = oldcustomerSalesEmail
          // nlapiSendEmail(112209, oldcustomerSalesEmail, subject, emailHtml,
          //   null,
          //   null, emailAttach, null, true);
        }

        if (!isNullorEmpty(oldcustomerAccountsEmail)) {
          toEmails[toEmails.length] = oldcustomerSalesEmail
          // nlapiSendEmail(112209, oldcustomerAccountsEmail, subject, emailHtml,
          //   null,
          //   null, emailAttach, null, true);
        }

      }

      nlapiSendEmail(112209, toEmails, subject, emailHtml,
        null,
        null, emailAttach, null, false);


      var recCustomer = nlapiLoadRecord('customer', oldCustomerId);
      recCustomer.setFieldValue('custentity_mass_email_sent', 1);
      nlapiSubmitRecord(recCustomer, false, false);

      toEmails = [];

      var params = {};

      reschedule = rescheduleScript(prev_inv_deploy, adhoc_inv_deploy, params);
      nlapiLogExecution('AUDIT', 'Reschedule Return', reschedule);
      if (reschedule == false) {
        return false;
      }

    }

    toEmails[toEmails.length] = customerContactEmail


    emailHtml = emailHtml.replace(/<nlemcustomerid>/gi, customerId);
    emailAttach['entity'] = customerInternalId;

    // nlapiSendEmail(author, recipient, "subject", "body", "cc", "bcc", records, attachments, notifySenderOnBounce, internalOnly, "replyTo");

    // nlapiSendEmail(653718, customerContactEmail, subject, emailHtml,
    //   null,
    //   null, emailAttach, null, true);


    oldCustomerId = customerInternalId;
    oldCustomerEntityId = customerId;
    oldcustomerAccountsEmail = customerAccountsEmail;
    oldcustomerServiceEmail = customerServiceEmail;
    oldcustomerSalesEmail = customerSalesEmail;
    count++;
    return true;
  });

  if (count > 0) {
    var emailAttach = new Object();
    if (isNullorEmpty(oldcustomerAccountsEmail) && isNullorEmpty(oldcustomerServiceEmail) && isNullorEmpty(oldcustomerSalesEmail)) {

    } else {

     emailHtml = emailHtml.replace(/<nlemcustomerid>/gi, oldCustomerEntityId);

      emailAttach['entity'] = oldCustomerId;

      // nlapiSendEmail(112209, 'ankith.ravindran@mailplus.com.au', subject, emailBody, null, null, emailAttach, null, true);
      if (!isNullorEmpty(oldcustomerServiceEmail)) {
        toEmails[toEmails.length] = oldcustomerServiceEmail
        // nlapiSendEmail(112209, oldcustomerServiceEmail, subject, emailHtml,
        //   null,
        //   null, emailAttach, null, true);
      }
      if (!isNullorEmpty(oldcustomerSalesEmail)) {
        toEmails[toEmails.length] = oldcustomerSalesEmail
        // nlapiSendEmail(112209, oldcustomerSalesEmail, subject, emailHtml,
        //   null,
        //   null, emailAttach, null, true);
      }

      if (!isNullorEmpty(oldcustomerAccountsEmail)) {
        toEmails[toEmails.length] = oldcustomerSalesEmail
        // nlapiSendEmail(112209, oldcustomerAccountsEmail, subject, emailHtml,
        //   null,
        //   null, emailAttach, null, true);
      }

    }

    nlapiSendEmail(112209, toEmails, subject, emailHtml,
      null,
      null, emailAttach, null, false);


    var recCustomer = nlapiLoadRecord('customer', oldCustomerId);
    recCustomer.setFieldValue('custentity_mass_email_sent', 1);
    nlapiSubmitRecord(recCustomer, false, false);

  }



}

function getDate() {
  var date = new Date();
  if (date.getHours() > 6) {
    date = nlapiAddDays(date, 1);
  }
  date = nlapiDateToString(date);

  return date;
}
