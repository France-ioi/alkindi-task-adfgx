
/* WORK IN PROGRESS -- this file contains React components that provide content
   that needs to appear outside the task's iframe; they will probably be made
   available by a build step that creates a runtime-loadable SystemJS bundle */

import React from 'react';
import {Alert, Button} from 'react-bootstrap';
import EpicComponent from 'epic-component';

export const TabHeader = EpicComponent(self => {
   self.render = function () {
      return (
         <div>
            <p>
               Attention, <strong>l'onglet sujet contient des informations essentielles</strong>,
               lisez-le attentivement.
            </p>
            <p>
               {'Voici ci-dessous des outils pour vous aider à déchiffrer le message, '}
               {'leur documentation est '}
               <a href="http://concours-alkindi.fr/docs/tour3-outils.pdf" title="documentation des outils au format .PDF" target="new">
                  {'disponible en téléchargement '}
                  <i className="fa fa-download"/>
               </a>.</p>
            <p>Une fois que vous avez déchiffré le message, entrez votre réponse dans l'onglet Réponses.</p>
         </div>);
   };
});

export const Answer = EpicComponent(self => {

   self.render = function () {
      const {answer} = self.props;
      return (
         <div className='adfgx-answer'>
            <span className='adfgx-city'>{answer.c}</span>{' • '}
            <span className='adfgx-metal1'>{answer.m1}</span>{' • '}
            <span className='adfgx-metal2'>{answer.m2}</span>{' • '}
            <span className='adfgx-metal3'>{answer.m3}</span>
         </div>
      );
   };

});
