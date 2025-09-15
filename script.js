// DOM 요소들
const loadingScreen = document.getElementById('loading-screen');
const mainContainer = document.getElementById('main-container');
const videoSection = document.getElementById('video-section');
const rightSection = document.getElementById('right-section');
const youtubeVideo = document.getElementById('youtube-video');
const localVideo = document.getElementById('local-video');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const reservationBtn = document.getElementById('reservation-btn');
const findBtn = document.getElementById('find-btn');
const backBtn = document.getElementById('back-btn');
const sectionTitle = document.getElementById('section-title');
const reservationContent = document.getElementById('reservation-content');
const findContent = document.getElementById('find-content');
const submitReservationBtn = document.getElementById('submit-reservation');

// GPS 관련 요소들
const gpsPermission = document.getElementById('gps-permission');
const enableGpsBtn = document.getElementById('enable-gps');
const closeGpsPermissionBtn = document.getElementById('close-gps-permission');
const restaurantName = document.getElementById('restaurant-name');

// DOM 요소 확인 로그
console.log('GPS 관련 요소들:', {
    gpsPermission: gpsPermission,
    enableGpsBtn: enableGpsBtn,
    closeGpsPermissionBtn: closeGpsPermissionBtn
});
const restaurantDesc = document.getElementById('restaurant-desc');
const distanceText = document.getElementById('distance-text');
const currentCoordinates = document.getElementById('current-coordinates');
const currentDistance = document.getElementById('current-distance');
const currentLocationText = document.getElementById('current-location-text');
const currentAddress = document.getElementById('current-address');
const estimatedTime = document.getElementById('estimated-time');
const reservationRestaurantName = document.getElementById('reservation-restaurant-name');
const reservationRestaurantAddress = document.getElementById('reservation-restaurant-address');
const findRestaurantName = document.getElementById('find-restaurant-name');
const findRestaurantAddress = document.getElementById('find-restaurant-address');

// 현재 상태 관리
let currentSection = 'video';
let isVideoPlaying = false;

// GPS 관련 상태
let currentLocation = null;
let nearbyRestaurants = [];
let selectedRestaurant = null;
let gpsPermissionGranted = false;

// Google Maps 관련 상태
let map = null;
let currentMarker = null;
let restaurantMarkers = [];
let directionsService = null;
let directionsRenderer = null;
let geocoder = null;

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소들 재확인 및 이벤트 연결
    initializeEventListeners();
    
    // 로딩 화면 표시 (설정된 시간 후 메인 화면으로 전환)
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContainer.classList.remove('hidden');
            initializeVideo();
            // Google Maps API가 로드된 후에만 초기화
            if (typeof google !== 'undefined' && google.maps) {
                initializeGoogleMaps();
                checkGPSPermission();
            } else {
                // API 로드 대기
                waitForGoogleMapsAPI();
            }
        }, CONFIG.ANIMATION.FADE_DURATION);
    }, CONFIG.ANIMATION.LOADING_DELAY);
});

// 이벤트 리스너 초기화
function initializeEventListeners() {
    console.log('이벤트 리스너 초기화 중...');
    
    // GPS 관련 요소들 재확인
    const gpsPermission = document.getElementById('gps-permission');
    const enableGpsBtn = document.getElementById('enable-gps');
    const closeGpsPermissionBtn = document.getElementById('close-gps-permission');
    
    console.log('GPS 관련 요소들 재확인:', {
        gpsPermission: gpsPermission,
        enableGpsBtn: enableGpsBtn,
        closeGpsPermissionBtn: closeGpsPermissionBtn
    });
    
    // GPS 활성화 버튼 이벤트 연결
    if (enableGpsBtn) {
        enableGpsBtn.addEventListener('click', () => {
            console.log('GPS 활성화 버튼 클릭됨!');
            getCurrentLocation();
        });
    }
    
    // GPS 권한 요청 팝업 닫기 버튼 이벤트 연결
    if (closeGpsPermissionBtn) {
        closeGpsPermissionBtn.addEventListener('click', () => {
            console.log('X 버튼 클릭됨!'); // 디버깅용 로그
            closeGPSPermission();
        });
    }
    
    console.log('이벤트 리스너 초기화 완료');
}

// Google Maps API 로드 대기
function waitForGoogleMapsAPI() {
    const checkInterval = setInterval(() => {
        if (typeof google !== 'undefined' && google.maps) {
            clearInterval(checkInterval);
            initializeGoogleMaps();
            checkGPSPermission();
        }
    }, 100);
}

