# React Loud Hailer `react-lh`

[![Build Status](https://travis-ci.org/mauris/react-lh.svg?branch=master)](https://travis-ci.org/mauris/react-lh) [![peerDependencies Status](https://david-dm.org/mauris/react-lh/peer-status.svg)](https://david-dm.org/mauris/react-lh?type=peer) [![dependencies Status](https://david-dm.org/mauris/react-lh/status.svg)](https://david-dm.org/mauris/react-lh) [![npm bundle size](https://img.shields.io/bundlephobia/min/react-lh.svg?style=popout)](https://www.npmjs.com/package/react-lh) [![npm](https://img.shields.io/npm/dt/react-lh.svg?style=popout)](https://www.npmjs.com/package/react-lh)

Publish/subscribe implementation for efficient message passing between [React](https://reactjs.org/) components.

## Install

To install `react-lh` with your existing React app, run either:

    $ npm install --save react-lh

or if using Yarn:

    $ yarn add react-lh

## Usage

*Recommended*: [Example Todo App on JSFiddle](https://jsfiddle.net/mauris/bzwm9f0n/) - The Todo App example demonstrates how facilitate inter-component communications and enable decoupling between them.

The following examples uses the ECMA 9 features. If you wish to use it in CommonJS module system (i.e. in Node.js natively), you need to use `require()` like so:

````javascript
const reactlh = require('react-lh');
const loudHailer = reactlh.loudHailer;
````

or concisely as:

````javascript
const { loudHailer } = require('react-lh');
````

After installing `react-lh` to your React app, you need to wrap components that you wish to access the Loud Hailer API with the `loudHailer()` function like that:

````javascript
import React, { Component } from 'react';
import loudHailer from 'react-lh';

class MyComponent extends Component {
  componentDidMount() {
    const { channel } = this.props;

    channel.on('SomeOtherActionOccurred', () => {
      // a function that executes whenever the event
      // "SomeOtherActionOccurred" is fired
    });
  }

  renderButtonClickHandler() {
    return () => {
      const { channel } = this.props;

      // fires the event "ButtonClicked"
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

// wrap the component using Loud Hailer before exporting
export default loudHailer(MyComponent);
````

In the case of a function component:

````javascript
import loudHailer from 'react-lh';

function FuncComponent(props) {
  const { channel } = props;

  const buttonClickHandler = () => {
    channel.emit('ButtonClicked');
  };

  return (
    <button onClick={buttonClickHandler}>
      Press me
    </button>
  )
}

// wrap the component using Loud Hailer before exporting
export default loudHailer(FuncComponent);
````

By default, the Loud Hailer API will be accessible through the `channel` props property. The property name can be changed by passing an option to Loud Hailer wrapper's second options argument like this:

````javascript
import loudHailer from 'react-lh';

function FuncComponent(props) {
  // notice that "pipe" is used here
  const { pipe } = props;

  const buttonClickHandler = () => {
    pipe.emit('ButtonClicked');
  };

  // ...
}

const options = {
  property: 'pipe'
};
export default loudHailer(FuncComponent, options);
````

### Cross-Window Event Propagation

It is possible for events emitted by components on one window to be propagated to another window through React Loud Hailer. This is made possible by browsers' localStorage API implementation. To enable this feature, you need to wrap your top-most component (e.g. `App`) with the Loud Hailer CrossWindow component like this:

````javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { CrossWindow } from 'react-lh';

import App from './App';

const channels = ['default'];

ReactDOM.render(
  <CrossWindow channels={channels}>
    <App />
  </CrossWindow>,
  document.getElementById('root')
);
````

The `channels` property indicate which channels can be communicated across all the open windows of your website. The default channel namespace is `'default'`.
