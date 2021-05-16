const express=require('express');
const fs = require('fs');
const path=require('path');
const {exec} = require("child_process");
const ejs = require('ejs');
const sharp = require('sharp');
const app= express(); //server
var sass = require('sass');
var i=0;



var aux;
aux=Math.floor(Math.random()*3+1)
var width1;
var widthp1;


var vec= new Array();
vec[1]=4;
vec[2]=9;
vec[3]=16;




app.get("*/galerie.css", function (req, res) {
    aux=Math.floor(Math.random()*3+1)
    if (aux==1){
        width1=266.66;
        widthp1=300;
    }
    else if(aux==2){width1=400;widthp1=400;}
    else if(aux==3){width1=533.33;widthp1=300}
    res.setHeader("Content-Type", "text/css");
    let sirScss=fs.readFileSync("resurse/scss/galerie-animata.scss").toString("utf-8");
    let rezScss=ejs.render(sirScss,{nrrandom:vec[aux],rad:aux+1,wi:width1,wip:widthp1});
    
    
    
    fs.writeFileSync("./temp/galerie-animata.scss",rezScss);
    sass.render({
        file: './temp/galerie-animata.scss',
        sourceMap: true,
        outFile: './temp/galerie-animata.css'
    }, function (err, result) {
        if (err) throw err;
        fs.writeFile('./temp/galerie-animata.css', result.css, function (err) {
            if (err) throw err;
            res.sendFile(path.join(__dirname, "temp/galerie-animata.css"));
            
        });

    });

});


app.use("/resurse/imagini/Favicon", express.static(__dirname+'/resurse/imagini/Favicon'));
app.set("view engine","ejs");
app.use("/resurse",express.static(path.join(__dirname,"resurse") ));









app.get("*/galerie.json",function(req,res){
    res.setHeader("Content-Type","text/html");
    res.status(403).render("pages/403");
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
   

    for (let im of jsi.imagini){
        var imVeche= path.join(caleGalerie, im.fisier);//obtin claea completa (im.fisier are doar numele fisierului din folderul caleGalerie)
        var ext = path.extname(im.fisier);//obtin extensia
        var numeFisier =path.basename(im.fisier,ext)//obtin numele fara extensie
        let imMica = path.join(caleGalerie+"/mic/", numeFisier+"-200"+".webp");
        let imMedie = path.join(caleGalerie+"/mediu/", numeFisier+"-350"+".webp");
        
        for (let dat of im.minute){
            if(dat == 14){
                
                vectImagini.push({mare:imVeche, mic:imMica, mediu:imMedie,descriere:im.descriere});
             counter++;

                } 
              
            }
        
     
        if (counter == 4 || counter == 7){
           vectImagini.push({mare:"",mic:"",mediu:"",descriere:""})
           counter++;
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
  
              if (counter>11)
                break;



    }
    // [ {mare:cale_img_mare, mic:cale_img_mica, descriere:text}, {mare:cale_img_mare, mic:cale_img_mica, descriere:text}, {mare:cale_img_mare, mic:cale_img_mica, descriere:text}  ]
    return vectImagini;
}



function verificaImagini2(){
   
    var textFisier=fs.readFileSync("resurse/json/galerie.json") //citeste tot fisierul
    var jsi=JSON.parse(textFisier); //am transformat in obiect
    var caleGalerie=jsi.cale_galerie;
    //minutul actual
    var d = new Date();
    var n = d.getMinutes();
    let vectImagini=[]
    let counter=0;


    for (let im of jsi.imagini){
        var imVeche= path.join(caleGalerie, im.fisier);//obtin claea completa (im.fisier are doar numele fisierului din folderul caleGalerie)
        var ext = path.extname(im.fisier);//obtin extensia
        var numeFisier =path.basename(im.fisier,ext)//obtin numele fara extensie
        let imMica = path.join(caleGalerie+"/mic/", numeFisier+"-200"+".webp");
        let imMedie = path.join(caleGalerie+"/mediu/", numeFisier+"-350"+".webp");
        counter++;
        vectImagini.push({mare:imVeche, mic:imMica, mediu:imMedie,descriere:im.descriere});
        

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
  

              if (counter == vec[aux]){
               
                  break;
              }


    }
    // [ {mare:cale_img_mare, mic:cale_img_mica, descriere:text}, {mare:cale_img_mare, mic:cale_img_mica, descriere:text}, {mare:cale_img_mare, mic:cale_img_mica, descriere:text}  ]
    return vectImagini;
}



app.get("/", function(req,res){
    
    let vectImagini =verificaImagini();
    


    res.render("pages/index2",{imagini:vectImagini,adresa:req.ip});
   


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




app.get("/galeria", function(req,res){
   
    
    let vectImagini=verificaImagini2();
    res.render("pages/galeria",{imagini:vectImagini});


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


