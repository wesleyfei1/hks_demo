export type Work = {
  work_id?: string;
  id?: string;
  user_id?: string;
  title: string;
  author?: string;
  description?: string;
  coverImage?: string;
  original_text?: string;
  processed_text?: string;
  status?: string;
  created_at?: string;
};

export type Illustration = {
  illustration_id?: string;
  work_id?: string;
  position_in_text?: number;
  image_url?: string;
  prompt_used?: string;
  is_selected?: boolean;
  style_tag?: string;
  created_at?: string;
};

export type IllustrationLocation = {
  location_id?: string;
  work_id?: string;
  start_index?: number;
  end_index?: number;
  type?: string;
  status?: string;
  created_at?: string;
};
