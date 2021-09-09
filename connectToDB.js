const mongoose = require("mongoose");
//skuNayS72waguaCJ password DB
const connectDB = async () => {
  try {
    const connection = mongoose.connect(
      `mongodb+srv://arkady656:skuNayS72waguaCJ@cluster0.aorff.mongodb.net/whist?retryWrites=true&w=majority`,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
    console.log(`mongoDB connected`);
  } catch (error) {
    console.error(`error : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
