const express=require('express');
const fs = require('fs');
const path=require('path');
const {exec} = require("child_process");
const ejs = require('ejs');
const {Client} =require('pg');
const sharp = require('sharp');

var sass = require('sass');
const session = require('express-session');
const formidable = require('formidable');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const app= express(); //server

app.use(session({
    secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
    resave: true,
    saveUninitialized: false
}));


async function trimiteMail(username, email){
    var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;

	var transp= nodemailer.createTransport({
		service: "gmail",
		secure: false,
		auth:{//date login 
			user:"zootoplita@gmail.com",
			pass:"ZooToplita2"
		},
		tls:{
			rejectUnauthorized:false
		}
	});
	//genereaza html
	await transp.sendMail({
		from:"zootoplita@gmail.com",
		to:email,
		subject:"Mesaj înregistrare",
		text:"Pe Zoo Toplita ai username-ul"+username+", începând de azi, "+today,
		html:"Pe Zoo Toplita ai username-ul"+username+", începând de azi, "+today,
	})
	console.log("trimis mail");
}





var i=0;

var width1;
var widthp1;


var vec= new Array();
vec[1]=4;
vec[2]=9;
vec[3]=16;



const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'adminbobi',
    database: 'proiect_tw',
    port:5432
})
client.connect();





app.get("*/galerie.css", function (req, res) {
    if (aux==1){
        width1=266.66;
        widthp1=300;
    }
    else if(aux==2){width1=400;widthp1=400;}
    else if(aux==3){width1=533.33;widthp1=300}
   

    res.setHeader("Content-Type", "text/css");
    let sirScss=fs.readFileSync("resurse/scss/galerie-animata.scss").toString("utf-8");

    let rezScss=ejs.render(sirScss,{nrrandom:vec[aux],rad:aux+1,wi:width1,wip:widthp1,stil:vec[aux].toString()});
    
    
    
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
            if(dat == n){
                
                vectImagini.push({mare:imVeche, mic:imMica, mediu:imMedie,descriere:im.descriere,cr:im.cr});
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



function verificaImagini2(aux){

   
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



app.get(["/","/index"], function(req,res){
    
    let vectImagini =verificaImagini();
    

    console.log(req.session.utilizator)
    res.render("pages/index2",{imagini:vectImagini,adresa:req.ip,utilizator:req.session.utilizator});



})




app.get("/activitati", function(req,res){
   
    res.render("pages/activitati");
   


})

app.get("/logout",function(req,res){
    req.session.destroy();
    res.render("pages/logout")
})








app.get("/galeries", function(req,res){
    
    let vectImagini =verificaImagini();
    res.render("pages/galeries",{imagini:vectImagini});
    
})




app.get("/galeria", function(req,res){
   
    aux=Math.floor(Math.random()*3+1)
    let vectImagini=verificaImagini2(aux);
    res.render("pages/galeria",{imagini:vectImagini});


})



app.get("/inregistrare", function(req,res){
   
    res.render("pages/inregistrare");


})

parolaServer="tehniciweb"


// app.post("/inreg",function(req,res){
//     console.log("am primit date")
//     let formular= formidable.IncomingForm();
//     formular.parse(req, function(err, campuriText,campuriFisier){
//         eroare= false;
//         if (campuriText.username=="" || !campuriText.username.match("^[A-Za-z0-9]+")){eroare=true;}
//         if (campuriText.nume=="" || !campuriText.nume.match("^[A-Za-z]+")){eroare=true;}
//         if (campuriText.prenume=="" || !campuriText.nume.match("^[A-Za-z]+")){eroare=true;}
//         if (campuriText.email=="" ){eroare=true;}
//         if (campuriText.parola=="" ){eroare=true;}
//         if (campuriText.email=="" ){eroare=true;}
//         if (!eroare){
//         let parolaCriptata= crypto.scryptSync(campuriText.parola,parolaServer,32).toString('ascii');
//         let comanda=`insert into utilizatori (username,nume,prenume,parola,email,culoare_chat,data_adaugare) 
//         values($1::text,$2::text,$3::text,$4::text,
//             $4::text,$5::text,current_timestamp)`;    
//         console.log(comanda);
//         client.query(comanda,[campuriText.username,campuriText.nume,campuriText.prenume,parolaCriptata,
//         campuriText.email,campuriText.culoare_chat],function(err,rez){

//             if(!err){
//                 console.log("aici")
//                 trimiteMail(campuriText.username,campuriText.email)
//                 res.render("pages/inregistrare",{raspuns:"Multumesc",err:""});
//             }
//             else{
//                 console.log("Eroare:",err);
//                 res.render("pages/inregistrare",{raspuns:"",err:"Nu ati introdus bine datele"});

//             }
            
//             res.end();

//         })
//     }
//         // console.log(campuriText)
//         else{
//             res.render("pages/inregistrare",{raspuns:"",err:"eroare formular"})


//         }
//     })


// })

app.post("/inreg", function (req, res) {
    console.log("Date primite.");
    var username;
    let formular = formidable.IncomingForm();
    formular.parse(req, function (err, campuriText, campuriFisier) {
        //console.log(campuriText);
        //console.log(campuriFisier);
        eroare = "";
        

        if (campuriText.username.length="" || !campuriText.username.match("^[A-Za-z0-9]+$")) {
            eroare += "Username gresit. ";
        }
        if (campuriText.email == "" || !campuriText.email.match("^(.+)@(.+)$")) {
            eroare += "Emailul nu este corespunzator. ";
        }
        if (campuriText.parola.length < 3) {
            eroare += "Parola este prea scurta. ";
        }
        if (campuriText.parola != campuriText.rparola) {
            eroare += "Parolele nu se potrivesc. ";
        }
   

        if (campuriText.nume.length < 2) {
            eroare += "Nume prea scurt. ";
        }
        if (campuriText.prenume.length < 2) {
            eroare += "Prenume prea scurt. ";
        }
        if (!campuriText.nume.match("^[A-Za-z]+$")) {
            eroare += "Numele trebuie sa contina doar litere. ";
        }
        if (!campuriText.prenume.match("^[A-Za-z]+$")) {
            eroare += "Prenumele trebuie sa contina doar litere. ";
        }



        client.query(`select * from utilizatori where username = $1::text`, [campuriText.username], function (err, rezQ) {
            client.query(`select * from utilizatori where email = $1::text`, [campuriText.email], function (err, rezQ2) {
                if (rezQ.rows.length != 0) {
                    eroare += "Username-ul exista deja. ";
                    res.render("pages/inregistrare", { err: eroare, raspunsvv: "" });
                }
                else if (rezQ2.rows.length != 0) {
                    eroare += "Emailul-ul este folosit deja. ";
                    res.render("pages/inregistrare", { err: eroare, raspuns: "" });
                }
                else {
                    if (!eroare) {
                        let parolaCriptata = crypto.scryptSync(campuriText.parola, parolaServer, 32).toString('ascii');
                        
                        var oldPath = campuriFisier.poza.path;
                        var newPath = path.join(__dirname, 'resurse/imagini/upload')+ '/'+campuriFisier.poza.name
                        var rawData = fs.readFileSync(oldPath);
                        fs.writeFile(newPath, rawData, function(err){
                            if(err) console.log(err)
                            else console.log("Salvata poza.")
                        })

                        let comanda = `insert into utilizatori (username,nume,prenume,parola,email,culoare_chat,data_adaugare,admin) 
                             values($1::text,$2::text,$3::text,$4::text,$5::text,$6::text,current_timestamp,false)`;
                        console.log(campuriText);
                        console.log(comanda);

                        client.query(comanda, [campuriText.username,campuriText.nume,campuriText.prenume,parolaCriptata,
                                               campuriText.email,campuriText.culoare_chat],
                         function (err, rez) {
                            if (err) {
                                console.log(err);
                                res.render("pages/inregistrare", { err: "Eroare la baza de date! ", raspuns: "Datele nu au fost introduse." });
                            }
                            else {
                                res.render("pages/inregistrare", { err: "", raspuns: "Inregistrat cu succes!" });
                                trimiteMail(campuriText.username, campuriText.email);
                            }
                        })
     
	
	
	//nr ordine: 1
	formular.on("field", function(name,field){
		if(name=='username')
			username=field;
		console.log("camp - field:", name)
	});
	               	//nr ordine: 2
                       formular.on("fileBegin", function(name,campFisier){
                        console.log("inceput upload: ", campFisier);
                        if(campFisier && campFisier.name!=""){
                            //am  fisier transmis
                            var cale=__dirname+"/poze_uploadate/"+username
                            if (!fs.existsSync(cale))
                                fs.mkdirSync(cale);
                            campFisier.path=cale+"/"+campFisier.name;
                            console.log(campFisier.path);
                        }
                    });	

	
	//nr ordine: 3
	formular.on("file", function(name,field){
		console.log("final upload: ", name);
	});
                    }
                    else {
                        res.render("pages/inregistrare", { err: eroare, raspuns: "" });
                    }
                    console.log(eroare);
                }
            });
            
        });


    })
    

});






app.post("/login",function(req,res){
    var formular = formidable.IncomingForm();
    formular.parse(req,function(err,campuriText){
        let parolaCriptata= crypto.scryptSync(campuriText.parola,parolaServer,32).toString('ascii');
        let comanda = `select * from utilizatori where username= '${campuriText.username}' and parola= '${parolaCriptata}'`;
        client.query(comanda,function(err,rez){
            console.log(err);
            if (rez.rows.length==1){
                req.session.utilizator={
                    admin:rez.rows[0].admin,
                    username:rez.rows[0].username,
                    culoare_chat:rez.rows[0].culoare_chat,
                    email:rez.rows[0].email,
                }
                console.log("aici")
                console.log(req.session.utilizator)

            }
            
            res.redirect("/index");
            console.log(rez)
        })





    })





})

app.get('/useri', function(req, res){
	
	if(req.session && req.session.utilizator && req.session.utilizator.admin==true){
        client.query("select * from utilizatori",function(err, rezultat){
            if(err) throw err;
            console.log(rezultat);
            res.render('pages/useri',{useri:rezultat.rows, utilizator:req.session.utilizator});//afisez index-ul in acest caz
        });
	} else{
		res.status(403).render('pages/403',{mesaj:"Nu aveti acces", utilizator:req.session.utilizator});
	}

});

app.post("/sterge_utiliz",function(req, res){
	if(req.session && req.session.utilizator && req.session.utilizator.admin==true){
	var formular= formidable.IncomingForm()
	
	formular.parse(req, function(err, campuriText, campuriFisier){
		var comanda=`delete from utilizatori where id='${campuriText.id_utiliz}'`;
		client.query(comanda, function(err, rez){
			// TO DO mesaj cu stergerea
		});
	});
	}
	res.redirect("/useri");
	
});



app.get("/data", function(req,res){
    res.setHeader("Content-Type","text/html")
    res.write("<!DOCTYPE html><html><head><title>Mno</title></head><body>"+new Date());
    res.write("</body></html>");
    res.end();


})

app.get("/produse",function(req,res){
    console.log(req.url);
    console.log(req.query.tip_merch);
    var conditie=req.query.tip_merch ? " where tip_merch='"+req.query.tip_merch + "'":""; 
    
    client.query(
        "SELECT * from produse"+conditie,function(err,rez){
            client.query("select unnest(enum_range( null::tipuri_merch)) as tip", function(err,rezTip){
                console.log(rezTip);
            res.render("pages/produse",{produse:rez.rows,tipuri:rezTip.rows});
        });
        
       
    });
});


app.get("/produs/:id_produs",function(req,res){
    client.query(
        "SELECT * from produse where id="+req.params.id_produs,function(err,rez){
            
            
            res.render("pages/produs",{produse:rez.rows[0]})
    
        });

        
    
});




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


