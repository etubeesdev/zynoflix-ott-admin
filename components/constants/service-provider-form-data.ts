export const formdata: any = [
  {
    title: 'Video Title',
    description: 'Enter your video title',
    tag: 'text',
    required: false,
    name: 'title',
    type: 'text'
  },
  {
    title: 'Video Description',
    description: 'Enter your video description',
    tag: 'text',
    required: false,
    name: 'description'
  },
  {
    title: 'Thumbnail',
    description: 'Upload your thumbnail',
    tag: 'file',
    required: false,
    name: 'thumbnail'
  },
  {
    title: 'Preview Video',
    description: 'Upload your preview video',
    tag: 'file',
    required: false,
    name: 'preview_video'
  },
  {
    title: 'category',
    description: 'Enter your category',
    tag: 'text',
    required: false,
    name: 'category'
  },
  {
    title: 'Language',
    description: 'Enter your language',
    tag: 'select',
    required: false,
    type: 'select',
    name: 'language',
    options: [
      { label: 'English', value: 'english' },
      { label: 'Hindi', value: 'hindi' },
      { label: 'Tamil', value: 'tamil' },
      { label: 'Telugu', value: 'telugu' },
      { label: 'Malayalam', value: 'malayalam' },
      { label: 'Kannada', value: 'kannada' },
      { label: 'Bengali', value: 'bengali' },
      { label: 'Marathi', value: 'marathi' },
      { label: 'Gujarati', value: 'gujarati' },
      { label: 'Punjabi', value: 'punjabi' },
      { label: 'Odia', value: 'odia' },
      { label: 'Assamese', value: 'assamese' },
      { label: 'Urdu', value: 'urdu' },
      { label: 'Sanskrit', value: 'sanskrit' },
      { label: 'Konkani', value: 'konkani' },
      { label: 'Nepali', value: 'nepali' },
      { label: 'Sindhi', value: 'sindhi' },
      { label: 'Dogri', value: 'dogri' },
      { label: 'Manipuri', value: 'manipuri' },
      { label: 'Kashmiri', value: 'kashmiri' },
      { label: 'Maithili', value: 'maithili' },
      { label: 'Bodo', value: 'bodo' },
      { label: 'Santhali', value: 'santhali' },
      { label: 'Khasi', value: 'khasi' },
      { label: 'Garo', value: 'garo' },
      { label: 'Mizo', value: 'mizo' },
      { label: 'Tangkhul', value: 'tangkhul' },
      { label: 'Kokborok', value: 'kokborok' },
      { label: 'Naga', value: 'naga' },
      { label: 'Bhutia', value: 'bhutia' }
    ]
  },
  {
    title: 'Duration',
    description: 'Enter your duration',
    tag: 'text',
    required: false,
    name: 'duration'
  }
];
