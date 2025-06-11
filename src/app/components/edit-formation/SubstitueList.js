import { useState, useEffect } from 'react'

export default function SubstituteList({
                                         substitutes,
                                         onDragStart,
                                         onTouchStart,
                                         onTouchMove,
                                         onTouchEnd,
                                         onRemoveFromSubstitutes,
                                         isDragging
                                       }) {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // 터치 디바이스 감지
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }

    checkTouchDevice()

    // 윈도우 리사이즈 시에도 다시 확인
    window.addEventListener('resize', checkTouchDevice)
    return () => window.removeEventListener('resize', checkTouchDevice)
  }, [])

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
              className={`group flex items-center justify-between p-3 bg-yellow-100 rounded cursor-move border hover:bg-yellow-200 transition-colors ${isDragging ? 'opacity-50' : ''}`}
              // PC용 드래그 이벤트
              draggable
              onDragStart={(e) => onDragStart(e, player)}
              // 모바일용 터치 이벤트
              onTouchStart={(e) => onTouchStart(e, player)}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <span className="font-semibold text-gray-900 flex-1">
                #{player.jersey_number || ''} {player.player_name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(player.id)
                }}
                className={`text-red-600 hover:text-red-800 font-medium text-sm px-2 py-1 rounded transition-colors ${
                  isTouchDevice
                    ? 'opacity-100' // 터치 디바이스에서는 항상 표시
                    : 'opacity-70 group-hover:opacity-100' // PC에서는 hover 시 더 진하게
                }`}
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
