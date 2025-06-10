// src/app/page.js (업데이트된 Home 컴포넌트)
'use client'

import Link from 'next/link'
import Image from 'next/image'
import Layout from './components/Layout'
import { useModal } from './lib/hooks'
import {FormationCreateModal} from "@/app/components/common/modal";

export default function Home() {
  // 모달 데이터 정의
  const modalData = {
    create: {
      type: FormationCreateModal
    }
  };

  const { openModal, ModalPortal } = useModal(modalData);

  const handleCreateFormation = () => {
    openModal('create');
  };

  return (
    <Layout>
      {/* LayerDetail div 추가 - 모달 포털용 */}
      <div id="LayerDetail"></div>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative container mx-auto px-4 py-20 flex items-center min-h-screen">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Content */}
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30">
                  <span className="text-blue-300 text-sm font-medium">⚽ Football Strategy</span>
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  경기 승리를 위한
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                    최적의 솔루션
                  </span>
                </h1>

                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                  직관적인 드래그 앤 드롭으로 포메이션을 설계하고,
                  전술 분석을 통해 팀의 경쟁력을 극대화하세요.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleCreateFormation}
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  포메이션 만들기
                </button>

                <Link
                  href="/formation-history"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2" />
                  </svg>
                  포메이션 보기
                </Link>
              </div>
            </div>

            {/* Main Image */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-sm overflow-hidden">
                <Image
                  src="/Image/main.png"
                  alt="HGS Football Manager - 포메이션 편집 화면"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover rounded-2xl"
                  priority
                />

                {/* Overlay for better contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/40">
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              왜 HGS Football Manager인가?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              전문적인 분석 도구와 직관적인 인터페이스로 완벽한 전술을 구성하세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">직관적인 편집</h3>
              <p className="text-gray-600">드래그 앤 드롭으로 쉽고 빠르게 포메이션을 구성할 수 있습니다</p>
            </div>

            <div className="text-center group">
              <div className="bg-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">전술 분석</h3>
              <p className="text-gray-600">포메이션별 장단점을 분석하여 최적의 전략을 제시합니다</p>
            </div>

            <div className="text-center group">
              <div className="bg-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">간편한 공유</h3>
              <p className="text-gray-600">완성된 포메이션을 이미지로 저장하고 팀원들과 공유하세요</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            몇 분 만에 전문적인 포메이션을 만들고, 팀의 승률을 높여보세요
          </p>
          <button
            onClick={handleCreateFormation}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            포메이션 만들기 시작
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>

      {/* 모달 포털 */}
      <ModalPortal />
    </Layout>
  )
}
