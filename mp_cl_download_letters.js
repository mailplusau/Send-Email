/**
 * Module Description
 * 
 * NSVersion    Date            			Author         
 * 1.00       	2020-07-21 07:58:12   		Ankith
 *
 * Description:         
 * 
 * @Last Modified by:   Ankith
 * @Last Modified time: 2020-07-24 09:07:33
 *
 */

function saveRecord() {
    var customer_id_elem = document.getElementsByClassName("customer_id");
    var letter_download_elem = document.getElementsByClassName("letter_download");

    for (var x = 0; x < customer_id_elem.length; x++) {
        letter_download_elem[x].click();
        var recCustomer = nlapiLoadRecord('customer', customer_id_elem[x].value);
        recCustomer.setFieldValue('custentity_mpex_price_letter_printed', 1);
        nlapiSubmitRecord(recCustomer, false, true);
    }
}