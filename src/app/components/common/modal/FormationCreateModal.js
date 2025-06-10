import React, { useState } from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {supabase} from "@/app/lib/supabase";

const FormationCreateModal = ({ closeModal, onFormationCreated }) => {
  const pathName = usePathname();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    formation_type: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Supabase formations 테이블에 데이터 삽입
      const { data, error } = await supabase
        .from('formations')
        .insert([
          {
            name: formData.name,
            formation_type: formData.formation_type,
            description: formData.description || null, // 빈 문자열이면 null로 저장
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select(); // 삽입된 데이터 반환

      if (error) {
        throw error;
      }

      alert('포메이션이 성공적으로 생성되었습니다!');

      // 폼 초기화
      setFormData({
        name: '',
        formation_type: '',
        description: ''
      });

      // 현재 경로 확인 후 조건부 처리
      // const currentPath = router.pathname;

      if (pathName === '/formation-history') {
        console.log('test1')
        // formation-history 페이지에 있는 경우: 리스트 새로고침
        if (onFormationCreated) {
          console.log('test2')
          onFormationCreated();
        }
      } else {
        // 다른 페이지에 있는 경우: formation-history로 이동
        router.push('/formation-history');
      }

      closeModal();
    } catch (error) {
      console.error('Error creating formation:', error);
      alert(`포메이션 생성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">새 포메이션 생성</h2>
            <button
              onClick={closeModal}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 폼 컨텐츠 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 포메이션 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              포메이션 이름 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-gray-400 text-gray-900"
              placeholder="예: 4-4-2 공격형"
            />
          </div>

          {/* 포메이션 타입 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              포메이션 타입 *
            </label>
            <input
              type="text"
              name="formation_type"
              value={formData.formation_type}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-gray-400 text-gray-900"
              placeholder="예: 4-4-2, 4-3-3, 3-5-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              숫자-숫자-숫자 형식으로 입력하세요 (예: 4-4-2)
            </p>
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none placeholder:text-gray-400 text-gray-900"
              placeholder="포메이션에 대한 설명을 입력하세요..."
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  생성 중...
                </div>
              ) : '생성하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormationCreateModal;
