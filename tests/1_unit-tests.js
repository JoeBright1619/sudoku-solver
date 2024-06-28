const chai = require('chai');
const assert = chai.assert;
const Solver = require('../controllers/sudoku-solver.js');
const solutions = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;
let solver = new Solver;

suite('Unit Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters',()=>{
        assert.equal(
            solver.validate("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."),
            "validformat")
    });
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)',()=>{
        assert.equal(
            solver.validate("..9.D5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."),
            "Invalid characters in puzzle")
    });
    test('Logic handles a puzzle string that is not 81 characters in length',()=>{
        assert.equal(
            solver.validate("..9.3.5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."),
            "Expected puzzle to be 81 characters long")
    });

    suite('Check row/column/region', () => {
        const validPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    
        test('Logic handles a valid row placement', (done) => {
          const row = 0;
          const column = 1;
          const value = '3';
          const placementResult = solver.checkRowPlacement(validPuzzle, row, column, value);
          assert.equal(placementResult, 'no row conflict');
          done();
        });
    
        test('Logic handles an invalid row placement', (done) => {
          const row = 0;
          const column = 1;
          const value = '5';
          const placementResult = solver.checkRowPlacement(validPuzzle, row, column, value);
          assert.equal(placementResult, 'row conflict');
          done();
        });


         test('Logic handles a valid column placement', (done) => {
            const row = 1;
            const column = 2;
            const value = '5';
            const placementResult = solver.checkColPlacement(validPuzzle, row, column, value);
            assert.equal(placementResult, 'no column conflict');
            done();
      });
        test('Logic handles an invalid column placement', (done) => {
                const row = 1;
                const column = 0;
                const value = '5';
                const placementResult = solver.checkColPlacement(validPuzzle, row, column, value);
                assert.equal(placementResult, 'column conflict');
                done();
        });

        test('Logic handles a valid region (3x3 grid) placement', () => {
            const puzzleString = validPuzzle;
            const row = 0;
            const column = 0;
            const value = 7;
        
            assert.equal(solver.checkRegionPlacement(puzzleString, row, column, value), 'no region conflict');
          });
        
          test('Logic handles an invalid region (3x3 grid) placement', () => {
            const puzzleString = validPuzzle;
            const row = 0;
            const column = 0;
            const value = 9;
        
            assert.equal(solver.checkRegionPlacement(puzzleString, row, column, value), 'region conflict');
          });
        
          test('Valid puzzle strings pass the solver', () => {
            
    
            assert.isObject(solver.solve(solutions, validPuzzle));
            assert.property(solver.solve(solutions, validPuzzle),'solution');
          });
        
          test('Invalid puzzle strings fail the solver', () => {
        
            assert.property(solver.solve(solutions, validPuzzle+'8'), 'error');
          });
        
          test('Solver returns the expected solution for an incomplete puzzle', () => {
            const puzzleString = validPuzzle;
            const solution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
        
            assert.equal(solver.solve(solutions,
                puzzleString).solution, solution);
          });
      });
    
});
