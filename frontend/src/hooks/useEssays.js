import { useState, useEffect } from 'react'
import { api } from '../services/api'

export function useEssays(user) {
  const [essays, setEssays] = useState([])
  const [selectedEssay, setSelectedEssay] = useState(null)

  useEffect(() => {
    if (!user) {
      setEssays([])
      setSelectedEssay(null)
      return
    }
    api.getEssays().then(setEssays).catch(() => setEssays([]))
  }, [user])

  async function submitEssay(title, content, textType) {
    const newEssay = await api.submitEssay({ title, content, text_type: textType })
    setEssays((prev) => [newEssay, ...prev])
    setSelectedEssay(newEssay)
    return newEssay
  }

  async function deleteEssay(id) {
    await api.deleteEssay(id)
    setEssays((prev) => prev.filter((e) => e.id !== id))
    setSelectedEssay((prev) => (prev?.id === id ? null : prev))
  }

  return { essays, selectedEssay, setSelectedEssay, submitEssay, deleteEssay }
}
