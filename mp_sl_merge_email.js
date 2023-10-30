/**
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2022-02-07T10:22:36+11:00
 * @Filename: mp_sl_merge_email.js
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-02-07T10:46:34+11:00
 */



var ctx = nlapiGetContext();

function main(request, response) {
    if (request.getMethod() == "GET") {
        var templateId = request.getParameter('template');
        var recType = request.getParameter('rectype');
        var recId = request.getParameter('recid');
        var salesRep = request.getParameter('salesrep');
        var addressee = request.getParameter('dear');
        var contactID = request.getParameter('contactid');
        var salesTitle = request.getParameter('title');
        var userID = request.getParameter('userid');
        var fields = request.getParameter('fields');
        var zeeleadid = request.getParameter('zeeleadid');
        var commdate = request.getParameter('commdate');
        var trialEndDate = request.getParameter('trialenddate');
        var salesRepName = request.getParameter('salesRepName');
        var emailHtml = '';
        var subject = '';

        nlapiLogExecution('DEBUG', 'commdate', commdate);

        if (!isNullorEmpty(templateId)) {
            var recCommTemp = nlapiLoadRecord('customrecord_camp_comm_template',
                templateId);
            templateId = recCommTemp.getFieldValue(
                'custrecord_camp_comm_email_template');
            subject = recCommTemp.getFieldValue('custrecord_camp_comm_subject');
            var sms = recCommTemp.getFieldValue('custrecord_camp_comm_sms_template');

            var file = nlapiCreateEmailMerger(templateId);
            nlapiLogExecution('DEBUG', 'recId', recId);
            if (recId != 'null' && !isNullorEmpty(recId)) {
                file.setEntity('customer', recId);
            }

            nlapiLogExecution('DEBUG', 'USer ID', userID);
            file.setEntity('employee', userID);
            if (!isNullorEmpty(contactID) && contactID != 0) {
                if (contactID != 'null') {
                    file.setEntity('contact', contactID);
                }

            }

            var mergeResult = file.merge();

            emailHtml = mergeResult.getBody();
            subject = mergeResult.getSubject();


            if (!isNullorEmpty(templateId) && !isNullorEmpty(recType) && !
                isNullorEmpty(recId)) {
                var arrMergeFields = [];
                if (!isNullorEmpty(fields) || !isNullorEmpty(addressee) || !
                    isNullorEmpty(salesRep)) {
                    if (!isNullorEmpty(fields)) {
                        var arrFields = fields.split(',');
                        for (x = 0; x < arrFields.length; x += 2) {
                            arrMergeFields[arrFields[x]] = arrFields[x + 1];
                        }
                    }
                    arrMergeFields['NLEMSALESPERSON'] = !isNullorEmpty(salesRep) ?
                        salesRep : '';
                    arrMergeFields['NLEMCONTACT'] = !isNullorEmpty(addressee) ? addressee :
                        '';
                }

                // var file = nlapiMergeRecord(templateId, recType, recId, null, null, arrMergeFields);


                // set variables in email
                // emailHtml = emailHtml.replace(/<NLEMCONTACT>/gi,addressee);
                nlapiLogExecution('AUDIT', 'templateId', templateId)
                if (templateId == 286) {
                    var customer_record = nlapiLoadRecord('customer', recId);
                    var entityid = customer_record.getFieldValue('entityid');
                    var last5_entityid = entityid.substr(entityid.length - 5)
                    emailHtml = emailHtml.replace(/<NLEMREFERRALCODE>/gi, 'SPREADTHELOVE' +
                        last5_entityid);
                }

                if (templateId == 329) {
                    var owner_button =
                        '<td align="center" class="mcnButtonContent" style="font-family: Arial;font-size: 16px;padding: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" valign="middle"><a class="mcnButton " href="https://mailplus.com.au/become-a-franchisee-owner-operator-survey/?zeeleadid=' +
                        zeeleadid +
                        '" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Survey ">Survey </a></td>';
                    emailHtml = emailHtml.replace(/<NLEMSURVEYBUTTON>/gi, owner_button);
                }

                if (templateId == 328) {
                    var investor_button =
                        '<td align="center" class="mcnButtonContent" style="font-family: Arial;font-size: 16px;padding: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" valign="middle"><a class="mcnButton " href="https://mailplus.com.au/become-a-franchisee-investor-survey/?zeeleadid=' +
                        zeeleadid +
                        '" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Survey ">Survey </a></td>';
                    emailHtml = emailHtml.replace(/<NLEMSURVEYBUTTON>/gi, investor_button);
                }

                if (templateId == 219 || templateId == 371 || templateId == 372) {
                    var customer_record = nlapiLoadRecord('customer', recId);
                    var entityid = customer_record.getFieldValue('entityid');
                    var companyname = customer_record.getFieldValue('companyname');

                    var recContact = nlapiLoadRecord('contact', contactID);

                    var contactEmail = recContact.getFieldValue('email');
                    var contactPhone = recContact.getFieldValue('phone');
                    var firstname = recContact.getFieldValue('firstname')

                    var expInterest = '<a class="mcnButton " href="https://mailplus.com.au/shipping-portal-orientation/?custinternalid=' + recId + '&custname=' + companyname + '&email=' + contactEmail + '&phone=' + contactPhone + '&firstname=' + firstname + '" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Book a call</a>'

                    emailHtml = emailHtml.replace(/<nlemsalesrepname>/gi, salesRepName);
                    emailHtml = emailHtml.replace(/<nlemexpbutton>/gi, expInterest);
                    emailHtml = emailHtml.replace(/<nlemcontactfirstname>/gi, firstname);
                }

                if (templateId == 390) {

                    var salesRepDetailsSearch = nlapiLoadSearch('customrecord_sales', 'customsearch_sales_record_auto_signed__3');

                    var newFiltersSalesRep = new Array();
                    newFiltersSalesRep[0] = new nlobjSearchFilter('internalid', 'custrecord_sales_assigned', 'anyof', salesRep);

                    salesRepDetailsSearch.addFilters(newFiltersSalesRep);

                    var salesRepDetailsSearchResults = salesRepDetailsSearch.runSearch();

                    var salesRepDetailsName = ''
                    var salesRepDetailsEmail = ''
                    var salesRepDetailsPhone = ''

                    salesRepDetailsSearchResults.forEachResult(function (salesRepDetailsSearchResultSet) {

                        salesRepDetailsName = salesRepDetailsSearchResultSet.getText("custrecord_sales_assigned", null, "GROUP");
                        salesRepDetailsEmail = salesRepDetailsSearchResultSet.getValue("email", "CUSTRECORD_SALES_ASSIGNED", "GROUP");
                        salesRepDetailsPhone = salesRepDetailsSearchResultSet.getValue("phone", "CUSTRECORD_SALES_ASSIGNED", "GROUP");

                        return true;
                    });

                    emailHtml = emailHtml.replace(/<nlemsalesrepname>/gi, salesRepDetailsName);
                    emailHtml = emailHtml.replace(/<nlemsalesrepphone>/gi, salesRepDetailsEmail);
                    emailHtml = emailHtml.replace(/<nlemsalesrepemail>/gi, salesRepDetailsPhone);
                    emailHtml = emailHtml.replace(/<nlemsalesrepemailsignature>/gi, salesRepDetailsName);
                }

                if (templateId == 374 || templateId == 378 || templateId == 382) {
                    var customer_record = nlapiLoadRecord('customer', recId);
                    var entityid = customer_record.getFieldValue('entityid');
                    var companyname = customer_record.getFieldValue('companyname');
                    var partner_id = customer_record.getFieldValue('partner');
                    var usage_per_week = customer_record.getFieldValue('custentity_form_mpex_usage_per_week');

                    var previous_carrier = customer_record.getFieldValue('custentity_previous_carrier');

                    var partner_record = nlapiLoadRecord('partner', partner_id);
                    var mp_std_activated = partner_record.getFieldValue('custentity_zee_mp_std_activated');

                    var recContact = nlapiLoadRecord('contact', contactID);

                    var contactEmail = recContact.getFieldValue('email');
                    var contactPhone = recContact.getFieldValue('phone');
                    var firstname = recContact.getFieldValue('firstname');
                    var lastname = recContact.getFieldValue('lastname');

                    var searched_address = nlapiLoadSearch('customer', 'customsearch_smc_address');

                    var newFilters_addresses = new Array();
                    newFilters_addresses[0] = new nlobjSearchFilter('internalid', null, 'is', recId);

                    searched_address.addFilters(newFilters_addresses);

                    var resultSet_addresses = searched_address.runSearch();

                    var addressResult = resultSet_addresses.getResults(0, 1);

                    var id;
                    var addr1;
                    var addr2;
                    var city;
                    var state;
                    var zip;

                    if (addressResult.length != 0) {
                        resultSet_addresses.forEachResult(function (searchResult_address) {

                            id = searchResult_address.getValue('addressinternalid', 'Address', null);
                            addr1 = searchResult_address.getValue('address1', 'Address', null);
                            addr2 = searchResult_address.getValue('address2', 'Address', null);
                            city = searchResult_address.getValue('city', 'Address', null);
                            state = searchResult_address.getValue('state', 'Address', null);
                            zip = searchResult_address.getValue('zipcode', 'Address', null);

                            return true;
                        });
                    }

                    var salesRepDetailsSearch = nlapiLoadSearch('customrecord_sales', 'customsearch_sales_record_auto_signed__3');

                    var newFiltersSalesRep = new Array();
                    newFiltersSalesRep[0] = new nlobjSearchFilter('internalid', 'custrecord_sales_assigned', 'anyof', salesRep);

                    salesRepDetailsSearch.addFilters(newFiltersSalesRep);

                    var salesRepDetailsSearchResults = salesRepDetailsSearch.runSearch();

                    var salesRepDetailsName = ''
                    var salesRepDetailsEmail = ''
                    var salesRepDetailsPhone = ''

                    salesRepDetailsSearchResults.forEachResult(function (salesRepDetailsSearchResultSet) {

                        salesRepDetailsName = salesRepDetailsSearchResultSet.getText("custrecord_sales_assigned", null, "GROUP");
                        salesRepDetailsEmail = salesRepDetailsSearchResultSet.getValue("email", "CUSTRECORD_SALES_ASSIGNED", "GROUP");
                        salesRepDetailsPhone = salesRepDetailsSearchResultSet.getValue("phone", "CUSTRECORD_SALES_ASSIGNED", "GROUP");

                        return true;
                    });

                    emailHtml = emailHtml.replace(/<nlemsalesrepname>/gi, salesRepDetailsName);
                    emailHtml = emailHtml.replace(/<nlemsalesrepphone>/gi, salesRepDetailsEmail);
                    emailHtml = emailHtml.replace(/<nlemsalesrepemail>/gi, salesRepDetailsPhone);
                    emailHtml = emailHtml.replace(/<nlemsalesrepemailsignature>/gi, salesRepDetailsName);

                    var signUp = '<a class="mcnButton " href="https://mailplus.com.au/sign-up/?custinternalid=' + recId + '&custname=' + encodeURIComponent(companyname) + '&email=' + contactEmail + '&phone=' + contactPhone + '&firstname=' + firstname + '&lastname=' + lastname + '&contactid=' + contactID + '&state=' + state + '&salesRep=' + salesRep + '" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Create my account</a>'

                    var bookACall = '<a class="mcnButton " href="https://mailplus.com.au/book-a-sales-call/?custinternalid=' + recId + '&custname=' + encodeURIComponent(companyname) + '&email=' + contactEmail + '&phone=' + contactPhone + '&firstname=' + firstname + '&lastname=' + lastname + '&contactid=' + contactID + '" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Book a Call</a>'

                    var notInterested = '<a class="mcnButton " href="https://mailplus.com.au/not-interested/?custinternalid=' + recId + '&custname=' + encodeURIComponent(companyname) + '" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Not Interested</a>';

                    if ((mp_std_activated != 1 && mp_std_activated != '1') || (previous_carrier == 3 || previous_carrier == 7 || previous_carrier == 5)) {
                        var nostdactive = '<br><span style="color:#FF0000">Standard delivery is not available in your&nbsp;area just yet. We will let you know as soon as it has&nbsp;expanded to your pickup location.</span><br><br>';
                        emailHtml = emailHtml.replace(/<nlemnostdactive>/gi, nostdactive);
                    }
                    if (usage_per_week == 2) {
                        var usage20to100perWeek = 'Further discounts may be applicable depending on your frequency.<br/>';

                        emailHtml = emailHtml.replace(/<nlem20to100perweek>/gi, usage20to100perWeek);

                    }
                    emailHtml = emailHtml.replace(/<nlemsignup>/gi, signUp);
                    emailHtml = emailHtml.replace(/<nlembookacall>/gi, bookACall);
                    emailHtml = emailHtml.replace(/<nlemnotinterested>/gi, notInterested);
                    emailHtml = emailHtml.replace(/<nlemcontactfirstname>/gi, firstname);

                    //NS Search: Product Pricing - Letters - Quotes
                    var prodPricingLetterstobeSentSearch = nlapiLoadSearch('customrecord_product_pricing', 'customsearch_prod_pricing_letters_quotes');

                    var newFilters = new Array();
                    newFilters[newFilters.length] = new nlobjSearchFilter(
                        'internalid', 'custrecord_prod_pricing_customer', 'anyof', recId);

                    prodPricingLetterstobeSentSearch.addFilters(newFilters);

                    var resultSetProdPricingLetters = prodPricingLetterstobeSentSearch.runSearch();



                    var mpStd250g = [];
                    var mpStd500g = [];
                    var mpStd1kg = [];
                    var mpStd3kg = [];
                    var mpStd5kg = [];
                    var mpStd10kg = [];
                    var mpStd25kg = [];
                    var mpStd20kg = [];


                    var mpExp500g = [];
                    var mpExp1kg = [];
                    var mpExp3kg = [];
                    var mpExp5kg = [];

                    var oldCustomerId = null;
                    var count = 0;
                    var oldDeliverySpeed = null;

                    resultSetProdPricingLetters.forEachResult(function (searchResult) {

                        var prodPricingInternalId = searchResult.getValue('internalid');
                        var custId = searchResult.getValue("custrecord_prod_pricing_customer");
                        var deliverySpeed = searchResult.getValue("custrecord_prod_pricing_delivery_speeds");
                        var pricePlan250g = searchResult.getValue("custrecord_prod_pricing_250g");
                        var price250g = searchResult.getValue("baseprice", "CUSTRECORD_PROD_PRICING_250G", null);
                        var pricePlan500g = searchResult.getValue("custrecord_prod_pricing_500g");
                        var price500g = searchResult.getValue("baseprice", "CUSTRECORD_PROD_PRICING_500G", null);
                        var pricePlan1Kg = searchResult.getValue("custrecord_prod_pricing_1kg");
                        var price1Kg = searchResult.getValue("baseprice", "CUSTRECORD_PROD_PRICING_1KG", null);
                        var pricePlan3Kg = searchResult.getValue("custrecord_prod_pricing_3kg");
                        var price3Kg = searchResult.getValue("baseprice", "CUSTRECORD_PROD_PRICING_3KG", null);
                        var pricePlan5Kg = searchResult.getValue("custrecord_prod_pricing_5kg");
                        var price5Kg = searchResult.getValue("baseprice", "CUSTRECORD_PROD_PRICING_5KG", null);
                        var pricePlan10Kg = searchResult.getValue("custrecord_prod_pricing_10kg");
                        var price10Kg = searchResult.getValue("baseprice", "CUSTRECORD_PROD_PRICING_10KG", null);
                        var pricePlan20Kg = searchResult.getValue("custrecord_prod_pricing_20kg");
                        var price20Kg = searchResult.getValue("baseprice", "CUSTRECORD_PROD_PRICING_20KG", null);
                        var pricePlan25Kg = searchResult.getValue("custrecord_prod_pricing_25kg");
                        var price25Kg = searchResult.getValue("baseprice", "CUSTRECORD_PROD_PRICING_25KG", null);

                        if (count == 0) {
                            if (deliverySpeed == 2) {
                                mpExp500g.push(price500g);
                                mpExp1kg.push(price1Kg);
                                mpExp3kg.push(price3Kg);
                                mpExp5kg.push(price5Kg);
                            } else if (deliverySpeed == 1) {
                                mpStd250g.push(price250g);
                                mpStd500g.push(price500g);
                                mpStd1kg.push(price1Kg);
                                mpStd3kg.push(price3Kg);
                                mpStd5kg.push(price5Kg);
                                mpStd10kg.push(price10Kg);
                                mpStd20kg.push(price20Kg);
                                mpStd25kg.push(price25Kg);
                            }
                        } else if (oldCustomerId == custId) {
                            if (oldDeliverySpeed == deliverySpeed) {
                                nlapiDeleteRecord('customrecord_product_pricing', prodPricingInternalId);
                                count--;
                            } else {
                                if (deliverySpeed == 2) {
                                    mpExp500g.push(price500g);
                                    mpExp1kg.push(price1Kg);
                                    mpExp3kg.push(price3Kg);
                                    mpExp5kg.push(price5Kg);
                                } else if (deliverySpeed == 1) {
                                    mpStd250g.push(price250g);
                                    mpStd500g.push(price500g);
                                    mpStd1kg.push(price1Kg);
                                    mpStd3kg.push(price3Kg);
                                    mpStd5kg.push(price5Kg);
                                    mpStd10kg.push(price10Kg);
                                    mpStd20kg.push(price20Kg);
                                    mpStd25kg.push(price25Kg);
                                }
                            }

                        }

                        oldCustomerId = custId;
                        oldDeliverySpeed = deliverySpeed;
                        count++;
                        return true;
                    });

                    if (count > 0 && !isNullorEmpty(oldCustomerId)) {
                        var recCustomer = nlapiLoadRecord('customer', oldCustomerId);
                        companyname = recCustomer.getFieldValue('companyname');
                        customerID = recCustomer.getFieldValue('entityid')
                        account_email = recCustomer.getFieldValue('email');
                        service_email = recCustomer.getFieldValue('custentity_email_service');


                        //EXPRESS
                        emailHtml = emailHtml.replace(/<nlem5kgexp>/gi, mpExp5kg[0]);
                        emailHtml = emailHtml.replace(/<nlem3kgexp>/gi, mpExp3kg[0]);
                        emailHtml = emailHtml.replace(/<nlem1kgexp>/gi, mpExp1kg[0]);
                        emailHtml = emailHtml.replace(/<nlem500gexp>/gi, mpExp500g[0]);

                        //STANDARD
                        emailHtml = emailHtml.replace(/<nlem20kgstd>/gi, mpStd20kg[0]);
                        emailHtml = emailHtml.replace(/<nlem25kgstd>/gi, mpStd25kg[0]);
                        emailHtml = emailHtml.replace(/<nlem10kgstd>/gi, mpStd10kg[0]);
                        emailHtml = emailHtml.replace(/<nlem5kgstd>/gi, mpStd5kg[0]);
                        emailHtml = emailHtml.replace(/<nlem3kgstd>/gi, mpStd3kg[0]);
                        emailHtml = emailHtml.replace(/<nlem1kgstd>/gi, mpStd1kg[0]);
                        emailHtml = emailHtml.replace(/<nlem500gstd>/gi, mpStd500g[0]);
                        emailHtml = emailHtml.replace(/<nlem250gstd>/gi, mpStd250g[0]);

                        emailHtml = emailHtml.replace(/<nlemexpbutton>/gi, expInterest);


                    }

                }

                if (templateId == 381) {
                    var customer_record = nlapiLoadRecord('customer', recId);
                    var entityid = customer_record.getFieldValue('entityid');
                    var companyname = customer_record.getFieldValue('companyname');
                    var partner_id = customer_record.getFieldValue('partner');

                    var previous_carrier = customer_record.getFieldValue('custentity_previous_carrier');

                    var partner_record = nlapiLoadRecord('partner', partner_id);
                    var mp_std_activated = partner_record.getFieldValue('custentity_zee_mp_std_activated');

                    var recContact = nlapiLoadRecord('contact', contactID);

                    var contactEmail = recContact.getFieldValue('email');
                    var contactPhone = recContact.getFieldValue('phone');
                    var firstname = recContact.getFieldValue('firstname');
                    var lastname = recContact.getFieldValue('lastname');

                    var searched_address = nlapiLoadSearch('customer', 'customsearch_smc_address');

                    var newFilters_addresses = new Array();
                    newFilters_addresses[0] = new nlobjSearchFilter('internalid', null, 'is', recId);

                    searched_address.addFilters(newFilters_addresses);

                    var resultSet_addresses = searched_address.runSearch();

                    var addressResult = resultSet_addresses.getResults(0, 1);

                    var id;
                    var addr1;
                    var addr2;
                    var city;
                    var state;
                    var zip;

                    if (addressResult.length != 0) {
                        resultSet_addresses.forEachResult(function (searchResult_address) {

                            id = searchResult_address.getValue('addressinternalid', 'Address', null);
                            addr1 = searchResult_address.getValue('address1', 'Address', null);
                            addr2 = searchResult_address.getValue('address2', 'Address', null);
                            city = searchResult_address.getValue('city', 'Address', null);
                            state = searchResult_address.getValue('state', 'Address', null);
                            zip = searchResult_address.getValue('zipcode', 'Address', null);

                            return true;
                        });
                    }

                    var signUp = '<a class="mcnButton " href="https://mailplus.com.au/sign-up/?custinternalid=' + recId + '&custname=' + encodeURIComponent(companyname) + '&email=' + contactEmail + '&phone=' + contactPhone + '&firstname=' + firstname + '&lastname=' + lastname + '&contactid=' + contactID + '&state=' + state + '&salesRep=' + salesRep + '" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Create my free account</a>'

                    var bookACall = '<a class="mcnButton " href="https://mailplus.com.au/book-a-sales-call/?custinternalid=' + recId + '&custname=' + encodeURIComponent(companyname) + '&email=' + contactEmail + '&phone=' + contactPhone + '&firstname=' + firstname + '&lastname=' + lastname + '&contactid=' + contactID + '" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Book a Call</a>'

                    var notInterested = '<a class="mcnButton " href="https://mailplus.com.au/not-interested/?custinternalid=' + recId + '&custname=' + encodeURIComponent(companyname) + '" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Not Interested</a>';

                    if ((mp_std_activated != 1 && mp_std_activated != '1') || (previous_carrier == 3 || previous_carrier == 7 || previous_carrier == 5)) {
                        var nostdactive = '<br><span style="color:#FF0000">Standard delivery is not available in your&nbsp;area just yet. We will let you know as soon as it has&nbsp;expanded to your pickup location.</span><br><br>';
                        emailHtml = emailHtml.replace(/<nlemnostdactive>/gi, nostdactive);
                    }


                    emailHtml = emailHtml.replace(/<nlemsignup>/gi, signUp);
                    emailHtml = emailHtml.replace(/<nlembookacall>/gi, bookACall);
                    emailHtml = emailHtml.replace(/<nlemnotinterested>/gi, notInterested);
                    emailHtml = emailHtml.replace(/<nlemcontactfirstname>/gi, firstname);

                    //NS Search: Product Pricing - Letters - Quotes
                    var prodPricingLetterstobeSentSearch = nlapiLoadSearch('customrecord_product_pricing', 'customsearch_prod_pricing_letters_quotes');

                    var newFilters = new Array();
                    newFilters[newFilters.length] = new nlobjSearchFilter(
                        'internalid', 'custrecord_prod_pricing_customer', 'anyof', recId);

                    prodPricingLetterstobeSentSearch.addFilters(newFilters);

                    var resultSetProdPricingLetters = prodPricingLetterstobeSentSearch.runSearch();



                    var mpStd250g = [];
                    var mpStd500g = [];
                    var mpStd1kg = [];
                    var mpStd3kg = [];
                    var mpStd5kg = [];
                    var mpStd10kg = [];
                    var mpStd25kg = [];
                    var mpStd20kg = [];


                    var mpExp500g = [];
                    var mpExp1kg = [];
                    var mpExp3kg = [];
                    var mpExp5kg = [];

                    var oldCustomerId = null;
                    var count = 0;
                    var oldDeliverySpeed = null;

                    resultSetProdPricingLetters.forEachResult(function (searchResult) {

                        var prodPricingInternalId = searchResult.getValue('internalid');
                        var custId = searchResult.getValue("custrecord_prod_pricing_customer");
                        var deliverySpeed = searchResult.getValue("custrecord_prod_pricing_delivery_speeds");
                        var pricePlan250g = searchResult.getValue("custrecord_prod_pricing_250g");
                        var price250g = searchResult.getValue("baseprice", "CUSTRECORD_PROD_PRICING_250G", null);
                        var pricePlan500g = searchResult.getValue("custrecord_prod_pricing_500g");
                        var price500g = searchResult.getValue("baseprice", "CUSTRECORD_PROD_PRICING_500G", null);
                        var pricePlan1Kg = searchResult.getValue("custrecord_prod_pricing_1kg");
                        var price1Kg = searchResult.getValue("baseprice", "CUSTRECORD_PROD_PRICING_1KG", null);
                        var pricePlan3Kg = searchResult.getValue("custrecord_prod_pricing_3kg");
                        var price3Kg = searchResult.getValue("baseprice", "CUSTRECORD_PROD_PRICING_3KG", null);
                        var pricePlan5Kg = searchResult.getValue("custrecord_prod_pricing_5kg");
                        var price5Kg = searchResult.getValue("baseprice", "CUSTRECORD_PROD_PRICING_5KG", null);
                        var pricePlan10Kg = searchResult.getValue("custrecord_prod_pricing_10kg");
                        var price10Kg = searchResult.getValue("baseprice", "CUSTRECORD_PROD_PRICING_10KG", null);
                        var pricePlan20Kg = searchResult.getValue("custrecord_prod_pricing_20kg");
                        var price20Kg = searchResult.getValue("baseprice", "CUSTRECORD_PROD_PRICING_20KG", null);
                        var pricePlan25Kg = searchResult.getValue("custrecord_prod_pricing_25kg");
                        var price25Kg = searchResult.getValue("baseprice", "CUSTRECORD_PROD_PRICING_25KG", null);

                        if (count == 0) {
                            if (deliverySpeed == 2) {
                                mpExp500g.push(price500g);
                                mpExp1kg.push(price1Kg);
                                mpExp3kg.push(price3Kg);
                                mpExp5kg.push(price5Kg);
                            } else if (deliverySpeed == 1) {
                                mpStd250g.push(price250g);
                                mpStd500g.push(price500g);
                                mpStd1kg.push(price1Kg);
                                mpStd3kg.push(price3Kg);
                                mpStd5kg.push(price5Kg);
                                mpStd10kg.push(price10Kg);
                                mpStd20kg.push(price20Kg);
                                mpStd25kg.push(price25Kg);
                            }
                        } else if (oldCustomerId == custId) {
                            if (oldDeliverySpeed == deliverySpeed) {
                                nlapiDeleteRecord('customrecord_product_pricing', prodPricingInternalId);
                                count--;
                            } else {
                                if (deliverySpeed == 2) {
                                    mpExp500g.push(price500g);
                                    mpExp1kg.push(price1Kg);
                                    mpExp3kg.push(price3Kg);
                                    mpExp5kg.push(price5Kg);
                                } else if (deliverySpeed == 1) {
                                    mpStd250g.push(price250g);
                                    mpStd500g.push(price500g);
                                    mpStd1kg.push(price1Kg);
                                    mpStd3kg.push(price3Kg);
                                    mpStd5kg.push(price5Kg);
                                    mpStd10kg.push(price10Kg);
                                    mpStd20kg.push(price20Kg);
                                    mpStd25kg.push(price25Kg);
                                }
                            }

                        }

                        oldCustomerId = custId;
                        oldDeliverySpeed = deliverySpeed;
                        count++;
                        return true;
                    });

                    if (count > 0 && !isNullorEmpty(oldCustomerId)) {
                        var recCustomer = nlapiLoadRecord('customer', oldCustomerId);
                        companyname = recCustomer.getFieldValue('companyname');
                        customerID = recCustomer.getFieldValue('entityid')
                        account_email = recCustomer.getFieldValue('email');
                        service_email = recCustomer.getFieldValue('custentity_email_service');


                        //EXPRESS
                        emailHtml = emailHtml.replace(/<nlem5kgexp>/gi, mpExp5kg[0]);
                        emailHtml = emailHtml.replace(/<nlem3kgexp>/gi, mpExp3kg[0]);
                        emailHtml = emailHtml.replace(/<nlem1kgexp>/gi, mpExp1kg[0]);
                        emailHtml = emailHtml.replace(/<nlem500gexp>/gi, mpExp500g[0]);

                        //STANDARD
                        emailHtml = emailHtml.replace(/<nlem20kgstd>/gi, mpStd20kg[0]);
                        emailHtml = emailHtml.replace(/<nlem25kgstd>/gi, mpStd25kg[0]);
                        emailHtml = emailHtml.replace(/<nlem10kgstd>/gi, mpStd10kg[0]);
                        emailHtml = emailHtml.replace(/<nlem5kgstd>/gi, mpStd5kg[0]);
                        emailHtml = emailHtml.replace(/<nlem3kgstd>/gi, mpStd3kg[0]);
                        emailHtml = emailHtml.replace(/<nlem1kgstd>/gi, mpStd1kg[0]);
                        emailHtml = emailHtml.replace(/<nlem500gstd>/gi, mpStd500g[0]);
                        emailHtml = emailHtml.replace(/<nlem250gstd>/gi, mpStd250g[0]);

                        emailHtml = emailHtml.replace(/<nlemexpbutton>/gi, expInterest);


                    }

                }

                if (templateId == 375) {
                    var recContact = nlapiLoadRecord('contact', contactID);

                    var contactEmail = recContact.getFieldValue('email');
                    var contactPhone = recContact.getFieldValue('phone');
                    var firstname = recContact.getFieldValue('firstname');
                    var lastname = recContact.getFieldValue('lastname');

                    var salesCallBookedSearch = nlapiLoadSearch('customer', 'customsearch_sales_call_booked_tasks');

                    var newFilters_addresses = new Array();
                    newFilters_addresses[0] = new nlobjSearchFilter('internalid', null, 'is', recId);

                    salesCallBookedSearch.addFilters(newFilters_addresses);

                    var salesCallBookedSearchResult = salesCallBookedSearch.runSearch();

                    var id;
                    var addr1;
                    var addr2;
                    var city;
                    var state;
                    var zip;

                    var salesCallDate = null;
                    var salesCallTime = null;

                    salesCallBookedSearchResult.forEachResult(function (salesCallBookedSearchResultSet) {

                        salesCallDate = salesCallBookedSearchResultSet.getValue('duedate', 'task', null);
                        salesCallTime = salesCallBookedSearchResultSet.getValue('starttime', 'task', null);

                        return true;
                    });



                    // var cal = ics();
                    // cal.addEvent("Your MailPlus Sales Call", "This is thirty minute event", "Sydney, AU", salesCallDate + ' ' + salesCallTime);
                    // var download = cal.download();

                    // nlapiLogExecution('DEBUG', 'download', download);

                    var addToCalendarHtml = '<a class="mcnButton " href="https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20221128T011500Z%2F20221128T014500Z" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Add to Google Calendar</a> <a class="mcnButton " href="https://outlook.live.com/calendar/0/deeplink/compose?allday=false&enddt=2022-11-28T01%3A45%3A00%2B00%3A00&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=2022-11-28T01%3A15%3A00%2B00%3A00&subject=Your%20MailPlus%20Sales%20Call" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Add to Outlook</a> <a class="mcnButton " href="https://outlook.office.com/calendar/0/deeplink/compose?allday=false&enddt=2022-11-28T01%3A45%3A00%2B00%3A00&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=2022-11-28T01%3A15%3A00%2B00%3A00&subject=Your%20MailPlus%20Sales%20Call" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Add to Office 365</a>'

                    nlapiLogExecution('DEBUG', 'addToCalendarHtml', addToCalendarHtml);
                    emailHtml = emailHtml.replace(/<nlemaddtocalendar>/gi, addToCalendarHtml);
                    emailHtml = emailHtml.replace(/<nlemcontactfirstname>/gi, firstname);
                    emailHtml = emailHtml.replace(/<nlemsalesdate>/gi, salesCallDate);
                    emailHtml = emailHtml.replace(/<nlemsalestime>/gi, salesCallTime);

                }

                if (templateId == 377) {

                    var customer_record = nlapiLoadRecord('customer', recId);
                    var entityid = customer_record.getFieldValue('entityid');
                    var companyname = customer_record.getFieldValue('companyname');

                    var searched_address = nlapiLoadSearch('customer', 'customsearch_smc_address');

                    var newFilters_addresses = new Array();
                    newFilters_addresses[0] = new nlobjSearchFilter('internalid', null, 'is', recId);

                    searched_address.addFilters(newFilters_addresses);

                    var resultSet_addresses = searched_address.runSearch();

                    var addressResult = resultSet_addresses.getResults(0, 1);

                    var id;
                    var addr1;
                    var addr2;
                    var city;
                    var state;
                    var zip;

                    if (addressResult.length != 0) {
                        resultSet_addresses.forEachResult(function (searchResult_address) {

                            id = searchResult_address.getValue('addressinternalid', 'Address', null);
                            addr1 = searchResult_address.getValue('address1', 'Address', null);
                            addr2 = searchResult_address.getValue('address2', 'Address', null);
                            city = searchResult_address.getValue('city', 'Address', null);
                            state = searchResult_address.getValue('state', 'Address', null);
                            zip = searchResult_address.getValue('zipcode', 'Address', null);

                            return true;
                        });
                    }


                    var recContact = nlapiLoadRecord('contact', contactID);

                    var contactEmail = recContact.getFieldValue('email');
                    var contactPhone = recContact.getFieldValue('phone');
                    var firstname = recContact.getFieldValue('firstname');



                    var customerDetails = 'Customer Name: ' + entityid + ' ' + companyname
                    var customerAddressDetails = 'Address: ' + addr1 + ', ' + addr2 + ', ' + city + ' ' + state + ' - ' + zip + '</br>';

                    var contactDetails = 'First Name: ' + firstname;
                    var contactEmailDetails = 'Email: ' + contactEmail;
                    var contactPhoneDetails = 'Phone: ' + contactPhone;

                    var expIntcustomerVisitederest = '<a class="mcnButton" href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1656&deploy=1&compid=1048144&h=1628e8b5d3c71477d4aa&custinternalid=' + recId + '" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Completed</a>';

                    var bookACall = '<a class="mcnButton " href="https://mailplus.com.au/book-a-sales-call/?custinternalid=' + recId + '&custname=' + encodeURIComponent(companyname) + '&email=' + contactEmail + '&phone=' + contactPhone + '&firstname=' + firstname + '&lastname=' + lastname + '&contactid=' + contactID + '" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Book a Call</a>';

                    if (!isNullorEmpty(trialEndDate)) {
                        var trialEndDateText = 'Trial Start Date: ' + commdate;
                        trialEndDateText += '</br>Trial End Date: ' + trialEndDate + '</br>';
                        emailHtml = emailHtml.replace(/<nlemfreetrialdetails>/gi, trialEndDateText);
                    }
                    emailHtml = emailHtml.replace(/<nlemcommstartdate>/gi, commdate);

                    emailHtml = emailHtml.replace(/<nlemcustomerdetails>/gi, customerDetails);
                    emailHtml = emailHtml.replace(/<nlemcustomeraddress>/gi, customerAddressDetails);
                    emailHtml = emailHtml.replace(/<nlemcontantdetails>/gi, contactDetails);
                    emailHtml = emailHtml.replace(/<nlemcontactemail>/gi, contactEmailDetails);
                    emailHtml = emailHtml.replace(/<nlemcontactphone>/gi, contactPhoneDetails);
                    emailHtml = emailHtml.replace(/<nlemcustomervisited>/gi, expIntcustomerVisitederest);
                    emailHtml = emailHtml.replace(/<nlembookacall>/gi, bookACall);

                }

                if (templateId == 383) {
                    var customer_record = nlapiLoadRecord('customer', recId);
                    var entityid = customer_record.getFieldValue('entityid');
                    var companyname = customer_record.getFieldValue('companyname');

                    var recContact = nlapiLoadRecord('contact', contactID);

                    var contactEmail = recContact.getFieldValue('email');
                    var contactPhone = recContact.getFieldValue('phone');
                    var firstname = recContact.getFieldValue('firstname')

                    var expInterest = '<a class="mcnButton " href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1691&deploy=1&compid=1048144&h=d8b0de7789c0382654ab&custinternalid=' + recId + '"  style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Agree</a>'

                    // emailHtml = emailHtml.replace(/<nlemsalesrepname>/gi, salesRepName);
                    emailHtml = emailHtml.replace(/<nlemagree>/gi, expInterest);
                    // emailHtml = emailHtml.replace(/<nlemcontactfirstname>/gi, firstname);
                }

                if (templateId == 384) {
                    if (!isNullorEmpty(recId)) {
                        var customer_record = nlapiLoadRecord('customer', recId);
                        var entityid = customer_record.getFieldValue('entityid');
                        var companyname = customer_record.getFieldValue('companyname');

                        var recContact = nlapiLoadRecord('contact', contactID);

                        var contactEmail = recContact.getFieldValue('email');
                        var contactPhone = recContact.getFieldValue('phone');
                        var firstname = recContact.getFieldValue('firstname')

                        var bookACall = '<a class="mcnButton " href="https://mailplus.com.au/book-a-sales-call/?custinternalid=' + recId + '&custname=' + encodeURIComponent(companyname) + '&email=' + contactEmail + '&phone=' + contactPhone + '&firstname=' + firstname + '&lastname=' + lastname + '&contactid=' + contactID + '" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Book a Call</a>'

                        // emailHtml = emailHtml.replace(/<nlemsalesrepname>/gi, salesRepName);
                        emailHtml = emailHtml.replace(/<nlembookacall>/gi, bookACall);
                        // emailHtml = emailHtml.replace(/<nlemcontactfirstname>/gi, firstname);
                    } else {
                        var bookACall = '<a class="mcnButton " href="" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Book a Call</a>'

                        // emailHtml = emailHtml.replace(/<nlemsalesrepname>/gi, salesRepName);
                        emailHtml = emailHtml.replace(/<nlembookacall>/gi, bookACall);
                    }

                }

                if (templateId == 385) {
                    var customer_record = nlapiLoadRecord('customer', recId);
                    var entityid = customer_record.getFieldValue('entityid');
                    var companyname = customer_record.getFieldValue('companyname');
                    var partner_id = customer_record.getFieldValue('partner');
                    var usage_per_week = customer_record.getFieldValue('custentity_form_mpex_usage_per_week');

                    var previous_carrier = customer_record.getFieldValue('custentity_previous_carrier');

                    var partner_record = nlapiLoadRecord('partner', partner_id);
                    var mp_std_activated = partner_record.getFieldValue('custentity_zee_mp_std_activated');

                    var recContact = nlapiLoadRecord('contact', contactID);

                    var contactEmail = recContact.getFieldValue('email');
                    var contactPhone = recContact.getFieldValue('phone');
                    var firstname = recContact.getFieldValue('firstname');
                    var lastname = recContact.getFieldValue('lastname');

                    var searched_address = nlapiLoadSearch('customer', 'customsearch_smc_address');

                    var newFilters_addresses = new Array();
                    newFilters_addresses[0] = new nlobjSearchFilter('internalid', null, 'is', recId);

                    searched_address.addFilters(newFilters_addresses);

                    var resultSet_addresses = searched_address.runSearch();

                    var addressResult = resultSet_addresses.getResults(0, 1);

                    var id;
                    var addr1;
                    var addr2;
                    var city;
                    var state;
                    var zip;

                    if (addressResult.length != 0) {
                        resultSet_addresses.forEachResult(function (searchResult_address) {

                            id = searchResult_address.getValue('addressinternalid', 'Address', null);
                            addr1 = searchResult_address.getValue('address1', 'Address', null);
                            addr2 = searchResult_address.getValue('address2', 'Address', null);
                            city = searchResult_address.getValue('city', 'Address', null);
                            state = searchResult_address.getValue('state', 'Address', null);
                            zip = searchResult_address.getValue('zipcode', 'Address', null);

                            return true;
                        });
                    }

                    var signUp = '<a class="mcnButton " href="https://mailplus.com.au/sign-up/?custinternalid=' + recId + '&custname=' + encodeURIComponent(companyname) + '&email=' + contactEmail + '&phone=' + contactPhone + '&firstname=' + firstname + '&lastname=' + lastname + '&contactid=' + contactID + '&state=' + state + '&salesRep=' + salesRep + '" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Gain Access Now</a>'

                    var bookACall = '<a class="mcnButton " href="https://mailplus.com.au/book-a-sales-call/?custinternalid=' + recId + '&custname=' + encodeURIComponent(companyname) + '&email=' + contactEmail + '&phone=' + contactPhone + '&firstname=' + firstname + '&lastname=' + lastname + '&contactid=' + contactID + '" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Book a Call</a>'

                    var notInterested = '<a class="mcnButton " href="https://mailplus.com.au/not-interested/?custinternalid=' + recId + '&custname=' + encodeURIComponent(companyname) + '" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Not Interested</a>';


                    emailHtml = emailHtml.replace(/<nlemsignup>/gi, signUp);
                    emailHtml = emailHtml.replace(/<nlembookacall>/gi, bookACall);

                }


            }

        }
        response.setHeader('Custom-Header-SubjectLine', subject);
        response.write(emailHtml);

    }
}

