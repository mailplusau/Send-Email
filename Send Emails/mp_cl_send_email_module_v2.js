var baseURL = 'https://1048144.app.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
    baseURL = 'https://system.sandbox.netsuite.com';
}

var urlCall = null;
var salesRep = escape(nlapiGetContext().getName())
var role = nlapiGetRole();

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

$(window).load(function () {
    // Animate loader off screen
    $(".se-pre-con").fadeOut("slow");
});

$(".nav-pills").on("click", "a", function (e) {

    $(this).tab('show');
});

$(document).on('click', '#alert .close', function (e) {
    $(this).parent().hide();
});

function showAlert(message) {
    $('#alert').html('<button type="button" class="close">&times;</button>' + message);
    $('#alert').show();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    // $(window).scrollTop($('#alert').offset().top);
}

$(document).on('click', '#alert .close', function (e) {
    $(this).parent().hide();
});



function pageInit() {
    $('#alert').hide();
    $(document).ready(function () {
        $('#email_body').summernote({
            dialogsInBody: true
        });
    });

    var closed_won = nlapiGetFieldValue('custpage_closed_won');
    var free_trial = nlapiGetFieldValue('custpage_free_trial');
    var opp_with_value = nlapiGetFieldValue('custpage_opp_with_values');
    var invite_to_portal = nlapiGetFieldValue('custpage_invite');
    var unity = nlapiGetFieldValue('custpage_unity');
    var referral = nlapiGetFieldValue('custpage_referral');
    console.log(unity)

    if (closed_won == 'T') {
        $('#quote').prop('checked', false);
        $('#form').prop('checked', true);
        // $('#quote').prop('checked', false);
        $('.main_tabs').removeClass('hide');

        if ($('#no_email').is(':checked')) {

            $('.subject_section').addClass('hide');
            $('#dear').addClass('hide');
            $('.body_section').addClass('hide');
            $('.cc_section').addClass('hide');
            $('.template_section').addClass('hide');

            nlapiSetFieldValue('custpage_to', 0);
        } else {
            var customer_status = nlapiGetFieldValue('custpage_customer_status');

            console.log(customer_status)

            var searchedCampTemp = nlapiLoadSearch('customrecord_camp_comm_template', 'customsearch_salesp_campaign_templates');


            var newFiltersCampTemp = new Array();
            if (customer_status == '13') {
                newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 2);
            } else {
                newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 1);
            }

            // // newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
            // if ($('#quote').is(':checked')) {
            //  newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', [2, 5]);
            // } else {
            newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', 2);
            // }


            searchedCampTemp.addFilters(newFiltersCampTemp);

            var resultSetCampTemp = searchedCampTemp.runSearch();


            selectList = $("#template");

            resultSetCampTemp.forEachResult(function (searchResultCampTemp) {

                var tempId = searchResultCampTemp.getValue('internalid');
                var tempName = searchResultCampTemp.getValue('name');

                var option = new Option(tempName, tempId);
                selectList.append(option, null);

                return true;
            });

            var salesRecordId = parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            var salesRecord = nlapiLoadRecord('customrecord_sales', salesRecordId);
            var salesCampaign = salesRecord.getFieldValue('custrecord_sales_campaign');


            // //Search for Attachments
            // var searchedAtt = nlapiLoadSearch('customrecord_comm_attachment', 'customsearch_salesp_attachments');

            // var newFiltersAtt = new Array();
            // if (customer_status == '13') {
            //  newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_camptype', null, 'anyof', 2);
            // } else {
            //  newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_camptype', null, 'anyof', 1);
            // }

            // // newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
            // if ($('#quote').is(':checked')) {
            //  newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_commtype', null, 'anyof', [1, 2, 5]);
            // } else {
            //  newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_commtype', null, 'anyof', [1, 2]);
            // }


            // searchedAtt.addFilters(newFiltersAtt);

            // var resultSetAtt = searchedAtt.runSearch();

            // var newHtml = '<div class="row">';

            // resultSetAtt.forEachResult(function(searchResultAtt) {

            //  var attId = searchResultAtt.getValue('internalid');
            //  var attName = searchResultAtt.getValue('name');
            //  var file = searchResultAtt.getValue('custrecord_comm_attach_file');
            //  // var fileRecord = nlapiLoadFile(file);
            //  // 
            //  console.log(file)

            //  var preview_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=' + file + '&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg');

            //  newHtml += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="' + attId + '" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + preview_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="' + attName + '"><span class="input-group-addon"><input type="checkbox" id="' + file + '" class="attachments" /></span></div></div>';

            //  return true;
            // });

            // newHtml += '</div>';

            var newHtml2 = '<div class="row">';

            var SCF179_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=179&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            if (salesCampaign == 69) {
                var SCF_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=411&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            } else {
                var SCF_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=159&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            }

            var SCF94_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=94&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            var SCF186_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=186&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));

            // newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF179_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="SC - Proposal - SCF"><span class="input-group-addon"><input type="checkbox" id="" class="propscf" /></span></div></div>';
            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Service Commencement Form"><span class="input-group-addon"><input type="checkbox" id="" class="scf" checked/></span></div></div>';
            if (salesCampaign == 69) {
                nlapiSetFieldValue('custpage_scf', 411);
            } else {
                nlapiSetFieldValue('custpage_scf', 159);
            }

            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF94_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Standing Order Form"><span class="input-group-addon"><input type="checkbox" id="" class="sof" /></span></div></div>';
            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF186_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Change of Entity Form"><span class="input-group-addon"><input type="checkbox" id="" class="coe" /></span></div></div>';

            newHtml2 += '</div>';
            newHtml2 += '</div>';



            // $(".row_attachments").html(newHtml);
            $(".row_scf").html(newHtml2);
        }

    }

    if (free_trial == 'T') {
        $('#quote').prop('checked', false);
        $('#form').prop('checked', false);
        $('#free_trial').prop('checked', true);
        // $('#quote').prop('checked', false);
        $('.main_tabs').removeClass('hide');

        if ($('#no_email').is(':checked')) {

            $('.subject_section').addClass('hide');
            $('#dear').addClass('hide');
            $('.body_section').addClass('hide');
            $('.cc_section').addClass('hide');
            $('.template_section').addClass('hide');

            nlapiSetFieldValue('custpage_to', 0);
        } else {
            var customer_status = nlapiGetFieldValue('custpage_customer_status');

            console.log(customer_status)

            var searchedCampTemp = nlapiLoadSearch('customrecord_camp_comm_template', 'customsearch_salesp_campaign_templates');


            var newFiltersCampTemp = new Array();
            if (customer_status == '13') {
                newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 2);
            } else {
                newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 1);
            }

            // // newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
            // if ($('#quote').is(':checked')) {
            //  newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', [2, 5]);
            // } else {
            newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', 2);
            // }


            searchedCampTemp.addFilters(newFiltersCampTemp);

            var resultSetCampTemp = searchedCampTemp.runSearch();


            selectList = $("#template");

            resultSetCampTemp.forEachResult(function (searchResultCampTemp) {

                var tempId = searchResultCampTemp.getValue('internalid');
                var tempName = searchResultCampTemp.getValue('name');

                var option = new Option(tempName, tempId);
                selectList.append(option, null);

                return true;
            });

            var salesRecordId = parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            var salesRecord = nlapiLoadRecord('customrecord_sales', salesRecordId);
            var salesCampaign = salesRecord.getFieldValue('custrecord_sales_campaign');

            // //Search for Attachments
            // var searchedAtt = nlapiLoadSearch('customrecord_comm_attachment', 'customsearch_salesp_attachments');

            // var newFiltersAtt = new Array();
            // if (customer_status == '13') {
            //  newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_camptype', null, 'anyof', 2);
            // } else {
            //  newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_camptype', null, 'anyof', 1);
            // }

            // // newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
            // if ($('#quote').is(':checked')) {
            //  newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_commtype', null, 'anyof', [1, 2, 5]);
            // } else {
            //  newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_commtype', null, 'anyof', [1, 2]);
            // }


            // searchedAtt.addFilters(newFiltersAtt);

            // var resultSetAtt = searchedAtt.runSearch();

            // var newHtml = '<div class="row">';

            // resultSetAtt.forEachResult(function(searchResultAtt) {

            //  var attId = searchResultAtt.getValue('internalid');
            //  var attName = searchResultAtt.getValue('name');
            //  var file = searchResultAtt.getValue('custrecord_comm_attach_file');
            //  // var fileRecord = nlapiLoadFile(file);
            //  // 
            //  console.log(file)

            //  var preview_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=' + file + '&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg');

            //  newHtml += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="' + attId + '" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + preview_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="' + attName + '"><span class="input-group-addon"><input type="checkbox" id="' + file + '" class="attachments" /></span></div></div>';

            //  return true;
            // });

            // newHtml += '</div>';

            var newHtml2 = '<div class="row">';

            var SCF179_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=179&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            if (salesCampaign == 69) {
                // if (role == 3) {
                var SCFFreeTrial_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=412&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
                // } else {
                //     var SCFFreeTrial_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=410&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
                // }
            } else {
                var SCFFreeTrial_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=409&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            }

            var SCF94_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=94&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            var SCF186_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=186&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));

            // newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF179_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="SC - Proposal - SCF"><span class="input-group-addon"><input type="checkbox" id="" class="propscf" /></span></div></div>';
            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCFFreeTrial_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Service Commencement Form"><span class="input-group-addon"><input type="checkbox" id="" class="scf" checked/></span></div></div>';
            if (salesCampaign == 69) {
                // nlapiSetFieldValue('custpage_scf', 410);
                // if (role == 3) {
                nlapiSetFieldValue('custpage_scf', 412);
                // }

            } else {
                nlapiSetFieldValue('custpage_scf', 409);
            }

            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF94_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Standing Order Form"><span class="input-group-addon"><input type="checkbox" id="" class="sof" /></span></div></div>';
            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF186_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Change of Entity Form"><span class="input-group-addon"><input type="checkbox" id="" class="coe" /></span></div></div>';

            newHtml2 += '</div>';
            newHtml2 += '</div>';



            // $(".row_attachments").html(newHtml);
            $(".row_scf").html(newHtml2);
        }

    }

    if (opp_with_value == 'T') {
        $('.main_tabs').removeClass('hide');
        $('#form').prop('checked', false);
        $('#quote').prop('checked', true);

        if ($('#no_email').is(':checked')) {

            $('.subject_section').addClass('hide');
            $('#dear').addClass('hide');
            $('.body_section').addClass('hide');
            $('.cc_section').addClass('hide');
            $('.template_section').addClass('hide');

            nlapiSetFieldValue('custpage_to', 0);
        } else {

            var customer_status = nlapiGetFieldValue('custpage_customer_status');

            var searchedCampTemp = nlapiLoadSearch('customrecord_camp_comm_template', 'customsearch_salesp_campaign_templates');


            var newFiltersCampTemp = new Array();
            if (customer_status == '13') {
                newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 2);
            } else {
                newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 1);
            }

            // newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
            // if ($('#form').is(':checked')) {
            //  newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', [2, 5]);
            // } else {
            newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', 5);
            // }


            searchedCampTemp.addFilters(newFiltersCampTemp);

            var resultSetCampTemp = searchedCampTemp.runSearch();


            selectList = $("#template");

            resultSetCampTemp.forEachResult(function (searchResultCampTemp) {

                var tempId = searchResultCampTemp.getValue('internalid');
                var tempName = searchResultCampTemp.getValue('name');

                var option = new Option(tempName, tempId);
                selectList.append(option, null);

                return true;
            });

            var salesRecordId = parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            var salesRecord = nlapiLoadRecord('customrecord_sales', salesRecordId);
            var salesCampaign = salesRecord.getFieldValue('custrecord_sales_campaign');



            //Search for Attachments
            // var searchedAtt = nlapiLoadSearch('customrecord_comm_attachment', 'customsearch_salesp_attachments');

            // var newFiltersAtt = new Array();
            // if (customer_status == '13') {
            //  newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_camptype', null, 'anyof', 2);
            // } else {
            //  newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_camptype', null, 'anyof', 1);
            // }

            // // newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
            // if ($('#form').is(':checked')) {
            //  newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_commtype', null, 'anyof', [1, 2, 5]);
            // } else {
            //  newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_commtype', null, 'anyof', [1, 5]);
            // }


            // searchedAtt.addFilters(newFiltersAtt);

            // var resultSetAtt = searchedAtt.runSearch();

            // var newHtml = '<div class="row">';

            // resultSetAtt.forEachResult(function(searchResultAtt) {

            //  var attId = searchResultAtt.getValue('internalid');
            //  var attName = searchResultAtt.getValue('name');
            //  var file = searchResultAtt.getValue('custrecord_comm_attach_file');
            //  // var fileRecord = nlapiLoadFile(file);


            //  newHtml += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="' + attId + '" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview()"/></button></span><input type="text" readonly id="" class="form-control" value="' + attName + '"><span class="input-group-addon"><input type="checkbox" id="' + file + '" class="attachments" /></span></div></div>';

            //  return true;
            // });

            // newHtml += '</div>';

            var newHtml2 = '<div class="row">';
            var SCF179_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=179&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            if (salesCampaign == 69) {
                var SCF_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=411&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            } else {
                var SCF_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=159&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            }

            var SCF94_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=94&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            var SCF186_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=186&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));

            // newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF179_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="SC - Proposal - SCF"><span class="input-group-addon"><input type="checkbox" id="" class="propscf" /></span></div></div>';
            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Service Commencement Form"><span class="input-group-addon"><input type="checkbox" id="" class="scf" /></span></div></div>';
            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF94_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Standing Order Form"><span class="input-group-addon"><input type="checkbox" id="" class="sof" /></span></div></div>';
            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF186_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Change of Entity Form"><span class="input-group-addon"><input type="checkbox" id="" class="coe" /></span></div></div>';

            newHtml2 += '</div>';
            newHtml2 += '</div>';


            // $(".row_attachments").html(newHtml);
            $(".row_scf").html(newHtml2);
        }
    }

    if (invite_to_portal == 'T' || referral == 'T') {
        $('.main_tabs').removeClass('hide');
        if (unity == 'T' || referral == 'T') {
            if (unity == 'T') {
                var recCommTemp = nlapiLoadRecord('customrecord_camp_comm_template', 60);
            } else if (referral == 'T') {
                var recCommTemp = nlapiLoadRecord('customrecord_camp_comm_template', 95);
            }

            var templateId = recCommTemp.getFieldValue('custrecord_camp_comm_email_template');
            var subject = recCommTemp.getFieldValue('custrecord_camp_comm_subject');
            var first_name = $('#send_to option:selected').data("firstname");

            var userID = nlapiGetContext().getUser();

            var employeeRec

            console.log(first_name);
            console.log(userID);
            console.log($('#send_to').val());



            var url = 'https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=395&deploy=1&compid=1048144&ns-at=AAEJ7tMQgAVHkxJsbXgGwQQm4xn968o7JJ9-Ym7oanOzCSkWO78&rectype=customer&template=';


            url += $('#template option:selected').val() + '&recid=' + nlapiGetFieldValue('custpage_customer_id') + '&salesrep=' + escape(nlapiGetContext().getName()) + '&dear=' + escape(first_name) + '&contactid=' + escape($('#send_to').val()) + '&userid=' + escape(userID);

            urlCall = nlapiRequestURL(url);
            var emailHtml = urlCall.getBody();
            var emailSubject = urlCall.getHeader('Custom-Header-SubjectLine');

            console.log(urlCall);
            console.log(subject);
            console.log(emailSubject);

            $('#email_body').summernote('code', emailHtml);
            $('#subject').val(subject)
        }
    }

    document.getElementById('tdbody_update_record').style = 'background-color: #125ab2 !important;color: white;';

    AddStyle('https://1048144.app.netsuite.com/core/media/media.nl?id=1988776&c=1048144&h=58352d0b4544df20b40f&_xt=.css', 'head');
    // $('#attachments').selectator({
    // 	keepOpen: true,
    // 	showAllOptionsOnFocus: true,
    // 	selectFirstOptionOnSearch: false
    // });

}

