/**
 * Module Description
 *
 * NSVersion    Date            			Author
 * 1.00       	2020-07-20 19:11:21   		Ankith
 *
 * Description:
 *
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-05-12T08:17:51+10:00
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
  var zee = nlapiGetFieldValue('custpage_zee');
  var subject = nlapiGetFieldValue('custpage_subject');
  var template = nlapiGetFieldValue('custpage_template');
  var resultSetLength = nlapiGetFieldValue('custpage_result_set_length');
  var pdf = nlapiGetFieldValue('custpage_pdf');

  console.log("updateProgressBar is running");
  if (!isNullorEmpty(resultSetLength)) {
    try {

      var resultCustomerSet = loadCustomers(zee);

      var nb_records_left_to_move = getResultSetLength(resultCustomerSet);
      console.log("Nb records left to move : ", nb_records_left_to_move);
      if (nb_records_left_to_move == 0) {
        clearInterval(progressBar);
        $('#progress-records').attr('class',
          'progress-bar progress-bar-success');
        // displaySentEmails();
        var upload_url = baseURL + nlapiResolveURL('SUITELET',
            'customscript_sl_download_letters', 'customdeploy1') + '&type=' +
          letter_type;
        window.open(upload_url, "_self");
      }

      var nb_records_moved = resultSetLength - nb_records_left_to_move;
      var width = parseInt((nb_records_moved / resultSetLength) * 100);

      $('#progress-records').attr('aria-valuenow', nb_records_moved);
      $('#progress-records').attr('style', 'width:' + width + '%');
      $('#progress-records').text('Emails Sent : ' + nb_records_moved + ' / ' +
        resultSetLength);
      console.log("nb_records_moved : ", nb_records_moved);
      console.log("width : ", width);
    } catch (e) {
      if (e instanceof nlobjError) {
        if (e.getCode() == "SCRIPT_EXECUTION_USAGE_LIMIT_EXCEEDED") {
          var params_progress = {
            custparam_zee: zee,
            custparam_subject: subject,
            custparam_template: template,
            custparam_result_set_length: resultSetLength
          };
          params_progress = JSON.stringify(params_progress);
          var reload_url = baseURL + nlapiResolveURL('suitelet',
              'customscript_sl_sent_email', 'customdeploy1') +
            '&custparam_params=' + params_progress;
          window.open(reload_url, "_self");
        }
      }
    }
  }
}


function loadCustomers(zee) {
  // var customerSearch = nlapiLoadSearch('customer', 'customsearch_mass_email_customer_list');
  var customerSearch = nlapiLoadSearch('customer',
    'customsearch_bi_at_active_customers_2__6');

  var addFilterExpression = new nlobjSearchFilter('partner', null, 'anyof',
    parseInt(zee));
  customerSearch.addFilter(addFilterExpression);
  var resultSetCustomer = customerSearch.runSearch();

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
    }],
    pageLength: 100
  });
});

function loadCustomersSent(zee) {
  // var mpexPriceSearch = nlapiLoadSearch('customer', 'customsearch_mass_email_customer_list_2');
  var mpexPriceSearch = nlapiLoadSearch('customer',
    'customsearch_mass_email_customer_list__2');

  var addFilterExpression = new nlobjSearchFilter('partner', null, 'anyof',
    parseInt(zee));
  customerSearch.addFilter(addFilterExpression);
  var resultSetCustomer = customerSearch.runSearch();

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

  var zee = nlapiGetFieldValue('custpage_zee');
  // Display the table of barcodes
  var resultCustomerSet = loadCustomersSent(zee);
  var recordDataSet = [];
  var slice_index = 0;

  do {
    var resultCustomerSlice = resultCustomerSet.getResults(slice_index * 1000, (
      slice_index + 1) * 1000);
    console.log("resultCustomerSlice.length in displaySentEmails() : ",
      resultCustomerSlice.length);
    resultCustomerSlice.forEach(function(searchCustomerResult) {
      var internalid = searchCustomerResult.getValue('internalid');
      console.log(internalid)
      var entityid = searchCustomerResult.getValue('entityid');
      var companyname = searchCustomerResult.getValue('companyname');
      // var fileRecord2 = nlapiLoadFile(letter);
      // var url2 = fileRecord2.getURL();

      recordDataSet.push([internalid, entityid, companyname]);

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
