import { useRef } from 'react'

export default function FootballField({
                                        players,
                                        onDragStart,
                                        onDragOver,
                                        onDrop,
                                        onPlayerClick,
                                        onSave,
                                        onCapture
                                      }) {
  const fieldRef = useRef(null)

  const handleDrop = (e) => {
    onDrop(e, fieldRef)
  }

  const captureField = async () => {
    if (!fieldRef.current) return

    try {
      const domtoimage = (await import('dom-to-image')).default
      const rect = fieldRef.current.getBoundingClientRect()

      const dataUrl = await domtoimage.toPng(fieldRef.current, {
        quality: 1.0,
        bgcolor: '#ffffff',
        width: rect.width,
        height: rect.height,
        style: {
          border: 'none',
          borderRadius: '0px',
          padding: '40px'
        },
        filter: (node) => {
          if (node.classList && node.classList.contains('border-dashed')) {
            return false
          }
          return true
        }
      })

      const link = document.createElement('a')
      link.download = `formation-${new Date().toISOString().slice(0, 10)}.png`
      link.href = dataUrl

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      alert('포메이션 스크린샷이 저장되었습니다!')
    } catch (error) {
      console.error('스크린샷 캡처 오류:', error)
      alert('스크린샷 저장 중 오류가 발생했습니다.')
    }
  }

  const handleSave = async () => {
    const success = await onSave()
    if (success) {
      alert('포메이션이 저장되었습니다!')
    } else {
      alert('저장 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md border p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 text-base">축구장</h3>
        <div className="flex gap-3">
          <button
            onClick={captureField}
            className="bg-green-500 text-white px-4 py-2 rounded font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            스크린샷
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-6 py-2 rounded font-semibold hover:bg-blue-600 transition-colors"
          >
            저장
          </button>
        </div>
      </div>

      <div
        ref={fieldRef}
        className="relative w-full mx-auto bg-center bg-contain bg-no-repeat"
        style={{
          backgroundImage: "url('/Image/field.png')",
          backgroundSize: 'contain',
          height: '600px',
          maxWidth: '800px',
          padding: '50px'
        }}
        onDragOver={onDragOver}
        onDrop={handleDrop}
      >
        {/* 필드에 배치된 선수들 */}
        {players.filter(p => p.position_x !== null).map(player => (
          <div
            key={player.id}
            className="absolute cursor-move transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${player.position_x}%`,
              top: `${player.position_y}%`
            }}
            draggable
            onDragStart={(e) => onDragStart(e, player)}
            onClick={() => onPlayerClick(player)}
          >
            {/* 선수 번호 원 */}
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
              {player.jersey_number}
            </div>
            {/* 선수 이름 */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
              <span className="bg-white text-gray-900 text-xs font-semibold px-2 py-1 rounded shadow-md whitespace-nowrap">
                {player.player_name}
              </span>
            </div>
          </div>
        ))}

        {/* 드롭 안내 텍스트 */}
        {players.filter(p => p.position_x !== null).length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-700 text-center font-semibold text-lg bg-white bg-opacity-80 px-4 py-2 rounded-lg">
              선수를 여기로 드래그하여 배치하세요
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
