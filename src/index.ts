import express, { Request, Response, NextFunction } from 'express';
import { MongoClient } from "mongodb";
//To access from terminal: curl http://localhost:6969/
const app = express();

type MONGOcharacter = {
    id: string,
    name: string,
    species: string,
    status: string,
    episode: string[],
}

const charactersDB = async (): Promise<MONGOcharacter[] | void> => {
    const uri = "mongodb+srv://Picard:engage@mongomake.3ta2r.mongodb.net/MongoMake?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    const lista = client.connect().then(() => {
        client.db("Vicio").collection("RickMorty").find().toArray().then((elem) => {
            return elem as MONGOcharacter[];
        })
    })
    return lista;
}



app.get('/status', (request: Request, response: Response) => {
    response.status(200).send("Patrick Swayze says that She's like the Wind\n\r");
});

/*const getCharacterdb = async (request: Request, response: Response, next: NextFunction) => {
    let characters: MONGOcharacter[] | void = await charactersDB();
    console.log(characters[0]);
}*/

const getCharacters = (request: Request, response: Response, next: NextFunction) => {
    const uri = "mongodb+srv://Picard:engage@mongomake.3ta2r.mongodb.net/MongoMake?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    const lista = client.connect().then(() => {
        client.db("Vicio").collection("RickMorty").find().toArray().then((elem) => {
            let characters: MONGOcharacter[] = elem as MONGOcharacter[];
            response.status(200).json(characters);
        })
    })
};

app.get('/characters', getCharacters);

const getCharacter = (request: Request, response: Response, next: NextFunction) => {
    let ID: string = request.params.id;
    const uri = "mongodb+srv://Picard:engage@mongomake.3ta2r.mongodb.net/MongoMake?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    const lista = client.connect().then(() => {
        client.db("Vicio").collection("RickMorty").find().toArray().then((elem) => {
            let characters: MONGOcharacter[] = elem as MONGOcharacter[];
            let character:MONGOcharacter|undefined = characters.find(elem => elem.id == ID);
            if(character == undefined) {response.status(404).send("Laura no està, el personaje tampoco\n\r");}else{
                response.status(200).json(character);
            }
            
        })
    })
};

app.get('/character/:id', getCharacter);

const UpdateCharacterStatus = (request: Request, response: Response, next: NextFunction) => {
    let ID: string = request.params.id;
    const uri = "mongodb+srv://Picard:engage@mongomake.3ta2r.mongodb.net/MongoMake?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    const lista = client.connect().then(() => {
        client.db("Vicio").collection("RickMorty").find().toArray().then((elem) => {
            let characters: MONGOcharacter[] = elem as MONGOcharacter[];
            let character:MONGOcharacter|undefined = characters.find(elem => elem.id == ID);
            if(character == undefined) {response.status(404).send("Laura no està, el personaje tampoco\n\r");}else{
                let TOstatus = character.status;
                const IDn:number = +ID;
                if(TOstatus == "Alive"){
                    client.db("Vicio").collection("RickMorty").findOneAndUpdate({id:IDn},{$set:{status:"Dead"}}).then((elem)=>{
                        response.status(200).json(elem.value);
                    })
                    
                }else if(TOstatus == "Dead"){
                    client.db("Vicio").collection("RickMorty").findOneAndUpdate({id:IDn},{$set:{status:"Alive"}}).then((elem)=>{
                        response.status(200).json(elem.value);
                    })
                };
                
            }
            
        })
    })
};

app.get('/switchstatus/:id', UpdateCharacterStatus);

const DeleteCharacter = (request: Request, response: Response, next: NextFunction) => {
    let ID: string = request.params.id;
    const uri = "mongodb+srv://Picard:engage@mongomake.3ta2r.mongodb.net/MongoMake?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    const lista = client.connect().then(() => {
        client.db("Vicio").collection("RickMorty").find().toArray().then((elem) => {
            let characters: MONGOcharacter[] = elem as MONGOcharacter[];
            let character:MONGOcharacter|undefined = characters.find(elem => elem.id == ID);
            if(character == undefined) {response.status(404).send("Laura no està, el personaje tampoco\n\r");}else{
                let TOstatus = character.status;
                const IDn:number = +ID;
                client.db("Vicio").collection("RickMorty").deleteOne({id:IDn}).then((elem)=>{
                    response.status(200).send(`Delete character with id:${IDn}`);
                })
                
            }
            
        })
    })
};

app.get('/deleteCharacter/:id', DeleteCharacter);

const port = process.env.PORT || 6969;

app.listen(port, () => {
    console.log(`Express working on port ${port}\n\r`)
});