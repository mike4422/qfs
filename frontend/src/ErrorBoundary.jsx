import React from "react"

export default class ErrorBoundary extends React.Component {
  constructor(p){ super(p); this.state = { error: null } }
  static getDerivedStateFromError(e){ return { error: e } }
  componentDidCatch(e, info){ console.error("[ErrorBoundary]", e, info) }

  render(){
    if (this.state.error) {
      return (
        <div style={{ padding: 16 }}>
          <h2 style={{ color: "crimson" }}>UI crashed</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {String(this.state.error?.message || this.state.error)}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
