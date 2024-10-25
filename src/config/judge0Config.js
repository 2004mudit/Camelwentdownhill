export const judge0Config = {
  rapidApiKey: 'aa85d77aaemsh4f83ddb6a6b0823p194984jsnb550dd890c10',
  baseURL: 'https://judge0-ce.p.rapidapi.com',
  embedURL: 'https://embedable.judge0.com',
  headers: {
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
    'X-RapidAPI-Key': 'aa85d77aaemsh4f83ddb6a6b0823p194984jsnb550dd890c10',
    'Content-Type': 'application/json'
  }
};

export const iframeConfig = {
  sandbox: 'allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-downloads',
  allow: 'clipboard-read; clipboard-write'
};

// Add API endpoints
export const JUDGE0_ENDPOINTS = {
  submissions: '/submissions',
  languages: '/languages',
  statuses: '/statuses'
};
