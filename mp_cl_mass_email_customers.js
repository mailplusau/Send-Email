/**
 * Module Description
 * 
 * NSVersion    Date                        Author         
 * 1.00         2020-07-20 11:18:33         Ankith
 *
 * Description:         
 * 
 * @Last Modified by:   Ankith
 * @Last Modified time: 2020-07-22 09:30:18
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

    var letter_type = nlapiGetFieldValue('custpage_letter_type');

    if (!isNullorEmpty(letter_type)) {
        $('.template_section').removeClass('hide');
        $('.row_subject').removeClass('hide');
        $('.row_body').removeClass('hide');

        var mpexPriceSearch = nlapiLoadSearch('customer', 'customsearch_mpex_price_point_customer_2');

        var addFilterExpression = new nlobjSearchFilter('custentity_mpex_price_letter_types', null, 'is', parseInt(letter_type));
        mpexPriceSearch.addFilter(addFilterExpression);

        var resultSetCustomer = mpexPriceSearch.runSearch();


        var count = 0;
        var customer_count = 0;



        var dataSet = '{"data":[';

        resultSetCustomer.forEachResult(function(searchResult) {

            var custid = searchResult.getValue("internalid");
            var entityid = searchResult.getValue("entityid");
            var zee_id = searchResult.getValue("partner");
            var companyname = searchResult.getValue("companyname");
            var mpex_1kg = searchResult.getValue("custentity_mpex_1kg_price_point");
            var mpex_3kg = searchResult.getValue("custentity_mpex_3kg_price_point");
            var mpex_5kg = searchResult.getValue("custentity_mpex_5kg_price_point");
            var mpex_500g = searchResult.getValue("custentity_mpex_500g_price_point");
            var mpex_b4 = searchResult.getValue("custentity_mpex_b4_price_point");
            var mpex_c5 = searchResult.getValue("custentity_mpex_c5_price_point");
            var mpex_dl = searchResult.getValue("custentity_mpex_dl_price_point");

            if (isNullorEmpty(mpex_1kg)) {
                mpex_1kg = '0';
            }
            if (isNullorEmpty(mpex_3kg)) {
                mpex_3kg = '0';
            }
            if (isNullorEmpty(mpex_5kg)) {
                mpex_5kg = '0';
            }
            if (isNullorEmpty(mpex_500g)) {
                mpex_500g = '0';
            }
            if (isNullorEmpty(mpex_b4)) {
                mpex_b4 = '0';
            }
            if (isNullorEmpty(mpex_c5)) {
                mpex_c5 = '0';
            }
            if (isNullorEmpty(mpex_dl)) {
                mpex_dl = '0';
            }

            console.log(mpex_1kg)

            dataSet += '{"cust_id":"' + custid + '", "entityid":"' + entityid + '", "companyname_text":"' + companyname + '", "company_name":"' + companyname + '","mpex_1kg": "' + mpex_1kg + '","mpex_3kg": "' + mpex_3kg + '","mpex_5kg": "' + mpex_5kg + '","mpex_500g": "' + mpex_500g + '","mpex_b4": "' + mpex_b4 + '","mpex_c5": "' + mpex_c5 + '","mpex_dl": "' + mpex_dl + '"},';

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
                }, {
                    "data": null,
                    "render": function(data, type, row) {
                        var column_data = '<input type="hidden" class="form-control old_5kg text-center" value="' + data.mpex_5kg + '"><select class="form-control 5kg text-center" readonly>';
                        if (data.mpex_5kg == 1) {

                            column_data += '<option value="0"></option><option value="1" selected>Gold</option><option value="2">Platinum</option>h<option value="4">Standard</option>'
                        } else if (data.mpex_5kg == 2) {

                            column_data += '<option value="0"></option><option value="1">Gold</option><option value="2" selected>Platinum</option><option value="4">Standard</option>'
                        } else if (data.mpex_5kg == 4) {

                            column_data += '<option value="0"></option><option value="1">Gold</option><option value="2">Platinum</option><option value="4" selected>Standard</option>'
                        } else {

                            column_data += '<option value="0"></option><option value="1"selected>Gold</option><option value="2">Platinum</option><option value="4">Standard</option>'
                        }

                        column_data += '</select>';
                        return column_data;
                    },

                }, {
                    "data": null,
                    "render": function(data, type, row) {
                        var column_data = '<input type="hidden" class="form-control old_3kg text-center" value="' + data.mpex_3kg + '"><select class="form-control 3kg text-center" readonly>';
                        if (data.mpex_3kg == "1") {
                            column_data += '<option value="0"></option><option value="1" selected>Gold</option><option value="2">Platinum</option><option value="4">Standard</option>'
                        } else if (data.mpex_3kg == "2") {
                            column_data += '<option value="0"></option><option value="1">Gold</option><option value="2" selected>Platinum</option><option value="4">Standard</option>'
                        } else if (data.mpex_3kg == "4") {
                            column_data += '<option value="0"></option><option value="1">Gold</option><option value="2">Platinum</option><option value="4" selected>Standard</option>'
                        } else {
                            column_data += '<option value="0"></option><option value="1" selected>Gold</option><option value="2">Platinum</option><option value="4">Standard</option>'
                        }

                        column_data += '</select>';
                        return column_data;

                    }
                }, {
                    "data": null,
                    "render": function(data, type, row) {
                        var column_data = '<input type="hidden" class="form-control old_1kg text-center" value="' + data.mpex_1kg + '"><select class="form-control 1kg text-center" readonly>';
                        if (data.mpex_1kg == "1") {
                            column_data += '<option value="0"></option><option value="1" selected>Gold</option><option value="2">Platinum</option><option value="4">Standard</option>'
                        } else if (data.mpex_1kg == "2") {
                            column_data += '<option value="0"></option><option value="1">Gold</option><option value="2" selected>Platinum</option><option value="4">Standard</option>'
                        } else if (data.mpex_1kg == "4") {
                            column_data += '<option value="0"></option><option value="1">Gold</option><option value="2">Platinum</option><option value="4" selected>Standard</option>'
                        } else {
                            column_data += '<option value="0"></option><option value="1" selected>Gold</option><option value="2">Platinum</option><option value="4">Standard</option>'
                        }

                        column_data += '</select>';
                        return column_data;

                    }
                }, {
                    "data": null,
                    "render": function(data, type, row) {
                        var column_data = '<input type="hidden" class="form-control old_500g text-center" value="' + data.mpex_500g + '"><select class="form-control 500g text-center" readonly>';
                        if (data.mpex_500g == "1") {
                            column_data += '<option value="0"></option><option value="1" selected>Gold</option><option value="2">Platinum</option><option value="4">Standard</option>'
                        } else if (data.mpex_500g == "2") {
                            column_data += '<option value="0"></option><option value="1">Gold</option><option value="2" selected>Platinum</option><option value="4">Standard</option>'
                        } else if (data.mpex_500g == "4") {
                            column_data += '<option value="0"></option><option value="1">Gold</option><option value="2">Platinum</option><option value="4" selected>Standard</option>'
                        } else {
                            column_data += '<option value="0"></option><option value="1" selected>Gold</option><option value="2">Platinum</option><option value="4">Standard</option>'
                        }

                        column_data += '</select>';
                        return column_data;

                    }
                }, {
                    "data": null,
                    "render": function(data, type, row) {
                        var column_data = '<input type="hidden" class="form-control old_b4 text-center" value="' + data.mpex_b4 + '"><select class="form-control b4 text-center" readonly>';
                        if (data.mpex_b4 == "1") {
                            column_data += '<option value="0"></option><option value="1" selected>Gold</option><option value="2">Platinum</option><option value="4">Standard</option>'
                        } else if (data.mpex_b4 == "2") {
                            column_data += '<option value="0"></option><option value="1">Gold</option><option value="2" selected>Platinum</option><option value="4">Standard</option>'
                        } else if (data.mpex_b4 == "4") {
                            column_data += '<option value="0"></option><option value="1">Gold</option><option value="2">Platinum</option><option value="4" selected>Standard</option>'
                        } else {
                            column_data += '<option value="0"></option><option value="1" selected>Gold</option><option value="2">Platinum</option><option value="4">Standard</option>'
                        }

                        column_data += '</select>';
                        return column_data;

                    }
                }, {
                    "data": null,
                    "render": function(data, type, row) {
                        var column_data = '<input type="hidden" class="form-control old_c5 text-center" value="' + data.mpex_c5 + '"><select class="form-control c5 text-center" readonly>';
                        if (data.mpex_c5 == "1") {
                            column_data += '<option value="0"></option><option value="1" selected>Gold</option><option value="2">Platinum</option><option value="4">Standard</option>'
                        } else if (data.mpex_c5 == "2") {
                            column_data += '<option value="0"></option><option value="1">Gold</option><option value="2" selected>Platinum</option><option value="4">Standard</option>'
                        } else if (data.mpex_c5 == "4") {
                            column_data += '<option value="0"></option><option value="1">Gold</option><option value="2">Platinum</option><option value="4" selected>Standard</option>'
                        } else {
                            column_data += '<option value="0"></option><option value="1" selected>Gold</option><option value="2">Platinum</option><option value="4">Standard</option>'
                        }

                        column_data += '</select>';
                        return column_data;

                    }
                }, {
                    "data": null,
                    "render": function(data, type, row) {
                        var column_data = '<input type="hidden" class="form-control old_dl text-center" value="' + data.mpex_dl + '"><select class="form-control dl text-center" readonly>';
                        if (data.mpex_dl == "1") {
                            column_data += '<option value="0"></option><option value="1" selected>Gold</option><option value="2">Platinum</option><option value="4">Standard</option>'
                        } else if (data.mpex_dl == "2") {
                            column_data += '<option value="0"></option><option value="1">Gold</option><option value="2" selected>Platinum</option><option value="4">Standard</option>'
                        } else if (data.mpex_dl == "4") {
                            column_data += '<option value="0"></option><option value="1">Gold</option><option value="2">Platinum</option><option value="4" selected>Standard</option>'
                        } else {
                            column_data += '<option value="0"></option><option value="1" selected>Gold</option><option value="2">Platinum</option><option value="4">Standard</option>'
                        }

                        column_data += '</select>';
                        return column_data;

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
                "createdRow": function(row, data, index) {
                    console.log(data.mpex_5kg);
                    console.log(index);
                    if (data.mpex_5kg == 1) {
                        $('td', row).eq(2).css('background-color', '#ecc60b');

                    } else if (data.mpex_5kg == 2) {
                        $('td', row).eq(2).css('background-color', '#a7a6a1');

                    } else if (data.mpex_5kg == 4) {
                        $('td', row).eq(2).css('background-color', '#7abcf5');

                    } else {
                        $('td', row).eq(2).removeAttr("style");
                    }
                    if (data.mpex_3kg == 1) {
                        $('td', row).eq(3).css('background-color', '#ecc60b');

                    } else if (data.mpex_3kg == 2) {
                        $('td', row).eq(3).css('background-color', '#a7a6a1');

                    } else if (data.mpex_3kg == 4) {
                        $('td', row).eq(3).css('background-color', '#7abcf5');

                    } else {
                        $('td', row).eq(3).removeAttr("style");
                    }
                    if (data.mpex_1kg == 1) {
                        $('td', row).eq(4).css('background-color', '#ecc60b');

                    } else if (data.mpex_1kg == 2) {
                        $('td', row).eq(4).css('background-color', '#a7a6a1');

                    } else if (data.mpex_1kg == 4) {
                        $('td', row).eq(4).css('background-color', '#7abcf5');

                    } else {
                        $('td', row).eq(4).removeAttr("style");
                    }
                    if (data.mpex_500g == 1) {
                        $('td', row).eq(5).css('background-color', '#ecc60b');

                    } else if (data.mpex_500g == 2) {
                        $('td', row).eq(5).css('background-color', '#a7a6a1');

                    } else if (data.mpex_500g == 4) {
                        $('td', row).eq(5).css('background-color', '#7abcf5');

                    } else {
                        $('td', row).eq(5).removeAttr("style");
                    }
                    if (data.mpex_b4 == 1) {
                        $('td', row).eq(6).css('background-color', '#ecc60b');

                    } else if (data.mpex_b4 == 2) {
                        $('td', row).eq(6).css('background-color', '#a7a6a1');

                    } else if (data.mpex_b4 == 4) {
                        $('td', row).eq(6).css('background-color', '#7abcf5');

                    } else {
                        $('td', row).eq(6).removeAttr("style");
                    }
                    if (data.mpex_c5 == 1) {
                        $('td', row).eq(7).css('background-color', '#ecc60b');

                    } else if (data.mpex_c5 == 2) {
                        $('td', row).eq(7).css('background-color', '#a7a6a1');

                    } else if (data.mpex_c5 == 4) {
                        $('td', row).eq(7).css('background-color', '#7abcf5');
                    } else {
                        $('td', row).eq(7).removeAttr("style");
                    }
                    if (data.mpex_dl == 1) {
                        $('td', row).eq(8).css('background-color', '#ecc60b');

                    } else if (data.mpex_dl == 2) {
                        $('td', row).eq(8).css('background-color', '#a7a6a1');

                    } else if (data.mpex_dl == 4) {
                        $('td', row).eq(8).css('background-color', '#7abcf5');

                    } else {
                        $('td', row).eq(8).removeAttr("style");
                    }
                }
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