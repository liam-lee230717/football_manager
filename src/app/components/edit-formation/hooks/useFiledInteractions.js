import { useState } from 'react'

export const useFieldInteractions = ({
                                       players,
                                       setPlayers,
                                       substitutes,
                                       setSubstitutes,
                                       allPlayers,
                                       setAllPlayers,
                                       updatePlayer // 추가된 prop
                                     }) => {
  const [draggedPlayer, setDraggedPlayer] = useState(null)

  const handleDragStart = (e, player) => {
    setDraggedPlayer(player)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleFieldDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleFieldDrop = async (e, fieldRef) => {
    e.preventDefault()

    if (!draggedPlayer || !fieldRef.current) return

    const fieldRect = fieldRef.current.getBoundingClientRect()
    const x = ((e.clientX - fieldRect.left) / fieldRect.width) * 100
    const y = ((e.clientY - fieldRect.top) / fieldRect.height) * 100

    if (x < 0 || x > 100 || y < 0 || y > 100) return

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
      alert('선수 위치 업데이트 중 오류가 발생했습니다.')
      return
    }

    if (draggedPlayer.is_substitute) {
      setSubstitutes(substitutes.filter(p => p.id !== draggedPlayer.id))
      setPlayers([...players, updatedPlayer])
      setAllPlayers(allPlayers.map(p => p.id === draggedPlayer.id ? updatedPlayer : p))
    } else {
      const existingPlayerIndex = players.findIndex(p => p.id === draggedPlayer.id)

      if (existingPlayerIndex >= 0) {
        setPlayers(players.map(p => p.id === draggedPlayer.id ? updatedPlayer : p))
      } else {
        setPlayers([...players, updatedPlayer])
      }

      setAllPlayers(allPlayers.map(p => p.id === draggedPlayer.id ? updatedPlayer : p))
    }

    setDraggedPlayer(null)
  }

  const moveToSubstitutes = async (player) => {
    const substitute = {
      ...player,
      is_substitute: true,
      substitute_order: substitutes.length + 1,
      position_x: null,
      position_y: null
    }

    // 데이터베이스 업데이트
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
    handleDragStart,
    handleFieldDragOver,
    handleFieldDrop,
    moveToSubstitutes
  }
}
