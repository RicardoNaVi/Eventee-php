"use strict";
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const app_dir = path.dirname(require.main.filename);
const { Parser } = require('json2csv');

const toWordpress = require("../controllers/webservices/toWordpress");
const toEventee = require("../controllers/webservices/toEventee");

router.post('/speakersCSV',(req,res)=>{
    toWordpress.buildCSV(req.body.token).then(result=>{  
        const fields = [
            'Title',
            'speaker_nombre',
            'speaker_bio',
            'speaker_empresa',
            'speaker_puesto',
            'speaker_rs_facebook',
            'speaker_rs_instagram',
            'speaker_rs_linkedin',
            'speaker_rs_pinterest',
            'speaker_rs_twitter',
            'speaker_rs_youtube', 
            'speaker_sitio_web'
        ];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(result);
        const nameFile = 'eventee'+Date.now()+'.csv'
        var path='./public/csvs/'+nameFile; 
        fs.writeFile(path, csv, function(err,data) {
            if (err) {throw err;}
            else{ 
                res.download(path); // This is what you need
            }
        });
        return res.status(200).send(nameFile);
    })
});

router.post('/workshopCSV',async (req,res)=>{
    let result = await toWordpress.buildWorkshopCSV(req.body.workshopId,req.body.tokenPetition)
    const fields = [
        'id',
        'firstName',
        'lastName',
        'name',
        'email'
    ];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(result);
    const nameFile = req.body.workshopName+Date.now()+'.csv'
    var path='./controllers/csvs/'+nameFile; 
    fs.writeFile(path, csv, function(err,data) {
        if (err) {throw err;}
        else{ 
            res.download(path); // This is what you need
        }
    });
    return res.status(200).send(nameFile);
});

router.post('/impLectures',(req,res)=>{
    toEventee.impLectures(req.body.lectures,req.body.token,req.body.hall).then(result=>{
        return res.status(200).send(result);
    })
});

router.post('/impSpeakers',(req,res)=>{
    toEventee.impSpeakers(req.body.speakers,req.body.token,req.body.hall).then(result=>{
        return res.status(200).send(result);
    })
});

router.post('/updSpeakers',(req,res)=>{
    toEventee.updSpeakers(req.body.speakersCSV,req.body.speakersEventee,req.body.token).then(result=>{
        return res.status(200).send(result);
    })
});

router.post('/delAllSpeakers',(req,res)=>{
    toEventee.delAllSpeakers(req.body.speakersEventee,req.body.token).then(result=>{
        return res.status(200).send(result);
    })
});

router.post('/delSpeakers',(req,res)=>{
    toEventee.delSpeakers(req.body.speakersCSV,req.body.speakersEventee,req.body.token).then(result=>{
        return res.status(200).send(result);
    })
});

router.post('/impWorkshops',(req,res)=>{
    toEventee.impWorkshops(req.body.workshops,req.body.token,req.body.hall).then(result=>{
        return res.status(200).send(result);
    })
});
module.exports = router;