//This is the token for communicating with NOAA API
const tok = 'zaZbfcdivRFqAGBAcmbrxYyeaDmRwbRy';


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
    console.log(element.name)
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







function plotData(temp, dates, cityname, temp2, dates2, cityname2){
    
    var ctx = document.getElementById('chart');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates, //should be an array
            datasets: [{
                label: cityname,
                fill: false,
                //borderWidth: 2,
                data: temp, //should be an array
                borderWidth: 3
            },
            {
                label: cityname2,
                fill: false,
                //borderWidth: 2,
                data: temp2, //should be an array
                borderWidth: 3
            }
               
        
        ]
        },
        options: {
            responsive: false,           
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Daily High Temperature, degree C'
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    //Chart.defaults.line.fill = false;



}

function getCityCode(cityname){
    return cityObj[cityname];
}



function myFunction(){
    const pickeddate1 = document.getElementById("basicDate").value;
    const pickeddate2 = document.getElementById("basicDate2").value;
    const pickedcity = document.getElementById("citydropdown").value;
    const pickedcity2 = document.getElementById("citydropdown2").value;
    
    var citycode = getCityCode(pickedcity);
    var citycode2 = getCityCode(pickedcity2);

    alert('You picked the date range : ' + pickeddate1 + ' to ' + pickeddate2 + ' and you picked the city:' + pickedcity + '. The city code is ' + citycode);

    const TempandDates = getTempData(pickeddate1, pickeddate2, citycode);
    const TempandDates2 = getTempData(pickeddate1, pickeddate2, citycode2);

    
    TempandDates.then(function(result){
        console.log(result.results)
        console.log(typeof result.results)
    
        var Tmax = [];
        var readingDate =[];
    
        result.results.forEach(element => {
            if (element.datatype == "TMAX"){
                Tmax.push(element.value)
                readingDate.push(element.date.slice(0,-9))
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


        plotData(Tmax, readingDate, pickedcity, Tmax, readingDate, pickedcity)
    
    })



    

}

