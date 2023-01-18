const express = require("express");
const { nextTick } = require("process");
const router = new express.Router();
const ExpressError = require('../expressError');
const shoppingList = require('../fakeDB');

/*
This should render a list of shopping items.
Here is what a response looks like:
[{“name”: “popsicle”, “price”: 1.45}, {“name”:”cheerios”, “price”: 3.40}] 
*/
router.get('/', function (req, res) {
    res.json( { shoppingList });
    
})


// add a new item to the shopping list

router.post('/', function (req, res, next) {
    try{
        if(!req.body.itemName) {
            throw new ExpressError("Name of item is required", 400)
        } 
        const newItem = {itemName: req.body.itemName, price: req.body.price};
        shoppingList.push(newItem);
        return res.status(201).json({ item: newItem});
    }   catch(e) {
            return next(e)
        }
})


// get an item from the shopping list by name

router.get('/:itemName', function(req,res, next) {
    try{
        const itemInList = shoppingList.find(item => item.itemName === req.params.itemName); // Note: params is for parameter in the URL
        if(!itemInList) {
            throw new ExpressError("Item does not exist in the shopping list", 400)
        } 
        res.json({ item: itemInList });
    }   catch(e) {
            return next(e)
        }
})


// patch request to update an item's information

router.patch('/:itemName', (req,res, next) =>{
    try {
        let itemInList = shoppingList.find(item => item.itemName === req.params.itemName);
        if(!itemInList) {
            throw new ExpressError("The item you are trying to update does not exist", 400)
        } 
        itemInList.itemName = req.body.itemName;
        itemInList.price = req.body.price;
        res.json({updated: itemInList});
    }   catch(e){
            return next(e)
        }
    
})


// Delete request to delete an item on the shopping list

router.delete('/:itemName', (req, res, next) => {
    try{
        let itemIndex = shoppingList.findIndex(item => item.itemName === req.params.itemName);
        if(itemIndex === -1) {
            throw new ExpressError("The item you are trying to delete does not exist", 400)
        } 
        shoppingList.splice(itemIndex,1)
        res.json({ message: "Deleted"})
    }   catch(e) {
            return next(e)
        }
  
})


module.exports = router; // need this so that it can connect to app.js