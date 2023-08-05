const mongoose = require("mongoose");
const mongoURI =
  "mongodb://foodExpress:Satyam123@ac-z6u5csa-shard-00-00.cmvvd4f.mongodb.net:27017,ac-z6u5csa-shard-00-01.cmvvd4f.mongodb.net:27017,ac-z6u5csa-shard-00-02.cmvvd4f.mongodb.net:27017/foodExpress?ssl=true&replicaSet=atlas-lsvrwm-shard-0&authSource=admin&retryWrites=true&w=majority";
const mongodb = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("database is connected!");
    const fetched_data = await mongoose.connection.db.collection("food_items");
    const data = await fetched_data.find({}).toArray();

    const foodCategory = await mongoose.connection.db.collection(
      "foodCategory"
    );
    const catData = await foodCategory.find({}).toArray();
    global.food_items = data;
    global.foodCategory = catData;
    // By declaring a global variable,Now This global.food_items will be access  or updates in all files directly
    // console.log(global.food_items);
  } catch (err) {
    console.log(err);
  }
};
module.exports = mongodb();
