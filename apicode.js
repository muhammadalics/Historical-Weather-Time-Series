// // var myChart;
// var unitname = "sdgsdfsdflkhndsflhlskefhnlksdhflsd"
//This is the token for communicating with NOAA API
const tok = 'zaZbfcdivRFqAGBAcmbrxYyeaDmRwbRy';

//This fucntion just sets the parameter that needs to be looked up.
function setParam(paramtext){
    switch(paramtext){
        case 'tmax':
            var chosenparam = "TMAX";
            break;
        case 'tmin':
            var chosenparam = "TMIN";
            break;
        case 'prcp':
            var chosenparam = "PRCP";
            break;
        case 'snow':
            var chosenparam = "SNOW";
            break;
    }
console.log(chosenparam);
}


async function getData(offset){
    var resp = await fetch('https://www.ncdc.noaa.gov/cdo-web/api/v2/locations?locationcategoryid=CITY&sortfield=name&sortorder=asc&limit=1000&offset=' + offset,
    {
        headers:{
            'token': tok
        }
 
    }
    );
    return await resp.json();
        
}


/*
const usefulData = getData('0');

//https://stackoverflow.com/questions/38884522/why-is-my-asynchronous-function-returning-promise-pending-instead-of-a-val
usefulData.then(function(result){
    console.log(result.results)
    result.results.forEach(element => {
        console.log(element.name)
    });
})

*/

//var offset = ['10', '1000'];
const offset = ['0', '1000'];
//var citylist = [];
//var citylist = Array();
var cityObj = {};
//This function creates a JS Object for all the cities available in the dataset.


// offset.forEach(getCities);

// function getCities(off){
//     //const cities = getData(offset);
//     getData(off).then(result=>{           
//         result.results.forEach(element => {
//             var namestring = element.name;
//             //console.log(typeof namestring);
//             citylist.push(namestring);
//             //citylist.push(element.name);
//             cityObj[element.name] = element.id;
//             console.log(element.name)
//         });
//     })
    

// }


var citylist = Array();

for (const off of offset){


console.log(off);


getData(off).then((result)=>{
    return result.results
})   
.then((result)=>{

    result.forEach(element => {
    var namestring = element.name;
    citylist.push(namestring);
    cityObj[element.name] = element.id;
    //console.log(element.name)
    });
    return citylist;
})
.then((citylist)=>{
    console.log('The length of citylist is: ')
    console.log(citylist.length);
    
    if (off != '0'){ //so that cities are listed single time in drop down menu.

    
    
    var select = document.getElementById("citydropdown"); 
    var select2 = document.getElementById("citydropdown2"); 

    for(var i = 1; i < citylist.length; i++) {
        var opt = citylist[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;       
        select.appendChild(el);

        var el2 = document.createElement("option");
        el2.textContent = opt;
        el2.value = opt;       
        select2.appendChild(el2);




    }

    }

})

}


console.log(citylist);

/*
async function getTempData(){
    //const response = await fetch('https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&locationid=ZIP:28801&startdate=2010-05-01&enddate=2010-05-10&units=metric&limit=1000',
    //const response = await fetch('https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&locationid=CITY:NL000012&startdate=2010-05-01&enddate=2010-05-10&units=metric&limit=1000',
    const response = await fetch('https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&locationid=CITY:NL000012&startdate=2010-05-01&enddate=2010-05-10&units=metric&limit=1000',
        
    {
        headers:{
            'token': tok
        }
 
    }
    );
    var responseObj = response.json();   
    console.log(responseObj);
    return responseObj;
}
*/

async function getTempData(startdate, enddate, citycode){
    const response = await fetch('https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&locationid=' + citycode + '&startdate=' + startdate + '&enddate=' + enddate + '&units=metric&limit=1000',
        
    {
        headers:{
            'token': tok
        }
 
    }
    );
    var responseObj = response.json();   
    console.log(responseObj);
    return responseObj;
}







function plotData(temp, dates, cityname, temp2, dates2, cityname2, unit_param_name){
    // if (myChart) { //destroy the chart before making a new chart
    //     myChart.data.labels.pop();
    //     myChart.data.datasets.forEach((dataset) => {
    //         dataset.data.pop();
    //     });
    //     myChart.update();
    //   }
    //console.log(unitname);
    //var myChart;

    // if (typeof myChart !== 'undefined' && myChart == null){

    //     myChart.destroy();
    // }


    //prepping data for scatter chart
    scatter_dataset1 = [];
    scatter_dataset2 = [];
    for (let i=0; i < dates.length; i++){
        scatter_dataset1.push({x:dates[i], y:temp[i]})
        scatter_dataset2.push({x:dates2[i], y:temp2[i]})
    }
    
    if (dates.length > dates2.length){
        var datescat = dates;
    }
    else{
        var datescat = dates2;
    }
    
    console.log(scatter_dataset1);

    var ctx = document.getElementById('chart').getContext("2d");
    Chart.defaults.global.defaultFontSize = 16;
    var myChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            //labels: dates, //should be an array
            datasets: [{
                label: cityname,
                fill: false,
                borderColor: "#3cba9f",
                showLine: true,
                //borderWidth: 2,
                data: scatter_dataset1, //should be an array
                borderWidth: 3
            },
            {
                label: cityname2,
                fill: false,
                borderColor: 'rgba(255, 99, 132, 1)',
                showLine: true,
                data: scatter_dataset2, //should be an array
                borderWidth: 3
            }
               
        
        ]
        },
        options: {
            maintainAspectRatio: true,
            responsive: true,           
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: unit_param_name[1] + ", " + unit_param_name[0]
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    type:'category',
                    labels: datescat
                }]
            }
        }
    });

    //Chart.defaults.line.fill = false;

    //myChart.update();

}

