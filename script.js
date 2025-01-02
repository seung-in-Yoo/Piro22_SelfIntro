/* 다크모드 */
const profilePhoto = document.querySelector(".profile-photo");

profilePhoto.addEventListener("click", () => {
  /* 방법 1. if 문 사용용
  if (document.body.className == 'dark-mode') {
    document.body.className = '';
  } else {
    document.body.className = 'dark-mode';
  }
  */

  // 방법 2. DOM 요소에 지정한 클래스 값이 없으면 추가하고, 있다면 제거
  document.body.classList.toggle('dark-mode');
})


/* 방법 1. for 문 이용 
const sections = document.querySelectorAll('.right_container section');

for (let index = 0; index < sections.length; index++) {
    const section = sections[index];
    section.addEventListener('click', function (event) {
        const sectionWidth = section.offsetWidth;  // margin을 제외한 padding 값, border 값까지 계산한 값을 가져옴.

        // event.clickX: 클릭한 위치의 X 좌표 (뷰포트 기준)
        // section.getBoundingClickRect().left: section의 가장 왼쪽 가장자리의 X 좌표 (뷰포트 기준)
        // 두 값을 빼줌으로써 section 내에서 클릭한 위치의 X 좌표를 계산
        const clickX = event.clickX - section.getBoundingClientRect().left;

        if (clickX < sectionWidth / 2) {  // 만약 section의 왼쪽을 클릭했다면
            if (index != 0) {  // 더 왼쪽으로 갈 section이 있다면
                section.style.display = 'none';
                sections[index - 1].style.display = 'flex';
            }
        } else {  // 만약 section의 오른쪽을 클릭했다면
            if (index != (section.length - 1)) {  // 더 오른쪽으로 갈 section이 있다면
                section.style.display = 'none';
                sections[index + 1].style.display = 'flex';
            }
        }
    })
} 
*/

fetch("https://m.search.naver.com/p/csearch/content/apirender.nhn?where=nexearch&pkid=387&u2=19980724&q=생년월일+운세&u1=m&u3=solar&u4=12&_=1719518803829")
  .then((response) => response.json())  // 응답을 JSON으로 파싱
  .then(data => {
      const htmlString = data.flick[0]; // 첫 번째 항목 선택
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      const fortune = doc.querySelector('dd b').textContent;
      const fortuneText = doc.querySelector('dd p').textContent;
      console.log(fortune); // 추출한 텍스트 출력
      console.log(fortuneText); // 추출한 텍스트 출력


      const fortuneSection = document.createElement("section"); // 오늘의 운세 section 생성
      const sectionTitle = document.createElement("h2"); // 오늘의 운세 타이틀 생성
      sectionTitle.textContent = "오늘의 운세";
      const fortuneE = document.createElement("h3");  // 오늘의 운세명 추가 
      fortuneE.style.margin = 0;
      fortuneE.textContent = fortune;
      const fortuneTextE = document.createElement("p"); // 오늘의 운세 풀이 추가 
      fortuneTextE.textContent = fortuneText;

      // append: 자식 중 가장 마지막에 삽입
      fortuneSection.append(sectionTitle);
      fortuneSection.append(fortuneE);
      fortuneSection.append(fortuneTextE);

      const contactSection = document.querySelector(".contact");
      /* contactSection.before(fortuneSection); // contact의 전에 fortune 추가 */
      contactSection.before(fortuneSection); // contact의 후에 fortune 추가 

      initializeSections();
});

function initializeSections() {
  const sections = document.querySelectorAll(".right_container section");
  let currentIndex = 0;

  // 다음 섹션으로 이동 
  const showAfterSection = () => {
      sections.forEach((section) => { section.style.display = 'none'; })  // 현재 section 숨기기
      if (currentIndex == sections.length - 1) {
          currentIndex = 0;
      } else {
          currentIndex++;
      }
      sections[currentIndex].style.display = 'flex';  // 다음 section 보여주기
  }

  // 이전 섹션으로 이동
  const showBeforeSection = () => {
      sections.forEach((section) => { section.style.display = 'none'; })
      if (currentIndex == 0) {
          currentIndex = sections.length - 1;
      } else {
          currentIndex--;
      }
      sections[currentIndex].style.display = 'flex';
  }

  let intervalId = setInterval(showAfterSection, 3000);

  const resetInterval = () => {
      clearInterval(intervalId);
      intervalId = setInterval(showAfterSection, 3000);
  }

  sections.forEach((section, index) => {
      section.addEventListener("click", (event) => {
          const sectionWidth = section.offsetWidth;
          const clickX = event.clientX - section.getBoundingClientRect().left;

          if (clickX < sectionWidth / 3) {  // 왼쪽 1/3 클릭 시 이전 section으로 이동
              showBeforeSection();
              resetInterval();
          } else if (clickX > sectionWidth * 2 / 3) {  // 오른쪽 1/3 클릭 시 다음 section으로 이동
              showAfterSection();
              resetInterval();
          } else {  // 중간 1/3 클릭 시 자동 넘김 토글
              if (intervalId) {
                  clearInterval(intervalId);  // 자동 넘김 중지
                  intervalId = null;
              } else {
                  intervalId = setInterval(showAfterSection, 3000);  // 자동 넘김 재개
              }
          }
      });
  });
};

