export interface FeedbackFormData {
  // 응답자 정보
  respondent_name?: string;
  department?: string;

  // 전반적 만족도
  overall_satisfaction: number;

  // 기능별 평가
  product_management_rating?: number;        // 주문상품
  contract_management_rating?: number;       // 공급계약
  sales_order_management_rating?: number;    // 판매주문 > 판매주문관리
  order_template_rating?: number;            // 판매주문 > 주문서 템플릿관리
  order_upload_rating?: number;              // 판매주문 > 주문서 업로드
  fulfillment_management_rating?: number;    // 출고 > 출고관리
  fulfillment_list_rating?: number;          // 출고 > 출고지시 목록
  inventory_ledger_rating?: number;          // 출고 > 수불부
  approval_request_rating?: number;          // 승인 > 승인요청
  delegation_request_rating?: number;        // 승인 > 위임요청
  settlement_management_rating?: number;     // 결산 > 결산관리
  fiscal_period_rating?: number;             // 결산 > 회기 관리

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
  product_management_rating: '주문상품',
  contract_management_rating: '공급계약',
  sales_order_management_rating: '판매주문관리',
  order_template_rating: '주문서 템플릿관리',
  order_upload_rating: '주문서 업로드',
  fulfillment_management_rating: '출고관리',
  fulfillment_list_rating: '출고지시 목록',
  inventory_ledger_rating: '수불부',
  approval_request_rating: '승인요청',
  delegation_request_rating: '위임요청',
  settlement_management_rating: '결산관리',
  fiscal_period_rating: '회기 관리',
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
