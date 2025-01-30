const selectElement = document.getElementById("con-dropdown");
const selectContainer = document.querySelector(".dropdown-con");

const mapSelectElement = document.getElementById("map-dropdown");
const mapSelectContainer = document.querySelector(".dropdown-map");

selectElement.addEventListener("click", function () {
  selectContainer.classList.toggle("open");
});

selectElement.addEventListener("blur", function () {
  selectContainer.classList.remove("open");
});

mapSelectElement.addEventListener("click", function () {
  mapSelectContainer.classList.toggle("open");
});

mapSelectElement.addEventListener("blur", function () {
  mapSelectContainer.classList.remove("open");
});

const conDropdown = document.getElementById("con-dropdown");
const mapDropdown = document.getElementById("map-dropdown");
const mapSelect = document.getElementById("map-dropdown");

// 각 지역에 대한 맵 옵션 데이터
const mapOptions = {
  파일섬: ["용의 눈 호수", "기어 사바나", "시작의 마을", "무한 산"],
  서버대륙: [
    "사막 지대",
    "어둠성 계곡",
    "개굴몬 성 1F",
    "개굴몬 성 2F",
    "어둠성 내부",
  ],
  "현실 세계": [
    "캠핑장",
    "빛의 언덕",
    "지하철 역",
    "오다이바 입구",
    "오다이바 북부",
    "시부야",
    "오다이바 남부",
    "국제 전시장",
  ],
  "스파이럴 마운틴": [
    "네트워크 바다",
    "수목 지구",
    "강철 도시",
    "강철 도시 지하",
    "어둠의 권역",
    "스파이럴 마운틴 정상",
    "???",
  ],
};

// 이미지 업데이트 함수
function updateImage(selectedMap) {
  let imagePath;
  if (selectedMap === "???") {
    imagePath = "https://cdn.jsdelivr.net/gh/dsr1111/dsr@main/image/map/ApocalymonArea.webp";
  } else {
    imagePath = "https://cdn.jsdelivr.net/gh/dsr1111/dsr@main/image/map/${selectedMap.replace(/\s+/g,)}.webp";
  }

  // 이미지 요소를 700x700 크기로 업데이트
  imageContainer.innerHTML = `<img src="${imagePath}" loading="lazy" alt="${selectedMap}" width="700" height="700">`;
}


// 지역 선택 시 map-dropdown 옵션 업데이트 및 첫 번째 값으로 이미지 설정
conDropdown.addEventListener("change", function () {
  const selectedRegion = conDropdown.value;
  const options = mapOptions[selectedRegion];

  // map-dropdown 옵션을 업데이트
  mapSelect.innerHTML = "";
  options.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.textContent = option;
    mapSelect.appendChild(opt);
  });

  // 첫 번째 옵션 선택 및 이미지 업데이트
  mapSelect.value = options[0];
  updateImage(options[0]);
});

// map-dropdown 선택 변경 시 이미지 업데이트
mapSelect.addEventListener("change", function () {
  updateImage(mapSelect.value);
});

// 페이지 로드 시 초기 이미지 설정
window.onload = function () {
  conDropdown.dispatchEvent(new Event("change"));
};

let maps = {};

// JSON 데이터 처리
fetch("../data/csv/map.json")
  .then((response) => response.json())
  .then((data) => {
    maps = data;
    initializeDropdownOptions(); // 드롭다운 옵션 초기화
  })
  .catch((error) => console.error("Error loading JSON data:", error));

function initializeDropdownOptions() {
  conDropdown.addEventListener("change", function () {
    const selectedRegion = conDropdown.value;
    const options = mapOptions[selectedRegion];

    // map-dropdown 옵션을 업데이트
    mapDropdown.innerHTML = "";
    options.forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option;
      mapDropdown.appendChild(opt);
    });

    // 첫 번째 옵션 선택 후 initMap 호출
    mapDropdown.value = options[0];
    initMap(); // 첫 번째 값에 대해 아이콘 표시
  });

  // 초기 설정
  conDropdown.dispatchEvent(new Event("change"));
}

const imageContainer = document.getElementById("image-container");
const dropdownContent = document.querySelector(".dropdown-content");

let currentPortals = [];
let currentWarps = [];
let currentShops = [];
let currentOverflows = [];
let currentDatacube = [];
let currentMobs = [];

