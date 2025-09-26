import React from "react";

interface AppErrorBoundaryState {
  hasError: boolean;
}

class AppErrorBoundary extends React.Component<any, AppErrorBoundaryState> {
  constructor(props : any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error : any) {
    // Switch UI to fallback on error
    console.log(error)
    return { hasError: true };
  }

  componentDidCatch(error : any, errorInfo : any) {
    // Log error details (could send to monitoring service)
    console.error("🔥 Error caught by AppErrorBoundary:", error, errorInfo);
  }

  handleRetry = () => {
    // Reset error boundary state
    this.setState({ hasError: false });
  };

  render() {
    if (this.state?.hasError ) {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-4">
          <h1 className="text-2xl font-bold mb-2">⚠️ Oops! Something went wrong.</h1>
          <p className="mb-4 text-gray-600">
            Don’t worry, you can try again.
          </p>
          <button
            onClick={this.handleRetry}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      );
    }

    // Render children normally if no error
    return this.props.children;
  }
}

export default AppErrorBoundary;
