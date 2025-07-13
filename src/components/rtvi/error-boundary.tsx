import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export class RTVIErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('RTVI Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle className="text-destructive">RTVI Connection Error</CardTitle>
              <CardDescription>
                Failed to connect to the RTVI service. This might be a temporary issue.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {this.state.error && (
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  <strong>Error:</strong> {this.state.error.message}
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <Button onClick={this.handleRetry} variant="default" className="w-full">
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                
                <Button onClick={this.handleReload} variant="outline" className="w-full">
                  Reload Page
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                If the problem persists, please check your network connection 
                and ensure the RTVI backend is running.
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}