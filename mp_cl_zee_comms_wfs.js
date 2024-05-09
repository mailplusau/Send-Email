/*
 * Author:               Ankith Ravindran
 * Created on:           Fri May 10 2024
 * Modified on:          Fri May 10 2024 08:36:11
 * SuiteScript Version:  1.0 
 * Description:           
 *
 * Copyright (c) 2024 MailPlus Pty. Ltd.
 */


var baseURL = 'https://1048144.app.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
    baseURL = 'https://system.sandbox.netsuite.com';
}

function afterSubmit() {
    $('.loading_section').addClass('hide');
}


function pageInit() {

    // if (isNullorEmpty(nlapiGetFieldValue('create_service_change'))) {
    // document.getElementById('tr_submitter').style.display = 'none';
    // }
    $("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
    $("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
    $("#body").css("background-color", "#CFE0CE");

    afterSubmit();

}