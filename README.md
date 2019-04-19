# React Loud Hailer `react-lh`

Publish/subscribe implementation for efficient message passing between React components.

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
