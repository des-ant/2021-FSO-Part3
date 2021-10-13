const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Use Express middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Create new token to log data in HTTP POST request
morgan.token('body', (request, response) => JSON.stringify(request.body));

// Use Morgan middleware to log messages to console
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// Use Cors middleware to allow requests from all origins
app.use(cors());


let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

const generateId = () => {
  return Math.round(Math.random() * 10000);
};

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    });
  }
  
  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    });
  }

  const personWithSameName = persons.find(person => person.name === body.name);

  if (personWithSameName) {
    return response.status(400).json({
      error: 'name must be unique'
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
});

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});