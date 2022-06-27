//const { urlencoded } = require('body-parser');
//const Joi = require('joi');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

//app.use(urlencoded({extended:false}));
const app = express();
const secret = "borize";
app.use(express.json());

//Here is a middleware for checking if user is authorized to access a particular data on our data base 
const authChecker = (req,res,next)  => {
    const userAuthHeader = req.headers['authorization']
    console.log(userAuthHeader)
    if(!userAuthHeader){res.status(403).send('access denied')}

const splitToken = userAuthHeader.split(' ')
if(Array.isArray(splitToken) && splitToken.length < 2){
    res.status(403).send('Invalid authorization')
}
const mainToken = jwt.verify(splitToken[1], secret)
console.log(mainToken)
if(mainToken) {
    next()
} else{
    res.status(403).send('Access Denied')
}
}

// Data base for time delivery service
 const parcels = [
     {id : 1 , Item: 'Male shoe', Destination: 'Bodija'},
     { id: 2, Item: 'Human hair', Destination: 'Oluyole'},
     { id: 3, Item: 'Phone', Destination: 'Akobo'},
]
 
const usersData = [

]

app.post('/signin', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const codedPass = await bcrypt.hash(password, 10);
    const data = {
        id: 1,
        email: "olajideboris@gmail.com",
        password: codedPass,
        firstName: "Olajide",
        lastName: "Borisade"
}
    usersData.push(data)
    res.json(usersData)
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(!(email&&password)) {res.send("email/password required")};
const userIndex = usersData.findIndex(user => user.email === email);
if(userIndex === -1){
    res.send("user not registered")}

const user = usersData[userIndex]
if (await bcrypt.compare(password, user.password)) {
const token = jwt.sign({user_id: user.id, email: user.email},  secret, {expiresIn: '2h'})
    res.json(token)
}
else{
    res.send("password missmatch")
}
});

app.get('/secureRoute', authChecker, async (req, res) => {
    res.status(200).json(mainToken)
});

app.get('/parcels', (req,res) => { 
     res.send(parcels)
 });

 app.post('/parcels', (req, res) => {
     const parcel = {
             id : parcels.length + 1 ,
             Item : req.body.Item,
             Destination: req.body.Destination
     };
      parcels.push(parcel);
     res.json(parcel);
     console.log("Delivery parcels : ", parcels);
 });

//app.put('/parcels', (req, res) => {
 app.put('/parcels/:id', (req, res) => {
     console.log(req.body.id);
     const parcel = parcels.find(p => p.id === parseInt(req.params.id));
     if (!parcel) res.status(404).send('parcel with the given id does not exist')
     //const parcel = parcels.findIndex(p => p.id === req.body.id);
//     //parcels.splice(parcel, 1, req.body);
 parcel.Item = req.body.Item;
     res.json(parcels)
 });

 // change parcel destination
 app.put('/parl_destn/:id', (req, res) => {
     console.log(req.body.id);
     const parcel = parcels.find(p => p.id === parseInt(req.params.id));
     if (!parcel) res.status(404).send('parcel with the given id does not exist')
    // const parcel = parcels.findIndex(p => p.id === req.body.id);
    //parcels.splice(parcel, 1, req.body);
     parcel.Destination = req.body.Destination;
     res.json(parcels)
});

 app.get('/parcels/:id', (req, res) => { 
     const parcel = parcels.find(p => p.id === parseInt(req.params.id));
     if (!parcel) res.status(404).send('parcel with the given id does not exist')
         res.send(parcel)
 });

 app.delete('/parcels/:id', (req, res) => {
     const parcel = parcels.find(p => p.id === parseInt(req.params.id));
     if (!parcel) res.status(404).send('parcel with the given id does not exist')
     const index = parcels.indexOf(parcel);
     parcels.splice(index, 1);
     res.send(parcels);
     console.log(parcel);
 });


const port = process.env.PORT || 3000;
app.listen(port, () =>
    console.log('listening on port ${port}..')
    );
