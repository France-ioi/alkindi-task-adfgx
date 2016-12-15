import React from 'react';
import intersperse from 'intersperse';
import EpicComponent from 'epic-component';

export const StrLit = EpicComponent(self => {
   /* Props:
         value
   */
   self.render = function () {
      return <span>'{self.props.value}'</span>;
   };
});

export const Var = EpicComponent(self => {
   /* Props:
         name
   */
   self.render = function () {
      return <span className='code-var'>{self.props.name}</span>;
   };
});


export const Assign = EpicComponent(self => {
   /* Props:
         children
   */
   self.render = function () {
      const {children} = self.props;
      return <span>{children[0]}{' = '}{children[1]}</span>;
   };
});

export const Call = EpicComponent(self => {
   /* Props:
         name
         children
   */
   self.render = function () {
      const args = self.props.children.filter(arg => arg);
      return (
         <span>
            {self.props.name}
            {'('}
            {intersperse(args, ', ')}
            {')'}
         </span>
      );
   };
});

export const Grid = EpicComponent(self => {
   /* Props:
         grid
         renderCell
   */
   self.render = function () {
      const {grid, renderCell} = self.props;
      if (!grid) {
         return <span className="code-error">(bad grid)</span>;
      }
      let strPython = "[";
      for (let i = 0; i < grid.length; i++) {
         if (i !== 0)
            strPython += ", "
         const row = grid[i];
         strPython += "[";
         for (let j = 0; j < row.length; j++) {
            const cell = row[j];
            if (j != 0) {
               strPython += ", ";
            }
            strPython += renderCell(cell);
         }
         strPython += "]";
      }
      strPython += "];";
      return <span>{strPython}</span>;
   };
});

export default {StrLit, Var, Assign, Call, Grid};
