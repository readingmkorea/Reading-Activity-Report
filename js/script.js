(() => {
  const keys = ['s1','s2','s3','v1','v2','v3','c1','c2','c3','c4'];
  const ctxD = document.getElementById('myChart').getContext('2d');
  const ctxM = document.getElementById('monthCvs').getContext('2d');
  let chartD = null, chartM = null;

  // 월 기본값 설정
  const now = new Date();
  for (let i = 0; i < 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 2 + i);
    document.getElementById(`ym${i+1}_year`).value = d.getFullYear();
    document.getElementById(`ym${i+1}_month`).value = d.getMonth() + 1;
  }

  // 글자 수 카운터
  document.getElementById('overallComment')
    .addEventListener('input', e => document.getElementById('charCount').textContent = e.target.value.length);

  // 상세 차트
  document.getElementById('btnDetail').addEventListener('click', () => {
    const my = keys.map(k => +document.getElementById(`${k}_my`).value || 0);
    const avg = keys.map(k => +document.getElementById(`${k}_avg`).value || 0);
    const total = my.reduce((a, b) => a + b, 0);
    document.getElementById('val3').textContent = total;
    if (!chartD) {
      chartD = new Chart(ctxD, {
        type: 'bar',
        data: {
          labels: ['정독','추천','습관','어휘','표현','서술','배경','중심내용','중심생각','발언'],
          datasets: [
            { label: '내 평점', data: my, backgroundColor: 'rgba(54,162,235,0.5)' },
            { label: '전체평균', data: avg, backgroundColor: 'rgba(255,159,64,0.5)' }
          ]
        },
        options: { scales: { y: { beginAtZero: true, suggestedMax: 5 } } }
      });
    } else {
      chartD.data.datasets[0].data = my;
      chartD.data.datasets[1].data = avg;
      chartD.update();
    }
    document.getElementById('chartContainer').style.display = 'block';
  });

  // 월별 차트
  document.getElementById('btnSummary').addEventListener('click', () => {
    const v1 = +document.getElementById('val1').value || 0;
    const v2 = +document.getElementById('val2').value || 0;
    const v3 = +document.getElementById('val3').textContent || 0;
    const vals = [v1, v2, v3];
    const labels = ['전전월','전월','이번달'];
    if (!chartM) {
      chartM = new Chart(ctxM, {
        type: 'bar',
        data: { labels, datasets: [{ label: '월별평점', data: vals, backgroundColor: 'rgba(153,102,255,0.6)' }] },
        options: { scales: { y: { beginAtZero: true, max: 100 } } }
      });
    } else {
      chartM.data.datasets[0].data = vals;
      chartM.update();
    }
    document.getElementById('monthChart').style.display = 'block';
  });

  // 전체평점 저장
  document.getElementById('saveAvgBtn').addEventListener('click', () => {
    const obj = {};
    keys.forEach(k => obj[k+'_avg'] = document.getElementById(`${k}_avg`).value);
    localStorage.setItem('avgRatings', JSON.stringify(obj));
    alert('전체평점 저장됨');
  });

  // 자동 복원
  const saved = JSON.parse(localStorage.getItem('avgRatings') || '{}');
  keys.forEach(k => {
    const el = document.getElementById(`${k}_avg`);
    if(el && saved[k+'_avg'] !== undefined) el.value = saved[k+'_avg'];
  });

  // 페이지 생성 & 공유
  document.getElementById('shareBtn').addEventListener('click', () => {
    const school = document.getElementById('schoolType').value.trim();
    const grade = document.getElementById('gradeBox').textContent.trim();
    const name = document.getElementById('nameBox').textContent.trim();
    const comment = document.getElementById('overallComment').value;
    const html = `
<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>${school} ${grade} ${name} 평가서</title>
<style>
body{font-family:'Noto Sans KR','Gowun Batang'; padding:20px;}
h1{text-align:center;}
p{white-space:pre-wrap;}
</style></head><body>
<h1>${school} ${grade} ${name} 평가</h1>
<h3>■ 종합평가</h3>
<p>${comment}</p>
</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url);
    setTimeout(()=>URL.revokeObjectURL(url), 60000);
  });
})();
