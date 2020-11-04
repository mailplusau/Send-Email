/**
 * Module Description
 * 
 * NSVersion    Date                        Author         
 * 1.00         2020-07-20 11:18:33         Ankith
 *
 * Description:         
 * 
 * @Last Modified by:   Ankith Ravindran
 * @Last Modified time: 2020-11-04 12:36:14
 *
 */

var baseURL = 'https://1048144.app.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
    baseURL = 'https://system.sandbox.netsuite.com';
}
$(window).load(function() {
    // Animate loader off screen
    $(".se-pre-con").fadeOut("slow");
});
$(document).on('click', '#alert .close', function(e) {
    $(this).parent().hide();
});

function showAlert(message) {
    $('#alert').html('<button type="button" class="close">&times;</button>' + message);
    $('#alert').show();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    // $(window).scrollTop($('#alert').offset().top);
}

$(document).on('click', '#alert .close', function(e) {
    $(this).parent().hide();
});

function pageInit() {
    $('#alert').hide();
    $(document).ready(function() {
        $('#email_body').summernote({
            dialogsInBody: true
        });
    });

    var zee = nlapiGetFieldValue('zee');

    if (!isNullorEmpty(zee) && zee != 0) {

        $('.template_section').removeClass('hide');
        $('.row_subject').removeClass('hide');
        $('.row_body').removeClass('hide');

        var customerSearch = nlapiLoadSearch('customer', 'customsearch_mass_email_customer_list');

        var addFilterExpression = new nlobjSearchFilter('partner', null, 'anyof', zee);
        customerSearch.addFilter(addFilterExpression);
        var resultSetCustomer = customerSearch.runSearch();


        var count = 0;
        var customer_count = 0;



        var dataSet = '{"data":[';

        resultSetCustomer.forEachResult(function(searchResult) {

            var custid = searchResult.getValue('internalid');
            var entityid = searchResult.getValue('entityid');
            var companyname = searchResult.getValue('companyname');

            dataSet += '{"cust_id":"' + custid + '", "entityid":"' + entityid + '", "companyname_text":"' + companyname + '", "company_name":"' + companyname + '"},';

            count++;
            return true;
        });



        if (count > 0) {
            dataSet = dataSet.substring(0, dataSet.length - "1");
            console.log(dataSet);
            dataSet += ']}';
        } else {

            dataSet += ']}';
        }

        console.log(dataSet);
        var parsedData = JSON.parse(dataSet);
        console.log(parsedData.data);

        // AddStyle('https://1048144.app.netsuite.com/core/media/media.nl?id=1988776&c=1048144&h=58352d0b4544df20b40f&_xt=.css', 'head');

        //JQuery to sort table based on click of header. Attached library  
        $(document).ready(function() {
            table = $("#customer").DataTable({
                "data": parsedData.data,
                "columns": [{
                    "data": null,
                    "render": function(data, type, row) {
                        return '<p><b>' + data.entityid + '</b><p>';
                    }
                }, {
                    "data": null,
                    "render": function(data, type, row) {
                        return '<p><b>' + data.companyname_text + '</b><p><input type="hidden" class="form-control customer_id text-center" value="' + data.cust_id + '">';
                    }
                }],
                "order": [
                    [1, 'asc']
                ],
                "pageLength": 50,
                "scrollY": "1000px",
                "fixedHeader": {
                    "header": true
                },
            });
        });
        $("#customer_length").css({
            "float": "right !important"
        });

        $("#customer_filter").css({
            "float": "left !important"
        });
        // document.getElementById('tdbody_update_record').style = 'background-color: #125ab2 !important;color: white;';

        AddStyle('https://1048144.app.netsuite.com/core/media/media.nl?id=1988776&c=1048144&h=58352d0b4544df20b40f&_xt=.css', 'head');
        // $('#attachments').selectator({
        //  keepOpen: true,
        //  showAllOptionsOnFocus: true,
        //  selectFirstOptionOnSearch: false
        // });

    }

}

