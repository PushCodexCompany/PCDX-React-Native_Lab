import React, {Component} from 'react';
import {View, Text} from 'react-native';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false, errorInfo: null};
  }

  static getDerivedStateFromError(error) {
    // Update state to render fallback UI
    return {hasError: true};
  }

  componentDidCatch(error, info) {
    // Log error to an external service or console
    console.log('Error caught in boundary:', error, info);
    // You can also send the error to a remote logging service like Sentry
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <View>
          <Text>Something went wrong.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