$(document).on('click', '#invite_to_portal', function (event) {
    if ($('#invite_to_portal').is(':checked')) {

        $('#quote').prop('checked', false);
        $('#form').prop('checked', false);

        $('.main_tabs').removeClass('hide');

        $('#services').removeClass('active');
        $('.services_li').removeClass('active');
        $('.services_li').addClass('hide');

        $('#email').addClass('active');
        $('.email_li').addClass('active');

        var customer_status = nlapiGetFieldValue('custpage_customer_status');

        var searchedCampTemp = nlapiLoadSearch('customrecord_camp_comm_template', 'customsearch_salesp_campaign_templates');


        var newFiltersCampTemp = new Array();
        if (customer_status == '13') {
            newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 2);
        } else {
            newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 1);
        }

        // newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
        // if ($('#form').is(':checked')) {
        //  newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', [2, 5]);
        // } else {
        newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', 5);
        // }


        searchedCampTemp.addFilters(newFiltersCampTemp);

        var resultSetCampTemp = searchedCampTemp.runSearch();


        selectList = $("#template");

        resultSetCampTemp.forEachResult(function (searchResultCampTemp) {

            var tempId = searchResultCampTemp.getValue('internalid');
            var tempName = searchResultCampTemp.getValue('name');

            var option = new Option(tempName, tempId);
            selectList.append(option, null);

            return true;
        });

        //Search for Attachments
        // var searchedAtt = nlapiLoadSearch('customrecord_comm_attachment', 'customsearch_salesp_attachments');

        // var newFiltersAtt = new Array();
        // if (customer_status == '13') {
        //  newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_camptype', null, 'anyof', 2);
        // } else {
        //  newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_camptype', null, 'anyof', 1);
        // }

        // // newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
        // if ($('#form').is(':checked')) {
        //  newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_commtype', null, 'anyof', [1, 2, 5]);
        // } else {
        //  newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_commtype', null, 'anyof', [1, 5]);
        // }


        // searchedAtt.addFilters(newFiltersAtt);

        // var resultSetAtt = searchedAtt.runSearch();

        // var newHtml = '<div class="row">';

        // resultSetAtt.forEachResult(function(searchResultAtt) {

        //  var attId = searchResultAtt.getValue('internalid');
        //  var attName = searchResultAtt.getValue('name');
        //  var file = searchResultAtt.getValue('custrecord_comm_attach_file');
        //  // var fileRecord = nlapiLoadFile(file);


        //  newHtml += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="' + attId + '" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview()"/></button></span><input type="text" readonly id="" class="form-control" value="' + attName + '"><span class="input-group-addon"><input type="checkbox" id="' + file + '" class="attachments" /></span></div></div>';

        //  return true;
        // });

        // newHtml += '</div>';

        var newHtml2 = '<div class="row">';
        var SCF179_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=179&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
        var SCF159_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=159&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
        var SCF94_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=94&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
        var SCF186_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=186&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));

        // newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF179_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="SC - Proposal - SCF"><span class="input-group-addon"><input type="checkbox" id="" class="propscf" /></span></div></div>';
        newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF159_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Service Commencement Form"><span class="input-group-addon"><input type="checkbox" id="" class="scf" /></span></div></div>';
        newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF94_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Standing Order Form"><span class="input-group-addon"><input type="checkbox" id="" class="sof" /></span></div></div>';
        newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF186_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Change of Entity Form"><span class="input-group-addon"><input type="checkbox" id="" class="coe" /></span></div></div>';

        newHtml2 += '</div>';
        newHtml2 += '</div>';


        // $(".row_attachments").html(newHtml);
        $(".row_scf").html(newHtml2);

        nlapiSetFieldValue('custpage_invite', 'T')

    } else {
        $('.main_tabs').removeClass('active');
        $('.main_tabs').addClass('hide');
        $('#services').addClass('active');
        $('.services_li').addClass('active');

        $('#email').removeClass('active');
        $('.email_li').removeClass('active');
    }
});

