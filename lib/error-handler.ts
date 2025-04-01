import React from "react"
import type { ToastActionElement } from "@/components/ui/toast"

type ToastFunction = (props: {
  title?: string
  description?: string
  action?: ToastActionElement
  variant?: "default" | "destructive"
}) => void

export const handleApiError = (
  error: unknown,
  toast: ToastFunction,
  options?: {
    title?: string
    customMessage?: string
    fallbackMessage?: string
    showErrorDetails?: boolean
    onError?: (error: unknown) => void
  },
) => {
  console.error("API Error:", error)

  const title = options?.title || "Error"
  let description = options?.customMessage

  if (!description) {
    if (error instanceof Error) {
      description = options?.showErrorDetails
        ? error.message
        : options?.fallbackMessage || "An unexpected error occurred. Please try again."
    } else if (typeof error === "string") {
      description = options?.showErrorDetails
        ? error
        : options?.fallbackMessage || "An unexpected error occurred. Please try again."
    } else {
      description = options?.fallbackMessage || "An unexpected error occurred. Please try again."
    }
  }

  toast({
    title,
    description,
    variant: "destructive",
  })

  if (options?.onError) {
    options.onError(error)
  }

  return error
}

export const handleFormError = (
  error: unknown,
  toast: ToastFunction,
  setFormError?: (error: string) => void,
  options?: {
    title?: string
    customMessage?: string
    fallbackMessage?: string
    showErrorDetails?: boolean
    onError?: (error: unknown) => void
  },
) => {
  console.error("Form Error:", error)

  const title = options?.title || "Form Error"
  let description = options?.customMessage

  if (!description) {
    if (error instanceof Error) {
      description = options?.showErrorDetails
        ? error.message
        : options?.fallbackMessage || "There was an error submitting the form. Please try again."
    } else if (typeof error === "string") {
      description = options?.showErrorDetails
        ? error
        : options?.fallbackMessage || "There was an error submitting the form. Please try again."
    } else {
      description = options?.fallbackMessage || "There was an error submitting the form. Please try again."
    }
  }

  toast({
    title,
    description,
    variant: "destructive",
  })

  if (setFormError) {
    setFormError(description)
  }

  if (options?.onError) {
    options.onError(error)
  }

  return error
}

export const createErrorBoundary = (
  fallback: React.ReactNode,
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void,
) => {
  return class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
      super(props)
      this.state = { hasError: false }
    }

    static getDerivedStateFromError(_: Error) {
      return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error("Error Boundary caught an error:", error, errorInfo)
      if (onError) {
        onError(error, errorInfo)
      }
    }

    render() {
      if (this.state.hasError) {
        return fallback
      }

      return this.props.children
    }
  }
}

