process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require('../app');
const shoppingList = require('../fakeDB')


let apples = {itemName: "apples", price: 1.99}; // this is what each of the tests will start out with

// this will run before each test
beforeEach(function(){
    shoppingList.push(apples)
})


// this will run afer each test
afterEach(function(){
    // setting length to equal 0 is better because if we set it to an empty array it is actually redefining the variable with a new array
    shoppingList.length = 0;
})


describe("GET /shoppingList", () =>{
    test("get all items in shoppingList", async() =>{
        const res = await request(app).get("/shoppingList");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({shoppingList : [apples]})
    })
})


describe("POST /shoppingList", () => {
    test("add new item to shoppingList", async() => {
        const res = await request(app).post("/shoppingList").send({ itemName: "mangos", price: 1.99});
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({item: { itemName: "mangos", price: 1.99} })
    })
})


describe("GET /shoppingList/:itemName", () => {
    test("get item information by name", async() => {
        const res = await request(app).get(`/shoppingList/${apples.itemName}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ item: {itemName: "apples", price: 1.99} })
    })
})


describe("PATCH /shoppingList/:itemName", () => {
    test("update an item's information", async() => {
        const res = await request(app).patch(`/shoppingList/${apples.itemName}`).send({ itemName: "avocado", price: 2.99})
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ updated: { itemName: "avocado", price: 2.99} })
    })
    test("Responds with 404 for deleting item that does not exist", async() => {
        const res = await request(app).patch("/shoppingList/mangos").send({ itemName: "avocado", price: 2.99})
        expect(res.statusCode).toBe(400)
    })
})


describe("DELETE /shoppingList/:itemName", () => {
    test("delete an item on the shoppingList", async() => {
        const res = await request(app).delete(`/shoppingList/${apples.itemName}`)
        // expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ message: "Deleted"})
    })
})