$(document).on('click', '#referral_program', function (event) {
    if ($('#invite_to_portal').is(':checked')) {

        $('#quote').prop('checked', false);
        $('#form').prop('checked', false);

        $('.main_tabs').removeClass('hide');

        $('#services').removeClass('active');
        $('.services_li').removeClass('active');
        $('.services_li').addClass('hide');

        $('#email').addClass('active');
        $('.email_li').addClass('active');

        var customer_status = nlapiGetFieldValue('custpage_customer_status');

        var searchedCampTemp = nlapiLoadSearch('customrecord_camp_comm_template', 'customsearch_salesp_campaign_templates');


        var newFiltersCampTemp = new Array();
        if (customer_status == '13') {
            newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 2);
        } else {
            newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 1);
        }

        // newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
        // if ($('#form').is(':checked')) {
        //  newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', [2, 5]);
        // } else {
        newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', 5);
        // }


        searchedCampTemp.addFilters(newFiltersCampTemp);

        var resultSetCampTemp = searchedCampTemp.runSearch();


        selectList = $("#template");

        resultSetCampTemp.forEachResult(function (searchResultCampTemp) {

            var tempId = searchResultCampTemp.getValue('internalid');
            var tempName = searchResultCampTemp.getValue('name');

            var option = new Option(tempName, tempId);
            selectList.append(option, null);

            return true;
        });

        //Search for Attachments
        // var searchedAtt = nlapiLoadSearch('customrecord_comm_attachment', 'customsearch_salesp_attachments');

        // var newFiltersAtt = new Array();
        // if (customer_status == '13') {
        //  newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_camptype', null, 'anyof', 2);
        // } else {
        //  newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_camptype', null, 'anyof', 1);
        // }

        // // newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
        // if ($('#form').is(':checked')) {
        //  newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_commtype', null, 'anyof', [1, 2, 5]);
        // } else {
        //  newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_commtype', null, 'anyof', [1, 5]);
        // }


        // searchedAtt.addFilters(newFiltersAtt);

        // var resultSetAtt = searchedAtt.runSearch();

        // var newHtml = '<div class="row">';

        // resultSetAtt.forEachResult(function(searchResultAtt) {

        //  var attId = searchResultAtt.getValue('internalid');
        //  var attName = searchResultAtt.getValue('name');
        //  var file = searchResultAtt.getValue('custrecord_comm_attach_file');
        //  // var fileRecord = nlapiLoadFile(file);


        //  newHtml += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="' + attId + '" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview()"/></button></span><input type="text" readonly id="" class="form-control" value="' + attName + '"><span class="input-group-addon"><input type="checkbox" id="' + file + '" class="attachments" /></span></div></div>';

        //  return true;
        // });

        // newHtml += '</div>';

        // var newHtml2 = '<div class="row">';
        // var SCF179_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=179&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
        // var SCF159_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=159&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
        // var SCF94_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=94&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
        // var SCF186_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=186&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));

        // // newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF179_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="SC - Proposal - SCF"><span class="input-group-addon"><input type="checkbox" id="" class="propscf" /></span></div></div>';
        // newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF159_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Service Commencement Form"><span class="input-group-addon"><input type="checkbox" id="" class="scf" /></span></div></div>';
        // newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF94_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Standing Order Form"><span class="input-group-addon"><input type="checkbox" id="" class="sof" /></span></div></div>';
        // newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF186_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Change of Entity Form"><span class="input-group-addon"><input type="checkbox" id="" class="coe" /></span></div></div>';

        // newHtml2 += '</div>';
        // newHtml2 += '</div>';


        // // $(".row_attachments").html(newHtml);
        // $(".row_scf").html(newHtml2);



    } else {
        $('.main_tabs').removeClass('active');
        $('.main_tabs').addClass('hide');
        $('#services').addClass('active');
        $('.services_li').addClass('active');

        $('#email').removeClass('active');
        $('.email_li').removeClass('active');
    }
});

$(document).on('click', '#form', function (event) {
    if ($('#form').is(':checked')) {

        $('#quote').prop('checked', false);
        $('#invite_to_portal').prop('checked', false);
        // $('#quote').prop('checked', false);
        $('.main_tabs').removeClass('hide');
        $('#services').addClass('active');
        $('.services_li').addClass('active');
        $('.services_li').removeClass('hide');
        $('#email').removeClass('active');
        $('.email_li').removeClass('active');
        if ($('#no_email').is(':checked')) {

            $('.subject_section').addClass('hide');
            $('#dear').addClass('hide');
            $('.body_section').addClass('hide');
            $('.cc_section').addClass('hide');
            $('.template_section').addClass('hide');

            nlapiSetFieldValue('custpage_to', 0);
        } else {
            var customer_status = nlapiGetFieldValue('custpage_customer_status');

            console.log(customer_status)

            var searchedCampTemp = nlapiLoadSearch('customrecord_camp_comm_template', 'customsearch_salesp_campaign_templates');


            var newFiltersCampTemp = new Array();
            if (customer_status == '13') {
                newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 2);
            } else {
                newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 1);
            }

            // // newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
            // if ($('#quote').is(':checked')) {
            // 	newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', [2, 5]);
            // } else {
            newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', 2);
            // }


            searchedCampTemp.addFilters(newFiltersCampTemp);

            var resultSetCampTemp = searchedCampTemp.runSearch();


            selectList = $("#template");

            resultSetCampTemp.forEachResult(function (searchResultCampTemp) {

                var tempId = searchResultCampTemp.getValue('internalid');
                var tempName = searchResultCampTemp.getValue('name');

                var option = new Option(tempName, tempId);
                selectList.append(option, null);

                return true;
            });

            // //Search for Attachments
            // var searchedAtt = nlapiLoadSearch('customrecord_comm_attachment', 'customsearch_salesp_attachments');

            // var newFiltersAtt = new Array();
            // if (customer_status == '13') {
            // 	newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_camptype', null, 'anyof', 2);
            // } else {
            // 	newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_camptype', null, 'anyof', 1);
            // }

            // // newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
            // if ($('#quote').is(':checked')) {
            // 	newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_commtype', null, 'anyof', [1, 2, 5]);
            // } else {
            // 	newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_commtype', null, 'anyof', [1, 2]);
            // }


            // searchedAtt.addFilters(newFiltersAtt);

            // var resultSetAtt = searchedAtt.runSearch();

            // var newHtml = '<div class="row">';

            // resultSetAtt.forEachResult(function(searchResultAtt) {

            // 	var attId = searchResultAtt.getValue('internalid');
            // 	var attName = searchResultAtt.getValue('name');
            // 	var file = searchResultAtt.getValue('custrecord_comm_attach_file');
            // 	// var fileRecord = nlapiLoadFile(file);
            // 	// 
            // 	console.log(file)

            // 	var preview_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=' + file + '&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg');

            // 	newHtml += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="' + attId + '" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + preview_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="' + attName + '"><span class="input-group-addon"><input type="checkbox" id="' + file + '" class="attachments" /></span></div></div>';

            // 	return true;
            // });

            // newHtml += '</div>';

            var newHtml2 = '<div class="row">';

            var SCF179_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=179&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            var SCF159_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=159&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            var SCF94_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=94&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            var SCF186_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=186&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));

            // newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF179_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="SC - Proposal - SCF"><span class="input-group-addon"><input type="checkbox" id="" class="propscf" /></span></div></div>';
            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF159_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Service Commencement Form"><span class="input-group-addon"><input type="checkbox" id="" class="scf" checked/></span></div></div>';
            nlapiSetFieldValue('custpage_scf', 159);
            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF94_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Standing Order Form"><span class="input-group-addon"><input type="checkbox" id="" class="sof" /></span></div></div>';
            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF186_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Change of Entity Form"><span class="input-group-addon"><input type="checkbox" id="" class="coe" /></span></div></div>';

            newHtml2 += '</div>';
            newHtml2 += '</div>';



            // $(".row_attachments").html(newHtml);
            $(".row_scf").html(newHtml2);
        }



    } else {
        // $('#services').removeClass('active');
        $('.main_tabs').removeClass('active');
        $('.main_tabs').addClass('hide');
        $('#services').addClass('active');
        $('.services_li').addClass('active');
    }
});


$(document).on('click', '.scf', function (event) {
    if ($('.scf').is(':checked')) {
        $("input.propscf").attr("disabled", true);
        nlapiSetFieldValue('custpage_scf', 159);
    } else {
        $("input.propscf").removeAttr("disabled");
        nlapiSetFieldValue('custpage_scf', null);
    }
});

$(document).on('click', '.sof', function (event) {
    if ($('.scf').is(':checked')) {
        // $("input.propsof").attr("disabled", true);
        nlapiSetFieldValue('custpage_sof', 94);
    } else {
        // $("input.propsof").removeAttr("disabled");
        nlapiSetFieldValue('custpage_sof', null);
    }
});

$(document).on('click', '.quotescf', function (event) {
    if ($('.quotescf').is(':checked')) {

        nlapiSetFieldValue('custpage_scf', 180);
    } else {

        nlapiSetFieldValue('custpage_scf', null);
    }
});

$(document).on('click', '.coe', function (event) {
    if ($('.coe').is(':checked')) {

        nlapiSetFieldValue('custpage_coe', 186);
    } else {

        nlapiSetFieldValue('custpage_coe', null);
    }
});

$(document).on('click', '.propscf', function (event) {
    if ($('.propscf').is(':checked')) {
        $("input.scf").attr("disabled", true);
        nlapiSetFieldValue('custpage_scf', 179);
    } else {
        $("input.scf").removeAttr("disabled");
        nlapiSetFieldValue('custpage_scf', null);
    }
});