// 비디오 초기화
function initializeVideo() {
    if (CONFIG.VIDEO.TYPE === 'youtube') {
        initializeYouTubeVideo();
    } else {
        initializeLocalVideo();
    }
}

// YouTube 비디오 초기화
function initializeYouTubeVideo() {
    console.log('YouTube Shorts 초기화 중...');
    
    // YouTube iframe URL 설정
    const videoId = CONFIG.VIDEO.YOUTUBE_SHORTS_ID;
    const autoplay = CONFIG.VIDEO.AUTOPLAY ? 1 : 0;
    const mute = CONFIG.VIDEO.MUTE ? 1 : 0;
    const loop = CONFIG.VIDEO.LOOP ? 1 : 0;
    const controls = CONFIG.VIDEO.CONTROLS ? 1 : 0;
    const showInfo = CONFIG.VIDEO.SHOW_INFO ? 1 : 0;
    const relatedVideos = CONFIG.VIDEO.RELATED_VIDEOS ? 1 : 0;
    
    const youtubeUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&mute=${mute}&loop=${loop}&playlist=${videoId}&controls=${controls}&showinfo=${showInfo}&rel=${relatedVideos}&modestbranding=1&playsinline=1`;
    
    youtubeVideo.src = youtubeUrl;
    youtubeVideo.style.display = 'block';
    localVideo.style.display = 'none';
    
    // YouTube iframe 로드 완료 후
    youtubeVideo.onload = () => {
        console.log('YouTube Shorts 로드 완료');
        isVideoPlaying = true;
        updateVideoControls();
    };
    
    // YouTube 자동 재생 정책으로 인해 음소거 상태로 시작
    if (mute) {
        isVideoPlaying = true;
        updateVideoControls();
    }
}

// 로컬 비디오 초기화
function initializeLocalVideo() {
    console.log('로컬 비디오 초기화 중...');
    
    youtubeVideo.style.display = 'none';
    localVideo.style.display = 'block';
    
    // 로컬 비디오 자동 재생 시도
    localVideo.play().then(() => {
        isVideoPlaying = true;
        updateVideoControls();
    }).catch(error => {
        console.log('자동 재생 실패:', error);
        isVideoPlaying = false;
        updateVideoControls();
    });

    // 로컬 비디오 이벤트 리스너
    localVideo.addEventListener('ended', () => {
        localVideo.currentTime = 0;
        localVideo.play();
    });

    localVideo.addEventListener('play', () => {
        isVideoPlaying = true;
        updateVideoControls();
    });

    localVideo.addEventListener('pause', () => {
        isVideoPlaying = false;
        updateVideoControls();
    });
}

// 비디오 컨트롤 업데이트
function updateVideoControls() {
    if (isVideoPlaying) {
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
    } else {
        playBtn.style.display = 'block';
        pauseBtn.style.display = 'none';
    }
}

// 재생/일시정지 버튼 이벤트
playBtn.addEventListener('click', () => {
    if (CONFIG.VIDEO.TYPE === 'youtube') {
        // YouTube iframe은 직접 제어 불가, 새로고침으로 재시작
        const currentSrc = youtubeVideo.src;
        youtubeVideo.src = currentSrc;
        isVideoPlaying = true;
        updateVideoControls();
    } else {
        localVideo.play();
    }
});

pauseBtn.addEventListener('click', () => {
    if (CONFIG.VIDEO.TYPE === 'youtube') {
        // YouTube iframe은 직접 제어 불가, 메시지 표시
        alert('YouTube Shorts는 일시정지 기능을 지원하지 않습니다.');
    } else {
        localVideo.pause();
    }
});

// 예약하기 버튼 클릭
reservationBtn.addEventListener('click', () => {
    showRightSection('reservation');
});

// 찾아가기 버튼 클릭
findBtn.addEventListener('click', () => {
    showRightSection('find');
});

// 뒤로가기 버튼 클릭
backBtn.addEventListener('click', () => {
    hideRightSection();
});

// 오른쪽 섹션 표시
function showRightSection(section) {
    currentSection = section;
    
    // 비디오 일시정지
    shortVideo.pause();
    isVideoPlaying = false;
    updateVideoControls();
    
    // 섹션 제목 및 내용 설정
    if (section === 'reservation') {
        sectionTitle.textContent = '예약하기';
        reservationContent.classList.remove('hidden');
        findContent.classList.add('hidden');
    } else if (section === 'find') {
        sectionTitle.textContent = '찾아가기';
        findContent.classList.remove('hidden');
        reservationContent.classList.add('hidden');
    }
    
    // 슬라이드 애니메이션
    mainContainer.classList.add('slide-right');
    
    // 오른쪽 섹션 표시
    rightSection.classList.remove('hidden');
}

// 오른쪽 섹션 숨기기
function hideRightSection() {
    // 슬라이드 애니메이션 제거
    mainContainer.classList.remove('slide-right');
    
    // 오른쪽 섹션 숨기기
    setTimeout(() => {
        rightSection.classList.add('hidden');
    }, 500);
    
    // 비디오 재생 재개
    shortVideo.play();
    isVideoPlaying = true;
    updateVideoControls();
}

// 예약 제출
submitReservationBtn.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    
    if (!name || !phone || !date || !time) {
        alert('모든 필드를 입력해주세요.');
        return;
    }
    
    // 예약 성공 메시지
    alert('예약이 완료되었습니다!');
    
    // 폼 초기화
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('date').value = '';
    document.getElementById('time').value = '';
    
    // 메인 화면으로 돌아가기
    hideRightSection();
});

// 터치 제스처 지원 (모바일)
let touchStartX = 0;
let touchEndX = 0;

videoSection.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

videoSection.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = CONFIG.GPS.SWIPE_THRESHOLD;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // 왼쪽으로 스와이프 - 예약하기
            showRightSection('reservation');
        } else {
            // 오른쪽으로 스와이프 - 찾아가기
            showRightSection('find');
        }
    }
}

// 키보드 단축키 지원
document.addEventListener('keydown', (e) => {
    if (currentSection === 'video') {
        switch(e.key) {
            case ' ':
                e.preventDefault();
                if (isVideoPlaying) {
                    shortVideo.pause();
                } else {
                    shortVideo.play();
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                showRightSection('reservation');
                break;
            case 'ArrowRight':
                e.preventDefault();
                showRightSection('find');
                break;
            case 'Escape':
                if (currentSection !== 'video') {
                    hideRightSection();
                }
                break;
        }
    }
});

// 성능 최적화를 위한 비디오 프리로딩
function preloadVideo() {
    const video = new Audio();
    video.src = shortVideo.src;
    video.load();
}

// 페이지 가시성 변경 시 비디오 제어
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (isVideoPlaying) {
            shortVideo.pause();
        }
    } else {
        if (currentSection === 'video' && !isVideoPlaying) {
            shortVideo.play();
        }
    }
});

// 네트워크 상태 모니터링
window.addEventListener('online', () => {
    console.log('네트워크 연결됨');
});

window.addEventListener('offline', () => {
    console.log('네트워크 연결 끊김');
    alert('네트워크 연결을 확인해주세요.');
});

// 에러 처리
shortVideo.addEventListener('error', (e) => {
    console.error('비디오 로드 에러:', e);
    alert('비디오를 불러올 수 없습니다. 페이지를 새로고침해주세요.');
});

// GPS 권한 확인 및 요청
function checkGPSPermission() {
    // GPS 기능이 비활성화된 경우
    if (!CONFIG.GPS.ENABLED) {
        console.log('GPS 기능이 비활성화되어 있습니다.');
        gpsPermission.style.display = 'none';
        // 샘플 데이터로 초기화
        initializeWithSampleData();
        return;
    }
    
    // GPS 권한 요청 팝업을 표시하지 않는 경우
    if (!CONFIG.GPS.SHOW_PERMISSION_POPUP) {
        console.log('GPS 권한 요청 팝업이 비활성화되어 있습니다.');
        gpsPermission.style.display = 'none';
        // GPS 기능은 활성화되어 있지만 팝업 없이 바로 위치 확인 시도
        if (navigator.geolocation) {
            getCurrentLocation();
        } else {
            // GPS를 지원하지 않는 경우 샘플 데이터로 초기화
            initializeWithSampleData();
        }
        return;
    }
    
    if (!navigator.geolocation) {
        alert('이 브라우저는 GPS를 지원하지 않습니다.');
        return;
    }
    
    // GPS 권한 상태 확인
    navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'granted') {
            gpsPermissionGranted = true;
            gpsPermission.style.display = 'none';
            getCurrentLocation();
        } else if (result.state === 'denied') {
            gpsPermission.style.display = 'flex';
        } else {
            gpsPermission.style.display = 'flex';
        }
    });
}

// 중복된 이벤트 리스너 제거됨 - initializeEventListeners()에서 처리

// GPS 권한 요청 팝업 닫기
function closeGPSPermission() {
    console.log('GPS 권한 요청 팝업을 닫습니다.');
    gpsPermission.style.display = 'none';
    
    // GPS 기능이 비활성화된 경우 샘플 데이터로 초기화
    if (!CONFIG.GPS.ENABLED) {
        initializeWithSampleData();
    } else {
        // GPS 기능이 활성화된 경우 팝업 없이 위치 확인 시도
        if (navigator.geolocation) {
            getCurrentLocation();
        } else {
            initializeWithSampleData();
        }
    }
}

// 현재 위치 가져오기
function getCurrentLocation() {
    if (!navigator.geolocation) {
        alert('GPS를 사용할 수 없습니다.');
        return;
    }
    
    // 로딩 상태 표시
    showGPSLoading();
    
    const options = {
        enableHighAccuracy: true,
        timeout: CONFIG.GPS.TIMEOUT.HIGH_ACCURACY,
        maximumAge: CONFIG.GPS.MAX_AGE.HIGH_ACCURACY
    };
    
    // 첫 번째 시도 (고정밀)
    navigator.geolocation.getCurrentPosition(
        (position) => {
            handleGPSSuccess(position);
        },
        (error) => {
            console.error('고정밀 GPS 에러:', error);
            
            // TIMEOUT 에러인 경우 저정밀으로 재시도
            if (error.code === error.TIMEOUT) {
                console.log('고정밀 GPS 타임아웃, 저정밀으로 재시도...');
                retryWithLowAccuracy();
            } else {
                handleGPSError(error);
            }
        },
        options
    );
}

// 저정밀 GPS로 재시도
function retryWithLowAccuracy() {
    const lowAccuracyOptions = {
        enableHighAccuracy: false, // 저정밀
        timeout: CONFIG.GPS.TIMEOUT.LOW_ACCURACY,
        maximumAge: CONFIG.GPS.MAX_AGE.LOW_ACCURACY
    };
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            handleGPSSuccess(position);
        },
        (error) => {
            console.error('저정밀 GPS 에러:', error);
            handleGPSError(error);
        },
        lowAccuracyOptions
    );
}

// GPS 성공 처리
function handleGPSSuccess(position) {
    hideGPSLoading();
    
    currentLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy // 정확도 정보 추가
    };
    
    gpsPermissionGranted = true;
    gpsPermission.style.display = 'none';
    
    // 좌표 업데이트
    currentCoordinates.textContent = `위도: ${currentLocation.latitude.toFixed(6)}, 경도: ${currentLocation.longitude.toFixed(6)}`;
    
    // 정확도 정보 표시
    if (currentLocation.accuracy) {
        currentCoordinates.textContent += ` (정확도: ±${Math.round(currentLocation.accuracy)}m)`;
    }
    
    // 지도 업데이트
    updateMapWithCurrentLocation();
    
    // 주소 정보 가져오기
    getAddressFromCoordinates(currentLocation.latitude, currentLocation.longitude);
    
    // 근처 맛집 찾기
    findNearbyRestaurants();
    
    // 거리 정보 업데이트
    updateDistanceInfo();
    
    // 성공 메시지
    showGPSSuccessMessage();
}

// GPS 에러 처리
function handleGPSError(error) {
    hideGPSLoading();
    
    console.error('GPS 에러:', error);
    
    let errorMessage = '';
    let retryMessage = '';
    
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = 'GPS 접근이 거부되었습니다.';
            retryMessage = '브라우저 설정에서 위치 정보 접근을 허용해주세요.';
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.';
            retryMessage = 'GPS 신호가 약하거나 네트워크에 문제가 있을 수 있습니다.';
            break;
        case error.TIMEOUT:
            errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
            retryMessage = 'GPS 신호가 약하거나 실내에 있을 수 있습니다. 다시 시도해보세요.';
            break;
        default:
            errorMessage = 'GPS 오류가 발생했습니다.';
            retryMessage = '잠시 후 다시 시도해주세요.';
            break;
    }
    
    // 상세한 에러 메시지 표시
    showGPSErrorDialog(errorMessage, retryMessage);
}

// GPS 로딩 상태 표시
function showGPSLoading() {
    const loadingText = gpsPermission.querySelector('.permission-content p');
    const originalText = loadingText.textContent;
    
    loadingText.textContent = 'GPS 위치 확인 중...';
    loadingText.style.color = '#667eea';
    
    // 로딩 스피너 추가
    if (!gpsPermission.querySelector('.gps-loading-spinner')) {
        const spinner = document.createElement('div');
        spinner.className = 'gps-loading-spinner';
        spinner.innerHTML = '📍';
        spinner.style.animation = 'spin 1s linear infinite';
        gpsPermission.querySelector('.permission-content').appendChild(spinner);
    }
}

// GPS 로딩 상태 숨기기
function hideGPSLoading() {
    const loadingText = gpsPermission.querySelector('.permission-content p');
    loadingText.textContent = '근처 맛집을 찾기 위해 GPS 접근을 허용해주세요';
    loadingText.style.color = 'rgba(255,255,255,0.8)';
    
    // 로딩 스피너 제거
    const spinner = gpsPermission.querySelector('.gps-loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

// GPS 성공 메시지
function showGPSSuccessMessage() {
    const successMsg = document.createElement('div');
    successMsg.className = 'gps-success-message';
    successMsg.innerHTML = '✅ GPS 위치 확인 완료!';
    successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 25px;
        z-index: 1000;
        animation: slideInRight 0.5s ease-out;
    `;
    
    document.body.appendChild(successMsg);
    
    // 설정된 시간 후 자동 제거
    setTimeout(() => {
        successMsg.remove();
    }, CONFIG.ANIMATION.SUCCESS_DISPLAY_TIME);
}

