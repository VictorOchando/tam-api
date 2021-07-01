const { expect } = require("chai");
const request = require("supertest");
const app = require("../index");
let chai = require("chai");

let should = chai.should();

const user = require("../models/users");
const customer = require("../models/customers");

//CLEAR DB FOR TESTS
async function deleteDB() {
    await user.deleteMany();
    await customer.deleteMany();
}
deleteDB();

var isValidUser = function (res) {
    res.status.should.be.equal(200);
    res.body.should.have.property("name");
    res.body.should.have.property("surname");
    res.body.should.have.property("email");
    res.body.should.have.property("role");
};

const exampleUser = {
    name: "example",
    surname: "user",
    email: "aaa@gmail.com",
    password: "1234",
    role: "user",
    registerPassword: process.env.REGISTER_PASSWORD,
};

describe("/post /register", () => {
    it("respond with invalid user (number)", (done) => {
        request(app)
            .post("/register")
            .send({
                name: "example1",
                surname: "user",
                email: "aa2222@gmail.com",
                role: "admin",
                registerPassword: process.env.REGISTER_PASSWORD,
            })
            .expect("Content-Type", /json/)
            .end((err, res) => {
                if (err) throw err;
                res.status.should.be.equal(400);
                done();
            });
    });

    it("respond with invalid user (missing required field)", (done) => {
        request(app)
            .post("/register")
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

    it("respond with invalid registerPassword", (done) => {
        request(app)
            .post("/register")
            .send({
                name: "example1",
                surname: "user",
                email: "aa2222@gmail.com",
                role: "admin",
                registerPassword: "wrongPassword",
            })
            .expect("Content-Type", /html/)
            .end((err, res) => {
                if (err) throw err;
                res.status.should.be.equal(400);
                done();
            });
    });

    it("respond with created user", (done) => {
        request(app)
            .post("/register")
            .send(exampleUser)
            .expect("Content-Type", /json/)
            .end((err, res) => {
                if (err) throw err;
                isValidUser(res);
                done();
            });
    });
});

// describe("/post /login", () => {
//     it("respond with incorrect email/username", (done) => {
//         request(app)
//             .post("/login")
//             .send({
//                 email: "aaa4567@gmail.com",
//                 password: "12",
//             })
//             .expect("Content-Type", /html/)
//             .end((err, res) => {
//                 if (err) throw err;
//                 res.status.should.be.equal(400);
//                 done();
//             });
//     });

//     it("respond with token after succesful login", (done) => {
//         request(app)
//             .post("/login")
//             .send({
//                 email: "aaa@gmail.com",
//                 password: "1234",
//             })
//             .expect("Content-Type", /json/)
//             .end((err, res) => {
//                 if (err) throw err;
//                 res.status.should.be.equal(200);
//                 done();
//             });
//     });
// });
