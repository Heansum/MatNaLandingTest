# 나그네 - 맛집 숏폼 플랫폼

확장 가능한 MVP 아키텍처로 설계된 **GPS 기반 맛집 숏폼 플랫폼**입니다. Phase 1에서는 추천 알고리즘 기반의 피드를, Phase 2에서는 GPS 기반 위치 서비스를 제공합니다.

## 🏗️ 아키텍처 개요

### Phase 1: 추천 기반 MVP (현재)
- **목적**: 빠른 출시를 위한 "맛집 추천 피드" (Instagram Reels 스타일)
- **핵심 기능**: OAuth 인증, 사용자 프로필, 추천 피드, 소셜 액션, 관리자 대시보드

### Phase 2: GPS 기반 확장 (향후)
- **목적**: MVP 성공 후 위치 인식 기능 추가
- **핵심 기능**: GPS 기반 맛집 검색, 하이브리드 피드, 지도 통합, 고급 필터

## 🚀 주요 기능

### Phase 1 기능
- ✅ **OAuth2.0 인증**: Google, Apple, Kakao 로그인
- ✅ **사용자 프로필**: 선호도 데이터 저장 및 관리
- ✅ **추천 피드**: 콘텐츠 기반 필터링 알고리즘
- ✅ **소셜 액션**: 좋아요, 저장, 댓글, 공유
- ✅ **관리자 대시보드**: 맛집 등록 및 미디어 관리
- ✅ **모바일 최적화**: 터치 제스처, 반응형 디자인

### Phase 2 기능 (계획)
- 🔄 **GPS 기반 검색**: 근처 맛집 실시간 검색
- 🔄 **하이브리드 피드**: 추천 + 근처 인기 맛집
- 🔄 **지도 통합**: Google Maps / Kakao Maps API
- 🔄 **고급 필터**: 거리, 평점, 음식 종류별 필터링

## 🛠️ 기술 스택

### Backend
- **Spring Boot 3.2.0**: REST API, JPA/Hibernate
- **PostgreSQL + PostGIS**: 확장 가능한 데이터베이스
- **Supabase**: 데이터베이스 및 스토리지
- **Redis**: 캐싱 및 세션 관리
- **JWT + OAuth2**: 인증 및 권한 관리

### Frontend
- **Next.js 14**: React 프레임워크
- **TypeScript**: 타입 안전성
- **TailwindCSS**: 유틸리티 우선 CSS
- **Framer Motion**: 애니메이션
- **React Query**: 서버 상태 관리

### Infrastructure
- **Docker**: 컨테이너화
- **Nginx**: 리버스 프록시 및 로드 밸런싱
- **PostgreSQL**: 메인 데이터베이스
- **Redis**: 캐싱 레이어

## 📁 프로젝트 구조

```
나그네 프로젝트/
├── backend/                    # Spring Boot 백엔드
│   ├── src/main/java/com/nagune/restaurantplatform/
│   │   ├── entity/            # JPA 엔티티
│   │   ├── repository/        # 데이터 접근 계층
│   │   ├── service/           # 비즈니스 로직
│   │   ├── controller/        # REST API 컨트롤러
│   │   ├── config/            # 설정 클래스
│   │   ├── dto/               # 데이터 전송 객체
│   │   ├── security/          # 보안 설정
│   │   └── exception/         # 예외 처리
│   ├── src/main/resources/
│   │   └── application.yml    # 애플리케이션 설정
│   └── Dockerfile
├── frontend/                   # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/               # App Router 페이지
│   │   ├── components/        # React 컴포넌트
│   │   ├── hooks/             # 커스텀 훅
│   │   ├── lib/               # 유틸리티 및 설정
│   │   ├── types/             # TypeScript 타입
│   │   └── utils/             # 헬퍼 함수
│   ├── public/                # 정적 파일
│   └── Dockerfile
├── nginx/                      # Nginx 설정
│   └── nginx.conf
├── docs/                       # 문서
├── docker-compose.yml          # Docker Compose 설정
└── README.md
```

## 🚀 빠른 시작

### 1. 환경 설정

```bash
# 저장소 클론
git clone <repository-url>
cd nagune-restaurant-platform

# 환경 변수 설정
cp frontend/env.example frontend/.env.local
cp backend/src/main/resources/application.yml.example backend/src/main/resources/application.yml
```

### 2. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 데이터베이스 URL 및 API 키 복사
3. 환경 변수에 설정:

