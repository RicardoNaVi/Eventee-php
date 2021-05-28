"use strict";
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const app_dir = path.dirname(require.main.filename);

/**
 * This route sends to the index.html file
 */
router.get('/',(req,res) =>{
    fs.readFile(path.join(
        app_dir,'public/'+'index.html',() => {
            if(err){
                console.error(err);
                return;
            }
            res.writeHeader(200,{"Content-Type": "text/html"});
            res.write(html);
            res.end();
        }
    ))
});

module.exports = router;