// GPS 에러 다이얼로그
function showGPSErrorDialog(errorMessage, retryMessage) {
    const errorDialog = document.createElement('div');
    errorDialog.className = 'gps-error-dialog';
    errorDialog.innerHTML = `
        <div class="error-content">
            <div class="error-icon">⚠️</div>
            <h3>${errorMessage}</h3>
            <p>${retryMessage}</p>
            <div class="error-actions">
                <button class="retry-btn" onclick="getCurrentLocation()">다시 시도</button>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">닫기</button>
            </div>
        </div>
    `;
    
    errorDialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    document.body.appendChild(errorDialog);
}

// Google Maps 초기화
function initializeGoogleMaps() {
    // Google Maps API가 로드되었는지 확인
    if (typeof google === 'undefined' || !google.maps) {
        console.error('Google Maps API가 로드되지 않았습니다.');
        return;
    }
    
    try {
        // 설정에서 기본 위치 가져오기
        const defaultLocation = CONFIG.GOOGLE_MAPS.DEFAULT_LOCATION;
        
        map = new google.maps.Map(document.getElementById('map'), {
            center: defaultLocation,
            zoom: CONFIG.GOOGLE_MAPS.DEFAULT_ZOOM,
            styles: getMapStyles(),
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
        });
        
        // 서비스들 초기화
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer();
        geocoder = new google.maps.Geocoder();
        
        // 방향 렌더러를 지도에 연결
        directionsRenderer.setMap(map);
        
        console.log('Google Maps 초기화 완료');
        
    } catch (error) {
        console.error('Google Maps 초기화 오류:', error);
    }
}

