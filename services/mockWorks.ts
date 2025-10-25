import { Work } from '../types';

export const mockWorks: Work[] = [
  {
    work_id: 'work_001',
    id: 'work_001',
    title: '月光下的秘密花园',
    author: '林小雨',
    processed_text: '',
    status: 'draft',
    created_at: '2024-01-10',
  },
  {
    work_id: 'work_002',
    id: 'work_002',
    title: '星际迷航：新纪元',
    author: '科幻迷',
    processed_text: '',
    status: 'draft',
    created_at: '2024-01-08',
  },
  {
    work_id: 'work_003',
    id: 'work_003',
    title: '猫咪侦探社',
    author: '喵星人',
    processed_text: '',
    status: 'draft',
    created_at: '2024-01-05',
  },
];

export default mockWorks;
