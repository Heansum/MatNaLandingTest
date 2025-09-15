# 나그네 - GPS 기반 맛집 숏폼 플랫폼 MVP

모바일 환경에 최적화된 **실시간 GPS 근거리 기반 맛집 숏폼 플랫폼**의 최소 동작 가능한 MVP입니다.

## 🚀 주요 기능

### 1. 로딩 화면
- 아름다운 그라데이션 배경
- 로딩 스피너 애니메이션
- 3초 후 자동으로 메인 화면 전환

### 2. GPS 기반 맛집 추천
- **실시간 위치 확인**: HTML5 Geolocation API 사용
- **근거리 맛집 검색**: Google Places API로 실제 주변 맛집 검색
- **정확한 거리 계산**: Haversine 공식으로 미터 단위 거리 측정
- **GPS 권한 관리**: 사용자 위치 접근 권한 요청 및 관리
- **실시간 지도**: Google Maps JavaScript API로 인터랙티브 지도 표시

### 3. 맛집 숏폼 영상
- **YouTube Shorts 지원**: 설정으로 YouTube Shorts 또는 로컬 비디오 선택
- 맛집별 맞춤 숏폼 영상 재생
- 자동 재생 및 루프 재생
- 재생/일시정지 컨트롤 (로컬 비디오)
- 맛집 정보 및 거리 오버레이

### 4. 맛집 서비스 기능
- **예약하기**: 맛집 방문 예약 (이름, 전화번호, 날짜, 시간, 인원)
- **찾아가기**: Google Maps Directions API로 실시간 경로 안내
- **교통수단별 소요시간**: 도보, 자동차, 대중교통별 정확한 소요시간 계산
- **맛집 상세정보**: Google Places API 기반 실시간 평점, 가격대, 주소 등
- **인터랙티브 지도**: 맛집 마커, 정보창, 경로 표시 등

### 5. 모바일 최적화
- 터치 제스처 지원 (스와이프로 화면 전환)
- 반응형 디자인
- 모바일 친화적 UI/UX

## 🛠️ 기술 스택

- **HTML5**: 시맨틱 마크업, Geolocation API
- **CSS3**: 모던 CSS, 애니메이션, 반응형 디자인
- **JavaScript**: ES6+, GPS 위치 서비스, 거리 계산 알고리즘
- **GPS 기술**: HTML5 Geolocation, Haversine 거리 계산 공식
- **Google Maps API**: Maps JavaScript API, Places API, Directions API, Geocoding API
- **폰트**: Noto Sans KR (한글 최적화)

## 📱 사용법

### 기본 조작
- **재생/일시정지**: 화면 상단의 재생/일시정지 버튼
- **예약하기**: 하단 "예약하기" 버튼 클릭
- **찾아가기**: 하단 "찾아가기" 버튼 클릭
- **뒤로가기**: "← 뒤로" 버튼 클릭

### 터치 제스처 (모바일)
- **왼쪽 스와이프**: 예약하기 화면으로 이동
- **오른쪽 스와이프**: 찾아가기 화면으로 이동

### 키보드 단축키
- **스페이스바**: 재생/일시정지
- **←**: 예약하기 화면으로 이동
- **→**: 찾아가기 화면으로 이동
- **ESC**: 메인 화면으로 돌아가기

## 🎨 디자인 특징

- **그라데이션 배경**: 모던하고 세련된 색상 조합
- **글래스모피즘**: 반투명 효과와 블러 처리
- **부드러운 애니메이션**: CSS 트랜지션과 키프레임
- **직관적 UI**: 사용자 친화적인 버튼과 폼

## 📁 파일 구조

```
나그네 프로젝트/
├── index.html          # 메인 HTML 파일
├── styles.css          # CSS 스타일시트
├── script.js           # JavaScript 기능
└── README.md           # 프로젝트 설명서
```

## 🚀 실행 방법

1. 모든 파일을 같은 디렉토리에 저장
2. **API 키 설정**:
   - `config.example.js`를 `config.js`로 복사
   - `config.js`에서 `YOUR_ACTUAL_API_KEY_HERE`를 실제 Google Maps API 키로 교체
