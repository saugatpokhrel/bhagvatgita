const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');
const cheerio = require('cheerio');
const { expect } = chai;
const axios = require('axios');
const app=require('./index');

// const app = express();

chai.use(chaiHttp);

describe('Express App', () => {
  it('should return "Hello World" for the root route', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should fetch and parse chapter and verse information', (done) => {
    chai
      .request(app)
      .get('/chapter/4/verse/8')
      .end(async (err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});
