import { useState } from 'react'

const POSITIONS = [
  { value: '', label: '포지션 선택 (선택사항)' },
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

export default function PlayerForm({ onAddPlayer }) {
  const [playerName, setPlayerName] = useState('')
  const [jerseyNumber, setJerseyNumber] = useState('')
  const [position, setPosition] = useState('')

  const handleSubmit = async () => {
    if (!playerName.trim()){
      return alert("선수 이름을 입력 해 주세요.")
    }

    const success = await onAddPlayer({
      player_name: playerName,
      jersey_number: jerseyNumber ? parseInt(jerseyNumber) : null,
      position_role: position || null
    })

    if (success) {
      setPlayerName('')
      setJerseyNumber('')
      setPosition('')
      alert('선수가 추가되었습니다!')
    } else {
      alert('선수 추가 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md border p-4 mb-4">
      <h3 className="font-bold text-gray-900 mb-3 text-base">선수 추가</h3>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="선수 이름"
          className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 font-medium"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <input
          type="number"
          placeholder="등번호"
          className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 font-medium"
          value={jerseyNumber}
          onChange={(e) => setJerseyNumber(e.target.value)}
        />
        <select
          className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 font-medium"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        >
          {POSITIONS.map(pos => (
            <option key={pos.value} value={pos.value}>
              {pos.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white px-3 py-2 rounded font-semibold hover:bg-blue-600 transition-colors"
        >
          선수 추가
        </button>
      </div>
    </div>
  )
}