function addTooltipToImage(imageElement, tooltipText) {
  imageElement.addEventListener("mouseenter", function (event) {
    showTooltipAtImageBottomRight(event, imageElement, tooltipText);
  });
  imageElement.addEventListener("mouseleave", hideTooltip);
}

function showTooltipAtImageBottomRight(event, imageElement, text) {
  let tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.innerHTML = text;

  const rect = imageElement.getBoundingClientRect();
  const imageBottomRightX = rect.right + window.pageXOffset;
  const imageBottomRightY = rect.bottom + window.pageYOffset;

  tooltip.style.position = "absolute";
  tooltip.style.left = `${imageBottomRightX - 10}px`;
  tooltip.style.top = `${imageBottomRightY}px`;

  document.body.appendChild(tooltip);
}

function hideTooltip() {
  const tooltip = document.querySelector(".tooltip");
  if (tooltip) {
    tooltip.remove();
  }
}

function initMap() {
  mapDropdown.addEventListener("change", function () {
    const selectedMap = maps[mapDropdown.value];
    console.log("선택된 맵 데이터:", selectedMap);
    if (selectedMap) {
      // 배경 이미지 설정 및 현재 아이콘 목록 초기화
      imageContainer.style.backgroundImage = `url(${selectedMap.backgroundImage})`;
      imageContainer.innerHTML = "";
      currentPortals = [];
      currentWarps = [];
      currentShops = [];
      currentOverflows = [];
      currentDatacube = [];
      currentMobs = [];
      dropdownContent.innerHTML = "";

      // 카테고리별로 체크박스를 생성
      if (selectedMap.portals && selectedMap.portals.length > 0) {
        createCheckbox(
          "포탈",
          "toggle-portals",
          "포탈 아이콘",
          selectedMap.portals,
          currentPortals
        );
      }

      if (selectedMap.warps && selectedMap.warps.length > 0) {
        createCheckbox(
          "워프 포인트",
          "toggle-warps",
          "워프포인트 아이콘",
          selectedMap.warps,
          currentWarps
        );
      }

      if (selectedMap.shops && selectedMap.shops.length > 0) {
        createCheckbox(
          "상점",
          "toggle-shops",
          "상점 아이콘",
          selectedMap.shops,
          currentShops
        );
      }

      if (selectedMap.overflows && selectedMap.overflows.length > 0) {
        createCheckbox(
          "오버플로우",
          "toggle-overflows",
          "오버플로우 아이콘",
          selectedMap.overflows,
          currentOverflows
        );
      }

      if (selectedMap.datacube && selectedMap.datacube.length > 0) {
        createCheckbox(
          "데이터 큐브",
          "toggle-datacube",
          "데이터큐브 아이콘",
          selectedMap.datacube,
          currentDatacube
        );
      }

      if (selectedMap.mobs && selectedMap.mobs.length > 0) {
        createCheckbox(
          "악역 디지몬",
          "toggle-mob",
          "몬스터 아이콘",
          selectedMap.mobs,
          currentMobs
        );
      }
    }
  });

  // 페이지 로드 시 초기 맵 설정
  mapDropdown.dispatchEvent(new Event("change"));
}

