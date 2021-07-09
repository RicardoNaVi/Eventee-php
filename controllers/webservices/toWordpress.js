"use strict";
const axios = require('axios');

function buildCSV(token){
    return new Promise((resolve,reject)=>{
        axios.get('https://eventee.co/public/api/v1/content',{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
            },
        })
        .then(function (response) {
            // handle success
            var result = [];
            var halls = response.data.halls;
            var speakers = response.data.speakers;
            var lectures = response.data.lectures;
            var workshops = response.data.workshops;
            speakers.forEach(element=>{
                result.push({
                    Title: element.name,
                    speaker_nombre: element.name,
                    speaker_bio: element.bio,
                    speaker_empresa: element.company,
                    speaker_puesto: element.position,
                    speaker_rs_facebook: element.facebook === ''? '#':element.facebook,
                    speaker_rs_instagram: "#",
                    speaker_rs_linkedin: element.linkedIn === ''? '#':element.linkedIn,
                    speaker_rs_pinterest: "#",
                    speaker_rs_twitter: element.twitter === ''? '#':element.twitter,
                    speaker_rs_youtube: "#",
                    speaker_sitio_web: element.web === ''? '#':element.web
                })
            })
            resolve(result);
        })
        .catch(e=>reject(console.error("Error in buildCSV: "+e)))
    })
    
}

async function buildWorkshopCSV(workshopId,tokenPetition){
    var attendees = [];
    return new Promise(async (resolve,reject)=>{
        var firstUrl = 'https://eventee.co/api/v1/booking/'+workshopId+'/attendees?order_by=order&ascending=1&per_page=50&page=1';

        let response = await axios.get(firstUrl,{
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer '+tokenPetition
            },
        })
        for(var i=0;i<response.data.last_page;i++){
            var secondUrl = 'https://eventee.co/api/v1/booking/'+workshopId+'/attendees?order_by=order&ascending=1&per_page=50&page='+(i+1);
            let attendesDataPerPage = await axios.get(secondUrl,{
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer '+tokenPetition
                },
            })
            attendesDataPerPage.data.data.forEach(attendee=>{
                attendees.push({
                    id: attendee.id,
                    firstName: attendee.first_name,
                    lastName: attendee.last_name,
                    name: attendee.name,
                    email: attendee.email 
                })
            })
        }
        resolve(attendees);
    })
}

module.exports = {
    buildCSV : buildCSV,
    buildWorkshopCSV: buildWorkshopCSV
}