import * as React from 'react';
import './App.scss';
import MentionEditor from './components/MentionEditor';

const logo = require('./logo.svg');

class App extends React.Component {
  render() {
    return (
      <div>
        <MentionEditor />
      </div>
    );
  }
}

export default App;
