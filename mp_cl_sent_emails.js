/**
 * Module Description
 * 
 * NSVersion    Date            			Author         
 * 1.00       	2020-07-20 19:11:21   		Ankith
 *
 * Description:         
 * 
 * @Last Modified by:   Ankith
 * @Last Modified time: 2020-08-17 11:02:14
 *
 */

var baseURL = 'https://1048144.app.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
    baseURL = 'https://1048144-sb3.app.netsuite.com';
}

function pageInit() {}

var resultSetLength = nlapiGetFieldValue('custpage_result_set_length');
if (!isNullorEmpty(resultSetLength)) {
    var progressBar = setInterval(updateProgressBar, 5000);
}

function updateProgressBar() {
    var letter_type = nlapiGetFieldValue('custpage_letter_type');
    var subject = nlapiGetFieldValue('custpage_subject');
    var template = nlapiGetFieldValue('custpage_template');
    var resultSetLength = nlapiGetFieldValue('custpage_result_set_length');
    var pdf = nlapiGetFieldValue('custpage_pdf');

    console.log("updateProgressBar is running");
    if (!isNullorEmpty(resultSetLength)) {
        try {

            var resultCustomerSet = loadMPEXPriceCustomers(letter_type);

            var nb_records_left_to_move = getResultSetLength(resultCustomerSet);
            console.log("Nb records left to move : ", nb_records_left_to_move);
            if (nb_records_left_to_move == 0) {
                clearInterval(progressBar);
                $('#progress-records').attr('class', 'progress-bar progress-bar-success');
                // displaySentEmails();
                // var upload_url = baseURL + nlapiResolveURL('SUITELET', 'customscript_sl_download_letters', 'customdeploy1') + '&type=' + letter_type;
                // window.open(upload_url, "_self");
            }

            var nb_records_moved = resultSetLength - nb_records_left_to_move;
            var width = parseInt((nb_records_moved / resultSetLength) * 100);

            $('#progress-records').attr('aria-valuenow', nb_records_moved);
            $('#progress-records').attr('style', 'width:' + width + '%');
            $('#progress-records').text('Emails Sent : ' + nb_records_moved + ' / ' + resultSetLength);
            console.log("nb_records_moved : ", nb_records_moved);
            console.log("width : ", width);
        } catch (e) {
            if (e instanceof nlobjError) {
                if (e.getCode() == "SCRIPT_EXECUTION_USAGE_LIMIT_EXCEEDED") {
                    var params_progress = {
                        custparam_letter_type: letter_type,
                        custparam_subject: subject,
                        custparam_template: template,
                        custparam_pdf: pdf,
                        custparam_result_set_length: resultSetLength
                    };
                    params_progress = JSON.stringify(params_progress);
                    var reload_url = baseURL + nlapiResolveURL('suitelet', 'customscript_sl_sent_email', 'customdeploy1') + '&custparam_params=' + params_progress;
                    window.open(reload_url, "_self");
                }
            }
        }
    }
}


function loadMPEXPriceCustomers(letter_type) {
    var mpexPriceSearch = nlapiLoadSearch('customer', 'customsearch_mpex_price_point_customer_2');

    if (letter_type != '0') {
        var addFilterExpression = new nlobjSearchFilter('custentity_mpex_price_letter_types', null, 'anyof', parseInt(letter_type));
        mpexPriceSearch.addFilter(addFilterExpression);
    }


    var resultSetCustomer = mpexPriceSearch.runSearch();

    return resultSetCustomer;
}

var recordDataSet = [];
$(document).ready(function() {
    $('#reallocated-barcodes-records').DataTable({
        data: recordDataSet,
        columns: [{
            title: "Internal ID"
        }, {
            title: "ID"
        }, {
            title: "Company Name"
        }, {
            title: "URL"
        }],
        pageLength: 100
    });
});

function loadMPEXPriceCustomersSent(letter_type) {
    var mpexPriceSearch = nlapiLoadSearch('customer', 'customsearch_mpex_price_point_customer_3');

    if (letter_type != '0') {
        var addFilterExpression = new nlobjSearchFilter('custentity_mpex_price_letter_types', null, 'anyof', parseInt(letter_type));
        mpexPriceSearch.addFilter(addFilterExpression);
    }

    var resultSetCustomer = mpexPriceSearch.runSearch();

    return resultSetCustomer;
}

function getResultSetLength(resultSet) {
    var currentIndex = 0;
    var totalResultsLength = 0;
    var resultsArray = resultSet.getResults(currentIndex, currentIndex + 1000);
    if (isNullorEmpty(resultsArray)) {
        return 0;
    }
    totalResultsLength += resultsArray.length;
    while (resultsArray.length == 1000) {
        currentIndex += 1000;
        resultsArray = resultSet.getResults(currentIndex, currentIndex + 1000);
        totalResultsLength += resultsArray.length;
    }
    console.log("totalResultsLength in getResultSetLength : ", totalResultsLength);
    return totalResultsLength;
}

function displaySentEmails() {
    console.log("displaySentEmails()");

    var letter_type = nlapiGetFieldValue('custpage_letter_type');
    // Display the table of barcodes
    var resultCustomerSet = loadMPEXPriceCustomersSent(letter_type);
    var recordDataSet = [];
    var slice_index = 0;

    do {
        var resultCustomerSlice = resultCustomerSet.getResults(slice_index * 1000, (slice_index + 1) * 1000);
        console.log("resultCustomerSlice.length in displaySentEmails() : ", resultCustomerSlice.length);
        resultCustomerSlice.forEach(function(searchCustomerResult) {
            var internalid = searchCustomerResult.getValue('internalid');
            console.log(internalid)
            var entityid = searchCustomerResult.getValue('entityid');
            var companyname = searchCustomerResult.getValue('companyname');
            var letter = searchCustomerResult.getValue('custentity_mpex_price_letter');
            // var fileRecord2 = nlapiLoadFile(letter);
            // var url2 = fileRecord2.getURL();

            recordDataSet.push([internalid, entityid, companyname, letter]);

            console.log(recordDataSet)

            return true;
        });

        slice_index += 1;
    } while (resultCustomerSlice.length == 1000)

    // Update datatable rows.
    var datatable = $('#reallocated-barcodes-records').dataTable().api();
    datatable.clear();
    datatable.rows.add(recordDataSet);
    datatable.draw();
}