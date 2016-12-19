import React from 'react';
import EpicComponent from 'epic-component';

const assetUrl = function (name) {
   return System.normalizeSync(`./assets/${name}`);
};

const Task = EpicComponent(self => {

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

export default Task;
