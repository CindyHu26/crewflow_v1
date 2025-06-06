import { Timestamp } from 'firebase/firestore';

// 服務紀錄主表型別定義
export interface Service {
  id: string;
  timestamp: Timestamp;
  handling_process: string;
  handling_result: string;
  customer_id: string;
  signature: string;
  service_feedback_employer: string;
  service_feedback_worker: string;
  expenses: Expense[];
  sub_items: SubItem[];
  reports: Report[];
  photos: string[];
  partners: string[];
  nationalities: string[];
  job_types: string[];
  created_at: Timestamp;
  updated_at: Timestamp;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  customer_names: string[];
  staff_name: string;
  partner_names: string[];
  photo_urls: string[];
  worker_name: string;
  employer_signature: string;
  worker_signature: string;
  service_signature: string;
  shared_info: string;
  total_amount: number;
}

// 表單資料型別定義
export interface ServiceFormData {
  service_date: string;
  timestamp: Timestamp;
  handling_process: string;
  handling_result: string;
  customer_id: string;
  signature: string;
  service_feedback_employer: string;
  service_feedback_worker: string;
  expenses: Expense[];
  sub_items: SubItem[];
  reports: Report[];
  photos: string[];
  created_at: Timestamp;
  updated_at: Timestamp;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  customer_names: string[];
  staff_name: string;
  partner_names: string[];
  photo_urls: string[];
  worker_name: string;
  employer_signature: string;
  worker_signature: string;
  service_signature: string;
  shared_info: string;
  total_amount: number;
  nationalities: string[];
  job_types: string[];
}

// 收取/交付物件型別定義
export interface SubItem {
  service_id: string;
  category: string;
  item_name: string;
  quantity: number;
  note: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// 收支明細型別定義
export interface Expense {
  service_id: string;
  category: string;
  item: string;
  amount: number;
  remark: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// 回報事項型別定義
export interface Report {
  service_id: string;
  type: string;
  content: string;
  is_urgent: boolean;
  status: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// 經常性使用項目型別定義
export interface FrequentItem {
  id: string;
  name: string;
  type: 'expense' | 'subItem'; // 用來區分是收支項目還是物件項目
  category?: '收入' | '支出'; // 若為收支項目才會有此欄位
  defaultAmount?: number; // 若為收支項目才會有此欄位
  note?: string; // 備註說明
  isActive: boolean; // 是否啟用
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ServiceRecord {
  id?: string;                   // Firestore 文件 ID
  record_id: string;             // 紀錄編號 SR-YYYYMMDD-XXX
  service_person: string;        // 服務人員
  partner: string;              // 同行人員
  form_time: Timestamp;         // 填表時間
  customer_name: string;        // 客戶名稱
  nationality: string;          // 國籍
  job_type: string;            // 工種
  worker_name: string;         // 工人姓名
  feedback_employer: string;    // 雇主反映事項
  feedback_worker: string;      // 移工反映事項
  process_detail: string;       // 處理經過
  process_result: string;       // 處理結果
  items_delivered: string;      // 收取/交付物件
  amount: number;              // 金額
  worker_signature: string;     // 工人簽名（Base64）
  employer_signature: string;   // 雇主簽名（Base64）
  staff_signature: string;      // 服務人員簽名（Base64）
  photos: string[];            // 照片 URLs
  info_shared: string;         // 雇主/移工資訊提供
  last_updated: Timestamp;     // 最後更新時間
  company_report: string;      // 回報公司事項
  finance_note: string;        // 收支明細
  created_by: string;          // 建立者 ID
  review_note?: string;        // 審核意見
}

// 簽名資料型別
export interface SignatureData {
  dataUrl: string;
  strokes: any[];
} 