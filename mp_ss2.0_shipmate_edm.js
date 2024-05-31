/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * Author:               Ankith Ravindran
 * Created on:           Thu Nov 09 2023
 * Modified on:          Thu Nov 09 2023 08:36:41
 * SuiteScript Version:  2.0
 * Description:         Send Emails out to all contacts about the new ShipMate portal.
 *
 * Copyright (c) 2023 MailPlus Pty. Ltd.
 */



define(['N/runtime', 'N/search', 'N/record', 'N/log', 'N/task', 'N/currentRecord', 'N/format', 'N/https', 'N/email', 'N/url'],
    function (runtime, search, record, log, task, currentRecord, format, https, email, url) {

        var zee = 0;
        var role = runtime.getCurrentUser().role;

        var baseURL = 'https://1048144.app.netsuite.com';
        if (runtime.envType == "SANDBOX") {
            baseURL = 'https://system.sandbox.netsuite.com';
        }

        function main() {

            var today = new Date();
            today.setHours(today.getHours() + 17);

            //NetSuite Search: All Customer Signed Contacts - With Emails V2
            var allCustomerSignedContactsWithEmailsSearch = search.load({
                type: 'contact',
                id: 'customsearch_contacts_mpex_contacts_2__3'
            });

            var count = allCustomerSignedContactsWithEmailsSearch.runPaged().count;

            log.debug({
                title: 'count',
                details: count
            });
            sendEmails(allCustomerSignedContactsWithEmailsSearch);

        }

        function sendEmails(allCustomerSignedContactsWithEmailsSearch) {

            allCustomerSignedContactsWithEmailsSearch.run().each(function (
                allCustomerSignedContactsWithEmailsSearchResultSet) {

                var customerInternalId = allCustomerSignedContactsWithEmailsSearchResultSet.getValue({
                    name: "internalid",
                    join: "customer",
                });

                var contact_id = allCustomerSignedContactsWithEmailsSearchResultSet.getValue({
                    name: "internalid",
                });

                var contact_email = allCustomerSignedContactsWithEmailsSearchResultSet.getValue({
                    name: "email",
                });

                var suiteletUrl = url.resolveScript({
                    scriptId: 'customscript_merge_email',
                    deploymentId: 'customdeploy_merge_email',
                    returnExternalUrl: true
                });
                suiteletUrl += '&rectype=customer&template=202';
                suiteletUrl += '&recid=' + customerInternalId + '&salesrep=' + null + '&dear=' + '' + '&contactid=' + contact_id;

                var response = https.get({
                    url: suiteletUrl
                });

                var emailHtml = response.body;

                //Email subject
                var subject =
                    'An important MailPlus update: NEW ShipMate';

                //Send email to the Sales Rep
                email.send({
                    author: 112209,
                    recipients: contact_email,
                    subject: subject,
                    body: emailHtml,
                    relatedRecords: { entityId: customerInternalId }
                });

                // var contactRecord = record.load({
                //     type: record.Type.CONTACT,
                //     id: parseInt(contact_id),
                //     isDynamic: true
                // });

                // contactRecord.setValue({
                //     fieldId: 'custentity_email_sent',
                //     value: 1
                // });

                // contactRecord.save();

                // var reschedule = task.create({
                //     taskType: task.TaskType.SCHEDULED_SCRIPT,
                //     scriptId: 'customscript_ss2_shipmate_edm',
                //     deploymentId: 'customdeploy2',
                //     params: null
                // });

                // log.debug({ title: 'Attempting: Rescheduling Script', details: reschedule });
                // var reschedule_id = reschedule.submit();

                // count++;
                return true;
            });
        }

        function isNullorEmpty(val) {
            if (val == '' || val == null) {
                return true;
            } else {
                return false;
            }
        }

        return {
            execute: main
        };
    });