3. `index.html` 파일을 웹 브라우저에서 열기
4. 모바일 환경에서 테스트하려면 개발자 도구의 모바일 뷰 사용

### 🔑 Google Maps API 키 발급 방법:

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. 다음 API들을 활성화:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Geocoding API
3. 사용자 인증 정보에서 API 키 생성
4. API 키 제한 설정 (도메인, IP 등)
5. `config.js`에 API 키 입력

### 📍 GPS 기능 제어:

GPS 기능을 켜고 끌 수 있습니다:

```javascript
// config.js
GPS: {
    ENABLED: false, // false: GPS 끄기, true: GPS 켜기
    SHOW_PERMISSION_POPUP: false, // false: 권한 요청 팝업 숨김, true: 팝업 표시
    // ... 기타 설정
}
```

- **GPS 끄기**: `ENABLED: false` - 샘플 데이터로 작동
- **GPS 켜기**: `ENABLED: true` - 실제 GPS 위치 기반 작동
- **권한 팝업 숨김**: `SHOW_PERMISSION_POPUP: false` - 팝업 없이 GPS 사용
- **권한 팝업 표시**: `SHOW_PERMISSION_POPUP: true` - 권한 요청 팝업 표시

### 🚫 GPS 권한 팝업 닫기:

GPS 권한 요청 팝업이 표시될 때:
- **오른쪽 상단 X 버튼**: 팝업을 닫고 샘플 데이터로 초기화
- **GPS 활성화 버튼**: GPS 권한 허용 및 위치 확인
- **자동 처리**: X 버튼 클릭 시 GPS 설정에 따라 자동으로 적절한 동작 수행

### 🎬 비디오 타입 제어:

YouTube Shorts 또는 로컬 비디오를 선택할 수 있습니다:

```javascript
// config.js
VIDEO: {
    TYPE: 'youtube', // 'youtube' 또는 'local'
    YOUTUBE_SHORTS_ID: 'xZUaA5mmRl0', // YouTube Shorts ID
    AUTOPLAY: true,
    MUTE: true,
    LOOP: true
}
```

- **YouTube Shorts**: `TYPE: 'youtube'` - YouTube 영상 사용
- **로컬 비디오**: `TYPE: 'local'` - 로컬 파일 사용

## 🌟 향후 개선 방향

- [x] **실시간 GPS 위치 확인** ✅
- [x] **근거리 맛집 검색** ✅
- [x] **정확한 거리 계산** ✅
- [x] **Google Maps API 연동** ✅
- [x] **실시간 맛집 검색** ✅
- [x] **정확한 경로 안내** ✅
- [ ] 백엔드 연동으로 예약 데이터 저장
- [ ] 사용자 인증 시스템
- [ ] 더 많은 맛집 숏폼 영상 지원
- [ ] 맛집 리뷰 및 평점 시스템
- [ ] 소셜 미디어 공유 기능
- [ ] PWA 지원으로 앱처럼 사용

## 📱 브라우저 지원

- Chrome (권장)
- Safari
- Firefox
- Edge
- 모바일 브라우저 (iOS Safari, Chrome Mobile)

## 🔧 개발자 정보

이 프로젝트는 모바일 최적화된 웹사이트 MVP 개발을 위해 제작되었습니다.

---

**참고**: 
- 현재 비디오는 샘플 링크를 사용하고 있습니다. 실제 서비스에서는 맛집별 맞춤 숏폼 영상을 사용하시기 바랍니다.
- GPS 기능은 HTTPS 환경에서만 작동합니다. 로컬 테스트 시에는 브라우저 설정에서 위치 정보 접근을 허용해주세요.
- **Google Maps API 키가 필요합니다**: `config.js` 파일에서 API 키를 설정해주세요.
- Google Maps API는 무료 할당량이 있으므로 사용량을 모니터링하시기 바랍니다.
- **보안**: `config.js`는 `.gitignore`에 추가되어 Git에 커밋되지 않습니다.