// 지도 스타일 설정 (다크 테마)
function getMapStyles() {
    return [
        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#263c3f' }]
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6b9a76' }]
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }]
        },
        {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }]
        },
        {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#746855' }]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#1f2835' }]
        },
        {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#f3d19c' }]
        },
        {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#2f3948' }]
        },
        {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#515c6d' }]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#17263c' }]
        }
    ];
}

// 좌표를 주소로 변환 (Google Maps Geocoding API 사용)
function getAddressFromCoordinates(lat, lng) {
    if (!geocoder) {
        currentAddress.textContent = `위도: ${lat.toFixed(6)}, 경도: ${lng.toFixed(6)}`;
        currentLocationText.textContent = '현재 위치가 확인되었습니다';
        return;
    }
    
    const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };
    
    geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK') {
            if (results[0]) {
                const address = results[0].formatted_address;
                currentAddress.textContent = address;
                currentLocationText.textContent = '현재 위치가 확인되었습니다';
                
                // 한국 주소인 경우 한국어로 변환
                if (address.includes('South Korea') || address.includes('대한민국')) {
                    const koreanAddress = address
                        .replace('South Korea', '대한민국')
                        .replace(/,/g, ' ');
                    currentAddress.textContent = koreanAddress;
                }
            }
        } else {
            console.error('Geocoding 실패:', status);
            currentAddress.textContent = `위도: ${lat.toFixed(6)}, 경도: ${lng.toFixed(6)}`;
            currentLocationText.textContent = '현재 위치가 확인되었습니다';
        }
    });
}