```env
# frontend/.env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# backend/src/main/resources/application.yml
supabase:
  url: your_supabase_url
  anon-key: your_supabase_anon_key
  service-role-key: your_supabase_service_role_key
```

### 3. OAuth 설정

각 OAuth 제공자에서 클라이언트 ID와 시크릿을 발급받아 환경 변수에 설정:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Kakao OAuth
KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_CLIENT_SECRET=your_kakao_client_secret

# Apple OAuth
APPLE_CLIENT_ID=your_apple_client_id
APPLE_CLIENT_SECRET=your_apple_client_secret
```

### 4. Docker로 실행

```bash
# 전체 스택 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 서비스 중지
docker-compose down
```

### 5. 개발 모드로 실행

```bash
# Backend 실행
cd backend
./mvnw spring-boot:run

# Frontend 실행
cd frontend
npm install
npm run dev
```

## 📱 사용법

### 기본 조작
- **스와이프 업/다운**: 피드 탐색
- **스와이프 좌/우**: 맛집 상세 정보 / 지도
- **탭**: 재생/일시정지, 좋아요, 댓글 등

### 키보드 단축키
- **스페이스바**: 재생/일시정지
- **↑/↓**: 피드 탐색
- **←/→**: 맛집 정보 / 지도

## 🔧 개발 가이드

### 엔티티 설계 원칙
- **UUID 기본키**: 확장성 및 보안
- **타임스탬프**: 생성/수정 시간 추적
- **소프트 삭제**: 데이터 보존
- **Phase 2 확장**: GPS 필드 미리 준비

### API 설계 원칙
- **RESTful**: 표준 HTTP 메서드 사용
- **페이지네이션**: 대용량 데이터 처리
- **에러 핸들링**: 일관된 에러 응답
- **인증**: JWT 토큰 기반

### 프론트엔드 설계 원칙
- **모바일 우선**: 터치 친화적 UI
- **성능 최적화**: 코드 스플리팅, 지연 로딩
- **접근성**: 키보드 네비게이션, 스크린 리더
- **반응형**: 다양한 화면 크기 지원

## 🧪 테스트

```bash
# Backend 테스트
cd backend
./mvnw test

# Frontend 테스트
cd frontend
npm run test

# E2E 테스트
npm run test:e2e
```

## 📊 모니터링

- **Health Check**: `/health` 엔드포인트
- **메트릭**: Spring Boot Actuator
- **로그**: 구조화된 JSON 로그
- **에러 추적**: Sentry 통합 (선택사항)

## 🚀 배포

### 프로덕션 환경
1. 환경 변수 설정
2. SSL 인증서 설정
3. 도메인 설정
4. Docker Compose 실행

### CI/CD 파이프라인
- GitHub Actions 설정
- 자동 테스트 실행
- Docker 이미지 빌드
- 자동 배포

## 🔒 보안

- **API 키 보호**: 환경 변수 사용
- **CORS 설정**: 허용된 도메인만
- **Rate Limiting**: API 호출 제한
- **SQL Injection 방지**: JPA 사용
- **XSS 방지**: 입력 검증 및 이스케이프

## 📈 성능 최적화

- **데이터베이스 인덱싱**: 자주 조회되는 필드
- **캐싱**: Redis를 통한 응답 캐싱
- **CDN**: 정적 파일 배포
- **이미지 최적화**: WebP 형식 사용
- **번들 최적화**: Tree shaking, 코드 스플리팅

## 🌟 향후 개선 방향

### Phase 1 완료 목표
- [x] 기본 아키텍처 구축
- [x] OAuth 인증 시스템
- [x] 추천 알고리즘 구현
- [x] 모바일 최적화 UI
- [ ] 관리자 대시보드
- [ ] 시드 데이터 스크립트

### Phase 2 확장 목표
- [ ] GPS 기반 검색
- [ ] 실시간 지도 통합
- [ ] 하이브리드 추천 시스템
- [ ] 고급 필터링
- [ ] 오프라인 지원

### 장기 목표
- [ ] AI 기반 개인화 추천
- [ ] 실시간 채팅
- [ ] 소셜 기능 강화
- [ ] PWA 지원
- [ ] 다국어 지원

## 🤝 기여하기

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 📞 지원

- **이슈 리포트**: GitHub Issues
- **문서**: 프로젝트 Wiki
- **커뮤니티**: Discord 서버

---

**개발팀**: 나그네 개발팀  
**최종 업데이트**: 2024년 9월  
**버전**: 1.0.0-alpha