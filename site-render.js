(function () {
  const data = window.DAITO_SITE_DATA;
  if (!data) return;

  const textToHtml = (value) => String(value || "").replace(/\n/g, "<br>");

  function updateImages() {
    if (!data.images) return;

    document.querySelectorAll("[data-image-key]").forEach((img) => {
      const key = img.dataset.imageKey;
      if (data.images[key]) img.setAttribute("src", data.images[key]);
    });

    document.querySelectorAll("[data-bg-key]").forEach((el) => {
      const key = el.dataset.bgKey;
      if (data.images[key]) {
        const overlay = el.dataset.bgOverlay || "linear-gradient(90deg, rgba(7, 29, 51, 0.92), rgba(10, 52, 89, 0.68))";
        el.style.backgroundImage = `${overlay}, url("${data.images[key]}")`;
      }
    });
  }

  function updatePhoneLinks() {
    if (!data.company) return;
    const phone = data.company.phone || "";
    const phoneHref = data.company.phoneHref || phone.replace(/[^0-9]/g, "");

    document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
      link.setAttribute("href", `tel:${phoneHref}`);
    });
    document.querySelectorAll(".header-tel").forEach((link) => {
      link.textContent = `TEL ${phone}`;
    });
    document.querySelectorAll(".tel-big").forEach((link) => {
      link.textContent = phone;
    });
    document.querySelectorAll("[data-contact-person]").forEach((el) => {
      el.textContent = `担当：${data.company.contactPerson}`;
    });
  }

  function updateCompanyTable() {
    const company = data.company;
    const table = document.querySelector("[data-company-table]");
    if (!company || !table) return;

    const rows = [
      ["会社名", company.name],
      ["代表取締役", company.representative],
      ["設立", company.established],
      ["資本金", company.capital],
      ["従業員数", company.employees],
      ["建設業許可", company.permit],
      ["営業種目", company.businessItems],
      ["所在地", `${company.postalCode}<br>${company.address}`],
      ["対応エリア", company.area]
    ];

    table.innerHTML = rows.map(([label, value]) => (
      `<tr><th>${label}</th><td>${textToHtml(value)}</td></tr>`
    )).join("");
  }

  function updateRecruitTable() {
    const recruit = data.recruit;
    const box = document.querySelector("[data-recruit-table]");
    if (!recruit || !box) return;

    const locationHtml = `
      <ul>
        <li>本社：${textToHtml(recruit.headquarters)}</li>
        <li>現場：${textToHtml(recruit.workArea)}</li>
        <li>通勤：${textToHtml(recruit.commute)}</li>
      </ul>
    `;

    const rows = [
      ["職種", recruit.jobTitle],
      ["雇用形態", recruit.employmentType],
      ["給与", recruit.salary],
      ["勤務時間", recruit.workHours],
      ["勤務地・アクセス", locationHtml, true],
      ["休日・休暇", recruit.holidays],
      ["応募資格", recruit.requirements],
      ["待遇・福利厚生", recruit.benefits],
      ["試用期間", recruit.trialPeriod],
      ["選考の流れ", recruit.selectionFlow]
    ];

    box.innerHTML = rows.map(([label, value, isHtml]) => (
      `<div class="job-row"><div class="job-label">${label}</div><div class="job-detail">${isHtml ? value : `<p>${textToHtml(value)}</p>`}</div></div>`
    )).join("");
  }

  function updateWorks() {
    const grid = document.querySelector("[data-works-grid]");
    if (!grid || !Array.isArray(data.works)) return;

    grid.innerHTML = data.works.map((work, index) => {
      const image = work.image || `images/works-${String(index + 1).padStart(2, "0")}.jpg`;
      return `
        <article class="work-card">
          <img src="${image}" alt="${work.title || "施工実績"}の写真">
          <div class="work-body">
            <span class="work-year">${work.year || ""}</span>
            <h3>${work.title || ""}</h3>
            <dl class="work-meta">
              <div><dt>場所</dt><dd>${work.place || ""}</dd></div>
              <div><dt>内容</dt><dd>${work.content || ""}</dd></div>
              <div><dt>備考</dt><dd>${work.note || ""}</dd></div>
            </dl>
          </div>
        </article>
      `;
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateImages();
    updatePhoneLinks();
    updateCompanyTable();
    updateRecruitTable();
    updateWorks();
  });
})();
