import { useState, useRef, useEffect } from 'react'

export const useFieldInteractions = ({
                                       players,
                                       setPlayers,
                                       substitutes,
                                       setSubstitutes,
                                       allPlayers,
                                       setAllPlayers,
                                       updatePlayer
                                     }) => {
  const [draggedPlayer, setDraggedPlayer] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const touchStartPos = useRef({ x: 0, y: 0 })
  const fieldRef = useRef(null)
  const dragThreshold = 10 // 드래그로 인식할 최소 이동 거리

  // Non-passive 터치 이벤트 리스너 등록
  useEffect(() => {
    const handleTouchMoveGlobal = (e) => {
      if (isDragging) {
        e.preventDefault()
      }
    }

    // 전역 터치 이벤트를 non-passive로 등록
    document.addEventListener('touchmove', handleTouchMoveGlobal, { passive: false })

    return () => {
      document.removeEventListener('touchmove', handleTouchMoveGlobal)
    }
  }, [isDragging])

  // 마우스 드래그 (PC용)
  const handleDragStart = (e, player) => {
    setDraggedPlayer(player)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleFieldDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleFieldDrop = async (e, fieldRefParam) => {
    e.preventDefault()
    await dropPlayer(e, fieldRefParam || fieldRef, e.clientX, e.clientY)
  }

  // 터치 드래그 (모바일용)
  const handleTouchStart = (e, player) => {

    // 터치 이벤트가 유효한지 확인
    if (!e.touches || e.touches.length === 0) {
      console.warn('터치 이벤트가 유효하지 않음')
      return
    }

    const touch = e.touches[0]

    // 터치 좌표가 유효한지 확인
    if (typeof touch.clientX !== 'number' || typeof touch.clientY !== 'number') {
      console.warn('터치 좌표가 유효하지 않음')
      return
    }

    touchStartPos.current = { x: touch.clientX, y: touch.clientY }
    setDraggedPlayer(player)
    setIsDragging(false)
  }

  const handleTouchMove = (e) => {
    if (!draggedPlayer) return

    // 터치 이벤트가 유효한지 확인
    if (!e.touches || e.touches.length === 0) {
      return
    }

    const touch = e.touches[0]

    // 터치 좌표가 유효한지 확인
    if (typeof touch.clientX !== 'number' || typeof touch.clientY !== 'number') {
      return
    }

    const deltaX = Math.abs(touch.clientX - touchStartPos.current.x)
    const deltaY = Math.abs(touch.clientY - touchStartPos.current.y)

    // 드래그 임계값을 넘으면 드래그 모드로 전환
    if (deltaX > dragThreshold || deltaY > dragThreshold) {
      if (!isDragging) {
        setIsDragging(true)
      }
    }
  }

  const handleTouchEnd = async (e, fieldRefParam) => {

    if (!draggedPlayer) {
      setIsDragging(false)
      return
    }

    if (!isDragging) {
      setDraggedPlayer(null)
      setIsDragging(false)
      return
    }

    // 터치 이벤트가 유효한지 확인
    if (!e.changedTouches || e.changedTouches.length === 0) {
      setDraggedPlayer(null)
      setIsDragging(false)
      return
    }

    const touch = e.changedTouches[0]

    // 터치 좌표가 유효한지 확인
    if (typeof touch.clientX !== 'number' || typeof touch.clientY !== 'number') {
      console.warn('유효하지 않은 터치 좌표')
      setDraggedPlayer(null)
      setIsDragging(false)
      return
    }

    await dropPlayer(e, fieldRefParam || fieldRef, touch.clientX, touch.clientY)
    setIsDragging(false)
  }

  // 공통 드롭 로직
  const dropPlayer = async (e, fieldRef, clientX, clientY) => {

    if (!draggedPlayer) {
      setDraggedPlayer(null)
      return
    }

    // fieldRef가 존재하고 current가 유효한지 확인
    if (!fieldRef || !fieldRef.current) {
      console.warn('Field reference가 사용할 수 없음')
      setDraggedPlayer(null)
      return
    }

    try {
      const fieldRect = fieldRef.current.getBoundingClientRect()

      // getBoundingClientRect 결과가 유효한지 확인
      if (!fieldRect || fieldRect.width === 0 || fieldRect.height === 0) {
        console.warn('필드 크기가 사용할 수 없음')
        setDraggedPlayer(null)
        return
      }

      const x = ((clientX - fieldRect.left) / fieldRect.width) * 100
      const y = ((clientY - fieldRect.top) / fieldRect.height) * 100

      // 필드 경계 체크
      if (x < 0 || x > 100 || y < 0 || y > 100) {
        setDraggedPlayer(null)
        return
      }

      const updatedPlayer = {
        ...draggedPlayer,
        position_x: x,
        position_y: y,
        is_substitute: false
      }

      // 데이터베이스 업데이트
      const success = await updatePlayer(draggedPlayer.id, {
        position_x: x,
        position_y: y,
        is_substitute: false,
        substitute_order: null
      })

      if (!success) {
        console.error('데이터베이스 업데이트 실패')
        alert('선수 위치 업데이트 중 오류가 발생했습니다.')
        setDraggedPlayer(null)
        return
      }

      // 상태 업데이트
      if (draggedPlayer.is_substitute) {
        setSubstitutes(prev => prev.filter(p => p.id !== draggedPlayer.id))
        setPlayers(prev => [...prev, updatedPlayer])
        setAllPlayers(prev => prev.map(p => p.id === draggedPlayer.id ? updatedPlayer : p))
      } else {
        const existingPlayerIndex = players.findIndex(p => p.id === draggedPlayer.id)

        if (existingPlayerIndex >= 0) {
          setPlayers(prev => prev.map(p => p.id === draggedPlayer.id ? updatedPlayer : p))
        } else {
          setPlayers(prev => [...prev, updatedPlayer])
        }

        setAllPlayers(prev => prev.map(p => p.id === draggedPlayer.id ? updatedPlayer : p))
      }

      setDraggedPlayer(null)
    } catch (error) {
      console.error('dropPlayer에서 에러 발생:', error)
      setDraggedPlayer(null)
    }
  }

  const moveToSubstitutes = async (player) => {
    const substitute = {
      ...player,
      is_substitute: true,
      substitute_order: substitutes.length + 1,
      position_x: null,
      position_y: null
    }

    const success = await updatePlayer(player.id, {
      is_substitute: true,
      substitute_order: substitutes.length + 1,
      position_x: null,
      position_y: null
    })

    if (!success) {
      alert('교체 명단 이동 중 오류가 발생했습니다.')
      return
    }

    setPlayers(players.filter(p => p.id !== player.id))
    setSubstitutes([...substitutes, substitute])
    setAllPlayers(allPlayers.map(p => p.id === player.id ? substitute : p))
  }

  return {
    draggedPlayer,
    isDragging,
    fieldRef,
    // 마우스 이벤트 (PC용)
    handleDragStart,
    handleFieldDragOver,
    handleFieldDrop,
    // 터치 이벤트 (모바일용)
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    moveToSubstitutes
  }
}
