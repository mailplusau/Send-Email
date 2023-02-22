/**
 * Module Description
 *
 * NSVersion    Date                        Author
 * 1.00         2020-07-20 11:18:33         Ankith
 *
 * Description:
 *
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-06-14T13:24:20+10:00
 *
 */

var baseURL = 'https://1048144.app.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
    baseURL = 'https://system.sandbox.netsuite.com';
}
$(window).load(function () {
    // Animate loader off screen
    $(".se-pre-con").fadeOut("slow");
});
$(document).on('click', '#alert .close', function (e) {
    $(this).parent().hide();
});

function showAlert(message) {
    $('#alert').html('<button type="button" class="close">&times;</button>' +
        message);
    $('#alert').show();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    // $(window).scrollTop($('#alert').offset().top);
}

$(document).on('click', '#alert .close', function (e) {
    $(this).parent().hide();
});

var debtDataSet = [];

function pageInit() {
    $('#alert').hide();
    $(document).ready(function () {
        $('#email_body').summernote({
            dialogsInBody: true
        });
    });

    var zee = nlapiGetFieldValue('zee');
    var email_count = nlapiGetFieldValue('email_count');


    $('.template_section').removeClass('hide');
    $('.row_subject').removeClass('hide');
    $('.row_body').removeClass('hide');

    $(document).ready(function () {

        dataTable = $('#mpexusage-customers').DataTable({
            destroy: true,
            data: debtDataSet,
            pageLength: 1000,
            columns: [{
                title: 'Customer Internal ID'
            }, {
                title: 'ID'
            }, {
                title: 'Company Name'
            }, {
                title: 'Franchisee'
            }, {
                title: 'Email Count'
            }, {
                title: 'Date - Last Email Sent'
            }],
            columnDefs: [{
                targets: [],
                className: 'bolded'
            }],
            rowCallback: function (row, data, index) {

            }
        });

        // Search Name: Customer List - Excess Weight Charges Email
        var customerSearch = nlapiLoadSearch('customer',
            'customsearch_cust_list_excess_weight_ema');

        if (!isNullorEmpty(zee) && zee != 0) {
            var addFilterExpression = new nlobjSearchFilter('partner', null, 'anyof',
                zee);
            customerSearch.addFilter(addFilterExpression);

        }

        if (!isNullorEmpty(email_count) && zee != email_count) {
            var addFilterExpression = new nlobjSearchFilter('custentity_count_weight_charges_email', null, 'is',
                zee);
            customerSearch.addFilter(addFilterExpression);
        }

        var resultSetCustomer = customerSearch.runSearch();
        var count = 0;
        var customer_count = 0;

        // var dataSet = '{"data":[';
        var debt_set2 = [];

        resultSetCustomer.forEachResult(function (searchResult) {

            var custid = searchResult.getValue('internalid');
            var entityid = searchResult.getValue('entityid');
            var companyname = searchResult.getValue('companyname');
            var partner = searchResult.getText('partner');

            var emailCount = searchResult.getValue('custentity_count_weight_charges_email');
            var dateSent = searchResult.getValue('custentity_weight_charges_email_datesent');

            if (isNullorEmpty(dateSent) || dateSent == 'undefined') {
                dateSent = ' ';
            }

            dataSet += '{"cust_id":"' + custid + '", "entityid":"' + entityid +
                '", "companyname_text":"' + companyname + '", "partner":"' +
                partner + '", "count":"' +
                emailCount + '"},';

            debt_set2.push({
                custid: custid,
                entityid: entityid,
                companyname: companyname,
                partner: partner,
                emailCount: emailCount,
                dateSent: dateSent
            });

            count++;
            return true;
        });

        if (!isNullorEmpty(debt_set2)) {
            debt_set2.forEach(function (debt_row2, index) {


                var customerIDLink =
                    '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
                    debt_row2.custid + '&whence=" target="_blank"><b>' +
                    debt_row2.entityid + '</b></a>';


                if (!isNullorEmpty(debt_row2.dateSent)) {
                    var commDateSplit = debt_row2.dateSent.split('/');

                    var commDate = new Date(commDateSplit[2], commDateSplit[1] - 1,
                        commDateSplit[0]);
                } else {
                    var commDate = '';
                }



                debtDataSet.push([debt_row2.custid, customerIDLink, debt_row2.companyname, debt_row2.partner, debt_row2.emailCount, commDate]);
            });
        }

        var datatable2 = $('#mpexusage-customers').DataTable();
        datatable2.clear();
        datatable2.rows.add(debtDataSet);
        datatable2.draw();



        // if (count > 0) {
        //     dataSet = dataSet.substring(0, dataSet.length - "1");
        //     console.log(dataSet);
        //     dataSet += ']}';
        // } else {

        //     dataSet += ']}';
        // }

        // console.log(dataSet);
        // var parsedData = JSON.parse(dataSet);
        // console.log(parsedData.data);

        // AddStyle('https://1048144.app.netsuite.com/core/media/media.nl?id=1988776&c=1048144&h=58352d0b4544df20b40f&_xt=.css', 'head');

        //JQuery to sort table based on click of header. Attached library

        // table = $("#customer").DataTable({
        //     "data": parsedData.data,
        //     "columns": [{
        //         "data": null,
        //         "render": function (data, type, row) {
        //             return '<p><b>' + data.entityid + '</b></p>';
        //         }
        //     }, {
        //         "data": null,
        //         "render": function (data, type, row) {
        //             return '<p><b>' + data.companyname_text +
        //                 '</b></p><input type="hidden" class="form-control customer_id text-center" value="' +
        //                 data.cust_id + '">';
        //         }
        //     }, {
        //         "data": null,
        //         "render": function (data, type, row) {
        //             return '<p><b>' + data.partner +
        //                 '</b></p>';
        //         }
        //     }, {
        //         "data": null,
        //         "render": function (data, type, row) {
        //             return '<p><b>' + data.count +
        //                 '</b></p>';
        //         }
        //     }],
        //     "order": [
        //         [1, 'asc']
        //     ],
        //     "pageLength": 50,
        //     "scrollY": "1000px",
        //     "fixedHeader": {
        //         "header": true
        //     },
        // });


    });
    $("#customer_length").css({
        "float": "right !important"
    });

    $("#customer_filter").css({
        "float": "left !important"
    });
    // document.getElementById('tdbody_update_record').style = 'background-color: #125ab2 !important;color: white;';

    AddStyle(
        'https://1048144.app.netsuite.com/core/media/media.nl?id=1988776&c=1048144&h=58352d0b4544df20b40f&_xt=.css',
        'head');
    // $('#attachments').selectator({
    //  keepOpen: true,
    //  showAllOptionsOnFocus: true,
    //  selectFirstOptionOnSearch: false
    // });

    // var recCommTemp = nlapiLoadRecord('customrecord_camp_comm_template', $('#template option:selected').val());
    // var templateId = recCommTemp.getFieldValue(
    //     'custrecord_camp_comm_email_template');
    // var subject = recCommTemp.getFieldValue('custrecord_camp_comm_subject');
    // var first_name = $('#send_to option:selected').data("firstname");

    // var userID = nlapiGetContext().getUser();

    // var employeeRec

    // console.log(first_name);
    // console.log(userID);
    // console.log($('#template option:selected').val());



    // var url =
    //     'https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=395&deploy=1&compid=1048144&h=6d4293eecb3cb3f4353e&rectype=customer&template=';


    // url += $('#template option:selected').val() + '&recid=' + null +
    //     '&salesrep=' + null + '&dear=' + null + '&contactid=' + null +
    //     '&userid=' + escape(userID);

    // urlCall = nlapiRequestURL(url);
    // var emailHtml = urlCall.getBody();
    // var emailSubject = 'MailPlus: Under declaring items'

    // console.log(urlCall);
    // console.log(subject);
    // console.log(emailSubject);

    // $('#email_body').summernote('code', emailHtml);
    // $('#subject').val(subject);

}