$(document).on('click', '#quote', function (event) {
    if ($('#quote').is(':checked')) {
        $('.main_tabs').removeClass('hide');
        $('#form').prop('checked', false);
        $('#invite_to_portal').prop('checked', false);
        $('#services').addClass('active');
        $('.services_li').addClass('active');
        $('.services_li').removeClass('hide');
        $('#email').removeClass('active');
        $('.email_li').removeClass('active');
        if ($('#no_email').is(':checked')) {

            $('.subject_section').addClass('hide');
            $('#dear').addClass('hide');
            $('.body_section').addClass('hide');
            $('.cc_section').addClass('hide');
            $('.template_section').addClass('hide');

            nlapiSetFieldValue('custpage_to', 0);
        } else {

            var customer_status = nlapiGetFieldValue('custpage_customer_status');

            var searchedCampTemp = nlapiLoadSearch('customrecord_camp_comm_template', 'customsearch_salesp_campaign_templates');


            var newFiltersCampTemp = new Array();
            if (customer_status == '13') {
                newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 2);
            } else {
                newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 1);
            }

            // newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
            // if ($('#form').is(':checked')) {
            // 	newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', [2, 5]);
            // } else {
            newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', 5);
            // }


            searchedCampTemp.addFilters(newFiltersCampTemp);

            var resultSetCampTemp = searchedCampTemp.runSearch();


            selectList = $("#template");

            resultSetCampTemp.forEachResult(function (searchResultCampTemp) {

                var tempId = searchResultCampTemp.getValue('internalid');
                var tempName = searchResultCampTemp.getValue('name');

                var option = new Option(tempName, tempId);
                selectList.append(option, null);

                return true;
            });

            //Search for Attachments
            // var searchedAtt = nlapiLoadSearch('customrecord_comm_attachment', 'customsearch_salesp_attachments');

            // var newFiltersAtt = new Array();
            // if (customer_status == '13') {
            // 	newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_camptype', null, 'anyof', 2);
            // } else {
            // 	newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_camptype', null, 'anyof', 1);
            // }

            // // newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
            // if ($('#form').is(':checked')) {
            // 	newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_commtype', null, 'anyof', [1, 2, 5]);
            // } else {
            // 	newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_commtype', null, 'anyof', [1, 5]);
            // }


            // searchedAtt.addFilters(newFiltersAtt);

            // var resultSetAtt = searchedAtt.runSearch();

            // var newHtml = '<div class="row">';

            // resultSetAtt.forEachResult(function(searchResultAtt) {

            // 	var attId = searchResultAtt.getValue('internalid');
            // 	var attName = searchResultAtt.getValue('name');
            // 	var file = searchResultAtt.getValue('custrecord_comm_attach_file');
            // 	// var fileRecord = nlapiLoadFile(file);


            // 	newHtml += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="' + attId + '" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview()"/></button></span><input type="text" readonly id="" class="form-control" value="' + attName + '"><span class="input-group-addon"><input type="checkbox" id="' + file + '" class="attachments" /></span></div></div>';

            // 	return true;
            // });

            // newHtml += '</div>';

            var newHtml2 = '<div class="row">';
            var SCF179_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=179&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            var SCF159_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=159&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            var SCF94_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=94&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            var SCF186_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=186&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));

            // newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF179_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="SC - Proposal - SCF"><span class="input-group-addon"><input type="checkbox" id="" class="propscf" /></span></div></div>';
            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF159_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Service Commencement Form"><span class="input-group-addon"><input type="checkbox" id="" class="scf" checked/></span></div></div>';
            nlapiSetFieldValue('custpage_scf', 159);
            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF94_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Standing Order Form"><span class="input-group-addon"><input type="checkbox" id="" class="sof" /></span></div></div>';
            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF186_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Change of Entity Form"><span class="input-group-addon"><input type="checkbox" id="" class="coe" /></span></div></div>';

            newHtml2 += '</div>';
            newHtml2 += '</div>';


            // $(".row_attachments").html(newHtml);
            $(".row_scf").html(newHtml2);
        }

    } else {
        // $('#services').removeClass('active');
        $('.main_tabs').removeClass('active');
        $('.main_tabs').addClass('hide');
        $('#services').addClass('active');
        $('.services_li').addClass('active');
    }
});

$(document).on('click', '#signup', function (event) {
    if ($('#signup').is(':checked')) {
        $('.main_tabs').removeClass('hide');
        $('#form').prop('checked', false);
        $('#invite_to_portal').prop('checked', false);
        $('#services').addClass('hide');
        $('.services_li').addClass('hide');
        // $('.services_li').removeClass('hide');
        $('#email').addClass('active');
        $('.email_li').removeClass('active');
        if ($('#no_email').is(':checked')) {

            $('.subject_section').addClass('hide');
            $('#dear').addClass('hide');
            $('.body_section').addClass('hide');
            $('.cc_section').addClass('hide');
            $('.template_section').addClass('hide');

            nlapiSetFieldValue('custpage_to', 0);
        } else {

            var customer_status = nlapiGetFieldValue('custpage_customer_status');

            var searchedCampTemp = nlapiLoadSearch('customrecord_camp_comm_template', 'customsearch_salesp_campaign_templates');


            var newFiltersCampTemp = new Array();
            if (customer_status == '13') {
                newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 2);
            } else {
                newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 1);
            }

            // newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
            // if ($('#form').is(':checked')) {
            // 	newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', [2, 5]);
            // } else {
            newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', 5);
            // }


            searchedCampTemp.addFilters(newFiltersCampTemp);

            var resultSetCampTemp = searchedCampTemp.runSearch();


            selectList = $("#template");

            resultSetCampTemp.forEachResult(function (searchResultCampTemp) {

                var tempId = searchResultCampTemp.getValue('internalid');
                var tempName = searchResultCampTemp.getValue('name');

                var option = new Option(tempName, tempId);
                selectList.append(option, null);

                return true;
            });

            //Search for Attachments
            // var searchedAtt = nlapiLoadSearch('customrecord_comm_attachment', 'customsearch_salesp_attachments');

            // var newFiltersAtt = new Array();
            // if (customer_status == '13') {
            // 	newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_camptype', null, 'anyof', 2);
            // } else {
            // 	newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_camptype', null, 'anyof', 1);
            // }

            // // newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
            // if ($('#form').is(':checked')) {
            // 	newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_commtype', null, 'anyof', [1, 2, 5]);
            // } else {
            // 	newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_commtype', null, 'anyof', [1, 5]);
            // }


            // searchedAtt.addFilters(newFiltersAtt);

            // var resultSetAtt = searchedAtt.runSearch();

            // var newHtml = '<div class="row">';

            // resultSetAtt.forEachResult(function(searchResultAtt) {

            // 	var attId = searchResultAtt.getValue('internalid');
            // 	var attName = searchResultAtt.getValue('name');
            // 	var file = searchResultAtt.getValue('custrecord_comm_attach_file');
            // 	// var fileRecord = nlapiLoadFile(file);


            // 	newHtml += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="' + attId + '" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview()"/></button></span><input type="text" readonly id="" class="form-control" value="' + attName + '"><span class="input-group-addon"><input type="checkbox" id="' + file + '" class="attachments" /></span></div></div>';

            // 	return true;
            // });

            // newHtml += '</div>';

            var newHtml2 = '<div class="row">';
            var SCF179_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=179&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            var SCF159_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=159&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            var SCF94_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=94&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            var SCF186_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=186&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));

            // newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF179_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="SC - Proposal - SCF"><span class="input-group-addon"><input type="checkbox" id="" class="propscf" /></span></div></div>';
            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF159_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Service Commencement Form"><span class="input-group-addon"><input type="checkbox" id="" class="scf" checked/></span></div></div>';
            nlapiSetFieldValue('custpage_scf', 159);
            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF94_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Standing Order Form"><span class="input-group-addon"><input type="checkbox" id="" class="sof" /></span></div></div>';
            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF186_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Change of Entity Form"><span class="input-group-addon"><input type="checkbox" id="" class="coe" /></span></div></div>';

            newHtml2 += '</div>';
            newHtml2 += '</div>';


            // $(".row_attachments").html(newHtml);
            $(".row_scf").html(newHtml2);
        }

    } else {
        // $('#services').removeClass('active');
        $('.main_tabs').removeClass('active');
        $('.main_tabs').addClass('hide');
        $('#services').addClass('active');
        $('.services_li').addClass('active');
    }
});

$(document).on('click', '#outofterr', function (event) {
    if ($('#outofterr').is(':checked')) {
        $('.main_tabs').removeClass('hide');
        $('#form').prop('checked', false);
        $('#invite_to_portal').prop('checked', false);
        $('#services').addClass('hide');
        $('.services_li').addClass('hide');
        // $('.services_li').removeClass('hide');
        $('#email').addClass('active');
        $('.email_li').removeClass('active');
        if ($('#no_email').is(':checked')) {

            $('.subject_section').addClass('hide');
            $('#dear').addClass('hide');
            $('.body_section').addClass('hide');
            $('.cc_section').addClass('hide');
            $('.template_section').addClass('hide');

            nlapiSetFieldValue('custpage_to', 0);
        } else {

            var customer_status = nlapiGetFieldValue('custpage_customer_status');

            var searchedCampTemp = nlapiLoadSearch('customrecord_camp_comm_template', 'customsearch_salesp_campaign_templates');


            var newFiltersCampTemp = new Array();
            if (customer_status == '13') {
                newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 2);
            } else {
                newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_camp_type', null, 'anyof', 1);
            }

            // newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
            // if ($('#form').is(':checked')) {
            // 	newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', [2, 5]);
            // } else {
            newFiltersCampTemp[newFiltersCampTemp.length] = new nlobjSearchFilter('custrecord_camp_comm_comm_type', null, 'anyof', 5);
            // }


            searchedCampTemp.addFilters(newFiltersCampTemp);

            var resultSetCampTemp = searchedCampTemp.runSearch();


            selectList = $("#template");

            resultSetCampTemp.forEachResult(function (searchResultCampTemp) {

                var tempId = searchResultCampTemp.getValue('internalid');
                var tempName = searchResultCampTemp.getValue('name');

                var option = new Option(tempName, tempId);
                selectList.append(option, null);

                return true;
            });

            //Search for Attachments
            // var searchedAtt = nlapiLoadSearch('customrecord_comm_attachment', 'customsearch_salesp_attachments');

            // var newFiltersAtt = new Array();
            // if (customer_status == '13') {
            // 	newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_camptype', null, 'anyof', 2);
            // } else {
            // 	newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_camptype', null, 'anyof', 1);
            // }

            // // newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
            // if ($('#form').is(':checked')) {
            // 	newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_commtype', null, 'anyof', [1, 2, 5]);
            // } else {
            // 	newFiltersAtt[newFiltersAtt.length] = new nlobjSearchFilter('custrecord_comm_attach_commtype', null, 'anyof', [1, 5]);
            // }


            // searchedAtt.addFilters(newFiltersAtt);

            // var resultSetAtt = searchedAtt.runSearch();

            // var newHtml = '<div class="row">';

            // resultSetAtt.forEachResult(function(searchResultAtt) {

            // 	var attId = searchResultAtt.getValue('internalid');
            // 	var attName = searchResultAtt.getValue('name');
            // 	var file = searchResultAtt.getValue('custrecord_comm_attach_file');
            // 	// var fileRecord = nlapiLoadFile(file);


            // 	newHtml += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="' + attId + '" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview()"/></button></span><input type="text" readonly id="" class="form-control" value="' + attName + '"><span class="input-group-addon"><input type="checkbox" id="' + file + '" class="attachments" /></span></div></div>';

            // 	return true;
            // });

            // newHtml += '</div>';

            var newHtml2 = '<div class="row">';
            var SCF179_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=179&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            var SCF159_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=159&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            var SCF94_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=94&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
            var SCF186_url = baseURL + '/app/site/hosting/scriptlet.nl?script=746&deploy=1&stage=0&custid=' + nlapiGetFieldValue('custpage_customer_id') + '&scfid=186&start=null&end=null&commreg=' + nlapiGetFieldValue('custpage_commreg') + '&salesrecordid=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));

            // newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF179_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="SC - Proposal - SCF"><span class="input-group-addon"><input type="checkbox" id="" class="propscf" /></span></div></div>';
            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF159_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Service Commencement Form"><span class="input-group-addon"><input type="checkbox" id="" class="scf" /></span></div></div>';
            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF94_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Standing Order Form"><span class="input-group-addon"><input type="checkbox" id="" class="sof" /></span></div></div>';
            newHtml2 += '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon"><button type="button" id="" class=" btn btn-xs glyphicon glyphicon-new-window" style="height: 20px;" onclick="onclick_preview(\'' + SCF186_url + '\')"/></button></span><input type="text" readonly id="" class="form-control" value="Change of Entity Form"><span class="input-group-addon"><input type="checkbox" id="" class="coe" /></span></div></div>';

            newHtml2 += '</div>';
            newHtml2 += '</div>';


            // $(".row_attachments").html(newHtml);
            $(".row_scf").html(newHtml2);
        }

    } else {
        // $('#services').removeClass('active');
        $('.main_tabs').removeClass('active');
        $('.main_tabs').addClass('hide');
        $('#services').addClass('active');
        $('.services_li').addClass('active');
    }
});



