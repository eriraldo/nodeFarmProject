// file system library to allow the app to read and write documents locally

const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

///////////////////////////////////////////////////FILES/////////////////////////////////////////////////////////////
//reading from a file in a blocking way

// const textInput = fs.readFileSync('./txt/input.txt','utf-8');

// //console.log(textInput);

// //using the ES6 version of concat a string with a variable

// const textOutput = `This is what we know about the avocado: ${textInput}.\nCreated on ${Date.now()}`;

// //writing to a file in a blocking way

// fs.writeFileSync('./txt/output.txt', textOutput);

// //console.log(`The file has been created.`);


// //reading from a file in a NON blocking way

// fs.readFile('./txt/start.txt','utf-8' ,(err,data1) => {
//     if(err) return console.log('ERROR :(')


//     fs.readFile(`./txt/${data1}.txt`,'utf-8' ,(err,data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt','utf-8' ,(err,data3) => {
//             console.log(data3);

//             //writing to a file in a NON blocking way
            
//             fs.writeFile('./txt/final.txt',`${data2}\n${data3}`, 'utf-8', err =>{
//                 console.log('The file has been written :)')
//             })
//         });
//     });
// });

// console.log('Will read file');

///////////////////////////////////////////////////SERVER/////////////////////////////////////////////////////////////

const replateTemplate = (temp, product) =>{
    let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output = output.replace(/{%IMAGE%}/g,product.image);
    output=output.replace(/{%PRICE%}/g,(product.price));
    output = output.replace(/{%FROM%}/g,product.from);
    output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output = output.replace(/{%QUANTITY%}/g,product.quantity);
    output=output.replace(/{%DESCRIPTION%}/g,(product.description));
    output=output.replace(/{%ID%}/g,(product.id));

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
    

}


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);



const server = http.createServer((req,res)=> {
    console.log(req.url);
    console.log(url.parse(req.url, true));
    //here we are defining the start of the routing part of the server
    const pathName = req.url;
    //defining the paths that are accepted and what to do with them

    //overview page
    if(pathName === '/' || pathName === '/overview'){
        res.writeHead(200, {
            'Content-type': 'text/html'
          });

        const cardsHtml =dataObj.map(ele => replateTemplate(tempCard, ele)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        //console.log(cardsHtml);
        res.end(output);

    }
    
    //product page
    else if(pathName === '/product'){
        res.end('This is the product')
    } 
    
    //api page
    else if(pathName === '/api'){  
        res.writeHead(200, {"Content-type":"application/json",})
        res.end(data);
        
    } 

    //other errors
    else{
        res.writeHead(404, {
            "Content-Type": "text/html"

        });
        res.end('<h1>This page could not be found</h1>');
    }
    
});

server.listen(8000,'127.0.0.1',()=>{
    console.log("Listening at port 8000");
})


