/**
 * Module Description
 *
 * NSVersion    Date            			Author
 * 1.00       	2020-07-21 07:52:02   		Ankith
 *
 * Description:
 *
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-05-12T08:17:52+10:00
 *
 */

var baseURL = 'https://1048144.app.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
  baseURL = 'https://system.sandbox.netsuite.com';
}

var zee = 0;
var role = nlapiGetRole();

if (role == 1000) {
  zee = nlapiGetUser();
} else if (role == 3) { //Administrator
  zee = 6; //test
} else if (role == 1032) { // System Support
  zee = 425904; //test-AR
}

function downloadLetter(request, response) {
  if (request.getMethod() === "GET") {

    // var letter_type = request.getParameter('type');

    var form = nlapiCreateForm('Print Letters');

    // var letter_type = request.getParameter('type');

    var inlinehTML = '';

    var inlinehtml2 =
      '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2392606&c=1048144&h=a4ffdb532b0447664a84&_xt=.css"/><script type="text/javascript"  src="https://cdn.datatables.net/v/dt/dt-1.10.18/datatables.min.js"></script><script src="https://cdn.datatables.net/fixedheader/3.1.2/js/dataTables.fixedHeader.min.js" type="text/javascript"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedheader/3.1.2/css/fixedHeader.dataTables.min.css"><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://1048144.app.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><link href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.9/summernote.css" rel="stylesheet"><script src="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.9/summernote.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.5/jspdf.debug.js" integrity="sha384-CchuzHs077vGtfhGYl9Qtc7Vx64rXBXdIAZIPbItbNyWIRTdG0oYAqki3Ry13Yzu" crossorigin="anonymous"></script><style>.mandatory{color:red;}ol {margin: 0 0 1.5em;padding: 0;counter-reset: item;}ol > li {margin: 0;padding: 0 0 0 2em;text-indent: -2em;list-style-type: none;counter-increment: item;}ol > li:before {display: inline-block;width: 1em;padding-right: 0.5em;font-weight: bold;text-align: right;content: counter(item) ".";}</style>';

    inlinehtml2 +=
      '<br><br><table border="0" cellpadding="15" id="customer" class="display tablesorter table table-striped table-bordered table-responsive" cellspacing="0"><thead style="color: white;background-color: #607799;"><tr><th class="text-center">ID</th><th class="text-center">Customer</th><th>URL</th></tr></thead>';

    // var mpexPriceSearch = nlapiLoadSearch('customer', 'customsearch_mpex_price_point_customer_3');
    var mpexPriceSearch = nlapiLoadSearch('customer',
      'customsearch_mpex_price_point_custome_11');

    // var addFilterExpression = new nlobjSearchFilter('custentity_mpex_price_letter_types', null, 'anyof', parseInt(letter_type));
    // mpexPriceSearch.addFilter(addFilterExpression);

    var resultSetCustomer = mpexPriceSearch.runSearch();

    var slice_index = 0;

    // do {
    var resultCustomerSlice = resultSetCustomer.getResults(0, (slice_index + 1) *
      65);
    nlapiLogExecution('DEBUG', 'resultCustomerSlice length',
      resultCustomerSlice.length)


    resultCustomerSlice.forEach(function(searchResult) {

      var custid = searchResult.getValue("internalid");
      var entityid = searchResult.getValue("entityid");
      var zee_id = searchResult.getValue("partner");
      var companyname = searchResult.getValue("companyname");
      var letter = searchResult.getValue('custentity_mpex_price_letter');
      var fileRecord2 = nlapiLoadFile(letter);
      var url2 = fileRecord2.getURL();

      inlinehtml2 +=
        '<tr><input type="hidden" class="form-control customer_id text-center" value="' +
        custid + '"><th>' + entityid + '</th><th>' + companyname +
        '</th><th><a class="letter_download" href="' + url2 +
        '" download>DOWNLOAD</a></th></tr>'

      return true;
    });
    //     slice_index += 1;
    // } while (resultCustomerSlice.length == 400)



    /**
     * Description - Get the list of Customer that have Trial or Signed Status for a particular zee
     */


    // inlineQty += '</tbody>';
    inlinehtml2 += '</table><br/>';
    // form.addField('custpage_letter_type', 'textarea', 'BODY').setDisplayType('hidden').setDefaultValue(letter_type);
    form.setScript('customscript_cl_download_letters');

    form.addField('preview_table', 'inlinehtml', '').setLayoutType(
      'outsidebelow', 'startrow').setDefaultValue(inlinehtml2);
    form.addSubmitButton('Print Letters');

    response.writePage(form);
  } else {

  }
}
