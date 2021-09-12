const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./connectToDB");
const Product = require("./models/ProductModel");
const Sale = require("./models/SalesModel");
const bodyParser = require("body-parser");
var path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "/frontend/build")));
app.use(cors({ credentials: true, origin: "*" }));
app.use(bodyParser.json());

dotenv.config();
connectDB();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
});

app.get("/api/products", async (req, res) => {
  const products = await Product.find({});

  console.log(products);
  res.status(200).send(products);
});

app.get("/api/stats", async (req, res) => {
  const allSales = await Sale.find({});
  const products = await Product.find({});

  let top5sold = {};
  let uniquieSales = {};
  let sumByDate = {};

  allSales.forEach((sale) => {
    let date = sale.createdAt.toISOString().split("T")[0];
    if (!(date in sumByDate)) {
      sumByDate[`${date}`] = [];
      sale.products.forEach((item) => sumByDate[`${date}`].push(item));
    } else {
      sale.products.forEach((item) => sumByDate[`${date}`].push(item));
    }

    sale.products.forEach((item) => {
      if (item.amount > 1) {
        uniquieSales[`${item.product_id}`] = +item.amount;
      }

      if (!(item.product_id in top5sold)) {
        top5sold[`${item.product_id}`] = +item.amount;
      } else {
        top5sold[item.product_id] += +item.amount;
      }
    });
  });

  const getTop5 = (objType) => {
    let objTypeArr = Object.entries(objType).sort((a, b) => a[1] - b[1]);
    let result = objTypeArr
      .slice(-5)
      .map((item) => {
        let product = products.find(
          (product) => product._id.toString() === item[0]
        );
        return {
          [product ? product.name : `${item[0]} ,(deleted product) `]: item[1],
        };
      })
      .reverse();

    return result;
  };

  // top 5 sold

  // let x = Object.entries(top5sold).sort((a, b) => a[1] - b[1]);
  let y = getTop5(top5sold);

  //unique sales

  // let q = Object.entries(uniquieSales).sort((a, b) => a[1] - b[1]);
  let z = getTop5(uniquieSales);

  res.status(200).send({ top5sold: y, unique: z, sumByDate });
});

app.post("/api/payment", async (req, res) => {
  const cartItems = req.body;
  console.log("cartItems : ", cartItems);
  filteredCartItems = cartItems.map((item) => {
    return {
      product_id: item._id,
      amount: item.amount,
      price: item.price,
    };
  });
  const sale = await Sale.create({ products: filteredCartItems });
  sale.save();
  res.status(200).send("payment passed succsessfully");
});

app.delete("/api/delete_product/:id", async (req, res) => {
  await Product.findOneAndDelete({ _id: req.params.id });
  const products = await Product.find({});
  res.status(200).send(products);
});

app.put("/api/update_product", async (req, res) => {
  console.log(req.body);
  const updatedProduct = await Product.findOneAndUpdate(
    { _id: req.body._id },
    { ...req.body }
  );
  updatedProduct.save();
  const products = await Product.find({});

  res.send(products);
});

app.post("/add_product", async (req, res) => {
  console.log(req.body);
  const newProduct = await Product.create(req.body);
  newProduct.save();
  const products = await Product.find({});

  res.send(products);
});

const port = 3333;
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