function getMergeFields(templateId) {
    if (!isNullorEmpty(templateId)) {
        var filters = [new nlobjSearchFilter('custrecord_comm_merge_parent', null,
            'is', templateId)];
        var columns = [new nlobjSearchColumn('custrecord_comm_merge_tag'), new nlobjSearchColumn(
            'custrecord_comm_merge_rectype')];
        columns[columns.length] = new nlobjSearchColumn(
            'custrecord_comm_merge_field');
        columns[columns.length] = new nlobjSearchColumn(
            'custrecord_comm_merge_email');
        columns[columns.length] = new nlobjSearchColumn('custrecord_comm_merge_sms');
        columns[columns.length] = new nlobjSearchColumn('custrecord_comm_merge_pdf');
        var results = nlapiSearchRecord('customrecord_comm_merge_field', null,
            filters, columns);

    }
}

function getAttachments(templateId) {
    if (!isNullorEmpty(templateId)) {
        var attachments = [];
        var checked = [];
        var filters = [new nlobjSearchFilter('custrecord_comm_attach_parent', null,
            'is', templateId)];
        var columns = [new nlobjSearchColumn('name'), new nlobjSearchColumn(
            'custrecord_comm_attach_checked'), new nlobjSearchColumn(
                'custrecord_comm_attach_file')];
        var results = nlapiSearchRecord('customrecord_comm_merge_field', null,
            filters, columns);
        if (!isNullorEmpty(results)) {
            for (n = 0; n < results.length; n++) {
                attachments.push([results[n].getValue('custrecord_comm_attach_file'),
                results[n].getValue('name')
                ]);
                if (results[n].getValue('custrecord_comm_attach_checked') == 'T') {
                    checked.push([results[n].getValue('custrecord_comm_attach_file'),
                    results[n].getValue('name')
                    ]);
                }
            }
            return [attachments, checked];
        } else return null;
    }
}
