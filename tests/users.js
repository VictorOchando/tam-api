const { expect } = require("chai");
const request = require("supertest");
const app = require("../index");
let chai = require("chai");

let should = chai.should();

let testingId;

//Testing user endpoints

var isValidUser = function (res) {
    res.status.should.be.equal(200);
    res.body.should.have.property("name");
    res.body.should.have.property("surname");
    res.body.should.have.property("email");
    res.body.should.have.property("role");
};
var isValidUsers = function (res) {
    res.status.should.be.equal(200);
    res.body[0].should.have.property("name");
    res.body[0].should.have.property("surname");
    res.body[0].should.have.property("email");
    res.body[0].should.have.property("role");
};

const exampleUser = {
    name: "example",
    surname: "user",
    email: "aaa5@gmail.com",
    password: "1234",
    role: "user",
};
describe("/post /users", () => {
    it("respond with user not logged in", (done) => {
        request(app)
            .post("/users/")
            .expect("Content-Type", /html/)
            .expect(401, done);
    });

    it("respond with invalid user (number)", (done) => {
        request(app)
            .post("/users")
            .set("auth-token", process.env.TEST_TOKEN)
            .send({
                name: "example1",
                surname: "user",
            })
            .expect("Content-Type", /html/)
            .end((err, res) => {
                if (err) throw err;
                res.status.should.be.equal(400);
                done();
            });
    });

    it("respond with invalid user (missing required field)", (done) => {
        request(app)
            .post("/users")
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

    it("respond with non admin user", (done) => {
        request(app)
            .post("/users/")
            .set("auth-token", process.env.TEST_TOKEN_NOADMIN)
            .send(exampleUser)
            .expect("Content-Type", /html/)
            .end((err, res) => {
                if (err) throw err;
                res.status.should.be.equal(403);
                done();
            });
    });

    it("respond with created user", (done) => {
        request(app)
            .post("/users/")
            .set("auth-token", process.env.TEST_TOKEN)
            .send(exampleUser)
            .expect("Content-Type", /json/)
            .end((err, res) => {
                if (err) throw err;
                isValidUser(res);
                testingId = res.body._id;
                done();
            });
    });
});
describe("/get /users", () => {
    it("respond with user not logged in", (done) => {
        request(app)
            .get("/users")
            .expect("Content-Type", /html/)
            .expect(401, done);
    });
    it("respond with non admin user", (done) => {
        request(app)
            .get("/users/")
            .set("auth-token", process.env.TEST_TOKEN_NOADMIN)
            .expect("Content-Type", /html/)
            .end((err, res) => {
                if (err) throw err;
                res.status.should.be.equal(403);
                done();
            });
    });
    it("respond with a list of all users", (done) => {
        request(app)
            .get("/users")
            .set("auth-token", process.env.TEST_TOKEN)
            .expect("Content-Type", /json/)
            .end((err, res) => {
                if (err) throw err;
                isValidUsers(res);
                done();
            });
    });
});

describe("/get /users/:id", () => {
    it("respond with user not logged in", (done) => {
        request(app)
            .get("/users/" + testingId)
            .expect("Content-Type", /html/)
            .expect(401, done);
    });
    it("respond with a non existant user", (done) => {
        request(app)
            .get("/users/60dba7a66ea10b54d4c89ef2")
            .set("auth-token", process.env.TEST_TOKEN)
            .expect("Content-Type", /html/)
            .expect(404, done);
    });

    it("respond with non admin user", (done) => {
        request(app)
            .get("/users/" + testingId)
            .set("auth-token", process.env.TEST_TOKEN_NOADMIN)
            .expect("Content-Type", /html/)
            .end((err, res) => {
                if (err) throw err;
                res.status.should.be.equal(403);
                done();
            });
    });

    it("respond with a user", (done) => {
        request(app)
            .get("/users/" + testingId)
            .set("auth-token", process.env.TEST_TOKEN)
            .expect("Content-Type", /json/)
            .end((err, res) => {
                if (err) throw err;
                isValidUser(res);
                done();
            });
    });
});

describe("/patch /users", () => {
    it("respond with user not logged in", (done) => {
        request(app)
            .patch("/users/" + testingId)
            .send(exampleUser)
            .expect("Content-Type", /html/)
            .expect(401, done);
    });

    it("respond with a non existant user", (done) => {
        request(app)
            .patch("/users/60dba7a66ea10b54d4c89ef2")
            .set("auth-token", process.env.TEST_TOKEN)
            .send(exampleUser)
            .expect("Content-Type", /html/)
            .expect(404, done);
    });
    it("respond with invalid user (number in name)", (done) => {
        request(app)
            .patch("/users/" + testingId)
            .set("auth-token", process.env.TEST_TOKEN)
            .send({
                name: "example1",
                surname: "user",
            })
            .expect("Content-Type", /html/)
            .end((err, res) => {
                if (err) throw err;
                res.status.should.be.equal(400);
                done();
            });
    });

    it("respond with non admin user", (done) => {
        request(app)
            .patch("/users/" + testingId)
            .set("auth-token", process.env.TEST_TOKEN_NOADMIN)
            .send(exampleUser)
            .expect("Content-Type", /html/)
            .end((err, res) => {
                if (err) throw err;
                res.status.should.be.equal(403);
                done();
            });
    });

    it("respond with edited user", (done) => {
        request(app)
            .patch("/users/" + testingId)
            .set("auth-token", process.env.TEST_TOKEN)
            .send(exampleUser)
            .expect("Content-Type", /json/)
            .end((err, res) => {
                if (err) throw err;
                isValidUser(res);
                done();
            });
    });
});

describe("/delete /users", () => {
    it("respond with user not logged in", (done) => {
        request(app)
            .delete("/users/" + testingId)
            .expect("Content-Type", /html/)
            .expect(401, done);
    });

    it("respond with a non existant user", (done) => {
        request(app)
            .delete("/users/60dba7a66ea10b54d4c89ef2")
            .set("auth-token", process.env.TEST_TOKEN)
            .expect("Content-Type", /html/)
            .expect(404, done);
    });

    it("respond with non admin user", (done) => {
        request(app)
            .delete("/users/" + testingId)
            .set("auth-token", process.env.TEST_TOKEN_NOADMIN)
            .expect("Content-Type", /html/)
            .end((err, res) => {
                if (err) throw err;
                res.status.should.be.equal(403);
                done();
            });
    });

    it("respond with deleted user", (done) => {
        request(app)
            .delete("/users/" + testingId)
            .set("auth-token", process.env.TEST_TOKEN)
            .expect("Content-Type", /json/)
            .end((err, res) => {
                if (err) throw err;
                isValidUser(res);
                done();
            });
    });
});