// 지도에 현재 위치 표시
function updateMapWithCurrentLocation() {
    if (!map || !currentLocation) return;
    
    const position = { 
        lat: currentLocation.latitude, 
        lng: currentLocation.longitude 
    };
    
    // 지도 중심을 현재 위치로 이동
    map.setCenter(position);
    map.setZoom(16);
    
    // 기존 현재 위치 마커 제거
    if (currentMarker) {
        currentMarker.setMap(null);
    }
    
    // 현재 위치 마커 추가
    currentMarker = new google.maps.Marker({
        position: position,
        map: map,
        title: '현재 위치',
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="white" stroke-width="2"/>
                    <circle cx="12" cy="12" r="3" fill="white"/>
                </svg>
            `),
            scaledSize: new google.maps.Size(24, 24),
            anchor: new google.maps.Point(12, 12)
        }
    });
    
    // 현재 위치 정보창 추가
    const infoWindow = new google.maps.InfoWindow({
        content: '<div style="padding: 10px;"><strong>📍 현재 위치</strong><br>GPS 위치가 확인되었습니다</div>'
    });
    
    currentMarker.addListener('click', () => {
        infoWindow.open(map, currentMarker);
    });
}

// 근처 맛집 찾기 (Google Places API 사용)
function findNearbyRestaurants() {
    if (!map || !currentLocation) return;
    
    // Google Places API로 실제 근처 맛집 검색
    const service = new google.maps.places.PlacesService(map);
    const request = {
        location: { lat: currentLocation.latitude, lng: currentLocation.longitude },
        radius: CONFIG.GOOGLE_MAPS.SEARCH_RADIUS,
        type: CONFIG.RESTAURANT.TYPES
    };
    
    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // 기존 맛집 마커들 제거
            clearRestaurantMarkers();
            
            nearbyRestaurants = results.slice(0, CONFIG.GOOGLE_MAPS.MAX_RESULTS).map((place, index) => ({
                id: place.place_id,
                name: place.name,
                description: place.types ? place.types.join(', ') : '맛집',
                address: place.vicinity || '주소 정보 없음',
                rating: place.rating || 0,
                distance: calculateDistance(
                    currentLocation.latitude,
                    currentLocation.longitude,
                    place.geometry.location.lat(),
                    place.geometry.location.lng()
                ),
                estimatedCost: place.price_level ? CONFIG.RESTAURANT.PRICE_LEVELS[place.price_level] || '💰' : '💰',
                coordinates: {
                    latitude: place.geometry.location.lat(),
                    longitude: place.geometry.location.lng()
                },
                place: place
            }));
            
            // 거리순으로 정렬
            nearbyRestaurants.sort((a, b) => a.distance - b.distance);
            
            // 첫 번째 맛집을 기본 선택
            selectedRestaurant = nearbyRestaurants[0];
            updateRestaurantInfo();
            
            // 맛집 마커들 지도에 표시
            addRestaurantMarkers();
            
        } else {
            console.log('Places API 검색 실패, 샘플 데이터 사용');
            // API 실패 시 샘플 데이터 사용
            useSampleRestaurantData();
        }
    });
}

// GPS 없이 샘플 데이터로 초기화
function initializeWithSampleData() {
    console.log('샘플 데이터로 초기화 중...');
    
    // 서울시청 기준으로 샘플 위치 설정
    const sampleLocation = {
        latitude: 37.5665,
        longitude: 126.9780
    };
    
    // 샘플 맛집 데이터
    nearbyRestaurants = [
        {
            id: 1,
            name: '다가 생구이 서울본점',
            description: '폭탄계란찜으로 완성하는 한 끼',
            address: '서울특별시 강남구 테헤란로 123',
            rating: 4.8,
            distance: 150,
            estimatedCost: '2만원',
            coordinates: {
                latitude: sampleLocation.latitude + 0.001,
                longitude: sampleLocation.longitude + 0.001
            }
        },
        {
            id: 2,
            name: '신선한 회집',
            description: '신선한 회와 해산물 요리',
            address: '서울특별시 강남구 테헤란로 456',
            rating: 4.6,
            distance: 300,
            estimatedCost: '5만원',
            coordinates: {
                latitude: sampleLocation.latitude - 0.001,
                longitude: sampleLocation.longitude - 0.001
            }
        },
        {
            id: 3,
            name: '분위기 좋은 카페',
            description: '커피와 디저트를 즐기세요',
            address: '서울특별시 강남구 테헤란로 789',
            rating: 4.5,
            distance: 500,
            estimatedCost: '1.5만원',
            coordinates: {
                latitude: sampleLocation.latitude + 0.002,
                longitude: sampleLocation.longitude - 0.002
            }
        }
    ];
    
    selectedRestaurant = nearbyRestaurants[0];
    updateRestaurantInfo();
    
    // 지도가 있는 경우 샘플 마커 추가
    if (map) {
        addSampleRestaurantMarkers();
    }
    
    // 거리 정보 업데이트
    updateDistanceInfo();
}

// 샘플 맛집 데이터 사용 (API 실패 시)
function useSampleRestaurantData() {
    if (!currentLocation) {
        // GPS 위치가 없는 경우 샘플 위치 사용
        const sampleLocation = { latitude: 37.5665, longitude: 126.9780 };
        nearbyRestaurants = [
            {
                id: 1,
                name: '다가 생구이 서울본점',
                description: '전통 한식의 맛을 느껴보세요',
                address: '서울특별시 강남구 테헤란로 123',
                rating: 4.8,
                distance: 150,
                estimatedCost: '2만원',
                coordinates: {
                    latitude: sampleLocation.latitude + 0.001,
                    longitude: sampleLocation.longitude + 0.001
                }
            },
            {
                id: 2,
                name: '신선한 회집',
                description: '신선한 회와 해산물 요리',
                address: '서울특별시 강남구 테헤란로 456',
                rating: 4.6,
                distance: 300,
                estimatedCost: '5만원',
                coordinates: {
                    latitude: sampleLocation.latitude - 0.001,
                    longitude: sampleLocation.longitude - 0.001
                }
            },
            {
                id: 3,
                name: '분위기 좋은 카페',
                description: '커피와 디저트를 즐기세요',
                address: '서울특별시 강남구 테헤란로 789',
                rating: 4.5,
                distance: 500,
                estimatedCost: '1.5만원',
                coordinates: {
                    latitude: sampleLocation.latitude + 0.002,
                    longitude: sampleLocation.longitude - 0.002
                }
            }
        ];
    } else {
        // 기존 로직 유지
        nearbyRestaurants = [
            {
                id: 1,
                name: '다가 생구이 서울본점',
                description: '전통 한식의 맛을 느껴보세요',
                address: '서울특별시 강남구 테헤란로 123',
                rating: 4.8,
                distance: 150,
                estimatedCost: '2만원',
                coordinates: {
                    latitude: currentLocation.latitude + 0.001,
                    longitude: currentLocation.longitude + 0.001
                }
            },
            {
                id: 2,
                name: '신선한 회집',
                description: '신선한 회와 해산물 요리',
                address: '서울특별시 강남구 테헤란로 456',
                rating: 4.6,
                distance: 300,
                estimatedCost: '5만원',
                coordinates: {
                    latitude: currentLocation.latitude - 0.001,
                    longitude: currentLocation.longitude - 0.001
                }
            },
            {
                id: 3,
                name: '분위기 좋은 카페',
                description: '커피와 디저트를 즐기세요',
                address: '서울특별시 강남구 테헤란로 789',
                rating: 4.5,
                distance: 500,
                estimatedCost: '1.5만원',
                coordinates: {
                    latitude: currentLocation.latitude + 0.002,
                    longitude: currentLocation.longitude - 0.002
                }
            }
        ];
    }
    
    selectedRestaurant = nearbyRestaurants[0];
    updateRestaurantInfo();
    addSampleRestaurantMarkers();
}

// 맛집 마커들 지도에 추가
function addRestaurantMarkers() {
    nearbyRestaurants.forEach((restaurant, index) => {
        const marker = new google.maps.Marker({
            position: { 
                lat: restaurant.coordinates.latitude, 
                lng: restaurant.coordinates.longitude 
            },
            map: map,
            title: restaurant.name,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#FF6B6B"/>
                        <circle cx="12" cy="9" r="2.5" fill="white"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(24, 24),
                anchor: new google.maps.Point(12, 12)
            }
        });
        
        // 정보창 생성
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px; min-width: 200px;">
                    <h3 style="margin: 0 0 5px 0; color: #333;">${restaurant.name}</h3>
                    <p style="margin: 0 0 5px 0; color: #666;">${restaurant.description}</p>
                    <p style="margin: 0 0 5px 0; color: #666;">📍 ${Math.round(restaurant.distance)}m</p>
                    <p style="margin: 0; color: #666;">⭐ ${restaurant.rating}/5.0</p>
                </div>
            `
        });
        
        // 마커 클릭 시 정보창 표시
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
            // 선택된 맛집으로 설정
            selectedRestaurant = restaurant;
            updateRestaurantInfo();
        });
        
        restaurantMarkers.push(marker);
    });
}

