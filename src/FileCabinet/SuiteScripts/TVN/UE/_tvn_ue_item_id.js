/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * @Author Phong Nguyen - Teibto
 */
define(['N/search'], function (search) {
    function beforeLoad(context){
        if(context.type == context.UserEventType.CREATE || context.type == context.UserEventType.COPY){

            var item = context.newRecord;
            item.setValue('itemid', 'To Be Generated');
        }
    }
    function beforeSubmit(scriptContext){
        var newRecord = scriptContext.newRecord;
	    //test2
        if(scriptContext.type == scriptContext.UserEventType.CREATE){
            
            var recType = newRecord.type;
            var prefix = "OTH-";
            switch (recType) {
                case "inventoryitem":
                    prefix = "RM-";
                    break;
                case "assemblyitem":
                    prefix = "FG-";
                    break;
            }
            
            var numOfDigit = 5;

            var itemid = getNumbering(prefix, numOfDigit );

            newRecord.setValue('itemid', itemid)
          
        }
    }
    function getNumbering(prefix, numOfDigit) {

		var mySearch = search.create({
			type: 'item',
			columns: [
				search.createColumn({
					name: 'itemid',
					sort: search.Sort.DESC
				})],
			filters: [
				['itemid', 'STARTSWITH', prefix]
			]
		});

		var searchResult = mySearch.run().getRange({ start: 0, end: 1 });
		var running = 0;

		if(searchResult.length > 0){
			var lastId = searchResult[0].getValue('itemid');
			if (lastId.indexOf(prefix) != -1) {
				var str = lastId.split(prefix);
                log.debug('str', str)
				running = str[1];
			}
		}
		running = Number(running) + 1;

		var numeric = running.toString();
		while (numeric.length < numOfDigit) {
			numeric = '0' + numeric;
		}
		
		return prefix + numeric;
	}
    
    return {
        beforeSubmit: beforeSubmit,
        beforeLoad: beforeLoad
    };
});
