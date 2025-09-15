// 환경 설정 예시 파일
// 이 파일을 복사하여 config.js로 만들고 실제 API 키를 입력하세요

const CONFIG = {
    // Google Maps API 설정
    GOOGLE_MAPS: {
        API_KEY: 'YOUR_ACTUAL_API_KEY_HERE', // 실제 API 키로 교체
        LIBRARIES: ['places', 'geometry'],
        DEFAULT_LOCATION: {
            lat: 37.5665, // 서울시청
            lng: 126.9780
        },
        DEFAULT_ZOOM: 15,
        SEARCH_RADIUS: 1000, // 1km
        MAX_RESULTS: 5
    },
    
    // GPS 설정
    GPS: {
        ENABLED: false, // GPS 기능 켜기/끄기 (true: 켜기, false: 끄기)
        SHOW_PERMISSION_POPUP: false, // GPS 권한 요청 팝업 표시 여부 (true: 표시, false: 숨김)
        TIMEOUT: {
            HIGH_ACCURACY: 30000, // 30초
            LOW_ACCURACY: 15000   // 15초
        },
        MAX_AGE: {
            HIGH_ACCURACY: 600000, // 10분
            LOW_ACCURACY: 300000   // 5분
        },
        SWIPE_THRESHOLD: 50 // 스와이프 감지 임계값
    },
    
    // 애니메이션 설정
    ANIMATION: {
        LOADING_DELAY: 3000,    // 로딩 화면 표시 시간
        FADE_DURATION: 500,     // 페이드 애니메이션 시간
        SUCCESS_DISPLAY_TIME: 3000, // 성공 메시지 표시 시간
        ERROR_DISPLAY_TIME: 5000    // 에러 메시지 표시 시간
    },
    
    // 맛집 설정
    RESTAURANT: {
        TYPES: ['restaurant', 'food'],
        PRICE_LEVELS: {
            1: '💰',
            2: '💰💰',
            3: '💰💰💰',
            4: '💰💰💰💰'
        }
    },
    
    // 거리 계산 설정
    DISTANCE: {
        WALKING_SPEED: 80,      // 분당 80m
        DRIVING_SPEED: 500,     // 분당 500m
        TRANSIT_SPEED: 200      // 분당 200m
    },
    
    // 비디오 설정
    VIDEO: {
        TYPE: 'youtube', // 'youtube' 또는 'local'
        YOUTUBE_SHORTS_ID: 'xZUaA5mmRl0', // YouTube Shorts ID
        AUTOPLAY: true,
        MUTE: false, // 소리 활성화
        LOOP: true,
        CONTROLS: false,
        SHOW_INFO: false,
        RELATED_VIDEOS: false
    }
};

// 개발/프로덕션 환경 구분
const ENV = {
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    isProduction: window.location.protocol === 'https:'
};

// 환경별 설정 오버라이드
if (ENV.isDevelopment) {
    console.log('개발 환경에서 실행 중');
    // 개발 환경에서는 더 긴 타임아웃 사용
    CONFIG.GPS.TIMEOUT.HIGH_ACCURACY = 45000;
    CONFIG.GPS.TIMEOUT.LOW_ACCURACY = 20000;
}

// 설정 유효성 검사
function validateConfig() {
    if (CONFIG.GOOGLE_MAPS.API_KEY === 'YOUR_ACTUAL_API_KEY_HERE') {
        console.warn('⚠️ Google Maps API 키가 설정되지 않았습니다. config.js 파일에서 API 키를 설정해주세요.');
        return false;
    }
    return true;
}

// 설정 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, ENV, validateConfig };
}
