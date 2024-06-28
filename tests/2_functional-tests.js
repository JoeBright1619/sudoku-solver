const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    let puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  suite('POST request to /api/solve', ()=>{
    test('Solve a puzzle with valid puzzle string:',(done)=>{
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body,'solution');
                done();
            })
    });
    test('Solve a puzzle with missing puzzle string: ',(done)=>{
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle: ''
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body,'error');
                assert.equal(res.body.error,'Required field missing');
                done();
            })
    });
    test('Solve a puzzle with invalid characters: ',(done)=>{
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle: 'D.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body,'error');
                assert.equal(res.body.error,'Invalid characters in puzzle');
                done();
            })
    });
    test('Solve a puzzle with incorrect length:',(done)=>{
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle: puzzle+'1'
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body,'error');
                assert.equal(res.body.error,'Expected puzzle to be 81 characters long');
                done();
            })
    });
    test('Solve a puzzle that cannot be solved:',(done)=>{
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle: '..9..5.1.85.423556242......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body,'error');
                assert.equal(res.body.error,'Puzzle cannot be solved');
                done();
            })
    });

  })  
  suite('POST request to /api/check', ()=>{
    test('Check a puzzle placement with all fields: ',(done)=>{
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle,
                coordinate: 'a1',
                value: 7

            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body,'valid');
                assert.equal(res.body.valid, true);
                done();
            })
    });
    test('Check a puzzle placement with single placement conflict: ',(done)=>{
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle,
                coordinate: 'a4',
                value: 7

            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body,'valid');
                assert.property(res.body,'conflict');
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 1);
                done();
            })
    });
    test('Check a puzzle placement with multiple placement conflicts: ',(done)=>{
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle,
                coordinate: 'a6',
                value: 9

            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body,'valid');
                assert.property(res.body,'conflict');
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 2);
                done();
            })
    })
    test('Check a puzzle placement with all placement conflicts: ',(done)=>{
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle,
                coordinate: 'a2',
                value: 9

            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body,'valid');
                assert.property(res.body,'conflict');
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 3);
                done();
            })
    });
    test('Check a puzzle placement with missing required fields: ',(done)=>{
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle,
                value: 7
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body,'error');
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            })
    });
    test('Check a puzzle placement with invalid characters: ',(done)=>{
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: 'D.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'a2',
                value: 9
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body,'error');
                assert.equal(res.body.error,'Invalid characters in puzzle');
                done();
            })
    });
    test('Check a puzzle placement with incorrect length: ',(done)=>{
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '.6.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'a2',
                value: 9
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body,'error');
                assert.equal(res.body.error,'Expected puzzle to be 81 characters long');
                done();
            })
    });
    test('Check a puzzle placement with invalid placement coordinate: ',(done)=>{
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle,
                coordinate: 'dfg',
                value: 7
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body,'error');
                assert.equal(res.body.error, 'Invalid coordinate');
                done();
            })
    });
    test('Check a puzzle placement with invalid placement value: ',(done)=>{
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle,
                coordinate: 'A1',
                value: 'd'
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body,'error');
                assert.equal(res.body.error, 'Invalid value');
                done();
            })
    });
  });

});

