(() => {
  const keys = ['s1','s2','s3','v1','v2','v3','c1','c2','c3','c4'];
  const ctxD = document.getElementById('myChart').getContext('2d');
  const ctxM = document.getElementById('monthCvs').getContext('2d');
  let chartD = null, chartM = null;

  // 월 자동 입력
  const now = new Date();
  for (let i=0; i<3; i++){
    const d = new Date(now.getFullYear(), now.getMonth()-2+i);
    document.getElementById(`ym${i+1}_year`).value = d.getFullYear();
    document.getElementById(`ym${i+1}_month`).value = d.getMonth()+1;
  }

  // 글자 수 카운터
  document.getElementById('overallComment')
    .addEventListener('input', e => document.getElementById('charCount').textContent = e.target.value.length);

  // 차트 생성 기능
  document.getElementById('btnDetail').addEventListener('click', () => {
    const my  = keys.map(k=>+document.getElementById(`${k}_my`).value||0);
    const avg = keys.map(k=>+document.getElementById(`${k}_avg`).value||0);
    const total = my.reduce((a,b)=>a+b,0);
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
        options: { scales: { y: { beginAtZero:true, suggestedMax:5 } } }
      });
    } else {
      chartD.data.datasets[0].data = my;
      chartD.data.datasets[1].data = avg;
      chartD.update();
    }
    document.getElementById('chartContainer').style.display = 'block';
  });

  document.getElementById('btnSummary').addEventListener('click', () => {
    const v1 = +document.getElementById('val1').value||0;
    const v2 = +document.getElementById('val2').value||0;
    const v3 = +document.getElementById('val3').textContent||0;
    const vals=[v1,v2,v3];
    const labels=['전전월','전월','이번달'];

    if (!chartM) {
      chartM = new Chart(ctxM, {
        type: 'bar',
        data: { labels, datasets:[{ label:'월별평점',data:vals,backgroundColor:'rgba(153,102,255,0.6)' }]},
        options: { scales:{ y:{ beginAtZero:true, max:100 } } }
      });
    } else {
      chartM.data.datasets[0].data = vals;
      chartM.update();
    }
    document.getElementById('monthChart').style.display = 'block';
  });

  document.getElementById('saveAvgBtn').addEventListener('click', () => {
    const obj = {};
    keys.forEach(k => obj[`${k}_avg`] = document.getElementById(`${k}_avg`).value);
    localStorage.setItem('avgRatings', JSON.stringify(obj));
    alert('전체평점 저장됨');
  });

  // 저장된 평균 복원
  const saved = JSON.parse(localStorage.getItem('avgRatings') || '{}');
  keys.forEach(k => {
    const el = document.getElementById(`${k}_avg`);
    if (el && saved[`${k}_avg`]!==undefined) el.value = saved[`${k}_avg`];
  });

  // 완료 버튼 (새 창 공유)
  document.getElementById('shareBtn').addEventListener('click', () => {
    const container = document.querySelector('.container');
    const school = document.getElementById('schoolType').value.trim();
    const grade = document.getElementById('gradeBox').textContent.trim();
    const name = document.getElementById('nameBox').textContent.trim();

    const cloned = container.cloneNode(true);
    cloned.querySelectorAll('button').forEach(btn=>btn.remove());
    cloned.querySelectorAll('input, textarea').forEach(el => {
      const span = document.createElement('p');
      span.textContent = el.value || el.textContent;
      el.parentNode.replaceChild(span, el);
    });

    const html = `
<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>${school} ${grade} ${name} 평가서</title>
<link href="styles.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head><body>
<div class="container">${cloned.innerHTML}</div>
<script>
const keys=${JSON.stringify(keys)};
const ctxD=document.getElementById('myChart').getContext('2d');
const my=keys.map(k=>+document.getElementById(k+'_my').textContent);
const avg=keys.map(k=>+document.getElementById(k+'_avg').textContent);
new Chart(ctxD,{type:'bar',data:{labels:['정독','추천','습관','어휘','표현','서술','배경','중심내용','중심생각','발언'],datasets:[{label:'내 평점',data:my,backgroundColor:'rgba(54,162,235,0.5)'},{label:'전체평균',data:avg,backgroundColor:'rgba(255,159,64,0.5)'}]},options:{scales:{y:{beginAtZero:true,suggestedMax:5}}}});
const ctxM=document.getElementById('monthCvs').getContext('2d');
const v1=+document.getElementById('val1').textContent;
const v2=+document.getElementById('val2').textContent;
const v3=+document.getElementById('val3').textContent;
new Chart(ctxM,{type:'bar',data:{labels:['전전월','전월','이번달'],datasets:[{label:'월별평점',data:[v1,v2,v3],backgroundColor:'rgba(153,102,255,0.6)'}]},options:{scales:{y:{beginAtZero:true,max:100}}}});
</script>
</body></html>`;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
  });
})();
