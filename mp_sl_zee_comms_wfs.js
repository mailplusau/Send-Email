/**
 * Author:               Ankith Ravindran
 * Created on:           Thu May 09 2024
 * Modified on:          Thu May 09 2024 16:39:20
 * SuiteScript Version:   
 * Description:           
 *
 * Copyright (c) 2024 MailPlus Pty. Ltd.
 */



var ctx = nlapiGetContext();

var zee = 0;
var role = ctx.getRole();
var row_count = 0;
var customer_list_page = null;
if (role == 1000) { //Role is Franchisee
    zee = ctx.getUser(); //Get Franchisee ID
} else {
    zee = 0;
}

function zeeCommsWF(request, response) {
    if (request.getMethod() == "GET") {

        var zeeInternaldId = request.getParameter('zeeinternalid');
        var buttonClicked = request.getParameter('buttontype');
        nlapiLogExecution('DEBUG', 'zeeInternaldId', zeeInternaldId);
        nlapiLogExecution('DEBUG', 'buttonClicked', buttonClicked);

        var zeeRecord = nlapiLoadRecord('partner', zeeInternaldId);
        var zeeName = zeeRecord.getFieldValue('companyname');
        var buttonClickedJSON = zeeRecord.getFieldValue('custentity_zee_mass_email');
        var zeeMainContact = zeeRecord.getFieldValue('custentity3');

        var form = nlapiCreateForm('Thank you. Your action has been successful Our team will reach out ASAP.');


        var parsedButtonClickedJSON = null;


        if (!isNullorEmpty(buttonClickedJSON)) {
            parsedButtonClickedJSON = JSON.parse(buttonClickedJSON)
        } else {
            var data_set = [];
            data_set.push({
                leadcampaigncount: 0,
                lpocount: 0,
                premiumcount: 0,
                buycustomerscount: 0,
                callwithchriscount: 0,
            });

            parsedButtonClickedJSON = data_set
        }

        if (buttonClicked == 'lead') {


            var leadcampaigncount = parseInt(parsedButtonClickedJSON[0].leadcampaigncount);
            nlapiLogExecution('DEBUG', 'leadcampaigncount', leadcampaigncount);
            leadcampaigncount++;
            parsedButtonClickedJSON[0].leadcampaigncount = leadcampaigncount;


            var emailHtml = 'This email is to notify you that ' + zeeMainContact + ' from ' + zeeName + ' has requested time to with you to start a lead generation campaign.\n\nPlease reply with an acknowledge of receipt and/or an appropriate time to speak. '

            nlapiSendEmail(zeeInternaldId, 'liam.pike@mailplus.com.au', 'Schedule a call with me', emailHtml, 'lee.russell@mailplus.com.au', ['mailplusit@mailplus.com.au']);
        }

        if (buttonClicked == 'lpo') {


            var lpocount = parseInt(parsedButtonClickedJSON[0].lpocount);
            lpocount++;
            parsedButtonClickedJSON[0].lpocount = lpocount;


            var emailHtml = 'This email is to notify you that ' + zeeMainContact + ' from ' + zeeName + ' has confirmed their interest in the LPO program and wishes to explore further in a meeting and to determine the best LPO in the Franchisee’s area.\n\nPlease reply with an acknowledge of receipt and/or an appropriate time to speak.'

            nlapiSendEmail(zeeInternaldId, 'kerry.oneill@mailplus.com.au', 'Assign me an LPO to work with ', emailHtml, 'michael.mcdaid@mailplus.com.au', ['mailplusit@mailplus.com.au']);
        }

        if (buttonClicked == 'premium') {


            var premiumcount = parseInt(parsedButtonClickedJSON[0].premiumcount);
            premiumcount++;
            parsedButtonClickedJSON[0].premiumcount = premiumcount;


            var emailHtml = 'This email is to notify you that ' + zeeMainContact + ' from ' + zeeName + ' wants Premium Delivery turned on in their area.\n\nPlease work with the Franchisee on their hub status, suburb selection and onboarding material.\n\nReply with an acknowledge of receipt and/or an appropriate time to speak. '

            nlapiSendEmail(zeeInternaldId, 'michael.mcdaid@mailplus.com.au', 'Activate Premium for my Territory ', emailHtml, ['fiona.harrison@mailplus.com.au', 'ankith.ravindran@mailplus.com.au'], ['mailplusit@mailplus.com.au']);
        }

        if (buttonClicked == 'buycustomers') {


            var buycustomerscount = parseInt(parsedButtonClickedJSON[0].buycustomerscount);
            buycustomerscount++;
            parsedButtonClickedJSON[0].buycustomerscount = buycustomerscount;


            var emailHtml = 'This email is to notify you that ' + zeeMainContact + ' from ' + zeeName + ' has requested time to with you to discuss the strategy around buying customers.\n\nPlease reply with an acknowledge of receipt and/or an appropriate time to speak.'

            nlapiSendEmail(zeeInternaldId, 'michael.mcdaid@mailplus.com.au', 'Buying Customers: Scheule a call with me ', emailHtml, ['greg.hart@mailplus.com.au'], ['mailplusit@mailplus.com.au']);
        }

        if (buttonClicked == 'callwithchris') {


            var callwithchriscount = parseInt(parsedButtonClickedJSON[0].callwithchriscount);
            callwithchriscount++;
            parsedButtonClickedJSON[0].callwithchriscount = callwithchriscount;


            var emailHtml = 'This email is to notify you that ' + zeeMainContact + ' from ' + zeeName + ' has request a call from you.\n\nPlease reply with an acknowledge of receipt and/or an appropriate time to speak'

            nlapiSendEmail(zeeInternaldId, 'chris.burgess@mailplus.com.au', 'Scheule a call with me ', emailHtml, null, ['mailplusit@mailplus.com.au']);
        }



        zeeRecord.setFieldValue('custentity_zee_mass_email', JSON.stringify(parsedButtonClickedJSON));
        nlapiSubmitRecord(zeeRecord, false, false);

        response.writePage(form);

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

/**
 * The header showing that the results are loading.
 * @returns {String} `inlineQty`
 */
function loadingSection() {


    var inlineHtml = '<div class="wrapper loading_section" style="height: 10em !important;left: 50px !important">';
    inlineHtml += '<div class="row">';
    inlineHtml += '<div class="col-xs-12 ">';
    inlineHtml += '<h1 style="color: #095C7B;">Loading</h1>';
    inlineHtml += '</div></div></div></br></br>';
    inlineHtml += '<div class="wrapper loading_section">';
    inlineHtml += '<div class="blue ball"></div>'
    inlineHtml += '<div class="red ball"></div>'
    inlineHtml += '<div class="yellow ball"></div>'
    inlineHtml += '<div class="green ball"></div>'

    inlineHtml += '</div>'

    return inlineHtml;
}
