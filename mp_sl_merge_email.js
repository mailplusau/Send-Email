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
        var emailHtml = '';
        var subject = '';

        if (!isNullorEmpty(templateId)) {
            var recCommTemp = nlapiLoadRecord('customrecord_camp_comm_template', templateId);
            templateId = recCommTemp.getFieldValue('custrecord_camp_comm_email_template');
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


            if (!isNullorEmpty(templateId) && !isNullorEmpty(recType) && !isNullorEmpty(recId)) {
                var arrMergeFields = [];
                if (!isNullorEmpty(fields) || !isNullorEmpty(addressee) || !isNullorEmpty(salesRep)) {
                    if (!isNullorEmpty(fields)) {
                        var arrFields = fields.split(',');
                        for (x = 0; x < arrFields.length; x += 2) {
                            arrMergeFields[arrFields[x]] = arrFields[x + 1];
                        }
                    }
                    arrMergeFields['NLEMSALESPERSON'] = !isNullorEmpty(salesRep) ? salesRep : '';
                    arrMergeFields['NLEMCONTACT'] = !isNullorEmpty(addressee) ? addressee : '';
                }

                // var file = nlapiMergeRecord(templateId, recType, recId, null, null, arrMergeFields);


                // set variables in email
                // emailHtml = emailHtml.replace(/<NLEMCONTACT>/gi,addressee);
                nlapiLogExecution('AUDIT', 'templateId', templateId)
                if (templateId == 286) {
                    var customer_record = nlapiLoadRecord('customer', recId);
                    var entityid = customer_record.getFieldValue('entityid');
                    var last5_entityid = entityid.substr(entityid.length - 5)
                    emailHtml = emailHtml.replace(/<NLEMREFERRALCODE>/gi, 'SPREADTHELOVE' + last5_entityid);
                }
                emailHtml = emailHtml.replace(/<NLEMSALESPERSON>/gi, 'Ankith');

            }

        }
        response.setHeader('Custom-Header-SubjectLine', subject);
        response.write(emailHtml);

    }
}

function getMergeFields(templateId) {
    if (!isNullorEmpty(templateId)) {
        var filters = [new nlobjSearchFilter('custrecord_comm_merge_parent', null, 'is', templateId)];
        var columns = [new nlobjSearchColumn('custrecord_comm_merge_tag'), new nlobjSearchColumn('custrecord_comm_merge_rectype')];
        columns[columns.length] = new nlobjSearchColumn('custrecord_comm_merge_field');
        columns[columns.length] = new nlobjSearchColumn('custrecord_comm_merge_email');
        columns[columns.length] = new nlobjSearchColumn('custrecord_comm_merge_sms');
        columns[columns.length] = new nlobjSearchColumn('custrecord_comm_merge_pdf');
        var results = nlapiSearchRecord('customrecord_comm_merge_field', null, filters, columns);

    }
}

function getAttachments(templateId) {
    if (!isNullorEmpty(templateId)) {
        var attachments = [];
        var checked = [];
        var filters = [new nlobjSearchFilter('custrecord_comm_attach_parent', null, 'is', templateId)];
        var columns = [new nlobjSearchColumn('name'), new nlobjSearchColumn('custrecord_comm_attach_checked'), new nlobjSearchColumn('custrecord_comm_attach_file')];
        var results = nlapiSearchRecord('customrecord_comm_merge_field', null, filters, columns);
        if (!isNullorEmpty(results)) {
            for (n = 0; n < results.length; n++) {
                attachments.push([results[n].getValue('custrecord_comm_attach_file'), results[n].getValue('name')]);
                if (results[n].getValue('custrecord_comm_attach_checked') == 'T') {
                    checked.push([results[n].getValue('custrecord_comm_attach_file'), results[n].getValue('name')]);
                }
            }
            return [attachments, checked];
        } else return null;
    }
}