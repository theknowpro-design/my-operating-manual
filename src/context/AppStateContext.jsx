import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { TOTAL_PHASES } from '../data/phases.js'
import { generateManualMarkdown } from '../utils/manualGenerator.js'

const AppStateContext = createContext(null)

const initialState = {
  view: 'landing',
  currentPhase: 0,
  responses: {},
  optionalResponses: {},
  manualMarkdown: '',
  isInterviewComplete: false,
  authorName: '',
}

export function AppStateProvider({ children }) {
  const [state, setState] = useState(initialState)

  const setView = useCallback((view) => {
    setState((prev) => ({ ...prev, view }))
  }, [])

  const setAuthorName = useCallback((authorName) => {
    setState((prev) => ({ ...prev, authorName }))
  }, [])

  const setCurrentPhase = useCallback((currentPhase) => {
    setState((prev) => ({
      ...prev,
      currentPhase: Math.max(0, Math.min(TOTAL_PHASES - 1, currentPhase)),
    }))
  }, [])

  const setResponse = useCallback((phaseId, value) => {
    setState((prev) => ({
      ...prev,
      responses: { ...prev.responses, [phaseId]: value },
    }))
  }, [])

  const setOptionalResponse = useCallback((questionId, value) => {
    setState((prev) => ({
      ...prev,
      optionalResponses: { ...prev.optionalResponses, [questionId]: value },
    }))
  }, [])

  const goNextPhase = useCallback(() => {
    setState((prev) => {
      if (prev.currentPhase >= TOTAL_PHASES - 1) {
        const manualMarkdown = generateManualMarkdown({
          responses: prev.responses,
          optionalResponses: prev.optionalResponses,
          authorName: prev.authorName,
        })
        return {
          ...prev,
          isInterviewComplete: true,
          manualMarkdown,
          view: 'output',
        }
      }
      return { ...prev, currentPhase: prev.currentPhase + 1 }
    })
  }, [])

  const goPrevPhase = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentPhase: Math.max(0, prev.currentPhase - 1),
    }))
  }, [])

  const completeInterview = useCallback(() => {
    setState((prev) => {
      const manualMarkdown = generateManualMarkdown({
        responses: prev.responses,
        optionalResponses: prev.optionalResponses,
        authorName: prev.authorName,
      })
      return {
        ...prev,
        isInterviewComplete: true,
        manualMarkdown,
        view: 'output',
      }
    })
  }, [])

  const regenerateManual = useCallback(() => {
    setState((prev) => ({
      ...prev,
      manualMarkdown: generateManualMarkdown({
        responses: prev.responses,
        optionalResponses: prev.optionalResponses,
        authorName: prev.authorName,
      }),
    }))
  }, [])

  const resetInterview = useCallback(() => {
    setState({ ...initialState })
  }, [])

  const startInterview = useCallback((authorName = '') => {
    setState({
      ...initialState,
      view: 'interview',
      authorName: authorName || '',
    })
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      setView,
      setAuthorName,
      setCurrentPhase,
      setResponse,
      setOptionalResponse,
      goNextPhase,
      goPrevPhase,
      completeInterview,
      regenerateManual,
      resetInterview,
      startInterview,
      totalPhases: TOTAL_PHASES,
      progress: state.isInterviewComplete
        ? 100
        : ((state.currentPhase + 1) / TOTAL_PHASES) * 100,
    }),
    [
      state,
      setView,
      setAuthorName,
      setCurrentPhase,
      setResponse,
      setOptionalResponse,
      goNextPhase,
      goPrevPhase,
      completeInterview,
      regenerateManual,
      resetInterview,
      startInterview,
    ],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}

export default AppStateContext
