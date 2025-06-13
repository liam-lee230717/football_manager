import { useState, useEffect } from 'react'

const POSITIONS = [
  { value: '', label: '포지션 선택' },
  { value: 'GK', label: '골키퍼 (GK)' },
  { value: 'CB', label: '센터백 (CB)' },
  { value: 'LB', label: '좌측백 (LB)' },
  { value: 'RB', label: '우측백 (RB)' },
  { value: 'CDM', label: '수비형 미드필더 (CDM)' },
  { value: 'CM', label: '센터 미드필더 (CM)' },
  { value: 'CAM', label: '공격형 미드필더 (CAM)' },
  { value: 'LW', label: '좌측 윙어 (LW)' },
  { value: 'RW', label: '우측 윙어 (RW)' },
  { value: 'ST', label: '스트라이커 (ST)' }
]

export default function PlayerList({
                                     allPlayers,
                                     onDragStart,
                                     onTouchStart,
                                     onTouchMove,
                                     onTouchEnd,
                                     onRemovePlayer,
                                     onUpdatePlayer,
                                     isDragging
                                   }) {
  const [isOpen, setIsOpen] = useState(true)
  const [editingPlayer, setEditingPlayer] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', jersey: '', position: '' })
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // 터치 디바이스 및 데스크톱 환경 감지
  useEffect(() => {
    const checkDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
      setIsDesktop(window.innerWidth >= 1280)
    }

    checkDevice()

    // 윈도우 리사이즈 시에도 다시 확인
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1280)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const startEdit = (player) => {
    setEditingPlayer(player.id)
    setEditForm({
      name: player.player_name || '',
      jersey: player.jersey_number ? player.jersey_number.toString() : '',
      position: player.position_role || ''
    })
  }

  const cancelEdit = () => {
    setEditingPlayer(null)
    setEditForm({ name: '', jersey: '', position: '' })
  }

  const saveEdit = async (playerId) => {
    if (!editForm.name.trim()){
      return alert("선수 이름을 입력 해 주세요.")
    }

    const success = await onUpdatePlayer(playerId, {
      player_name: editForm.name.trim(),
      jersey_number: editForm.jersey.trim() ? parseInt(editForm.jersey) : null,
      position_role: editForm.position || null
    })

    if (success) {
      setEditingPlayer(null)
      setEditForm({ name: '', jersey: '', position: '' })
      alert('선수 정보가 수정되었습니다!')
    } else {
      alert('선수 정보 수정 중 오류가 발생했습니다.')
    }
  }

  const handleRemove = async (playerId, isSubstitute) => {
    const success = await onRemovePlayer(playerId, isSubstitute)
    if (success) {
      alert('선수가 삭제되었습니다!')
    } else {
      alert('선수 삭제 중 오류가 발생했습니다.')
    }
  }

  const getPlayerStatus = (player) => {
    if (player.is_substitute) return '교체 명단'
    if (player.position_x !== null) return '필드'
    return '대기'
  }

  const getContainerHeight = () => {
    if (!isOpen) return 'auto'
    return isDesktop ? '100%' : '400px'
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-md border ${isOpen ? 'xl:h-full xl:flex xl:flex-col flex flex-col' : 'h-auto'}`}
      style={{ height: getContainerHeight() }}
    >
      <div
        className={`p-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors ${isOpen ? 'border-b flex-shrink-0' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-bold text-gray-900 text-base">
          선수 명단 ({allPlayers.length}명)
        </h3>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="flex-1 min-h-0 p-4">
          <div className="h-full overflow-y-auto space-y-2">
            {allPlayers.map(player => (
              <div key={player.id} className="group border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                {editingPlayer === player.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2 text-sm font-medium text-gray-900 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="선수 이름"
                      />
                      <input
                        type="number"
                        value={editForm.jersey}
                        onChange={(e) => setEditForm({ ...editForm, jersey: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2 text-sm font-medium text-gray-900 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="등번호"
                        min="1"
                        max="99"
                      />
                    </div>
                    <select
                      value={editForm.position}
                      onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-medium text-gray-900 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      {POSITIONS.map(pos => (
                        <option key={pos.value} value={pos.value}>
                          {pos.label}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(player.id)}
                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-blue-600 transition-colors shadow-sm"
                      >
                        저장
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 bg-gray-500 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-gray-600 transition-colors shadow-sm"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex-1 cursor-move ${isDragging ? 'opacity-50' : ''}`}
                      style={{ touchAction: 'none' }}
                      // PC용 드래그 이벤트
                      draggable
                      onDragStart={(e) => {
                        console.log('선수 목록에서 PC 드래그 시작:', player.player_name)
                        onDragStart(e, player)
                      }}
                      // 모바일용 터치 이벤트
                      onTouchStart={(e) => {
                        console.log('선수 목록에서 터치 시작:', player.player_name)
                        onTouchStart(e, player)
                      }}
                      onTouchMove={(e) => {
                        console.log('선수 목록에서 터치 이동')
                        onTouchMove(e)
                      }}
                      onTouchEnd={(e) => {
                        console.log('선수 목록에서 터치 종료')
                        onTouchEnd(e)
                      }}
                      onClick={() => !isDragging && startEdit(player)}
                    >
                      <div className="font-semibold text-gray-900">
                        #{player.jersey_number || ''} {player.player_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {player.position_role && `${player.position_role} • `}
                        {getPlayerStatus(player)}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(player.id, player.is_substitute)
                      }}
                      className={`bg-red-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-red-600 transition-all ml-2 ${
                        isTouchDevice
                          ? 'opacity-100' // 터치 디바이스에서는 항상 표시
                          : 'opacity-0 group-hover:opacity-100' // PC에서는 hover 시에만 표시
                      }`}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            ))}

            {allPlayers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                등록된 선수가 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
