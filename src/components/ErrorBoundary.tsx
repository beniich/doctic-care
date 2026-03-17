import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[GlobalErrorBoundary] Uncaught error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0d0a25] gap-6 p-8 text-center">
          {/* Decorative glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px]" />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(239,68,68,0.3)]">
              ⚠️
            </div>
            <h1 className="text-2xl font-bold text-white">Oups, quelque chose s'est mal passé</h1>
            <p className="text-sm text-white/50 max-w-sm leading-relaxed">
              Une erreur inattendue s'est produite. Vos données sont en sécurité.
              {this.state.error && (
                <span className="block mt-2 font-mono text-xs text-red-400/70 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
                  {this.state.error.message}
                </span>
              )}
            </p>
            <button
              onClick={this.handleReset}
              className="mt-2 px-6 py-2.5 rounded-xl bg-primary/20 border border-primary/40 text-primary text-sm font-semibold hover:bg-primary/30 hover:shadow-[0_0_20px_rgba(0,200,255,0.3)] transition-all duration-200"
            >
              Retourner au tableau de bord
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
