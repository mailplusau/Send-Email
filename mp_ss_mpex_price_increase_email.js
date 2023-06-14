/**
 * Module Description
 * 
 * NSVersion    Date            			Author         
 * 1.00       	2020-07-20 18:06:05   		Ankith
 *
 * Description:         
 * 
 * @Last Modified by:   Ankith Ravindran
 * @Last Modified time: 2021-10-18 14:26:31
 *
 */



var adhoc_inv_deploy = 'customdeploy2';
var prev_inv_deploy = null;
var ctx = nlapiGetContext();

var price_plans = ['null', 'Manual Platinum', 'Pro Gold', 'Pro Platinum', 'Pro Plus', 'Pro Standard']
var mpex_prices_5kg = [25.55, 25.55, 25.55, 23.65, 22.9, 28.96]
var mpex_prices_3kg = [19.45, 19.45, 19.45, 16.5, 15.8, 21.98]
var mpex_prices_1kg = [15.8, 12.49, 15.8, 13.4, 12.8, 17.8]
var mpex_prices_500g = [11.99, 9.06, 11.99, 10.15, 9.72, 13.61]
var mpex_prices_B4 = [8.83, 8.83, 8.83, 8.83, 8.83, 9.88]
var mpex_prices_C5 = [8.83, 8.83, 8.83, 8.83, 8.83, 9.88]
var mpex_prices_DL = [8.83, 8.83, 8.83, 8.83, 8.83, 9.88]

