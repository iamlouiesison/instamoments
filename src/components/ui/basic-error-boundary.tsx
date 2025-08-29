'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class BasicErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-3">
                Something went wrong
              </h1>
              
              <p className="text-muted-foreground text-lg mb-6">
                We encountered an unexpected error. Please refresh the page to try again.
              </p>

              {this.state.error && (
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-foreground font-mono">
                    {this.state.error.message}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
