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
		var templateId = request.getParameter("template");
		var recType = request.getParameter("rectype");
		var recId = request.getParameter("recid");
		var salesRep = request.getParameter("salesrep");
		var addressee = request.getParameter("dear");
		var contactID = request.getParameter("contactid");
		var salesTitle = request.getParameter("title");
		var userID = request.getParameter("userid");
		var fields = request.getParameter("fields");
		var zeeleadid = request.getParameter("zeeleadid");
		var commdate = request.getParameter("commdate");
		var commreg = request.getParameter("commreg");
		var trialEndDate = request.getParameter("trialenddate");
		var billingstartdate = request.getParameter("billingstartdate");
		var salesRepName = request.getParameter("salesRepName");
		var onboardingDate = request.getParameter("taskDate");
		var onboardingTime = request.getParameter("tasktime");
		var trackingid = request.getParameter("trackingid");
		var barcodeRecordID = request.getParameter("barcode");
		var emailHtml = "";
		var subject = "";

		nlapiLogExecution("DEBUG", "Custom Record templateId", templateId);
		nlapiLogExecution("DEBUG", "addressee", addressee);
		nlapiLogExecution("DEBUG", "recId", recId);
		nlapiLogExecution("DEBUG", "contactID", contactID);
		nlapiLogExecution("DEBUG", "commdate", commdate);
		nlapiLogExecution("DEBUG", "commreg", commreg);

		if (!isNullorEmpty(templateId)) {
			var recCommTemp = nlapiLoadRecord(
				"customrecord_camp_comm_template",
				templateId
			);
			templateId = recCommTemp.getFieldValue(
				"custrecord_camp_comm_email_template"
			);
			nlapiLogExecution("DEBUG", "Email templateId", templateId);
			subject = recCommTemp.getFieldValue("custrecord_camp_comm_subject");
			var sms = recCommTemp.getFieldValue("custrecord_camp_comm_sms_template");

			var file = nlapiCreateEmailMerger(templateId);
			nlapiLogExecution("DEBUG", "recId", recId);
			if (recId != "null" && !isNullorEmpty(recId)) {
				file.setEntity("customer", recId);
			}

			nlapiLogExecution("DEBUG", "USer ID", userID);
			if (!isNullorEmpty(userID)) {
				file.setEntity("employee", userID);
			}

			if (!isNullorEmpty(contactID) && contactID != 0) {
				if (contactID != "null") {
					file.setEntity("contact", contactID);
				}
			}

			var mergeResult = file.merge();

			emailHtml = mergeResult.getBody();
			subject = mergeResult.getSubject();

			if (
				!isNullorEmpty(templateId) &&
				!isNullorEmpty(recType) &&
				!isNullorEmpty(recId)
			) {
				var arrMergeFields = [];
				if (
					!isNullorEmpty(fields) ||
					!isNullorEmpty(addressee) ||
					!isNullorEmpty(salesRep)
				) {
					if (!isNullorEmpty(fields)) {
						var arrFields = fields.split(",");
						for (x = 0; x < arrFields.length; x += 2) {
							arrMergeFields[arrFields[x]] = arrFields[x + 1];
						}
					}
					arrMergeFields["NLEMSALESPERSON"] = !isNullorEmpty(salesRep)
						? salesRep
						: "";
					arrMergeFields["NLEMCONTACT"] = !isNullorEmpty(addressee)
						? addressee
						: "";
				}

				// var file = nlapiMergeRecord(templateId, recType, recId, null, null, arrMergeFields);

				// set variables in email
				// emailHtml = emailHtml.replace(/<NLEMCONTACT>/gi,addressee);
				nlapiLogExecution("AUDIT", "templateId", templateId);

				//Email template Name: Referral Program - Referral Code
				if (templateId == 286) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var last5_entityid = entityid.substr(entityid.length - 5);
					emailHtml = emailHtml.replace(
						/<NLEMREFERRALCODE>/gi,
						"SPREADTHELOVE" + last5_entityid
					);
				}

				//Email Template Name: Franchisee Website Leads - Owner
				if (templateId == 329) {
					var owner_button =
						'<td align="center" class="mcnButtonContent" style="font-family: Arial;font-size: 16px;padding: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" valign="middle"><a class="mcnButton " href="https://mailplus.com.au/become-a-franchisee-owner-operator-survey/?zeeleadid=' +
						zeeleadid +
						'" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Survey ">Survey </a></td>';
					emailHtml = emailHtml.replace(/<NLEMSURVEYBUTTON>/gi, owner_button);
				}

				//Email template Name: Franchisee Website Leads - Investor
				if (templateId == 328) {
					var investor_button =
						'<td align="center" class="mcnButtonContent" style="font-family: Arial;font-size: 16px;padding: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" valign="middle"><a class="mcnButton " href="https://mailplus.com.au/become-a-franchisee-investor-survey/?zeeleadid=' +
						zeeleadid +
						'" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Survey ">Survey </a></td>';
					emailHtml = emailHtml.replace(
						/<NLEMSURVEYBUTTON>/gi,
						investor_button
					);
				}

				//Email Template Name: 20241114 - T5 - Onboarding Reminder
				if (templateId == 478) {
					emailHtml = emailHtml.replace(/nlemcontactname/gi, addressee);
					emailHtml = emailHtml.replace(/nlemtime/gi, onboardingTime);
					emailHtml = emailHtml.replace(/nlemsalesrepname/gi, salesRepName);
				}

				/**
				 * Email Template Names:
				 *  MailPlus Express - Invite to Portal
				 *  MailPlus Standard - Activated
				 *  Existing Customer - Portal Access Required
				 */
				if (templateId == 371 || templateId == 372) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");

					var expInterest =
						'<a class="mcnButton " href="https://mailplus.com.au/shipping-portal-orientation/?custinternalid=' +
						recId +
						"&custname=" +
						companyname +
						"&email=" +
						contactEmail +
						"&phone=" +
						contactPhone +
						"&firstname=" +
						firstname +
						'" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Book a call</a>';

					emailHtml = emailHtml.replace(/<nlemsalesrepname>/gi, salesRepName);
					emailHtml = emailHtml.replace(/<nlemexpbutton>/gi, expInterest);
					emailHtml = emailHtml.replace(/<nlemcontactfirstname>/gi, firstname);
				}

				//EmailTemplate ID 219: 202404 - MailPlus - Invite to Portal
				//EmailTemplate ID 477: 20241113 - T4 - Your ShipMate Access is Ready
				if (templateId == 219 || templateId == 477) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");

					var expInterest =
						'<a class=" " href="https://mailplus.com.au/shipping-portal-orientation/?custinternalid=' +
						recId +
						"&custname=" +
						companyname +
						"&email=" +
						contactEmail +
						"&phone=" +
						contactPhone +
						"&firstname=" +
						firstname +
						'" >Book a call</a>';

					// emailHtml = emailHtml.replace(/<nlemsalesrepname>/gi, salesRepName);
					// emailHtml = emailHtml.replace(/<nlemexpbutton>/gi, expInterest);
					// emailHtml = emailHtml.replace(/<nlemcontactfirstname>/gi, firstname);

					emailHtml = emailHtml.replace(/nlemsalesrepname/gi, salesRepName);
					emailHtml = emailHtml.replace(/nlembookacall/gi, expInterest);
				}

				//Email Template Name: 202404 - Premium - Exisiting Customer Follow Up || 202404 - Premium - Lost Customer Follow-Up
				if (templateId == 430 || templateId == 431) {
					var mpPremiumTable =
						'<table border="0" cellpadding="0" cellspacing="1" style="width: 100%;"><thead><tr><th></th><th style="vertical-align: middle;text-align: center;"><b>PREMIUM</b></th></tr></thead><tbody>';

					var mpPremiumProdPricingSearch = nlapiLoadSearch(
						"customrecord_product_pricing",
						"customsearch_mp_premium_prod_pricing"
					);

					var newFilters = new Array();
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"internalid",
						"custrecord_prod_pricing_customer",
						"anyof",
						recId
					);

					mpPremiumProdPricingSearch.addFilters(newFilters);

					var mpPremiumProdPricingSearchResultSet =
						mpPremiumProdPricingSearch.runSearch();

					var item1Kg;
					var item3Kg;
					var item5Kg;
					var item10Kg;
					var item20Kg;

					var price1Kg;
					var price3Kg;
					var price5Kg;
					var price10Kg;
					var price20Kg;

					mpPremiumProdPricingSearchResultSet.forEachResult(function (
						searchResult
					) {
						var prodPricingInternalId = searchResult.getValue("internalid");
						var custId = searchResult.getValue(
							"custrecord_prod_pricing_customer"
						);
						item1Kg = searchResult.getText("custrecord_prod_pricing_1kg");
						item3Kg = searchResult.getText("custrecord_prod_pricing_3kg");
						item5Kg = searchResult.getText("custrecord_prod_pricing_5kg");
						item10Kg = searchResult.getText("custrecord_prod_pricing_10kg");
						item20Kg = searchResult.getText("custrecord_prod_pricing_20kg");

						price1Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_1KG",
							null
						);
						price3Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_3KG",
							null
						);
						price5Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_5KG",
							null
						);
						price10Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_10KG",
							null
						);
						price20Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_20KG",
							null
						);

						return true;
					});

					mpPremiumTable += "<tr>";
					mpPremiumTable += "<th>" + item1Kg + "</th>";
					mpPremiumTable +=
						'<th style="text-align: center;">$' + price1Kg + "</th>";
					mpPremiumTable += "</tr>";

					mpPremiumTable += "<tr>";
					mpPremiumTable += "<th>" + item3Kg + "</th>";
					mpPremiumTable +=
						'<th style="text-align: center;">$' + price3Kg + "</th>";
					mpPremiumTable += "</tr>";

					mpPremiumTable += "<tr>";
					mpPremiumTable += "<th>" + item5Kg + "</th>";
					mpPremiumTable +=
						'<th style="text-align: center;">$' + price5Kg + "</th>";
					mpPremiumTable += "</tr>";

					mpPremiumTable += "<tr>";
					mpPremiumTable += "<th>" + item10Kg + "</th>";
					mpPremiumTable +=
						'<th style="text-align: center;">$' + price10Kg + "</th>";
					mpPremiumTable += "</tr>";

					mpPremiumTable += "<tr>";
					mpPremiumTable += "<th>" + item20Kg + "</th>";
					mpPremiumTable +=
						'<th style="text-align: center;">$' + price20Kg + "</th>";
					mpPremiumTable += "</tr>";

					mpPremiumTable += "</tbody></table>";
					mpPremiumTable +=
						'<small><i>Prices exclude GST and <a href="https://mailplus.com.au/shipping-surcharge/">surcharges</a>.</i></small>';

					emailHtml = emailHtml.replace(
						/nlemmppremiumpricingtable/gi,
						mpPremiumTable
					);
				}

				//Email Template: 202404 - MP Premium - New Lead Follow-Up
				if (templateId == 443) {
					var mpPremiumTable =
						'<table border="0" cellpadding="0" cellspacing="1" style="width: 100%;"><thead><tr><th></th><th style="vertical-align: middle;text-align: center;"><b>PREMIUM</b></th></tr></thead><tbody>';

					var mpPremiumProdPricingSearch = nlapiLoadSearch(
						"customrecord_product_pricing",
						"customsearch_mp_premium_prod_pricing"
					);

					var newFilters = new Array();
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"internalid",
						"custrecord_prod_pricing_customer",
						"anyof",
						recId
					);

					mpPremiumProdPricingSearch.addFilters(newFilters);

					var mpPremiumProdPricingSearchResultSet =
						mpPremiumProdPricingSearch.runSearch();

					var item1Kg;
					var item3Kg;
					var item5Kg;
					var item10Kg;
					var item20Kg;

					var price1Kg;
					var price3Kg;
					var price5Kg;
					var price10Kg;
					var price20Kg;

					mpPremiumProdPricingSearchResultSet.forEachResult(function (
						searchResult
					) {
						var prodPricingInternalId = searchResult.getValue("internalid");
						var custId = searchResult.getValue(
							"custrecord_prod_pricing_customer"
						);
						item1Kg = searchResult.getText("custrecord_prod_pricing_1kg");
						item3Kg = searchResult.getText("custrecord_prod_pricing_3kg");
						item5Kg = searchResult.getText("custrecord_prod_pricing_5kg");
						item10Kg = searchResult.getText("custrecord_prod_pricing_10kg");
						item20Kg = searchResult.getText("custrecord_prod_pricing_20kg");

						price1Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_1KG",
							null
						);
						price3Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_3KG",
							null
						);
						price5Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_5KG",
							null
						);
						price10Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_10KG",
							null
						);
						price20Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_20KG",
							null
						);

						return true;
					});

					mpPremiumTable += "<tr>";
					mpPremiumTable += "<th>" + item1Kg + "</th>";
					mpPremiumTable +=
						'<th style="text-align: center;">$' + price1Kg + "</th>";
					mpPremiumTable += "</tr>";

					mpPremiumTable += "<tr>";
					mpPremiumTable += "<th>" + item3Kg + "</th>";
					mpPremiumTable +=
						'<th style="text-align: center;">$' + price3Kg + "</th>";
					mpPremiumTable += "</tr>";

					mpPremiumTable += "<tr>";
					mpPremiumTable += "<th>" + item5Kg + "</th>";
					mpPremiumTable +=
						'<th style="text-align: center;">$' + price5Kg + "</th>";
					mpPremiumTable += "</tr>";

					mpPremiumTable += "<tr>";
					mpPremiumTable += "<th>" + item10Kg + "</th>";
					mpPremiumTable +=
						'<th style="text-align: center;">$' + price10Kg + "</th>";
					mpPremiumTable += "</tr>";

					mpPremiumTable += "<tr>";
					mpPremiumTable += "<th>" + item20Kg + "</th>";
					mpPremiumTable +=
						'<th style="text-align: center;">$' + price20Kg + "</th>";
					mpPremiumTable += "</tr>";

					mpPremiumTable += "</tbody></table>";
					mpPremiumTable +=
						'<small><i>Prices exclude GST and <a href="https://mailplus.com.au/shipping-surcharge/">surcharges</a>.</i></small>';

					emailHtml = emailHtml.replace(
						/nlemmppremiumpricingtable/gi,
						mpPremiumTable
					);
				}

				//202404 - Premium - Your Shipping Usage
				if (templateId == 432) {
					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");

					var salesRepDetailsSearch = nlapiLoadSearch(
						"customrecord_sales",
						"customsearch_sales_record_auto_signed__3"
					);

					var newFiltersSalesRep = new Array();
					newFiltersSalesRep[0] = new nlobjSearchFilter(
						"internalid",
						"custrecord_sales_assigned",
						"anyof",
						salesRep
					);

					salesRepDetailsSearch.addFilters(newFiltersSalesRep);

					var salesRepDetailsSearchResults = salesRepDetailsSearch.runSearch();

					var salesRepDetailsName = "";
					var salesRepDetailsEmail = "";
					var salesRepDetailsPhone = "";

					salesRepDetailsSearchResults.forEachResult(function (
						salesRepDetailsSearchResultSet
					) {
						salesRepDetailsName = salesRepDetailsSearchResultSet.getText(
							"custrecord_sales_assigned",
							null,
							"GROUP"
						);
						salesRepDetailsEmail = salesRepDetailsSearchResultSet.getValue(
							"email",
							"CUSTRECORD_SALES_ASSIGNED",
							"GROUP"
						);
						salesRepDetailsPhone = salesRepDetailsSearchResultSet.getValue(
							"phone",
							"CUSTRECORD_SALES_ASSIGNED",
							"GROUP"
						);

						return true;
					});

					emailHtml = emailHtml.replace(/nlemcontactfirstname/gi, firstname);
					emailHtml = emailHtml.replace(
						/nlemsalesreptext/gi,
						salesRepDetailsName
					);
				}

				//	202404 - Premium Old Leads - eDM Campaign
				if (templateId == 435) {
					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");

					var salesRepDetailsSearch = nlapiLoadSearch(
						"customrecord_sales",
						"customsearch_sales_record_auto_signed__3"
					);

					var newFiltersSalesRep = new Array();
					newFiltersSalesRep[0] = new nlobjSearchFilter(
						"internalid",
						"custrecord_sales_assigned",
						"anyof",
						salesRep
					);

					salesRepDetailsSearch.addFilters(newFiltersSalesRep);

					var salesRepDetailsSearchResults = salesRepDetailsSearch.runSearch();

					var salesRepDetailsName = "";
					var salesRepDetailsEmail = "";
					var salesRepDetailsPhone = "";

					salesRepDetailsSearchResults.forEachResult(function (
						salesRepDetailsSearchResultSet
					) {
						salesRepDetailsName = salesRepDetailsSearchResultSet.getText(
							"custrecord_sales_assigned",
							null,
							"GROUP"
						);
						salesRepDetailsEmail = salesRepDetailsSearchResultSet.getValue(
							"email",
							"CUSTRECORD_SALES_ASSIGNED",
							"GROUP"
						);
						salesRepDetailsPhone = salesRepDetailsSearchResultSet.getValue(
							"phone",
							"CUSTRECORD_SALES_ASSIGNED",
							"GROUP"
						);

						return true;
					});

					emailHtml = emailHtml.replace(/nlemcontactfirstname/gi, firstname);
					emailHtml = emailHtml.replace(
						/nlemsalesreptext/gi,
						salesRepDetailsName
					);
				}

				//Email Template Name: 20230418 - New Lead Enquiry Email
				if (templateId == 390) {
					var salesRepDetailsSearch = nlapiLoadSearch(
						"customrecord_sales",
						"customsearch_sales_record_auto_signed__3"
					);

					var newFiltersSalesRep = new Array();
					newFiltersSalesRep[0] = new nlobjSearchFilter(
						"internalid",
						"custrecord_sales_assigned",
						"anyof",
						salesRep
					);

					salesRepDetailsSearch.addFilters(newFiltersSalesRep);

					var salesRepDetailsSearchResults = salesRepDetailsSearch.runSearch();

					var salesRepDetailsName = "";
					var salesRepDetailsEmail = "";
					var salesRepDetailsPhone = "";

					salesRepDetailsSearchResults.forEachResult(function (
						salesRepDetailsSearchResultSet
					) {
						salesRepDetailsName = salesRepDetailsSearchResultSet.getText(
							"custrecord_sales_assigned",
							null,
							"GROUP"
						);
						salesRepDetailsEmail = salesRepDetailsSearchResultSet.getValue(
							"email",
							"CUSTRECORD_SALES_ASSIGNED",
							"GROUP"
						);
						salesRepDetailsPhone = salesRepDetailsSearchResultSet.getValue(
							"phone",
							"CUSTRECORD_SALES_ASSIGNED",
							"GROUP"
						);

						return true;
					});

					emailHtml = emailHtml.replace(
						/<nlemsalesrepname>/gi,
						salesRepDetailsName
					);
					emailHtml = emailHtml.replace(
						/<nlemsalesrepphone>/gi,
						salesRepDetailsEmail
					);
					emailHtml = emailHtml.replace(
						/<nlemsalesrepemail>/gi,
						salesRepDetailsPhone
					);
					emailHtml = emailHtml.replace(
						/<nlemsalesrepemailsignature>/gi,
						salesRepDetailsName
					);
				}

				//Email Template Name: 20241113 - T1 - Automated Acknowledgment Email
				if (templateId == 474) {
					var salesRepDetailsSearch = nlapiLoadSearch(
						"customrecord_sales",
						"customsearch_sales_record_auto_signed__3"
					);

					var newFiltersSalesRep = new Array();
					newFiltersSalesRep[0] = new nlobjSearchFilter(
						"internalid",
						"custrecord_sales_assigned",
						"anyof",
						salesRep
					);

					salesRepDetailsSearch.addFilters(newFiltersSalesRep);

					var salesRepDetailsSearchResults = salesRepDetailsSearch.runSearch();

					var salesRepDetailsName = "";
					var salesRepDetailsEmail = "";
					var salesRepDetailsPhone = "";

					salesRepDetailsSearchResults.forEachResult(function (
						salesRepDetailsSearchResultSet
					) {
						salesRepDetailsName = salesRepDetailsSearchResultSet.getText(
							"custrecord_sales_assigned",
							null,
							"GROUP"
						);
						salesRepDetailsEmail = salesRepDetailsSearchResultSet.getValue(
							"email",
							"CUSTRECORD_SALES_ASSIGNED",
							"GROUP"
						);
						salesRepDetailsPhone = salesRepDetailsSearchResultSet.getValue(
							"phone",
							"CUSTRECORD_SALES_ASSIGNED",
							"GROUP"
						);

						return true;
					});

					emailHtml = emailHtml.replace(/nlemcontactname/gi, addressee);
					emailHtml = emailHtml.replace(
						/nlemsalesrepname/gi,
						salesRepDetailsName
					);

					emailHtml = emailHtml.replace(
						/nlemsalesrepphone/gi,
						salesRepDetailsPhone
					);

					emailHtml = emailHtml.replace(
						/nlemsalesrepemail/gi,
						salesRepDetailsEmail
					);

					emailHtml = emailHtml.replace(
						/nlemsalesrepemailsignature/gi,
						salesRepDetailsName
					);
				}

				//Email Template Names:
				//  Sales Lead - Sign Up Email
				//  Sales Lead - Are you interested
				//  202301 - Sales - Lost - No Response
				if (templateId == 374 || templateId == 378 || templateId == 382) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");
					var partner_id = customer_record.getFieldValue("partner");
					var usage_per_week = customer_record.getFieldValue(
						"custentity_form_mpex_usage_per_week"
					);

					//Get Premium, Express 7 Standard Surcharges at the Customer Level
					var premiumSurcharge = customer_record.getFieldValue("custentity_startrack_fuel_surcharge");
					var expressSurcharge = customer_record.getFieldValue("custentity_mpex_surcharge_rate");
					var standardSurcharge = customer_record.getFieldValue("custentity_sendle_fuel_surcharge");

					var previous_carrier = customer_record.getFieldValue(
						"custentity_previous_carrier"
					);

					var partner_record = nlapiLoadRecord("partner", partner_id);
					var mp_std_activated = partner_record.getFieldValue(
						"custentity_zee_mp_std_activated"
					);

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");
					var lastname = recContact.getFieldValue("lastname");

					var searched_address = nlapiLoadSearch(
						"customer",
						"customsearch_smc_address"
					);

					var newFilters_addresses = new Array();
					newFilters_addresses[0] = new nlobjSearchFilter(
						"internalid",
						null,
						"is",
						recId
					);

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
							id = searchResult_address.getValue(
								"addressinternalid",
								"Address",
								null
							);
							addr1 = searchResult_address.getValue(
								"address1",
								"Address",
								null
							);
							addr2 = searchResult_address.getValue(
								"address2",
								"Address",
								null
							);
							city = searchResult_address.getValue("city", "Address", null);
							state = searchResult_address.getValue("state", "Address", null);
							zip = searchResult_address.getValue("zipcode", "Address", null);

							return true;
						});
					}

					var salesRepDetailsSearch = nlapiLoadSearch(
						"customrecord_sales",
						"customsearch_sales_record_auto_signed__3"
					);

					var newFiltersSalesRep = new Array();
					newFiltersSalesRep[0] = new nlobjSearchFilter(
						"internalid",
						"custrecord_sales_assigned",
						"anyof",
						salesRep
					);

					salesRepDetailsSearch.addFilters(newFiltersSalesRep);

					var salesRepDetailsSearchResults = salesRepDetailsSearch.runSearch();

					var salesRepDetailsName = "";
					var salesRepDetailsEmail = "";
					var salesRepDetailsPhone = "";

					salesRepDetailsSearchResults.forEachResult(function (
						salesRepDetailsSearchResultSet
					) {
						salesRepDetailsName = salesRepDetailsSearchResultSet.getText(
							"custrecord_sales_assigned",
							null,
							"GROUP"
						);
						salesRepDetailsEmail = salesRepDetailsSearchResultSet.getValue(
							"email",
							"CUSTRECORD_SALES_ASSIGNED",
							"GROUP"
						);
						salesRepDetailsPhone = salesRepDetailsSearchResultSet.getValue(
							"phone",
							"CUSTRECORD_SALES_ASSIGNED",
							"GROUP"
						);

						return true;
					});

					emailHtml = emailHtml.replace(
						/<nlemsalesrepname>/gi,
						salesRepDetailsName
					);
					emailHtml = emailHtml.replace(
						/<nlemsalesrepphone>/gi,
						salesRepDetailsEmail
					);
					emailHtml = emailHtml.replace(
						/<nlemsalesrepemail>/gi,
						salesRepDetailsPhone
					);
					emailHtml = emailHtml.replace(
						/<nlemsalesrepemailsignature>/gi,
						salesRepDetailsName
					);

					var signUp =
						'<a class="mcnButton " href="https://mailplus.com.au/sign-up/?custinternalid=' +
						recId +
						"&custname=" +
						encodeURIComponent(companyname) +
						"&email=" +
						contactEmail +
						"&phone=" +
						contactPhone +
						"&firstname=" +
						firstname +
						"&lastname=" +
						lastname +
						"&contactid=" +
						contactID +
						"&state=" +
						state +
						"&salesRep=" +
						salesRep +
						'" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Create my account</a>';

					var bookACall =
						'<a class="mcnButton " href="https://mailplus.com.au/book-a-sales-call/?custinternalid=' +
						recId +
						"&custname=" +
						encodeURIComponent(companyname) +
						"&email=" +
						contactEmail +
						"&phone=" +
						contactPhone +
						"&firstname=" +
						firstname +
						"&lastname=" +
						lastname +
						"&contactid=" +
						contactID +
						'" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Book a Call</a>';

					var notInterested =
						'<a class="mcnButton " href="https://mailplus.com.au/not-interested/?custinternalid=' +
						recId +
						"&custname=" +
						encodeURIComponent(companyname) +
						'" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Not Interested</a>';

					if (
						(mp_std_activated != 1 && mp_std_activated != "1") ||
						previous_carrier == 3 ||
						previous_carrier == 7 ||
						previous_carrier == 5
					) {
						var nostdactive =
							'<br><span style="color:#FF0000">Standard delivery is not available in your&nbsp;area just yet. We will let you know as soon as it has&nbsp;expanded to your pickup location.</span><br><br>';
						emailHtml = emailHtml.replace(/<nlemnostdactive>/gi, nostdactive);
					}
					if (usage_per_week == 2) {
						var usage20to100perWeek =
							"Further discounts may be applicable depending on your frequency.<br/>";

						emailHtml = emailHtml.replace(
							/<nlem20to100perweek>/gi,
							usage20to100perWeek
						);
					}
					emailHtml = emailHtml.replace(/<nlemsignup>/gi, signUp);
					emailHtml = emailHtml.replace(/<nlembookacall>/gi, bookACall);
					emailHtml = emailHtml.replace(/<nlemnotinterested>/gi, notInterested);
					emailHtml = emailHtml.replace(/<nlemcontactfirstname>/gi, firstname);

					//NS Search: Product Pricing - Letters - Quotes
					var prodPricingLetterstobeSentSearch = nlapiLoadSearch(
						"customrecord_product_pricing",
						"customsearch_prod_pricing_letters_quotes"
					);

					var newFilters = new Array();
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"internalid",
						"custrecord_prod_pricing_customer",
						"anyof",
						recId
					);

					prodPricingLetterstobeSentSearch.addFilters(newFilters);

					var resultSetProdPricingLetters =
						prodPricingLetterstobeSentSearch.runSearch();

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

					var mpPrm1kg = [];
					var mpPrm3kg = [];
					var mpPrm5kg = [];
					var mpPrm10kg = [];
					var mpPrm20kg = [];

					var oldCustomerId = null;
					var count = 0;
					var oldDeliverySpeed = null;

					resultSetProdPricingLetters.forEachResult(function (searchResult) {
						var prodPricingInternalId = searchResult.getValue("internalid");
						var custId = searchResult.getValue(
							"custrecord_prod_pricing_customer"
						);
						var deliverySpeed = searchResult.getValue(
							"custrecord_prod_pricing_delivery_speeds"
						);
						var pricePlan250g = searchResult.getValue(
							"custrecord_prod_pricing_250g"
						);
						var price250g = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_250G",
							null
						);
						var pricePlan500g = searchResult.getValue(
							"custrecord_prod_pricing_500g"
						);
						var price500g = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_500G",
							null
						);
						var pricePlan1Kg = searchResult.getValue(
							"custrecord_prod_pricing_1kg"
						);
						var price1Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_1KG",
							null
						);
						var pricePlan3Kg = searchResult.getValue(
							"custrecord_prod_pricing_3kg"
						);
						var price3Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_3KG",
							null
						);
						var pricePlan5Kg = searchResult.getValue(
							"custrecord_prod_pricing_5kg"
						);
						var price5Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_5KG",
							null
						);
						var pricePlan10Kg = searchResult.getValue(
							"custrecord_prod_pricing_10kg"
						);
						var price10Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_10KG",
							null
						);
						var pricePlan20Kg = searchResult.getValue(
							"custrecord_prod_pricing_20kg"
						);
						var price20Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_20KG",
							null
						);
						var pricePlan25Kg = searchResult.getValue(
							"custrecord_prod_pricing_25kg"
						);
						var price25Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_25KG",
							null
						);

						nlapiLogExecution("DEBUG", "deliverySpeed", deliverySpeed);
						nlapiLogExecution("DEBUG", "custId", custId);
						nlapiLogExecution("DEBUG", "price250g", price250g);
						nlapiLogExecution("DEBUG", "price500g", price500g);
						nlapiLogExecution("DEBUG", "price1Kg", price1Kg);
						nlapiLogExecution("DEBUG", "price3Kg", price3Kg);
						nlapiLogExecution("DEBUG", "price5Kg", price5Kg);
						nlapiLogExecution("DEBUG", "price10Kg", price10Kg);
						nlapiLogExecution("DEBUG", "price20Kg", price20Kg);
						nlapiLogExecution("DEBUG", "price25Kg", price25Kg);

						if (count == 0) {
							if (deliverySpeed == 2) {
								mpExp500g.push({ price500g: price500g, price500gGST: price500g * 1.1, price500gwithGSTSurcharge: ((((price500g * 1.1) * expressSurcharge) / 100) + (price500g * 1.1)) });
								mpExp1kg.push({ price1Kg: price1Kg, price1KgGST: price1Kg * 1.1, price1KgwithGSTSurcharge: ((((price1Kg * 1.1) * expressSurcharge) / 100) + (price1Kg * 1.1)) });
								mpExp3kg.push({ price3Kg: price3Kg, price3KgGST: price3Kg * 1.1, price3KgwithGSTSurcharge: ((((price3Kg * 1.1) * expressSurcharge) / 100) + (price3Kg * 1.1)) });
								mpExp5kg.push({ price5Kg: price5Kg, price5KgGST: price5Kg * 1.1, price5KgwithGSTSurcharge: ((((price5Kg * 1.1) * expressSurcharge) / 100) + (price5Kg * 1.1)) });
							} else if (deliverySpeed == 1) {
								mpStd250g.push({ price250g: price250g, price250gGST: price250g * 1.1, price250gwithGSTSurcharge: ((((price250g * 1.1) * standardSurcharge) / 100) + (price250g * 1.1)) });
								mpStd500g.push({ price500g: price500g, price500gGST: price500g * 1.1, price500gwithGSTSurcharge: ((((price500g * 1.1) * standardSurcharge) / 100) + (price500g * 1.1)) });
								mpStd1kg.push({ price1Kg: price1Kg, price1KgGST: price1Kg * 1.1, price1KgwithGSTSurcharge: ((((price1Kg * 1.1) * standardSurcharge) / 100) + (price1Kg * 1.1)) });
								mpStd3kg.push({ price3Kg: price3Kg, price3KgGST: price3Kg * 1.1, price3KgwithGSTSurcharge: ((((price3Kg * 1.1) * standardSurcharge) / 100) + (price3Kg * 1.1)) });
								mpStd5kg.push({ price5Kg: price5Kg, price5KgGST: price5Kg * 1.1, price5KgwithGSTSurcharge: ((((price5Kg * 1.1) * standardSurcharge) / 100) + (price5Kg * 1.1)) });
								mpStd10kg.push({ price10Kg: price10Kg, price10KgGST: price10Kg * 1.1, price10KgwithGSTSurcharge: ((((price10Kg * 1.1) * standardSurcharge) / 100) + (price10Kg * 1.1)) });
								mpStd20kg.push({ price20Kg: price20Kg, price20KgGST: price20Kg * 1.1, price20KgwithGSTSurcharge: ((((price20Kg * 1.1) * standardSurcharge) / 100) + (price20Kg * 1.1)) });
								mpStd25kg.push({ price25Kg: price25Kg, price25KgGST: price25Kg * 1.1, price25KgwithGSTSurcharge: ((((price25Kg * 1.1) * standardSurcharge) / 100) + (price25Kg * 1.1)) });
							} else if (deliverySpeed == 4) {
								mpPrm1kg.push({ price1Kg: price1Kg, price1KgGST: price1Kg * 1.1, price1KgwithGSTSurcharge: ((((price1Kg * 1.1) * premiumSurcharge) / 100) + (price1Kg * 1.1)) });
								mpPrm3kg.push({ price3Kg: price3Kg, price3KgGST: price3Kg * 1.1, price3KgwithGSTSurcharge: ((((price3Kg * 1.1) * premiumSurcharge) / 100) + (price3Kg * 1.1)) });
								mpPrm5kg.push({ price5Kg: price5Kg, price5KgGST: price5Kg * 1.1, price5KgwithGSTSurcharge: ((((price5Kg * 1.1) * premiumSurcharge) / 100) + (price5Kg * 1.1)) });
								mpPrm10kg.push({ price10Kg: price10Kg, price10KgGST: price10Kg * 1.1, price10KgwithGSTSurcharge: ((((price10Kg * 1.1) * premiumSurcharge) / 100) + (price10Kg * 1.1)) });
								mpPrm20kg.push({ price20Kg: price20Kg, price20KgGST: price20Kg * 1.1, price20KgwithGSTSurcharge: ((((price20Kg * 1.1) * premiumSurcharge) / 100) + (price20Kg * 1.1)) });
							}
						} else if (oldCustomerId == custId) {
							nlapiLogExecution(
								"DEBUG",
								"Same customer: oldCustomerId",
								oldCustomerId
							);
							nlapiLogExecution(
								"DEBUG",
								"Same customer: oldDeliverySpeed",
								oldDeliverySpeed
							);
							if (oldDeliverySpeed == deliverySpeed) {
								nlapiDeleteRecord(
									"customrecord_product_pricing",
									prodPricingInternalId
								);
								count--;
							} else {
								if (deliverySpeed == 2) {
									mpExp500g.push({ price500g: price500g, price500gGST: price500g * 1.1, price500gwithGSTSurcharge: ((((price500g * 1.1) * expressSurcharge) / 100) + (price500g * 1.1)) });
									mpExp1kg.push({ price1Kg: price1Kg, price1KgGST: price1Kg * 1.1, price1KgwithGSTSurcharge: ((((price1Kg * 1.1) * expressSurcharge) / 100) + (price1Kg * 1.1)) });
									mpExp3kg.push({ price3Kg: price3Kg, price3KgGST: price3Kg * 1.1, price3KgwithGSTSurcharge: ((((price3Kg * 1.1) * expressSurcharge) / 100) + (price3Kg * 1.1)) });
									mpExp5kg.push({ price5Kg: price5Kg, price5KgGST: price5Kg * 1.1, price5KgwithGSTSurcharge: ((((price5Kg * 1.1) * expressSurcharge) / 100) + (price5Kg * 1.1)) });
								} else if (deliverySpeed == 1) {
									mpStd250g.push({ price250g: price250g, price250gGST: price250g * 1.1, price250gwithGSTSurcharge: ((((price250g * 1.1) * standardSurcharge) / 100) + (price250g * 1.1)) });
									mpStd500g.push({ price500g: price500g, price500gGST: price500g * 1.1, price500gwithGSTSurcharge: ((((price500g * 1.1) * standardSurcharge) / 100) + (price500g * 1.1)) });
									mpStd1kg.push({ price1Kg: price1Kg, price1KgGST: price1Kg * 1.1, price1KgwithGSTSurcharge: ((((price1Kg * 1.1) * standardSurcharge) / 100) + (price1Kg * 1.1)) });
									mpStd3kg.push({ price3Kg: price3Kg, price3KgGST: price3Kg * 1.1, price3KgwithGSTSurcharge: ((((price3Kg * 1.1) * standardSurcharge) / 100) + (price3Kg * 1.1)) });
									mpStd5kg.push({ price5Kg: price5Kg, price5KgGST: price5Kg * 1.1, price5KgwithGSTSurcharge: ((((price5Kg * 1.1) * standardSurcharge) / 100) + (price5Kg * 1.1)) });
									mpStd10kg.push({ price10Kg: price10Kg, price10KgGST: price10Kg * 1.1, price10KgwithGSTSurcharge: ((((price10Kg * 1.1) * standardSurcharge) / 100) + (price10Kg * 1.1)) });
									mpStd20kg.push({ price20Kg: price20Kg, price20KgGST: price20Kg * 1.1, price20KgwithGSTSurcharge: ((((price20Kg * 1.1) * standardSurcharge) / 100) + (price20Kg * 1.1)) });
									mpStd25kg.push({ price25Kg: price25Kg, price25KgGST: price25Kg * 1.1, price25KgwithGSTSurcharge: ((((price25Kg * 1.1) * standardSurcharge) / 100) + (price25Kg * 1.1)) });
								} else if (deliverySpeed == 4) {
									mpPrm1kg.push({ price1Kg: price1Kg, price1KgGST: price1Kg * 1.1, price1KgwithGSTSurcharge: ((((price1Kg * 1.1) * premiumSurcharge) / 100) + (price1Kg * 1.1)) });
									mpPrm3kg.push({ price3Kg: price3Kg, price3KgGST: price3Kg * 1.1, price3KgwithGSTSurcharge: ((((price3Kg * 1.1) * premiumSurcharge) / 100) + (price3Kg * 1.1)) });
									mpPrm5kg.push({ price5Kg: price5Kg, price5KgGST: price5Kg * 1.1, price5KgwithGSTSurcharge: ((((price5Kg * 1.1) * premiumSurcharge) / 100) + (price5Kg * 1.1)) });
									mpPrm10kg.push({ price10Kg: price10Kg, price10KgGST: price10Kg * 1.1, price10KgwithGSTSurcharge: ((((price10Kg * 1.1) * premiumSurcharge) / 100) + (price10Kg * 1.1)) });
									mpPrm20kg.push({ price20Kg: price20Kg, price20KgGST: price20Kg * 1.1, price20KgwithGSTSurcharge: ((((price20Kg * 1.1) * premiumSurcharge) / 100) + (price20Kg * 1.1)) });
								}
							}
						}

						oldCustomerId = custId;
						oldDeliverySpeed = deliverySpeed;
						count++;
						return true;
					});

					if (count > 0 && !isNullorEmpty(oldCustomerId)) {

						nlapiLogExecution("DEBUG", "Express", "");
						nlapiLogExecution("DEBUG", "Out loop:Express Rates ", JSON.stringify(mpExp5kg));
						nlapiLogExecution("DEBUG", "Out loop:Express Rates ", JSON.stringify(mpExp3kg));
						nlapiLogExecution("DEBUG", "Out loop:Express Rates ", JSON.stringify(mpExp1kg));
						nlapiLogExecution("DEBUG", "Out loop:Express Rates ", JSON.stringify(mpExp500g));

						nlapiLogExecution("DEBUG", "Standard", "");
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd20kg));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd25kg));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd10kg));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd5kg));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd3kg));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd1kg));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd500g));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd250g));

						nlapiLogExecution("DEBUG", "Premium", "");
						nlapiLogExecution("DEBUG", "Out loop:Premium Rates ", JSON.stringify(mpPrm1kg));
						nlapiLogExecution("DEBUG", "Out loop:Premium Rates ", JSON.stringify(mpPrm3kg));
						nlapiLogExecution("DEBUG", "Out loop:Premium Rates ", JSON.stringify(mpPrm5kg));
						nlapiLogExecution("DEBUG", "Out loop:Premium Rates ", JSON.stringify(mpPrm10kg));
						nlapiLogExecution("DEBUG", "Out loop:Premium Rates ", JSON.stringify(mpPrm20kg));

						//EXPRESS
						if (mpExp5kg.length == 0) {
							mpExp5kg.push({ price5Kg: 0, price5KgGST: 0, price5KgwithGSTSurcharge: 0 });
						}
						if (mpExp3kg.length == 0) {
							mpExp3kg.push({ price3Kg: 0, price3KgGST: 0, price3KgwithGSTSurcharge: 0 });
						}
						if (mpExp1kg.length == 0) {
							mpExp1kg.push({ price1Kg: 0, price1KgGST: 0, price1KgwithGSTSurcharge: 0 });
						}
						if (mpExp500g.length == 0) {
							mpExp500g.push({ price500g: 0, price500gGST: 0, price500gwithGSTSurcharge: 0 });
						}

						emailHtml = emailHtml.replace(/nlem5kgexp/gi, parseFloat(mpExp5kg[0].price5Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem3kgexp/gi, parseFloat(mpExp3kg[0].price3Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem1kgexp/gi, parseFloat(mpExp1kg[0].price1Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem500gexp/gi, parseFloat(mpExp500g[0].price500g).toFixed(2));
						emailHtml = emailHtml.replace(/nlem5kgwithgstwithfuelexp/gi, parseFloat(mpExp5kg[0].price5KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem3kgwithgstwithfuelexp/gi, parseFloat(mpExp3kg[0].price3KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem1kgwithgstwithfuelexp/gi, parseFloat(mpExp1kg[0].price1KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem500gwithgstwithfuelexp/gi, parseFloat(mpExp500g[0].price500gwithGSTSurcharge).toFixed(2));
						//STANDARD
						if (mpStd20kg.length == 0) {
							mpStd20kg.push({ price20Kg: 0, price20KgGST: 0, price20KgwithGSTSurcharge: 0 });
						}
						if (mpStd25kg.length == 0) {
							mpStd25kg.push({ price25Kg: 0, price25KgGST: 0, price25KgwithGSTSurcharge: 0 });
						}
						if (mpStd10kg.length == 0) {
							mpStd10kg.push({ price10Kg: 0, price10KgGST: 0, price10KgwithGSTSurcharge: 0 });
						}
						if (mpStd5kg.length == 0) {
							mpStd5kg.push({ price5Kg: 0, price5KgGST: 0, price5KgwithGSTSurcharge: 0 });
						}
						if (mpStd3kg.length == 0) {
							mpStd3kg.push({ price3Kg: 0, price3KgGST: 0, price3KgwithGSTSurcharge: 0 });
						}
						if (mpStd1kg.length == 0) {
							mpStd1kg.push({ price1Kg: 0, price1KgGST: 0, price1KgwithGSTSurcharge: 0 });
						}
						if (mpStd500g.length == 0) {
							mpStd500g.push({ price500g: 0, price500gGST: 0, price500gwithGSTSurcharge: 0 });
						}
						if (mpStd250g.length == 0) {
							mpStd250g.push({ price250g: 0, price250gGST: 0, price250gwithGSTSurcharge: 0 });
						}

						emailHtml = emailHtml.replace(/nlem20kgstd/gi, parseFloat(mpStd20kg[0].price20Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem25kgstd/gi, parseFloat(mpStd25kg[0].price25Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem10kgstd/gi, parseFloat(mpStd10kg[0].price10Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem5kgstd/gi, parseFloat(mpStd5kg[0].price5Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem3kgstd/gi, parseFloat(mpStd3kg[0].price3Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem1kgstd/gi, parseFloat(mpStd1kg[0].price1Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem500gstd/gi, parseFloat(mpStd500g[0].price500g).toFixed(2));
						emailHtml = emailHtml.replace(/nlem250gstd/gi, parseFloat(mpStd250g[0].price250g).toFixed(2));
						emailHtml = emailHtml.replace(/nlem20kgwithgstwithfuelstd/gi, parseFloat(mpStd20kg[0].price20KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem25kgwithgstwithfuelstd/gi, parseFloat(mpStd25kg[0].price25KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem10kgwithgstwithfuelstd/gi, parseFloat(mpStd10kg[0].price10KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem5kgwithgstwithfuelstd/gi, parseFloat(mpStd5kg[0].price5KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem3kgwithgstwithfuelstd/gi, parseFloat(mpStd3kg[0].price3KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem1kgwithgstwithfuelstd/gi, parseFloat(mpStd1kg[0].price1KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem500gwithgstwithfuelstd/gi, parseFloat(mpStd500g[0].price500gwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem250gwithgstwithfuelstd/gi, parseFloat(mpStd250g[0].price250gwithGSTSurcharge).toFixed(2));
						//PREMIUM
						if (mpPrm1kg.length == 0) {
							mpPrm1kg.push({ price1Kg: 0, price1KgGST: 0, price1KgwithGSTSurcharge: 0 });
						}
						if (mpPrm3kg.length == 0) {
							mpPrm3kg.push({ price3Kg: 0, price3KgGST: 0, price3KgwithGSTSurcharge: 0 });
						}
						if (mpPrm5kg.length == 0) {
							mpPrm5kg.push({ price5Kg: 0, price5KgGST: 0, price5KgwithGSTSurcharge: 0 });
						}
						if (mpPrm10kg.length == 0) {
							mpPrm10kg.push({ price10Kg: 0, price10KgGST: 0, price10KgwithGSTSurcharge: 0 });
						}
						if (mpPrm20kg.length == 0) {
							mpPrm20kg.push({ price20Kg: 0, price20KgGST: 0, price20KgwithGSTSurcharge: 0 });
						}



						emailHtml = emailHtml.replace(/nlem1kgprm/gi, parseFloat(mpPrm1kg[0].price1Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem3kgprm/gi, parseFloat(mpPrm3kg[0].price3Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem5kgprm/gi, parseFloat(mpPrm5kg[0].price5Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem10kgprm/gi, parseFloat(mpPrm10kg[0].price10Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem20kgprm/gi, parseFloat(mpPrm20kg[0].price20Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem1kgwithgstwithfuelprm/gi, parseFloat(mpPrm1kg[0].price1KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem3kgwithgstwithfuelprm/gi, parseFloat(mpPrm3kg[0].price3KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem5kgwithgstwithfuelprm/gi, parseFloat(mpPrm5kg[0].price5KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem10kgwithgstwithfuelprm/gi, parseFloat(mpPrm10kg[0].price10KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem20kgwithgstwithfuelprm/gi, parseFloat(mpPrm20kg[0].price20KgwithGSTSurcharge).toFixed(2));
					}

					//Set Current Month & Year for the product rate table
					emailHtml = emailHtml.replace(/nlemmonthyear/gi, getCurrentMonthYear());
				}

				//Email template Name: 202231106 - Kellyville & Stanhope LPO - Cover Letter
				if (templateId == 413) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var partner_id = customer_record.getFieldValue("partner");
					var partner_record = nlapiLoadRecord("partner", partner_id);
					var zee_contact_name = partner_record.getFieldValue("custentity3");
					var zee_mobile_number = partner_record.getFieldValue("custentity2");
					var zee_first_name = partner_record.getFieldValue(
						"custentity_franchisee_firstname"
					);

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");
					var lastname = recContact.getFieldValue("lastname");

					emailHtml = emailHtml.replace(/<nlemcontactname>/gi, firstname);
					emailHtml = emailHtml.replace(
						/<nlemzeecontactname>/gi,
						zee_contact_name
					);
					emailHtml = emailHtml.replace(
						/<nlemzeecontactnumber>/gi,
						zee_mobile_number
					);
					emailHtml = emailHtml.replace(
						/<nlemzeecontactfname>/gi,
						zee_first_name
					);
				}

				//Email Template Name: MP Express & Standard Price Points
				if (templateId == 381) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");
					var partner_id = customer_record.getFieldValue("partner");

					var previous_carrier = customer_record.getFieldValue(
						"custentity_previous_carrier"
					);

					var partner_record = nlapiLoadRecord("partner", partner_id);
					var mp_std_activated = partner_record.getFieldValue(
						"custentity_zee_mp_std_activated"
					);

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");
					var lastname = recContact.getFieldValue("lastname");

					var searched_address = nlapiLoadSearch(
						"customer",
						"customsearch_smc_address"
					);

					var newFilters_addresses = new Array();
					newFilters_addresses[0] = new nlobjSearchFilter(
						"internalid",
						null,
						"is",
						recId
					);

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
							id = searchResult_address.getValue(
								"addressinternalid",
								"Address",
								null
							);
							addr1 = searchResult_address.getValue(
								"address1",
								"Address",
								null
							);
							addr2 = searchResult_address.getValue(
								"address2",
								"Address",
								null
							);
							city = searchResult_address.getValue("city", "Address", null);
							state = searchResult_address.getValue("state", "Address", null);
							zip = searchResult_address.getValue("zipcode", "Address", null);

							return true;
						});
					}

					var signUp =
						'<a class="mcnButton " href="https://mailplus.com.au/sign-up/?custinternalid=' +
						recId +
						"&custname=" +
						encodeURIComponent(companyname) +
						"&email=" +
						contactEmail +
						"&phone=" +
						contactPhone +
						"&firstname=" +
						firstname +
						"&lastname=" +
						lastname +
						"&contactid=" +
						contactID +
						"&state=" +
						state +
						"&salesRep=" +
						salesRep +
						'" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Create my free account</a>';

					var bookACall =
						'<a class="mcnButton " href="https://mailplus.com.au/book-a-sales-call/?custinternalid=' +
						recId +
						"&custname=" +
						encodeURIComponent(companyname) +
						"&email=" +
						contactEmail +
						"&phone=" +
						contactPhone +
						"&firstname=" +
						firstname +
						"&lastname=" +
						lastname +
						"&contactid=" +
						contactID +
						'" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Book a Call</a>';

					var notInterested =
						'<a class="mcnButton " href="https://mailplus.com.au/not-interested/?custinternalid=' +
						recId +
						"&custname=" +
						encodeURIComponent(companyname) +
						'" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Not Interested</a>';

					if (
						(mp_std_activated != 1 && mp_std_activated != "1") ||
						previous_carrier == 3 ||
						previous_carrier == 7 ||
						previous_carrier == 5
					) {
						var nostdactive =
							'<br><span style="color:#FF0000">Standard delivery is not available in your&nbsp;area just yet. We will let you know as soon as it has&nbsp;expanded to your pickup location.</span><br><br>';
						emailHtml = emailHtml.replace(/<nlemnostdactive>/gi, nostdactive);
					}

					emailHtml = emailHtml.replace(/<nlemsignup>/gi, signUp);
					emailHtml = emailHtml.replace(/<nlembookacall>/gi, bookACall);
					emailHtml = emailHtml.replace(/<nlemnotinterested>/gi, notInterested);
					emailHtml = emailHtml.replace(/<nlemcontactfirstname>/gi, firstname);

					//NS Search: Product Pricing - Letters - Quotes
					var prodPricingLetterstobeSentSearch = nlapiLoadSearch(
						"customrecord_product_pricing",
						"customsearch_prod_pricing_letters_quotes"
					);

					var newFilters = new Array();
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"internalid",
						"custrecord_prod_pricing_customer",
						"anyof",
						recId
					);

					prodPricingLetterstobeSentSearch.addFilters(newFilters);

					var resultSetProdPricingLetters =
						prodPricingLetterstobeSentSearch.runSearch();

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
						var prodPricingInternalId = searchResult.getValue("internalid");
						var custId = searchResult.getValue(
							"custrecord_prod_pricing_customer"
						);
						var deliverySpeed = searchResult.getValue(
							"custrecord_prod_pricing_delivery_speeds"
						);
						var pricePlan250g = searchResult.getValue(
							"custrecord_prod_pricing_250g"
						);
						var price250g = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_250G",
							null
						);
						var pricePlan500g = searchResult.getValue(
							"custrecord_prod_pricing_500g"
						);
						var price500g = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_500G",
							null
						);
						var pricePlan1Kg = searchResult.getValue(
							"custrecord_prod_pricing_1kg"
						);
						var price1Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_1KG",
							null
						);
						var pricePlan3Kg = searchResult.getValue(
							"custrecord_prod_pricing_3kg"
						);
						var price3Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_3KG",
							null
						);
						var pricePlan5Kg = searchResult.getValue(
							"custrecord_prod_pricing_5kg"
						);
						var price5Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_5KG",
							null
						);
						var pricePlan10Kg = searchResult.getValue(
							"custrecord_prod_pricing_10kg"
						);
						var price10Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_10KG",
							null
						);
						var pricePlan20Kg = searchResult.getValue(
							"custrecord_prod_pricing_20kg"
						);
						var price20Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_20KG",
							null
						);
						var pricePlan25Kg = searchResult.getValue(
							"custrecord_prod_pricing_25kg"
						);
						var price25Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_25KG",
							null
						);

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
								nlapiDeleteRecord(
									"customrecord_product_pricing",
									prodPricingInternalId
								);
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
						var recCustomer = nlapiLoadRecord("customer", oldCustomerId);
						companyname = recCustomer.getFieldValue("companyname");
						customerID = recCustomer.getFieldValue("entityid");
						account_email = recCustomer.getFieldValue("email");
						service_email = recCustomer.getFieldValue(
							"custentity_email_service"
						);

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

				//Email Template Name: Sales Lead - Sales Call Confirmed
				if (templateId == 375) {
					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");
					var lastname = recContact.getFieldValue("lastname");

					var salesCallBookedSearch = nlapiLoadSearch(
						"customer",
						"customsearch_sales_call_booked_tasks"
					);

					var newFilters_addresses = new Array();
					newFilters_addresses[0] = new nlobjSearchFilter(
						"internalid",
						null,
						"is",
						recId
					);

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

					salesCallBookedSearchResult.forEachResult(function (
						salesCallBookedSearchResultSet
					) {
						salesCallDate = salesCallBookedSearchResultSet.getValue(
							"duedate",
							"task",
							null
						);
						salesCallTime = salesCallBookedSearchResultSet.getValue(
							"starttime",
							"task",
							null
						);

						return true;
					});

					// var cal = ics();
					// cal.addEvent("Your MailPlus Sales Call", "This is thirty minute event", "Sydney, AU", salesCallDate + ' ' + salesCallTime);
					// var download = cal.download();

					// nlapiLogExecution('DEBUG', 'download', download);

					var addToCalendarHtml =
						'<a class="mcnButton " href="https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20221128T011500Z%2F20221128T014500Z" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Add to Google Calendar</a> <a class="mcnButton " href="https://outlook.live.com/calendar/0/deeplink/compose?allday=false&enddt=2022-11-28T01%3A45%3A00%2B00%3A00&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=2022-11-28T01%3A15%3A00%2B00%3A00&subject=Your%20MailPlus%20Sales%20Call" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Add to Outlook</a> <a class="mcnButton " href="https://outlook.office.com/calendar/0/deeplink/compose?allday=false&enddt=2022-11-28T01%3A45%3A00%2B00%3A00&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=2022-11-28T01%3A15%3A00%2B00%3A00&subject=Your%20MailPlus%20Sales%20Call" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Add to Office 365</a>';

					nlapiLogExecution("DEBUG", "addToCalendarHtml", addToCalendarHtml);
					emailHtml = emailHtml.replace(
						/<nlemaddtocalendar>/gi,
						addToCalendarHtml
					);
					emailHtml = emailHtml.replace(/<nlemcontactfirstname>/gi, firstname);
					emailHtml = emailHtml.replace(/<nlemsalesdate>/gi, salesCallDate);
					emailHtml = emailHtml.replace(/<nlemsalestime>/gi, salesCallTime);
				}

				//Email Template Name: New Customer - Inform Franchisee
				if (templateId == 377) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					var searched_address = nlapiLoadSearch(
						"customer",
						"customsearch_smc_address"
					);

					var newFilters_addresses = new Array();
					newFilters_addresses[0] = new nlobjSearchFilter(
						"internalid",
						null,
						"is",
						recId
					);

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
							id = searchResult_address.getValue(
								"addressinternalid",
								"Address",
								null
							);
							addr1 = searchResult_address.getValue(
								"address1",
								"Address",
								null
							);
							addr2 = searchResult_address.getValue(
								"address2",
								"Address",
								null
							);
							city = searchResult_address.getValue("city", "Address", null);
							state = searchResult_address.getValue("state", "Address", null);
							zip = searchResult_address.getValue("zipcode", "Address", null);

							return true;
						});
					}

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");

					var customerDetails =
						"Customer Name: " + entityid + " " + companyname;
					var customerAddressDetails =
						"Address: " +
						addr1 +
						", " +
						addr2 +
						", " +
						city +
						" " +
						state +
						" - " +
						zip +
						"</br>";

					var contactDetails = "First Name: " + firstname;
					var contactEmailDetails = "Email: " + contactEmail;
					var contactPhoneDetails = "Phone: " + contactPhone;

					var expIntcustomerVisitederest =
						'<a class="mcnButton" href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1656&deploy=1&compid=1048144&ns-at=AAEJ7tMQx27OOxfPKPXdUYPclyufhLt6bJFrTJqzV-aPHdnre2k&custinternalid=' +
						recId +
						'" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Completed</a>';

					var bookACall =
						'<a class="mcnButton " href="https://mailplus.com.au/book-a-sales-call/?custinternalid=' +
						recId +
						"&custname=" +
						encodeURIComponent(companyname) +
						"&email=" +
						contactEmail +
						"&phone=" +
						contactPhone +
						"&firstname=" +
						firstname +
						"&lastname=" +
						lastname +
						"&contactid=" +
						contactID +
						'" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Book a Call</a>';

					if (!isNullorEmpty(trialEndDate)) {
						var trialEndDateText = "Trial Start Date: " + commdate;
						trialEndDateText +=
							"</br>Trial End Date: " + trialEndDate + "</br>";
						emailHtml = emailHtml.replace(
							/nlemfreetrialdetails/gi,
							trialEndDateText
						);
					} else {
						emailHtml = emailHtml.replace(/nlemfreetrialdetails/gi, "");
					}
					emailHtml = emailHtml.replace(/nlemcommstartdate/gi, commdate);

					emailHtml = emailHtml.replace(
						/nlemcustomerdetails/gi,
						customerDetails
					);
					emailHtml = emailHtml.replace(
						/nlemcustomeraddress/gi,
						customerAddressDetails
					);
					emailHtml = emailHtml.replace(/nlemcontantdetails/gi, contactDetails);
					emailHtml = emailHtml.replace(
						/nlemcontactemail/gi,
						contactEmailDetails
					);
					emailHtml = emailHtml.replace(
						/nlemcontactphone/gi,
						contactPhoneDetails
					);
					emailHtml = emailHtml.replace(
						/nlemcustomervisited/gi,
						expIntcustomerVisitederest
					);
					emailHtml = emailHtml.replace(/nlembookacall/gi, bookACall);
				}

				//Email Template Name: 202405 - LPO Zee - New LPO Trial Customer
				if (templateId == 446) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					var searched_address = nlapiLoadSearch(
						"customer",
						"customsearch_smc_address"
					);

					var newFilters_addresses = new Array();
					newFilters_addresses[0] = new nlobjSearchFilter(
						"internalid",
						null,
						"is",
						recId
					);

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
							id = searchResult_address.getValue(
								"addressinternalid",
								"Address",
								null
							);
							addr1 = searchResult_address.getValue(
								"address1",
								"Address",
								null
							);
							addr2 = searchResult_address.getValue(
								"address2",
								"Address",
								null
							);
							city = searchResult_address.getValue("city", "Address", null);
							state = searchResult_address.getValue("state", "Address", null);
							zip = searchResult_address.getValue("zipcode", "Address", null);

							return true;
						});
					}

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");

					var salesRepDetailsSearch = nlapiLoadSearch(
						"customrecord_sales",
						"customsearch_sales_record_auto_signed__3"
					);

					var newFiltersSalesRep = new Array();
					newFiltersSalesRep[0] = new nlobjSearchFilter(
						"internalid",
						"custrecord_sales_assigned",
						"anyof",
						salesRep
					);

					salesRepDetailsSearch.addFilters(newFiltersSalesRep);

					var salesRepDetailsSearchResults = salesRepDetailsSearch.runSearch();

					var salesRepDetailsName = "";
					var salesRepDetailsEmail = "";
					var salesRepDetailsPhone = "";

					salesRepDetailsSearchResults.forEachResult(function (
						salesRepDetailsSearchResultSet
					) {
						salesRepDetailsName = salesRepDetailsSearchResultSet.getText(
							"custrecord_sales_assigned",
							null,
							"GROUP"
						);
						salesRepDetailsEmail = salesRepDetailsSearchResultSet.getValue(
							"email",
							"CUSTRECORD_SALES_ASSIGNED",
							"GROUP"
						);
						salesRepDetailsPhone = salesRepDetailsSearchResultSet.getValue(
							"phone",
							"CUSTRECORD_SALES_ASSIGNED",
							"GROUP"
						);

						return true;
					});

					var customerDetails =
						"Customer Name: " + entityid + " " + companyname;
					var customerAddressDetails =
						addr1 +
						", " +
						addr2 +
						", " +
						city +
						" " +
						state +
						" - " +
						zip +
						"</br>";

					var contactDetails = firstname;
					var contactEmailDetails = "Email: " + contactEmail;
					var contactPhoneDetails =
						contactDetails + " <b>Phone</b>: " + contactPhone;

					var expIntcustomerVisitederest =
						'<a class="mcnButton" href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1656&deploy=1&compid=1048144&ns-at=AAEJ7tMQx27OOxfPKPXdUYPclyufhLt6bJFrTJqzV-aPHdnre2k&custinternalid=' +
						recId +
						'" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="">Completed</a>';

					if (!isNullorEmpty(trialEndDate)) {
						var trialEndDateText = "<b>Trial Start Date</b>: " + commdate;
						trialEndDateText +=
							"</br><b>Trial End Date</b>: " + trialEndDate + "</br>";
						emailHtml = emailHtml.replace(
							/nlemfreetrialdetails/gi,
							trialEndDateText
						);
					}
					// emailHtml = emailHtml.replace(/<nlemcommstartdate>/gi, commdate);

					emailHtml = emailHtml.replace(/nlemcustomername/gi, customerDetails);
					emailHtml = emailHtml.replace(
						/nlemcustomeraddress/gi,
						customerAddressDetails
					);
					emailHtml = emailHtml.replace(
						/nlemcustomernumber/gi,
						contactPhoneDetails
					);
					emailHtml = emailHtml.replace(
						/nlemconfirmbutton/gi,
						expIntcustomerVisitederest
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrecordlastassigned/gi,
						salesRepDetailsName
					);
				}

				//Email Template Name: 202405 - LPO Zee - Reminder LPO Trial Customer
				if (templateId == 447 || templateId == 452) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					var searched_address = nlapiLoadSearch(
						"customer",
						"customsearch_smc_address"
					);

					var newFilters_addresses = new Array();
					newFilters_addresses[0] = new nlobjSearchFilter(
						"internalid",
						null,
						"is",
						recId
					);

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
							id = searchResult_address.getValue(
								"addressinternalid",
								"Address",
								null
							);
							addr1 = searchResult_address.getValue(
								"address1",
								"Address",
								null
							);
							addr2 = searchResult_address.getValue(
								"address2",
								"Address",
								null
							);
							city = searchResult_address.getValue("city", "Address", null);
							state = searchResult_address.getValue("state", "Address", null);
							zip = searchResult_address.getValue("zipcode", "Address", null);

							return true;
						});
					}

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");

					var customerDetails =
						"Customer Name: " + entityid + " " + companyname;
					var customerAddressDetails =
						addr1 + ", " + addr2 + ", " + city + " " + state + " - " + zip;

					var contactDetails = firstname;
					var contactEmailDetails = "Email: " + contactEmail;
					var contactPhoneDetails =
						contactDetails + " <b>Phone</b>: " + contactPhone;

					var expIntcustomerVisitederest =
						'<a class="mcnButton" href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1656&deploy=1&compid=1048144&ns-at=AAEJ7tMQx27OOxfPKPXdUYPclyufhLt6bJFrTJqzV-aPHdnre2k&custinternalid=' +
						recId +
						'" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Completed</a>';

					var bookACall =
						'<a class="mcnButton " href="https://mailplus.com.au/book-a-sales-call/?custinternalid=' +
						recId +
						"&custname=" +
						encodeURIComponent(companyname) +
						"&email=" +
						contactEmail +
						"&phone=" +
						contactPhone +
						"&firstname=" +
						firstname +
						"&lastname=" +
						lastname +
						"&contactid=" +
						contactID +
						'" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Book a Call</a>';

					var salesRepDetailsSearch = nlapiLoadSearch(
						"customrecord_sales",
						"customsearch_sales_record_auto_signed__3"
					);

					var newFiltersSalesRep = new Array();
					newFiltersSalesRep[0] = new nlobjSearchFilter(
						"internalid",
						"custrecord_sales_assigned",
						"anyof",
						salesRep
					);

					salesRepDetailsSearch.addFilters(newFiltersSalesRep);

					var salesRepDetailsSearchResults = salesRepDetailsSearch.runSearch();

					var salesRepDetailsName = "";
					var salesRepDetailsEmail = "";
					var salesRepDetailsPhone = "";

					salesRepDetailsSearchResults.forEachResult(function (
						salesRepDetailsSearchResultSet
					) {
						salesRepDetailsName = salesRepDetailsSearchResultSet.getText(
							"custrecord_sales_assigned",
							null,
							"GROUP"
						);
						salesRepDetailsEmail = salesRepDetailsSearchResultSet.getValue(
							"email",
							"CUSTRECORD_SALES_ASSIGNED",
							"GROUP"
						);
						salesRepDetailsPhone = salesRepDetailsSearchResultSet.getValue(
							"phone",
							"CUSTRECORD_SALES_ASSIGNED",
							"GROUP"
						);

						return true;
					});

					if (!isNullorEmpty(trialEndDate)) {
						var trialEndDateText = "<b>Trial Start Date</b>: " + commdate;
						trialEndDateText +=
							"</br><b>Trial End Date</b>: " + trialEndDate + "</br>";
						emailHtml = emailHtml.replace(
							/nlemfreetrialdetails/gi,
							trialEndDateText
						);
					}
					// emailHtml = emailHtml.replace(/<nlemcommstartdate>/gi, commdate);

					emailHtml = emailHtml.replace(/nlemcustomername/gi, customerDetails);
					emailHtml = emailHtml.replace(
						/nlemcustomeraddress/gi,
						customerAddressDetails
					);
					// emailHtml = emailHtml.replace(/nlemcontactname/gi, contactDetails);
					// emailHtml = emailHtml.replace(/nlemsalesrecordlastassigned/gi, contactEmailDetails);
					emailHtml = emailHtml.replace(
						/nlemcontactphone/gi,
						contactPhoneDetails
					);
					// emailHtml = emailHtml.replace(/<nlemcustomervisited>/gi, expIntcustomerVisitederest);
					// emailHtml = emailHtml.replace(/<nlembookacall>/gi, bookACall);
					emailHtml = emailHtml.replace(
						/nlemsalesrecordlastassigned/gi,
						salesRepDetailsName
					);
				}

				//Email Template Name: 202405 - LPO Zee - Successful Trial
				if (templateId == 448) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					var searched_address = nlapiLoadSearch(
						"customer",
						"customsearch_smc_address"
					);

					var newFilters_addresses = new Array();
					newFilters_addresses[0] = new nlobjSearchFilter(
						"internalid",
						null,
						"is",
						recId
					);

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
							id = searchResult_address.getValue(
								"addressinternalid",
								"Address",
								null
							);
							addr1 = searchResult_address.getValue(
								"address1",
								"Address",
								null
							);
							addr2 = searchResult_address.getValue(
								"address2",
								"Address",
								null
							);
							city = searchResult_address.getValue("city", "Address", null);
							state = searchResult_address.getValue("state", "Address", null);
							zip = searchResult_address.getValue("zipcode", "Address", null);

							return true;
						});
					}

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");

					var customerDetails =
						"Customer Name: " + entityid + " " + companyname;
					var customerAddressDetails =
						addr1 + ", " + addr2 + ", " + city + " " + state + " - " + zip;

					var contactDetails = firstname;
					var contactEmailDetails = "Email: " + contactEmail;
					var contactPhoneDetails =
						contactDetails + " <b>Phone</b>: " + contactPhone;

					var expIntcustomerVisitederest =
						'<a class="mcnButton" href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1881&deploy=1&compid=1048144&ns-at=AAEJ7tMQK1CXKofoAqhSFTybZKV_oS_pyu7tSRTCHQsWssxiF7A&custinternalid=' +
						recId +
						'" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="">Confirm</a>';

					var salesRepDetailsSearch = nlapiLoadSearch(
						"customrecord_sales",
						"customsearch_sales_record_auto_signed__3"
					);

					var newFiltersSalesRep = new Array();
					newFiltersSalesRep[0] = new nlobjSearchFilter(
						"internalid",
						"custrecord_sales_assigned",
						"anyof",
						salesRep
					);

					salesRepDetailsSearch.addFilters(newFiltersSalesRep);

					var salesRepDetailsSearchResults = salesRepDetailsSearch.runSearch();

					var salesRepDetailsName = "";
					var salesRepDetailsEmail = "";
					var salesRepDetailsPhone = "";

					salesRepDetailsSearchResults.forEachResult(function (
						salesRepDetailsSearchResultSet
					) {
						salesRepDetailsName = salesRepDetailsSearchResultSet.getText(
							"custrecord_sales_assigned",
							null,
							"GROUP"
						);
						salesRepDetailsEmail = salesRepDetailsSearchResultSet.getValue(
							"email",
							"CUSTRECORD_SALES_ASSIGNED",
							"GROUP"
						);
						salesRepDetailsPhone = salesRepDetailsSearchResultSet.getValue(
							"phone",
							"CUSTRECORD_SALES_ASSIGNED",
							"GROUP"
						);

						return true;
					});

					emailHtml = emailHtml.replace(/nlemcustomername/gi, customerDetails);
					emailHtml = emailHtml.replace(
						/nlemcustomeraddress/gi,
						customerAddressDetails
					);
					emailHtml = emailHtml.replace(
						/nlemcontactphone/gi,
						contactPhoneDetails
					);
					emailHtml = emailHtml.replace(
						/nlemconfirmbutton/gi,
						expIntcustomerVisitederest
					);
					emailHtml = emailHtml.replace(
						/nleminvoicestartdate/gi,
						billingstartdate
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrecordlastassigned/gi,
						salesRepDetailsName
					);
				}

				//Email Template Name: 202301 - Verify Services
				if (templateId == 383) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");

					var dynamicSCFURL = null;
					if (!isNullorEmpty(commreg)) {
						var commRegRecord = nlapiLoadRecord('customrecord_commencement_register', commreg);
						dynamicSCFURL = commRegRecord.getFieldValue('custrecord_dynamic_scf_url');
					}

					if (isNullorEmpty(dynamicSCFURL)) {
						var expInterest =
							'<a class="mcnButton " href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1959&deploy=1&compid=1048144&ns-at=AAEJ7tMQCuxUJvJ4RvyaI99vrX6kaBIKkbBebvVixmguZdaobdA&custinternalid=' +
							recId +
							'"  style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Agree">Agree</a>';
					} else {
						var expInterest =
							'<a class="mcnButton " href="' + dynamicSCFURL + '"  style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Agree">Agree</a>';
					}


					// emailHtml = emailHtml.replace(/<nlemsalesrepname>/gi, salesRepName);
					emailHtml = emailHtml.replace(/<nlemagree>/gi, expInterest);
					// emailHtml = emailHtml.replace(/<nlemcontactfirstname>/gi, firstname);
				}

				//Email Template Name: 202402 - Verify Services
				if (templateId == 419) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");

					var dynamicSCFURL = null;
					if (!isNullorEmpty(commreg)) {
						var commRegRecord = nlapiLoadRecord('customrecord_commencement_register', commreg);
						dynamicSCFURL = commRegRecord.getFieldValue('custrecord_dynamic_scf_url');
					}

					if (isNullorEmpty(dynamicSCFURL)) {
						var expInterest =
							'<a class="mcnButton " href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1959&deploy=1&compid=1048144&ns-at=AAEJ7tMQCuxUJvJ4RvyaI99vrX6kaBIKkbBebvVixmguZdaobdA&custinternalid=' +
							recId +
							'"  style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Agree">Agree</a>';
					} else {
						var expInterest =
							'<a class="mcnButton " href="' + dynamicSCFURL + '"  style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Agree">Agree</a>';
					}

					nlapiLogExecution("DEBUG", "commreg", commreg);

					var searched_service_change = nlapiLoadSearch(
						"customrecord_servicechg",
						"customsearch_salesp_service_chg"
					);

					var newFilters = new Array();
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"custrecord_service_customer",
						"CUSTRECORD_SERVICECHG_SERVICE",
						"is",
						recId
					);
					if (!isNullorEmpty(commreg)) {
						newFilters[newFilters.length] = new nlobjSearchFilter(
							"custrecord_servicechg_comm_reg",
							null,
							"is",
							commreg
						);
					}
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"custrecord_servicechg_status",
						null,
						"anyof",
						[1, 2, 4]
					);

					searched_service_change.addFilters(newFilters);

					resultSet_service_change = searched_service_change.runSearch();

					var serviceResult = resultSet_service_change.getResults(0, 6);

					var service = [];
					var serviceFreq = [];
					var price = [];

					var service_freq = "";

					var dateEffective = null;
					var trialEndDate = null;

					var serviceTable =
						'<table border="1" cellpadding="1" cellspacing="1" style="width: 100%;"><thead><tr><th><b>SERVICE NAME</b></th><th style="vertical-align: middle;text-align: center;"><b>FREQUENCY</b></th><th style="vertical-align: middle;text-align: center;"><b>RATE</b></th></tr></thead><tbody>';

					for (n = 0; n < serviceResult.length; n++) {
						var serviceChangeId = serviceResult[n].getValue("internalid");
						var serviceId = serviceResult[n].getValue(
							"custrecord_servicechg_service"
						);
						var serviceText = serviceResult[n].getText(
							"custrecord_servicechg_service"
						);
						var serviceDescp = serviceResult[n].getValue(
							"custrecord_service_description",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var oldServicePrice = serviceResult[n].getValue(
							"custrecord_service_price",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var serviceNSItem = serviceResult[n].getValue(
							"custrecord_service_ns_item",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var serviceNSItemText = serviceResult[n].getText(
							"custrecord_service_ns_item",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var newServiceChangePrice = serviceResult[n].getValue(
							"custrecord_servicechg_new_price"
						);
						dateEffective = serviceResult[n].getValue(
							"custrecord_servicechg_date_effective"
						);
						trialEndDate = serviceResult[n].getValue(
							"custrecord_trial_end_date"
						);
						var commRegId = serviceResult[n].getValue(
							"custrecord_servicechg_comm_reg"
						);
						var serviceChangeTypeText = serviceResult[n].getText(
							"custrecord_servicechg_type"
						);
						var serviceChangeFreqText = serviceResult[n].getValue(
							"custrecord_servicechg_new_freq"
						);

						nlapiLogExecution("DEBUG", "serviceNSItem", serviceNSItem);
						nlapiLogExecution("DEBUG", "serviceNSItemText", serviceNSItemText);
						nlapiLogExecution(
							"DEBUG",
							"serviceChangeFreqText.length",
							serviceChangeFreqText.length
						);
						nlapiLogExecution(
							"DEBUG",
							"serviceChangeFreqText.split(,).length",
							serviceChangeFreqText.split(",").length
						);

						var serviceFreqText = "";

						service[service.length] = serviceNSItemText;
						if (serviceChangeFreqText.split(",").length == 5) {
							serviceFreq[serviceFreq.length] = "Daily";
							serviceFreqText = "Daily";
						} else {
							serviceFreq[serviceFreq.length] = freqCal(serviceChangeFreqText);
							serviceFreqText = freqCal(serviceChangeFreqText);
						}
						price[price.length] = newServiceChangePrice;

						serviceTable += "<tr>";
						serviceTable += "<td>" + serviceNSItemText + "</td>";
						serviceTable += "<td>" + serviceFreqText + "</td>";
						serviceTable += "<td>$" + newServiceChangePrice + "</td>";

						serviceTable += "</tr>";
					}

					serviceTable += "</tbody></table>";

					// emailHtml = emailHtml.replace(/<nlemsalesrepname>/gi, salesRepName);
					emailHtml = emailHtml.replace(/nlemagreebutton/gi, expInterest);
					emailHtml = emailHtml.replace(/nlemservicestartdate/gi, commdate);
					emailHtml = emailHtml.replace(
						/nlemsverifyervicetable/gi,
						serviceTable
					);
					// emailHtml = emailHtml.replace(/<nlemcontactfirstname>/gi, firstname);
				}

				//Email Template Name: 202402 - Verify Quote Services
				if (templateId == 422) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");

					var dynamicSCFURL = null;
					if (!isNullorEmpty(commreg)) {
						var commRegRecord = nlapiLoadRecord('customrecord_commencement_register', commreg);
						dynamicSCFURL = commRegRecord.getFieldValue('custrecord_dynamic_scf_url');
					}

					if (isNullorEmpty(dynamicSCFURL)) {
						var expInterest =
							'<a class="mcnButton " href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1959&deploy=1&compid=1048144&ns-at=AAEJ7tMQCuxUJvJ4RvyaI99vrX6kaBIKkbBebvVixmguZdaobdA&custinternalid=' +
							recId +
							'"  style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Accept">Accept</a>';
					} else {
						var expInterest =
							'<a class="mcnButton " href="' + dynamicSCFURL + '"  style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Accept">Accept</a>';
					}



					nlapiLogExecution("DEBUG", "commreg", commreg);

					var searched_service_change = nlapiLoadSearch(
						"customrecord_servicechg",
						"customsearch_salesp_service_chg"
					);

					var newFilters = new Array();
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"custrecord_service_customer",
						"CUSTRECORD_SERVICECHG_SERVICE",
						"is",
						recId
					);
					if (!isNullorEmpty(commreg)) {
						newFilters[newFilters.length] = new nlobjSearchFilter(
							"custrecord_servicechg_comm_reg",
							null,
							"is",
							commreg
						);
					}
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"custrecord_servicechg_status",
						null,
						"anyof",
						[1, 2, 4]
					);

					searched_service_change.addFilters(newFilters);

					resultSet_service_change = searched_service_change.runSearch();

					var serviceResult = resultSet_service_change.getResults(0, 6);

					var service = [];
					var serviceFreq = [];
					var price = [];

					var service_freq = "";

					var dateEffective = null;
					var trialEndDate = null;

					var serviceTable =
						'<table border="1" cellpadding="1" cellspacing="1" style="width: 100%;"><thead><tr><th><b>SERVICE NAME</b></th><th style="vertical-align: middle;text-align: center;"><b>FREQUENCY</b></th><th style="vertical-align: middle;text-align: center;"><b>RATE</b></th></tr></thead><tbody>';

					for (n = 0; n < serviceResult.length; n++) {
						var serviceChangeId = serviceResult[n].getValue("internalid");
						var serviceId = serviceResult[n].getValue(
							"custrecord_servicechg_service"
						);
						var serviceText = serviceResult[n].getText(
							"custrecord_servicechg_service"
						);
						var serviceDescp = serviceResult[n].getValue(
							"custrecord_service_description",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var oldServicePrice = serviceResult[n].getValue(
							"custrecord_service_price",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var serviceNSItem = serviceResult[n].getValue(
							"custrecord_service_ns_item",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var serviceNSItemText = serviceResult[n].getText(
							"custrecord_service_ns_item",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var newServiceChangePrice = serviceResult[n].getValue(
							"custrecord_servicechg_new_price"
						);
						dateEffective = serviceResult[n].getValue(
							"custrecord_servicechg_date_effective"
						);
						trialEndDate = serviceResult[n].getValue(
							"custrecord_trial_end_date"
						);
						var commRegId = serviceResult[n].getValue(
							"custrecord_servicechg_comm_reg"
						);
						var serviceChangeTypeText = serviceResult[n].getText(
							"custrecord_servicechg_type"
						);
						var serviceChangeFreqText = serviceResult[n].getValue(
							"custrecord_servicechg_new_freq"
						);

						nlapiLogExecution("DEBUG", "serviceNSItem", serviceNSItem);
						nlapiLogExecution("DEBUG", "serviceNSItemText", serviceNSItemText);
						nlapiLogExecution(
							"DEBUG",
							"serviceChangeFreqText.length",
							serviceChangeFreqText.length
						);
						nlapiLogExecution(
							"DEBUG",
							"serviceChangeFreqText.split(,).length",
							serviceChangeFreqText.split(",").length
						);

						var serviceFreqText = "";

						service[service.length] = serviceNSItemText;
						if (serviceChangeFreqText.split(",").length == 5) {
							serviceFreq[serviceFreq.length] = "Daily";
							serviceFreqText = "Daily";
						} else {
							serviceFreq[serviceFreq.length] = freqCal(serviceChangeFreqText);
							serviceFreqText = freqCal(serviceChangeFreqText);
						}
						price[price.length] = newServiceChangePrice;

						serviceTable += "<tr>";
						serviceTable += "<td>" + serviceNSItemText + "</td>";
						serviceTable += "<td>" + serviceFreqText + "</td>";
						serviceTable += "<td>$" + newServiceChangePrice + "</td>";

						serviceTable += "</tr>";
					}

					serviceTable += "</tbody></table>";

					// emailHtml = emailHtml.replace(/<nlemsalesrepname>/gi, salesRepName);
					emailHtml = emailHtml.replace(/acceptbutton/gi, expInterest);
					emailHtml = emailHtml.replace(/nlemservicestartdate/gi, commdate);
					emailHtml = emailHtml.replace(
						/nlemsverifyervicetable/gi,
						serviceTable
					);
					// emailHtml = emailHtml.replace(/<nlemcontactfirstname>/gi, firstname);
				}

				//Email Template Name: 20241122 - T6 - PUD - Thank You & Next Steps
				if (templateId == 479) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");
					var portal_access = customer_record.getFieldValue(
						"custentity_portal_access"
					);

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");

					var searched_service_change = nlapiLoadSearch(
						"customrecord_servicechg",
						"customsearch_salesp_service_chg"
					);

					var newFilters = new Array();
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"custrecord_service_customer",
						"CUSTRECORD_SERVICECHG_SERVICE",
						"is",
						recId
					);
					if (!isNullorEmpty(commreg)) {
						newFilters[newFilters.length] = new nlobjSearchFilter(
							"custrecord_servicechg_comm_reg",
							null,
							"is",
							commreg
						);
					}
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"custrecord_servicechg_status",
						null,
						"anyof",
						[1, 2, 4]
					);

					searched_service_change.addFilters(newFilters);

					resultSet_service_change = searched_service_change.runSearch();

					var serviceResult = resultSet_service_change.getResults(0, 6);

					var service = [];
					var serviceFreq = [];
					var price = [];

					var service_freq = "";

					var dateEffective = null;
					var trialEndDate = null;

					if (portal_access == 1 || portal_access == "1") {
						var shipMateAccess = "ShipMate Access</br>";
						shipMateAccess +=
							"- You will soon receive separate email with your ShipMate login credentials for the express bookings.</br>";
						shipMateAccess +=
							"- Please set up your password within 24 hours of receiving these details.</br>";
						shipMateAccess +=
							"- Our ShipMate Onboarding team will reach out to you to provide optional ShipMate onboarding and training.</br></br>";
					} else {
						var shipMateAccess = "";
					}

					var serviceTable =
						'<table border="1" cellpadding="1" cellspacing="1" style="width: 100%;"><thead><tr><th><b>SERVICE NAME</b></th><th style="vertical-align: middle;text-align: center;"><b>FREQUENCY</b></th><th style="vertical-align: middle;text-align: center;"><b>RATE</b></th></tr></thead><tbody>';

					for (n = 0; n < serviceResult.length; n++) {
						var serviceChangeId = serviceResult[n].getValue("internalid");
						var serviceId = serviceResult[n].getValue(
							"custrecord_servicechg_service"
						);
						var serviceText = serviceResult[n].getText(
							"custrecord_servicechg_service"
						);
						var serviceDescp = serviceResult[n].getValue(
							"custrecord_service_description",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var oldServicePrice = serviceResult[n].getValue(
							"custrecord_service_price",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var serviceNSItem = serviceResult[n].getValue(
							"custrecord_service_ns_item",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var serviceNSItemText = serviceResult[n].getText(
							"custrecord_service_ns_item",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var newServiceChangePrice = serviceResult[n].getValue(
							"custrecord_servicechg_new_price"
						);
						dateEffective = serviceResult[n].getValue(
							"custrecord_servicechg_date_effective"
						);
						trialEndDate = serviceResult[n].getValue(
							"custrecord_trial_end_date"
						);
						var commRegId = serviceResult[n].getValue(
							"custrecord_servicechg_comm_reg"
						);
						var serviceChangeTypeText = serviceResult[n].getText(
							"custrecord_servicechg_type"
						);
						var serviceChangeFreqText = serviceResult[n].getValue(
							"custrecord_servicechg_new_freq"
						);

						nlapiLogExecution("DEBUG", "serviceNSItem", serviceNSItem);
						nlapiLogExecution("DEBUG", "serviceNSItemText", serviceNSItemText);
						nlapiLogExecution(
							"DEBUG",
							"serviceChangeFreqText.length",
							serviceChangeFreqText.length
						);
						nlapiLogExecution(
							"DEBUG",
							"serviceChangeFreqText.split(,).length",
							serviceChangeFreqText.split(",").length
						);

						var serviceFreqText = "";

						service[service.length] = serviceNSItemText;
						if (serviceChangeFreqText.split(",").length == 5) {
							serviceFreq[serviceFreq.length] = "Daily";
							serviceFreqText = "Daily";
						} else {
							serviceFreq[serviceFreq.length] = freqCal(serviceChangeFreqText);
							serviceFreqText = freqCal(serviceChangeFreqText);
						}
						price[price.length] = newServiceChangePrice;

						serviceTable += "<tr>";
						serviceTable += "<td>" + serviceNSItemText + "</td>";
						serviceTable += "<td>" + serviceFreqText + "</td>";
						serviceTable += "<td>$" + newServiceChangePrice + "</td>";

						serviceTable += "</tr>";
					}

					serviceTable += "</tbody></table>";

					emailHtml = emailHtml.replace(/nlemservicedeatils/gi, serviceTable);
					emailHtml = emailHtml.replace(/nlemservicestartdate/gi, commdate);
					emailHtml = emailHtml.replace(/nlemshipmateaccess/gi, shipMateAccess);
					emailHtml = emailHtml.replace(/nlemsalesrepname/gi, salesRepName);
				}

				//Email Template Name: 202402 - LPO Verify Free Trial Services
				if (templateId == 418) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");

					var dynamicSCFURL = null;
					if (!isNullorEmpty(commreg)) {
						var commRegRecord = nlapiLoadRecord('customrecord_commencement_register', commreg);
						dynamicSCFURL = commRegRecord.getFieldValue('custrecord_dynamic_scf_url');
					}

					if (isNullorEmpty(dynamicSCFURL)) {
						var expInterest =
							'<a class="mcnButton " href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1959&deploy=1&compid=1048144&ns-at=AAEJ7tMQCuxUJvJ4RvyaI99vrX6kaBIKkbBebvVixmguZdaobdA&custinternalid=' +
							recId +
							'"  style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Agree">Agree</a>';
					} else {
						var expInterest =
							'<a class="mcnButton " href="' + dynamicSCFURL + '"  style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Agree">Agree</a>';
					}



					nlapiLogExecution("DEBUG", "commreg", commreg);

					var searched_service_change = nlapiLoadSearch(
						"customrecord_servicechg",
						"customsearch_salesp_service_chg"
					);

					var newFilters = new Array();
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"custrecord_service_customer",
						"CUSTRECORD_SERVICECHG_SERVICE",
						"is",
						recId
					);
					if (!isNullorEmpty(commreg)) {
						newFilters[newFilters.length] = new nlobjSearchFilter(
							"custrecord_servicechg_comm_reg",
							null,
							"is",
							commreg
						);
					}
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"custrecord_servicechg_status",
						null,
						"anyof",
						[1, 2, 4]
					);

					searched_service_change.addFilters(newFilters);

					resultSet_service_change = searched_service_change.runSearch();

					var serviceResult = resultSet_service_change.getResults(0, 6);

					var service = [];
					var serviceFreq = [];
					var price = [];

					var service_freq = "";

					var dateEffective = null;
					var trialEndDate = null;

					//Removing the service table on Luke's request.
					// var serviceTable =
					//     '<table border="1" cellpadding="1" cellspacing="1" style="width:500px;"><thead><tr><th><b>SERVICE NAME</b></th><th style="vertical-align: middle;text-align: center;"><b>FREQUENCY</b></th><th style="vertical-align: middle;text-align: center;"><b>RATE</b></th></tr></thead><tbody>';

					var serviceText =
						"Your PMPO collection service is scheduled to be Daily at $8";

					for (n = 0; n < serviceResult.length; n++) {
						var serviceChangeId = serviceResult[n].getValue("internalid");
						var serviceId = serviceResult[n].getValue(
							"custrecord_servicechg_service"
						);
						var serviceText = serviceResult[n].getText(
							"custrecord_servicechg_service"
						);
						var serviceDescp = serviceResult[n].getValue(
							"custrecord_service_description",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var oldServicePrice = serviceResult[n].getValue(
							"custrecord_service_price",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var serviceNSItem = serviceResult[n].getValue(
							"custrecord_service_ns_item",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var serviceNSItemText = serviceResult[n].getText(
							"custrecord_service_ns_item",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var newServiceChangePrice = serviceResult[n].getValue(
							"custrecord_servicechg_new_price"
						);
						dateEffective = serviceResult[n].getValue(
							"custrecord_servicechg_date_effective"
						);
						trialEndDate = serviceResult[n].getValue(
							"custrecord_trial_end_date"
						);
						var commRegId = serviceResult[n].getValue(
							"custrecord_servicechg_comm_reg"
						);
						var serviceChangeTypeText = serviceResult[n].getText(
							"custrecord_servicechg_type"
						);
						var serviceChangeFreqText = serviceResult[n].getValue(
							"custrecord_servicechg_new_freq"
						);

						nlapiLogExecution("DEBUG", "serviceNSItem", serviceNSItem);
						nlapiLogExecution("DEBUG", "serviceNSItemText", serviceNSItemText);
						nlapiLogExecution(
							"DEBUG",
							"serviceChangeFreqText.length",
							serviceChangeFreqText.length
						);
						nlapiLogExecution(
							"DEBUG",
							"serviceChangeFreqText.split(,).length",
							serviceChangeFreqText.split(",").length
						);

						var serviceFreqText = "";

						service[service.length] = serviceNSItemText;
						if (serviceChangeFreqText.split(",").length == 5) {
							serviceFreq[serviceFreq.length] = "Daily";
							serviceFreqText = "Daily";
						} else {
							serviceFreq[serviceFreq.length] = freqCal(serviceChangeFreqText);
							serviceFreqText = freqCal(serviceChangeFreqText);
						}
						price[price.length] = newServiceChangePrice;

						serviceText =
							serviceNSItemText +
							" service is scheduled to be " +
							serviceFreqText +
							" at $" +
							newServiceChangePrice;

						// serviceTable += '<tr>';
						// serviceTable +=
						//     '<td>' +
						//     serviceText + '</td>';
						// serviceTable += '<td>' + serviceFreqText + '</td>';
						// serviceTable +=
						//     '<td>$' +
						//     newServiceChangePrice + '</td>';

						// serviceTable += '</tr>';
					}

					// serviceTable += '</tbody></table>';

					// emailHtml = emailHtml.replace(/<nlemsalesrepname>/gi, salesRepName);
					emailHtml = emailHtml.replace(/nlemagreebutton/gi, expInterest);
					emailHtml = emailHtml.replace(/nlemservicestartdate/gi, commdate);
					emailHtml = emailHtml.replace(
						/nlemservicetrialenddate/gi,
						trialEndDate
					);
					emailHtml = emailHtml.replace(
						/nlembillingstartdate/gi,
						billingstartdate
					);
					emailHtml = emailHtml.replace(
						/nlemsverifyervicetable/gi,
						serviceText
					);
					// emailHtml = emailHtml.replace(/nlemsverifyervicetable/gi, serviceTable);
					// emailHtml = emailHtml.replace(/<nlemcontactfirstname>/gi, firstname);
				}

				//Email Template Name: 202408 - LPO x StarTrack
				//Email Template Name: 202408 - LPO - StarTrack Only
				//Email Template Name: 202408 - Standard LPO Trials
				if (templateId == 463 || templateId == 464 || templateId == 465) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");
					var partner_id = customer_record.getFieldValue("partner");

					//Get Premium, Express 7 Standard Surcharges at the Customer Level
					var premiumSurcharge = customer_record.getFieldValue("custentity_startrack_fuel_surcharge");
					var expressSurcharge = customer_record.getFieldValue("custentity_mpex_surcharge_rate");
					var standardSurcharge = customer_record.getFieldValue("custentity_sendle_fuel_surcharge");

					var partner_record = nlapiLoadRecord("partner", partner_id);
					var mp_str_activated = partner_record.getFieldValue(
						"custentity_zee_mp_str_activated"
					);
					if (isNullorEmpty(mp_str_activated) || mp_str_activated == 2) {
						var nostdactive =
							'<br><span style="color:#FF0000">Unfortunately, this service is not currently available in your area yet.</span><br><br>';
						emailHtml = emailHtml.replace(/nlemprmactive/gi, nostdactive);
					} else {
						emailHtml = emailHtml.replace(/nlemprmactive/gi, "");
					}

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");

					var dynamicSCFURL = null;
					if (!isNullorEmpty(commreg)) {
						var commRegRecord = nlapiLoadRecord('customrecord_commencement_register', commreg);
						dynamicSCFURL = commRegRecord.getFieldValue('custrecord_dynamic_scf_url');
					}

					if (isNullorEmpty(dynamicSCFURL)) {
						var expInterest =
							'<a class="mcnButton " href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1959&deploy=1&compid=1048144&ns-at=AAEJ7tMQCuxUJvJ4RvyaI99vrX6kaBIKkbBebvVixmguZdaobdA&custinternalid=' +
							recId +
							'"  style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Agree">Agree</a>';
					} else {
						var expInterest =
							'<a class="mcnButton " href="' + dynamicSCFURL + '"  style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Agree">Agree</a>';
					}

					nlapiLogExecution("DEBUG", "commreg", commreg);

					var searched_service_change = nlapiLoadSearch(
						"customrecord_servicechg",
						"customsearch_salesp_service_chg"
					);

					var newFilters = new Array();
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"custrecord_service_customer",
						"CUSTRECORD_SERVICECHG_SERVICE",
						"is",
						recId
					);
					if (!isNullorEmpty(commreg)) {
						newFilters[newFilters.length] = new nlobjSearchFilter(
							"custrecord_servicechg_comm_reg",
							null,
							"is",
							commreg
						);
					}
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"custrecord_servicechg_status",
						null,
						"anyof",
						[1, 2, 4]
					);

					searched_service_change.addFilters(newFilters);

					resultSet_service_change = searched_service_change.runSearch();

					var serviceResult = resultSet_service_change.getResults(0, 6);

					var service = [];
					var serviceFreq = [];
					var price = [];

					var service_freq = "";

					var dateEffective = null;
					var trialEndDate = null;

					//Removing the service table on Luke's request.
					// var serviceTable =
					//     '<table border="1" cellpadding="1" cellspacing="1" style="width:500px;"><thead><tr><th><b>SERVICE NAME</b></th><th style="vertical-align: middle;text-align: center;"><b>FREQUENCY</b></th><th style="vertical-align: middle;text-align: center;"><b>RATE</b></th></tr></thead><tbody>';

					var serviceText =
						"Your PMPO collection service is scheduled to be Daily at $8";

					for (n = 0; n < serviceResult.length; n++) {
						var serviceChangeId = serviceResult[n].getValue("internalid");
						var serviceId = serviceResult[n].getValue(
							"custrecord_servicechg_service"
						);
						var serviceText = serviceResult[n].getText(
							"custrecord_servicechg_service"
						);
						var serviceDescp = serviceResult[n].getValue(
							"custrecord_service_description",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var oldServicePrice = serviceResult[n].getValue(
							"custrecord_service_price",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var serviceNSItem = serviceResult[n].getValue(
							"custrecord_service_ns_item",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var serviceNSItemText = serviceResult[n].getText(
							"custrecord_service_ns_item",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var newServiceChangePrice = serviceResult[n].getValue(
							"custrecord_servicechg_new_price"
						);
						dateEffective = serviceResult[n].getValue(
							"custrecord_servicechg_date_effective"
						);
						trialEndDate = serviceResult[n].getValue(
							"custrecord_trial_end_date"
						);
						var commRegId = serviceResult[n].getValue(
							"custrecord_servicechg_comm_reg"
						);
						var serviceChangeTypeText = serviceResult[n].getText(
							"custrecord_servicechg_type"
						);
						var serviceChangeFreqText = serviceResult[n].getValue(
							"custrecord_servicechg_new_freq"
						);

						nlapiLogExecution("DEBUG", "serviceNSItem", serviceNSItem);
						nlapiLogExecution("DEBUG", "serviceNSItemText", serviceNSItemText);
						nlapiLogExecution(
							"DEBUG",
							"serviceChangeFreqText.length",
							serviceChangeFreqText.length
						);
						nlapiLogExecution(
							"DEBUG",
							"serviceChangeFreqText.split(,).length",
							serviceChangeFreqText.split(",").length
						);

						var serviceFreqText = "";

						service[service.length] = serviceNSItemText;
						if (serviceChangeFreqText.split(",").length == 5) {
							serviceFreq[serviceFreq.length] = "Daily";
							serviceFreqText = "Daily";
						} else {
							serviceFreq[serviceFreq.length] = freqCal(serviceChangeFreqText);
							serviceFreqText = freqCal(serviceChangeFreqText);
						}
						price[price.length] = newServiceChangePrice;

						serviceText =
							serviceNSItemText +
							": $" +
							newServiceChangePrice +
							" exc. GST per collection. (After the trial.) ";
					}

					//NS Search: Product Pricing - Letters - Quotes
					var prodPricingLetterstobeSentSearch = nlapiLoadSearch(
						"customrecord_product_pricing",
						"customsearch_prod_pricing_letters_quotes"
					);

					var newFilters = new Array();
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"internalid",
						"custrecord_prod_pricing_customer",
						"anyof",
						recId
					);
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"custrecord_prod_pricing_delivery_speeds",
						null,
						"anyof",
						4
					);

					prodPricingLetterstobeSentSearch.addFilters(newFilters);

					var resultSetProdPricingLetters =
						prodPricingLetterstobeSentSearch.runSearch();

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

					var mpPrm1kg = [];
					var mpPrm3kg = [];
					var mpPrm5kg = [];
					var mpPrm10kg = [];
					var mpPrm20kg = [];

					var oldCustomerId = null;
					var count = 0;
					var oldDeliverySpeed = null;

					resultSetProdPricingLetters.forEachResult(function (searchResult) {
						var prodPricingInternalId = searchResult.getValue("internalid");
						var custId = searchResult.getValue(
							"custrecord_prod_pricing_customer"
						);
						var deliverySpeed = searchResult.getValue(
							"custrecord_prod_pricing_delivery_speeds"
						);
						var pricePlan250g = searchResult.getValue(
							"custrecord_prod_pricing_250g"
						);
						var price250g = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_250G",
							null
						);
						var pricePlan500g = searchResult.getValue(
							"custrecord_prod_pricing_500g"
						);
						var price500g = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_500G",
							null
						);
						var pricePlan1Kg = searchResult.getValue(
							"custrecord_prod_pricing_1kg"
						);
						var price1Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_1KG",
							null
						);
						var pricePlan3Kg = searchResult.getValue(
							"custrecord_prod_pricing_3kg"
						);
						var price3Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_3KG",
							null
						);
						var pricePlan5Kg = searchResult.getValue(
							"custrecord_prod_pricing_5kg"
						);
						var price5Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_5KG",
							null
						);
						var pricePlan10Kg = searchResult.getValue(
							"custrecord_prod_pricing_10kg"
						);
						var price10Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_10KG",
							null
						);
						var pricePlan20Kg = searchResult.getValue(
							"custrecord_prod_pricing_20kg"
						);
						var price20Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_20KG",
							null
						);
						var pricePlan25Kg = searchResult.getValue(
							"custrecord_prod_pricing_25kg"
						);
						var price25Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_25KG",
							null
						);

						nlapiLogExecution("DEBUG", "deliverySpeed", deliverySpeed);
						nlapiLogExecution("DEBUG", "custId", custId);
						nlapiLogExecution("DEBUG", "price250g", price250g);
						nlapiLogExecution("DEBUG", "price500g", price500g);
						nlapiLogExecution("DEBUG", "price1Kg", price1Kg);
						nlapiLogExecution("DEBUG", "price3Kg", price3Kg);
						nlapiLogExecution("DEBUG", "price5Kg", price5Kg);
						nlapiLogExecution("DEBUG", "price10Kg", price10Kg);
						nlapiLogExecution("DEBUG", "price20Kg", price20Kg);
						nlapiLogExecution("DEBUG", "price25Kg", price25Kg);

						if (count == 0) {
							if (deliverySpeed == 2) {
								mpExp500g.push({ price500g: price500g, price500gGST: price500g * 1.1, price500gwithGSTSurcharge: ((((price500g * 1.1) * expressSurcharge) / 100) + (price500g * 1.1)) });
								mpExp1kg.push({ price1Kg: price1Kg, price1KgGST: price1Kg * 1.1, price1KgwithGSTSurcharge: ((((price1Kg * 1.1) * expressSurcharge) / 100) + (price1Kg * 1.1)) });
								mpExp3kg.push({ price3Kg: price3Kg, price3KgGST: price3Kg * 1.1, price3KgwithGSTSurcharge: ((((price3Kg * 1.1) * expressSurcharge) / 100) + (price3Kg * 1.1)) });
								mpExp5kg.push({ price5Kg: price5Kg, price5KgGST: price5Kg * 1.1, price5KgwithGSTSurcharge: ((((price5Kg * 1.1) * expressSurcharge) / 100) + (price5Kg * 1.1)) });
							} else if (deliverySpeed == 1) {
								mpStd250g.push({ price250g: price250g, price250gGST: price250g * 1.1, price250gwithGSTSurcharge: ((((price250g * 1.1) * standardSurcharge) / 100) + (price250g * 1.1)) });
								mpStd500g.push({ price500g: price500g, price500gGST: price500g * 1.1, price500gwithGSTSurcharge: ((((price500g * 1.1) * standardSurcharge) / 100) + (price500g * 1.1)) });
								mpStd1kg.push({ price1Kg: price1Kg, price1KgGST: price1Kg * 1.1, price1KgwithGSTSurcharge: ((((price1Kg * 1.1) * standardSurcharge) / 100) + (price1Kg * 1.1)) });
								mpStd3kg.push({ price3Kg: price3Kg, price3KgGST: price3Kg * 1.1, price3KgwithGSTSurcharge: ((((price3Kg * 1.1) * standardSurcharge) / 100) + (price3Kg * 1.1)) });
								mpStd5kg.push({ price5Kg: price5Kg, price5KgGST: price5Kg * 1.1, price5KgwithGSTSurcharge: ((((price5Kg * 1.1) * standardSurcharge) / 100) + (price5Kg * 1.1)) });
								mpStd10kg.push({ price10Kg: price10Kg, price10KgGST: price10Kg * 1.1, price10KgwithGSTSurcharge: ((((price10Kg * 1.1) * standardSurcharge) / 100) + (price10Kg * 1.1)) });
								mpStd20kg.push({ price20Kg: price20Kg, price20KgGST: price20Kg * 1.1, price20KgwithGSTSurcharge: ((((price20Kg * 1.1) * standardSurcharge) / 100) + (price20Kg * 1.1)) });
								mpStd25kg.push({ price25Kg: price25Kg, price25KgGST: price25Kg * 1.1, price25KgwithGSTSurcharge: ((((price25Kg * 1.1) * standardSurcharge) / 100) + (price25Kg * 1.1)) });
							} else if (deliverySpeed == 4) {
								mpPrm1kg.push({ price1Kg: price1Kg, price1KgGST: price1Kg * 1.1, price1KgwithGSTSurcharge: ((((price1Kg * 1.1) * premiumSurcharge) / 100) + (price1Kg * 1.1)) });
								mpPrm3kg.push({ price3Kg: price3Kg, price3KgGST: price3Kg * 1.1, price3KgwithGSTSurcharge: ((((price3Kg * 1.1) * premiumSurcharge) / 100) + (price3Kg * 1.1)) });
								mpPrm5kg.push({ price5Kg: price5Kg, price5KgGST: price5Kg * 1.1, price5KgwithGSTSurcharge: ((((price5Kg * 1.1) * premiumSurcharge) / 100) + (price5Kg * 1.1)) });
								mpPrm10kg.push({ price10Kg: price10Kg, price10KgGST: price10Kg * 1.1, price10KgwithGSTSurcharge: ((((price10Kg * 1.1) * premiumSurcharge) / 100) + (price10Kg * 1.1)) });
								mpPrm20kg.push({ price20Kg: price20Kg, price20KgGST: price20Kg * 1.1, price20KgwithGSTSurcharge: ((((price20Kg * 1.1) * premiumSurcharge) / 100) + (price20Kg * 1.1)) });
							}
						} else if (oldCustomerId == custId) {
							nlapiLogExecution(
								"DEBUG",
								"Same customer: oldCustomerId",
								oldCustomerId
							);
							nlapiLogExecution(
								"DEBUG",
								"Same customer: oldDeliverySpeed",
								oldDeliverySpeed
							);
							if (oldDeliverySpeed == deliverySpeed) {
								nlapiDeleteRecord(
									"customrecord_product_pricing",
									prodPricingInternalId
								);
								count--;
							} else {
								if (deliverySpeed == 2) {
									mpExp500g.push({ price500g: price500g, price500gGST: price500g * 1.1, price500gwithGSTSurcharge: ((((price500g * 1.1) * expressSurcharge) / 100) + (price500g * 1.1)) });
									mpExp1kg.push({ price1Kg: price1Kg, price1KgGST: price1Kg * 1.1, price1KgwithGSTSurcharge: ((((price1Kg * 1.1) * expressSurcharge) / 100) + (price1Kg * 1.1)) });
									mpExp3kg.push({ price3Kg: price3Kg, price3KgGST: price3Kg * 1.1, price3KgwithGSTSurcharge: ((((price3Kg * 1.1) * expressSurcharge) / 100) + (price3Kg * 1.1)) });
									mpExp5kg.push({ price5Kg: price5Kg, price5KgGST: price5Kg * 1.1, price5KgwithGSTSurcharge: ((((price5Kg * 1.1) * expressSurcharge) / 100) + (price5Kg * 1.1)) });
								} else if (deliverySpeed == 1) {
									mpStd250g.push({ price250g: price250g, price250gGST: price250g * 1.1, price250gwithGSTSurcharge: ((((price250g * 1.1) * standardSurcharge) / 100) + (price250g * 1.1)) });
									mpStd500g.push({ price500g: price500g, price500gGST: price500g * 1.1, price500gwithGSTSurcharge: ((((price500g * 1.1) * standardSurcharge) / 100) + (price500g * 1.1)) });
									mpStd1kg.push({ price1Kg: price1Kg, price1KgGST: price1Kg * 1.1, price1KgwithGSTSurcharge: ((((price1Kg * 1.1) * standardSurcharge) / 100) + (price1Kg * 1.1)) });
									mpStd3kg.push({ price3Kg: price3Kg, price3KgGST: price3Kg * 1.1, price3KgwithGSTSurcharge: ((((price3Kg * 1.1) * standardSurcharge) / 100) + (price3Kg * 1.1)) });
									mpStd5kg.push({ price5Kg: price5Kg, price5KgGST: price5Kg * 1.1, price5KgwithGSTSurcharge: ((((price5Kg * 1.1) * standardSurcharge) / 100) + (price5Kg * 1.1)) });
									mpStd10kg.push({ price10Kg: price10Kg, price10KgGST: price10Kg * 1.1, price10KgwithGSTSurcharge: ((((price10Kg * 1.1) * standardSurcharge) / 100) + (price10Kg * 1.1)) });
									mpStd20kg.push({ price20Kg: price20Kg, price20KgGST: price20Kg * 1.1, price20KgwithGSTSurcharge: ((((price20Kg * 1.1) * standardSurcharge) / 100) + (price20Kg * 1.1)) });
									mpStd25kg.push({ price25Kg: price25Kg, price25KgGST: price25Kg * 1.1, price25KgwithGSTSurcharge: ((((price25Kg * 1.1) * standardSurcharge) / 100) + (price25Kg * 1.1)) });
								} else if (deliverySpeed == 4) {
									mpPrm1kg.push({ price1Kg: price1Kg, price1KgGST: price1Kg * 1.1, price1KgwithGSTSurcharge: ((((price1Kg * 1.1) * premiumSurcharge) / 100) + (price1Kg * 1.1)) });
									mpPrm3kg.push({ price3Kg: price3Kg, price3KgGST: price3Kg * 1.1, price3KgwithGSTSurcharge: ((((price3Kg * 1.1) * premiumSurcharge) / 100) + (price3Kg * 1.1)) });
									mpPrm5kg.push({ price5Kg: price5Kg, price5KgGST: price5Kg * 1.1, price5KgwithGSTSurcharge: ((((price5Kg * 1.1) * premiumSurcharge) / 100) + (price5Kg * 1.1)) });
									mpPrm10kg.push({ price10Kg: price10Kg, price10KgGST: price10Kg * 1.1, price10KgwithGSTSurcharge: ((((price10Kg * 1.1) * premiumSurcharge) / 100) + (price10Kg * 1.1)) });
									mpPrm20kg.push({ price20Kg: price20Kg, price20KgGST: price20Kg * 1.1, price20KgwithGSTSurcharge: ((((price20Kg * 1.1) * premiumSurcharge) / 100) + (price20Kg * 1.1)) });
								}
							}
						}

						oldCustomerId = custId;
						oldDeliverySpeed = deliverySpeed;
						count++;
						return true;
					});

					if (count > 0 && !isNullorEmpty(oldCustomerId)) {

						nlapiLogExecution("DEBUG", "Express", "");
						nlapiLogExecution("DEBUG", "Out loop:Express Rates ", JSON.stringify(mpExp5kg));
						nlapiLogExecution("DEBUG", "Out loop:Express Rates ", JSON.stringify(mpExp3kg));
						nlapiLogExecution("DEBUG", "Out loop:Express Rates ", JSON.stringify(mpExp1kg));
						nlapiLogExecution("DEBUG", "Out loop:Express Rates ", JSON.stringify(mpExp500g));

						nlapiLogExecution("DEBUG", "Standard", "");
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd20kg));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd25kg));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd10kg));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd5kg));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd3kg));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd1kg));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd500g));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd250g));

						nlapiLogExecution("DEBUG", "Premium", "");
						nlapiLogExecution("DEBUG", "Out loop:Premium Rates ", JSON.stringify(mpPrm1kg));
						nlapiLogExecution("DEBUG", "Out loop:Premium Rates ", JSON.stringify(mpPrm3kg));
						nlapiLogExecution("DEBUG", "Out loop:Premium Rates ", JSON.stringify(mpPrm5kg));
						nlapiLogExecution("DEBUG", "Out loop:Premium Rates ", JSON.stringify(mpPrm10kg));
						nlapiLogExecution("DEBUG", "Out loop:Premium Rates ", JSON.stringify(mpPrm20kg));

						//EXPRESS
						if (mpExp5kg.length == 0) {
							mpExp5kg.push({ price5Kg: 0, price5KgGST: 0, price5KgwithGSTSurcharge: 0 });
						}
						if (mpExp3kg.length == 0) {
							mpExp3kg.push({ price3Kg: 0, price3KgGST: 0, price3KgwithGSTSurcharge: 0 });
						}
						if (mpExp1kg.length == 0) {
							mpExp1kg.push({ price1Kg: 0, price1KgGST: 0, price1KgwithGSTSurcharge: 0 });
						}
						if (mpExp500g.length == 0) {
							mpExp500g.push({ price500g: 0, price500gGST: 0, price500gwithGSTSurcharge: 0 });
						}

						emailHtml = emailHtml.replace(/nlem5kgexp/gi, parseFloat(mpExp5kg[0].price5Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem3kgexp/gi, parseFloat(mpExp3kg[0].price3Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem1kgexp/gi, parseFloat(mpExp1kg[0].price1Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem500gexp/gi, parseFloat(mpExp500g[0].price500g).toFixed(2));
						emailHtml = emailHtml.replace(/nlem5kgwithgstwithfuelexp/gi, parseFloat(mpExp5kg[0].price5KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem3kgwithgstwithfuelexp/gi, parseFloat(mpExp3kg[0].price3KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem1kgwithgstwithfuelexp/gi, parseFloat(mpExp1kg[0].price1KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem500gwithgstwithfuelexp/gi, parseFloat(mpExp500g[0].price500gwithGSTSurcharge).toFixed(2));
						//STANDARD
						if (mpStd20kg.length == 0) {
							mpStd20kg.push({ price20Kg: 0, price20KgGST: 0, price20KgwithGSTSurcharge: 0 });
						}
						if (mpStd25kg.length == 0) {
							mpStd25kg.push({ price25Kg: 0, price25KgGST: 0, price25KgwithGSTSurcharge: 0 });
						}
						if (mpStd10kg.length == 0) {
							mpStd10kg.push({ price10Kg: 0, price10KgGST: 0, price10KgwithGSTSurcharge: 0 });
						}
						if (mpStd5kg.length == 0) {
							mpStd5kg.push({ price5Kg: 0, price5KgGST: 0, price5KgwithGSTSurcharge: 0 });
						}
						if (mpStd3kg.length == 0) {
							mpStd3kg.push({ price3Kg: 0, price3KgGST: 0, price3KgwithGSTSurcharge: 0 });
						}
						if (mpStd1kg.length == 0) {
							mpStd1kg.push({ price1Kg: 0, price1KgGST: 0, price1KgwithGSTSurcharge: 0 });
						}
						if (mpStd500g.length == 0) {
							mpStd500g.push({ price500g: 0, price500gGST: 0, price500gwithGSTSurcharge: 0 });
						}
						if (mpStd250g.length == 0) {
							mpStd250g.push({ price250g: 0, price250gGST: 0, price250gwithGSTSurcharge: 0 });
						}

						emailHtml = emailHtml.replace(/nlem20kgstd/gi, parseFloat(mpStd20kg[0].price20Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem25kgstd/gi, parseFloat(mpStd25kg[0].price25Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem10kgstd/gi, parseFloat(mpStd10kg[0].price10Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem5kgstd/gi, parseFloat(mpStd5kg[0].price5Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem3kgstd/gi, parseFloat(mpStd3kg[0].price3Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem1kgstd/gi, parseFloat(mpStd1kg[0].price1Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem500gstd/gi, parseFloat(mpStd500g[0].price500g).toFixed(2));
						emailHtml = emailHtml.replace(/nlem250gstd/gi, parseFloat(mpStd250g[0].price250g).toFixed(2));
						emailHtml = emailHtml.replace(/nlem20kgwithgstwithfuelstd/gi, parseFloat(mpStd20kg[0].price20KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem25kgwithgstwithfuelstd/gi, parseFloat(mpStd25kg[0].price25KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem10kgwithgstwithfuelstd/gi, parseFloat(mpStd10kg[0].price10KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem5kgwithgstwithfuelstd/gi, parseFloat(mpStd5kg[0].price5KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem3kgwithgstwithfuelstd/gi, parseFloat(mpStd3kg[0].price3KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem1kgwithgstwithfuelstd/gi, parseFloat(mpStd1kg[0].price1KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem500gwithgstwithfuelstd/gi, parseFloat(mpStd500g[0].price500gwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem250gwithgstwithfuelstd/gi, parseFloat(mpStd250g[0].price250gwithGSTSurcharge).toFixed(2));
						//PREMIUM
						if (mpPrm1kg.length == 0) {
							mpPrm1kg.push({ price1Kg: 0, price1KgGST: 0, price1KgwithGSTSurcharge: 0 });
						}
						if (mpPrm3kg.length == 0) {
							mpPrm3kg.push({ price3Kg: 0, price3KgGST: 0, price3KgwithGSTSurcharge: 0 });
						}
						if (mpPrm5kg.length == 0) {
							mpPrm5kg.push({ price5Kg: 0, price5KgGST: 0, price5KgwithGSTSurcharge: 0 });
						}
						if (mpPrm10kg.length == 0) {
							mpPrm10kg.push({ price10Kg: 0, price10KgGST: 0, price10KgwithGSTSurcharge: 0 });
						}
						if (mpPrm20kg.length == 0) {
							mpPrm20kg.push({ price20Kg: 0, price20KgGST: 0, price20KgwithGSTSurcharge: 0 });
						}

						emailHtml = emailHtml.replace(/nlem1kgprm/gi, parseFloat(mpPrm1kg[0].price1Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem3kgprm/gi, parseFloat(mpPrm3kg[0].price3Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem5kgprm/gi, parseFloat(mpPrm5kg[0].price5Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem10kgprm/gi, parseFloat(mpPrm10kg[0].price10Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem20kgprm/gi, parseFloat(mpPrm20kg[0].price20Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem1kgwithgstwithfuelprm/gi, parseFloat(mpPrm1kg[0].price1KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem3kgwithgstwithfuelprm/gi, parseFloat(mpPrm3kg[0].price3KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem5kgwithgstwithfuelprm/gi, parseFloat(mpPrm5kg[0].price5KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem10kgwithgstwithfuelprm/gi, parseFloat(mpPrm10kg[0].price10KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem20kgwithgstwithfuelprm/gi, parseFloat(mpPrm20kg[0].price20KgwithGSTSurcharge).toFixed(2));
					}

					//Set Current Month & Year for the product rate table
					emailHtml = emailHtml.replace(/nlemmonthyear/gi, getCurrentMonthYear());

					emailHtml = emailHtml.replace(/nlemagreebutton/gi, expInterest);
					emailHtml = emailHtml.replace(/nlemservicestartdate/gi, commdate);
					emailHtml = emailHtml.replace(
						/nlemservicetrialenddate/gi,
						trialEndDate
					);
					emailHtml = emailHtml.replace(
						/nlembillingstartdate/gi,
						billingstartdate
					);
					emailHtml = emailHtml.replace(
						/nlemsverifyervicetable/gi,
						serviceText
					);
				}

				//Email Template Name: 202402 - Verify Free Trial Quote
				if (templateId == 423) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");

					var dynamicSCFURL = null;
					if (!isNullorEmpty(commreg)) {
						var commRegRecord = nlapiLoadRecord('customrecord_commencement_register', commreg);
						dynamicSCFURL = commRegRecord.getFieldValue('custrecord_dynamic_scf_url');
					}

					if (isNullorEmpty(dynamicSCFURL)) {
						var expInterest =
							'<a class="mcnButton " href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1959&deploy=1&compid=1048144&ns-at=AAEJ7tMQCuxUJvJ4RvyaI99vrX6kaBIKkbBebvVixmguZdaobdA&custinternalid=' +
							recId +
							'"  style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Accept">Accept</a>';
					} else {
						var expInterest =
							'<a class="mcnButton " href="' + dynamicSCFURL + '"  style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Accept">Accept</a>';
					}



					nlapiLogExecution("DEBUG", "commreg", commreg);

					var searched_service_change = nlapiLoadSearch(
						"customrecord_servicechg",
						"customsearch_salesp_service_chg"
					);

					var newFilters = new Array();
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"custrecord_service_customer",
						"CUSTRECORD_SERVICECHG_SERVICE",
						"is",
						recId
					);
					if (!isNullorEmpty(commreg)) {
						newFilters[newFilters.length] = new nlobjSearchFilter(
							"custrecord_servicechg_comm_reg",
							null,
							"is",
							commreg
						);
					}
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"custrecord_servicechg_status",
						null,
						"anyof",
						[1, 2, 4]
					);

					searched_service_change.addFilters(newFilters);

					resultSet_service_change = searched_service_change.runSearch();

					var serviceResult = resultSet_service_change.getResults(0, 6);

					var service = [];
					var serviceFreq = [];
					var price = [];

					var service_freq = "";

					var dateEffective = null;
					var trialEndDate = null;

					var serviceTable =
						'<table border="1" cellpadding="1" cellspacing="1" style="width: 100%;"><thead><tr><th><b>SERVICE NAME</b></th><th style="vertical-align: middle;text-align: center;"><b>FREQUENCY</b></th><th style="vertical-align: middle;text-align: center;"><b>RATE</b></th></tr></thead><tbody>';

					for (n = 0; n < serviceResult.length; n++) {
						var serviceChangeId = serviceResult[n].getValue("internalid");
						var serviceId = serviceResult[n].getValue(
							"custrecord_servicechg_service"
						);
						var serviceText = serviceResult[n].getText(
							"custrecord_servicechg_service"
						);
						var serviceDescp = serviceResult[n].getValue(
							"custrecord_service_description",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var oldServicePrice = serviceResult[n].getValue(
							"custrecord_service_price",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var serviceNSItem = serviceResult[n].getValue(
							"custrecord_service_ns_item",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var serviceNSItemText = serviceResult[n].getText(
							"custrecord_service_ns_item",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var newServiceChangePrice = serviceResult[n].getValue(
							"custrecord_servicechg_new_price"
						);
						dateEffective = serviceResult[n].getValue(
							"custrecord_servicechg_date_effective"
						);
						trialEndDate = serviceResult[n].getValue(
							"custrecord_trial_end_date"
						);
						var commRegId = serviceResult[n].getValue(
							"custrecord_servicechg_comm_reg"
						);
						var serviceChangeTypeText = serviceResult[n].getText(
							"custrecord_servicechg_type"
						);
						var serviceChangeFreqText = serviceResult[n].getValue(
							"custrecord_servicechg_new_freq"
						);

						nlapiLogExecution("DEBUG", "serviceNSItem", serviceNSItem);
						nlapiLogExecution("DEBUG", "serviceNSItemText", serviceNSItemText);
						nlapiLogExecution(
							"DEBUG",
							"serviceChangeFreqText.length",
							serviceChangeFreqText.length
						);
						nlapiLogExecution(
							"DEBUG",
							"serviceChangeFreqText.split(,).length",
							serviceChangeFreqText.split(",").length
						);

						var serviceFreqText = "";

						service[service.length] = serviceNSItemText;
						if (serviceChangeFreqText.split(",").length == 5) {
							serviceFreq[serviceFreq.length] = "Daily";
							serviceFreqText = "Daily";
						} else {
							serviceFreq[serviceFreq.length] = freqCal(serviceChangeFreqText);
							serviceFreqText = freqCal(serviceChangeFreqText);
						}
						price[price.length] = newServiceChangePrice;

						serviceTable += "<tr>";
						serviceTable += "<td>" + serviceNSItemText + "</td>";
						serviceTable += "<td>" + serviceFreqText + "</td>";
						serviceTable += "<td>$" + newServiceChangePrice + "</td>";

						serviceTable += "</tr>";
					}

					serviceTable += "</tbody></table>";

					// emailHtml = emailHtml.replace(/<nlemsalesrepname>/gi, salesRepName);
					emailHtml = emailHtml.replace(/nlemagreebutton/gi, expInterest);
					emailHtml = emailHtml.replace(/nlemservicestartdate/gi, commdate);
					emailHtml = emailHtml.replace(
						/nlemservicetrialenddate/gi,
						trialEndDate
					);
					emailHtml = emailHtml.replace(
						/nlembillingstartdate/gi,
						billingstartdate
					);
					emailHtml = emailHtml.replace(
						/nlemsverifyervicetable/gi,
						serviceTable
					);
					// emailHtml = emailHtml.replace(/<nlemcontactfirstname>/gi, firstname);
				}

				//Email Template Name: 202402 - Verify Free Trial Services
				if (templateId == 420) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");

					var dynamicSCFURL = null;
					if (!isNullorEmpty(commreg)) {
						var commRegRecord = nlapiLoadRecord('customrecord_commencement_register', commreg);
						dynamicSCFURL = commRegRecord.getFieldValue('custrecord_dynamic_scf_url');
					}

					if (isNullorEmpty(dynamicSCFURL)) {
						var expInterest =
							'<a class="mcnButton " href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1959&deploy=1&compid=1048144&ns-at=AAEJ7tMQCuxUJvJ4RvyaI99vrX6kaBIKkbBebvVixmguZdaobdA&custinternalid=' +
							recId +
							'"  style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Agree">Agree</a>';
					} else {
						var expInterest =
							'<a class="mcnButton " href="' + dynamicSCFURL + '"  style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Agree">Agree</a>';
					}

					nlapiLogExecution("DEBUG", "commreg", commreg);

					var searched_service_change = nlapiLoadSearch(
						"customrecord_servicechg",
						"customsearch_salesp_service_chg"
					);

					var newFilters = new Array();
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"custrecord_service_customer",
						"CUSTRECORD_SERVICECHG_SERVICE",
						"is",
						recId
					);
					if (!isNullorEmpty(commreg)) {
						newFilters[newFilters.length] = new nlobjSearchFilter(
							"custrecord_servicechg_comm_reg",
							null,
							"is",
							commreg
						);
					}
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"custrecord_servicechg_status",
						null,
						"anyof",
						[1, 2, 4]
					);

					searched_service_change.addFilters(newFilters);

					resultSet_service_change = searched_service_change.runSearch();

					var serviceResult = resultSet_service_change.getResults(0, 6);

					var service = [];
					var serviceFreq = [];
					var price = [];

					var service_freq = "";

					var dateEffective = null;
					var trialEndDate = null;

					var serviceTable =
						'<table border="1" cellpadding="1" cellspacing="1" style="width: 100%;"><thead><tr><th><b>SERVICE NAME</b></th><th style="vertical-align: middle;text-align: center;"><b>FREQUENCY</b></th><th style="vertical-align: middle;text-align: center;"><b>RATE</b></th></tr></thead><tbody>';

					for (n = 0; n < serviceResult.length; n++) {
						var serviceChangeId = serviceResult[n].getValue("internalid");
						var serviceId = serviceResult[n].getValue(
							"custrecord_servicechg_service"
						);
						var serviceText = serviceResult[n].getText(
							"custrecord_servicechg_service"
						);
						var serviceDescp = serviceResult[n].getValue(
							"custrecord_service_description",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var oldServicePrice = serviceResult[n].getValue(
							"custrecord_service_price",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var serviceNSItem = serviceResult[n].getValue(
							"custrecord_service_ns_item",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var serviceNSItemText = serviceResult[n].getText(
							"custrecord_service_ns_item",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var newServiceChangePrice = serviceResult[n].getValue(
							"custrecord_servicechg_new_price"
						);
						dateEffective = serviceResult[n].getValue(
							"custrecord_servicechg_date_effective"
						);
						trialEndDate = serviceResult[n].getValue(
							"custrecord_trial_end_date"
						);
						var commRegId = serviceResult[n].getValue(
							"custrecord_servicechg_comm_reg"
						);
						var serviceChangeTypeText = serviceResult[n].getText(
							"custrecord_servicechg_type"
						);
						var serviceChangeFreqText = serviceResult[n].getValue(
							"custrecord_servicechg_new_freq"
						);

						nlapiLogExecution("DEBUG", "serviceNSItem", serviceNSItem);
						nlapiLogExecution("DEBUG", "serviceNSItemText", serviceNSItemText);
						nlapiLogExecution(
							"DEBUG",
							"serviceChangeFreqText.length",
							serviceChangeFreqText.length
						);
						nlapiLogExecution(
							"DEBUG",
							"serviceChangeFreqText.split(,).length",
							serviceChangeFreqText.split(",").length
						);

						var serviceFreqText = "";

						service[service.length] = serviceNSItemText;
						if (serviceChangeFreqText.split(",").length == 5) {
							serviceFreq[serviceFreq.length] = "Daily";
							serviceFreqText = "Daily";
						} else {
							serviceFreq[serviceFreq.length] = freqCal(serviceChangeFreqText);
							serviceFreqText = freqCal(serviceChangeFreqText);
						}
						price[price.length] = newServiceChangePrice;

						serviceTable += "<tr>";
						serviceTable += "<td>" + serviceNSItemText + "</td>";
						serviceTable += "<td>" + serviceFreqText + "</td>";
						serviceTable += "<td>$" + newServiceChangePrice + "</td>";

						serviceTable += "</tr>";
					}

					serviceTable += "</tbody></table>";

					// emailHtml = emailHtml.replace(/<nlemsalesrepname>/gi, salesRepName);
					emailHtml = emailHtml.replace(/nlemagreebutton/gi, expInterest);
					emailHtml = emailHtml.replace(/nlemservicestartdate/gi, commdate);
					emailHtml = emailHtml.replace(
						/nlemservicetrialenddate/gi,
						trialEndDate
					);
					emailHtml = emailHtml.replace(
						/nlembillingstartdate/gi,
						billingstartdate
					);
					emailHtml = emailHtml.replace(
						/nlemsverifyervicetable/gi,
						serviceTable
					);
					// emailHtml = emailHtml.replace(/<nlemcontactfirstname>/gi, firstname);
				}

				//Email Template Name: Under Declaring Package Size Reminder
				if (templateId == 384) {
					if (!isNullorEmpty(recId)) {
						var customer_record = nlapiLoadRecord("customer", recId);
						var entityid = customer_record.getFieldValue("entityid");
						var companyname = customer_record.getFieldValue("companyname");

						var recContact = nlapiLoadRecord("contact", contactID);

						var contactEmail = recContact.getFieldValue("email");
						var contactPhone = recContact.getFieldValue("phone");
						var firstname = recContact.getFieldValue("firstname");

						var bookACall =
							'<a class="mcnButton " href="https://mailplus.com.au/book-a-sales-call/?custinternalid=' +
							recId +
							"&custname=" +
							encodeURIComponent(companyname) +
							"&email=" +
							contactEmail +
							"&phone=" +
							contactPhone +
							"&firstname=" +
							firstname +
							"&lastname=" +
							lastname +
							"&contactid=" +
							contactID +
							'" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Book a Call</a>';

						// emailHtml = emailHtml.replace(/<nlemsalesrepname>/gi, salesRepName);
						emailHtml = emailHtml.replace(/<nlembookacall>/gi, bookACall);
						// emailHtml = emailHtml.replace(/<nlemcontactfirstname>/gi, firstname);
					} else {
						var bookACall =
							'<a class="mcnButton " href="" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Book a Call</a>';

						// emailHtml = emailHtml.replace(/<nlemsalesrepname>/gi, salesRepName);
						emailHtml = emailHtml.replace(/<nlembookacall>/gi, bookACall);
					}
				}

				//Email Template Name: 202301 - 250g Now Available
				if (templateId == 385) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");
					var partner_id = customer_record.getFieldValue("partner");
					var usage_per_week = customer_record.getFieldValue(
						"custentity_form_mpex_usage_per_week"
					);

					var previous_carrier = customer_record.getFieldValue(
						"custentity_previous_carrier"
					);

					var partner_record = nlapiLoadRecord("partner", partner_id);
					var mp_std_activated = partner_record.getFieldValue(
						"custentity_zee_mp_std_activated"
					);

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");
					var lastname = recContact.getFieldValue("lastname");

					var searched_address = nlapiLoadSearch(
						"customer",
						"customsearch_smc_address"
					);

					var newFilters_addresses = new Array();
					newFilters_addresses[0] = new nlobjSearchFilter(
						"internalid",
						null,
						"is",
						recId
					);

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
							id = searchResult_address.getValue(
								"addressinternalid",
								"Address",
								null
							);
							addr1 = searchResult_address.getValue(
								"address1",
								"Address",
								null
							);
							addr2 = searchResult_address.getValue(
								"address2",
								"Address",
								null
							);
							city = searchResult_address.getValue("city", "Address", null);
							state = searchResult_address.getValue("state", "Address", null);
							zip = searchResult_address.getValue("zipcode", "Address", null);

							return true;
						});
					}

					var signUp =
						'<a class="mcnButton " href="https://mailplus.com.au/sign-up/?custinternalid=' +
						recId +
						"&custname=" +
						encodeURIComponent(companyname) +
						"&email=" +
						contactEmail +
						"&phone=" +
						contactPhone +
						"&firstname=" +
						firstname +
						"&lastname=" +
						lastname +
						"&contactid=" +
						contactID +
						"&state=" +
						state +
						"&salesRep=" +
						salesRep +
						'" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Gain Access Now</a>';

					var bookACall =
						'<a class="mcnButton " href="https://mailplus.com.au/book-a-sales-call/?custinternalid=' +
						recId +
						"&custname=" +
						encodeURIComponent(companyname) +
						"&email=" +
						contactEmail +
						"&phone=" +
						contactPhone +
						"&firstname=" +
						firstname +
						"&lastname=" +
						lastname +
						"&contactid=" +
						contactID +
						'" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Book a Call</a>';

					var notInterested =
						'<a class="mcnButton " href="https://mailplus.com.au/not-interested/?custinternalid=' +
						recId +
						"&custname=" +
						encodeURIComponent(companyname) +
						'" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Book a call">Not Interested</a>';

					emailHtml = emailHtml.replace(/<nlemsignup>/gi, signUp);
					emailHtml = emailHtml.replace(/<nlembookacall>/gi, bookACall);
				}

				if (templateId == 449) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");
					var firstname = recContact.getFieldValue("entityid");

					var portalOrientation =
						'<a href="https://mailplus.com.au/shipping-portal-orientation/?custinternalid=' +
						recId +
						"&custname=" +
						companyname +
						"&email=" +
						contactEmail +
						"&phone=" +
						contactPhone +
						"&firstname=" +
						firstname +
						'" target="_blank" ><strong><span style="font-family:&quot;Helvetica Neue&quot;;color:#155370">HERE</span></strong></a>';

					emailHtml = emailHtml.replace(/nlemcontactfirstname/gi, firstname);
					emailHtml = emailHtml.replace(
						/nlemcontactsupport/gi,
						portalOrientation
					);
				}

				//202406 - Premium - Lost - Send 1 - Intro
				if (templateId == 458) {
					nlapiLogExecution(
						"DEBUG",
						"202406 - Premium - Lost - Send 1 - Intro",
						""
					);
					var recContact = "";
					var firstname = "";
					var optOutButton = "";
					if (!isNullorEmpty(contactID)) {
						recContact = nlapiLoadRecord("contact", contactID);

						firstname = recContact.getFieldValue("firstname");

						optOutButton =
							'<a class="mceButtonLink" href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1896&deploy=1&compid=1048144&ns-at=AAEJ7tMQW4Gl6dYoqwmeMLNGC5DMzj_w0yktOoO0kv2PRzfvnPk&custinternalid=' +
							recId +
							"&contactid=" +
							contactID +
							'" style="background-color: #ffffff; border-radius: 50px; border: 1px solid #000000; color: #000000; display: block; font-family: "Helvetica Neue", Helvetica, Arial, Verdana, sans-serif; font-size: 12px; font-weight: normal; font-style: normal; padding: 16px 28px; text-decoration: none; min-width: 30px; text-align: center; direction: ltr; letter-spacing: 0px;" target="_blank" rel="noopener">OPT OUT</a>';
					}

					var reactivateAccountChangeStatusToHotLead =
						'<a class="mceButtonLink" href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1897&deploy=1&compid=1048144&ns-at=AAEJ7tMQhTv1d5apev0I79yUW3t091tD0XiKtKBbe_1zTMpSr7U&custinternalid=' +
						recId +
						'" style="background-color: #155370; border-radius: 50px;  color: #ffffff; display: block; font-family: "Helvetica Neue", Helvetica, Arial, Verdana, sans-serif; font-size: 16px; font-weight: bold; font-style: normal; padding: 16px 28px; text-decoration: none; min-width: 30px; text-align: center; direction: ltr; letter-spacing: 0px;" target="_blank" rel="noopener">REACTIVATE MY FREE ACCOUNT</a>';

					emailHtml = emailHtml.replace(/nlemcontactfirstname/gi, firstname);
					emailHtml = emailHtml.replace(
						/nlemreactivateaccountbutton/gi,
						reactivateAccountChangeStatusToHotLead
					);
					emailHtml = emailHtml.replace(/nlemoptoutbutton/gi, optOutButton);
				}

				//202406 - Premium - Lost - Send 2 - Intro
				if (templateId == 461 || templateId == 462) {
					nlapiLogExecution(
						"DEBUG",
						"202406 - Premium - Lost - Send 2 - Intro",
						""
					);

					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");

					var recContact = "";
					var firstname = "";
					var lastname = "";
					var email = "";
					var phone = "";
					var optOutButton = "";
					if (!isNullorEmpty(contactID)) {
						recContact = nlapiLoadRecord("contact", contactID);

						firstname = recContact.getFieldValue("firstname");
						lastname = recContact.getFieldValue("lastname");
						email = recContact.getFieldValue("email");
						phone = recContact.getFieldValue("phone");

						optOutButton =
							'<a class="mceButtonLink" href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1896&deploy=1&compid=1048144&ns-at=AAEJ7tMQW4Gl6dYoqwmeMLNGC5DMzj_w0yktOoO0kv2PRzfvnPk&custinternalid=' +
							recId +
							"&contactid=" +
							contactID +
							'" style="background-color: #ffffff; border-radius: 50px; color: #000000; display: block; font-family: "Helvetica Neue", Helvetica, Arial, Verdana, sans-serif; font-size: 12px; font-weight: normal; font-style: normal; padding: 16px 28px; text-decoration: none; min-width: 30px; text-align: center; direction: ltr; letter-spacing: 0px;" target="_blank" rel="noopener">OPT OUT</a>';
					}

					var reactivateAccountChangeStatusToHotLead =
						'<a class="mceButtonLink" href="https://mailplus.com.au/reactivate-account/?entityid=' +
						entityid +
						"&contactid=" +
						contactID +
						"&firstname=" +
						firstname +
						"&lastname=" +
						lastname +
						"&email=" +
						email +
						"&phone=" +
						phone +
						'" style="background-color: #155370; border-radius: 50px;  color: #ffffff; display: block; font-family: "Helvetica Neue", Helvetica, Arial, Verdana, sans-serif; font-size: 16px; font-weight: bold; font-style: normal; padding: 16px 28px; text-decoration: none; min-width: 30px; text-align: center; direction: ltr; letter-spacing: 0px;" target="_blank" rel="noopener">REACTIVATE MY FREE ACCOUNT</a>';

					emailHtml = emailHtml.replace(/nlemcontactfirstname/gi, firstname);
					emailHtml = emailHtml.replace(
						/nlemreactivateaccountbutton/gi,
						reactivateAccountChangeStatusToHotLead
					);
					emailHtml = emailHtml.replace(/nlemoptoutbutton/gi, optOutButton);
				}

				//202406 - Premium - Send 4 - Speed - Tuesday
				if (
					templateId == 456 ||
					templateId == 455 ||
					templateId == 454 ||
					templateId == 453 ||
					templateId == 450
				) {
					nlapiLogExecution(
						"DEBUG",
						"202406 - Premium - Lost - Send 1 - Intro",
						""
					);
					var recContact = "";
					var firstname = "";
					var optOutButton = "";
					if (!isNullorEmpty(contactID)) {
						recContact = nlapiLoadRecord("contact", contactID);

						firstname = recContact.getFieldValue("firstname");

						optOutButton =
							'<a class="mceButtonLink" href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1896&deploy=1&compid=1048144&ns-at=AAEJ7tMQW4Gl6dYoqwmeMLNGC5DMzj_w0yktOoO0kv2PRzfvnPk&custinternalid=' +
							recId +
							"&contactid=" +
							contactID +
							'" style="background-color: #ffffff; border-radius: 50px; border: 1px solid #000000; color: #000000; display: block; font-family: "Helvetica Neue", Helvetica, Arial, Verdana, sans-serif; font-size: 12px; font-weight: normal; font-style: normal; padding: 16px 28px; text-decoration: none; min-width: 30px; text-align: center; direction: ltr; letter-spacing: 0px;" target="_blank" rel="noopener">OPT OUT</a>';
					}

					emailHtml = emailHtml.replace(/nlemoptoutbutton/gi, optOutButton);
				}

				//Email Template Name: 202408 - BAU - MP Product Quotes
				//Email Template Name: 20241113 - T2 - Quote Sent Email - Premium Focus
				if (templateId == 466 || templateId == 475) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");
					var partner_id = customer_record.getFieldValue("partner");
					var partner_record = nlapiLoadRecord("partner", partner_id);
					var mp_str_activated = partner_record.getFieldValue(
						"custentity_zee_mp_str_activated"
					);
					var mp_std_activated = partner_record.getFieldValue(
						"custentity_zee_mp_std_activated"
					);
					if (isNullorEmpty(mp_str_activated) || mp_str_activated == 2) {
						var nostdactive =
							'<br><span style="color:#FF0000">Unfortunately, this service is not currently available in your area yet.</span><br><br>';
						emailHtml = emailHtml.replace(/nlemprmactive/gi, nostdactive);
					} else {
						emailHtml = emailHtml.replace(/nlemprmactive/gi, "");
					}

					if (mp_std_activated != 1 && mp_std_activated != "1") {
						var nostdactive =
							'<br><span style="color:#FF0000">Unfortunately, this service is not currently available in your area yet.</span><br><br>';
						emailHtml = emailHtml.replace(/nlemnostdactive/gi, nostdactive);
					} else {
						emailHtml = emailHtml.replace(/nlemnostdactive/gi, "");
					}

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");

					var dynamicSCFURL = null;
					if (!isNullorEmpty(commreg)) {
						var commRegRecord = nlapiLoadRecord('customrecord_commencement_register', commreg);
						dynamicSCFURL = commRegRecord.getFieldValue('custrecord_dynamic_scf_url');
					}

					if (isNullorEmpty(dynamicSCFURL)) {
						var expInterest =
							'<a class="mcnButton " href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1959&deploy=1&compid=1048144&ns-at=AAEJ7tMQCuxUJvJ4RvyaI99vrX6kaBIKkbBebvVixmguZdaobdA&custinternalid=' +
							recId +
							'"  style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Agree">Agree</a>';
					} else {
						var expInterest =
							'<a class="mcnButton " href="' + dynamicSCFURL + '"  style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Agree">Agree</a>';
					}



					nlapiLogExecution("DEBUG", "commreg", commreg);

					var searched_service_change = nlapiLoadSearch(
						"customrecord_servicechg",
						"customsearch_salesp_service_chg"
					);

					var newFilters = new Array();
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"custrecord_service_customer",
						"CUSTRECORD_SERVICECHG_SERVICE",
						"is",
						recId
					);
					if (!isNullorEmpty(commreg)) {
						newFilters[newFilters.length] = new nlobjSearchFilter(
							"custrecord_servicechg_comm_reg",
							null,
							"is",
							commreg
						);
					}
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"custrecord_servicechg_status",
						null,
						"anyof",
						[1, 2, 4]
					);

					searched_service_change.addFilters(newFilters);

					resultSet_service_change = searched_service_change.runSearch();

					var serviceResult = resultSet_service_change.getResults(0, 6);

					var service = [];
					var serviceFreq = [];
					var price = [];

					var service_freq = "";

					var dateEffective = null;
					var trialEndDate = null;

					//Removing the service table on Luke's request.
					// var serviceTable =
					//     '<table border="1" cellpadding="1" cellspacing="1" style="width:500px;"><thead><tr><th><b>SERVICE NAME</b></th><th style="vertical-align: middle;text-align: center;"><b>FREQUENCY</b></th><th style="vertical-align: middle;text-align: center;"><b>RATE</b></th></tr></thead><tbody>';

					var serviceText =
						"Your PMPO collection service is scheduled to be Daily at $8";

					for (n = 0; n < serviceResult.length; n++) {
						var serviceChangeId = serviceResult[n].getValue("internalid");
						var serviceId = serviceResult[n].getValue(
							"custrecord_servicechg_service"
						);
						var serviceText = serviceResult[n].getText(
							"custrecord_servicechg_service"
						);
						var serviceDescp = serviceResult[n].getValue(
							"custrecord_service_description",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var oldServicePrice = serviceResult[n].getValue(
							"custrecord_service_price",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var serviceNSItem = serviceResult[n].getValue(
							"custrecord_service_ns_item",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var serviceNSItemText = serviceResult[n].getText(
							"custrecord_service_ns_item",
							"CUSTRECORD_SERVICECHG_SERVICE",
							null
						);
						var newServiceChangePrice = serviceResult[n].getValue(
							"custrecord_servicechg_new_price"
						);
						dateEffective = serviceResult[n].getValue(
							"custrecord_servicechg_date_effective"
						);
						trialEndDate = serviceResult[n].getValue(
							"custrecord_trial_end_date"
						);
						var commRegId = serviceResult[n].getValue(
							"custrecord_servicechg_comm_reg"
						);
						var serviceChangeTypeText = serviceResult[n].getText(
							"custrecord_servicechg_type"
						);
						var serviceChangeFreqText = serviceResult[n].getValue(
							"custrecord_servicechg_new_freq"
						);

						nlapiLogExecution("DEBUG", "serviceNSItem", serviceNSItem);
						nlapiLogExecution("DEBUG", "serviceNSItemText", serviceNSItemText);
						nlapiLogExecution(
							"DEBUG",
							"serviceChangeFreqText.length",
							serviceChangeFreqText.length
						);
						nlapiLogExecution(
							"DEBUG",
							"serviceChangeFreqText.split(,).length",
							serviceChangeFreqText.split(",").length
						);

						var serviceFreqText = "";

						service[service.length] = serviceNSItemText;
						if (serviceChangeFreqText.split(",").length == 5) {
							serviceFreq[serviceFreq.length] = "Daily";
							serviceFreqText = "Daily";
						} else {
							serviceFreq[serviceFreq.length] = freqCal(serviceChangeFreqText);
							serviceFreqText = freqCal(serviceChangeFreqText);
						}
						price[price.length] = newServiceChangePrice;

						serviceText =
							serviceNSItemText +
							": $" +
							newServiceChangePrice +
							" exc. GST per collection. (After the trial.) ";
					}

					//NS Search: Product Pricing - Letters - Quotes
					var prodPricingLetterstobeSentSearch = nlapiLoadSearch(
						"customrecord_product_pricing",
						"customsearch_prod_pricing_letters_quotes"
					);

					var newFilters = new Array();
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"internalid",
						"custrecord_prod_pricing_customer",
						"anyof",
						recId
					);

					prodPricingLetterstobeSentSearch.addFilters(newFilters);

					var resultSetProdPricingLetters =
						prodPricingLetterstobeSentSearch.runSearch();

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

					var mpPrm1kg = [];
					var mpPrm3kg = [];
					var mpPrm5kg = [];
					var mpPrm10kg = [];
					var mpPrm20kg = [];

					var oldCustomerId = null;
					var count = 0;
					var oldDeliverySpeed = null;

					resultSetProdPricingLetters.forEachResult(function (searchResult) {
						var prodPricingInternalId = searchResult.getValue("internalid");
						var custId = searchResult.getValue(
							"custrecord_prod_pricing_customer"
						);
						var deliverySpeed = searchResult.getValue(
							"custrecord_prod_pricing_delivery_speeds"
						);
						var pricePlan250g = searchResult.getValue(
							"custrecord_prod_pricing_250g"
						);
						var price250g = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_250G",
							null
						);
						var pricePlan500g = searchResult.getValue(
							"custrecord_prod_pricing_500g"
						);
						var price500g = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_500G",
							null
						);
						var pricePlan1Kg = searchResult.getValue(
							"custrecord_prod_pricing_1kg"
						);
						var price1Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_1KG",
							null
						);
						var pricePlan3Kg = searchResult.getValue(
							"custrecord_prod_pricing_3kg"
						);
						var price3Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_3KG",
							null
						);
						var pricePlan5Kg = searchResult.getValue(
							"custrecord_prod_pricing_5kg"
						);
						var price5Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_5KG",
							null
						);
						var pricePlan10Kg = searchResult.getValue(
							"custrecord_prod_pricing_10kg"
						);
						var price10Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_10KG",
							null
						);
						var pricePlan20Kg = searchResult.getValue(
							"custrecord_prod_pricing_20kg"
						);
						var price20Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_20KG",
							null
						);
						var pricePlan25Kg = searchResult.getValue(
							"custrecord_prod_pricing_25kg"
						);
						var price25Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_25KG",
							null
						);

						nlapiLogExecution("DEBUG", "deliverySpeed", deliverySpeed);
						nlapiLogExecution("DEBUG", "custId", custId);
						nlapiLogExecution("DEBUG", "price250g", price250g);
						nlapiLogExecution("DEBUG", "price500g", price500g);
						nlapiLogExecution("DEBUG", "price1Kg", price1Kg);
						nlapiLogExecution("DEBUG", "price3Kg", price3Kg);
						nlapiLogExecution("DEBUG", "price5Kg", price5Kg);
						nlapiLogExecution("DEBUG", "price10Kg", price10Kg);
						nlapiLogExecution("DEBUG", "price20Kg", price20Kg);
						nlapiLogExecution("DEBUG", "price25Kg", price25Kg);

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
							} else if (deliverySpeed == 4) {
								mpPrm1kg.push(price1Kg);
								mpPrm3kg.push(price3Kg);
								mpPrm5kg.push(price5Kg);
								mpPrm10kg.push(price10Kg);
								mpPrm20kg.push(price20Kg);
							}
						} else if (oldCustomerId == custId) {
							nlapiLogExecution(
								"DEBUG",
								"Same customer: oldCustomerId",
								oldCustomerId
							);
							nlapiLogExecution(
								"DEBUG",
								"Same customer: oldDeliverySpeed",
								oldDeliverySpeed
							);
							if (oldDeliverySpeed == deliverySpeed) {
								nlapiDeleteRecord(
									"customrecord_product_pricing",
									prodPricingInternalId
								);
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
								} else if (deliverySpeed == 4) {
									mpPrm1kg.push(price1Kg);
									mpPrm3kg.push(price3Kg);
									mpPrm5kg.push(price5Kg);
									mpPrm10kg.push(price10Kg);
									mpPrm20kg.push(price20Kg);
								}
							}
						}

						oldCustomerId = custId;
						oldDeliverySpeed = deliverySpeed;
						count++;
						return true;
					});

					if (count > 0 && !isNullorEmpty(oldCustomerId)) {
						//EXPRESS
						if (mpExp5kg.length == 0) {
							mpExp5kg[0] = 0;
						}
						if (mpExp3kg.length == 0) {
							mpExp3kg[0] = 0;
						}
						if (mpExp1kg.length == 0) {
							mpExp1kg[0] = 0;
						}
						if (mpExp500g.length == 0) {
							mpExp500g[0] = 0;
						}

						nlapiLogExecution("DEBUG", "Out loop:Exp ", mpExp5kg);
						nlapiLogExecution("DEBUG", "Out loop:Exp ", mpExp3kg);
						nlapiLogExecution("DEBUG", "Out loop:Exp ", mpExp1kg);
						nlapiLogExecution("DEBUG", "Out loop:Exp ", mpExp500g);

						emailHtml = emailHtml.replace(/nlem5kgexp/gi, mpExp5kg[0]);
						emailHtml = emailHtml.replace(/nlem3kgexp/gi, mpExp3kg[0]);
						emailHtml = emailHtml.replace(/nlem1kgexp/gi, mpExp1kg[0]);
						emailHtml = emailHtml.replace(/nlem500gexp/gi, mpExp500g[0]);
						//STANDARD
						if (mpStd20kg.length == 0) {
							mpStd20kg[0] = 0;
						}
						if (mpStd25kg.length == 0) {
							mpStd25kg[0] = 0;
						}
						if (mpStd10kg.length == 0) {
							mpStd10kg[0] = 0;
						}
						if (mpStd5kg.length == 0) {
							mpStd5kg[0] = 0;
						}
						if (mpStd3kg.length == 0) {
							mpStd3kg[0] = 0;
						}
						if (mpStd1kg.length == 0) {
							mpStd1kg[0] = 0;
						}
						if (mpStd500g.length == 0) {
							mpStd500g[0] = 0;
						}
						if (mpStd250g.length == 0) {
							mpStd250g[0] = 0;
						}
						nlapiLogExecution("DEBUG", "Out loop:Std ", mpStd20kg);
						nlapiLogExecution("DEBUG", "Out loop:Std ", mpStd25kg);
						nlapiLogExecution("DEBUG", "Out loop:Std ", mpStd10kg);
						nlapiLogExecution("DEBUG", "Out loop:Std ", mpStd5kg);
						nlapiLogExecution("DEBUG", "Out loop:Std ", mpStd3kg);
						nlapiLogExecution("DEBUG", "Out loop:Std ", mpStd1kg);
						nlapiLogExecution("DEBUG", "Out loop:Std ", mpStd500g);
						nlapiLogExecution("DEBUG", "Out loop:Std ", mpStd250g);
						emailHtml = emailHtml.replace(/nlem20kgstd/gi, mpStd20kg[0]);
						emailHtml = emailHtml.replace(/nlem25kgstd/gi, mpStd25kg[0]);
						emailHtml = emailHtml.replace(/nlem10kgstd/gi, mpStd10kg[0]);
						emailHtml = emailHtml.replace(/nlem5kgstd/gi, mpStd5kg[0]);
						emailHtml = emailHtml.replace(/nlem3kgstd/gi, mpStd3kg[0]);
						emailHtml = emailHtml.replace(/nlem1kgstd/gi, mpStd1kg[0]);
						emailHtml = emailHtml.replace(/nlem500gstd/gi, mpStd500g[0]);
						emailHtml = emailHtml.replace(/nlem250gstd/gi, mpStd250g[0]);
						//PREMIUM
						if (mpPrm1kg.length == 0) {
							mpPrm1kg[0] = 0;
						}
						if (mpPrm3kg.length == 0) {
							mpPrm3kg[0] = 0;
						}
						if (mpPrm5kg.length == 0) {
							mpPrm5kg[0] = 0;
						}
						if (mpPrm10kg.length == 0) {
							mpPrm10kg[0] = 0;
						}
						if (mpPrm20kg.length == 0) {
							mpPrm20kg[0] = 0;
						}
						nlapiLogExecution("DEBUG", "Out loop:Prm ", mpPrm1kg);
						nlapiLogExecution("DEBUG", "Out loop:Prm ", mpPrm3kg);
						nlapiLogExecution("DEBUG", "Out loop:Prm ", mpPrm5kg);
						nlapiLogExecution("DEBUG", "Out loop:Prm ", mpPrm10kg);
						nlapiLogExecution("DEBUG", "Out loop:Prm ", mpPrm20kg);
						emailHtml = emailHtml.replace(/nlem1kgprm/gi, mpPrm1kg[0]);
						emailHtml = emailHtml.replace(/nlem3kgprm/gi, mpPrm3kg[0]);
						emailHtml = emailHtml.replace(/nlem5kgprm/gi, mpPrm5kg[0]);
						emailHtml = emailHtml.replace(/nlem10kgprm/gi, mpPrm10kg[0]);
						emailHtml = emailHtml.replace(/nlem20kgprm/gi, mpPrm20kg[0]);
					}

					emailHtml = emailHtml.replace(/nlemagreebutton/gi, expInterest);
				}

				//Email template Name: 202409 - LPO - No Answer - Nudge
				if (templateId == 471) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var partner_id = customer_record.getFieldValue("partner");
					var parent_lpo_id = customer_record.getFieldValue(
						"custentity_lpo_parent_account"
					);
					var parent_lpo_record = nlapiLoadRecord("customer", parent_lpo_id);
					var parent_lpo_name = parent_lpo_record.getFieldValue("companyname");
					var partner_record = nlapiLoadRecord("partner", partner_id);
					var zee_contact_name = partner_record.getFieldValue("custentity3");
					var zee_mobile_number = partner_record.getFieldValue("custentity2");
					var zee_first_name = partner_record.getFieldValue(
						"custentity_franchisee_firstname"
					);

					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");
					var lastname = recContact.getFieldValue("lastname");

					emailHtml = emailHtml.replace(/nlemlponame/gi, parent_lpo_name);
					emailHtml = emailHtml.replace(/nlemcontactfirstname/gi, firstname);
					emailHtml = emailHtml.replace(/nlemsalesreptext/gi, salesRepName);
				}

				//EmailTemplate ID 484: 202502 - Call Force - Email Brush Off
				//EmailTemplate ID 483: 202502 - Call Force - Email Interested
				if (templateId == 483 || templateId == 484) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					if (!isNullorEmpty(contactID)) {
						var recContact = nlapiLoadRecord("contact", contactID);

						var contactEmail = recContact.getFieldValue("email");
						var contactPhone = recContact.getFieldValue("phone");
						var firstname = recContact.getFieldValue("firstname");
					} else {
						var firstname = "";
						var contactEmail = customer_record.getFieldValue(
							"custentity_email_service"
						);
						var contactPhone = customer_record.getFieldValue("phone");
					}

					var expInterest =
						'<a class=" " href="https://mailplus.com.au/schedule-a-call/?custinternalid=' +
						recId +
						"&custname=" +
						companyname +
						"&email=" +
						contactEmail +
						"&phone=" +
						contactPhone +
						"&firstname=" +
						firstname +
						'" >Book a Quick Call Here</a>';

					var employeeFields = ["entityid", "email", "phone", "custentity_8x8_number"];
					var employeeFieldsValues = nlapiLookupField(
						"employee",
						parseInt(userID),
						employeeFields
					);

					emailHtml = emailHtml.replace(
						/nlemsalesrepname/gi,
						employeeFieldsValues.entityid
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrepnumber/gi,
						employeeFieldsValues.phone
					);
					emailHtml = emailHtml.replace(/nlembookacall/gi, expInterest);
				}

				//487: Call Force - Interested no Appointment Set
				if (templateId == 487) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					if (!isNullorEmpty(contactID)) {
						var recContact = nlapiLoadRecord("contact", contactID);

						var contactEmail = recContact.getFieldValue("email");
						var contactPhone = recContact.getFieldValue("phone");
						var firstname = recContact.getFieldValue("firstname");
					} else {
						var firstname = "";
						var contactEmail = customer_record.getFieldValue(
							"custentity_email_service"
						);
						var contactPhone = customer_record.getFieldValue("phone");
					}

					var expInterest =
						'<a class=" " href="https://mailplus.com.au/schedule-a-call/?custinternalid=' +
						recId +
						"&custname=" +
						companyname +
						"&email=" +
						contactEmail +
						"&phone=" +
						contactPhone +
						"&firstname=" +
						firstname +
						'" >Schedule Call</a>';

					var employeeFields = ["entityid", "firstname", "email", "phone", "custentity_8x8_number"];
					var employeeFieldsValues = nlapiLookupField(
						"employee",
						parseInt(userID),
						employeeFields
					);

					emailHtml = emailHtml.replace(
						/nlemsalesrepfirstname/gi,
						employeeFieldsValues.firstname
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrepname/gi,
						employeeFieldsValues.entityid
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrep8x8number/gi,
						employeeFieldsValues.custentity_8x8_number
					);
					emailHtml = emailHtml.replace(/nlembookacall/gi, expInterest);
					emailHtml = emailHtml.replace(/nlemcontactfirstname/gi, firstname);
				}

				//486: 202503 - Call Force - Intro to MailPlus
				//492: 202503 - Call Force - Intro to MailPlus 2
				if (templateId == 486 || templateId == 492) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					if (!isNullorEmpty(contactID)) {
						var recContact = nlapiLoadRecord("contact", contactID);

						var contactEmail = recContact.getFieldValue("email");
						var contactPhone = recContact.getFieldValue("phone");
						var firstname = recContact.getFieldValue("firstname");
					} else {
						var firstname = "";
						var contactEmail = customer_record.getFieldValue(
							"custentity_email_service"
						);
						var contactPhone = customer_record.getFieldValue("phone");
					}

					var employeeFields = ["entityid", "firstname", "email", "phone", "custentity_8x8_number"];
					var employeeFieldsValues = nlapiLookupField(
						"employee",
						parseInt(userID),
						employeeFields
					);

					emailHtml = emailHtml.replace(
						/nlemtaskdate/gi,
						onboardingDate
					);
					emailHtml = emailHtml.replace(
						/nlemtasktime/gi,
						onboardingTime
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrepname/gi,
						employeeFieldsValues.entityid
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrep8x8number/gi,
						employeeFieldsValues.custentity_8x8_number
					);

					emailHtml = emailHtml.replace(/nlemcontactfirstname/gi, firstname);
				}

				//488: 202503 - Call Force - Brush Off Email 1
				if (templateId == 488) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					var employeeFields = ["entityid", "firstname", "email", "phone", "custentity_8x8_number"];
					var employeeFieldsValues = nlapiLookupField(
						"employee",
						parseInt(userID),
						employeeFields
					);

					var yesContact =
						'<a class=" " href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1997&deploy=1&compid=1048144&ns-at=AAEJ7tMQzmt7q_nLKp6j_rTuH1ia0SD1pPE8AFL46MpcjmMDSgE&outcome=yes&salesrep=' +
						userID +
						"&custinternalid=" +
						recId +
						"&custname=" +
						companyname +
						'&email=&phone=&firstname=" >YES</a>';

					var noContact =
						'<a class=" " href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1997&deploy=1&compid=1048144&ns-at=AAEJ7tMQzmt7q_nLKp6j_rTuH1ia0SD1pPE8AFL46MpcjmMDSgE&outcome=no&salesrep=' +
						userID +
						"&custinternalid=" +
						recId +
						"&custname=" +
						companyname +
						'&email=&phone=&firstname=" >NO</a>';
					emailHtml = emailHtml.replace(/nlemyescontact/gi, yesContact);
					emailHtml = emailHtml.replace(/nlemnocontact/gi, noContact);

					emailHtml = emailHtml.replace(
						/nlemtaskdate/gi,
						onboardingDate
					);
					emailHtml = emailHtml.replace(
						/nlemtasktime/gi,
						onboardingTime
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrepname/gi,
						employeeFieldsValues.entityid
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrep8x8number/gi,
						employeeFieldsValues.custentity_8x8_number
					);

					emailHtml = emailHtml.replace(/nlemcontactfirstname/gi, firstname);
					emailHtml = emailHtml.replace(/nlemcustomername/gi, companyname);
				}

				//488: 202503 - Call Force - Brush Off Email 2
				if (templateId == 489) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					if (!isNullorEmpty(contactID)) {
						var recContact = nlapiLoadRecord("contact", contactID);

						var contactEmail = recContact.getFieldValue("email");
						var contactPhone = recContact.getFieldValue("phone");
						var firstname = recContact.getFieldValue("firstname");
					} else {
						var firstname = "";
						var contactEmail = customer_record.getFieldValue(
							"custentity_email_service"
						);
						var contactPhone = customer_record.getFieldValue("phone");
					}

					var employeeFields = ["entityid", "firstname", "email", "phone", "custentity_8x8_number"];
					var employeeFieldsValues = nlapiLookupField(
						"employee",
						parseInt(userID),
						employeeFields
					);

					var yesContact =
						'<a class=" " href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1997&deploy=1&compid=1048144&ns-at=AAEJ7tMQzmt7q_nLKp6j_rTuH1ia0SD1pPE8AFL46MpcjmMDSgE&outcome=yes&salesrep=' +
						userID +
						"&custinternalid=" +
						recId +
						"&custname=" +
						companyname +
						'&email=&phone=&firstname=" >Yes, I’d like to know more</a>';

					var noContact =
						'<a class=" " href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1997&deploy=1&compid=1048144&ns-at=AAEJ7tMQzmt7q_nLKp6j_rTuH1ia0SD1pPE8AFL46MpcjmMDSgE&outcome=no&salesrep=' +
						userID +
						"&custinternalid=" +
						recId +
						"&custname=" +
						companyname +
						'&email=&phone=&firstname="  >No, please remove me</a>';
					emailHtml = emailHtml.replace(/nlemyescontact/gi, yesContact);
					emailHtml = emailHtml.replace(/nlemnocontact/gi, noContact);

					emailHtml = emailHtml.replace(
						/nlemtaskdate/gi,
						onboardingDate
					);
					emailHtml = emailHtml.replace(
						/nlemtasktime/gi,
						onboardingTime
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrepname/gi,
						employeeFieldsValues.entityid
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrep8x8number/gi,
						employeeFieldsValues.custentity_8x8_number
					);

					emailHtml = emailHtml.replace(/nlemcontactfirstname/gi, firstname);
					emailHtml = emailHtml.replace(/nlemcustomername/gi, companyname);
				}

				//488: 202503 - Call Force - Prospect - ShipMate Demo
				if (templateId == 490) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					//Get Premium, Express 7 Standard Surcharges at the Customer Level
					var premiumSurcharge = customer_record.getFieldValue("custentity_startrack_fuel_surcharge");
					var expressSurcharge = customer_record.getFieldValue("custentity_mpex_surcharge_rate");
					var standardSurcharge = customer_record.getFieldValue("custentity_sendle_fuel_surcharge");

					if (!isNullorEmpty(contactID)) {
						var recContact = nlapiLoadRecord("contact", contactID);

						var contactEmail = recContact.getFieldValue("email");
						var contactPhone = recContact.getFieldValue("phone");
						var firstname = recContact.getFieldValue("firstname");
					} else {
						var firstname = "";
						var contactEmail = customer_record.getFieldValue(
							"custentity_email_service"
						);
						var contactPhone = customer_record.getFieldValue("phone");
					}

					var employeeFields = ["entityid", "firstname", "email", "phone", "custentity_8x8_number"];
					var employeeFieldsValues = nlapiLookupField(
						"employee",
						parseInt(userID),
						employeeFields
					);


					emailHtml = emailHtml.replace(
						/nlemsalesrepname/gi,
						employeeFieldsValues.entityid
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrep8x8number/gi,
						employeeFieldsValues.custentity_8x8_number
					);

					emailHtml = emailHtml.replace(/nlemcontactfirstname/gi, firstname);


					//NS Search: Product Pricing - Letters - Quotes
					var prodPricingLetterstobeSentSearch = nlapiLoadSearch(
						"customrecord_product_pricing",
						"customsearch_prod_pricing_letters_quotes"
					);

					var newFilters = new Array();
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"internalid",
						"custrecord_prod_pricing_customer",
						"anyof",
						recId
					);

					prodPricingLetterstobeSentSearch.addFilters(newFilters);

					var resultSetProdPricingLetters =
						prodPricingLetterstobeSentSearch.runSearch();

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

					var mpPrm1kg = [];
					var mpPrm3kg = [];
					var mpPrm5kg = [];
					var mpPrm10kg = [];
					var mpPrm20kg = [];

					var oldCustomerId = null;
					var count = 0;
					var oldDeliverySpeed = null;

					resultSetProdPricingLetters.forEachResult(function (searchResult) {
						var prodPricingInternalId = searchResult.getValue("internalid");
						var custId = searchResult.getValue(
							"custrecord_prod_pricing_customer"
						);
						var deliverySpeed = searchResult.getValue(
							"custrecord_prod_pricing_delivery_speeds"
						);
						var pricePlan250g = searchResult.getValue(
							"custrecord_prod_pricing_250g"
						);
						var price250g = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_250G",
							null
						);
						var pricePlan500g = searchResult.getValue(
							"custrecord_prod_pricing_500g"
						);
						var price500g = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_500G",
							null
						);
						var pricePlan1Kg = searchResult.getValue(
							"custrecord_prod_pricing_1kg"
						);
						var price1Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_1KG",
							null
						);
						var pricePlan3Kg = searchResult.getValue(
							"custrecord_prod_pricing_3kg"
						);
						var price3Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_3KG",
							null
						);
						var pricePlan5Kg = searchResult.getValue(
							"custrecord_prod_pricing_5kg"
						);
						var price5Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_5KG",
							null
						);
						var pricePlan10Kg = searchResult.getValue(
							"custrecord_prod_pricing_10kg"
						);
						var price10Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_10KG",
							null
						);
						var pricePlan20Kg = searchResult.getValue(
							"custrecord_prod_pricing_20kg"
						);
						var price20Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_20KG",
							null
						);
						var pricePlan25Kg = searchResult.getValue(
							"custrecord_prod_pricing_25kg"
						);
						var price25Kg = searchResult.getValue(
							"baseprice",
							"CUSTRECORD_PROD_PRICING_25KG",
							null
						);

						nlapiLogExecution("DEBUG", "deliverySpeed", deliverySpeed);
						nlapiLogExecution("DEBUG", "custId", custId);
						nlapiLogExecution("DEBUG", "price250g", price250g);
						nlapiLogExecution("DEBUG", "price500g", price500g);
						nlapiLogExecution("DEBUG", "price1Kg", price1Kg);
						nlapiLogExecution("DEBUG", "price3Kg", price3Kg);
						nlapiLogExecution("DEBUG", "price5Kg", price5Kg);
						nlapiLogExecution("DEBUG", "price10Kg", price10Kg);
						nlapiLogExecution("DEBUG", "price20Kg", price20Kg);
						nlapiLogExecution("DEBUG", "price25Kg", price25Kg);

						if (count == 0) {
							if (deliverySpeed == 2) {
								mpExp500g.push({ price500g: price500g, price500gGST: price500g * 1.1, price500gwithGSTSurcharge: ((((price500g * 1.1) * expressSurcharge) / 100) + (price500g * 1.1)) });
								mpExp1kg.push({ price1Kg: price1Kg, price1KgGST: price1Kg * 1.1, price1KgwithGSTSurcharge: ((((price1Kg * 1.1) * expressSurcharge) / 100) + (price1Kg * 1.1)) });
								mpExp3kg.push({ price3Kg: price3Kg, price3KgGST: price3Kg * 1.1, price3KgwithGSTSurcharge: ((((price3Kg * 1.1) * expressSurcharge) / 100) + (price3Kg * 1.1)) });
								mpExp5kg.push({ price5Kg: price5Kg, price5KgGST: price5Kg * 1.1, price5KgwithGSTSurcharge: ((((price5Kg * 1.1) * expressSurcharge) / 100) + (price5Kg * 1.1)) });
							} else if (deliverySpeed == 1) {
								mpStd250g.push({ price250g: price250g, price250gGST: price250g * 1.1, price250gwithGSTSurcharge: ((((price250g * 1.1) * standardSurcharge) / 100) + (price250g * 1.1)) });
								mpStd500g.push({ price500g: price500g, price500gGST: price500g * 1.1, price500gwithGSTSurcharge: ((((price500g * 1.1) * standardSurcharge) / 100) + (price500g * 1.1)) });
								mpStd1kg.push({ price1Kg: price1Kg, price1KgGST: price1Kg * 1.1, price1KgwithGSTSurcharge: ((((price1Kg * 1.1) * standardSurcharge) / 100) + (price1Kg * 1.1)) });
								mpStd3kg.push({ price3Kg: price3Kg, price3KgGST: price3Kg * 1.1, price3KgwithGSTSurcharge: ((((price3Kg * 1.1) * standardSurcharge) / 100) + (price3Kg * 1.1)) });
								mpStd5kg.push({ price5Kg: price5Kg, price5KgGST: price5Kg * 1.1, price5KgwithGSTSurcharge: ((((price5Kg * 1.1) * standardSurcharge) / 100) + (price5Kg * 1.1)) });
								mpStd10kg.push({ price10Kg: price10Kg, price10KgGST: price10Kg * 1.1, price10KgwithGSTSurcharge: ((((price10Kg * 1.1) * standardSurcharge) / 100) + (price10Kg * 1.1)) });
								mpStd20kg.push({ price20Kg: price20Kg, price20KgGST: price20Kg * 1.1, price20KgwithGSTSurcharge: ((((price20Kg * 1.1) * standardSurcharge) / 100) + (price20Kg * 1.1)) });
								mpStd25kg.push({ price25Kg: price25Kg, price25KgGST: price25Kg * 1.1, price25KgwithGSTSurcharge: ((((price25Kg * 1.1) * standardSurcharge) / 100) + (price25Kg * 1.1)) });
							} else if (deliverySpeed == 4) {
								mpPrm1kg.push({ price1Kg: price1Kg, price1KgGST: price1Kg * 1.1, price1KgwithGSTSurcharge: ((((price1Kg * 1.1) * premiumSurcharge) / 100) + (price1Kg * 1.1)) });
								mpPrm3kg.push({ price3Kg: price3Kg, price3KgGST: price3Kg * 1.1, price3KgwithGSTSurcharge: ((((price3Kg * 1.1) * premiumSurcharge) / 100) + (price3Kg * 1.1)) });
								mpPrm5kg.push({ price5Kg: price5Kg, price5KgGST: price5Kg * 1.1, price5KgwithGSTSurcharge: ((((price5Kg * 1.1) * premiumSurcharge) / 100) + (price5Kg * 1.1)) });
								mpPrm10kg.push({ price10Kg: price10Kg, price10KgGST: price10Kg * 1.1, price10KgwithGSTSurcharge: ((((price10Kg * 1.1) * premiumSurcharge) / 100) + (price10Kg * 1.1)) });
								mpPrm20kg.push({ price20Kg: price20Kg, price20KgGST: price20Kg * 1.1, price20KgwithGSTSurcharge: ((((price20Kg * 1.1) * premiumSurcharge) / 100) + (price20Kg * 1.1)) });
							}
						} else if (oldCustomerId == custId) {
							nlapiLogExecution(
								"DEBUG",
								"Same customer: oldCustomerId",
								oldCustomerId
							);
							nlapiLogExecution(
								"DEBUG",
								"Same customer: oldDeliverySpeed",
								oldDeliverySpeed
							);
							if (oldDeliverySpeed == deliverySpeed) {
								nlapiDeleteRecord(
									"customrecord_product_pricing",
									prodPricingInternalId
								);
								count--;
							} else {
								if (deliverySpeed == 2) {
									mpExp500g.push({ price500g: price500g, price500gGST: price500g * 1.1, price500gwithGSTSurcharge: ((((price500g * 1.1) * expressSurcharge) / 100) + (price500g * 1.1)) });
									mpExp1kg.push({ price1Kg: price1Kg, price1KgGST: price1Kg * 1.1, price1KgwithGSTSurcharge: ((((price1Kg * 1.1) * expressSurcharge) / 100) + (price1Kg * 1.1)) });
									mpExp3kg.push({ price3Kg: price3Kg, price3KgGST: price3Kg * 1.1, price3KgwithGSTSurcharge: ((((price3Kg * 1.1) * expressSurcharge) / 100) + (price3Kg * 1.1)) });
									mpExp5kg.push({ price5Kg: price5Kg, price5KgGST: price5Kg * 1.1, price5KgwithGSTSurcharge: ((((price5Kg * 1.1) * expressSurcharge) / 100) + (price5Kg * 1.1)) });
								} else if (deliverySpeed == 1) {
									mpStd250g.push({ price250g: price250g, price250gGST: price250g * 1.1, price250gwithGSTSurcharge: ((((price250g * 1.1) * standardSurcharge) / 100) + (price250g * 1.1)) });
									mpStd500g.push({ price500g: price500g, price500gGST: price500g * 1.1, price500gwithGSTSurcharge: ((((price500g * 1.1) * standardSurcharge) / 100) + (price500g * 1.1)) });
									mpStd1kg.push({ price1Kg: price1Kg, price1KgGST: price1Kg * 1.1, price1KgwithGSTSurcharge: ((((price1Kg * 1.1) * standardSurcharge) / 100) + (price1Kg * 1.1)) });
									mpStd3kg.push({ price3Kg: price3Kg, price3KgGST: price3Kg * 1.1, price3KgwithGSTSurcharge: ((((price3Kg * 1.1) * standardSurcharge) / 100) + (price3Kg * 1.1)) });
									mpStd5kg.push({ price5Kg: price5Kg, price5KgGST: price5Kg * 1.1, price5KgwithGSTSurcharge: ((((price5Kg * 1.1) * standardSurcharge) / 100) + (price5Kg * 1.1)) });
									mpStd10kg.push({ price10Kg: price10Kg, price10KgGST: price10Kg * 1.1, price10KgwithGSTSurcharge: ((((price10Kg * 1.1) * standardSurcharge) / 100) + (price10Kg * 1.1)) });
									mpStd20kg.push({ price20Kg: price20Kg, price20KgGST: price20Kg * 1.1, price20KgwithGSTSurcharge: ((((price20Kg * 1.1) * standardSurcharge) / 100) + (price20Kg * 1.1)) });
									mpStd25kg.push({ price25Kg: price25Kg, price25KgGST: price25Kg * 1.1, price25KgwithGSTSurcharge: ((((price25Kg * 1.1) * standardSurcharge) / 100) + (price25Kg * 1.1)) });
								} else if (deliverySpeed == 4) {
									mpPrm1kg.push({ price1Kg: price1Kg, price1KgGST: price1Kg * 1.1, price1KgwithGSTSurcharge: ((((price1Kg * 1.1) * premiumSurcharge) / 100) + (price1Kg * 1.1)) });
									mpPrm3kg.push({ price3Kg: price3Kg, price3KgGST: price3Kg * 1.1, price3KgwithGSTSurcharge: ((((price3Kg * 1.1) * premiumSurcharge) / 100) + (price3Kg * 1.1)) });
									mpPrm5kg.push({ price5Kg: price5Kg, price5KgGST: price5Kg * 1.1, price5KgwithGSTSurcharge: ((((price5Kg * 1.1) * premiumSurcharge) / 100) + (price5Kg * 1.1)) });
									mpPrm10kg.push({ price10Kg: price10Kg, price10KgGST: price10Kg * 1.1, price10KgwithGSTSurcharge: ((((price10Kg * 1.1) * premiumSurcharge) / 100) + (price10Kg * 1.1)) });
									mpPrm20kg.push({ price20Kg: price20Kg, price20KgGST: price20Kg * 1.1, price20KgwithGSTSurcharge: ((((price20Kg * 1.1) * premiumSurcharge) / 100) + (price20Kg * 1.1)) });
								}
							}
						}

						oldCustomerId = custId;
						oldDeliverySpeed = deliverySpeed;
						count++;
						return true;
					});

					if (count > 0 && !isNullorEmpty(oldCustomerId)) {

						nlapiLogExecution("DEBUG", "Express", "");
						nlapiLogExecution("DEBUG", "Out loop:Express Rates ", JSON.stringify(mpExp5kg));
						nlapiLogExecution("DEBUG", "Out loop:Express Rates ", JSON.stringify(mpExp3kg));
						nlapiLogExecution("DEBUG", "Out loop:Express Rates ", JSON.stringify(mpExp1kg));
						nlapiLogExecution("DEBUG", "Out loop:Express Rates ", JSON.stringify(mpExp500g));

						nlapiLogExecution("DEBUG", "Standard", "");
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd20kg));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd25kg));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd10kg));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd5kg));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd3kg));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd1kg));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd500g));
						nlapiLogExecution("DEBUG", "Out loop:Standard Rates ", JSON.stringify(mpStd250g));

						nlapiLogExecution("DEBUG", "Premium", "");
						nlapiLogExecution("DEBUG", "Out loop:Premium Rates ", JSON.stringify(mpPrm1kg));
						nlapiLogExecution("DEBUG", "Out loop:Premium Rates ", JSON.stringify(mpPrm3kg));
						nlapiLogExecution("DEBUG", "Out loop:Premium Rates ", JSON.stringify(mpPrm5kg));
						nlapiLogExecution("DEBUG", "Out loop:Premium Rates ", JSON.stringify(mpPrm10kg));
						nlapiLogExecution("DEBUG", "Out loop:Premium Rates ", JSON.stringify(mpPrm20kg));

						//EXPRESS
						if (mpExp5kg.length == 0) {
							mpExp5kg.push({ price5Kg: 0, price5KgGST: 0, price5KgwithGSTSurcharge: 0 });
						}
						if (mpExp3kg.length == 0) {
							mpExp3kg.push({ price3Kg: 0, price3KgGST: 0, price3KgwithGSTSurcharge: 0 });
						}
						if (mpExp1kg.length == 0) {
							mpExp1kg.push({ price1Kg: 0, price1KgGST: 0, price1KgwithGSTSurcharge: 0 });
						}
						if (mpExp500g.length == 0) {
							mpExp500g.push({ price500g: 0, price500gGST: 0, price500gwithGSTSurcharge: 0 });
						}

						emailHtml = emailHtml.replace(/nlem5kgexp/gi, parseFloat(mpExp5kg[0].price5Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem3kgexp/gi, parseFloat(mpExp3kg[0].price3Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem1kgexp/gi, parseFloat(mpExp1kg[0].price1Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem500gexp/gi, parseFloat(mpExp500g[0].price500g).toFixed(2));
						emailHtml = emailHtml.replace(/nlem5kgwithgstwithfuelexp/gi, parseFloat(mpExp5kg[0].price5KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem3kgwithgstwithfuelexp/gi, parseFloat(mpExp3kg[0].price3KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem1kgwithgstwithfuelexp/gi, parseFloat(mpExp1kg[0].price1KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem500gwithgstwithfuelexp/gi, parseFloat(mpExp500g[0].price500gwithGSTSurcharge).toFixed(2));
						//STANDARD
						if (mpStd20kg.length == 0) {
							mpStd20kg.push({ price20kg: 0, price20kgGST: 0, price20kgwithGSTSurcharge: 0 });
						}
						if (mpStd25kg.length == 0) {
							mpStd25kg.push({ price25kg: 0, price25kgGST: 0, price25kgwithGSTSurcharge: 0 });
						}
						if (mpStd10kg.length == 0) {
							mpStd10kg.push({ price10kg: 0, price10kgGST: 0, price10kgwithGSTSurcharge: 0 });
						}
						if (mpStd5kg.length == 0) {
							mpStd5kg.push({ price5kg: 0, price5kgGST: 0, price5kgwithGSTSurcharge: 0 });
						}
						if (mpStd3kg.length == 0) {
							mpStd3kg.push({ price3kg: 0, price3kgGST: 0, price3kgwithGSTSurcharge: 0 });
						}
						if (mpStd1kg.length == 0) {
							mpStd1kg.push({ price1kg: 0, price1kgGST: 0, price1kgwithGSTSurcharge: 0 });
						}
						if (mpStd500g.length == 0) {
							mpStd500g.push({ price500g: 0, price500gGST: 0, price500gwithGSTSurcharge: 0 });
						}
						if (mpStd250g.length == 0) {
							mpStd250g.push({ price250g: 0, price250gGST: 0, price250gwithGSTSurcharge: 0 });
						}

						emailHtml = emailHtml.replace(/nlem20kgstd/gi, parseFloat(mpStd20kg[0].mpStd20kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem25kgstd/gi, parseFloat(mpStd25kg[0].mpStd25kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem10kgstd/gi, parseFloat(mpStd10kg[0].mpStd10kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem5kgstd/gi, parseFloat(mpStd5kg[0].mpStd5kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem3kgstd/gi, parseFloat(mpStd3kg[0].mpStd3kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem1kgstd/gi, parseFloat(mpStd1kg[0].mpStd1kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem500gstd/gi, parseFloat(mpStd500g[0].mpStd500g).toFixed(2));
						emailHtml = emailHtml.replace(/nlem250gstd/gi, parseFloat(mpStd250g[0].mpStd250g).toFixed(2));
						emailHtml = emailHtml.replace(/nlem20kgwithgstwithfuelstd/gi, parseFloat(mpStd20kg[0].price20kgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem25kgwithgstwithfuelstd/gi, parseFloat(mpStd25kg[0].price25kgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem10kgwithgstwithfuelstd/gi, parseFloat(mpStd10kg[0].price10kgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem5kgwithgstwithfuelstd/gi, parseFloat(mpStd5kg[0].price5kgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem3kgwithgstwithfuelstd/gi, parseFloat(mpStd3kg[0].price3kgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem1kgwithgstwithfuelstd/gi, parseFloat(mpStd1kg[0].price1kgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem500gwithgstwithfuelstd/gi, parseFloat(mpStd500g[0].price500gwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem250gwithgstwithfuelstd/gi, parseFloat(mpStd250g[0].price250gwithGSTSurcharge).toFixed(2));
						//PREMIUM
						if (mpPrm1kg.length == 0) {
							mpPrm1kg.push({ price1Kg: 0, price1KgGST: 0, price1KgwithGSTSurcharge: 0 });
						}
						if (mpPrm3kg.length == 0) {
							mpPrm3kg.push({ price3Kg: 0, price3KgGST: 0, price3KgwithGSTSurcharge: 0 });
						}
						if (mpPrm5kg.length == 0) {
							mpPrm5kg.push({ price5Kg: 0, price5KgGST: 0, price5KgwithGSTSurcharge: 0 });
						}
						if (mpPrm10kg.length == 0) {
							mpPrm10kg.push({ price10Kg: 0, price10KgGST: 0, price10KgwithGSTSurcharge: 0 });
						}
						if (mpPrm20kg.length == 0) {
							mpPrm20kg.push({ price20Kg: 0, price20KgGST: 0, price20KgwithGSTSurcharge: 0 });
						}



						emailHtml = emailHtml.replace(/nlem1kgprm/gi, parseFloat(mpPrm1kg[0].price1Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem3kgprm/gi, parseFloat(mpPrm3kg[0].price3Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem5kgprm/gi, parseFloat(mpPrm5kg[0].price5Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem10kgprm/gi, parseFloat(mpPrm10kg[0].price10Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem20kgprm/gi, parseFloat(mpPrm20kg[0].price20Kg).toFixed(2));
						emailHtml = emailHtml.replace(/nlem1kgwithgstwithfuelprm/gi, parseFloat(mpPrm1kg[0].price1KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem3kgwithgstwithfuelprm/gi, parseFloat(mpPrm3kg[0].price3KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem5kgwithgstwithfuelprm/gi, parseFloat(mpPrm5kg[0].price5KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem10kgwithgstwithfuelprm/gi, parseFloat(mpPrm10kg[0].price10KgwithGSTSurcharge).toFixed(2));
						emailHtml = emailHtml.replace(/nlem20kgwithgstwithfuelprm/gi, parseFloat(mpPrm20kg[0].price20KgwithGSTSurcharge).toFixed(2));
					}

					//Set Current Month & Year for the product rate table
					emailHtml = emailHtml.replace(/nlemmonthyear/gi, getCurrentMonthYear());

					var dynamicSCFURL = null;
					if (!isNullorEmpty(commreg)) {
						var commRegRecord = nlapiLoadRecord('customrecord_commencement_register', commreg);
						dynamicSCFURL = commRegRecord.getFieldValue('custrecord_dynamic_scf_url');
					}

					if (isNullorEmpty(dynamicSCFURL)) {
						var expInterest =
							'<a class="mcnButton " href="https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1959&deploy=1&compid=1048144&ns-at=AAEJ7tMQCuxUJvJ4RvyaI99vrX6kaBIKkbBebvVixmguZdaobdA&custinternalid=' +
							recId +
							'"  style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Agree">Agree</a>';
					} else {
						var expInterest =
							'<a class="mcnButton " href="' + dynamicSCFURL + '"  style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;" target="_blank" title="Agree">Agree</a>';
					}

					emailHtml = emailHtml.replace(/nlemagreebutton/gi, expInterest);
				}

				//487: 202503 - Call Force - Reminder Email
				if (templateId == 491) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					if (!isNullorEmpty(contactID)) {
						var recContact = nlapiLoadRecord("contact", contactID);

						var contactEmail = recContact.getFieldValue("email");
						var contactPhone = recContact.getFieldValue("phone");
						var firstname = recContact.getFieldValue("firstname");
					} else {
						var firstname = "";
						var contactEmail = customer_record.getFieldValue(
							"custentity_email_service"
						);
						var contactPhone = customer_record.getFieldValue("phone");
					}

					var employeeFields = ["entityid", "firstname", "email", "phone", "custentity_8x8_number"];
					var employeeFieldsValues = nlapiLookupField(
						"employee",
						parseInt(userID),
						employeeFields
					);

					emailHtml = emailHtml.replace(
						/nlemtaskdate/gi,
						onboardingDate
					);
					emailHtml = emailHtml.replace(
						/nlemtasktime/gi,
						onboardingTime
					);

					emailHtml = emailHtml.replace(
						/nlemsalesrepfirstname/gi,
						employeeFieldsValues.firstname
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrepname/gi,
						employeeFieldsValues.entityid
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrep8x8number/gi,
						employeeFieldsValues.custentity_8x8_number
					);

					emailHtml = emailHtml.replace(/nlemcontactfirstname/gi, firstname);
				}

				//494: Customer Service – Not Dispatched
				if (templateId == 494) {
					emailHtml = emailHtml.replace(/nlemtrackingid/gi, trackingid);
				}

				//495: Customer Service – Check Address
				if (templateId == 495) {
					var barcodeRecord = nlapiLoadRecord("customrecord_customer_product_stock", barcodeRecordID);
					var receiverName = barcodeRecord.getFieldValue(
						"custrecord_receiver_name"
					);
					var revieverAddress1 = barcodeRecord.getFieldValue(
						"custrecord_receiver_addr1"
					);
					var revieverAddress2 = barcodeRecord.getFieldValue(
						"custrecord_receiver_addr2"
					);
					var revieverSuburb = barcodeRecord.getFieldValue(
						"custrecord_receiver_suburb"
					);
					var revieverState = barcodeRecord.getFieldValue(
						"custrecord_receiver_state"
					);
					var revieverPostcode = barcodeRecord.getFieldValue(
						"custrecord_receiver_postcode"
					);

					if (!isNullorEmpty(revieverAddress2)) {
						var receiverAddress = revieverAddress2 + " " + revieverAddress1 + " " + revieverSuburb + " " + revieverState + " - " + revieverPostcode;
					} else {
						var receiverAddress = revieverAddress1 + " " + revieverSuburb + " " + revieverState + " - " + revieverPostcode;
					}


					emailHtml = emailHtml.replace(/nlemcontactfirstname/gi, addressee);
					emailHtml = emailHtml.replace(/nlemtrackingid/gi, trackingid);
					emailHtml = emailHtml.replace(/nlemreceivername/gi, receiverName);
					emailHtml = emailHtml.replace(/nlemreceiveraddress/gi, receiverAddress);


				}

				//498: 202503 - Call Force Existing Customers - Activate ShipMate
				if (templateId == 498) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var companyname = customer_record.getFieldValue("companyname");
					var employeeFields = ["entityid", "firstname", "email", "phone", "custentity_8x8_number"];
					var employeeFieldsValues = nlapiLookupField(
						"employee",
						parseInt(userID),
						employeeFields
					);
					emailHtml = emailHtml.replace(/nlemcontactname/gi, addressee);
					emailHtml = emailHtml.replace(/nlemcompanyname/gi, companyname);
					emailHtml = emailHtml.replace(/nlemsalesrepname/gi, employeeFieldsValues.entityid);
				}

				//499: 202503 - Call Force Existing Customers - Email Interested
				if (templateId == 499) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var companyname = customer_record.getFieldValue("companyname");
					var employeeFields = ["entityid", "firstname", "email", "phone", "custentity_8x8_number"];
					var employeeFieldsValues = nlapiLookupField(
						"employee",
						parseInt(userID),
						employeeFields
					);
					emailHtml = emailHtml.replace(/nlemsalesrep8x8number/gi, employeeFieldsValues.custentity_8x8_number);
					emailHtml = emailHtml.replace(/nlemcompanyname/gi, companyname);
					emailHtml = emailHtml.replace(/nlemsalesrepname/gi, employeeFieldsValues.entityid);
				}

				//503: 202505 - Illicium 1.1 - Reminder Appointment Set
				if (templateId == 503) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					if (!isNullorEmpty(contactID)) {
						var recContact = nlapiLoadRecord("contact", contactID);

						var contactEmail = recContact.getFieldValue("email");
						var contactPhone = recContact.getFieldValue("phone");
						var firstname = recContact.getFieldValue("firstname");
					} else {
						var firstname = "";
						var contactEmail = customer_record.getFieldValue(
							"custentity_email_service"
						);
						var contactPhone = customer_record.getFieldValue("phone");
					}

					var employeeFields = ["entityid", "firstname", "email", "mobilephone", "custentity_8x8_number"];
					var employeeFieldsValues = nlapiLookupField(
						"employee",
						parseInt(userID),
						employeeFields
					);

					// emailHtml = emailHtml.replace(
					// 	/nlemtaskdate/gi,
					// 	onboardingDate
					// );
					emailHtml = emailHtml.replace(
						/nlemtasktime/gi,
						onboardingTime
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrepname/gi,
						employeeFieldsValues.entityid
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrepmobile/gi,
						employeeFieldsValues.mobilephone
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrepemail/gi,
						employeeFieldsValues.email
					);
					emailHtml = emailHtml.replace(/nlemcontactfirstname/gi, firstname);
				}

				//501: 202505 - Illicium T3 - Confirming FU Appointment
				if (templateId == 501) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					if (!isNullorEmpty(contactID)) {
						var recContact = nlapiLoadRecord("contact", contactID);

						var contactEmail = recContact.getFieldValue("email");
						var contactPhone = recContact.getFieldValue("phone");
						var firstname = recContact.getFieldValue("firstname");
					} else {
						var firstname = "";
						var contactEmail = customer_record.getFieldValue(
							"custentity_email_service"
						);
						var contactPhone = customer_record.getFieldValue("phone");
					}

					var employeeFields = ["entityid", "firstname", "email", "mobilephone", "custentity_8x8_number"];
					var employeeFieldsValues = nlapiLookupField(
						"employee",
						parseInt(userID),
						employeeFields
					);

					emailHtml = emailHtml.replace(
						/nlemsalesrepname/gi,
						employeeFieldsValues.entityid
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrepmobile/gi,
						employeeFieldsValues.mobilephone
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrepemail/gi,
						employeeFieldsValues.email
					);
					emailHtml = emailHtml.replace(/nlemcontactfirstname/gi, firstname);
				}

				//502: 202505 - Illicium T1.5 - ShipMate Setup & Your Free Delivery
				if (templateId == 502) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					if (!isNullorEmpty(contactID)) {
						var recContact = nlapiLoadRecord("contact", contactID);

						var contactEmail = recContact.getFieldValue("email");
						var contactPhone = recContact.getFieldValue("phone");
						var firstname = recContact.getFieldValue("firstname");
					} else {
						var firstname = "";
						var contactEmail = customer_record.getFieldValue(
							"custentity_email_service"
						);
						var contactPhone = customer_record.getFieldValue("phone");
					}

					var employeeFields = ["entityid", "firstname", "email", "mobilephone", "custentity_8x8_number"];
					var employeeFieldsValues = nlapiLookupField(
						"employee",
						parseInt(userID),
						employeeFields
					);

					emailHtml = emailHtml.replace(
						/nlemsalesrepname/gi,
						employeeFieldsValues.entityid
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrepmobile/gi,
						employeeFieldsValues.mobilephone
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrepemail/gi,
						employeeFieldsValues.email
					);
					emailHtml = emailHtml.replace(/nlemcontactfirstname/gi, firstname);
				}

				//504: 202505 - Illicium T4 - Welcome to MailPlus
				if (templateId == 504) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");

					if (!isNullorEmpty(contactID)) {
						var recContact = nlapiLoadRecord("contact", contactID);

						var contactEmail = recContact.getFieldValue("email");
						var contactPhone = recContact.getFieldValue("phone");
						var firstname = recContact.getFieldValue("firstname");
					} else {
						var firstname = "";
						var contactEmail = customer_record.getFieldValue(
							"custentity_email_service"
						);
						var contactPhone = customer_record.getFieldValue("phone");
					}

					var employeeFields = ["entityid", "firstname", "email", "mobilephone", "custentity_8x8_number"];
					var employeeFieldsValues = nlapiLookupField(
						"employee",
						parseInt(userID),
						employeeFields
					);

					emailHtml = emailHtml.replace(
						/nlemsalesrepname/gi,
						employeeFieldsValues.entityid
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrepmobile/gi,
						employeeFieldsValues.mobilephone
					);
					emailHtml = emailHtml.replace(
						/nlemsalesrepemail/gi,
						employeeFieldsValues.email
					);
					emailHtml = emailHtml.replace(/nlemcontactfirstname/gi, firstname);
				}

				//506: 202505 - Illicium T6 - Expired ShipMate Access
				if (templateId == 506) {
					var customer_record = nlapiLoadRecord("customer", recId);
					var entityid = customer_record.getFieldValue("entityid");
					var companyname = customer_record.getFieldValue("companyname");


					var employeeFields = ["entityid", "firstname", "email", "mobilephone", "custentity_8x8_number"];
					var employeeFieldsValues = nlapiLookupField(
						"employee",
						parseInt(userID),
						employeeFields
					);

					var customerRecordLink = 'https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + recId + '&whence=';
					var customerRecordLinkHTML = '<a href="' + customerRecordLink + '" target="_blank">' + companyname + '</a>';

					emailHtml = emailHtml.replace(
						/nlemsalesrepname/gi,
						employeeFieldsValues.entityid
					);
					emailHtml = emailHtml.replace(
						/nlemcustomerrecord/gi,
						customerRecordLinkHTML
					);
				}

				if (templateId == 508 || templateId == 509) {
					var recContact = nlapiLoadRecord("contact", contactID);

					var contactEmail = recContact.getFieldValue("email");
					var contactPhone = recContact.getFieldValue("phone");
					var firstname = recContact.getFieldValue("firstname");
					emailHtml = emailHtml.replace(/nlemcontactfirstname/gi, firstname);
				}
				
				nlapiLogExecution("DEBUG", "Template ID", templateId);
				//Email Template Name: 202507 - LPO - EOI Submitted
				if (templateId == 510 || templateId == '510') {
					nlapiLogExecution("DEBUG", "Inside Template ID 510", addressee);
					emailHtml = emailHtml.replace(/nlemcontactname/gi, addressee);

				}
			}
		}
		response.setHeader("Custom-Header-SubjectLine", subject);
		response.write(emailHtml);
	}
}

function getCurrentMonthYear() {
	var now = new Date();
	var monthNames = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];
	var month = monthNames[now.getMonth()];
	var year = now.getFullYear();
	return month + "-" + year;
}

function getMergeFields(templateId) {
	if (!isNullorEmpty(templateId)) {
		var filters = [
			new nlobjSearchFilter(
				"custrecord_comm_merge_parent",
				null,
				"is",
				templateId
			),
		];
		var columns = [
			new nlobjSearchColumn("custrecord_comm_merge_tag"),
			new nlobjSearchColumn("custrecord_comm_merge_rectype"),
		];
		columns[columns.length] = new nlobjSearchColumn(
			"custrecord_comm_merge_field"
		);
		columns[columns.length] = new nlobjSearchColumn(
			"custrecord_comm_merge_email"
		);
		columns[columns.length] = new nlobjSearchColumn(
			"custrecord_comm_merge_sms"
		);
		columns[columns.length] = new nlobjSearchColumn(
			"custrecord_comm_merge_pdf"
		);
		var results = nlapiSearchRecord(
			"customrecord_comm_merge_field",
			null,
			filters,
			columns
		);
	}
}

function getAttachments(templateId) {
	if (!isNullorEmpty(templateId)) {
		var attachments = [];
		var checked = [];
		var filters = [
			new nlobjSearchFilter(
				"custrecord_comm_attach_parent",
				null,
				"is",
				templateId
			),
		];
		var columns = [
			new nlobjSearchColumn("name"),
			new nlobjSearchColumn("custrecord_comm_attach_checked"),
			new nlobjSearchColumn("custrecord_comm_attach_file"),
		];
		var results = nlapiSearchRecord(
			"customrecord_comm_merge_field",
			null,
			filters,
			columns
		);
		if (!isNullorEmpty(results)) {
			for (n = 0; n < results.length; n++) {
				attachments.push([
					results[n].getValue("custrecord_comm_attach_file"),
					results[n].getValue("name"),
				]);
				if (results[n].getValue("custrecord_comm_attach_checked") == "T") {
					checked.push([
						results[n].getValue("custrecord_comm_attach_file"),
						results[n].getValue("name"),
					]);
				}
			}
			return [attachments, checked];
		} else return null;
	}
}

function freqCal(freq) {
	var multiselect = "";

	if (freq.indexOf(1) != -1) {
		multiselect += "Mon,";
	}

	if (freq.indexOf(2) != -1) {
		multiselect += "Tue,";
	}

	if (freq.indexOf(3) != -1) {
		multiselect += "Wed,";
	}

	if (freq.indexOf(4) != -1) {
		multiselect += "Thu,";
	}

	if (freq.indexOf(5) != -1) {
		multiselect += "Fri,";
	}

	if (freq.indexOf(6) != -1) {
		multiselect += "Adhoc,";
	}
	multiselect = multiselect.slice(0, -1);
	return multiselect;
}
