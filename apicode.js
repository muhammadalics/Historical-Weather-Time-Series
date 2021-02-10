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
    for(var i = 1; i < citylist.length; i++) {
        var opt = citylist[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
        //console.log(citylist[i]);
    }
    }

})

}


console.log(citylist);

async function getTempData(){
    //const response = await fetch('https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&locationid=ZIP:28801&startdate=2010-05-01&enddate=2010-05-10&units=metric&limit=1000',
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



/*
const TempandDates = getTempData();

TempandDates.then(function(result){
    console.log(result.results)
    console.log(typeof result.results)

    let Tmax = [];
    let readingDate =[];

    result.results.forEach(element => {
        if (element.datatype == "TMAX"){
            Tmax.push(element.value)
            readingDate.push(element.date)
        }
        
    });

    console.log(Tmax)
    console.log(readingDate)

    plotData(Tmax, readingDate)

})

*/

function plotData(temp, dates){
    var ctx = document.getElementById('chart');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates, //should be an array
            datasets: [{
                label: '# of Votes',
                data: temp, //should be an array
                //backgroundColor: [
                    //'rgba(255, 99, 132, 0.2)',
                    //'rgba(54, 162, 235, 0.2)',
                    //'rgba(255, 206, 86, 0.2)',
                    //'rgba(75, 192, 192, 0.2)',
                    //'rgba(153, 102, 255, 0.2)',
                    //'rgba(255, 159, 64, 0.2)'
                //],
                //borderColor: [
                    //'rgba(255, 99, 132, 1)',
                    //'rgba(54, 162, 235, 1)',
                    //'rgba(255, 206, 86, 1)',
                    //'rgba(75, 192, 192, 1)',
                    //'rgba(153, 102, 255, 1)',
                    //'rgba(255, 159, 64, 1)'
                //],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });





}


