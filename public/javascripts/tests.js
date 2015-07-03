var request = superagent;

describe('Our API', function(){
  describe('POST empty data to /questions', function(){
    it("returns a 400", function(done) {
      request.post("/questions").end(function(err, res) {
        if (err) { throw err; }
        expect(res.status).to.equal(400);
        done();
      });
    });
  });
  describe('POST valid data to /questions', function(){
    it("returns the saved question in json", function(done) {
      request.post("/questions")
        .send({body: 'one test question', email: 'test@test.com'})
        .end(function(err, res) {
        if (err) { throw err; }
        expect(res.status).to.equal(200);
        expect(res.body.slug).to.equal('one-test-question');
        done();
      });
    });
  });
  describe('POST duplicate data to /questions', function(){
    it("returns a 400", function(done) {
      request.post("/questions")
        .send({body: 'one test question', email: 'test@test.com'})
        .end(function(err, res) {
        if (err) { throw err; }
        expect(res.status).to.equal(400);
        done();
      });
    });
  });
  describe('GET /questions', function(){
    it("returns an array of all the questions", function(done) {
      request.get("/questions").end(function(err, res) {
        if (err) { throw err; }
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0].body).to.equal("one test question");
        done();
      });
    });
  });
  describe('GET /questions/:questionCode', function(){
    it("returns the question which have that code", function(done) {
      request.get("/questions/one-test-question").end(function(err, res) {
        if (err) { throw err; }
        expect(res.status).to.equal(200);
        expect(res.body.body).to.equal("one test question");
        done();
      });
    });
  });
  describe('GET /questions/:questionCode', function(){
    it("returns 404 if the code does not exist", function(done) {
      request.get("/questions/dsajflkasdjfjadsjflkjaslkdf").end(function(err, res) {
        if (err) { throw err; }
        expect(res.status).to.equal(404);
        done();
      });
    });
  });
  // describe('DELETE /questions/:questionCode', function(){
  //   it("returns 200 if question is removed from db", function(done) {
  //     request.delete("/questions/one-test-question").end(function(err, res) {
  //       if (err) { throw err; }
  //       expect(res.status).to.equal(200);
  //       done();
  //     });
  //   });
  // });
});
