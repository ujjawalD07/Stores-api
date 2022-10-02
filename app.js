const express = require("express")
const mongoose = require("mongoose")
const bodyparser = require("body-parser")
const app = express();
app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/storesDB');

const itemSchema = {
    product: String,
    category: String,
    price: Number
}

const Store = mongoose.model("Store", itemSchema);


// const item1 = new Store({
//     product : "Television",
//     category : "Electronics",
//     price : 20000
// })
// item1.save();

app.route("/items")

.get(function (req, res) {
    Store.find(function (err, founditems) {
        res.send(founditems)
    })
})

.post(function(req,res){
    const item= new Store({
        product:req.body.product,
        category:req.body.category,
        price:req.body.price
    })

    item.save();
})

.delete(function(req,res){
    Store.deleteMany(function(err){
        if(!err)
            res.send("Deleted")
        else
            res.send(err)
    });
});

                        ///Requests targetting a specific item///

app.route("/items/:itemname")

.get(function(req,res){
    Store.findOne({product:req.params.itemname},function(err,foundItem){
        if(foundItem)
            res.send(foundItem)
        else
            res.send("No item found")
    })
})

.put(function(req,res){
    Store.updateMany(
        {product:req.params.itemname},
        {product:req.body.product,category:req.body.category,price:req.body.price},
        {isDeleted:true},

        function(err){
            if(!err)
                res.send("Updated")
        }
    );
})

.delete(function(req,res){
    Store.deleteOne(
        {product:req.params.itemname},
        function(err){
            if(!err)
                res.send("Deleted")
        }
    );
});

app.listen(5000, () => {
    console.log("server started at port 5000");
})