let data;

fetch("data.json")
.then(r=>r.json())
.then(j=>{
  data=j;
  init();
});

function init(){
  name.textContent=data.name;
  avatar.src=data.avatar;
  nameTop.textContent=data.name;
  avatarTop.src=data.avatar;

  loadPortfolio();
  loadTools();
}

function loadPortfolio(){
  portfolio.innerHTML="";
  data.portfolio.forEach(i=>{
    portfolio.innerHTML+=`
      <a href="${i.link}" class="link-btn">
        <img src="${i.image}">
        <span>${i.name}</span>
      </a>`;
  });
}

function loadTools(){
  toolsList.innerHTML="";
  data.tools.forEach(i=>{
    toolsList.innerHTML+=`
      <a href="${i.link}" class="card">
        <img src="${i.image}">
        <div class="card-content">
          <h3>${i.name}</h3>
          <p>${i.desc}</p>
        </div>
      </a>`;
  });
}

function searchTools(){
  const v=search.value.toLowerCase();
  toolsList.innerHTML="";
  data.tools.filter(t=>t.name.toLowerCase().includes(v)).forEach(i=>{
    toolsList.innerHTML+=`
      <a href="${i.link}" class="card">
        <img src="${i.image}">
        <div class="card-content">
          <h3>${i.name}</h3>
          <p>${i.desc}</p>
        </div>
      </a>`;
  });
}

/* TAB SYSTEM */
function showTab(id,btn){
  document.querySelectorAll(".tab-content").forEach(e=>e.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  btn.classList.add("active");

  const index=[...document.querySelectorAll(".tab")].indexOf(btn);
  indicator.style.transform=`translateX(${index*100}%)`;

  if(id==="portfolio"){
    profile.classList.remove("hide");
    header.classList.remove("show");
  }else{
    profile.classList.add("hide");
    header.classList.add("show");
  }
}