function sendEmailSS() {

    var letter_type = ctx.getSetting('SCRIPT', 'custscript_letter_type');
    var subject = ctx.getSetting('SCRIPT', 'custscript_subject');
    var template = ctx.getSetting('SCRIPT', 'custscript_template');
    var pdf = ctx.getSetting('SCRIPT', 'custscript_pdf');
    prev_inv_deploy = ctx.getDeploymentId();



    var mpexPricingCustomerList = nlapiLoadSearch('customrecord_product_pricing', 'customsearch_prod_pricing_customer_lev_5');

    var resultSetMpexPricing = mpexPricingCustomerList.runSearch();

    var all_pages = [];

    resultSetMpexPricing.forEachResult(function (searchResult) {

        var customerInternalId = searchResult.getValue("internalid", "CUSTRECORD_PROD_PRICING_CUSTOMER", "GROUP");
        var customerId = searchResult.getValue("entityid", "CUSTRECORD_PROD_PRICING_CUSTOMER", "GROUP");
        var companyName = searchResult.getValue("custrecord_prod_pricing_customer", null, "GROUP");
        var customerAccountsEmail = searchResult.getValue("email", "CUSTRECORD_PROD_PRICING_CUSTOMER", "GROUP");
        var customerServiceEmail = searchResult.getValue("custentity_email_service", "CUSTRECORD_PROD_PRICING_CUSTOMER", "GROUP");
        var customerSalesEmail = searchResult.getValue("custentity_email_sales", "CUSTRECORD_PROD_PRICING_CUSTOMER", "GROUP");
        var pricingPlan = searchResult.getValue("custrecord_prod_pricing_pricing_plan", null, "GROUP");
        // var tempName = searchResult.getValue('name');
        // var mpex5kg_old = searchResult.getText('custentity_mpex_5kg_price_point')
        // var mpex5kg = searchResult.getText('custentity_mpex_5kg_price_point_new')
        // var mpex3kg_old = searchResult.getText('custentity_mpex_3kg_price_point')
        // var mpex3kg = searchResult.getText('custentity_mpex_3kg_price_point_new')
        // var mpex1kg_old = searchResult.getText('custentity_mpex_1kg_price_point')
        // var mpex1kg = searchResult.getText('custentity_mpex_1kg_price_point_new')
        // var mpex500g_old = searchResult.getText('custentity_mpex_500g_price_point')
        // var mpex500g = searchResult.getText('custentity_mpex_500g_price_point_new')
        // var mpexb4_old = searchResult.getText('custentity_mpex_b4_price_point')
        // var mpexb4 = searchResult.getText('custentity_mpex_b4_price_point_new')
        // var mpexc5_old = searchResult.getText('custentity_mpex_c5_price_point')
        // var mpexc5 = searchResult.getText('custentity_mpex_c5_price_point_new')
        // var mpexdl_old = searchResult.getText('custentity_mpex_dl_price_point')
        // var mpexdl = searchResult.getText('custentity_mpex_dl_price_point_new')

        // nlapiLogExecution('DEBUG', 'mpex5kg', mpex5kg);
        // nlapiLogExecution('DEBUG', 'mpex3kg', mpex3kg);
        // nlapiLogExecution('DEBUG', 'mpex1kg', mpex1kg);
        // nlapiLogExecution('DEBUG', 'mpex500g', mpex500g);
        // nlapiLogExecution('DEBUG', 'mpexb4', mpexb4);
        // nlapiLogExecution('DEBUG', 'mpexc5', mpexc5);
        // nlapiLogExecution('DEBUG', 'mpexdl', mpexdl);

        // if (isNullorEmpty(mpex5kg)) {
        //     mpex5kg = 'null';
        // }
        // if (isNullorEmpty(mpex3kg)) {
        //     mpex3kg = 'null';
        // }
        // if (isNullorEmpty(mpex1kg)) {
        //     mpex1kg = 'null';
        // }
        // if (isNullorEmpty(mpex500g)) {
        //     mpex500g = 'null';
        // }
        // if (isNullorEmpty(mpexb4)) {
        //     mpexb4 = 'null';
        // }
        // if (isNullorEmpty(mpexc5)) {
        //     mpexc5 = 'null';
        // }
        // if (isNullorEmpty(mpexdl)) {
        //     mpexdl = 'null';
        // }

        // nlapiLogExecution('DEBUG', 'mpex5kg', mpex5kg);
        // nlapiLogExecution('DEBUG', 'mpex3kg', mpex3kg);
        // nlapiLogExecution('DEBUG', 'mpex1kg', mpex1kg);
        // nlapiLogExecution('DEBUG', 'mpex500g', mpex500g);
        // nlapiLogExecution('DEBUG', 'mpexb4', mpexb4);
        // nlapiLogExecution('DEBUG', 'mpexc5', mpexc5);
        // nlapiLogExecution('DEBUG', 'mpexdl', mpexdl);


        // var price_plan_index_5kg = price_plans.indexOf(mpex5kg);
        // var price_plan_index_3kg = price_plans.indexOf(mpex3kg);
        // var price_plan_index_1kg = price_plans.indexOf(mpex1kg);
        // var price_plan_index_500g = price_plans.indexOf(mpex500g);
        // var price_plan_index_b4 = price_plans.indexOf(mpexb4);
        // var price_plan_index_c5 = price_plans.indexOf(mpexc5);
        // var price_plan_index_dl = price_plans.indexOf(mpexdl);

        // nlapiLogExecution('DEBUG', 'price_plan_index_5kg', price_plan_index_5kg);
        // nlapiLogExecution('DEBUG', 'price_plan_index_3kg', price_plan_index_3kg);
        // nlapiLogExecution('DEBUG', 'price_plan_index_1kg', price_plan_index_1kg);
        // nlapiLogExecution('DEBUG', 'price_plan_index_500g', price_plan_index_500g);
        // nlapiLogExecution('DEBUG', 'price_plan_index_b4', price_plan_index_b4);
        // nlapiLogExecution('DEBUG', 'price_plan_index_c5', price_plan_index_c5);
        // nlapiLogExecution('DEBUG', 'price_plan_index_dl', price_plan_index_dl);

        var recCustomer = nlapiLoadRecord('customer', customerInternalId);
        recCustomer.setFieldValue('custentity_mpex_price_letter_sent', 1);

        // var postaladdress = '';
        // var siteaddressfull = '';
        // var billaddressfull = '';

        // for (p = 1; p <= recCustomer.getLineItemCount('addressbook'); p++) {
        //     if (isNullorEmpty(postaladdress) && recCustomer.getLineItemValue('addressbook', 'isresidential', p) == "T") {
        //         if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addressee', p))) {
        //             postaladdress += recCustomer.getLineItemValue('addressbook', 'addressee', p) + '\n';
        //         }

        //         if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr1', p))) {
        //             postaladdress += recCustomer.getLineItemValue('addressbook', 'addr1', p) + '\n';
        //         }
        //         if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr2', p))) {
        //             postaladdress += recCustomer.getLineItemValue('addressbook', 'addr2', p) + '\n';
        //         }
        //         if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'city', p))) {
        //             postaladdress += recCustomer.getLineItemValue('addressbook', 'city', p) + ' ';
        //         }
        //         if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'state', p))) {
        //             postaladdress += recCustomer.getLineItemValue('addressbook', 'state', p) + ' ';
        //         }
        //         if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'zip', p))) {
        //             postaladdress += recCustomer.getLineItemValue('addressbook', 'zip', p);
        //         }
        //     }
        //     if (recCustomer.getLineItemValue('addressbook', 'defaultshipping', p) == "T") {

        //         if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addressee', p))) {
        //             siteaddressfull += recCustomer.getLineItemValue('addressbook', 'addressee', p) + '\n';
        //         }

        //         if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr1', p))) {
        //             siteaddressfull += recCustomer.getLineItemValue('addressbook', 'addr1', p) + '\n';
        //         }
        //         if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr2', p))) {
        //             siteaddressfull += recCustomer.getLineItemValue('addressbook', 'addr2', p) + '\n';
        //         }
        //         if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'city', p))) {
        //             siteaddressfull += recCustomer.getLineItemValue('addressbook', 'city', p) + ' ';
        //         }
        //         if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'state', p))) {
        //             siteaddressfull += recCustomer.getLineItemValue('addressbook', 'state', p) + ' ';
        //         }
        //         if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'zip', p))) {
        //             siteaddressfull += recCustomer.getLineItemValue('addressbook', 'zip', p);
        //         }
        //     }
        //     if (isNullorEmpty(billaddressfull) && recCustomer.getLineItemValue('addressbook', 'defaultbilling', p) == "T") {

        //         if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addressee', p))) {
        //             billaddressfull += recCustomer.getLineItemValue('addressbook', 'addressee', p) + '\n';
        //         }
        //         if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr1', p))) {
        //             billaddressfull += recCustomer.getLineItemValue('addressbook', 'addr1', p) + '\n';
        //         }
        //         if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr2', p))) {
        //             billaddressfull += recCustomer.getLineItemValue('addressbook', 'addr2', p) + '\n';
        //         }
        //         if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'city', p))) {
        //             billaddressfull += recCustomer.getLineItemValue('addressbook', 'city', p) + ' ';
        //         }
        //         if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'state', p))) {
        //             billaddressfull += recCustomer.getLineItemValue('addressbook', 'state', p) + ' ';
        //         }
        //         if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'zip', p))) {
        //             billaddressfull += recCustomer.getLineItemValue('addressbook', 'zip', p);
        //         }
        //     }
        // }

        var merge = new Array();
        // merge['NLSCDATE'] = '15/10/2021';
        // merge['NLSCBILLADDRESS'] = billaddressfull;
        // merge['NLSC5KG'] = mpex_prices_5kg[price_plan_index_5kg];
        // merge['NLSC3KG'] = mpex_prices_3kg[price_plan_index_3kg];
        // merge['NLSC1KG'] = mpex_prices_1kg[price_plan_index_1kg];
        // merge['NLSC500G'] = mpex_prices_500g[price_plan_index_500g];
        // merge['NLSCB4'] = mpex_prices_B4[price_plan_index_b4];
        // merge['NLSCC5'] = mpex_prices_C5[price_plan_index_c5];
        // merge['NLSCDL'] = mpex_prices_DL[price_plan_index_dl];

        if (pricingPlan == 15) {
            //Express Business
            var file = nlapiCreateEmailMerger(395);

            var fileSCFORM = nlapiMergeRecord(397, 'customer', customerInternalId, null, null, merge);
            fileSCFORM.setName('MPEX_Business_20230703_' + customerId + '-' + companyName + '.pdf');

            fileSCFORM.setFolder(2414361);

            var id = nlapiSubmitFile(fileSCFORM);


        } else if (pricingPlan == 16) {
            //Expresss Merchant
            var file = nlapiCreateEmailMerger(396);

            var fileSCFORM = nlapiMergeRecord(398, 'customer', customerInternalId, null, null, merge);
            fileSCFORM.setName('MPEX_Merchant_20230703_' + customerId + '-' + companyName + '.pdf');

            fileSCFORM.setFolder(2414361);

            var id = nlapiSubmitFile(fileSCFORM);

        }


        var mergeResult = file.merge();

        emailHtml = mergeResult.getBody();
        subject = mergeResult.getSubject();
        emailHtml = emailHtml.replace(/<NLEMCUSTOMERID>/gi, customerId);
        // emailHtml = emailHtml.replace(/<nlem3kg>/gi, mpex_prices_3kg[price_plan_index_3kg]);
        // emailHtml = emailHtml.replace(/<nlem1kg>/gi, mpex_prices_1kg[price_plan_index_1kg]);
        // emailHtml = emailHtml.replace(/<nlem500g>/gi, mpex_prices_500g[price_plan_index_500g]);
        // emailHtml = emailHtml.replace(/<nlemb4>/gi, mpex_prices_B4[price_plan_index_b4]);
        // emailHtml = emailHtml.replace(/<nlemc5>/gi, mpex_prices_C5[price_plan_index_c5]);
        // emailHtml = emailHtml.replace(/<nlemdl>/gi, mpex_prices_DL[price_plan_index_dl]);

        // nlapiLogExecution('DEBUG', 'emailHtml', emailHtml);
        // //
        // //
        // // var mergeResult = nlapiCreateEmailMerger(template).merge();
        // // var emailBody = mergeResult.getBody();

        var emailAttach = new Object();
        emailAttach['entity'] = customerInternalId;

        // if (isNullorEmpty(account_email) && isNullorEmpty(service_email)) {

        // } else {

        //     if (!isNullorEmpty(account_email)) {
        //         nlapiSendEmail(112209, account_email, subject, emailHtml, null, null, emailAttach, null, true);
        //     } else if (!isNullorEmpty(service_email)) {
        //         nlapiSendEmail(112209, service_email, subject, emailHtml, null, null, emailAttach, null, true);
        //     }
        // }



        // var fileSCFORM = nlapiMergeRecord(323, 'customer', customerInternalId, null, null, merge);
        // fileSCFORM.setName('MPEX_Pricing_202111' + companyName + '.pdf');

        // fileSCFORM.setFolder(2414361);

        // var id = nlapiSubmitFile(fileSCFORM);

        if (isNullorEmpty(customerAccountsEmail) && isNullorEmpty(customerServiceEmail) && isNullorEmpty(customerSalesEmail)) {

        } else {

            // nlapiSendEmail(112209, 'ankith.ravindran@mailplus.com.au', subject, emailBody, null, null, emailAttach, null, true);
            if (!isNullorEmpty(customerServiceEmail)) {
                nlapiSendEmail(187729, customerServiceEmail, subject, emailHtml,
                    null,
                    null, emailAttach, null, true);
            }
            if (!isNullorEmpty(customerSalesEmail)) {
                nlapiSendEmail(187729, customerSalesEmail, subject, emailHtml,
                    null,
                    null, emailAttach, null, true);
            }

            if (!isNullorEmpty(customerAccountsEmail)) {

                nlapiSendEmail(187729, customerAccountsEmail, subject, emailHtml,
                    null,
                    null, emailAttach, null, true);
            }

        }


        recCustomer.setFieldValue('custentity_mpex_price_letter', id);
        nlapiSubmitRecord(recCustomer);

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