//On selecting zee, reload the SMC - Summary page with selected Zee parameter
$(document).on("change", ".zee_dropdown", function (e) {

    var zee = $(this).val();

    var url = baseURL +
        "/app/site/hosting/scriptlet.nl?script=1692&deploy=1&sorts[customername]=1";

    url += "&zee=" + zee + "";

    window.location.href = url;
});

//On selecting zee, reload the SMC - Summary page with selected Zee parameter
$(document).on("change", ".email_count", function (e) {

    var email_count = $(this).val();

    var url = baseURL +
        "/app/site/hosting/scriptlet.nl?script=1692&deploy=1&sorts[customername]=1";

    url += "&email_count=" + email_count + "";

    window.location.href = url;
});

$(document).on('change', '#template', function (e) {

    var recCommTemp = nlapiLoadRecord('customrecord_camp_comm_template', $(
        'option:selected', this).val());
    var templateId = recCommTemp.getFieldValue(
        'custrecord_camp_comm_email_template');
    var subject = recCommTemp.getFieldValue('custrecord_camp_comm_subject');
    var first_name = $('#send_to option:selected').data("firstname");

    var userID = nlapiGetContext().getUser();

    var employeeRec

    console.log(first_name);
    console.log(userID);
    console.log($('#send_to').val());



    var url =
        'https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=395&deploy=1&compid=1048144&h=6d4293eecb3cb3f4353e&rectype=customer&template=';


    url += $('#template option:selected').val() + '&recid=null&salesrep=' + null + '&dear=' + null + '&contactid=' + null +
        '&userid=' + escape(userID);

    urlCall = nlapiRequestURL(url);
    var emailHtml = urlCall.getBody();
    var emailSubject = urlCall.getHeader('Custom-Header-SubjectLine');

    console.log(urlCall);
    console.log(subject);
    console.log(emailSubject);

    $('#email_body').summernote('code', emailHtml);
    $('#subject').val(subject);

});

$(document).on("change", "#letter_type", function (e) {

    var letter_type = $(this).val();

    var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1001&deploy=1";

    url += "&type=" + letter_type + "";

    window.location.href = url;
});

