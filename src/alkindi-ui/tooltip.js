import React from 'react';
import Tooltip from 'rc-tooltip';
import EpicComponent from 'epic-component';

export default EpicComponent(self => {
    /* Props:
             text
    */

    self.render = function () {
      const overlay = (
         <div style={{maxWidth: '200px', fontSize: '120%'}}>
            {self.props.content}
         </div>
      );
      return (
         <Tooltip animation="zoom" trigger="hover click" overlay={overlay}>
            {self.props.children || <i className='fa fa-question-circle'/>}
         </Tooltip>
      );
    };

});