$(document).on("change", "#attachments", function (e) {
    $('option:selected', this).each(function () {
        $('#myModal').modal("hide");
        var id = $(this).val();
        console.log(id)
        var body = preview(nlapiGetFieldValue('custpage_customer_id'), $('#send_to').val(), $('#send_to').attr("data-firstname"), id);
        $('#myModal .modal-header').html('<div class="form-group"><h4><label class="control-label" for="inputError1">Attachment Preview!!</label></h4></div>');
        $('#myModal .modal-body').html("");
        $('#myModal .modal-body').html(body);
        $('#myModal').modal("show");

    });


});

$(document).on('change', '#send_to', function (e) {


    if ($('#send_to').val() == 0) {
        $('.subject_section').addClass('hide');
        $('#dear').addClass('hide');
        $('.body_section').addClass('hide');
        $('.cc_section').addClass('hide');
        $('.template_section').addClass('hide');
        $('.subject_section').addClass('hide');

        nlapiSetFieldValue('custpage_to', 0);
    } else {
        $('#dear').removeClass('hide');
        $('.body_section').removeClass('hide');
        $('.cc_section').removeClass('hide');
        $('.template_section').removeClass('hide');
        $('.subject_section').removeClass('hide');
        nlapiSetFieldValue('custpage_to', null);
        var templateID = $('#template option:selected').val();
        if (!isNullorEmpty(templateID)) {
            var recCommTemp = nlapiLoadRecord('customrecord_camp_comm_template', $('#template option:selected').val());
            var templateId = recCommTemp.getFieldValue('custrecord_camp_comm_email_template');
            var subject = recCommTemp.getFieldValue('custrecord_camp_comm_subject');
            var first_name = $('#send_to option:selected').data("firstname");

            var userID = nlapiGetContext().getUser();

            var newFiltersCommReg = new Array();
            newFiltersCommReg[newFiltersCommReg.length] = new nlobjSearchFilter(
                'custrecord_commreg_sales_record', null, 'anyof', parseInt(nlapiGetFieldValue('custpage_sales_record_id')));
            newFiltersCommReg[newFiltersCommReg.length] = new nlobjSearchFilter(
                'custrecord_customer', null, 'anyof', nlapiGetFieldValue('custpage_customer_id'));
            newFiltersCommReg[newFiltersCommReg.length] = new nlobjSearchFilter(
                'custrecord_trial_status', null, 'anyof', [10, 9, 2]);

            var commencement_date = null;

            var col = new Array();
            col[0] = new nlobjSearchColumn('internalId');
            col[1] = new nlobjSearchColumn('custrecord_date_entry');
            col[2] = new nlobjSearchColumn('custrecord_sale_type');
            col[3] = new nlobjSearchColumn('custrecord_franchisee');
            col[4] = new nlobjSearchColumn('custrecord_comm_date');
            col[5] = new nlobjSearchColumn('custrecord_in_out');
            col[6] = new nlobjSearchColumn('custrecord_customer');
            col[7] = new nlobjSearchColumn('custrecord_trial_status');
            col[8] = new nlobjSearchColumn('custrecord_comm_date_signup');
            col[9] = new nlobjSearchColumn('custrecord_trial_expiry');


            var comm_reg_results = nlapiSearchRecord(
                'customrecord_commencement_register', null, newFiltersCommReg, col);

            var commReg;
            var commencement_date;
            var billingStartdate
            var formattedBillingStartToday;
            if (!isNullorEmpty(comm_reg_results)) {
                if (comm_reg_results.length == 1) {
                    commReg = comm_reg_results[0].getValue('internalid');
                    commencement_date = comm_reg_results[0].getValue('custrecord_comm_date')
                    trial_end_date = comm_reg_results[0].getValue('custrecord_trial_expiry')
                    trial_end_date_split = trial_end_date.split('/');
                    billingStartdate = new Date(trial_end_date_split[2] + "-" + trial_end_date_split[1] + "-" + trial_end_date_split[0]);
                    billingStartdate.setDate(billingStartdate.getDate() + 1);

                    var yyyy = billingStartdate.getFullYear();
                    var mm = billingStartdate.getMonth() + 1; // Months start at 0!
                    var dd = billingStartdate.getDate();

                    if (dd < 10) dd = '0' + dd;
                    if (mm < 10) mm = '0' + mm;

                    formattedBillingStartToday = dd + '/' + mm + '/' + yyyy;

                } else if (comm_reg_results.length > 1) {

                }
            }

            nlapiGetFieldValue('custpage_commreg')


            var url = 'https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=395&deploy=1&compid=1048144&ns-at=AAEJ7tMQgAVHkxJsbXgGwQQm4xn968o7JJ9-Ym7oanOzCSkWO78&rectype=customer&template=';


            url += $('#template option:selected').val() + '&recid=' + nlapiGetFieldValue('custpage_customer_id') + '&salesrep=' + escape(nlapiGetContext().getName()) + '&dear=' + escape(first_name) + '&contactid=' + escape($('#send_to').val()) + '&userid=' + escape(userID) + '&commdate=' + commencement_date + '&commreg=' + commReg + '&trialenddate=' + trial_end_date + '&billingstartdate=' + formattedBillingStartToday;

            urlCall = nlapiRequestURL(url);
            var emailHtml = urlCall.getBody();
            var emailSubject = urlCall.getHeader('Custom-Header-SubjectLine');

            console.log(urlCall);
            console.log(subject);
            console.log(emailSubject);

            $('#email_body').summernote('code', emailHtml);
            $('#subject').val(subject);
        }
    }

});

