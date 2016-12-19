import React from 'react';
import {Button} from 'react-bootstrap';
import EpicComponent from 'epic-component';

const AnswerDialog = EpicComponent(self => {

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

const Feedback = EpicComponent(self => {

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

export default AnswerDialog;
