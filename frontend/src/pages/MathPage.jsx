import Sidebar from '../components/shared/Sidebar'
import MathEditor from '../components/math/MathEditor'
import MathFeedbackPanel from '../components/math/MathFeedbackPanel'

export default function MathPage({ exercises, selectedExercise, mathFeedback, selectExercise, setSelectedExercise, submitExercise, submitCalc, deleteExercise }) {
  return (
    <>
      <Sidebar
        essays={exercises}
        selectedEssay={selectedExercise}
        onSelect={selectExercise}
        onDelete={deleteExercise}
        onNewEssay={() => setSelectedExercise(null)}
        emptyMessage="Nenhum exercício ainda."
      />

      <main className="flex flex-1 gap-4 p-4 overflow-hidden">
        <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col" style={{ padding: '13px' }}>
          <MathEditor
            exercise={selectedExercise}
            onSubmitExercise={submitExercise}
            onSubmitCalc={submitCalc}
          />
        </div>

        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-y-auto" style={{ padding: '13px' }}>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">Feedback</h2>
          <MathFeedbackPanel feedback={mathFeedback} />
        </div>
      </main>
    </>
  )
}
