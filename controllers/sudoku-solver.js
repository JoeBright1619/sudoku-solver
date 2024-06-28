class SudokuSolver {
  constructor() {
    this.conflict = []; // Initialize class property in the constructor
  }
  validate(puzzleString) {
    if(!puzzleString){
      return 'Required field missing'
    }
    else if(puzzleString.length!==81){
      return 'Expected puzzle to be 81 characters long'
    }
    else{
    if (/[^0-9.]/.test(puzzleString)) {
      return 'Invalid characters in puzzle'
    } else {
      return "validformat"
    }
  }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let result=[];
    for (let i = 0; i < puzzleString.length; i += 9) {
      // Use slice to create a chunk and push it into the result array
      
      result.push(puzzleString
        .split("")
        .slice(i, i + 9));
  }


  for(let j=0; j<9; j++){
    if(result[row][j]==value && j !== column){
      this.conflict.push("row");
      return "row conflict"
    }
  }
  return "no row conflict"

}

  checkColPlacement(puzzleString, row, column, value) {
    let result=[];
    for (let i = 0; i < puzzleString.length; i += 9) {
      // Use slice to create a chunk and push it into the result array
      
      result.push(puzzleString
        .split("")
        .slice(i, i + 9));
  }
  
  for(let i=0; i<9; i++){
    if(result[i][column]==value && i !== row){
      this.conflict.push("column");
      return "column conflict"
    }
  }
    return "no column conflict"
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    let result = [];
    
    // Iterate over the array, incrementing by chunkSize each time
    for (let i = 0; i < puzzleString.length; i += 9) {
        // Use slice to create a chunk and push it into the result array
        
        result.push(puzzleString
          .split("")
          .slice(i, i + 9));
    }
    

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if ((result[startRow + i][startCol + j] == value) && (startRow + i !== row || startCol + j !== column)) {
          this.conflict.push("region");
          return "region conflict";
        }
      }
      return "no region conflict";
    }
  }
  

  solve(puzzleStrings, puzzle) {
    const solution = puzzleStrings.filter((sol)=>{
      return sol[0]==puzzle
    })[0];
    if(solution){
    return { solution: solution[1] };
    }
    else{
      return{ error: 'Puzzle cannot be solved' };
    }
  }
}

module.exports = SudokuSolver;

