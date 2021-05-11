const express=require('express');
const fs = require('fs');
const path=require('path');
var app= express(); //server
const sharp = require('sharp');
const dns = require('dns');
const { request } = require('https');
const requestIp = require('request-ip');
 

app.get("*/galerie.json",function(req,res){
    res.setHeader("Content-Type","text/html");
    res.status(403).render("pages/403");
});

app.set("view engine","ejs");
app.use("/resurse",express.static(path.join(__dirname,"resurse") ));



dns.lookup('www.geeksforgeeks.org', 
(err, addresses, family) => {
  
    // Print the address found of user
    console.log('addresses:', addresses);
  
    // Print the family found of user  
    console.log('family:', family);
});




function verificaImagini(){
   
    var textFisier=fs.readFileSync("resurse/json/galerie.json") //citeste tot fisierul
    var jsi=JSON.parse(textFisier); //am transformat in obiect
    var caleGalerie=jsi.cale_galerie;
    //minutul actual
    var d = new Date();
    var n = d.getMinutes();
    let vectImagini=[]
    let counter=0;
   
    console.log(jsi);
    for (let im of jsi.imagini){
        var imVeche= path.join(caleGalerie, im.fisier);//obtin claea completa (im.fisier are doar numele fisierului din folderul caleGalerie)
        var ext = path.extname(im.fisier);//obtin extensia
        var numeFisier =path.basename(im.fisier,ext)//obtin numele fara extensie
        let imMica = path.join(caleGalerie+"/mic/", numeFisier+"-200"+".webp");
        let imMedie = path.join(caleGalerie+"/mediu/", numeFisier+"-350"+".webp");
        console.log(imMica);
        for (let dat of im.minute){
            if(dat == d.getMinutes()){
                vectImagini.push({mare:imVeche, mic:imMica, mediu:imMedie,descriere:im.descriere});
               
                counter+=1;
            }
        }
    
        //adauga in vector un element
        if (!fs.existsSync(imMica))//daca nu exista imaginea, mai jos o voi crea
        sharp(imVeche)
          .resize(150) //daca dau doar width(primul param) atunci height-ul e proportional
          .toFile(imMica, function(err) {
              if(err)
                console.log("eroare conversie",imVeche, "->", imMica, err);
          });
          if(!fs.existsSync(imMedie))
          sharp(imVeche)
              .resize(350)
              .toFile(imMedie, function(err){
                  if(err)
                  console.group("eroare conversie", imVeche, "->",imMedie, err);
              });
  




    }
    // [ {mare:cale_img_mare, mic:cale_img_mica, descriere:text}, {mare:cale_img_mare, mic:cale_img_mica, descriere:text}, {mare:cale_img_mare, mic:cale_img_mica, descriere:text}  ]
    return vectImagini;
}




app.get("/", function(req,res){
    
    let vectImagini =verificaImagini();
    res.render("pages/index2",{imagini:vectImagini});
   


})



app.get("/index", function(req,res){
    
    let vectImagini =verificaImagini();
    res.render("pages/index2",{imagini:vectImagini});
   


})


app.get("/activitati", function(req,res){
   
    res.render("pages/activitati");
   


})



app.get("/galeries", function(req,res){
    
    let vectImagini =verificaImagini();
    res.render("pages/galeries",{imagini:vectImagini});
    


})





app.get("/data", function(req,res){
    res.setHeader("Content-Type","text/html")
    res.write("<!DOCTYPE html><html><head><title>Mno</title></head><body>"+new Date());
    res.write("</body></html>");
    res.end();


})


app.get("/*",function(req, res) {
    console.log(req.url);
    res.render("pages"+req.url, function(err, rezultatRender) {
    if (err) {
    if (err.message.includes("Failed to lookup view")) {
    res.status (404).render("pages/404")
    }
    else
    throw err;
    }
    else
    res.send(rezultatRender);
    });
    });


    
verificaImagini();


app.listen(8080);
console.log("Mno merge");


