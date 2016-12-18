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

export const AnswerDialog = EpicComponent(self => {

   let city, metal1, metal2, metal3;
   const refCity = el => { city = el; };
   const refMetal1 = el => { metal1 = el; };
   const refMetal2 = el => { metal2 = el; };
   const refMetal3 = el => { metal3 = el; };

   const onSubmit = function () {
      self.props.submit({
         c: city.value, m1: metal1.value, m2: metal2.value, m3: metal3.value
      });
   };

   self.componentDidMount = function () {
      // When the component mounts, select the first input box.
      city && city.focus();
   };


   self.render = function () {
      const {answers, feedback, onSuccess} = self.props;
      return (
         <div className='adfgx-answer-dialog'>
            <div className='section'>
               <p>
                  Entrez ci-dessous les quatre parties de votre réponse, puis
                  cliquez sur le bouton Soumettre pour connaître le score obtenu.
               </p>
               <p>
                  Vous pouvez soumettre plusieurs réponses. La seule limite est
                  que vous ne pouvez pas soumettre plus de deux fois en moins
                  d'une minute.
               </p>
               <p className="input">
                  <label htmlFor="answer-c">{'Lieu (ville ou pays) : '}</label>
                  <input type="text" id="answer-c" ref={refCity} />
               </p>
               <p className="input">
                  <label htmlFor="answer-m1">{'Métal 1 : '}</label>
                  <input type="text" id="answer-m1" ref={refMetal1} />
               </p>
               <p className="input">
                  <label htmlFor="answer-m2">{'Métal 2 : '}</label>
                  <input type="text" id="answer-m2" ref={refMetal2} />
               </p>
               <p className="input">
                  <label htmlFor="answer-m3">{'Métal 3 : '}</label>
                  <input type="text" id="answer-m3" ref={refMetal3} />
               </p>
               <p><Button onClick={onSubmit}>Soumettre</Button></p>
            </div>
            {feedback && <Feedback feedback={feedback} onSuccess={onSuccess}/>}
            <div className='section'>
               {answers}
            </div>
            <div className='section'>
               <p>
                  Remarque : les différences d'espaces, d'accents, de
                  minuscules/majuscules, de W à la place de V ou vice-versa sont ignorées lors de la
                  comparaison entre les réponses fournies et celles attendues.
                  L'ordre des trois métaux n'a pas d'importance.
               </p>
               <p>Le score est calculé comme suit :</p>
               <ul>
                  <li>vous partez d'un capital de 1000 points ;</li>
                  <li>35, 50 ou 200 points sont retirés de ce capital pour chaque indice
                      demandé avant votre réponse, suivant le type d'indice ;</li>
                  <li>si vous avez à la fois le bon lieu et les trois métaux,
                     votre score est égal au capital restant ;</li>
                  <li>si vous n'avez que le lieu, ou bien que les trois métaux,
                      votre score est égal à la moitié du capital restant.</li>
               </ul>
               <p>Autres remarques sur les scores :</p>
               <ul>
                  <li>le score de l'équipe pour un sujet est le meilleur score
                      parmi toutes les soumissions ;</li>
                  <li>le score du tour est le meilleur score obtenu parmi les
                      sujets en temps limité</li>
               </ul>
            </div>
         </div>
      );
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


export const Feedback = EpicComponent(self => {

   const fullScore = <p>Votre score est la totalité de vos points disponibles.</p>;
   const halfScore = <p>Votre score est égal à la moitié de vos points disponibles.</p>;

   self.render = function () {
      const {feedback, onSuccess} = self.props;
      return (
         <div className='adfgx-feedback'>
            {feedback.city
             ? (feedback.metals
                  ? <div>
                        <Alert bsStyle='success'>
                           <p>Félicitations, vos réponses sont correctes !</p>
                           {fullScore}
                        </Alert>
                        <p><strong>
                           Vous avez atteint le score maximum que vous pouvez obtenir à
                           cette épreuve, compte tenu des indices que vous avez obtenus.
                        </strong></p>
                        <p className="text-center">
                           <Button bsStyle="primary" bsSize="large" onClick={onSuccess}>
                              <i className="fa fa-left-arrow"/> retour aux épreuves
                           </Button>
                        </p>
                     </div>
                  : <div>
                        <Alert bsStyle='warning'>
                           <p>Le lieu est le bon, mais au moins un des trois métaux est faux.</p>
                           {halfScore}
                        </Alert>
                     </div>)
             : (feedback.metals
                  ? <div>
                        <Alert bsStyle='warning'>
                           <p>Les trois métaux sont les bons, mais le lieu est faux.</p>
                           {halfScore}
                        </Alert>
                     </div>
                  : <Alert bsStyle='danger'>Ni le lieu ni les métaux ne sont les bons.</Alert>)}
         </div>
      );
   };

});


export const Task = EpicComponent(self => {

   const assetUrl = function (name) {
      return System.normalizeSync(`./assets/${name}`);
   };

   self.render = function () {
      const {task} = self.props;
      const lines = task.cipher_text.match(/.{1,40}/g);
      return (<div>

   <p>
   Après avoir déchiffré le message du tour précédent, votre amie Alice a trouvé un nouveau message, chiffré différemment. Allez lire la <a href="http://concours-alkindi.fr/#/pageBD" target="_blank">bande dessinée</a> de la suite de son aventure quand vous avez un peu de temps.
   </p>
   <p>
   Voici le texte du message :
   </p>
   <div className="y-scrollBloc adfgx-text" style={{width:'480px',margin:'0 auto 15px'}}>
      {lines.map((line, i) => <div key={i} className="adfgx-line">{line}</div>)}
   </div>

   <p>
      Votre but est de l'aider à déchiffrer ce texte. Vous devez y trouver le nom d'un lieu et trois noms de métaux.
   </p>
   <p>
      Comme pour le tour précédent, vous disposez d'outils pour vous aider et pouvez obtenir des indices.
   </p>
   <p>
      Il n'y a plus d'entraînement cette fois, mais vous pouvez effectuer autant de tentatives en temps limité que vous le souhaitez. Pour chaque tentative, vous disposez d'1h30 pour tenter de déchiffrer le message en utilisant le moins d'indices possible.
   </p>
   <p>
      Comme pour le tour précédent, votre score sera le meilleur score parmi toutes vos tentatives en temps limité.
   </p>

   <h2>Méthode de chiffrement ADFGX</h2>

   <p>
      Votre amie a reconnu la méthode utilisée pour chiffrer le message. Il s'agit du chiffrement ADFGX. Vous ne disposez pas de la clé.
   </p>
   <p>
      Pour chiffrer et déchiffrer un message avec la méthode ADFGX on doit se munir :
   </p>
   <ol>
      <li>
         <p>d'une grille secrète (la clé-grille) : on place toutes les lettres de l'alphabet sauf W dans une grille 5x5 pour laquelle les lignes et les colonnes portent des étiquettes A, D, F, G et X, par exemple :</p>
         <p className="text-center"><img src={assetUrl("grille_1.png")} style={{width:'280px'}} title=""/></p>
      </li>
      <li>
         <p>d'une permutation secrète (la clé-permutation) : en mathématiques une permutation de taille n est une façon de réordonner n objets. Voici un exemple de permutation de taille 6 :</p>
         <p className="text-center"><img src={assetUrl("permutation_1.png")} style={{width:'400px'}} title=""/></p>
         <p>Cette permutation est notée en mathématiques :</p>
         <p className="text-center"><img src={assetUrl("permutation_maths.png")} style={{width:'150px'}} title=""/></p>
         <p>En informatique, on la note [4,1,5,2,3,6]. Nous utiliserons la notation informatique dans les outils.</p>
      </li>
   </ol>
   <h2>Étapes du chiffrement</h2>
   <p>Voici les étapes successives du chiffrement, que nous allons illustrer sur le message &laquo;à Georges Painvin !&raquo; :</p>
   <ol>
      <li>
         <p>Le message est converti en majuscules et les accents retirés. Les espaces et les signes de ponctuation sont supprimés. Tous les W sont remplacés par des V.</p>
         <p>Notre message devient : &laquo;AGEORGESPAINVIN&raquo; </p>
      </li>
      <li>
         <p>On s'assure que le message a bien un nombre de lettres multiple de 3 en ajoutant des lettres à la fin si nécessaire. Dans cette épreuve le message aura toujours un nombre de lettres multiple de 3.</p>
         <p>Notre message reste &laquo;AGEORGESPAINVIN&raquo; </p>
      </li>
      <li>
         <p>On cherche chaque lettre du message dans la grille et on la remplace par deux lettres : l'étiquette de sa ligne puis l'étiquette de sa colonne dans la grille.</p>
         <p>Par exemple, dans la grille ci-dessous O est chiffré par DF :</p>
         <p className="text-center"><img src={assetUrl("grille_2.png")} title=""/></p>
         <p>En appliquant cette procédure sur toutes les lettres de notre message &laquo;AGEORGESPAINVIN&raquo;, il devient &nbsp;&laquo;XXFGADDFAFFGADFADGXXDDXGXDDDXG&raquo;. On appelle ce nouveau texte le message intermédiaire.</p>
      </li>
      <li>
         <p>On écrit les lettres du message intermédiaire, qui sont uniquement des A, D, F, G et X sur six lignes comme ci-dessous : XXFGAD va sur la première colonne, DFAFFG sur la deuxième et ainsi de suite.</p>
         <p style={{textAlign:'center',fontFamily:'monospace',fontSize:'20px'}}>
            X &nbsp;D &nbsp;A &nbsp;X &nbsp;X<br/>
            X &nbsp;F &nbsp;D &nbsp;X &nbsp;D<br/>
            F &nbsp;A &nbsp;F &nbsp;D &nbsp;D<br/>
            G &nbsp;F &nbsp;A &nbsp;D &nbsp;D<br/>
            A &nbsp;F &nbsp;D &nbsp;X &nbsp;X<br/>
            D &nbsp;G &nbsp;G &nbsp;G &nbsp;G
         </p>
      </li>
      <li>
         <p>On applique notre permutation en l'inscrivant sur le côté des lignes à gauche, puis en triant les lignes selon ces valeurs. Ainsi pour la permutation [4, 1, 5, 2, 3 6], la 1ère ligne va à la 4e position, la ligne 2 va à la 1ère position, la ligne 3 à la 5e position, la 4e à la 2e position et la 5e à la 3e position, tandis que la 6e reste sur place</p>
         <p className="text-center"><img src={assetUrl("permutation_2.png")} title=""/></p>
      </li>
      <li>
         <p>
         On lit ensuite le message ligne par ligne dans la grille obtenue, à droite.<br/>
         Dans notre exemple on lit donc la 1e ligne XFDXD, puis GFADD, AFDXX, XDAXX, FAFDD et enfin DGGGG, ce qui donne le message chiffré : &laquo;XFDXDGFADDAFDXXXDAXXFAFDDDGGGG&raquo;.</p>
      </li>
   </ol>
   <h2>Déchiffrement</h2>
   <p>Pour déchiffrer un message chiffré par ADFGX lorsque l'on dispose de la clé, il faut effectuer les étapes inverses :</p>
   <ol>
      <li>
         <p>découper le message en 6 lignes de longueur égale ;</p>
      </li>
      <li>
         <p>permuter les lignes en appliquant la permutation inverse de celle utilisée pour chiffrer. Par exemple la permutation inverse de [4,1,5,2,3,6] est [2,4,5,1,3,6] ;</p>
         <p>
         Pour calculer l’inverse d’une permutation, on l’écrit sous la notation mathématique, on échange la rangée de haut et celle de bas et ensuite on trie les colonnes dans l’ordre des valeurs de la rangée qui est maintenant en haut. Par exemple quand on échange la rangée de haut et de bas pour [4,1,5,2,3,6] on trouve
         </p>
         <p className="text-center"><img src={assetUrl("permutation_maths_2.png")} style={{width:'150px'}} title=""/></p>
         <p>
         et quand on trie les colonnes dans l’ordre des valeurs de la première rangée, on obtient la permutation inverse :
         </p>
         <p className="text-center"><img src={assetUrl("permutation_maths_3.png")} style={{width:'150px'}} title=""/></p>
         <p>
            ou [2,4,5,1,3,6] en notation informatique ;
         </p>
      </li>
      <li>
         <p>lire le texte colonne par colonne, ce qui donne le texte intermédiaire ;</p>
      </li>
      <li>
         <p>déchiffrer chaque paire de lettres du texte intermédiaire en utilisant la grille. Par exemple DF donne O dans notre exemple.</p>
      </li>
   </ol>

      </div>);
   };

});
