# React Loud Hailer `react-lh`

[![Build Status](https://travis-ci.org/mauris/react-lh.svg?branch=master)](https://travis-ci.org/mauris/react-lh) ![Dependencies](https://david-dm.org/mauris/react-lh.svg) ![npm bundle size](https://img.shields.io/bundlephobia/min/react-lh.svg?style=popout) ![npm](https://img.shields.io/npm/dt/react-lh.svg?style=popout)

Publish/subscribe implementation for efficient message passing between [React](https://reactjs.org/) components.

## Install

To install `react-lh` with your existing React app, run either:

    $ npm install --save react-lh

or if using Yarn:

    $ yarn add react-lh

## Usage

After installing `react-lh` to your React app, you need to wrap components that you wish to access the Loud Hailer API with the `loudHailer()` function like that:

````javascript
import React, { Component } from 'react';
import loudHailer from 'react-lh';

class MyComponent extends Component {
  componentDidMount() {
    const { channel } = this.props;

    channel.on('SomeOtherActionOccurred', () => {
      // handle the consequence
    });
  }

  renderButtonClickHandler() {
    return () => {
      const { channel } = this.props;

      // tell subscribers that the button was clicked
      channel.emit('ButtonClicked');
    }
  }

  render() {
    return (
      <button onClick={this.renderButtonClickHandler()}>
        Press me
      </button>
    );
  }
}

export default loudHailer(MyComponent);
````

In the case of a function component:

````javascript
import loudHailer from 'react-lh';

function FuncComponent(props) {
  const { channel } = props;
  // ...
}

export default loudHailer(FuncComponent);
````

The Loud Hailer API will be accessible through the `channel` props property.

### Cross-Window Event Propagation

It is possible for events emitted by components on one window to be propagated to another window through React Loud Hailer. This is made possible by browsers' localStorage API implementation. To enable this feature, you need to wrap your top-most component (e.g. `App`) with the Loud Hailer CrossWindow component like this:

````javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { CrossWindow } from 'react-lh';

import App from './App';

const channels = ['default'];

React.render(
  <CrossWindow channels={channels}>
    <App />
  </CrossWindow>,
  document.getElementById('root')
)
````

The `channels` property indicate which channels can be communicated across all the open windows of your website. The default channel namespace is `'default'`.
