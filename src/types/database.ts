export interface Database {
  public: {
    Tables: {
      feedbacks: {
        Row: {
          id: string;
          created_at: string;
          respondent_name: string | null;
          department: string | null;
          overall_satisfaction: number | null;
          contract_management_rating: number | null;
          sales_order_rating: number | null;
          fulfillment_rating: number | null;
          excel_upload_rating: number | null;
          approval_flow_rating: number | null;
          ui_intuitiveness: number | null;
          navigation_ease: number | null;
          loading_speed: number | null;
          workflow_improvement: string | null;
          time_saved: boolean | null;
          confusing_terms: string | null;
          most_useful_feature: string | null;
          most_difficult_feature: string | null;
          improvement_suggestions: string | null;
          additional_features: string | null;
          other_comments: string | null;
        };
        Insert: Omit<Database['public']['Tables']['feedbacks']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['feedbacks']['Insert']>;
      };
    };
  };
}

export type Feedback = Database['public']['Tables']['feedbacks']['Row'];
export type FeedbackInsert = Database['public']['Tables']['feedbacks']['Insert'];
