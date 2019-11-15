/**
 * Module Description
 * 
 * NSVersion    Date            		Author         
 * 1.00       	2018-04-24 11:04:31   		Ankith 
 *
 * Remarks:         
 * 
 * @Last Modified by:   mailplusar
 * @Last Modified time: 2019-05-07 10:35:45
 *
 */


function main(request, response) {
	var custId = request.getParameter('custid');
	var commRegId = request.getParameter('commreg');
	var stage = request.getParameter('stage');
	var start_date = request.getParameter('start');
	var end_date = request.getParameter('end');
	var scfid = request.getParameter('scfid');
	var sales_record_id = request.getParameter('salesrecordid');

	var recCustomer = nlapiLoadRecord('customer', request.getParameter('custid'));

	var customerName = recCustomer.getFieldValue('companyname');
	//var recCommReg = nlapiLoadRecord('customrecord_commencement_register', request.getParameter('commreg'));


	var recSales = nlapiLoadRecord('customrecord_sales', sales_record_id);
	var salesreptext = recSales.getFieldText('custrecord_sales_assigned');

	var filters = new Array();
	filters[0] = new nlobjSearchFilter('company', null, 'anyof', custId);
	filters[1] = new nlobjSearchFilter('isinactive', null, 'is', "F");
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('salutation');
	columns[1] = new nlobjSearchColumn('firstname');
	columns[2] = new nlobjSearchColumn('lastname');
	columns[3] = new nlobjSearchColumn('contactrole');

	var searchResults = nlapiSearchRecord('contact', null, filters, columns);

	var primarycontact = '';
	var primaryfirstname = '';
	var decisioncontact = '';
	var decisionfirstname = '';
	var apcontact = '';

	if (!isNullorEmpty(searchResults)) {
		for (m = 0; m < searchResults.length; m++) {
			if (parseInt(searchResults[m].getValue(columns[3])) == 1) {
				apcontact = searchResults[m].getValue(columns[1]) + ' ' + searchResults[m].getValue(columns[2]);
			}

			if (parseInt(searchResults[m].getValue(columns[3])) == -10) {
				primarycontact = searchResults[m].getValue(columns[1]) + ' ' + searchResults[m].getValue(columns[2]);
				primaryfirstname = searchResults[m].getValue(columns[1]) + ' ';
			}

			if (parseInt(searchResults[m].getValue(columns[3])) == -30) {
				decisioncontact = searchResults[m].getValue(columns[1]) + ' ' + searchResults[m].getValue(columns[2]);
				decisionfirstname = searchResults[m].getValue(columns[1]) + ' ';
			}


		}
	}

	if (!isNullorEmpty(commRegId)) {
		var searched_service_change = nlapiLoadSearch('customrecord_servicechg', 'customsearch_salesp_service_chg');

		var newFilters = new Array();
		newFilters[newFilters.length] = new nlobjSearchFilter("custrecord_service_customer", "CUSTRECORD_SERVICECHG_SERVICE", 'is', custId);
		newFilters[newFilters.length] = new nlobjSearchFilter("custrecord_servicechg_comm_reg", null, 'is', commRegId);
		newFilters[newFilters.length] = new nlobjSearchFilter('custrecord_servicechg_status', null, 'anyof', [4]);

		searched_service_change.addFilters(newFilters);

		resultSet_service_change = searched_service_change.runSearch();

		var serviceResult = resultSet_service_change.getResults(0, 6);

		var service = [];
		var price = [];

		var service_freq = '';

		var dateEffective = null;

		for (n = 0; n < serviceResult.length; n++) {
			var serviceChangeId = serviceResult[n].getValue('internalid');
			var serviceId = serviceResult[n].getValue('custrecord_servicechg_service');
			var serviceText = serviceResult[n].getText('custrecord_servicechg_service');
			var serviceDescp = serviceResult[n].getValue("custrecord_service_description", "CUSTRECORD_SERVICECHG_SERVICE", null);
			var oldServicePrice = serviceResult[n].getValue("custrecord_service_price", "CUSTRECORD_SERVICECHG_SERVICE", null);
			var serviceNSItem = serviceResult[n].getValue("custrecord_service_ns_item", "CUSTRECORD_SERVICECHG_SERVICE", null);
			var serviceNSItemText = serviceResult[n].getText("custrecord_service_ns_item", "CUSTRECORD_SERVICECHG_SERVICE", null);
			var newServiceChangePrice = serviceResult[n].getValue('custrecord_servicechg_new_price');
			dateEffective = serviceResult[n].getValue('custrecord_servicechg_date_effective');
			var commRegId = serviceResult[n].getValue('custrecord_servicechg_comm_reg');
			var serviceChangeTypeText = serviceResult[n].getText('custrecord_servicechg_type');
			var serviceChangeFreqText = serviceResult[n].getValue('custrecord_servicechg_new_freq');

			nlapiLogExecution('DEBUG', 'serviceNSItem', serviceNSItem);
			nlapiLogExecution('DEBUG', 'serviceNSItemText', serviceNSItemText);


			service_freq += serviceNSItemText + ' - ' + freqCal(serviceChangeFreqText) + ' | ';

			service[service.length] = serviceNSItemText;
			price[price.length] = newServiceChangePrice;
		}


	}
	var postaladdress = '';
	var siteaddress = '';
	var siteaddressfull = '';
	var billaddressfull = '';
	var SOpostaladdress = '';
	var SOpostalcity = '';

	var addr1_addr2 = '';
	var city_state_code = '';

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
				addr1_addr2 += recCustomer.getLineItemValue('addressbook', 'addr1', p) + ', ';
			}
			if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr2', p))) {
				siteaddress += recCustomer.getLineItemValue('addressbook', 'addr2', p) + '  ';
				siteaddressfull += recCustomer.getLineItemValue('addressbook', 'addr2', p) + '\n';
				addr1_addr2 += recCustomer.getLineItemValue('addressbook', 'addr2', p);
			}
			if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'city', p))) {
				siteaddress += recCustomer.getLineItemValue('addressbook', 'city', p) + ' ';
				siteaddressfull += recCustomer.getLineItemValue('addressbook', 'city', p) + ' ';
				city_state_code += recCustomer.getLineItemValue('addressbook', 'city', p) + ' ';
			}
			if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'state', p))) {
				siteaddress += recCustomer.getLineItemValue('addressbook', 'state', p) + ' ';
				siteaddressfull += recCustomer.getLineItemValue('addressbook', 'state', p) + ' ';
				city_state_code += recCustomer.getLineItemValue('addressbook', 'state', p) + ' ';
			}
			if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'zip', p))) {
				siteaddress += recCustomer.getLineItemValue('addressbook', 'zip', p);
				siteaddressfull += recCustomer.getLineItemValue('addressbook', 'zip', p);
				city_state_code += recCustomer.getLineItemValue('addressbook', 'zip', p);
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
	merge['NLDATE'] = getDate();
	if (!isNullorEmpty(decisioncontact)) {
		merge['NLFULLNAME'] = decisioncontact;

	} else if (!isNullorEmpty(primarycontact)) {
		merge['NLFULLNAME'] = primarycontact;

	}

	merge['NLCUSTOMERNAME'] = customerName;
	merge['NLSTREETADDRESS'] = addr1_addr2;
	merge['NLCITYSTATECODE'] = city_state_code;
	if (!isNullorEmpty(decisioncontact)) {
		merge['NLDEAR'] = decisionfirstname;

	} else if (!isNullorEmpty(primarycontact)) {
		merge['NLDEAR'] = primaryfirstname;
	}
	merge['NLCUSTOMERNAME2'] = customerName;
	merge['NLSALESREPNAME'] = salesreptext;
	merge['NLSCPOSTADDRESS'] = postaladdress;
	merge['NLSCSHIPADDRESS'] = siteaddressfull;
	merge['NLSCBILLADDRESS'] = billaddressfull;
	merge['NLSCACONTACT'] = apcontact;

	merge['NLDATEEFFECTIVE'] = dateEffective;

	if (!isNullorEmpty(service)) {
		for (var x = 0; x < service.length; x++) {
			merge['NLSERVICEITEM' + (x + 1)] = service[x];
			merge['NLSCPRICE' + (x + 1)] = price[x];
		}
	}


	var default_note = '*Quoted price excludes GST and applies for the first 16kg of mail. Further increments of 16kg incur a $2.75 charge. Registered mail $2.20 and parcels $1.10. Minimum two weeks written notice to cancel services\n' + service_freq;

	if (!isNullorEmpty(recCustomer.getFieldValue('custentity_sc_form_notes'))) {
		merge['NLSCNOTES'] = default_note + recCustomer.getFieldValue('custentity_sc_form_notes');
	} else {
		merge['NLSCNOTES'] = default_note;
	}



	if (scfid == 94) {
		merge['NLSOPCITY'] = SOpostalcity;
		merge['NLSOADDRESS'] = siteaddress;
		merge['NLSOPADD1'] = SOpostaladdress;
	}

	merge['NLSALESREPNAME2'] = salesreptext;

	var fileSCFORM = nlapiMergeRecord(scfid, 'customer', custId, null, null, merge);



	fileSCFORM.setName('MP_ServiceCommencement_' + custId + '.pdf');
	response.setContentType('PDF', 'MP_ServiceCommencement_' + custId + '.pdf', 'inline');
	response.write(fileSCFORM.getValue());
}

function getDate() {
	var date = new Date();
	if (date.getHours() > 6) {
		date = nlapiAddDays(date, 1);
	}
	date = nlapiDateToString(date);
	return date;
}

function freqCal(freq) {

	var multiselect = '';



	if (freq.indexOf(1) != -1) {
		multiselect += 'Mon,';
	}

	if (freq.indexOf(2) != -1) {
		multiselect += 'Tue,';
	}

	if (freq.indexOf(3) != -1) {
		multiselect += 'Wed,';
	}

	if (freq.indexOf(4) != -1) {
		multiselect += 'Thu,';
	}

	if (freq.indexOf(5) != -1) {
		multiselect += 'Fri,';
	}

	if (freq.indexOf(6) != -1) {
		multiselect += 'Adhoc,';
	}
	multiselect = multiselect.slice(0, -1)
	return multiselect;
}