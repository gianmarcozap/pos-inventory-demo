import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Divas Sullana POS:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen bg-[#FFFDF7] flex flex-col items-center justify-center p-6 text-center text-stone-900 select-none">
          <div className="w-14 h-14 rounded-2xl bg-[#FFB366]/20 border border-[#FFB366]/40 flex items-center justify-center text-amber-800 mb-4 shadow-warm">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-[#1C1917] tracking-tight">
            Se produjo un inconveniente en la vista
          </h2>
          <p className="text-xs text-stone-600 mt-1.5 max-w-md">
            {this.state.error?.message || 'Ha ocurrido un error inesperado al renderizar el componente.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.reload()
            }}
            className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFD54F] hover:bg-[#FFCA28] text-stone-900 font-bold text-xs border border-[#FFE8A1] shadow-warm transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Recargar Terminal POS</span>
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
