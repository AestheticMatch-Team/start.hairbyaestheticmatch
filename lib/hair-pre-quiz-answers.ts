export interface HairPreQuizAnswers {
  firstName: string;
  email: string;
  q1_mirror: string;
  q2_loss_duration: string;
  q3_tried: string[];
  q4_family_history: string;
  q5_outcome: string;
  q6_age: string;
  q6_city: string;
  q6_state: string;
  q6_zip: string;
}

export const HAIR_PRE_QUIZ_NAMESPACE = "_hair_pq" as const;
