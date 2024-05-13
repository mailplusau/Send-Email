/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet

 * Author:               Ankith Ravindran
 * Created on:           Fri May 10 2024
 * Modified on:          Fri May 10 2024 13:41:30
 * SuiteScript Version:   
 * Description:           
 *
 * Copyright (c) 2024 MailPlus Pty. Ltd.
 */



define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record', 'N/https', 'N/log', 'N/redirect', 'N/url', 'N/format'],
    function (ui, email, runtime, search, record, https, log, redirect, url, format) {
        var role = 0;
        var userId = 0;
        var zee = 0;
        var parentLPOInternalId = 0;
        var custStatus = 0;
        var salesCampaign = 0;
        var source = 0;
        var paramUserId = 0;

        function onRequest(context) {

            var baseURL = 'https://system.na2.netsuite.com';
            if (runtime.EnvType == "SANDBOX") {
                baseURL = 'https://system.sandbox.netsuite.com';
            }
            userId = runtime.getCurrentUser().id;

            role = runtime.getCurrentUser().role;

            if (context.request.method === 'GET') {

                var form = ui.createForm({
                    title: 'Franchisee Mass Communication - Report'
                });

                var inlineHtml =
                    '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.16/css/jquery.dataTables.css"><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><script src="https://cdn.datatables.net/searchpanes/1.2.1/js/dataTables.searchPanes.min.js"><script src="https://cdn.datatables.net/select/1.3.3/js/dataTables.select.min.js"></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/drilldown.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/export-data.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script><style>.mandatory{color:red;} .body{background-color: #CFE0CE !important;} @-webkit-keyframes animatetop {from {top:-300px; opacity:0} to {top:0; opacity:1}}@keyframes animatetop {from {top:-300px; opacity:0}to {top:0; opacity:1}} .wrapper{position:fixed;height:2em;width:2em;overflow:show;margin:auto;top:0;left:0;bottom:0;right:0;justify-content: center; align-items: center; display: -webkit-inline-box;} .ball{width: 22px; height: 22px; border-radius: 11px; margin: 0 10px; animation: 2s bounce ease infinite;} .blue{background-color: #0f3d39; }.red{background-color: #095C7B; animation-delay: .25s;}.yellow{background-color: #387081; animation-delay: .5s}.green{background-color: #d0e0cf; animation-delay: .75s}@keyframes bounce{50%{transform: translateY(25px);}}</style>';

                inlineHtml += '<table id="zee_table" class="table table-responsive table-striped customer tablesorter" style="width: 100%;">';
                inlineHtml += '<thead style="color: white;background-color: #095C7B;">';
                inlineHtml += '<tr class="text-center">';
                inlineHtml += '<td><b>Internal ID</b></td>'
                inlineHtml += '<td><b>Franchisee</b></td>'
                inlineHtml += '<td><b>Lead Campaign</b></td>'
                inlineHtml += '<td><b>LPO</b></td>'
                inlineHtml += '<td><b>Premium</b></td>'
                inlineHtml += '<td><b>Buy Customers</b></td>'
                inlineHtml += '<td><b>Call with Chris</b></td>'
                inlineHtml += '</tr>';
                inlineHtml += '</thead>';

                inlineHtml += '<tbody>';



                //Search: Active Franchisees - Mass Emails Interacted
                var zeeMassCommsReportSearch = search.load({
                    id: 'customsearch8781',
                    type: 'partner'
                });

                zeeMassCommsReportSearch.run().each(function (
                    searchResult) {

                    var zeeInternalId = searchResult.getValue({
                        name: "internalid"
                    });
                    var zeeName = searchResult.getValue({
                        name: "companyname"
                    });
                    var buttonClickedJSON = searchResult.getValue({
                        name: "custentity_zee_mass_email"
                    });

                    parsedButtonClickedJSON = JSON.parse(buttonClickedJSON);

                    inlineHtml += '<tr class="text-center">';
                    inlineHtml += '<td>' + zeeInternalId + '</td>'
                    inlineHtml += '<td>' + zeeName + '</td>'
                    inlineHtml += '<td>' + parsedButtonClickedJSON[0].leadcampaigncount + '</td>'
                    inlineHtml += '<td>' + parsedButtonClickedJSON[0].lpocount + '</td>'
                    inlineHtml += '<td>' + parsedButtonClickedJSON[0].premiumcount + '</td>'
                    inlineHtml += '<td>' + parsedButtonClickedJSON[0].buycustomerscount + '</td>'
                    inlineHtml += '<td>' + parsedButtonClickedJSON[0].callwithchriscount + '</td>'
                    inlineHtml += '</tr>';

                    return true;
                });

                inlineHtml += '</tbody></table>';

                form.addField({
                    id: 'preview_table',
                    label: 'inlinehtml',
                    type: 'inlinehtml'
                }).updateLayoutType({
                    layoutType: ui.FieldLayoutType.STARTROW
                }).defaultValue = inlineHtml;
                form.clientScriptFileId = 6951522;

                context.response.writePage(form);

            }

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

        function isNullorEmpty(val) {
            if (val == '' || val == null) {
                return true;
            } else {
                return false;
            }
        }
        return {
            onRequest: onRequest
        };
    });