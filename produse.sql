
DROP TYPE IF EXISTS colectii_merch;
DROP TYPE IF EXISTS tipuri_merch;


CREATE TYPE colectii_merch AS ENUM( 'animalele_salbatice', 'animalele_domestice', 'ecofriendly','bohemian', 'daybyday', 'sf','safari');
CREATE TYPE tipuri_merch AS ENUM('haine', 'jucarii', 'diverse','carti');



CREATE TABLE IF NOT EXISTS produse (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL, 
   tip_merch tipuri_merch DEFAULT 'haine',
   colectie colectii_merch DEFAULT 'animalele_salbatice',
   material VARCHAR(50),
   dimensiune_marime NUMERIC(8,2) [] NOT NULL,
   culoare VARCHAR(40),
   livrare_posta BOOLEAN NOT NULL DEFAULT FALSE,
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);



INSERT into produse (nume,descriere,pret, tip_merch, colectie, material, dimensiune_marime, culoare, livrare_posta, imagine) VALUES 
('Savarină', 'Prăjitură insiropată, cu frișcă', 49.99 ,'haine','sf', 'bumbac', '{41,42,43}','roz' ,False, 'aproximativ-savarina.jpg'),
('Tricou', 'Prăjitură insiropată, cu frișcă', 49.99 ,'jucarii','sf', 'bumbac', '{41,42,43}','roz' ,False, 'bomboane-ciocolata-bat.jpg'),
('mno', 'Prăjitură insiropată, cu frișcă', 49.99 ,'diverse','sf', 'bumbac', '{41,42,43}','roz' ,False, 'bomboane-colorate.jpg');


select * from produse;