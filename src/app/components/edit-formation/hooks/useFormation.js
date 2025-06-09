import { useState, useEffect } from 'react'
import {supabase} from "@/app/lib/supabase";

export const useFormation = () => {
  const [players, setPlayers] = useState([])
  const [substitutes, setSubstitutes] = useState([])
  const [allPlayers, setAllPlayers] = useState([])
  const [formations, setFormations] = useState([])
  const [selectedFormation, setSelectedFormation] = useState(null)

  // 포메이션 목록 불러오기
  useEffect(() => {
    fetchFormations()
  }, [])

  // 선택된 포메이션의 선수 데이터 불러오기
  useEffect(() => {
    if (selectedFormation) {
      fetchPlayersFromFormation(selectedFormation.id)
    }
  }, [selectedFormation])

  const fetchFormations = async () => {
    const { data, error } = await supabase
      .from('formations')
      .select('*')

    if (!error) {
      setFormations(data)
      if (data.length > 0) {
        setSelectedFormation(data[0])
      }
    }
  }

  const fetchPlayersFromFormation = async (formationId) => {
    const { data, error } = await supabase
      .from('player_positions')
      .select('*')
      .eq('formation_id', formationId)

    if (!error) {
      const fieldPlayers = data.filter(player => !player.is_substitute && player.position_x !== null)
      const substitutePlayers = data.filter(player => player.is_substitute)
      const waitingPlayers = data.filter(player => !player.is_substitute && player.position_x === null)

      setPlayers(fieldPlayers)
      setSubstitutes(substitutePlayers)
      setAllPlayers([...fieldPlayers, ...substitutePlayers, ...waitingPlayers])
    }
  }

  const addPlayer = async (playerData) => {
    if (!selectedFormation) return false

    try {
      const { data, error } = await supabase
        .from('player_positions')
        .insert({
          formation_id: selectedFormation.id,
          ...playerData,
          position_x: null,
          position_y: null,
          is_substitute: false
        })
        .select()

      if (error) throw error

      const newPlayer = data[0]
      setAllPlayers([...allPlayers, newPlayer])
      return true
    } catch (error) {
      console.error('선수 추가 오류:', error)
      return false
    }
  }

  const removePlayer = async (playerId, isSubstitute = false) => {
    try {
      const { error } = await supabase
        .from('player_positions')
        .delete()
        .eq('id', playerId)

      if (error) throw error

      if (isSubstitute) {
        setSubstitutes(substitutes.filter(p => p.id !== playerId))
      } else {
        setPlayers(players.filter(p => p.id !== playerId))
      }
      setAllPlayers(allPlayers.filter(p => p.id !== playerId))
      return true
    } catch (error) {
      console.error('선수 삭제 오류:', error)
      return false
    }
  }

  const removeFromSubstitutes = async (playerId) => {
    try {
      const { error } = await supabase
        .from('player_positions')
        .update({
          is_substitute: false,
          substitute_order: null,
          position_x: null,
          position_y: null
        })
        .eq('id', playerId)

      if (error) throw error

      const player = substitutes.find(p => p.id === playerId)
      if (player) {
        const updatedPlayer = {
          ...player,
          is_substitute: false,
          substitute_order: null,
          position_x: null,
          position_y: null
        }

        setSubstitutes(substitutes.filter(p => p.id !== playerId))
        setAllPlayers(allPlayers.map(p => p.id === playerId ? updatedPlayer : p))
      }
      return true
    } catch (error) {
      console.error('교체 명단 제거 오류:', error)
      return false
    }
  }

  const updatePlayer = async (playerId, updateData) => {
    try {
      const { error } = await supabase
        .from('player_positions')
        .update(updateData)
        .eq('id', playerId)

      if (error) throw error

      const updatePlayerInArray = (players) =>
        players.map(p => p.id === playerId ? { ...p, ...updateData } : p)

      setPlayers(updatePlayerInArray(players))
      setSubstitutes(updatePlayerInArray(substitutes))
      setAllPlayers(updatePlayerInArray(allPlayers))
      return true
    } catch (error) {
      console.error('선수 정보 수정 오류:', error)
      return false
    }
  }

  const saveFormation = async () => {
    if (!selectedFormation) return false

    try {
      await supabase
        .from('player_positions')
        .delete()
        .eq('formation_id', selectedFormation.id)

      const allPlayerData = [...players, ...substitutes]
      const playerData = allPlayerData.map(player => ({
        formation_id: selectedFormation.id,
        player_name: player.player_name,
        jersey_number: player.jersey_number,
        position_x: player.position_x || null,
        position_y: player.position_y || null,
        is_substitute: player.is_substitute || false,
        substitute_order: player.substitute_order || null,
        position_role: player.position_role || null
      }))

      const { error } = await supabase
        .from('player_positions')
        .insert(playerData)

      if (error) throw error
      return true
    } catch (error) {
      console.error('포메이션 저장 오류:', error)
      return false
    }
  }

  return {
    players,
    setPlayers,
    substitutes,
    setSubstitutes,
    allPlayers,
    setAllPlayers,
    formations,
    selectedFormation,
    setSelectedFormation,
    addPlayer,
    removePlayer,
    removeFromSubstitutes,
    updatePlayer,
    saveFormation
  }
}
