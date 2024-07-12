const mongoose = require("mongoose");

const connectString = "mongodb://root:rootMongo@127.0.0.1:1000";
class Database {
  constructor() {
    this.connect();
  }
  connect() {
    mongoose
      .connect(connectString, {
        dbName: "futa",
      })
      .then((_) => {
        console.log("Connected to MongoDB");
      })
      .catch((error) => {
        console.log(`${error}`);
        setTimeout(() => {
          console.log("Reconnect to MongoDB");
          this.connect();
        }, 30000); //
      });
  }
  //
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instance = Database.getInstance();

mongoose.set("toJSON", { getters: true });

module.exports = instance;