function getCityCode(cityname){
    return cityObj[cityname];
}

function calculateAndPrintStats(weatherparam1, dates1, cityname1, weatherparam2, dates2, cityname2, unit_param_name){

    //Calculate min, max, date of min and max, range, mean
    var sum1 = weatherparam1.reduce((sum, num) => sum + num);
    var sum2 = weatherparam2.reduce((sum, num) => sum + num);

    // Mean of the weather parameter over the range
    var mean1 = sum1/weatherparam1.length;
    var mean2 = sum2/weatherparam2.length;

    // Maximum of the weather parameter over the range
    var max_val1 = weatherparam1.reduce((a, b) => Math.max(a,b));
    var max_val2 = weatherparam2.reduce((a, b) => Math.max(a,b));

    // Dates when maximum value of parameter occurred for the two cities
    var dateofmax1 = dates1[weatherparam1.indexOf(max_val1)];
    var dateofmax2 = dates2[weatherparam2.indexOf(max_val2)];

    // Mainimum of the weather parameter over the range
    var min_val1 = weatherparam1.reduce((a, b) => Math.min(a,b));
    var min_val2 = weatherparam2.reduce((a, b) => Math.min(a,b));

    // Dates when min value of parameter occurred for the two cities
    var dateofmin1 = dates1[weatherparam1.indexOf(min_val1)];
    var dateofmin2 = dates2[weatherparam2.indexOf(min_val2)];

    // Range of the values:
    var range_val1 = max_val1 - min_val1;
    var range_val2 = max_val2 - min_val2;

    // Setting stats for City 1
    document.getElementById("cityname1").innerHTML = cityname1;
    document.getElementById("meanval1").innerHTML = "Mean: " + mean1.toFixed(1) + " " + unit_param_name[0];
    document.getElementById("rangeval1").innerHTML = "Range (max - min): " + range_val1.toFixed(1) + " " + unit_param_name[0];
    document.getElementById("maxval1").innerHTML = "Max: " + max_val1  + " " + unit_param_name[0] + " on " + dateofmax1;
    document.getElementById("minval1").innerHTML = "Min: " + min_val1 + " " + unit_param_name[0] + " on " + dateofmin1;

    // Setting stats for City 2
    document.getElementById("cityname2").innerHTML = cityname2;
    document.getElementById("meanval2").innerHTML = "Mean: " + mean2.toFixed(1) + " " + unit_param_name[0];
    document.getElementById("rangeval2").innerHTML = "Range (max - min): " + range_val2.toFixed(1) + " " + unit_param_name[0];
    document.getElementById("maxval2").innerHTML = "Max: " + max_val2  + " " + unit_param_name[0] + " on " + dateofmax2;
    document.getElementById("minval2").innerHTML = "Min: " + min_val2  + " " + unit_param_name[0] + " on " + dateofmin2;

    // Resetting the tags so that bullet points appear in the lists.
    document.getElementById('list1').className = '';
    document.getElementById('list2').className = '';
    //console.log("Now printing: ")
    //console.log(chosenparam);


}