$(document).on('change', '#template', function (e) {

    var recCommTemp = nlapiLoadRecord('customrecord_camp_comm_template', $('option:selected', this).val());
    var templateId = recCommTemp.getFieldValue('custrecord_camp_comm_email_template');
    var subject = recCommTemp.getFieldValue('custrecord_camp_comm_subject');
    var first_name = $('#send_to option:selected').data("firstname");

    var invite_to_portal = nlapiGetFieldValue('custpage_invite');

    var userID = nlapiGetContext().getUser();

    var employeeRec

    console.log(first_name);
    console.log(userID);
    console.log($('#send_to').val());

    console.log('Customer Internal ID:' + parseInt(nlapiGetFieldValue('custpage_customer_id')));

    //All Sales Record - Get Sales Rep Details
    var salesRecordAllSearch = nlapiLoadSearch('customrecord_sales', 'customsearch_sales_record_auto_signed__2');

    var newFilters_salesRecordAllSearch = new Array();
    newFilters_salesRecordAllSearch[0] = new nlobjSearchFilter('internalid', 'custrecord_sales_customer', 'is', parseInt(nlapiGetFieldValue('custpage_customer_id')));

    salesRecordAllSearch.addFilters(newFilters_salesRecordAllSearch);

    var salesRecordAutoSignedResult = salesRecordAllSearch.runSearch();

    var salesRecordAutoSignedResultSet = salesRecordAutoSignedResult.getResults(0, 1);

    var salesRepEmail = null;
    var salesRepName = null;
    var salesRepId = null

    if (!isNullorEmpty(salesRecordAutoSignedResultSet)) {
        if (salesRecordAutoSignedResultSet.length != 0) {
            salesRecordAutoSignedResult.forEachResult(function (searchResult) {

                salesRepEmail = searchResult.getValue('email', 'CUSTRECORD_SALES_ASSIGNED', null);
                salesRepId = searchResult.getValue('custrecord_sales_assigned');
                salesRepName = searchResult.getText('custrecord_sales_assigned');
                return true;
            });
        }
    }

    //If Sales Rep is Belinda, Lee or Kerina
    if (salesRepId != '668712' || salesRepId != '668711' || salesRepId != '696160') {
        var franchiseeSalesRepAssigned = nlapiLookupField('customer', parseInt(nlapiGetFieldValue('custpage_customer_id')), 'partner.custentity_sales_rep_assigned');
        if (franchiseeSalesRepAssigned == '668712') {
            salesRepName = 'Belinda Urbani'
        } else if (franchiseeSalesRepAssigned == '668711') {
            salesRepName = 'Lee Russell'
        } else if (franchiseeSalesRepAssigned == '696160') {
            salesRepName = 'Kerina Helliwell'
        }
    }

    console.log('salesRepEmail:' + salesRepEmail);
    console.log('salesRepId:' + salesRepId);
    console.log('salesRepName:' + salesRepName);

    var commReg = '';
    var commencement_date = '';
    var trial_end_date = '';
    var billingStartdate = '';
    var formattedBillingStartToday = '';

    if (invite_to_portal != 'T') {
        var newFiltersCommReg = new Array();
        newFiltersCommReg[newFiltersCommReg.length] = new nlobjSearchFilter(
            'custrecord_commreg_sales_record', null, 'anyof', parseInt(nlapiGetFieldValue('custpage_sales_record_id')));
        newFiltersCommReg[newFiltersCommReg.length] = new nlobjSearchFilter(
            'custrecord_customer', null, 'anyof', nlapiGetFieldValue('custpage_customer_id'));
        newFiltersCommReg[newFiltersCommReg.length] = new nlobjSearchFilter(
            'custrecord_trial_status', null, 'anyof', [10, 9, 2]);

        var commencement_date = null;

        var col = new Array();
        col[0] = new nlobjSearchColumn('internalId');
        col[1] = new nlobjSearchColumn('custrecord_date_entry');
        col[2] = new nlobjSearchColumn('custrecord_sale_type');
        col[3] = new nlobjSearchColumn('custrecord_franchisee');
        col[4] = new nlobjSearchColumn('custrecord_comm_date');
        col[5] = new nlobjSearchColumn('custrecord_in_out');
        col[6] = new nlobjSearchColumn('custrecord_customer');
        col[7] = new nlobjSearchColumn('custrecord_trial_status');
        col[8] = new nlobjSearchColumn('custrecord_comm_date_signup');
        col[9] = new nlobjSearchColumn('custrecord_trial_expiry');


        var comm_reg_results = nlapiSearchRecord(
            'customrecord_commencement_register', null, newFiltersCommReg, col);


        if (!isNullorEmpty(comm_reg_results)) {
            if (comm_reg_results.length == 1) {
                commReg = comm_reg_results[0].getValue('internalid');
                commencement_date = comm_reg_results[0].getValue('custrecord_comm_date')
                trial_end_date = comm_reg_results[0].getValue('custrecord_trial_expiry')
                trial_end_date_split = trial_end_date.split('/');
                billingStartdate = new Date(trial_end_date_split[2] + "-" + trial_end_date_split[1] + "-" + trial_end_date_split[0]);
                billingStartdate.setDate(billingStartdate.getDate() + 1);

                var yyyy = billingStartdate.getFullYear();
                var mm = billingStartdate.getMonth() + 1; // Months start at 0!
                var dd = billingStartdate.getDate();

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                formattedBillingStartToday = dd + '/' + mm + '/' + yyyy;

            } else if (comm_reg_results.length > 1) {

            }
        }
    }



    console.log('commReg:' + commReg);
    console.log('commencement_date:' + commencement_date);
    console.log('trial_end_date:' + trial_end_date);
    console.log('formattedBillingStartToday:' + formattedBillingStartToday);

    var url = 'https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=395&deploy=1&compid=1048144&ns-at=AAEJ7tMQgAVHkxJsbXgGwQQm4xn968o7JJ9-Ym7oanOzCSkWO78&rectype=customer&template=';

    console.log('url:' + url);

    if (!isNullorEmpty(salesRepName)) {
        url += $('#template option:selected').val() + '&recid=' + nlapiGetFieldValue('custpage_customer_id') + '&salesrep=' + franchiseeSalesRepAssigned + '&dear=' + escape(first_name) + '&contactid=' + escape($('#send_to').val()) + '&userid=' + escape(userID) + '&salesRepName=' + salesRepName + '&commdate=' + commencement_date + '&commreg=' + commReg + '&trialenddate=' + trial_end_date + '&billingstartdate=' + formattedBillingStartToday;
    } else {
        url += $('#template option:selected').val() + '&recid=' + nlapiGetFieldValue('custpage_customer_id') + '&salesrep=' + franchiseeSalesRepAssigned + '&dear=' + escape(first_name) + '&contactid=' + escape($('#send_to').val()) + '&userid=' + escape(userID) + '&salesRepName=' + salesRepName + '&commdate=' + commencement_date + '&commreg=' + commReg + '&trialenddate=' + trial_end_date + '&billingstartdate=' + formattedBillingStartToday;
    }


    urlCall = nlapiRequestURL(url);
    var emailHtml = urlCall.getBody();
    var emailSubject = urlCall.getHeader('Custom-Header-SubjectLine');

    console.log(urlCall);
    console.log(subject);
    console.log(emailSubject);

    $('#email_body').summernote('code', emailHtml);
    $('#subject').val(subject);

});

$(document).on('click', '.createservicechg', function (event) {

    var closed_won = 'F';
    var free_trial = 'F';
    var opp_with_value = 'F';
    if ($('#form').is(':checked')) {
        closed_won = 'T'
    }

    if ($('#free_trial').is(':checked')) {
        free_trial = 'T'
    }

    if ($('#quote').is(':checked')) {
        opp_with_value = 'T';
    }

    var save_customer = nlapiGetFieldValue('custpage_save_customer');

    var params = {
        custid: parseInt(nlapiGetFieldValue('custpage_customer_id')),
        salesrecordid: parseInt(nlapiGetFieldValue('custpage_sales_record_id')),
        salesrep: 'F',
        sendemail: 'T',
        closedwon: closed_won,
        free_trial: free_trial,
        oppwithvalue: opp_with_value,
        savecustomer: save_customer,
        commreg: null,
        customid: 'customscript_sl_send_email_module',
        customdeploy: 'customdeploy_sl_send_email_module'
    }
    params = JSON.stringify(params);
    var upload_url = baseURL + nlapiResolveURL('SUITELET', 'customscript_sl_create_service_change', 'customdeploy_sl_create_service_change') + '&custparam_params=' + params;
    window.open(upload_url, "_self", "height=750,width=650,modal=yes,alwaysRaised=yes");

});

function validate() {

    var callback = nlapiGetFieldValue('custpage_callback');
    var outcome = nlapiGetFieldValue('custpage_outcome');
    var referral = nlapiGetFieldValue('custpage_referral');
    var return_value = true;
    var alertMessage = '';


    if (isNullorEmpty(callback) && isNullorEmpty(outcome)) {
        var send_to = $('#send_to').val();
        var template = $('#template').val();
        var subject = $('#subject').val();
        var dear = $('#send_to').attr("data-firstname");
        var body = $('#email_body').summernote('code');
        if (!isNullorEmpty($('#time').val())) {
            var callback_time = onTimeChange($('#time').val());
        } else {
            var callback_time = null;
        }

        var callback_date = $('#date').val();

        console.log($('#time').val());


        if (isNullorEmpty(send_to)) {
            alertMessage += 'Please Select the Contact Person to Send To</br>';
            return_value = false;
        }

        if (isNullorEmpty(template) && send_to != 0) {
            alertMessage += 'Please Select the Template</br>';
            return_value = false;
        }


        if (isNullorEmpty(subject) && send_to != 0) {
            alertMessage += 'Please Enter a Subject</br>';
            return_value = false;
        }

        if (isNullorEmpty(send_to)) {
            alertMessage += 'Please Enter the Email Body</br>';
            return_value = false;
        }

        // if (isNullorEmpty(callback_date) && referral != 'T') {
        //     alertMessage += 'Please Select Call Back Date</br>';
        //     return_value = false;
        // }

        // if (isNullorEmpty(callback_time) && referral != 'T') {
        //     alertMessage += 'Please Select Call Back Time</br>';
        //     return_value = false;
        // }

    } else if (!isNullorEmpty(callback) && isNullorEmpty(outcome) && referral != 'T') {
        var callback_time = onTimeChange($('#time').val());
        var callback_date = $('#date').val();
        if (isNullorEmpty(callback_date) && referral != 'T') {
            alertMessage += 'Please Select Call Back Date</br>';
            return_value = false;
        }

        if (isNullorEmpty(callback_time) && referral != 'T') {
            alertMessage += 'Please Select Call Back Time</br>';
            return_value = false;
        }

        if (isNullorEmpty($('#appointment_type').val()) || $('#appointment_type').val() == 0) {
            alertMessage += 'Please Select Appointment Type';
            return_value = false;
        }
    } else {
        var nosalereason = $('#nosalereason').val();

        if (isNullorEmpty(nosalereason) && referral != 'T') {
            alertMessage += 'Please Select Reason';
            return_value = false;
        }
    }


    if (return_value == false) {
        showAlert(alertMessage);

    }
    return return_value;
}

function onclick_update() {
    nlapiSetFieldValue('custpage_save_record', 'T');
    $('.services_li').removeClass('hide');
    $('.subject_section').addClass('hide');
    $('#dear').addClass('hide');
    $('.body_section').addClass('hide');
    $('.cc_section').addClass('hide');
    $('.template_section').addClass('hide');
    $('#send_to').val(0)
    nlapiSetFieldValue('custpage_to', 0);
    $('#submitter').trigger('click');
}