// 샘플 맛집 마커 추가
function addSampleRestaurantMarkers() {
    nearbyRestaurants.forEach((restaurant, index) => {
        const marker = new google.maps.Marker({
            position: { 
                lat: restaurant.coordinates.latitude, 
                lng: restaurant.coordinates.longitude 
            },
            map: map,
            title: restaurant.name,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#FF6B6B"/>
                        <circle cx="12" cy="9" r="2.5" fill="white"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(24, 24),
                anchor: new google.maps.Point(12, 12)
            }
        });
        
        restaurantMarkers.push(marker);
    });
}

// 맛집 마커들 제거
function clearRestaurantMarkers() {
    restaurantMarkers.forEach(marker => {
        marker.setMap(null);
    });
    restaurantMarkers = [];
}

// 맛집 정보 업데이트
function updateRestaurantInfo() {
    if (!selectedRestaurant) return;
    
    restaurantName.textContent = selectedRestaurant.name;
    restaurantDesc.textContent = selectedRestaurant.description;
    distanceText.textContent = `거리: ${selectedRestaurant.distance}m`;
    
    // 예약 화면 정보 업데이트
    reservationRestaurantName.textContent = selectedRestaurant.name;
    reservationRestaurantAddress.textContent = selectedRestaurant.address;
    
    // 찾아가기 화면 정보 업데이트
    findRestaurantName.textContent = selectedRestaurant.name;
    findRestaurantAddress.textContent = selectedRestaurant.address;
    currentDistance.textContent = `${selectedRestaurant.distance}m`;
    
                // 예상 소요시간 계산 (도보 기준)
            const walkTime = Math.ceil(selectedRestaurant.distance / CONFIG.DISTANCE.WALKING_SPEED);
            estimatedTime.textContent = `도보 ${walkTime}분`;
}

