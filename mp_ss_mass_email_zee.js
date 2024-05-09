/**
 * Module Description
 *
 * Author:               Ankith Ravindran
 * Created on:           Thu May 09 2024
 * Modified on:          Thu May 09 2024 16:13:47
 * SuiteScript Version:   
 * Description:           
 *
 * Copyright (c) 2024 MailPlus Pty. Ltd.
 */


var adhoc_inv_deploy = 'customdeploy2';
var prev_inv_deploy = null;
var ctx = nlapiGetContext();

function sendMassEmailToZees() {

    // Search Name: Active Franchisees - Important Details
    var activeZeesSearch = nlapiLoadSearch('partner',
        'customsearch5662');

    var activeZeesSearchResult = activeZeesSearch.runSearch();
    var count = 0;
    var customer_count = 0;

    activeZeesSearchResult.forEachResult(function (searchResult) {


        var zeeInternaldId = searchResult.getValue('internalid');
        var zeeName = searchResult.getValue('companyname');
        var zeeEmail = searchResult.getValue('email');
        var zeePersonalEmail = searchResult.getValue('custentity_personal_email_address');

        var file = nlapiCreateEmailMerger(444);
        // file.setEntity('entity', zeeInternaldId);
        // file.addMergeField({
        //     fieldName: 'custbody_disposition_notification_to',
        //     value: 409635
        // });
        var mergeResult = file.merge();
        // Determine the subject and body.
        var emailHtml = mergeResult.getBody();

        // email subject not declared in template due to other uses. Need to manually set.
        var emailSubject = 'Action Required: Unlock Opportunities for Growth';

        var emailAttach = new Object();
        emailAttach['partner'] = zeeInternaldId;



        var startLeadCampaign = '<a class="mcnButton " title="Start Lead Campaign" href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1859&deploy=1&compid=1048144&h=c1766453c6af5620536d&zeeinternalid=' + zeeInternaldId + '&buttontype=lead" target="_blank" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;width: max-content;">Start Lead Campaign</a>';

        var lpoProject = '<a class=" " href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1859&deploy=1&compid=1048144&h=c1766453c6af5620536d&zeeinternalid=' + zeeInternaldId + '&buttontype=lpo" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;width: max-content;" target="_blank" >Assign me an LPO to work with</a>';

        var activatePremium = '<a class=" " href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1859&deploy=1&compid=1048144&h=c1766453c6af5620536d&zeeinternalid=' + zeeInternaldId + '&buttontype=premium" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;width: max-content;" target="_blank">Activate Premium for my Territory</a>';

        var buyCustomers = '<a class=" " href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1859&deploy=1&compid=1048144&h=c1766453c6af5620536d&zeeinternalid=' + zeeInternaldId + '&buttontype=buycustomers" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;width: max-content;" target="_blank" >Buy Customers</a>';

        var callWithCrhis = '<a class=" " href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1859&deploy=1&compid=1048144&h=c1766453c6af5620536d&zeeinternalid=' + zeeInternaldId + '&buttontype=callwithchris" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;width: max-content;" target="_blank">Schedule Call with Chris Burgess</a>';


        emailHtml = emailHtml.replace(/nlemstartleadcampaign/gi, startLeadCampaign);
        emailHtml = emailHtml.replace(/nlemlpo/gi, lpoProject);
        emailHtml = emailHtml.replace(/nlempremium/gi, activatePremium);
        emailHtml = emailHtml.replace(/nlembuycustomer/gi, buyCustomers);
        emailHtml = emailHtml.replace(/nlemcallwithchris/gi, callWithCrhis);


        nlapiSendEmail(-5, zeePersonalEmail, emailSubject, emailHtml, null, null, emailAttach);

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
