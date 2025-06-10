export default function SubstituteList({
                                         substitutes,
                                         onDragStart,
                                         onRemoveFromSubstitutes
                                       }) {
  const handleRemove = async (playerId) => {
    const success = await onRemoveFromSubstitutes(playerId)
    if (success) {
      alert('교체 명단에서 제거되었습니다!')
    } else {
      alert('교체 명단 제거 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md border h-full flex flex-col">
      <div className="p-4 border-b flex-shrink-0">
        <h3 className="font-bold text-gray-900 text-base">교체 명단</h3>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        <div className="h-full overflow-y-auto space-y-2">
          {substitutes.map(player => (
            <div
              key={player.id}
              className="flex items-center justify-between p-3 bg-yellow-100 rounded cursor-move border hover:bg-yellow-200 transition-colors"
              draggable
              onDragStart={(e) => onDragStart(e, player)}
            >
              <span className="font-semibold text-gray-900">
                #{player.jersey_number} {player.player_name}
              </span>
              <button
                onClick={() => handleRemove(player.id)}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                제외
              </button>
            </div>
          ))}

          {substitutes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              교체 명단이 비어있습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
