
/* unused file containing test code for obtaining hints */

const findInGrid = function (grid, rank) {
   for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
         if (grid[row][col] === rank) {
            return {row, col};
         }
      }
   }
};

 const getHint = function (query, callback) {
    setTimeout(function () {
       const {task} = self.props;
       const {hints} = task;
       let newTask = task;
       if (query.type === 'subst-decipher') {
          const {row, col} = query;
          newTask = {...task, substitution_grid: at(row, at(col, put(hints.substitution_grid[row][col])))(task.substitution_grid)};
       } else if (query.type === 'subst-cipher') {
          const {row, col} = findInGrid(hints.substitution_grid, query.rank);
          newTask = {...task, substitution_grid: at(row, at(col, put(hints.substitution_grid[row][col])))(task.substitution_grid)};
       } else if (query.type === 'perm-decipher') {
          const {line} = query;
          newTask = {...task, permutation: at(line, put(hints.permutation[line]))(task.permutation)};
       } else if (query.type === 'perm-cipher') {
          const line = hints.permutation.indexOf(query.line);
          newTask = {...task, permutation: at(line, put(hints.permutation[line]))(task.permutation)};
       } else {
          return callback('error');
       }
       // self.props.dispatch({type: 'SET_TASK', task: newTask});
       callback();
    }, 200);
 };
