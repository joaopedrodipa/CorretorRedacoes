import { useState, useEffect } from 'react'
import { api } from '../services/api'

export function useMath(user) {
  const [exercises, setExercises] = useState([])
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [mathFeedback, setMathFeedback] = useState(null)

  useEffect(() => {
    if (!user) {
      setExercises([])
      setSelectedExercise(null)
      setMathFeedback(null)
      return
    }
    api.getExercises().then(setExercises).catch(() => setExercises([]))
  }, [user])

  async function submitExercise(title, content) {
    const newExercise = await api.submitExercise({ title, content })
    setExercises((prev) => [newExercise, ...prev])
    setSelectedExercise(newExercise)
    setMathFeedback(newExercise.feedback)
    return newExercise
  }

  async function submitCalc(content) {
    const feedback = await api.submitCalc({ content })
    setMathFeedback(feedback)
    setSelectedExercise(null)
    return feedback
  }

  async function deleteExercise(id) {
    await api.deleteExercise(id)
    setExercises((prev) => prev.filter((e) => e.id !== id))
    setSelectedExercise((prev) => (prev?.id === id ? null : prev))
    setMathFeedback((prev) => (selectedExercise?.id === id ? null : prev))
  }

  function selectExercise(exercise) {
    setSelectedExercise(exercise)
    setMathFeedback(exercise?.feedback ?? null)
  }

  return { exercises, selectedExercise, mathFeedback, selectExercise, setSelectedExercise, submitExercise, submitCalc, deleteExercise }
}