function createCheckbox(
  labelText,
  checkboxId,
  iconName,
  mapData,
  currentArray
) {
  const div = document.createElement("div");
  const input = document.createElement("input");
  const label = document.createElement("label");

  input.type = "checkbox";
  input.id = checkboxId;

  // 기본 체크 상태 설정
  if (checkboxId === "toggle-warps" || checkboxId === "toggle-portals" || checkboxId === "toggle-shops" || checkboxId  === "toggle-overflows" || checkboxId  === "toggle-mob") {
    input.checked = true; // 워프포인트는 체크된 상태로 로드
  } else {
    input.checked = false; // 나머지는 체크 해제된 상태로 로드
  }

  label.htmlFor = checkboxId;
  label.textContent = labelText;

  div.appendChild(input);
  div.appendChild(label);
  dropdownContent.appendChild(div);

  input.addEventListener("change", function () {
    const displayStyle = this.checked ? "block" : "none";
    currentArray.forEach((item) => {
      if (item.mobImage) {
        item.mobImage.style.display = displayStyle;
        item.typeImage.style.display = displayStyle;
        if (item.evolIcon) {
          item.evolIcon.style.display = displayStyle;
        }
      } else {
        item.style.display = displayStyle;
      }
    });
  });

  mapData.forEach((item) => {
    const imgElement = document.createElement("img");
    imgElement.src = item.src;
    imgElement.style.position = "absolute";
    imgElement.style.top = `${item.top}px`;
    imgElement.style.left = `${item.left}px`;
    imgElement.style.display = input.checked ? "block" : "none";

    if (item.isAggressive) {
      imgElement.style.border = "2px solid red";
    }

    let evolIcon = null;
    if (item.evol) {
      evolIcon = document.createElement("img");
      evolIcon.src = "../image/icon.png";
      evolIcon.style.position = "absolute";
      evolIcon.style.top = `${item.top + 20}px`;
      evolIcon.style.left = `${item.left + 5}px`;
      evolIcon.style.width = "20px";
      evolIcon.style.height = "20px";
      evolIcon.style.zIndex = "1001";
      evolIcon.style.display = input.checked ? "block" : "none";
      evolIcon.loading = "eager";
      imageContainer.appendChild(evolIcon);
    }

    if (checkboxId === "toggle-portals") {
      imgElement.classList.add("portal-image");
    } else if (checkboxId === "toggle-warps") {
      imgElement.classList.add("warp-image");
    } else if (checkboxId === "toggle-shops") {
      imgElement.classList.add("shop-image");
    } else if (checkboxId === "toggle-overflows") {
      imgElement.classList.add("overflows-image");
    } else if (checkboxId === "toggle-datacube") {
      imgElement.classList.add("datacube-image");
    }

    if (checkboxId === "toggle-mob") {
      imgElement.classList.add("mob-image");

      const typeElement = document.createElement("img");
      typeElement.src = `../image/${item.type}.webp`;
      typeElement.style.position = "absolute";
      typeElement.style.top = `${item.top - 5}px`;
      typeElement.style.left = `${item.left - 5}px`;
      typeElement.style.width = `18px`;
      typeElement.style.height = `19px`;
      typeElement.style.zIndex = `1000`;
      typeElement.loading = "eager";
      typeElement.style.display = input.checked ? "block" : "none";

      addSpecialTooltipToMobs(
        imgElement,
        item.name,
        item.src,
        item.level,
        item.hp,
        item.강점,
        item.약점,
        item.items,
        item.evol
      );

      imageContainer.appendChild(imgElement);
      imageContainer.appendChild(typeElement);

      currentArray.push({
        mobImage: imgElement,
        typeImage: typeElement,
        evolIcon: evolIcon,
      });
    } else {
      addTooltipToImage(imgElement, item.tooltip);
      imageContainer.appendChild(imgElement);
      currentArray.push(imgElement);
    }
  });
}

function addSpecialTooltipToMobs(
  imageElement,
  name,
  src,
  level,
  hp,
  강점,
  약점,
  items,
  evol
) {
  imageElement.addEventListener("mouseenter", function (event) {
    showSpecialTooltipAtImage(
      event,
      imageElement,
      name,
      src,
      level,
      hp,
      강점,
      약점,
      items,
      evol
    );
  });
  imageElement.addEventListener("mouseleave", hideSpecialTooltip);
}

