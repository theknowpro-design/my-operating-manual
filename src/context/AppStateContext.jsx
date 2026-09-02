import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { TOTAL_PHASES } from '../data/phases.js'
import { generateManualMarkdown } from '../utils/manualGenerator.js'
import {
  createPipelineError,
  logPipelineError,
} from '../../modules/pipeline/errorHandler.js'
import {
  validateResponseValue,
  validateAuthorName,
  validatePhaseNumber,
} from '../utils/validatePipelineState.js'

const AppStateContext = createContext(null)

const initialState = {
  view: 'landing',
  currentPhase: 0,
  responses: {},
  optionalResponses: {},
  manualMarkdown: '',
  isInterviewComplete: false,
  authorName: '',
  profilePhoto: null,
  rightTileLink: '',
  rightTileImage: null,
  error: null,
  isLoading: false,
}

export function AppStateProvider({ children }) {
  const [state, setState] = useState(initialState)

  const setView = useCallback((view) => {
    setState((prev) => ({ ...prev, view }))
  }, [])

  const setAuthorName = useCallback((authorName) => {
    const validation = validateAuthorName(authorName);
    if (!validation.isValid) {
      console.error('[Pipeline] Type validation failed:', validation.error);
      throw new Error(validation.error);
    }
    setState((prev) => ({ ...prev, authorName: validation.sanitized }))
  }, [])

  const setProfilePhoto = useCallback((profilePhoto) => {
    setState((prev) => ({ ...prev, profilePhoto }))
  }, [])

  const setRightTileLink = useCallback((rightTileLink) => {
    setState((prev) => ({ ...prev, rightTileLink }))
  }, [])

  const setRightTileImage = useCallback((rightTileImage) => {
    setState((prev) => ({ ...prev, rightTileImage }))
  }, [])

  const setCurrentPhase = useCallback((currentPhase) => {
    const validation = validatePhaseNumber(currentPhase);
    if (!validation.isValid) {
      console.error('[Pipeline] Type validation failed:', validation.error);
      throw new Error(validation.error);
    }
    setState((prev) => ({
      ...prev,
      currentPhase: Math.max(0, Math.min(TOTAL_PHASES - 1, currentPhase)),
    }))
  }, [])

  const setResponse = useCallback((phaseId, value) => {
    const validation = validateResponseValue(value);
    if (!validation.isValid) {
      console.error('[Pipeline] Type validation failed:', validation.error);
      throw new Error(validation.error);
    }
    setState((prev) => ({
      ...prev,
      responses: { ...prev.responses, [phaseId]: validation.sanitized },
    }))
  }, [])

  const setOptionalResponse = useCallback((questionId, value) => {
    const validation = validateResponseValue(value);
    if (!validation.isValid) {
      console.error('[Pipeline] Type validation failed:', validation.error);
      throw new Error(validation.error);
    }
    setState((prev) => ({
      ...prev,
      optionalResponses: { ...prev.optionalResponses, [questionId]: validation.sanitized },
    }))
  }, [])

  const goNextPhase = useCallback(() => {
    setState((prev) => {
      try {
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
            error: null,
            isLoading: false,
          }
        }
        return { ...prev, currentPhase: prev.currentPhase + 1, error: null }
      } catch (err) {
        const error = createPipelineError({
          code: 'PHASE_FAILED',
          message: `Phase ${prev.currentPhase + 1} encountered an error. Please try again.`,
          phaseNumber: prev.currentPhase + 1,
          detail: err?.message || '',
          originalError: err,
        })
        logPipelineError(error, { step: 'goNextPhase', phase: prev.currentPhase + 1 })
        return {
          ...prev,
          error,
          isLoading: false,
        }
      }
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
      try {
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
          error: null,
          isLoading: false,
        }
      } catch (err) {
        const error = createPipelineError({
          code: 'MARKDOWN_GENERATION_FAILED',
          message: 'Could not generate your manual. Please try again.',
          detail: err?.message || '',
          originalError: err,
        })
        logPipelineError(error, { step: 'completeInterview' })
        return {
          ...prev,
          error,
          isLoading: false,
        }
      }
    })
  }, [])

  const regenerateManual = useCallback(() => {
    setState((prev) => {
      try {
        const manualMarkdown = generateManualMarkdown({
          responses: prev.responses,
          optionalResponses: prev.optionalResponses,
          authorName: prev.authorName,
        })
        return {
          ...prev,
          manualMarkdown,
          error: null,
        }
      } catch (err) {
        const error = createPipelineError({
          code: 'GENERATION_FAILED',
          message: 'Could not regenerate your manual. Please try again.',
          detail: err?.message || '',
          originalError: err,
        })
        logPipelineError(error, { step: 'regenerateManual' })
        return {
          ...prev,
          error,
        }
      }
    })
  }, [])

  const resetInterview = useCallback(() => {
    setState({ ...initialState })
  }, [])

  const setError = useCallback((error) => {
    setState((prev) => ({ ...prev, error }))
  }, [])

  const resetError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  const setLoading = useCallback((isLoading) => {
    setState((prev) => ({ ...prev, isLoading }))
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
      setProfilePhoto,
      setRightTileLink,
      setRightTileImage,
      setCurrentPhase,
      setResponse,
      setOptionalResponse,
      goNextPhase,
      goPrevPhase,
      completeInterview,
      regenerateManual,
      resetInterview,
      startInterview,
      setError,
      resetError,
      setLoading,
      totalPhases: TOTAL_PHASES,
      progress: state.isInterviewComplete
        ? 100
        : ((state.currentPhase + 1) / TOTAL_PHASES) * 100,
    }),
    [
      state,
      setView,
      setAuthorName,
      setProfilePhoto,
      setRightTileLink,
      setRightTileImage,
      setCurrentPhase,
      setResponse,
      setOptionalResponse,
      goNextPhase,
      goPrevPhase,
      completeInterview,
      regenerateManual,
      resetInterview,
      startInterview,
      setError,
      resetError,
      setLoading,
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
