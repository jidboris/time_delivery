
const express = require("express");
const app = express();
const port = 3300

app.use(express.json())

const contacts = [
    { id: 1, name: 'Tola' },
    { id: 2, name: 'Bolu' },
    { id: 3, name: 'Damola'},
];
app
    //.route('/404')
    .get('/404', (req, res) => { res.send('This is for Error'); });

app.get('/about', (req, res) => { res.send('What is this about'); });
    //.route('/about')
    
app.post('/contacts', (req, res) => {
    
const contacts = { 
    id : contacts.length + 1,
    name : req.body.name
};
contacts.push(contact);
res.send(contact);
})
app.get('/contacts', (req, res) => {res.send(contact); });
app.get('/contacts/:id', (req, res) => {var contact = contacts.find(c => c.id === parseInt(req.params.id)); 
    if (!contact) res.status(404).send('The contact with the given id was not found')
    res.send(contact)
});

//.route('/contact-me')
    

app.use(express.static(__dirname))
app.get('/', (req, res) => res.sendFile(__dirname, "/index.html"))


   // if (err) { return ("/404.html") }});
app.listen(process.env.PORT || port, () => console.log('listening on port ${port}'));