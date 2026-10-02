import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
    showDetails: boolean;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    onReset?: () => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    declare state: ErrorBoundaryState;
    declare props: Readonly<ErrorBoundaryProps>;
    declare setState: (s: Partial<ErrorBoundaryState> | ((prev: ErrorBoundaryState) => Partial<ErrorBoundaryState>)) => void;
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false,
        };
        this.handleReset = this.handleReset.bind(this);
        this.handleTryBack = this.handleTryBack.bind(this);
        this.toggleDetails = this.toggleDetails.bind(this);
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ error, errorInfo });
        console.error('[Zigsy Error Boundary]', error, errorInfo);
    }

    handleReset() {
        this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
        if (this.props.onReset) {
            this.props.onReset();
        } else {
            window.location.reload();
        }
    }

    handleTryBack() {
        this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
    }

    toggleDetails() {
        this.setState((prev) => ({ showDetails: !prev.showDetails }));
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        const { error, errorInfo, showDetails } = this.state;
        const errorMessage = error?.message || 'An unexpected error occurred.';
        const errorStack = error?.stack || '';
        const componentStack = errorInfo?.componentStack || '';

        return (
            <div className="flex-1 w-full max-w-md mx-auto bg-white flex flex-col h-full overflow-hidden">
                <header className="px-4 py-4 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10 shrink-0 shadow-sm">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={this.handleTryBack}
                            className="p-1.5 hover:bg-gray-50 rounded-full transition-colors text-gray-700 active:scale-95 duration-150"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Something went wrong</h1>
                    </div>
                    <div className="text-lg font-black text-[#C21807] uppercase tracking-tighter">
                        ZIGSY
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
                    <div className="bg-red-50/50 rounded-3xl p-5 border border-red-100/50 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#C21807]/10 flex items-center justify-center text-[#C21807] shrink-0">
                            <AlertTriangle size={20} />
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-sm">Application Error</h3>
                            <p className="text-xs text-gray-500 leading-normal break-words">
                                {errorMessage}
                            </p>
                        </div>
                    </div>

                    <section className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">What you can do</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C21807] shrink-0 mt-1.5" />
                                Go back to the previous screen using the arrow above.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C21807] shrink-0 mt-1.5" />
                                Reload the app if the error persists.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C21807] shrink-0 mt-1.5" />
                                If the issue continues, try clearing your browser cache and reloading.
                            </li>
                        </ul>
                    </section>

                    <section className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                        <button
                            onClick={this.toggleDetails}
                            className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
                        >
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Error Details
                            </span>
                            {showDetails ? (
                                <ChevronUp size={16} className="text-gray-400" />
                            ) : (
                                <ChevronDown size={16} className="text-gray-400" />
                            )}
                        </button>

                        {showDetails && (
                            <div className="px-5 pb-5 space-y-3 border-t border-gray-50">
                                {errorStack && (
                                    <div className="space-y-1.5 pt-3">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stack Trace</p>
                                        <pre className="text-[10px] text-gray-600 bg-gray-50 rounded-2xl p-3 overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap break-all border border-gray-100">
                                            {errorStack}
                                        </pre>
                                    </div>
                                )}
                                {componentStack && (
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Component Stack</p>
                                        <pre className="text-[10px] text-gray-600 bg-gray-50 rounded-2xl p-3 overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap break-all border border-gray-100">
                                            {componentStack}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    <section className="space-y-3 pt-2 pb-6">
                        <button
                            onClick={this.handleReset}
                            className="w-full bg-[#C21807] hover:bg-[#A31405] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] duration-150"
                        >
                            <RefreshCw size={15} />
                            Reload App
                        </button>
                        <button
                            onClick={this.handleTryBack}
                            className="w-full bg-white border border-gray-200 hover:border-gray-300 text-gray-800 text-xs font-bold uppercase tracking-wider py-4 rounded-2xl transition-all duration-150 active:scale-[0.98]"
                        >
                            Try Going Back
                        </button>
                    </section>
                </div>
            </div>
        );
    }
}

export default ErrorBoundary;
