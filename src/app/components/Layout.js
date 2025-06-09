'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const menuItems = [
    {
      title: 'Home',
      href: '/',
      description: '홈',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      title: 'Edit Formation',
      href: '/edit-formation',
      description: '포메이션 편집',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7m-5.5-.5L15 8l3-3-3-3-3 3v3z" />
        </svg>
      )
    },
    {
      title: 'Formation History',
      href: '/formation-history',
      description: '포메이션 기록',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 사이드 메뉴 오버레이 */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={closeMenu}
        />
      )}

      {/* 사이드 메뉴 */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          {/* 메뉴 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">축구 포메이션 매니저</h2>
            <button
              onClick={closeMenu}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="메뉴 닫기"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 메뉴 아이템들 */}
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex-shrink-0 text-gray-500 group-hover:text-blue-600 mr-3">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">
                    {item.title}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {item.description}
                  </div>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 relative">
        {/* 햄버거 버튼 - 메인 영역 내부 */}
        <button
          onClick={toggleMenu}
          className="fixed top-4 left-4 z-30 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="메뉴 열기"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {children}
      </main>
    </div>
  )
}
