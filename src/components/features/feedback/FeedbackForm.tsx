'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  MessageSquare,
  User,
  Building2,
  ThumbsUp,
  Zap,
  Palette,
  Clock,
  HelpCircle,
  Lightbulb,
  Send,
  CheckCircle2,
  ClipboardCheck,
  ShoppingCart,
  Package,
  FileCheck,
  BarChart3,
} from 'lucide-react';
import { StarRating } from '@/components/ui/StarRating';
import { TextArea } from '@/components/ui/TextArea';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ToggleButton } from '@/components/ui/ToggleButton';
import type { FeedbackFormData } from '@/types/feedback';
import { DEPARTMENTS } from '@/types/feedback';

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}

function Section({ icon, title, description, children }: SectionProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-primary-100 rounded-xl text-primary-600">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export function FeedbackForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { control, handleSubmit, register, watch, formState: { errors } } = useForm<FeedbackFormData>({
    defaultValues: {
      overall_satisfaction: 0,
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: FeedbackFormData) => {
      const response = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('피드백 제출에 실패했습니다.');
      }

      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success('피드백이 성공적으로 제출되었습니다!');
    },
    onError: () => {
      toast.error('피드백 제출에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const onSubmit = (data: FeedbackFormData) => {
    if (!data.respondent_name?.trim()) {
      toast.error('영어 이름을 입력해주세요.');
      return;
    }
    if (data.overall_satisfaction === 0) {
      toast.error('전반적 만족도를 선택해주세요.');
      return;
    }
    mutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl p-10 shadow-xl max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            소중한 피드백 감사합니다!
          </h1>
          <p className="text-gray-600 mb-6">
            보내주신 의견은 RMS를 더 좋은 시스템으로 발전시키는 데 큰 도움이 됩니다.
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
          >
            새 피드백 작성하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary-50 to-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-10">
        <div className="text-center pt-8 pb-4 px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur text-primary-700 rounded-full text-sm font-medium mb-4 shadow-sm">
            <MessageSquare className="w-4 h-4" />
            RMS 사용자 피드백
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            여러분의 의견을 들려주세요
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
            RMS를 사용하시면서 느끼신 점들을 자유롭게 공유해주세요.
          </p>
        </div>
        <div className="relative w-full max-w-2xl mx-auto px-4 pb-6">
          <Image
            src="/images/hero-min-min.png"
            alt="RMS 피드백 - Mavis와 함께하는 피드백"
            width={800}
            height={450}
            className="w-full h-auto rounded-xl shadow-md"
            priority
          />
        </div>
      </div>
      

      {/* 응답자 정보 */}
      <Section
        icon={<User className="w-5 h-5" />}
        title="응답자 정보"
        description="회사에서 사용하는 영어 이름을 입력해주세요."
      >
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="영어 이름"
            placeholder="ex) Julian"
            required
            {...register('respondent_name')}
          />
          {/* <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <Select
                label="부서"
                placeholder="부서를 선택해주세요"
                options={DEPARTMENTS.map(d => ({ value: d, label: d }))}
                {...field}
              />
            )}
          /> */}
        </div>
      </Section>

      {/* 전반적 만족도 */}
      <Section
        icon={<ThumbsUp className="w-5 h-5" />}
        title="전반적 만족도"
        description="RMS에 대한 전체적인 만족도를 평가해주세요."
      >
        <Controller
          name="overall_satisfaction"
          control={control}
          rules={{ required: true, min: 1 }}
          render={({ field }) => (
            <StarRating
              value={field.value}
              onChange={field.onChange}
              label="RMS 전반적 만족도"
              required
              size="lg"
            />
          )}
        />
      </Section>

      {/* 기능별 만족도 */}
      <Section
        icon={<Zap className="w-5 h-5" />}
        title="주요 기능 평가"
        description="각 기능에 대한 만족도를 평가해주세요. 사용하지 않은 기능은 건너뛰셔도 됩니다."
      >
        <div className="space-y-6">
          <div className="grid gap-6">
            {/* 주문상품 */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-cyan-50 rounded-lg text-cyan-600 mt-1">
                <Package className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <Controller
                  name="product_management_rating"
                  control={control}
                  render={({ field }) => (
                    <StarRating
                      value={field.value || 0}
                      onChange={field.onChange}
                      label="주문상품"
                      description="주문 가능한 상품 조회 및 관리"
                    />
                  )}
                />
              </div>
            </div>

            {/* 공급계약 */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-1">
                <FileCheck className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <Controller
                  name="contract_management_rating"
                  control={control}
                  render={({ field }) => (
                    <StarRating
                      value={field.value || 0}
                      onChange={field.onChange}
                      label="공급계약"
                      description="거래처별 가격 계약 생성 및 관리"
                    />
                  )}
                />
              </div>
            </div>

            {/* 판매주문 그룹 */}
            <div className="border border-green-100 rounded-xl p-4 bg-green-50/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-green-100 rounded-lg text-green-600">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <span className="font-medium text-green-800">판매주문</span>
              </div>
              <div className="space-y-4 pl-2">
                <Controller
                  name="sales_order_management_rating"
                  control={control}
                  render={({ field }) => (
                    <StarRating
                      value={field.value || 0}
                      onChange={field.onChange}
                      label="판매주문관리"
                      description="주문 접수, 확인, SKU 매핑"
                    />
                  )}
                />
                <Controller
                  name="order_template_rating"
                  control={control}
                  render={({ field }) => (
                    <StarRating
                      value={field.value || 0}
                      onChange={field.onChange}
                      label="주문서 템플릿관리"
                      description="거래처별 주문서 양식 설정"
                    />
                  )}
                />
                <Controller
                  name="order_upload_rating"
                  control={control}
                  render={({ field }) => (
                    <StarRating
                      value={field.value || 0}
                      onChange={field.onChange}
                      label="주문서 업로드"
                      description="엑셀 주문서 파싱 및 등록"
                    />
                  )}
                />
              </div>
            </div>

            {/* 출고 그룹 */}
            <div className="border border-orange-100 rounded-xl p-4 bg-orange-50/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600">
                  <Package className="w-4 h-4" />
                </div>
                <span className="font-medium text-orange-800">출고</span>
              </div>
              <div className="space-y-4 pl-2">
                <Controller
                  name="fulfillment_management_rating"
                  control={control}
                  render={({ field }) => (
                    <StarRating
                      value={field.value || 0}
                      onChange={field.onChange}
                      label="출고관리"
                      description="출고 요청, 릴리즈 생성"
                    />
                  )}
                />
                <Controller
                  name="fulfillment_list_rating"
                  control={control}
                  render={({ field }) => (
                    <StarRating
                      value={field.value || 0}
                      onChange={field.onChange}
                      label="출고지시 목록"
                      description="출고 지시 현황 조회"
                    />
                  )}
                />
                <Controller
                  name="inventory_ledger_rating"
                  control={control}
                  render={({ field }) => (
                    <StarRating
                      value={field.value || 0}
                      onChange={field.onChange}
                      label="수불부"
                      description="출고예정일 기준 출고 라인 목록"
                    />
                  )}
                />
              </div>
            </div>

            {/* 승인 그룹 */}
            <div className="border border-pink-100 rounded-xl p-4 bg-pink-50/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-pink-100 rounded-lg text-pink-600">
                  <ClipboardCheck className="w-4 h-4" />
                </div>
                <span className="font-medium text-pink-800">승인</span>
              </div>
              <div className="space-y-4 pl-2">
                <Controller
                  name="approval_request_rating"
                  control={control}
                  render={({ field }) => (
                    <StarRating
                      value={field.value || 0}
                      onChange={field.onChange}
                      label="승인요청"
                      description="공급계약과 HQ_SAMPLE 출고에 대한 승인 요청 관리"
                    />
                  )}
                />
                <Controller
                  name="delegation_request_rating"
                  control={control}
                  render={({ field }) => (
                    <StarRating
                      value={field.value || 0}
                      onChange={field.onChange}
                      label="위임요청"
                      description="승인 위임/대리결재 규칙 관리"
                    />
                  )}
                />
              </div>
            </div>

            {/* 결산 그룹 */}
            <div className="border border-purple-100 rounded-xl p-4 bg-purple-50/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-purple-100 rounded-lg text-purple-600">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="font-medium text-purple-800">결산</span>
              </div>
              <div className="space-y-4 pl-2">
                <Controller
                  name="settlement_management_rating"
                  control={control}
                  render={({ field }) => (
                    <StarRating
                      value={field.value || 0}
                      onChange={field.onChange}
                      label="결산관리"
                      description="결산 목록 조회 및 관리"
                    />
                  )}
                />
                <Controller
                  name="fiscal_period_rating"
                  control={control}
                  render={({ field }) => (
                    <StarRating
                      value={field.value || 0}
                      onChange={field.onChange}
                      label="회기 관리"
                      description="결산 회기 설정 및 관리"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* UI/UX 평가 */}
      <Section
        icon={<Palette className="w-5 h-5" />}
        title="사용 편의성 평가"
        description="시스템의 전반적인 사용 편의성을 평가해주세요."
      >
        <div className="space-y-6">
          <Controller
            name="ui_intuitiveness"
            control={control}
            render={({ field }) => (
              <StarRating
                value={field.value || 0}
                onChange={field.onChange}
                label="화면 직관성"
                description="메뉴와 버튼이 어디 있는지 쉽게 찾을 수 있었나요?"
              />
            )}
          />
          <Controller
            name="navigation_ease"
            control={control}
            render={({ field }) => (
              <StarRating
                value={field.value || 0}
                onChange={field.onChange}
                label="메뉴 탐색 용이성"
                description="원하는 기능을 찾아가기 쉬웠나요?"
              />
            )}
          />
          <Controller
            name="loading_speed"
            control={control}
            render={({ field }) => (
              <StarRating
                value={field.value || 0}
                onChange={field.onChange}
                label="로딩 속도"
                description="페이지 로딩이나 데이터 처리 속도는 어땠나요?"
              />
            )}
          />
        </div>
      </Section>

      {/* 업무 효율성 */}
      <Section
        icon={<Clock className="w-5 h-5" />}
        title="업무 효율성"
        description="기존 방식 대비 업무 효율이 어떻게 변화했나요?"
      >
        <div className="space-y-6">
          <Controller
            name="time_saved"
            control={control}
            render={({ field }) => (
              <ToggleButton
                value={field.value ?? null}
                onChange={field.onChange}
                label="기존 업무 방식 대비 시간이 절약되었나요?"
              />
            )}
          />
          <TextArea
            label="업무 흐름(Workflow) 관련 의견"
            description="업무 처리 순서나 흐름에 대해 개선이 필요하거나 좋았던 점이 있다면 알려주세요."
            placeholder="예: 출고요청 후 릴리즈 생성까지의 과정이 직관적이었어요. / 판매주문에서 출고주문 연결이 번거로웠어요."
            {...register('workflow_improvement')}
          />
        </div>
      </Section>

      {/* 용어 이해도 */}
      <Section
        icon={<HelpCircle className="w-5 h-5" />}
        title="용어 및 개념 이해"
        description="시스템에서 사용하는 용어 중 이해하기 어려운 것이 있었나요?"
      >
        <TextArea
          label="이해하기 어려웠던 용어"
          description="공급계약, 판매주문, 출고주문, 릴리즈, SKU, 매핑, 공급률, 과세/면세/영세 등 시스템상의 용어 중 한 번에 이해하기 어려웠던 용어가 있다면 알려주세요."
          placeholder="예: '공급률'이 정확히 무엇을 의미하는지 헷갈렸어요. / '매핑'이라는 표현이 낯설었어요."
          {...register('confusing_terms')}
        />
      </Section>

      {/* 개선 요청사항 */}
      <Section
        icon={<Lightbulb className="w-5 h-5" />}
        title="의견 및 제안"
        description="자유롭게 의견을 남겨주세요."
      >
        <div className="space-y-6">
          <TextArea
            label="가장 유용했던 기능"
            description="사용하면서 특히 편리하거나 도움이 되었던 기능이 있다면 알려주세요."
            placeholder="예: 엑셀 주문서 업로드로 수작업이 많이 줄었어요."
            {...register('most_useful_feature')}
          />
          <TextArea
            label="가장 불편했던 점"
            description="사용하면서 어려움을 겪거나 불편했던 부분이 있다면 알려주세요."
            placeholder="예: 검색 필터가 부족해서 원하는 주문을 찾기 어려웠어요."
            {...register('most_difficult_feature')}
          />
          <TextArea
            label="개선 제안"
            description="이렇게 바뀌면 좋겠다 싶은 점이 있다면 알려주세요."
            placeholder="예: 대시보드에서 오늘 처리해야 할 건들을 한눈에 볼 수 있으면 좋겠어요."
            {...register('improvement_suggestions')}
          />
          <TextArea
            label="추가되었으면 하는 기능"
            description="현재 없지만 있었으면 하는 기능이 있다면 알려주세요."
            placeholder="예: 거래처별 주문 통계 리포트 기능이 있으면 좋겠어요."
            {...register('additional_features')}
          />
          <TextArea
            label="기타 의견"
            description="그 외 하고 싶은 말씀이 있다면 자유롭게 작성해주세요."
            placeholder="RMS를 사용하면서 느낀 점, 건의사항 등 무엇이든 좋습니다."
            {...register('other_comments')}
          />
        </div>
      </Section>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <Button
          type="submit"
          size="lg"
          loading={mutation.isPending}
          className="min-w-[200px]"
        >
          <Send className="w-5 h-5" />
          피드백 제출하기
        </Button>
      </div>

      {/* Footer Note */}
      <p className="text-center text-sm text-gray-500 pt-4">
        제출된 피드백은 시스템 개선을 위해서만 사용되며, 개인정보는 별도로 수집하지 않습니다.
      </p>
    </form>
  );
}
