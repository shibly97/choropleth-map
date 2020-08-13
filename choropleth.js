let countyUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let educationUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

let countyData
let educationData

let canverse = d3.select('#canverse')

let drawMap =() =>{

    // to draw this you need to use path element not rect or circle
    let tooltip = d3.select('#tooltip')
                    .style('visibility','hidden')

    canverse.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')
            // path has a attribute call 'd'. (like x,y,width,height in rect, like 'r' in circle)
            // which need to draw the map 
            .attr('d', d3.geoPath())
            // d3.geoPath() converts the countyData into a format which can use in path
            // by now the map have been drawed.
            .attr('class','county')
            .attr('fill', (item) =>{
                // take the state id 
                let id = item['id']
                // go throug the education data and find the appropiate data set of the state
                let county = educationData.find((item =>{
                    // in educationData id reffer as fips
                    return item['fips'] == id
                }))
                // take the bachlours degree presentage from the selected data
                let presentage = county['bachelorsOrHigher']
                if (presentage < 10){
                    return 'brown'
                }else if(presentage <20 ){
                    return 'red'
                }else if(presentage <30){
                    return 'orange'
                }else if(presentage <40){
                    return 'yellow'
                }else{
                    return 'green'
                }
            })
            .attr('data-fips', (item)=>{
                return item['id']
            })
            .attr('data-education',(item)=>{
                let id = item['id']
                let county = educationData.find((item) =>{
                    return item['fips'] == id})
        
                return  county['bachelorsOrHigher']
            })
            .on('mouseover' ,(item) =>{
                tooltip.transition()
                       .style('visibility','visible')
                
                let id = item['id']
                let education = educationData.find((i)=>{
                        return i['fips']==id
                    })
                
                tooltip.text('Area Name :'+education['area_name'] + '|| Presentage of bachelors Or Higher Studies : '+education['bachelorsOrHigher'])
                tooltip.attr('data-education', education['bachelorsOrHigher'])
            })
            .on('mouseout',(item) =>{
                tooltip.transition()
                       .style('visibility','hidden')
                       
            })


}

// using instant of XMLHttprequest
// this is a asyncrones function 
// in http, onload event happens when readyState = 4 
d3.json(countyUrl).then(
    // this automaticlly convert the data in to JSON format no need to use JSON.parse
    (data,error) =>{
        // if error occured 
        if(error){
            console.log(error)
        // otherwise countinue
        }else{
            console.log(data)
            // 1.convert into topojson.(linked to topjason in html. use topojson.) 
            // 2.and then convert into geojson(by.feature) 
            // 3. and then select features (just a selection)
            countyData = topojson.feature(data,data.objects.counties).features

            console.log(countyData)

            d3.json(educationUrl).then(
                (data,error) =>{
                    if(error){
                        console.log(error)
                    }else{
                        educationData = data
                        console.log(educationData)
                        drawMap()
                    }
                }
            )
        
        }
    }
)

document.getElementsByClassName('legend-rect')[0].addEventListener('mouseover',()=>{
    document.getElementById('legend-description').innerHTML=(' : Above 40%')
})

document.getElementsByClassName('legend-rect')[1].addEventListener('mouseover',()=>{
    document.getElementById('legend-description').innerHTML=(' : 40% - 30%')
})

document.getElementsByClassName('legend-rect')[2].addEventListener('mouseover',()=>{
    document.getElementById('legend-description').innerHTML=(' : 30% - 20%')
})
document.getElementsByClassName('legend-rect')[3].addEventListener('mouseover',()=>{
    document.getElementById('legend-description').innerHTML=(' : 20% - 10%')
})
document.getElementsByClassName('legend-rect')[4].addEventListener('mouseover',()=>{
    document.getElementById('legend-description').innerHTML=(' : Less than 10%')
})

document.getElementById('legend').addEventListener('mouseout',()=>{
    document.getElementById('legend-description').innerHTML=(' - Mouse over for Description')
})