function showSpecialTooltipAtImage(
  event,
  imageElement,
  name,
  src,
  level,
  hp,
  강점,
  약점,
  items,
  evol
) {
  let tooltip = document.createElement("div");
  tooltip.className = "special-tooltip";

  const 강점Parts = 강점.split(",");
  const 강점이미지 = 강점Parts[0] ? `../image/${강점Parts[0].trim()}.webp` : null;
  const 강점텍스트 = 강점Parts[1] ? 강점Parts[1].trim() : "";

  const 약점Parts = 약점.split(",");
  const 약점이미지 = 약점Parts[0] ? `../image/${약점Parts[0].trim()}.webp` : null;
  const 약점텍스트 = 약점Parts[1] ? 약점Parts[1].trim() : "";

  const 드랍아이템목록 = Array.isArray(items) ? items : [];

  tooltip.innerHTML = `
        <div style="text-align: center; font-size: 20px; color: rgb(0,183,255); font-weight: bold;">${name}</div>
        <div style="display: flex; align-items: center;">
            <img src="${src}" alt="${name}" style="width: 100px; height: 100px; margin-top: 5px; background-color: #000000; border-radius: 5px; border: 1px solid white;">
            <div style="margin-left: 5px;">
                <div style="margin-bottom: 5px; margin-top: 5px; color: white;"><span>레벨 :</span> ${level}</div>
                <div style="margin-bottom: 5px; color: white;"><span>체력 :</span> ${hp}</div>
                <div style= "color: white;"><span>강점 :</span> 
                    <div style="background-image: url('../image/strongbackground.webp'); background-size: cover; width: 25px; height: 25px; display: inline-block; vertical-align: middle;">
                        ${
                          강점이미지
                            ? `<img src="${강점이미지}" alt="${강점Parts[0]}" style="width: 24px; height: 24px;">`
                            : ""
                        }
                    </div>
                    ${강점텍스트 ? `<span>${강점텍스트}</span>` : ""}
                </div>
                <div style= "color: white;"><span>약점 :</span>
                    <div style="background-image: url('../image/weakbackground.webp'); background-size: cover; width: 25px; height: 25px; display: inline-block; vertical-align: middle;">
                        ${
                          약점이미지
                            ? `<img src="${약점이미지}" alt="${약점Parts[0]}" style="width: 24px; height: 24px;">`
                            : ""
                        }
                    </div>
                    ${약점텍스트 ? `<span>${약점텍스트}</span>` : ""}
                </div>
            </div>
        </div>
        <div style="text-align: center; font-size: 20px; margin-top: 10px; color: rgb(0,183,255);"><strong>드랍 아이템</strong> 
            <ul style="margin-top: 5px; list-style-type: none; padding-left: 0; font-size: 14px; text-align: left; color: white;">
                ${드랍아이템목록
                  .map((item) => {
                    const itemImageSrc = item.includes("조합법")
                      ? "../image/item/조합법.png"
                      : `../image/item/${item.trim()}.png`;
                    return `
                        <li style="display: flex; align-items: center; justify-content: flex-start; margin-bottom: 5px; margin-left: 5px;">
                            <img src="${itemImageSrc}" loading="eager" alt="${item.trim()}" style="width: 25px; height: 25px; margin-right: 5px; background-color: black; border-radius: 5px; border: 1px solid grey; vertical-align: middle;">
                            ${item.trim()}
                        </li>`;
                  })
                  .join("")}
            </ul>
        </div>
        ${
          evol
            ? `
        <div style="text-align: center; font-size: 20px; margin-top: 10px; color: rgb(0,183,255);"><strong>조건 진화</strong></div>
        <div style="display: flex; justify-content: center; align-items: center; margin-top: 10px;">
        <img src="../image/digimon/${evol}/${evol}.webp" loading="eager" alt="${evol}" style="width: 50px; height: 50px; background-color: black; border-radius: 5px; border: 1px solid white;">
         </div>
        `
            : ""
        }
    `;

  document.body.appendChild(tooltip);

  const rect = imageElement.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const imageBottomRightX = rect.right + window.pageXOffset;
  const imageBottomRightY = rect.bottom + window.pageYOffset;

  const containerRect = imageContainer.getBoundingClientRect();

  let tooltipTop = imageBottomRightY;
  if (
    tooltipTop + tooltipRect.height >
    containerRect.bottom + window.pageYOffset
  ) {
    tooltipTop =
      containerRect.bottom + window.pageYOffset - tooltipRect.height - 10;
  }
  tooltip.style.position = "absolute";
  tooltip.style.left = `${imageBottomRightX + 10}px`;
  tooltip.style.top = `${tooltipTop}px`;
}

function hideSpecialTooltip() {
  const tooltip = document.querySelector(".special-tooltip");
  if (tooltip) {
    tooltip.remove();
  }
}

function updateActiveButton(activeButton) {
  mapButtons.forEach((button) => {
    button.classList.remove("active");
  });
  activeButton.classList.add("active");
}

const dropdownButton = document.querySelector(".dropdown-icon");
const arrow = document.querySelector(".arrow");

dropdownButton.addEventListener("click", function () {
  dropdownContent.classList.toggle("show");

  arrow.classList.toggle("rotate");
});
