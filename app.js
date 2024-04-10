const express = require("express"); //de facto node framework
const hbs = require("hbs"); //templating engine
const app = express(); //use express

const { MongoClient, ObjectId } = require("mongodb");

// Replace with your MongoDB connection string
const uri = 'mongodb+srv://admin:Assassin2@notesapp.wveaujr.mongodb.net/';

const client = new MongoClient(uri);

app.set("viewEngine", "hbs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); //receiving simple form variables

//starts a server
app.listen(3000, function () {
  console.log("listening on port 3000");
});

//Route incoming urls to functionality
//req and res stand for request and response
app.get("/", (req, res) => {
  async function showNotes() {
    try {
      await client.connect();

      const db = client.db("Codeo");
      const notes = db.collection("Gamepage");

      return await notes.find({}).toArray();
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }

  showNotes()
    .then((result) => {
      res.render("index.hbs", { Gamepage: result });
    })
    .catch((err) => {
      console.log(err);
      res.render("database.hbs");
    });
});

app.get("/add", (req, res) => {
  res.render("add.hbs"); //by default, hbs views are placed in a "views" folder
});

app.post("/notes", (req, res) => {
  console.log(`post to notes: ${req.body.Choice} and ${req.body.Answer}`); //template literal with req.body parameters

  //save to MongoDB Database
  async function insertNote() {
    try {
      await client.connect();

      const db = client.db("Codeo");
      const notes = db.collection("Gamepage");

      const result = await notes.insertOne({
        Question: req.body.Question,
        Choice1: req.body.Choice1,
        Choice2: req.body.Choice2,
        Choice3: req.body.Choice3,
        Answer: req.body.Answer,
      });
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }

  insertNote()
    .then(() => {
      res.render("added.hbs", {
        Question: req.body.Question,
        Choice1: req.body.Choice1,
        Choice2: req.body.Choice2,
        Choice3: req.body.Choice3,
      });
    })
    .catch((err) => {
      res.render("database.hbs");
    });
});

app.get("/note/edit/:id", (req, res) => {
  async function findNote() {
    try {
      await client.connect();

      const db = client.db("Codeo");
      const notes = db.collection("Gamepage");

      return await notes.findOne({ _id: new ObjectId(req.params.id) });
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }

  findNote()
    .then((result) => {
      console.log(result);
      res.render("edit.hbs", result);
    })
    .catch((err) => {
      console.log(err);
      res.render("database.hbs");
    });
});

app.post("/note/confirm-update", (req, res) => {
  async function updateNote() {
    try {
      await client.connect();

      const db = client.db("Codeo");
      const notes = db.collection("Gamepage");
      console.log(req.params.id);

      return await notes.updateOne(
        { _id: new ObjectId(req.body.id) },
        {
          $set: {
            Question: req.body.Question,
            Choice1: req.body.Choice1,
            Choice2: req.body.Choice2,
            Choice3: req.body.Choice3,
          },
        }
      );
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }

  updateNote()
    .then((result) => {
      console.log(result);
      res.render("updated.hbs");
    })
    .catch((err) => {
      console.log(err);
      res.render("database.hbs");
    });
});

app.get("/note/delete/:id", (req, res) => {
  async function deleteNote() {
    try {
      await client.connect();

      const db = client.db("Codeo");
      const notes = db.collection("Gamepage");
      console.log(req.params.id);

      return await notes.deleteOne({ _id: new ObjectId(req.params.id) });
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }

  deleteNote()
    .then((result) => {
      console.log(result);
      res.render("deleted.hbs");
    })
    .catch((err) => {
      console.log(err);
      res.render("database.hbs");
    });
});

app.get("/hello/:firstName", (req, res) => {
  res.render("hello.hbs", { firstName: req.params.firstName }); //by default, hbs views are placed in a "views" folder
});
