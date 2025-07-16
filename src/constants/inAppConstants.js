/*
* ! 데이터를 불러올 때는 공통코드에 등록해서 사용 할 것.(이 파일은 공통코드가 없을 때 사용)
* */

export const hardcodedData = {
    displayTypes: [
        { code: 'bar', codeNm: 'BAR' },
        { code: 'box', codeNm: 'BOX' },
        { code: 'star', codeNm: 'STAR' },
        { code: 'slide', codeNm: 'SLIDE' }
    ],
    templates: [
        { code: 'M1', codeNm: '이미지', val1: 'Y', val2: 'N', val3: '0' },
        { code: 'M2', codeNm: '텍스트', val1: 'N', val2: 'Y', val3: '0' },
        { code: 'M3', codeNm: '이미지 + 텍스트', val1: 'Y', val2: 'Y', val3: '0' },
        { code: 'M4', codeNm: '이미지 + 버튼 1', val1: 'Y', val2: 'N', val3: '1' },
        { code: 'M5', codeNm: '이미지 + 버튼 2', val1: 'Y', val2: 'N', val3: '2' },
        { code: 'M6', codeNm: '이미지 + 텍스트 + 버튼 1', val1: 'Y', val2: 'Y', val3: '1' },
        { code: 'M7', codeNm: '이미지 + 텍스트 + 버튼 2', val1: 'Y', val2: 'Y', val3: '2' },
        { code: 'M8', codeNm: '설문', val1: 'N', val2: 'Y', val3: '0' }
    ]
};

// 표시형태별 활성화할 컴포넌트 매핑
export const displayComponentMapping = {
    'BAR': {
        image: true,   // 바형은 항상 이미지 포함
        text: true,    // 바형은 항상 텍스트 포함
        button: false  // 바형은 버튼 없음
    },
    'BOX': {
        image: true,   // 박스형은 항상 이미지 포함
        text: true,    // 박스형은 텍스트 선택 가능
        button: true   // 박스형은 버튼 선택 가능
    },
    'SLIDE': {
        image: true,   // 슬라이드형은 항상 이미지 포함
        text: true,    // 슬라이드형은 텍스트 선택 가능
        button: true   // 슬라이드형은 버튼 선택 가능
    },
    'STAR': {
        image: false,  // 별점형은 이미지 없음
        text: true,    // 별점형은 텍스트만
        button: false  // 별점형은 버튼 없음
    }
};