"use strict";
const axios = require('axios');
const express = require('express');

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function impLectures(lectures,token,hall){
    return new Promise((resolve,reject)=>{
        lectures.forEach(element=>{
            var start = element[2]+' '+element[3];
            var end = element[4]+' '+element[5];
            var utcstart = new Date(start);
            var utcend = new Date(end);
            var rstart = utcstart.toUTCString();
            var rend = utcend.toUTCString();
            start =""+new Date(rstart).getUTCFullYear()+ "-"+(new Date(rstart).getUTCMonth()+1)+"-" +new Date(rstart).getUTCDate()+" "+addZero(new Date(rstart).getUTCHours())+":"+addZero(new Date(rstart).getUTCMinutes())+":"+addZero(new Date(rstart).getUTCSeconds());
            end = ""+ new Date(rend).getUTCFullYear()+ "-"+(new Date(rend).getUTCMonth()+1)+"-" +new Date(rend).getUTCDate()+" "+addZero(new Date(rend).getUTCHours())+":"+addZero(new Date(rend).getUTCMinutes())+":"+addZero(new Date(rend).getUTCSeconds());
            var data = JSON.stringify({
                name: element[1],
                description: element[6],
                start: start,
                end: end,
                hall_id: parseInt(hall,10)
            });
            var conf = {
                method: 'post',
                url: 'https://eventee.co/public/api/v1/lecture',
                headers: {
                    'Authorization': 'Bearer '+token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: data
            }
            axios(conf)
            .then((response)=>{
            }).catch(e=>{
                console.error("axios "+element[1]+" error: "+e)
            })
        })
        resolve(true)
    }).catch(e=>console.error("impLectures error: "+e))
}

function impSpeakers(speakers,token,hall){
    return new Promise((resolve,reject)=>{
        speakers.forEach(element=>{
            console.log(element[0])
            if(element[0] !== 'Title'){
                axios.post('https://eventee.co/public/api/v1/speaker',{
                    name: element[0],
                    company: element[1],
                    position: element[2],
                    bio: element[3],
                    web: element[4] === '#'?'':element[4],
                    linkedIn: element[5] === '#'?'':element[5],
                    facebook: element[6] === '#'?'':element[6],
                    twitter: element[7] === '#'?'':element[7],
                    instagram: element[8] === '#'?'':element[8],
                    country: element[11] === '#'?'':element[11],
                    languages: element[12] === '#'?'':element[12],
                    photo: element[13],
                },{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+token,
                        'Accept': 'application/json'
                    },
                }).catch(e=>reject(console.error("axios "+element[1]+" error: "+e)))
            }else{
                element.forEach(el=>{
                    console.log(el)
                })
            }
        })
        resolve(true);
    }).catch(e=>console.error("impSpeakers error: "+e))
}

function updSpeakers(speakersCSV,speakerEventee,token,hall){
    return new Promise((resolve,reject)=>{
        //Aqui hago la peticion de todos los monos
        speakersCSV.forEach(csv=>{
            speakerEventee.forEach(eventee=>{
                if((csv[0] === eventee.name) && csv[14] === undefined){
                    csv.push(eventee.id);
                }
            })
        })
        speakersCSV.forEach(element=>{
            console.log("ID "+element[14]+": "+ element[0] + " updated")
            if(element[0] !== 'Title'){
                axios.patch('https://eventee.co/public/api/v1/speaker/'+element[14],{
                    name: element[0],
                    company: element[1],
                    position: element[2],
                    bio: element[3],
                    web: element[4] === '#'?'':element[4],
                    linkedIn: element[5] === '#'?'':element[5],
                    facebook: element[6] === '#'?'':element[6],
                    twitter: element[7] === '#'?'':element[7],
                    instagram: element[8] === '#'?'':element[8],
                    country: element[11] === '#'?'':element[11],
                    languages: element[12] === '#'?'':element[12],
                    photo: element[13],
                },{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+token,
                        'Accept': 'application/json'
                    },
                }).catch(e=>reject(console.error("axios "+element[1]+" error: "+e)))
            }else{
                element.forEach(el=>{
                    console.log(el)
                })
            }
        })
        resolve(true);
    }).catch(e=>console.error("impSpeakers error: "+e))
}

function impWorkshops(workshops,token,hall){
    return new Promise((resolve,reject)=>{
        //console.log(workshops)
        resolve(true)
    })
}

module.exports = {
    impLectures: impLectures,
    impWorkshops: impWorkshops,
    impSpeakers: impSpeakers,
    updSpeakers: updSpeakers
}