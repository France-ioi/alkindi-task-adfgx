
import React from 'react';
import {connect} from 'react-redux';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import TextInputBundle from './tools/text_input';
import HintsBundle from './tools/hints';
import EnumeratePermutationsBundle from './tools/enumerate_permutations';
import ApplyPermutationBundle from './tools/apply_permutation';
import FrequencyAnalysisBundle from './tools/frequency_analysis';
import ApplySubstitutionBundle from './tools/apply_substitution';

function WorkspaceSelector (state) {
  const {views, actions} = state;
  return {views, actions};
}

class Workspace extends React.PureComponent {
  render () {
    const {
      TextInput,
      Hints,
      EnumeratePermutations,
      ApplyPermutation,
      FrequencyAnalysis,
      ApplySubstitution
    } = this.props.views;

    return (
      <div>
        <h2>{"Adfgx"}</h2>
        <TextInput />
        <Hints />
        <EnumeratePermutations />
        <ApplyPermutation />
        <FrequencyAnalysis />
        <ApplySubstitution />
      </div>
    );
  }
}

export default {
  views: {
    Workspace: connect(WorkspaceSelector)(
      DragDropContext(HTML5Backend)(Workspace)
    ),
  },
  includes: [
    /* Order is significant for sequencing of late reducers. */
    TextInputBundle,
    HintsBundle,
    EnumeratePermutationsBundle,
    ApplyPermutationBundle,
    FrequencyAnalysisBundle,
    ApplySubstitutionBundle
  ],
};