// 거리 정보 업데이트
function updateDistanceInfo() {
    if (!selectedRestaurant) return;
    
    if (currentLocation) {
        // GPS 위치가 있는 경우 실제 거리 계산
        const distance = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            selectedRestaurant.coordinates.latitude,
            selectedRestaurant.coordinates.longitude
        );
        selectedRestaurant.distance = Math.round(distance);
    } else {
        // GPS 위치가 없는 경우 샘플 거리 사용 (이미 설정됨)
        console.log('GPS 위치 없음, 샘플 거리 사용');
    }
    
    updateRestaurantInfo();
}

// 두 지점 간 거리 계산 (Haversine 공식)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // 지구 반지름 (미터)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// 네비게이션 버튼 이벤트
document.getElementById('walk-btn').addEventListener('click', () => {
    if (selectedRestaurant && currentLocation) {
        showDirections('WALKING');
    }
});

document.getElementById('car-btn').addEventListener('click', () => {
    if (selectedRestaurant && currentLocation) {
        showDirections('DRIVING');
    }
});

document.getElementById('transit-btn').addEventListener('click', () => {
    if (selectedRestaurant && currentLocation) {
        showDirections('TRANSIT');
    }
});

// Google Maps Directions API로 경로 표시
function showDirections(travelMode) {
    if (!directionsService || !directionsRenderer || !selectedRestaurant || !currentLocation) {
        return;
    }
    
    const origin = { 
        lat: currentLocation.latitude, 
        lng: currentLocation.longitude 
    };
    const destination = { 
        lat: selectedRestaurant.coordinates.latitude, 
        lng: selectedRestaurant.coordinates.longitude 
    };
    
    const request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode[travelMode]
    };
    
    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            // 기존 경로 제거
            directionsRenderer.setDirections(null);
            
            // 새 경로 표시
            directionsRenderer.setDirections(result);
            
            // 경로 정보 표시
            const route = result.routes[0];
            const leg = route.legs[0];
            
            let modeText = '';
            switch(travelMode) {
                case 'WALKING':
                    modeText = '도보';
                    break;
                case 'DRIVING':
                    modeText = '자동차';
                    break;
                case 'TRANSIT':
                    modeText = '대중교통';
                    break;
            }
            
            // 소요시간 업데이트
            estimatedTime.textContent = `${modeText} ${leg.duration.text}`;
            
            // 성공 메시지
            showNavigationSuccess(modeText, leg.duration.text, leg.distance.text);
            
        } else {
            console.error('경로 계산 실패:', status);
            alert('경로를 계산할 수 없습니다. 다시 시도해주세요.');
        }
    });
}

// 네비게이션 성공 메시지
function showNavigationSuccess(mode, duration, distance) {
    const successMsg = document.createElement('div');
    successMsg.className = 'navigation-success-message';
    successMsg.innerHTML = `✅ ${mode} 경로 계산 완료!<br>${duration} (${distance})`;
    successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 25px;
        z-index: 1000;
        animation: slideInRight 0.5s ease-out;
        text-align: center;
        line-height: 1.4;
    `;
    
    document.body.appendChild(successMsg);
    
    // 설정된 시간 후 자동 제거
    setTimeout(() => {
        successMsg.remove();
    }, CONFIG.ANIMATION.ERROR_DISPLAY_TIME);
}

// 로딩 완료 후 비디오 프리로딩
window.addEventListener('load', () => {
    preloadVideo();
});