//On selecting zee, reload the SMC - Summary page with selected Zee parameter
$(document).on("change", ".zee_dropdown", function(e) {

    var zee = $(this).val();

    var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1076&deploy=1&sorts[customername]=1";

    url += "&zee=" + zee + "";

    window.location.href = url;
});

$(document).on('change', '#template', function(e) {

    var recCommTemp = nlapiLoadRecord('customrecord_camp_comm_template', $('option:selected', this).val());
    var templateId = recCommTemp.getFieldValue('custrecord_camp_comm_email_template');
    var subject = recCommTemp.getFieldValue('custrecord_camp_comm_subject');
    var first_name = $('#send_to option:selected').data("firstname");

    var userID = nlapiGetContext().getUser();

    var employeeRec

    console.log(first_name);
    console.log(userID);
    console.log($('#send_to').val());



    var url = 'https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=395&deploy=1&compid=1048144&h=6d4293eecb3cb3f4353e&rectype=customer&template=';


    url += $('#template option:selected').val() + '&recid=' + null + '&salesrep=' + null + '&dear=' + null + '&contactid=' + null + '&userid=' + escape(userID);

    urlCall = nlapiRequestURL(url);
    var emailHtml = urlCall.getBody();
    var emailSubject = urlCall.getHeader('Custom-Header-SubjectLine');

    console.log(urlCall);
    console.log(subject);
    console.log(emailSubject);

    $('#email_body').summernote('code', emailHtml);
    $('#subject').val(subject);

});

$(document).on("change", "#letter_type", function(e) {

    var letter_type = $(this).val();

    var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1001&deploy=1";

    url += "&type=" + letter_type + "";

    window.location.href = url;
});

function saveRecord() {
    var template = $('#template').val();
    var subject = $('#subject').val();
    var body = $('#email_body').summernote('code');

    var resultSetLength = $('#customer').DataTable().rows().data().length;
    nlapiSetFieldValue('custpage_result_set_length', resultSetLength)

    var templateRecord = nlapiLoadRecord('customrecord_camp_comm_template', template);
    var email_template_id = templateRecord.getFieldValue('custrecord_camp_comm_email_template');
    var pdf_template_id = templateRecord.getFieldValue('custrecord_pdf_template_id');


    nlapiSetFieldValue('custpage_template', email_template_id);
    nlapiSetFieldValue('custpage_subject', subject);
    nlapiSetFieldValue('custpage_body', body);
    nlapiSetFieldValue('custpage_pdf', pdf_template_id);

    return true;
}

