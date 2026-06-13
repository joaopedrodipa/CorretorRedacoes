import Sidebar from '../components/shared/Sidebar'
import EssayEditor from '../components/essays/EssayEditor'
import EssayFeedbackPanel from '../components/essays/EssayFeedbackPanel'

export default function HomePage({ user, essays, selectedEssay, setSelectedEssay, submitEssay, deleteEssay }) {
  return (
    <>
      <Sidebar
        essays={essays}
        selectedEssay={selectedEssay}
        onSelect={setSelectedEssay}
        onDelete={deleteEssay}
        onNewEssay={() => setSelectedEssay(null)}
      />

      <main className="flex flex-1 gap-4 p-4 overflow-hidden">
        <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col" style={{ padding: '13px' }}>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">Nova correção</h2>
          <EssayEditor userGrade={user.grade} essay={selectedEssay} onSubmit={submitEssay} />
        </div>

        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-y-auto" style={{ padding: '13px' }}>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">Feedback</h2>
          <EssayFeedbackPanel feedback={selectedEssay?.feedback ?? null} />
        </div>
      </main>
    </>
  )
}
