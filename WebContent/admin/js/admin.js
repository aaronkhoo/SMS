

/* ---------------------------------------------------------------------- */
/*	On Page Load
/* ---------------------------------------------------------------------- */

$(document).ready( function() {   
	$.ajax({
        type : "get",
        url : "offers",
        success : function(responseJson) {        	
        	display_charts(responseJson);
        }
    }); 
});

function display_charts(responseJson)
{
	display_monthly_chart(responseJson);
	
	// Get latest week
	var arrayLength = responseJson.length;
	var latestWeek = null;
	var latestWeekValues = null;
	for (var i = 0; i < arrayLength; i += 1)
	{
		var currentWeekValues = responseJson[i];
		var currentWeek = new Date(currentWeekValues.week);
		if (latestWeek == null || currentWeek > latestWeek)
		{
			latestWeek = currentWeek;
			latestWeekValues = currentWeekValues;
		}
	}
	
	display_weekly_chart(latestWeekValues);
	
	display_businesses_pie_chart(latestWeekValues.Offers);
}

function display_monthly_chart(responseJson) 
{	
	if ($("#monthly-bar-chart").length) {
		var arrayLength = responseJson.length;
		
		var offerData = [];
		var offerRecordData = [];
		var redeemRecordData = [];
		var minval = null;
		var maxval = null;
		var xAxisTicks = [];
		
		for (var i = 0; i < arrayLength; i += 1)
		{
			var currentWeekValues = responseJson[i];
			var currentWeek = new Date(currentWeekValues.week);
			
			if (minval == null || currentWeek < minval)
			{
				minval = currentWeek;
			}
			
			if (maxval == null || currentWeek > maxval)
			{
				maxval = currentWeek;
			}

			xAxisTicks.push(currentWeek.getTime());
			offerData.push([currentWeek.getTime(), currentWeekValues.Offers.length]);
			offerRecordData.push([currentWeek.getTime(), currentWeekValues.OfferRecords.length]);
			redeemRecordData.push([currentWeek.getTime(), currentWeekValues.RedeemRecords.length]);
		}
		
		var individualWidth = 20 * 60 * 60 * 1000;
		var ds = new Array();
		ds.push({
			data : offerData,
			bars : {
				show : true,
				barWidth : individualWidth,
				order : 1,
			}
		});
		ds.push({
			data : offerRecordData,
			bars : {
				show : true,
				barWidth : individualWidth,
				order : 2
			}
		});
		ds.push({
			data : redeemRecordData,
			bars : {
				show : true,
				barWidth : individualWidth,
				order : 3
			}
		});
		
		minval.setDate(minval.getDate()-7);
		maxval.setDate(maxval.getDate()+7);
		
		var options = {
				xaxis : {
					mode : "time",
					ticks: xAxisTicks,
				    timeformat: "%m/%d",
				    min: minval,
				    max: maxval
				},
				colors : [$chrt_second, $chrt_fourth, "#666", "#BBB"],
				grid : {
					show : true,
					hoverable : true,
					clickable : true,
					tickColor : $chrt_border_color,
					borderWidth : 0,
					borderColor : $chrt_border_color,
				},
				legend : true,
				tooltip : true,
				tooltipOpts : {
					content : "<b>%x</b> = <span>%y</span>",
					defaultTheme : false
				}

			};

		//Display graph
		$.plot($("#monthly-bar-chart"), ds, options);
	};
};