function myFunction(){
    // if (myChart != undefined) { //destroy the chart before making a new chart
    //     myChart.destroy();
    //   }

    const paramddtxt = document.getElementById("wparamdd").value;
    const pickeddate1 = document.getElementById("basicDate").value;
    const pickeddate2 = document.getElementById("basicDate2").value;
    const pickedcity = document.getElementById("citydropdown").value;
    const pickedcity2 = document.getElementById("citydropdown2").value;
    
    var citycode = getCityCode(pickedcity);
    var citycode2 = getCityCode(pickedcity2);

    alert('You picked the date range : ' + pickeddate1 + ' to ' + pickeddate2 + ' and you picked the city:' + pickedcity + '. The city code is ' + citycode);

    const TempandDates = getTempData(pickeddate1, pickeddate2, citycode);
    const TempandDates2 = getTempData(pickeddate1, pickeddate2, citycode2);

    console.log(paramddtxt);
    setParam(paramddtxt);
    // var chosenparam = document.getElementById("wparamdd").value;
    
    var td1 = TempandDates.then(function(result){
        console.log(result.results)
        //console.log(typeof result.results)
    
        var Tmax = [];
        var readingDate =[];
        var chosenparam = document.getElementById("wparamdd").value;

        let previous_date = ""; //This is to make sure that only one measurement from a date is picked. Dataset has multiple readings from different stations for single days for many cities.

        result.results.forEach(element => {
            if (element.datatype == chosenparam && element.date !== previous_date){
                Tmax.push(element.value)
                readingDate.push(element.date.slice(0,-9))
                previous_date = element.date;
            }
            
        });
    


    // TempandDates2.then(function(result){
    //     console.log(result.results)
    //     console.log(typeof result.results)
    
    //     let Tmax2 = [];
    //     let readingDate2 =[];
    
    //     result.results.forEach(element => {
    //         if (element.datatype == "TMAX"){
    //             Tmax2.push(element.value)
    //             readingDate2.push(element.date.slice(0,-9))
    //         }
            
    //     });


        //plotData(Tmax, readingDate, pickedcity, Tmax, readingDate, pickedcity)
    
        return [Tmax, readingDate, pickedcity]
    });

    var td2 = TempandDates2.then(function(result){
        
        
        //console.log(result.results)
        //console.log(typeof result.results)
    
        let Tmax2 = [];
        let readingDate2 =[];
        var chosenparam = document.getElementById("wparamdd").value;
    
        let previous_date = ""; //This is to make sure that only one measurement from a date is picked. Dataset has multiple readings from different stations for single days for many cities.

        result.results.forEach(element => {
            if (element.datatype == chosenparam && element.date !== previous_date){
                Tmax2.push(element.value)
                readingDate2.push(element.date.slice(0,-9))
                previous_date = element.date;
            }
            
        });
        
        return [Tmax2, readingDate2, pickedcity2]
    });

    Promise.all([td1, td2]).then(data =>{
        console.log(typeof data[0][2]);

        console.log('First City: ')
        console.log(data[0][0]);
        console.log(data[0][1]);

        console.log('Second City: ')
        console.log(data[1][0]);
        console.log(data[1][1]);

        //var chosenparam = document.getElementById("wparamdd").value;
        var unit_param_name  = getNameAndUnit(); //The array holds unit at index 0 and then parameter name on index 1.
        

        // var unitname;
        // if (chosenparam == "TMAX" || chosenparam == "TMIN"){
        //     unitname = <span>&#176;</span> + "C";
        // }
        // else{
        //     unitname = "mm";
        // }


        plotData(data[0][0], data[0][1], data[0][2], data[1][0], data[1][1], data[1][2], unit_param_name);
        calculateAndPrintStats(data[0][0], data[0][1], data[0][2], data[1][0], data[1][1], data[1][2], unit_param_name);
    })

    

}


function getNameAndUnit(){
    let paramval = document.getElementById("wparamdd").value;

    if (paramval == "TMAX"){
        return ["\u00B0" + "C", "Daily High Temperature"];
    }
    if (paramval == "TMIN"){
        return ["\u00B0" + "C", "Daily Low Temperature"];
    }
    if (paramval == "PRCP"){
        return ["mm", "Precipitation"];
    }
    if (paramval == "SNOW"){
        return ["mm", "Snow"];
    }


}


// document.getElementById("plotbutton").addEventListener("click", function() {
//     //document.getElementById("demo").innerHTML = "Hello World";
//     myChart.destroy();
//   });