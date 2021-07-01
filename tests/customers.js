const { expect } = require("chai");
const request = require("supertest");
const app = require("../index");
let chai = require("chai");

let should = chai.should();

let testingId;

//Testing customer endpoints

var isValidCustomer = function (res) {
    res.status.should.be.equal(200);
    res.body.should.have.property("name");
    res.body.should.have.property("surname");
    res.body.should.have.property("createdBy");
};
var isValidCustomers = function (res) {
    res.status.should.be.equal(200);
    res.body[0].should.have.property("name");
    res.body[0].should.have.property("surname");
    res.body[0].should.have.property("createdBy");
};

const exampleUser = {
    name: "example",
    surname: "customer",
};
describe("/post /customers", () => {
    it("unauthorized customer", (done) => {
        request(app)
            .post("/customers/")
            .expect("Content-Type", /html/)
            .expect(401, done);
    });

    it("respond with invalid customer (number)", (done) => {
        request(app)
            .post("/customers")
            .set("auth-token", process.env.TEST_TOKEN)
            .send({
                name: "example1",
                surname: "customer",
            })
            .expect("Content-Type", /html/)
            .end((err, res) => {
                if (err) throw err;
                res.status.should.be.equal(400);
                done();
            });
    });

    it("respond with invalid customer (missing required field)", (done) => {
        request(app)
            .post("/customers")
            .set("auth-token", process.env.TEST_TOKEN)
            .send({
                name: "example",
            })
            .expect("Content-Type", /html/)
            .end((err, res) => {
                if (err) throw err;
                res.status.should.be.equal(400);
                done();
            });
    });

    it("respond with created customer", (done) => {
        request(app)
            .post("/customers/")
            .set("auth-token", process.env.TEST_TOKEN)
            .send(exampleUser)
            .expect("Content-Type", /json/)
            .end((err, res) => {
                if (err) throw err;
                isValidCustomer(res);
                testingId = res.body._id;
                done();
            });
    });
});
describe("/get /customers", () => {
    it("unauthorized customer", (done) => {
        request(app)
            .get("/customers")
            //.set("auth-token", process.env.TEST_TOKEN)
            .expect("Content-Type", /html/)
            .expect(401, done);
    });
    it("respond with a list of all customers", (done) => {
        request(app)
            .get("/customers")
            .set("auth-token", process.env.TEST_TOKEN)
            .expect("Content-Type", /json/)
            .end((err, res) => {
                if (err) throw err;
                isValidCustomers(res);
                done();
            });
    });
});

describe("/get /customers/:id", () => {
    it("unauthorized customer", (done) => {
        request(app)
            .get("/customers/" + testingId)
            //.set("auth-token", process.env.TEST_TOKEN)
            .expect("Content-Type", /html/)
            .expect(401, done);
    });
    it("respond with a non existant customer", (done) => {
        request(app)
            .get("/customers/60dba7a66ea10b54d4c89ef2")
            .set("auth-token", process.env.TEST_TOKEN)
            .expect("Content-Type", /html/)
            .expect(404, done);
    });

    it("respond with a customer", (done) => {
        request(app)
            .get("/customers/" + testingId)
            .set("auth-token", process.env.TEST_TOKEN)
            .expect("Content-Type", /json/)
            .end((err, res) => {
                if (err) throw err;
                isValidCustomer(res);
                done();
            });
    });
});

describe("/patch /customers", () => {
    it("unauthorized customer", (done) => {
        request(app)
            .patch("/customers/" + testingId)
            .send(exampleUser)
            .expect("Content-Type", /html/)
            .expect(401, done);
    });

    it("respond with a non existant customer", (done) => {
        request(app)
            .patch("/customers/60dba7a66ea10b54d4c89ef2")
            .set("auth-token", process.env.TEST_TOKEN)
            .send(exampleUser)
            .expect("Content-Type", /html/)
            .expect(404, done);
    });
    it("respond with invalid customer (number in name)", (done) => {
        request(app)
            .patch("/customers/" + testingId)
            .set("auth-token", process.env.TEST_TOKEN)
            .send({
                name: "example1",
                surname: "customer",
            })
            .expect("Content-Type", /html/)
            .end((err, res) => {
                if (err) throw err;
                res.status.should.be.equal(400);
                done();
            });
    });

    it("respond with edited customer", (done) => {
        request(app)
            .patch("/customers/" + testingId)
            .set("auth-token", process.env.TEST_TOKEN)
            .send(exampleUser)
            .expect("Content-Type", /json/)
            .end((err, res) => {
                if (err) throw err;
                isValidCustomer(res);
                done();
            });
    });
});

describe("/delete /customers", () => {
    it("unauthorized customer", (done) => {
        request(app)
            .delete("/customers/" + testingId)
            .expect("Content-Type", /html/)
            .expect(401, done);
    });

    it("respond with a non existant customer", (done) => {
        request(app)
            .delete("/customers/60dba7a66ea10b54d4c89ef2")
            .set("auth-token", process.env.TEST_TOKEN)
            .expect("Content-Type", /html/)
            .expect(404, done);
    });

    it("respond with deleted customer", (done) => {
        request(app)
            .delete("/customers/" + testingId)
            .set("auth-token", process.env.TEST_TOKEN)
            .expect("Content-Type", /json/)
            .end((err, res) => {
                if (err) throw err;
                isValidCustomer(res);
                done();
            });
    });
});
