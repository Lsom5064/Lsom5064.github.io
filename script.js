// 년도 자동
document.getElementById('year').textContent = new Date().getFullYear();

// 맨 위로 버튼
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  toTop.style.display = window.scrollY > 240 ? 'inline-flex' : 'none';
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// 이미지 대체(파일 없을 때)
document.querySelectorAll('img.thumb').forEach(img => {
  img.addEventListener('error', () => {
    img.src = 'images/placeholder-16x9.png';
    img.alt += ' (이미지 준비중)';
  });
});
