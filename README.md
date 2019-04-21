# React Loud Hailer `react-lh`

[![Build Status](https://travis-ci.org/mauris/react-lh.svg?branch=master)](https://travis-ci.org/mauris/react-lh) ![Dependencies](https://david-dm.org/mauris/react-lh.svg)

Publish/subscribe implementation for efficient message passing between [React](https://reactjs.org/) components.

## Usage

To install `react-lh` with your existing React app, run either:

    $ npm install --save react-lh

or if using Yarn:

    $ yarn add react-lh

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
