'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useModal } from '../lib/hooks'
import {FormationCreateModal} from "@/app/components/common/modal";

export default function FormationHistory() {
  const [formations, setFormations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refreshFormations = async () => {
    try {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setFormations(data)
    } catch (error) {
      console.error('Error refreshing formations:', error)
    }
  }

  const modalData = {
    create: {
      type: FormationCreateModal,
      props: {
        onFormationCreated: refreshFormations
      }
    }
  };

  const { openModal, ModalPortal } = useModal(modalData);

  const handleCreateFormation = () => {
    openModal('create');
  };

  useEffect(() => {
    async function fetchFormations() {
      try {
        const { data, error } = await supabase
          .from('formations')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        setFormations(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFormations()
  }, [])

  const deleteFormation = async (formationId, formationName) => {
    if (!confirm(`'${formationName}' 포메이션을 삭제하시겠습니까?`)) return

    try {
      const { error } = await supabase
        .from('formations')
        .delete()
        .eq('id', formationId)

      if (error) throw error

      // 삭제 후 상태 업데이트
      setFormations(formations.filter(f => f.id !== formationId))
      alert('포메이션이 성공적으로 삭제되었습니다.')
    } catch (error) {
      console.error('Delete error:', error)
      alert('삭제 중 오류가 발생했습니다: ' + error.message)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <p className="text-red-600">에러: {error}</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* LayerDetail div 추가 - 모달 포털용 */}
      <div id="LayerDetail"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">포메이션 히스토리</h2>
              <p className="text-gray-600">생성된 포메이션을 확인하고 관리하세요</p>
            </div>
            {formations.length > 0 &&
              <button
                onClick={handleCreateFormation}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                새 포메이션
              </button>
            }
          </div>
        </div>

        {formations.length > 0 &&
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {formations.map((formation) => (
              <div key={formation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                    {formation.name}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {formation.formation_type}
                  </span>
                </div>

                <p className={`${!formation.description && 'pb-[20px]'} text-gray-600 text-sm mb-4 line-clamp-2`}>
                  {formation.description}
                </p>

                <div className="mb-4 text-xs text-gray-500">
                  생성일: {new Date(formation.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/edit-formation?formation=${formation.id}`}
                    className="flex-1 text-center py-2 px-3 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    편집
                  </Link>
                  <button
                    onClick={() => deleteFormation(formation.id, formation.name)}
                    className="flex-1 py-2 px-3 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors text-sm"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        }

        {formations.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-300 text-6xl mb-6">⚽</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">포메이션이 없습니다</h3>
            <p className="text-gray-600 mb-6">첫 번째 포메이션을 만들어보세요!</p>
            <button
              onClick={handleCreateFormation}
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              포메이션 만들기
            </button>
          </div>
        )}
      </div>

      {/* 모달 포털 */}
      <ModalPortal />
    </Layout>
  )
}
