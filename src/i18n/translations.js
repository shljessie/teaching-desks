const translations = {
  en: {
    // App
    appTitle: 'Teaching Desks',
    appSubtitle: 'Classroom Seating Arrangement',

    // Language
    language: 'Language',

    // Steps
    step1: 'Class Setup',
    step2: 'Room Layout',
    step3: 'Assign Seats',

    // Desk count
    totalDeskCount: 'How many desks in the classroom?',
    deskCountHint: 'Enter total desks → layout auto-generates',
    desks: 'desks',
    applyDeskCount: 'Apply',

    // CSV Upload
    uploadCSV: 'Upload CSV',
    uploadDesc: 'Upload a CSV file with student names and gender',
    dragDropCSV: 'Drag & drop a CSV file here, or click to browse',
    csvFormat: 'CSV Format: name, gender (M/F)',
    downloadSample: 'Download Sample CSV',
    studentsLoaded: 'students loaded',
    clearStudents: 'Clear All',
    name: 'Name',
    gender: 'Gender',
    boy: 'Boy',
    girl: 'Girl',
    male: 'M',
    female: 'F',
    addStudent: 'Add Student',
    addStudentName: 'Student name...',
    removeStudent: 'Remove',

    // Room Layout
    roomLayout: 'Room Layout',
    gridSize: 'Grid Size',
    rows: '↕ How many rows? (front to back)',
    columns: '↔ Seats per row? (left to right)',
    presets: 'Presets',
    presetRows: 'Traditional Rows',
    presetPaired: 'Paired Desks',
    presetUShape: 'U-Shape',
    presetGroups4: 'Groups of 4',
    presetGroups6: 'Groups of 6',
    presetCircle: 'Circle',
    presetEmpty: 'Empty',
    clickToToggle: 'Click cells to toggle desks on/off. Drag to paint multiple.',
    clearAll: 'Clear All',
    fillAll: 'Fill All',
    totalDesks: 'Total Desks',
    teacherDesk: "Teacher's Desk",

    // Mode toggle
    editLayout: 'Edit Layout',
    assignSeats: 'Assign Seats',

    // Seating
    seatingArrangement: 'Seating Arrangement',
    unassigned: 'Unassigned',
    randomAssign: 'Random Assign',
    shuffle: 'Shuffle',
    boyGirlMix: 'Boy-Girl Mix',
    clearSeats: 'Clear Seats',
    dragToAssign: 'Drag students to seats or use auto-assign buttons',
    seatEmpty: 'Empty',
    clickToRemove: 'Click to remove',

    // Chart title
    chartTitlePlaceholder: 'e.g. Jan Seating Chart – Ms. Kim\'s Class',
    chartTitleLabel: 'Chart Title',
    chartTitlePrompt: 'Enter a title for the seating chart (leave empty for no title):',

    // Export
    exportPrint: 'Print / Export',
    print: 'Print',
    exportImage: 'Export as Image',

    // Messages
    notEnoughSeats: 'Not enough seats for all students!',
    allSeatsAssigned: 'All students have been assigned seats!',
    noStudents: 'No students loaded. Upload a CSV first.',
    noDesks: 'No desks placed. Design your room layout first.',
  },

  ko: {
    // App
    appTitle: '교실 자리 배치',
    appSubtitle: '학생 좌석 배치 프로그램',

    // Language
    language: '언어',

    // Steps
    step1: '학급 설정',
    step2: '교실 배치',
    step3: '자리 배정',

    // Desk count
    totalDeskCount: '교실에 책상이 몇 개인가요?',
    deskCountHint: '책상 수를 입력하면 배치가 자동 생성됩니다',
    desks: '개',
    applyDeskCount: '적용',

    // CSV Upload
    uploadCSV: 'CSV 업로드',
    uploadDesc: '학생 이름과 성별이 포함된 CSV 파일을 업로드하세요',
    dragDropCSV: 'CSV 파일을 여기에 끌어다 놓거나 클릭하여 찾아보기',
    csvFormat: 'CSV 형식: 이름, 성별 (M/F)',
    downloadSample: '샘플 CSV 다운로드',
    studentsLoaded: '명 학생 등록됨',
    clearStudents: '전체 삭제',
    name: '이름',
    gender: '성별',
    boy: '남',
    girl: '여',
    male: '남',
    female: '여',
    addStudent: '학생 추가',
    addStudentName: '학생 이름...',
    removeStudent: '삭제',

    // Room Layout
    roomLayout: '교실 배치',
    gridSize: '격자 크기',
    rows: '↕ 몇 줄? (앞에서 뒤까지)',
    columns: '↔ 한 줄에 몇 자리?',
    presets: '프리셋',
    presetRows: '전통 줄 배치',
    presetPaired: '짝꿍 배치',
    presetUShape: 'U자 배치',
    presetGroups4: '4인 그룹',
    presetGroups6: '6인 그룹',
    presetCircle: '원형 배치',
    presetEmpty: '빈 교실',
    clickToToggle: '셀을 클릭하여 책상을 켜고 끕니다. 드래그하여 여러 개를 칠할 수 있습니다.',
    clearAll: '전체 지우기',
    fillAll: '전체 채우기',
    totalDesks: '총 책상 수',
    teacherDesk: '교탁',

    // Mode toggle
    editLayout: '배치 편집',
    assignSeats: '자리 배정',

    // Seating
    seatingArrangement: '좌석 배치',
    unassigned: '미배정',
    randomAssign: '랜덤 배정',
    shuffle: '섞기',
    boyGirlMix: '남녀 혼합',
    clearSeats: '배정 초기화',
    dragToAssign: '학생을 자리에 끌어다 놓거나 자동 배정 버튼을 사용하세요',
    seatEmpty: '빈자리',
    clickToRemove: '클릭하여 제거',

    // Chart title
    chartTitlePlaceholder: '예: 1월 자리배치표 – 복희 선생님 반',
    chartTitleLabel: '자리배치표 제목',
    chartTitlePrompt: '자리배치표 제목을 입력하세요 (비워두면 제목 없이 인쇄):',

    // Export
    exportPrint: '인쇄 / 내보내기',
    print: '인쇄',
    exportImage: '이미지로 내보내기',

    // Messages
    notEnoughSeats: '모든 학생을 배정할 자리가 부족합니다!',
    allSeatsAssigned: '모든 학생이 자리에 배정되었습니다!',
    noStudents: '등록된 학생이 없습니다. 먼저 CSV를 업로드하세요.',
    noDesks: '배치된 책상이 없습니다. 먼저 교실 배치를 설계하세요.',
  },

  zh: {
    // App
    appTitle: '教室座位安排',
    appSubtitle: '学生座位安排程序',

    // Language
    language: '语言',

    // Steps
    step1: '班级设置',
    step2: '教室布局',
    step3: '分配座位',

    // Desk count
    totalDeskCount: '教室里有几张桌子？',
    deskCountHint: '输入桌子数量 → 自动生成布局',
    desks: '张',
    applyDeskCount: '应用',

    // CSV Upload
    uploadCSV: '上传CSV',
    uploadDesc: '上传包含学生姓名和性别的CSV文件',
    dragDropCSV: '将CSV文件拖放到此处，或点击浏览',
    csvFormat: 'CSV格式：姓名、性别（M/F）',
    downloadSample: '下载示例CSV',
    studentsLoaded: '名学生已加载',
    clearStudents: '全部清除',
    name: '姓名',
    gender: '性别',
    boy: '男',
    girl: '女',
    male: '男',
    female: '女',
    addStudent: '添加学生',
    addStudentName: '学生姓名...',
    removeStudent: '删除',

    // Room Layout
    roomLayout: '教室布局',
    gridSize: '网格大小',
    rows: '↕ 几排？(前到后)',
    columns: '↔ 每排几个座位？(左到右)',
    presets: '预设',
    presetRows: '传统排列',
    presetPaired: '两人一桌',
    presetUShape: 'U形排列',
    presetGroups4: '四人一组',
    presetGroups6: '六人一组',
    presetCircle: '圆形排列',
    presetEmpty: '空教室',
    clickToToggle: '点击单元格切换桌子开/关。拖动可批量操作。',
    clearAll: '全部清除',
    fillAll: '全部填充',
    totalDesks: '桌子总数',
    teacherDesk: '讲台',

    // Mode toggle
    editLayout: '编辑布局',
    assignSeats: '分配座位',

    // Seating
    seatingArrangement: '座位安排',
    unassigned: '未分配',
    randomAssign: '随机分配',
    shuffle: '打乱',
    boyGirlMix: '男女混合',
    clearSeats: '清除座位',
    dragToAssign: '将学生拖到座位上或使用自动分配按钮',
    seatEmpty: '空位',
    clickToRemove: '点击移除',

    // Chart title
    chartTitlePlaceholder: '例如：1月座位表 – 金老师班',
    chartTitleLabel: '座位表标题',
    chartTitlePrompt: '请输入座位表标题（留空则不显示标题）：',

    // Export
    exportPrint: '打印 / 导出',
    print: '打印',
    exportImage: '导出为图片',

    // Messages
    notEnoughSeats: '座位不够，无法安排所有学生！',
    allSeatsAssigned: '所有学生都已分配座位！',
    noStudents: '没有学生。请先上传CSV文件。',
    noDesks: '没有桌子。请先设计教室布局。',
  },
};

export default translations;