function saveRecord() {
    var template = $('#template').val();
    var subject = $('#subject').val();
    var old_zee = $('.old_zee_dropdown').val();
    var body = $('#email_body').summernote('code');

    var resultSetLength = $('#customer').DataTable().rows().data().length;
    nlapiSetFieldValue('custpage_result_set_length', resultSetLength)

    var templateRecord = nlapiLoadRecord('customrecord_camp_comm_template',
        template);
    var email_template_id = templateRecord.getFieldValue(
        'custrecord_camp_comm_email_template');
    var pdf_template_id = templateRecord.getFieldValue(
        'custrecord_pdf_template_id');


    nlapiSetFieldValue('custpage_template', email_template_id);
    nlapiSetFieldValue('custpage_subject', subject);
    nlapiSetFieldValue('custpage_body', body);
    nlapiSetFieldValue('custpage_pdf', pdf_template_id);
    nlapiSetFieldValue('custpage_old_zee', old_zee);

    return true;
}

function onclick_print() {
    var template = $('#template').val();
    var templateRecord = nlapiLoadRecord('customrecord_camp_comm_template',
        template);
    var pdf_template_id = templateRecord.getFieldValue(
        'custrecord_pdf_template_id');

    var mpexPricingCustomerList = nlapiLoadSearch('customer',
        'customsearch_mpex_price_point_customer');

    var resultSetMpexPricing = mpexPricingCustomerList.runSearch();

    var all_pages = [];

    resultSetMpexPricing.forEachResult(function (searchResult) {

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
            if (isNullorEmpty(postaladdress) && recCustomer.getLineItemValue(
                'addressbook', 'isresidential', p) == "T") {
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
                    'addressee', p))) {
                    postaladdress += recCustomer.getLineItemValue('addressbook',
                        'addressee', p) + '\n';
                }

                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
                    'addr1', p))) {
                    postaladdress += recCustomer.getLineItemValue('addressbook',
                        'addr1', p) + '\n';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
                    'addr2', p))) {
                    postaladdress += recCustomer.getLineItemValue('addressbook',
                        'addr2', p) + '\n';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
                    'city', p))) {
                    postaladdress += recCustomer.getLineItemValue('addressbook',
                        'city', p) + ' ';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
                    'state', p))) {
                    postaladdress += recCustomer.getLineItemValue('addressbook',
                        'state', p) + ' ';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
                    'zip', p))) {
                    postaladdress += recCustomer.getLineItemValue('addressbook',
                        'zip', p);
                }
            }
            if (recCustomer.getLineItemValue('addressbook', 'defaultshipping', p) ==
                "T") {

                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
                    'addressee', p))) {
                    siteaddressfull += recCustomer.getLineItemValue('addressbook',
                        'addressee', p) + '\n';
                }

                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
                    'addr1', p))) {
                    siteaddressfull += recCustomer.getLineItemValue('addressbook',
                        'addr1', p) + '\n';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
                    'addr2', p))) {
                    siteaddressfull += recCustomer.getLineItemValue('addressbook',
                        'addr2', p) + '\n';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
                    'city', p))) {
                    siteaddressfull += recCustomer.getLineItemValue('addressbook',
                        'city', p) + ' ';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
                    'state', p))) {
                    siteaddressfull += recCustomer.getLineItemValue('addressbook',
                        'state', p) + ' ';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
                    'zip', p))) {
                    siteaddressfull += recCustomer.getLineItemValue('addressbook',
                        'zip', p);
                }
            }
            if (isNullorEmpty(billaddressfull) && recCustomer.getLineItemValue(
                'addressbook', 'defaultbilling', p) == "T") {

                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
                    'addressee', p))) {
                    billaddressfull += recCustomer.getLineItemValue('addressbook',
                        'addressee', p) + '\n';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
                    'addr1', p))) {
                    billaddressfull += recCustomer.getLineItemValue('addressbook',
                        'addr1', p) + '\n';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
                    'addr2', p))) {
                    billaddressfull += recCustomer.getLineItemValue('addressbook',
                        'addr2', p) + '\n';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
                    'city', p))) {
                    billaddressfull += recCustomer.getLineItemValue('addressbook',
                        'city', p) + ' ';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
                    'state', p))) {
                    billaddressfull += recCustomer.getLineItemValue('addressbook',
                        'state', p) + ' ';
                }
                if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook',
                    'zip', p))) {
                    billaddressfull += recCustomer.getLineItemValue('addressbook',
                        'zip', p);
                }
            }
        }

        var merge = new Array();
        merge['NLSCBILLADDRESS'] = billaddressfull;
        merge['NLSCDATE'] = getDate();

        var fileSCFORM = nlapiMergeRecord(pdf_template_id, 'customer', custId,
            null, null, merge);
        fileSCFORM.setName('MPEX_Pricing_' + custId + '.pdf');

        fileSCFORM.setFolder(2414361);

        var id = nlapiSubmitFile(fileSCFORM);

        all_pages[all_pages.length] = id;

        return true;
    });

    if (!isNullorEmpty(all_pages)) {

        var xml =
            "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
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

        file.setName('MPEX_ProductUsageReport_all_' + getDate() + '_' +
            old_customer_id + '.pdf');
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
