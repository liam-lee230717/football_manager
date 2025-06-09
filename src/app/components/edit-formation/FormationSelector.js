export default function FormationSelector({ formations, selectedFormation, onFormationChange }) {
  return (
    <div className="mb-4">
      <label className="block text-base font-semibold text-gray-900 mb-2">
        편집할 포메이션 선택
      </label>
      <select
        className="border border-gray-300 rounded-md px-3 py-2 w-64 text-gray-900 font-medium"
        value={selectedFormation?.id || ''}
        onChange={(e) => {
          const formation = formations.find(f => f.id === parseInt(e.target.value))
          onFormationChange(formation)
        }}
      >
        {formations.map(formation => (
          <option key={formation.id} value={formation.id}>
            {formation.name} ({formation.formation_type})
          </option>
        ))}
      </select>
    </div>
  )
}