function saveRecord() {

    console.log($('#send_to').val())
    var result = validate();
    if (result == false) {
        return false;
    }

    var callback = nlapiGetFieldValue('custpage_callback');
    var outcome2 = nlapiGetFieldValue('custpage_outcome');
    var referral = nlapiGetFieldValue('custpage_referral');


    var outcome = '';

    if (isNullorEmpty(callback)) {
        if (isNullorEmpty(outcome2)) {
            outcome = 'sendinfo';
        } else {
            outcome = 'nosale'
        }

        var prod_tracking = $('#prod_tracking').val()
        var send_to = $('#send_to').val()
        var send_cc = $('#send_cc').val()
        var subject = $('#subject').val();
        var dear = $('#send_to').attr("data-firstname");
        var body = $('#email_body').summernote('code');

        if (isNullorEmpty(send_to) && outcome != 'nosale' && send_to != 0) {
            showAlert('Please Enter TO Email Address');
            return false;
        }

        if (isNullorEmpty(subject) && outcome != 'nosale' && send_to != 0) {
            showAlert('Please Enter Subject');
            return false;
        }

        if (isNullorEmpty(body) && outcome != 'nosale' && send_to != 0) {
            showAlert('Please Enter Body of Email');
            return false;
        }

        if (isNullorEmpty(outcome2)) {
            if ($('input#form').is(':checked') && $('input#quote').is(':checked')) {
                outcome = 'sendformquote';
            } else if ($('input#form').is(':checked')) {
                outcome = 'sendform';
            } else if ($('input#quote').is(':checked')) {
                outcome = 'sendquote';
            } else if ($('input#outofterr').is(':checked')) {
                outcome = 'outofterr';
            } else if ($('input#signup').is(':checked')) {
                outcome = 'signupemail';
            } else if ($('input#free_trial').is(':checked')) {
                outcome = 'freetrial';
            }

            var attachments_ids = [];
            var scf_ids = [];
            var sof_ids = [];

            var attachments_elem = document.getElementsByClassName("attachments");
            var scf_elem = document.getElementsByClassName("scf");
            var sof_elem = document.getElementsByClassName("sof");

            for (var i = 0; i < attachments_elem.length; i++) {
                if (attachments_elem[i].checked == true) {
                    attachments_ids[attachments_ids.length] = attachments_elem[i].id;
                }
            }

            for (var i = 0; i < scf_elem.length; i++) {
                if (scf_elem[i].checked == true) {
                    scf_ids[scf_ids.length] = scf_elem[i].id;
                }
            }

            for (var i = 0; i < sof_elem.length; i++) {
                if (sof_elem[i].checked == true) {
                    sof_ids[sof_ids.length] = sof_elem[i].id;
                }
            }

            var attachment_ids_string = attachments_ids.join('|');
            var scf_ids_string = scf_ids.join();
            var sof_ids_string = sof_ids.join();

            nlapiSetFieldValue('custpage_attachments', attachment_ids_string);

        }

        console.log(send_to);
        nlapiSetFieldValue('custpage_mp_tracking', prod_tracking);
        nlapiSetFieldValue('custpage_to', send_to);
        nlapiSetFieldValue('custpage_cc', send_cc);
        nlapiSetFieldValue('custpage_subject', subject);
        nlapiSetFieldValue('custpage_dear', dear);
        nlapiSetFieldValue('custpage_body', body);



        // nlapiSetFieldValue('custpage_scf', scf_ids_string);
        // nlapiSetFieldValue('custpage_sof', sof_ids_string);

    } else {
        outcome = 'callback';
    }

    if (referral != 'T') {
        if (isNullorEmpty(outcome2)) {
            var callback_time = onTimeChange($('#time').val());
            var callback_endtime = onTimeChange($('#endtime').val());
            var callback_date = $('#date').val();
            var callback_notes = $('#notes').val();
            var callback_type = $('#appointment_type').val();
            console.log('callback_date: ' + callback_date);
            if (!isNullorEmpty(callback_date)) {
                var splitDate = callback_date.split('-');
                callback_date = splitDate[2] + '/' + splitDate[1] + '/' + splitDate[0];

                nlapiSetFieldValue('custpage_callbackdate', callback_date);
                nlapiSetFieldValue('custpage_callbacktime', callback_time);
                nlapiSetFieldValue('custpage_callbackendtime', callback_endtime);
                nlapiSetFieldValue('custpage_callnotes', callback_notes);
                nlapiSetFieldValue('custpage_calltype', callback_type);

                outcome = 'setappointment';

            } else {
                nlapiSetFieldValue('custpage_callbackdate', null);
                nlapiSetFieldValue('custpage_callbacktime', null);
                nlapiSetFieldValue('custpage_callnotes', null);
                nlapiSetFieldValue('custpage_calltype', null);
            }

            nlapiSetFieldValue('custpage_outcome', outcome);
        } else {
            var nosale_notes = $('#nosalenotes').val();
            nlapiSetFieldValue('custpage_callnotes', nosale_notes);
            nlapiSetFieldValue('custpage_outcome', 'nosale');
            nlapiSetFieldValue('custpage_nosalereason', $('#nosalereason').val());
        }
    } else {
        nlapiSetFieldValue('custpage_callbackdate', getDate());
        nlapiSetFieldValue('custpage_outcome', outcome);
    }
    // alert(nlapiGetFieldValue('custpage_outcome'))



    return true;

}

function onclick_back() {

    var upload_url = baseURL + nlapiResolveURL('SUITELET', nlapiGetFieldValue('custpage_suitlet'), nlapiGetFieldValue('custpage_deploy')) + '&callcenter=T&recid=' + parseInt(nlapiGetFieldValue('custpage_customer_id')) + '&sales_record_id=' + parseInt(nlapiGetFieldValue('custpage_sales_record_id'));
    window.open(upload_url, "_self", "height=750,width=650,modal=yes,alwaysRaised=yes");
}

/**
 * [description] - On the click of the edit button
 */
$(document).on('click', '.edit_class', function (event) {

    var commregid = $(this).attr('data-commreg');
    var dateEffective = $(this).attr('data-dateeffective');

    var closed_won = 'F';
    var opp_with_value = 'F';
    var free_trial = 'F'
    if ($('#form').is(':checked')) {
        closed_won = 'T'
    }

    if ($('#free_trial').is(':checked')) {
        free_trial = 'T';
    }

    if ($('#quote').is(':checked')) {
        opp_with_value = 'T';
    }

    var params = {
        custid: parseInt(nlapiGetFieldValue('custpage_customer_id')),
        salesrecordid: parseInt(nlapiGetFieldValue('custpage_sales_record_id')),
        salesrep: 'F',
        sendemail: 'T',
        commreg: commregid,
        date: dateEffective,
        closedwon: closed_won,
        oppwithvalue: opp_with_value,
        free_trial: free_trial,
        customid: 'customscript_sl_send_email_module',
        customdeploy: 'customdeploy_sl_send_email_module'
    }
    params = JSON.stringify(params);
    var upload_url = baseURL + nlapiResolveURL('SUITELET', 'customscript_sl_create_service_change', 'customdeploy_sl_create_service_change') + '&custparam_params=' + params;
    window.open(upload_url, "_self", "height=750,width=650,modal=yes,alwaysRaised=yes");
});

function onclick_preview(url) {

    $('#myModal .modal-header').html('<div class="form-group"><h4><label class="control-label" for="inputError1">Attachment Preview!!</label></h4></div>');
    $('#myModal .modal-body').html("");
    $('#myModal .modal-body').html('<iframe id="viewer" frameborder="0" scrolling="no" width="400" height="600" src="' + url + '"></iframe>');
    $('#myModal').modal("show");
}

