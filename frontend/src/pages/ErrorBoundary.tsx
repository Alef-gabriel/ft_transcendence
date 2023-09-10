import { Component, ErrorInfo, ReactNode } from 'react';
import Header from "../components/Header.tsx";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ hasError: true, error });
    console.error(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <>
          <Header></Header>
          <div className="container">
            <div className="error-page-wrapper">
              <h1>Something went wrong</h1>
              <p>We apologize for the inconvenience. Please try again later.</p>
              <br></br>
              <div>
                <a href={"/"}>Go to Home Page</a>
              </div>
            </div>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;