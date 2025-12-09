export interface FeedbackFormData {
  // 응답자 정보
  respondent_name?: string;
  department?: string;

  // 전반적 만족도
  overall_satisfaction: number;

  // 기능별 평가
  contract_management_rating?: number;
  sales_order_rating?: number;
  fulfillment_rating?: number;
  excel_upload_rating?: number;
  approval_flow_rating?: number;

  // UI/UX 평가
  ui_intuitiveness?: number;
  navigation_ease?: number;
  loading_speed?: number;

  // 업무 효율성
  workflow_improvement?: string;
  time_saved?: boolean;

  // 용어 이해도
  confusing_terms?: string;

  // 개선 요청사항
  most_useful_feature?: string;
  most_difficult_feature?: string;
  improvement_suggestions?: string;
  additional_features?: string;

  // 기타
  other_comments?: string;
}

export const FEATURE_LABELS: Record<string, string> = {
  contract_management_rating: '공급계약 관리',
  sales_order_rating: '판매주문 관리',
  fulfillment_rating: '출고주문/릴리즈 관리',
  excel_upload_rating: '엑셀 주문서 업로드',
  approval_flow_rating: '승인 프로세스',
};

export const UX_LABELS: Record<string, string> = {
  ui_intuitiveness: '화면 직관성',
  navigation_ease: '메뉴 찾기 용이성',
  loading_speed: '로딩 속도',
};

export const DEPARTMENTS = [
  '영업팀',
  '물류팀',
  '마케팅팀',
  '재무팀',
  '상품팀',
  'IT팀',
  '경영지원팀',
  '기타',
];
