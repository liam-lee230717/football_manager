'use client'

import {useFormation} from "@/app/components/edit-formation/hooks/useFormation";
import {useFieldInteractions} from "@/app/components/edit-formation/hooks/useFiledInteractions";
import Layout from "@/app/components/Layout";
import FormationSelector from "@/app/components/edit-formation/FormationSelector";
import PlayerForm from "@/app/components/edit-formation/PlayerForm";
import PlayerList from "@/app/components/edit-formation/PlayerList";
import FootballField from "@/app/components/edit-formation/FootballField";
import SubstituteList from "@/app/components/edit-formation/SubstitueList";

export default function EditFormation() {
  const {
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
  } = useFormation()

  const {
    draggedPlayer,
    isDragging,
    fieldRef,
    // PC용 이벤트
    handleDragStart,
    handleFieldDragOver,
    handleFieldDrop,
    // 모바일용 이벤트
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    moveToSubstitutes
  } = useFieldInteractions({
    players,
    setPlayers,
    substitutes,
    setSubstitutes,
    allPlayers,
    setAllPlayers,
    updatePlayer
  })

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">포메이션 편집</h2>

          <FormationSelector
            formations={formations}
            selectedFormation={selectedFormation}
            onFormationChange={setSelectedFormation}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* 선수 관리 섹션 */}
          <div className="xl:col-span-1 xl:flex xl:flex-col xl:h-[calc(100vh-250px)] space-y-4 xl:space-y-0">
            <div className="xl:flex-shrink-0">
              <PlayerForm onAddPlayer={addPlayer} />
            </div>

            <div className="xl:flex-1 xl:min-h-0 xl:mt-4">
              <PlayerList
                allPlayers={allPlayers}
                // PC용 이벤트
                onDragStart={handleDragStart}
                // 모바일용 이벤트
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onRemovePlayer={removePlayer}
                onUpdatePlayer={updatePlayer}
                isDragging={isDragging}
              />
            </div>
          </div>

          {/* 축구장 섹션 */}
          <div className="xl:col-span-2 min-h-[50vh] lg:min-h-[60vh] xl:min-h-[70vh]">
            <FootballField
              players={players}
              // PC용 이벤트
              onDragStart={handleDragStart}
              onDragOver={handleFieldDragOver}
              onDrop={handleFieldDrop}
              // 모바일용 이벤트
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onPlayerClick={moveToSubstitutes}
              onSave={saveFormation}
              isDragging={isDragging}
              fieldRef={fieldRef}
            />
          </div>

          {/* 교체 명단 섹션 */}
          <div className="xl:col-span-1 xl:h-[calc(100vh-250px)]">
            <SubstituteList
              substitutes={substitutes}
              // PC용 이벤트
              onDragStart={handleDragStart}
              // 모바일용 이벤트
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onRemoveFromSubstitutes={removeFromSubstitutes}
              isDragging={isDragging}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}