function display_weekly_chart(latestWeekValues) 
{	
	if ($("#weekly-bar-chart").length) {
		
		// Store the start of the week
		var minval = new Date(latestWeekValues.week);
		
		// Count offers by day		
		var offersCountsByDay = [0,0,0,0,0,0,0];
		var arrayOffersLength = latestWeekValues.Offers.length;
		for (var i = 0; i < arrayOffersLength; i += 1)
		{
			var currentDatetime = new Date(latestWeekValues.Offers[i].createdDatetime);
			var currentDay = new Date(currentDatetime.getFullYear(), currentDatetime.getMonth(), currentDatetime.getDate(), 0, 0, 0, 0);
			offersCountsByDay[currentDay.getDay()] = offersCountsByDay[currentDay.getDay()] + 1;
		}
		
		// Count offerRecords by day		
		var offerRecordsCountsByDay = [0,0,0,0,0,0,0];
		var arrayOfferRecordsLength = latestWeekValues.OfferRecords.length;
		for (var i = 0; i < arrayOfferRecordsLength; i += 1)
		{
			var currentDatetime = new Date(latestWeekValues.OfferRecords[i].createdDatetime);
			var currentDay = new Date(currentDatetime.getFullYear(), currentDatetime.getMonth(), currentDatetime.getDate(), 0, 0, 0, 0);
			offerRecordsCountsByDay[currentDay.getDay()] = offerRecordsCountsByDay[currentDay.getDay()] + 1;
		}
		
		// Count redeemRecords by day		
		var redeemRecordsCountsByDay = [0,0,0,0,0,0,0];
		var arrayRedeemRecordsLength = latestWeekValues.RedeemRecords.length;
		for (var i = 0; i < arrayRedeemRecordsLength; i += 1)
		{
			var currentDatetime = new Date(latestWeekValues.RedeemRecords[i].createdDatetime);
			var currentDay = new Date(currentDatetime.getFullYear(), currentDatetime.getMonth(), currentDatetime.getDate(), 0, 0, 0, 0);
			redeemRecordsCountsByDay[currentDay.getDay()] = redeemRecordsCountsByDay[currentDay.getDay()] + 1;
		}
		
		var offerData = [];
		var offerRecordData = [];	
		var redeemRecordData = [];
		var xAxisTicks = [];
		
		var currentDate = new Date(minval.getTime());
		for (var i = 0; i < 7; i += 1)
		{
			if (offersCountsByDay[i] > 0)
			{
				offerData.push([currentDate.getTime(), offersCountsByDay[i]]);
			}
			
			if (offerRecordsCountsByDay[i] > 0)
			{
				offerRecordData.push([currentDate.getTime(), offerRecordsCountsByDay[i]]);
			}
			
			if (redeemRecordsCountsByDay[i] > 0)
			{
				redeemRecordData.push([currentDate.getTime(), redeemRecordsCountsByDay[i]]);
			}
			
			xAxisTicks.push(currentDate.getTime());
	
			currentDate.setDate(currentDate.getDate()+1);
		}
		
		var individualWidth = 5 * 60 * 60 * 1000;
		var ds = new Array();
		ds.push({
			data : offerData,
			bars : {
				show : true,
				barWidth : individualWidth,
				order : 1,
			}
		});
		ds.push({
			data : offerRecordData,
			bars : {
				show : true,
				barWidth : individualWidth,
				order : 2
			}
		});
		ds.push({
			data : redeemRecordData,
			bars : {
				show : true,
				barWidth : individualWidth,
				order : 3
			}
		});
		
		var maxval = new Date(minval.getTime());
		minval.setDate(minval.getDate()-1);
		maxval.setDate(maxval.getDate()+7);
		
		var options = {
				xaxis : {
					mode : "time",
					ticks: xAxisTicks,
					timeformat: "%m/%d",
				    min : minval,
				    max : maxval
				},
				colors : [$chrt_second, $chrt_fourth, "#666", "#BBB"],
				grid : {
					show : true,
					hoverable : true,
					clickable : true,
					tickColor : $chrt_border_color,
					borderWidth : 0,
					borderColor : $chrt_border_color,
				},
				legend : true,
				tooltip : true,
				tooltipOpts : {
					content : "<b>%x</b> = <span>%y</span>",
					defaultTheme : false
				}

			};

		//Display graph
		$.plot($("#weekly-bar-chart"), ds, options);
	};
};

function display_businesses_pie_chart(offersArray)
{
	console.log(offersArray);
	
	/* pie chart */	
	if ($('#businesses-pie-chart').length) {
		
		var offersDictionary = {};
		var arrayLength = offersArray.length;
		for (var i = 0; i < arrayLength; i += 1)
		{
			var offer = offersArray[i];
			var bizcode = offer.bizCode;
			if (offersDictionary[bizcode] == null)
			{
				offersDictionary[bizcode] = 1;
			}
			else
			{
				offersDictionary[bizcode] = offersDictionary[bizcode] + 1;
			}
		}

		var data_pie = [];
		var index = 0;
		for (var bizcodename in offersDictionary)
		{
			data_pie[index] = {
				label : bizcodename,
				data : offersDictionary[bizcodename]
			};
			index = index + 1;
		}

		$.plot($("#businesses-pie-chart"), data_pie, {
			series : {
				pie : {
					show : true,
					radius : 1,
					label : {
						show : true,
						radius : 2 / 3,
						formatter : function(label, series) {
							return '<div style="font-size:15px;text-align:center;padding:4px;color:white;">' + series.data[0][1] + '</div>';
						},
						threshold : 0.1
					}
				}
			},
			legend : {
				show : true,
				noColumns : 1, // number of colums in legend table
				labelFormatter : null, // fn: string -> string
				labelBoxBorderColor : "#000", // border color for the little label boxes
				container : null, // container (as jQuery object) to put legend in, null means default on top of graph
				position : "ne", // position of default legend container within plot
				margin : [5, 10], // distance from grid edge to default legend container within plot
				backgroundColor : "#efefef", // null means auto-detect
				backgroundOpacity : 1 // set to 0 to avoid background
			},
			grid : {
				hoverable : true,
				clickable : true
			},
		});
	}
	/* end pie chart */
}