function preview(custId, email, dear, attachments) {


    var recCustomer = nlapiLoadRecord('customer', custId);

    var service1 = null;
    var price1 = null;
    var service2 = null;
    var price2 = null;
    var service3 = null;
    var price3 = null;
    var service4 = null;
    var price4 = null;
    var service5 = null;
    var price5 = null;
    var service6 = null;
    var price6 = null;
    var dailytotal = 0.00;

    for (n = 1; n <= recCustomer.getLineItemCount('itempricing'); n++) {
        if (isNullorEmpty(service1)) {
            service1 = recCustomer.getLineItemValue('itempricing', 'item', n);
            price1 = recCustomer.getLineItemValue('itempricing', 'price', n);
            dailytotal += parseFloat(price1);
        } else if (isNullorEmpty(service2)) {
            service2 = recCustomer.getLineItemValue('itempricing', 'item', n);
            price2 = recCustomer.getLineItemValue('itempricing', 'price', n);
            dailytotal += parseFloat(price2);
        } else if (isNullorEmpty(service3)) {
            service3 = recCustomer.getLineItemValue('itempricing', 'item', n);
            price3 = recCustomer.getLineItemValue('itempricing', 'price', n);
            dailytotal += parseFloat(price3);
        } else if (isNullorEmpty(service4)) {
            service4 = recCustomer.getLineItemValue('itempricing', 'item', n);
            price4 = recCustomer.getLineItemValue('itempricing', 'price', n);
            dailytotal += parseFloat(price4);
        } else if (isNullorEmpty(service5)) {
            service5 = recCustomer.getLineItemValue('itempricing', 'item', n);
            price5 = recCustomer.getLineItemValue('itempricing', 'price', n);
            dailytotal += parseFloat(price5);
        } else if (isNullorEmpty(service6)) {
            service6 = recCustomer.getLineItemValue('itempricing', 'item', n);
            price6 = recCustomer.getLineItemValue('itempricing', 'price', n);
            dailytotal += parseFloat(price6);
        }
    }
    dailytotal = (dailytotal);

    var postaladdress = '';
    var siteaddress = '';
    var siteaddressfull = '';
    var billaddressfull = '';
    var SOpostaladdress = '';
    var SOpostalcity = '';

    for (p = 1; p <= recCustomer.getLineItemCount('addressbook'); p++) {
        if (isNullorEmpty(postaladdress) && recCustomer.getLineItemValue('addressbook', 'isresidential', p) == "T") {
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr1', p))) {
                postaladdress += recCustomer.getLineItemValue('addressbook', 'addr1', p) + '\n';
                SOpostaladdress += recCustomer.getLineItemValue('addressbook', 'addr1', p) + ' ';
            }
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr2', p))) {
                postaladdress += recCustomer.getLineItemValue('addressbook', 'addr2', p) + '\n';
                SOpostaladdress += recCustomer.getLineItemValue('addressbook', 'addr2', p);
            }
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'city', p))) {
                postaladdress += recCustomer.getLineItemValue('addressbook', 'city', p) + ' ';
                SOpostalcity += recCustomer.getLineItemValue('addressbook', 'city', p);
            }
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'state', p))) {
                postaladdress += recCustomer.getLineItemValue('addressbook', 'state', p) + ' ';
            }
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'zip', p))) {
                postaladdress += recCustomer.getLineItemValue('addressbook', 'zip', p);
            }
        }
        if (isNullorEmpty(siteaddress) && recCustomer.getLineItemValue('addressbook', 'defaultshipping', p) == "T") {
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr1', p))) {
                siteaddress += recCustomer.getLineItemValue('addressbook', 'addr1', p) + '  ';
                siteaddressfull += recCustomer.getLineItemValue('addressbook', 'addr1', p) + '\n';
            }
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr2', p))) {
                siteaddress += recCustomer.getLineItemValue('addressbook', 'addr2', p) + '  ';
                siteaddressfull += recCustomer.getLineItemValue('addressbook', 'addr2', p) + '\n';
            }
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'city', p))) {
                siteaddress += recCustomer.getLineItemValue('addressbook', 'city', p) + ' ';
                siteaddressfull += recCustomer.getLineItemValue('addressbook', 'city', p) + ' ';
            }
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'state', p))) {
                siteaddress += recCustomer.getLineItemValue('addressbook', 'state', p) + ' ';
                siteaddressfull += recCustomer.getLineItemValue('addressbook', 'state', p) + ' ';
            }
            if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'zip', p))) {
                siteaddress += recCustomer.getLineItemValue('addressbook', 'zip', p);
                siteaddressfull += recCustomer.getLineItemValue('addressbook', 'zip', p);
            }
        }
        if (isNullorEmpty(billaddressfull) && recCustomer.getLineItemValue('addressbook', 'defaultbilling', p) == "T") {
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
    merge['NLSCPOSTADDRESS'] = postaladdress;
    merge['NLSCSHIPADDRESS'] = siteaddressfull;
    merge['NLSCBILLADDRESS'] = billaddressfull;
    merge['NLSCSTARTDATE'] = '';

    var rowsHtml = '';
    var outgoing = false;
    var pickup = false;
    var banking = false;
    var h2h = false;
    var othersvc = false;

    var quotedservices = '';


    if (!isNullorEmpty(service1)) {
        rowsHtml += "<tr><td width='429' style='width:428.9pt;border:solid white 2.25pt;border-top:none;padding:3.0pt 3.0pt 3.0pt 3.0pt'>";
        rowsHtml += "<p><span style='font-size:10.0pt;font-family:Helvetica'>" + service1 + "</span></p></td>";
        rowsHtml += "<td width='107' style='width:107.2pt;border-top:none;border-left:none;border-bottom:solid white 2.25pt;border-right:solid white 2.25pt;padding:3.0pt 3.0pt 3.0pt 3.0pt'>";
        rowsHtml += "<p align='center' style='text-align:center'><span style='font-size:10.0pt;font-family:Helvetica'>$ " + (price1) + "</span></p></td></tr>";

        if (startsWith(service1, "Pick up")) {
            pickup = true;
        } else if (startsWith(service1, "Outgoing")) {
            outgoing = true;
        } else if (service1.indexOf('Banking') > -1) {
            banking = true;
        } else if (service1.indexOf('Hand') > -1) {
            h2h = true;
        } else {
            othersvc = true;
        }
    }
    if (!isNullorEmpty(service2)) {
        rowsHtml += "<tr><td width='429' style='width:428.9pt;border:solid white 2.25pt;border-top:none;padding:3.0pt 3.0pt 3.0pt 3.0pt'>";
        rowsHtml += "<p><span style='font-size:10.0pt;font-family:Helvetica'>" + service2 + "</span></p></td>";
        rowsHtml += "<td width='107' style='width:107.2pt;border-top:none;border-left:none;border-bottom:solid white 2.25pt;border-right:solid white 2.25pt;padding:3.0pt 3.0pt 3.0pt 3.0pt'>";
        rowsHtml += "<p align='center' style='text-align:center'><span style='font-size:10.0pt;font-family:Helvetica'>$ " + (price2) + "</span></p></td></tr>";

        if (startsWith(service2, "Pick up")) {
            pickup = true;
        } else if (startsWith(service2, "Outgoing")) {
            outgoing = true;
        } else if (service2.indexOf('Banking') > -1) {
            banking = true;
        } else if (service2.indexOf('Hand') > -1) {
            h2h = true;
        } else {
            othersvc = true;
        }
    }
    if (!isNullorEmpty(service3)) {
        rowsHtml += "<tr><td width='429' style='width:428.9pt;border:solid white 2.25pt;border-top:none;padding:3.0pt 3.0pt 3.0pt 3.0pt'>";
        rowsHtml += "<p><span style='font-size:10.0pt;font-family:Helvetica'>" + service3 + "</span></p></td>";
        rowsHtml += "<td width='107' style='width:107.2pt;border-top:none;border-left:none;border-bottom:solid white 2.25pt;border-right:solid white 2.25pt;padding:3.0pt 3.0pt 3.0pt 3.0pt'>";
        rowsHtml += "<p align='center' style='text-align:center'><span style='font-size:10.0pt;font-family:Helvetica'>$ " + (price3) + "</span></p></td></tr>";

        if (startsWith(service3, "Pick up")) {
            pickup = true;
        } else if (startsWith(service3, "Outgoing")) {
            outgoing = true;
        } else if (service3.indexOf('Banking') > -1) {
            banking = true;
        } else if (service3.indexOf('Hand') > -1) {
            h2h = true;
        } else {
            othersvc = true;
        }
    }
    if (!isNullorEmpty(service4)) {
        rowsHtml += "<tr><td width='429' style='width:428.9pt;border:solid white 2.25pt;border-top:none;padding:3.0pt 3.0pt 3.0pt 3.0pt'>";
        rowsHtml += "<p><span style='font-size:10.0pt;font-family:Helvetica'>" + service4 + "</span></p></td>";
        rowsHtml += "<td width='107' style='width:107.2pt;border-top:none;border-left:none;border-bottom:solid white 2.25pt;border-right:solid white 2.25pt;padding:3.0pt 3.0pt 3.0pt 3.0pt'>";
        rowsHtml += "<p align='center' style='text-align:center'><span style='font-size:10.0pt;font-family:Helvetica'>$ " + (price4) + "</span></p></td></tr>";

        if (startsWith(service4, "Pick up")) {
            pickup = true;
        } else if (startsWith(service4, "Outgoing")) {
            outgoing = true;
        } else if (service4.indexOf('Banking') > -1) {
            banking = true;
        } else if (service4.indexOf('Hand') > -1) {
            h2h = true;
        } else {
            othersvc = true;
        }
    }
    if (!isNullorEmpty(service5)) {
        rowsHtml += "<tr><td width='429' style='width:428.9pt;border:solid white 2.25pt;border-top:none;padding:3.0pt 3.0pt 3.0pt 3.0pt'>";
        rowsHtml += "<p><span style='font-size:10.0pt;font-family:Helvetica'>" + service5 + "</span></p></td>";
        rowsHtml += "<td width='107' style='width:107.2pt;border-top:none;border-left:none;border-bottom:solid white 2.25pt;border-right:solid white 2.25pt;padding:3.0pt 3.0pt 3.0pt 3.0pt'>";
        rowsHtml += "<p align='center' style='text-align:center'><span style='font-size:10.0pt;font-family:Helvetica'>$ " + (price5) + "</span></p></td></tr>";

        if (startsWith(service5, "Pick up")) {
            pickup = true;
        } else if (startsWith(service5, "Outgoing")) {
            outgoing = true;
        } else if (service5.indexOf('Banking') > -1) {
            banking = true;
        } else if (service5.indexOf('Hand') > -1) {
            h2h = true;
        } else {
            othersvc = true;
        }
    }
    if (!isNullorEmpty(service6)) {
        rowsHtml += "<tr><td width='429' style='width:428.9pt;border:solid white 2.25pt;border-top:none;padding:3.0pt 3.0pt 3.0pt 3.0pt'>";
        rowsHtml += "<p><span style='font-size:10.0pt;font-family:Helvetica'>" + service6 + "</span></p></td>";
        rowsHtml += "<td width='107' style='width:107.2pt;border-top:none;border-left:none;border-bottom:solid white 2.25pt;border-right:solid white 2.25pt;padding:3.0pt 3.0pt 3.0pt 3.0pt'>";
        rowsHtml += "<p align='center' style='text-align:center'><span style='font-size:10.0pt;font-family:Helvetica'>$ " + (price6) + "</span></p></td></tr>";

        if (startsWith(service6, "Pick up")) {
            pickup = true;
        } else if (startsWith(service6, "Outgoing")) {
            outgoing = true;
        } else if (service6.indexOf('Banking') > -1) {
            banking = true;
        } else if (service6.indexOf('Hand') > -1) {
            h2h = true;
        } else {
            othersvc = true;
        }
    }

    console.log('after services')


    var docHTML = nlapiLookupField('customrecord_html_layout', 5, 'custrecord_html_body');

    console.log('load html layout')

    if (pickup) {
        quotedservices += 'pick up and delivery';
    }
    if (outgoing) {
        if (quotedservices != '') {
            if (!banking && !h2h) {
                quotedservices += " and ";
            } else {
                quotedservices += ', ';
            }
        }
        quotedservices += 'outgoing mail lodgement';
    }
    if (h2h) {
        if (quotedservices != '') {
            if (!banking) {
                quotedservices += " and ";
            } else {
                quotedservices += ', ';
            }
        }
        quotedservices += 'hand to hand delivery';
    }
    if (banking) {
        if (quotedservices != '') {
            quotedservices += " and ";
        }
        quotedservices += 'banking';
    }

    var expressorstationery = '';

    if (attachments.indexOf('55') > -1) {
        expressorstationery += 'express mail';
    }
    if (attachments.indexOf('55') > -1) {
        if (expressorstationery.length > 0) {
            expressorstationery += ' and '
        }

        expressorstationery += 'stationery';
    }
    if (expressorstationery == "") expressorstationery = 'other';

    docHTML = docHTML.replace('{DATE}', getDate());
    docHTML = docHTML.replace('{COMPANYNAME}', recCustomer.getFieldValue('companyname'));
    docHTML = docHTML.replace('{EMAIL}', email);
    docHTML = docHTML.replace('{QUOTEDSERVICES}', quotedservices);
    docHTML = docHTML.replace('{CONTACTFIRST}', dear);
    docHTML = docHTML.replace('{TABLEROWS}', rowsHtml);
    docHTML = docHTML.replace('{DAILYTOTAL}', dailytotal);
    docHTML = docHTML.replace('{EXPRESSORSTATIONERY}', expressorstationery);
    docHTML = docHTML.replace('{SALESPERSON}', nlapiGetContext().getName());

    return docHTML;

}

function getDate() {
    var date = new Date();
    if (date.getHours() > 6) {
        date = nlapiAddDays(date, 1);
    }
    date = nlapiDateToString(date);
    return date;
}


function startsWith(strString, strCheck) {
    return strString.substring(0, strCheck.length) === strCheck;
}


function AddStyle(cssLink, pos) {
    var tag = document.getElementsByTagName(pos)[0];
    var addLink = document.createElement('link');
    addLink.setAttribute('type', 'text/css');
    addLink.setAttribute('rel', 'stylesheet');
    addLink.setAttribute('href', cssLink);
    tag.appendChild(addLink);
}

function onTimeChange(value) {
    if (!isNullorEmpty(value)) {
        var timeSplit = value.split(':'),
            hours,
            minutes,
            meridian;
        hours = timeSplit[0];
        minutes = timeSplit[1];
        if (hours > 12) {
            meridian = 'PM';
            hours -= 12;
        } else if (hours < 12) {
            meridian = 'AM';
            if (hours == 0) {
                hours = 12;
            }
        } else {
            meridian = 'PM';
        }
        return (hours + ':' + minutes + ' ' + meridian);
    } else {
        return null;
    }

}

function convertTo24Hour(time) {
    var hours_string = (time.substr(0, 2));
    var hours = parseInt(time.substr(0, 2));
    if (time.indexOf('AM') != -1 && hours == 12) {
        time = time.replace('12', '0');
    }
    // if (time.indexOf('AM') != -1 && hours < 10) {
    // 	time = time.replace(hours, ('0' + hours));
    // }
    if (time.indexOf('PM') != -1 && hours < 12) {
        console.log(hours + 12)
        time = time.replace(hours_string, (hours + 12));
    }
    return time.replace(/( AM| PM)/, '');
}