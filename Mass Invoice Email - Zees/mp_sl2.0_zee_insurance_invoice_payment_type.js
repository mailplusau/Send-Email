/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet

 * Author:               Ankith Ravindran
 * Created on:           Fri Jul 26 2024
 * Modified on:          Fri Jul 26 2024 09:21:04
 * SuiteScript Version:  2.0 
 * Description:          Payment Type Select by Franchisee for the Franchisee Insurance Invoice. 
 *
 * Copyright (c) 2024 MailPlus Pty. Ltd.
 */



define(['N/runtime', 'N/http', 'N/https', 'N/log', 'N/url', 'N/email',
    'N/record', 'N/format', 'N/file', 'N/search', 'N/ui/serverWidget'
], function (runtime, http, https, log,
    url, email, record, format, file, search, ui) {
    function onRequest(context) {

        var role = runtime.getCurrentUser().role;


        log.debug({
            title: "context.request.parameters",
            details: context.request.parameters
        });

        var franchiseeCustomerInternalId = context.request.parameters.custinternalid;
        var paymentType = context.request.parameters.payment;

        //
        var franchiseeCustomerRecord = record.load({
            type: 'customer',
            id: franchiseeCustomerInternalId,
        });

        var franchiseeCustomerEmail = franchiseeCustomerRecord.getValue({
            fieldId: 'email'
        })

        log.debug({
            title: "franchiseeCustomerInternalId",
            details: franchiseeCustomerInternalId
        });
        log.debug({
            title: "paymentType",
            details: paymentType
        });
        log.debug({
            title: "franchiseeCustomerEmail",
            details: franchiseeCustomerEmail
        });


        //Search: Active Franchisees
        var activeFranchiseesSearch = search.load({
            id: 'customsearch_smc_franchisee',
            type: 'partner'
        });

        activeFranchiseesSearch.filters.push(search.createFilter({
            name: 'email',
            join: null,
            operator: search.Operator.IS,
            values: franchiseeCustomerEmail
        }));

        var count = 0;

        activeFranchiseesSearch.run().each(function (
            searchResult) {

            var zeeInternalId = searchResult.getValue({
                name: "internalid"
            });

            var franchiseeRecord = record.load({
                type: record.Type.PARTNER,
                id: zeeInternalId,
            });

            franchiseeRecord.setValue({
                fieldId: 'custentity_insurance_inv_payment_type',
                value: paymentType
            });

            franchiseeRecord.setValue({
                fieldId: 'custentity_insurance_inv_date_payment',
                value: getDate()
            });

            franchiseeRecord.save();
            
            count++;
            return true;
        });

        if (count > 0) {
            var form = ui.createForm({
                title: 'Payment Type has been submitted to the Finance Team'
            });
        } else {
            var form = ui.createForm({
                title: 'Payment Type has not been submitted to the Finance Team'
            });
        }

        context.response.writePage(form);
    }

    function isNullorEmpty(strVal) {
        return (strVal == null || strVal == '' || strVal == 'null' || strVal ==
            undefined || strVal == 'undefined' || strVal == '- None -' ||
            strVal ==
            '0');
    }

    function dateISOToNetsuite(date_iso) {
        var date_netsuite = '';
        if (!isNullorEmpty(date_iso)) {
            var date_utc = new Date(date_iso);
            // var date_netsuite = nlapiDateToString(date_utc);
            var date_netsuite = format.format({
                value: date_utc,
                type: format.Type.DATE
            });
        }
        return date_netsuite;
    }


    /**
     * retrieve date
     */
    function getDate() {
        var date = new Date();
        if (date.getHours() > 6) {
            date.setDate(date.getDate() + 1);
        }

        format.format({
            value: date,
            type: format.Type.DATE,
            timezone: format.Timezone.AUSTRALIA_SYDNEY
        })

        return date;
    }

    Date.prototype.addHours = function (h) {
        this.setHours(this.getHours() + h);
        return this;
    }

    return {
        onRequest: onRequest
    };
});

