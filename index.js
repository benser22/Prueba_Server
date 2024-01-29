const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;
const cors = require("cors");

app.use(cors()); 

let items = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
];

app.use(bodyParser.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error interno del servidor");
});

// Obtener todos los elementos
app.get("/api/items", (req, res) => {
  res.json(items);
});

// Agregar un elemento nuevo
app.post("/api/items", (req, res) => {
  const newItem = req.body;
  //busco el último id para asignar uno nuevo al elemento que agrego
  const lastItemId = items.length > 0 ? items[items.length - 1].id : 0;
  newItem.id = lastItemId + 1;
  items.push(newItem);
  res.json(newItem);
});

// Actualizar un elemento existente
app.put("/api/items/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const updatedItem = req.body;
  items = items.map((item) =>
    item.id === itemId ? { ...item, ...updatedItem } : item
  );
  res.json(updatedItem);
});

// Eliminar un elemento
app.delete("/api/items/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const itemToRemove = items.find((item) => item.id === itemId);
  if (!itemToRemove) {
    return res.status(404).json({ message: "Elemento no encontrado" });
  }
  items = items.filter((item) => item.id !== itemId);
  res.json({ message: "Item eliminado" });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
