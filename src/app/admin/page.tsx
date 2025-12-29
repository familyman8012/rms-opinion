'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  BarChart3,
  Users,
  Star,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Building2,
  MessageSquare,
  Eye,
  X,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Lock,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Feedback } from '@/types/database';

interface FeedbackResponse {
  data: Feedback[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function StatCard({
  icon,
  label,
  value,
  subValue,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 bg-primary-100 rounded-xl text-primary-600">
          {icon}
        </div>
        {trend && (
          <span
            className={`text-sm font-medium flex items-center gap-1 ${
              trend === 'up'
                ? 'text-green-600'
                : trend === 'down'
                  ? 'text-red-600'
                  : 'text-gray-500'
            }`}
          >
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : trend === 'down' ? (
              <TrendingDown className="w-4 h-4" />
            ) : null}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
      {subValue && <p className="text-xs text-gray-400 mt-0.5">{subValue}</p>}
    </div>
  );
}

function RatingBadge({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-gray-400">-</span>;

  const colors = {
    1: 'bg-red-100 text-red-700',
    2: 'bg-orange-100 text-orange-700',
    3: 'bg-yellow-100 text-yellow-700',
    4: 'bg-lime-100 text-lime-700',
    5: 'bg-green-100 text-green-700',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${colors[rating as keyof typeof colors]}`}
    >
      <Star className="w-3 h-3 fill-current" />
      {rating}
    </span>
  );
}

function FeedbackDetailModal({
  feedback,
  onClose,
  onDelete,
}: {
  feedback: Feedback;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const ratings = [
    { label: '전반적 만족도', value: feedback.overall_satisfaction },
    { label: '주문상품', value: feedback.product_management_rating },
    { label: '공급계약', value: feedback.contract_management_rating },
    { label: '판매주문관리', value: feedback.sales_order_management_rating },
    { label: '주문서 템플릿관리', value: feedback.order_template_rating },
    { label: '주문서 업로드', value: feedback.order_upload_rating },
    { label: '출고관리', value: feedback.fulfillment_management_rating },
    { label: '출고지시 목록', value: feedback.fulfillment_list_rating },
    { label: '승인', value: feedback.approval_flow_rating },
    { label: '화면 직관성', value: feedback.ui_intuitiveness },
    { label: '메뉴 탐색', value: feedback.navigation_ease },
    { label: '로딩 속도', value: feedback.loading_speed },
  ];

  const textFields = [
    { label: '업무 흐름 의견', value: feedback.workflow_improvement },
    { label: '어려웠던 용어', value: feedback.confusing_terms },
    { label: '유용했던 기능', value: feedback.most_useful_feature },
    { label: '불편했던 점', value: feedback.most_difficult_feature },
    { label: '개선 제안', value: feedback.improvement_suggestions },
    { label: '추가 기능 요청', value: feedback.additional_features },
    { label: '기타 의견', value: feedback.other_comments },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">피드백 상세</h2>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(feedback.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDelete(feedback.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
          {/* 응답자 정보 */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              {feedback.respondent_name || '-'}
            </div>
            {feedback.department && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                {feedback.department}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {feedback.time_saved === true ? (
                <>
                  <ThumbsUp className="w-4 h-4 text-green-600" />
                  시간 절약됨
                </>
              ) : feedback.time_saved === false ? (
                <>
                  <ThumbsDown className="w-4 h-4 text-red-600" />
                  시간 절약 안됨
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  시간 절약 미응답
                </>
              )}
            </div>
          </div>

          {/* 평점 */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">평가 점수</h3>
            <div className="grid grid-cols-3 gap-3">
              {ratings.map((r) => (
                <div
                  key={r.label}
                  className="bg-gray-50 rounded-xl p-3 text-center"
                >
                  <p className="text-xs text-gray-500 mb-1">{r.label}</p>
                  <RatingBadge rating={r.value} />
                </div>
              ))}
            </div>
          </div>

          {/* 텍스트 피드백 */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">상세 의견</h3>
            {textFields.map(
              (field) =>
                field.value && (
                  <div key={field.label} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-2">{field.label}</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {field.value}
                    </p>
                  </div>
                )
            )}
            {textFields.every((f) => !f.value) && (
              <p className="text-sm text-gray-400 italic">
                작성된 상세 의견이 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        sessionStorage.setItem('adminAuth', 'true');
        onLogin();
        toast.success('로그인되었습니다.');
      } else {
        toast.error('비밀번호가 올바르지 않습니다.');
      }
    } catch {
      toast.error('로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-primary-100 rounded-xl text-primary-600 mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">관리자 로그인</h1>
          <p className="text-sm text-gray-500 mt-2">
            RMS V2 피드백 대시보드에 접근하려면 비밀번호를 입력하세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="비밀번호를 입력하세요"
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !password}>
            {isLoading ? '확인 중...' : '로그인'}
          </Button>
        </form>
      </div>
    </div>
  );
}

function FeedbackDashboard({ onLogout }: { onLogout: () => void }) {
  const [page, setPage] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<FeedbackResponse>({
    queryKey: ['feedbacks', page],
    queryFn: async () => {
      const response = await fetch(`/api/feedbacks?page=${page}&limit=10`);
      if (!response.ok) throw new Error('Failed to fetch feedbacks');
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/feedbacks?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete feedback');
      return response.json();
    },
    onSuccess: () => {
      toast.success('피드백이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      setSelectedFeedback(null);
    },
    onError: () => {
      toast.error('피드백 삭제에 실패했습니다.');
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('정말 이 피드백을 삭제하시겠습니까?')) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // 통계 계산
  const stats = data?.data
    ? {
        totalResponses: data.pagination.total,
        avgSatisfaction:
          data.data.length > 0
            ? (
                data.data
                  .filter((f) => f.overall_satisfaction)
                  .reduce((sum, f) => sum + (f.overall_satisfaction || 0), 0) /
                data.data.filter((f) => f.overall_satisfaction).length
              ).toFixed(1)
            : '-',
        timeSavedRate:
          data.data.length > 0
            ? Math.round(
                (data.data.filter((f) => f.time_saved === true).length /
                  data.data.filter((f) => f.time_saved !== null).length) *
                  100
              ) || 0
            : 0,
      }
    : null;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">데이터를 불러오는데 실패했습니다.</p>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary-600 rounded-xl text-white">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  RMS V2 피드백 대시보드
                </h1>
                <p className="text-sm text-gray-500">
                  사용자 피드백을 확인하고 분석합니다
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="총 응답 수"
            value={stats?.totalResponses || 0}
            subValue="명이 피드백을 남겼습니다"
          />
          <StatCard
            icon={<Star className="w-5 h-5" />}
            label="평균 만족도"
            value={`${stats?.avgSatisfaction || '-'} / 5`}
            subValue="전반적 만족도 기준"
            trend={
              Number(stats?.avgSatisfaction) >= 4
                ? 'up'
                : Number(stats?.avgSatisfaction) >= 3
                  ? 'neutral'
                  : 'down'
            }
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="시간 절약 비율"
            value={`${stats?.timeSavedRate || 0}%`}
            subValue="기존 대비 시간 절약되었다는 응답"
            trend={
              (stats?.timeSavedRate || 0) >= 70
                ? 'up'
                : (stats?.timeSavedRate || 0) >= 50
                  ? 'neutral'
                  : 'down'
            }
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              피드백 목록
            </h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-gray-500">
              <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-4" />
              불러오는 중...
            </div>
          ) : data?.data.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              아직 제출된 피드백이 없습니다.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        응답자
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        부서
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        만족도
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        시간절약
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        제출일
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data?.data.map((feedback) => (
                      <tr
                        key={feedback.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {feedback.respondent_name || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {feedback.department || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RatingBadge rating={feedback.overall_satisfaction} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {feedback.time_saved === true ? (
                            <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                              <ThumbsUp className="w-4 h-4" /> 예
                            </span>
                          ) : feedback.time_saved === false ? (
                            <span className="inline-flex items-center gap-1 text-red-600 text-sm">
                              <ThumbsDown className="w-4 h-4" /> 아니오
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(feedback.created_at)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedFeedback(feedback)}
                              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              상세
                            </button>
                            <button
                              onClick={() => handleDelete(feedback.id)}
                              className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data && data.pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    총 {data.pagination.total}건 중{' '}
                    {(page - 1) * data.pagination.limit + 1}-
                    {Math.min(page * data.pagination.limit, data.pagination.total)}
                    건
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      이전
                    </Button>
                    <span className="text-sm text-gray-600 px-3">
                      {page} / {data.pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) =>
                          Math.min(data.pagination.totalPages, p + 1)
                        )
                      }
                      disabled={page === data.pagination.totalPages}
                    >
                      다음
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedFeedback && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    setIsAuthenticated(auth === 'true');
    setIsChecking(false);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    toast.success('로그아웃되었습니다.');
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={() => setIsAuthenticated(true)} />;
  }

  return <FeedbackDashboard onLogout={handleLogout} />;
}
