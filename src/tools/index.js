
import TextInput from './text_input';
import Hints from './hints';
import EnumeratePermutations from './enumerate_permutations';
import ApplyPermutation from './apply_permutation';
import FrequencyAnalysis from './frequency_analysis';
import ApplySubstitution from './apply_substitution';

import {clearAlphabet, adfgxAlphabet, bigramAlphabet} from './common';

export const makeRootScope = function (task) {
   return {
      ...task,
      clearAlphabet,
      adfgxAlphabet,
      bigramAlphabet,
      cipheredText: task.cipher_text,
      substitutionGridHints: clipGrid(task.substitution_grid),
      permutationHints: task.permutation
   };
};

export function setupTools (addTool) {

   const iTextInput = addTool(TextInput, function (scopes, scope) {
      // Set up the input scope for the tool's compute function.
      // Each scope inherits prototypically from the root scope.
      scope.alphabet = adfgxAlphabet;
      scope.text = scope.cipheredText;
   }, {
      outputTextVariable: "texteChiffré"
   });

   const iHints = addTool(Hints, function (scopes, scope) {
      scope.bigramAlphabet = bigramAlphabet;
      scope.clearAlphabet = clearAlphabet;
      // scope.outputPermutation
      // scope.outputSubstitution
   }, {
      outputSubstitutionVariable: "substitutionIndices",
      outputPermutationVariable: "permutationIndices"
   });

   const iEnumeratePermutations = addTool(EnumeratePermutations, function (scopes, scope) {
      scope.cipheredText = scopes[iTextInput].outputText;
      scope.inputPermutation = scopes[iHints].outputPermutation;
   }, {
      // sortBy may be 'ci' (coincidence index) or 'key' (permutation-as-string)
      useCoincidenceIndex: false,
      sortBy: 'permutation',
      // selectedPermutationKey is a permutation-as-string, e.g. '012345';
      // if undefined (or if the selected permutation is filtered out), the
      // first permutation displayed is selected.
      selectedPermutationKey: undefined,
      // permutationInfos maps a permutation-as-string to a {favorited: bool} object.
      permutationInfos: {},
      // showOnlyFavorited, when true, limits the display to favorited permutations.
      showOnlyFavorited: false,
      inputPermutationVariable: 'permutationIndices',
      inputCipheredTextVariable: 'texteChiffré',
      outputPermutationVariable: 'permutationCourante'
   });

   const iApplyPermutation = addTool(ApplyPermutation, function (scopes, scope) {
      scope.alphabet = adfgxAlphabet;
      scope.cipheredText = scopes[iTextInput].outputText;
      scope.permutation = scopes[iEnumeratePermutations].outputPermutation;
   }, {
      inputPermutationVariable: 'permutationCourante',
      inputCipheredTextVariable: 'texteChiffré',
      outputTextVariable: 'texteAprèsPermutation'
   });

   const iFrequencyAnalysis = addTool(FrequencyAnalysis, function (scopes, scope) {
      scope.bigramAlphabet = bigramAlphabet;
      scope.targetAlphabet = clearAlphabet;
      scope.targetFrequencies = referenceLetterFrequencies;
      scope.cipheredText = scopes[iApplyPermutation].outputText;
      scope.permutation = scopes[iEnumeratePermutations].outputPermutation;
      scope.inputSubstitution = scopes[iHints].outputSubstitution;
   }, {
      editedPairs: {}, // ex. {'AD': 'E'}
      inputTextVariable: 'texteAprèsPermutation',
      inputSubstitutionVariable: 'substitutionIndices',
      outputSubstitutionVariable: 'substitutionÉditée'
   });

   const iApplySubstitution = addTool(ApplySubstitution, function (scopes, scope) {
      scope.cipheredText = scopes[iApplyPermutation].outputText;
      scope.substitution = scopes[iFrequencyAnalysis].outputSubstitution;
   }, {
      inputTextVariable: 'texteAprèsPermutation',
      inputSubstitutionVariable: 'substitutionÉditée',
      outputClearTextVariable: 'texteDéchiffré'
   });

};

const referenceLetterFrequencies = [
   0.0812034849,
   0.0090109472,
   0.0334497677,
   0.0366833299,
   0.1713957515,
   0.0106596728,
   0.0086628177,
   0.0073654812,
   0.0757827046,
   0.0054442497,
   0.0004856863,
   0.0545455020,
   0.0296764091,
   0.0709375766,
   0.0540474291,
   0.0302070784,
   0.0136181215,
   0.0655187521,
   0.0794667491,
   0.0724311434,
   0.0636770558,
   0.0174208168,
   0.0038646285,
   0.0030803592,
   0.0013644851
];

const clipGrid = function (grid) {
   return grid.map(row => row.slice(0, 5));
};
