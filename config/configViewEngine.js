/*
    import
*/
const path = require('path'); // công cụ để tương tác với file (tệp tin) và directory path (đường dẫn)
const express = require('express');
const configViewEngine = (app) =>{
    console.log(path.join('./src','./views'));
    app.set('views', path.join('./src','./views'))
    app.set('view engine', 'ejs')

    // comfig startic file : img / css / js
    app.use(express.static(path.join('./src', './public')))
}


/*
    export
*/
module.exports= configViewEngine;
