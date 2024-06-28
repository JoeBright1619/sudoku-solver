'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

const puzzleStrings = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      let coordinate = req.body.coordinate;
      let value = req.body.value;
    if(!puzzle || !coordinate || !value){
      res.json({ error: 'Required field(s) missing' });
      return;
    }
      const validate = solver.validate(puzzle);
      if (validate!=="validformat") {
        res.json({ error: validate });
      } else {

        if(!/^[A-I][1-9]$/i.test(coordinate)){
          res.json({ error: 'Invalid coordinate'});
        }

        else if(!/^[1-9]$/.test(value)){
          res.json({ error: 'Invalid value' });
        }

        else{

          const solution = puzzleStrings.filter((sol)=>{
            return sol[0]==puzzle
          })[0];

          if(solution){
         coordinate = coordinate
         .split("")
         .map((elem)=>{
          if(isNaN(elem)){
           elem = elem.toUpperCase();
           elem = elem.charCodeAt(0) - 'A'.charCodeAt(0);
           return elem;
          }
          else{
            return parseInt(elem, 10) - 1
          }
         });
        solver.conflict=[];
         solver.checkRowPlacement(puzzle,coordinate[0],coordinate[1],value);
         solver.checkColPlacement(puzzle,coordinate[0],coordinate[1],value);
         solver.checkRegionPlacement(puzzle,coordinate[0],coordinate[1],value);
         if(solver.conflict.length==0){
          res.json({ valid: true });
         }
         else{
          res.json({ valid: false, conflict: solver.conflict });
         }
          }
          else{
            res.json({ error: 'Puzzle cannot be solved' })
          }
        }
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle
      const validate = solver.validate(puzzle);
      if (validate!=="validformat") {
        res.json({ error: validate });
      } else {
       res.json(solver.solve(puzzleStrings, puzzle));
      }
    });
};