function onclick_print() {
    var template = $('#template').val();
    var templateRecord = nlapiLoadRecord('customrecord_camp_comm_template', template);
    var pdf_template_id = templateRecord.getFieldValue('custrecord_pdf_template_id');

    var mpexPricingCustomerList = nlapiLoadSearch('customer', 'customsearch_mpex_price_point_customer');

    var resultSetMpexPricing = mpexPricingCustomerList.runSearch();

    var all_pages = [];

    resultSetMpexPricing.forEachResult(function(searchResult) {

        var custId = searchResult.getValue('internalid');
        var companyname = searchResult.getValue('companyname');
        var account_email = searchResult.getValue('email');
        var service_email = searchResult.getValue('custentity_email_service');
        var tempName = searchResult.getValue('name');

        var recCustomer = nlapiLoadRecord('customer', custId);
        var postaladdress = '';

        var siteaddressfull = '';
        var billaddressfull = '';

        for (p = 1; p <= recCustomer.getLineItemCount('addressbook'); p++) {
            if (isNullorEmpty(postaladdress) && recCustomer.getLineItemValue('addressbook', 'isresidential', p) == "T") {
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addressee', p))) {
                    postaladdress += recCustomer.getLineItemValue('addressbook', 'addressee', p) + '\n';
                }

                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr1', p))) {
                    postaladdress += recCustomer.getLineItemValue('addressbook', 'addr1', p) + '\n';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr2', p))) {
                    postaladdress += recCustomer.getLineItemValue('addressbook', 'addr2', p) + '\n';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'city', p))) {
                    postaladdress += recCustomer.getLineItemValue('addressbook', 'city', p) + ' ';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'state', p))) {
                    postaladdress += recCustomer.getLineItemValue('addressbook', 'state', p) + ' ';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'zip', p))) {
                    postaladdress += recCustomer.getLineItemValue('addressbook', 'zip', p);
                }
            }
            if (recCustomer.getLineItemValue('addressbook', 'defaultshipping', p) == "T") {

                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addressee', p))) {
                    siteaddressfull += recCustomer.getLineItemValue('addressbook', 'addressee', p) + '\n';
                }

                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr1', p))) {
                    siteaddressfull += recCustomer.getLineItemValue('addressbook', 'addr1', p) + '\n';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr2', p))) {
                    siteaddressfull += recCustomer.getLineItemValue('addressbook', 'addr2', p) + '\n';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'city', p))) {
                    siteaddressfull += recCustomer.getLineItemValue('addressbook', 'city', p) + ' ';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'state', p))) {
                    siteaddressfull += recCustomer.getLineItemValue('addressbook', 'state', p) + ' ';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'zip', p))) {
                    siteaddressfull += recCustomer.getLineItemValue('addressbook', 'zip', p);
                }
            }
            if (isNullorEmpty(billaddressfull) && recCustomer.getLineItemValue('addressbook', 'defaultbilling', p) == "T") {

                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addressee', p))) {
                    billaddressfull += recCustomer.getLineItemValue('addressbook', 'addressee', p) + '\n';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr1', p))) {
                    billaddressfull += recCustomer.getLineItemValue('addressbook', 'addr1', p) + '\n';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr2', p))) {
                    billaddressfull += recCustomer.getLineItemValue('addressbook', 'addr2', p) + '\n';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'city', p))) {
                    billaddressfull += recCustomer.getLineItemValue('addressbook', 'city', p) + ' ';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'state', p))) {
                    billaddressfull += recCustomer.getLineItemValue('addressbook', 'state', p) + ' ';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'zip', p))) {
                    billaddressfull += recCustomer.getLineItemValue('addressbook', 'zip', p);
                }
            }
        }

        var merge = new Array();
        merge['NLSCBILLADDRESS'] = billaddressfull;
        merge['NLSCDATE'] = getDate();

        var fileSCFORM = nlapiMergeRecord(pdf_template_id, 'customer', custId, null, null, merge);
        fileSCFORM.setName('MPEX_Pricing_' + custId + '.pdf');

        fileSCFORM.setFolder(2414361);

        var id = nlapiSubmitFile(fileSCFORM);

        all_pages[all_pages.length] = id;

        return true;
    });

    if (!isNullorEmpty(all_pages)) {

        var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
        xml += "<pdfset>\n";
        xml += "<pdf>\n<body font-size=\"12\">\n<h3></h3>\n";
        xml += "<p></p>";
        xml += "</body>\n</pdf>";

        for (var z = 0; z < all_pages.length; z++) {

            var fileRecord = nlapiLoadFile(all_pages[z]);
            var url = fileRecord.getURL();
            url = url.replace(/&/g, '&amp;');

            xml += "<pdf src='https://1048144.app.netsuite.com" + url + "' />";
        }

        xml += "</pdfset>";

        var file = nlapiXMLToPDF(xml);

        file.setName('MPEX_ProductUsageReport_all_' + getDate() + '_' + old_customer_id + '.pdf');
        file.setFolder(2414361);
        all_pages_id = nlapiSubmitFile(file);

        var fileRecord2 = nlapiLoadFile(all_pages_id);
        var url2 = fileRecord2.getURL();

        var a = document.createElement("a");
        a.href = url2;
        fileName = url2.split("/").pop();
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
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

function AddStyle(cssLink, pos) {
    var tag = document.getElementsByTagName(pos)[0];
    var addLink = document.createElement('link');
    addLink.setAttribute('type', 'text/css');
    addLink.setAttribute('rel', 'stylesheet');
    addLink.setAttribute('href', cssLink);
    tag.appendChild(addLink);
}