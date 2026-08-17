let map;
let saunas = [];
let markers = [];
let userMarker = null;
let activeSaunaId = null;

const KAKAO_MAP_CONFIG = {
  centerLat: 37.5400,
  centerLng: 127.0300,
  level: 7
};

// Initialize after DOM loaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadSaunas();
    initMap();
    renderSaunaList();
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
});

async function loadSaunas() {
  const response = await fetch('data/saunas.json');
  if (!response.ok) {
    throw new Error('Failed to load sauna data');
  }
  saunas = await response.json();
}

function initMap() {
  const container = document.getElementById('map');
  const options = {
    center: new kakao.maps.LatLng(KAKAO_MAP_CONFIG.centerLat, KAKAO_MAP_CONFIG.centerLng),
    level: KAKAO_MAP_CONFIG.level
  };

  map = new kakao.maps.Map(container, options);

  saunas.forEach((sauna, index) => {
    const position = new kakao.maps.LatLng(sauna.lat, sauna.lng);
    const marker = new kakao.maps.Marker({
      map: map,
      position: position,
      title: sauna.name
    });

    const infowindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:8px 12px;font-size:13px;">${sauna.name}</div>`
    });

    kakao.maps.event.addListener(marker, 'click', () => {
      infowindow.open(map, marker);
      selectSauna(sauna.id);
    });

    markers.push({ marker, infowindow });
  });
}

function renderSaunaList() {
  const listEl = document.getElementById('sauna-list');
  listEl.innerHTML = saunas.map(sauna => createSaunaCard(sauna)).join('');
}

function createSaunaCard(sauna) {
  const distanceText = sauna.distance !== undefined && sauna.distance !== null
    ? `${sauna.distance.toFixed(1)}km`
    : '';

  return `
    <div id="card-${sauna.id}" class="sauna-card bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer transition"
         onclick="selectSauna('${sauna.id}')">
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-bold text-slate-900">${sauna.name}</h3>
        ${distanceText ? `<span class="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">${distanceText}</span>` : ''}
      </div>
      <p class="text-sm text-slate-500 mb-2">${sauna.address}</p>
      <p class="text-xs text-slate-400 mb-3">${sauna.hours} · ${sauna.facilities.join(' · ')}</p>
      <div class="flex gap-2">
        <button onclick="event.stopPropagation(); openReserveModal('${sauna.id}')"
                class="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium py-2 rounded-lg transition">
          예약하기
        </button>
        <button onclick="event.stopPropagation(); openDirections('${sauna.id}')"
                class="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium py-2 rounded-lg transition">
          길찾기
        </button>
      </div>
    </div>
  `;
}

function selectSauna(id) {
  activeSaunaId = id;
  const sauna = saunas.find(s => s.id === id);
  if (!sauna) return;

  document.querySelectorAll('.sauna-card').forEach(card => card.classList.remove('active'));
  const cardEl = document.getElementById(`card-${id}`);
  if (cardEl) {
    cardEl.classList.add('active');
    cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  const index = saunas.findIndex(s => s.id === id);
  if (index >= 0 && markers[index]) {
    map.setCenter(new kakao.maps.LatLng(sauna.lat, sauna.lng));
    markers[index].infowindow.open(map, markers[index].marker);
  }
}

function findMyLocation() {
  if (!navigator.geolocation) {
    alert('이 브라우저에서는 위치 서비스를 사용할 수 없습니다.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const userPosition = new kakao.maps.LatLng(lat, lng);

      if (userMarker) {
        userMarker.setMap(null);
      }

      userMarker = new kakao.maps.Marker({
        map: map,
        position: userPosition,
        title: '내 위치',
        image: new kakao.maps.MarkerImage(
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
          new kakao.maps.Size(24, 35)
        )
      });

      map.setCenter(userPosition);
      map.setLevel(5);

      // Calculate distances
      saunas.forEach(sauna => {
        sauna.distance = haversineDistance(lat, lng, sauna.lat, sauna.lng);
      });

      saunas.sort((a, b) => a.distance - b.distance);
      renderSaunaList();
      selectSauna(saunas[0].id);
    },
    error => {
      console.error('Geolocation error:', error);
      alert('위치를 가져오지 못했습니다. 위치 권한을 확인해주세요.');
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function openDirections(id) {
  const sauna = saunas.find(s => s.id === id);
  if (!sauna) return;

  const url = `https://map.kakao.com/link/to/${encodeURIComponent(sauna.name)},${sauna.lat},${sauna.lng}`;
  window.open(url, '_blank', 'noopener');
}

function openReserveModal(id) {
  const sauna = saunas.find(s => s.id === id);
  if (!sauna) return;

  document.getElementById('modal-sauna-name').textContent = sauna.name;
  document.getElementById('modal-sauna-address').textContent = sauna.address;
  document.getElementById('modal-deposit-name').textContent = `${sauna.name} 예약`;

  const formLink = document.getElementById('modal-form-link');
  formLink.href = sauna.formUrl;

  const modal = document.getElementById('reserve-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModal() {
  const modal = document.getElementById('reserve-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function copyAccount() {
  const account = '3333065300868';
  navigator.clipboard.writeText(account).then(() => {
    alert('계좌번호가 복사되었습니다.');
  }).catch(() => {
    alert('복사에 실패했습니다. 수동으로 복사해주세요.');
  });
}

function scrollToMap() {
  document.getElementById('map-section').scrollIntoView({ behavior: 'smooth' });
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('reserve-modal');
  if (event.target === modal) {
    closeModal();
  }
};
