(function () {
  var AREA_DATA = {
    All: {
      listingsCount: "18",
      medianPrice: "RM 2.85M",
      avgAge: "4Y",
      watermark: "KUALA LUMPUR",
      address: "Jalan Binjai, KLCC, 50450 Kuala Lumpur",
      units: "KL-01, BB-03, MK-09",
      buildingAge: "4Y",
      monthlyViews: "1,420",
      climate: "28°C",
      spotlightImg: "./img/demo/property-interior.webp",
      spotlightAlt: "Sunlit KLCC luxury condominium living room with skyline windows",
      spotlightTitle: "Binjai Residence",
      spotlightPrice: "RM 3.28M"
    },
    KLCC: {
      listingsCount: "18",
      medianPrice: "RM 2.85M",
      avgAge: "4Y",
      watermark: "KLCC",
      address: "Jalan Binjai, KLCC, 50450 Kuala Lumpur",
      units: "KL-01, KL-04, KL-09",
      buildingAge: "4Y",
      monthlyViews: "1,420",
      climate: "28°C",
      spotlightImg: "./img/demo/property-interior.webp",
      spotlightAlt: "Sunlit KLCC luxury condominium living room with skyline windows",
      spotlightTitle: "Binjai Residence",
      spotlightPrice: "RM 3.28M"
    },
    "Bukit Bintang": {
      listingsCount: "11",
      medianPrice: "RM 1.95M",
      avgAge: "3Y",
      watermark: "BUKIT BINTANG",
      address: "Jalan Bukit Bintang, 55100 Kuala Lumpur",
      units: "BB-02, BB-07, BB-12",
      buildingAge: "3Y",
      monthlyViews: "1,180",
      climate: "29°C",
      spotlightImg: "./img/demo/listing-bukit-bintang.webp",
      spotlightAlt: "Contemporary architectural residence terrace in Bukit Bintang",
      spotlightTitle: "Pavilion Crest",
      spotlightPrice: "RM 1.95M"
    },
    "Mont Kiara": {
      listingsCount: "14",
      medianPrice: "RM 2.42M",
      avgAge: "5Y",
      watermark: "MONT KIARA",
      address: "Jalan Kiara 3, Mont Kiara, 50480 Kuala Lumpur",
      units: "MK-05, MK-08, MK-14",
      buildingAge: "5Y",
      monthlyViews: "960",
      climate: "28°C",
      spotlightImg: "./img/demo/listing-mont-kiara.webp",
      spotlightAlt: "Open-plan living space at Kiara Courtyard Penthouse in Mont Kiara",
      spotlightTitle: "Kiara Courtyard",
      spotlightPrice: "RM 2.42M"
    }
  };

  var state = {
    area: "KLCC",
    listingsAreaFilter: "All",
    type: "All",
    tenure: "All",
    search: ""
  };

  var statListingsCount = document.getElementById("statListingsCount");
  var statMedianPrice = document.getElementById("statMedianPrice");
  var statAvgAge = document.getElementById("statAvgAge");
  var mapWatermark = document.getElementById("mapWatermark");
  var locationAddress = document.getElementById("locationAddress");
  var locationUnits = document.getElementById("locationUnits");
  var miniStatAge = document.getElementById("miniStatAge");
  var miniStatViews = document.getElementById("miniStatViews");
  var miniStatTemp = document.getElementById("miniStatTemp");
  var spotlightImg = document.getElementById("spotlightImg");
  var spotlightTitle = document.getElementById("spotlightTitle");
  var spotlightPrice = document.getElementById("spotlightPrice");
  var spotlightWebp = document.getElementById("spotlightWebp");

  function updateAreaDashboard(areaKey) {
    var data = AREA_DATA[areaKey] || AREA_DATA.KLCC;
    if (statListingsCount) statListingsCount.textContent = data.listingsCount;
    if (statMedianPrice) statMedianPrice.textContent = data.medianPrice;
    if (statAvgAge) statAvgAge.textContent = data.avgAge;
    if (mapWatermark) mapWatermark.textContent = data.watermark;
    if (locationAddress) locationAddress.textContent = data.address;
    if (locationUnits) locationUnits.textContent = data.units;
    if (miniStatAge) miniStatAge.textContent = data.buildingAge;
    if (miniStatViews) miniStatViews.textContent = data.monthlyViews;
    if (miniStatTemp) miniStatTemp.textContent = data.climate;
    if (spotlightWebp) spotlightWebp.srcset = data.spotlightImg;
    if (spotlightImg) {
      spotlightImg.src = data.spotlightImg.replace(/\.webp$/, ".jpg");
      spotlightImg.alt = data.spotlightAlt;
    }
    if (spotlightTitle) spotlightTitle.textContent = data.spotlightTitle;
    if (spotlightPrice) spotlightPrice.textContent = data.spotlightPrice;
  }

  function applyListingFilters() {
    var cards = document.querySelectorAll("#listingsGrid .listing-card");
    var q = state.search.trim().toLowerCase();
    cards.forEach(function (card) {
      var cArea = card.dataset.area || "";
      var cType = card.dataset.type || "";
      var cTenure = card.dataset.tenure || "";
      var text = card.textContent.toLowerCase();

      var areaMatch =
        state.listingsAreaFilter === "All" || cArea === state.listingsAreaFilter;
      var typeMatch = state.type === "All" || cType === state.type;
      var tenureMatch = state.tenure === "All" || cTenure === state.tenure;
      var searchMatch = !q || text.indexOf(q) !== -1;

      card.hidden = !(areaMatch && typeMatch && tenureMatch && searchMatch);
    });
  }

  // Dropdown menus
  var dropdowns = document.querySelectorAll(".filter-dropdown");
  function closeAllDropdowns(except) {
    dropdowns.forEach(function (dd) {
      if (dd !== except) {
        var btn = dd.querySelector(".filter-trigger");
        var menu = dd.querySelector(".filter-menu");
        if (btn) btn.setAttribute("aria-expanded", "false");
        if (menu) menu.hidden = true;
      }
    });
  }

  dropdowns.forEach(function (dd) {
    var key = dd.dataset.dropdown;
    var trigger = dd.querySelector(".filter-trigger");
    var labelEl = dd.querySelector(".trigger-label");
    var menu = dd.querySelector(".filter-menu");
    if (!trigger || !menu) return;

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = trigger.getAttribute("aria-expanded") === "true";
      closeAllDropdowns(dd);
      trigger.setAttribute("aria-expanded", String(!isOpen));
      menu.hidden = isOpen;
    });

    menu.addEventListener("click", function (e) {
      var opt = e.target.closest(".filter-option");
      if (!opt) return;
      var val = opt.dataset.value || "All";
      menu.querySelectorAll(".filter-option").forEach(function (o) {
        o.setAttribute("aria-selected", o === opt ? "true" : "false");
      });
      if (labelEl) labelEl.textContent = opt.textContent;
      trigger.setAttribute("aria-expanded", "false");
      menu.hidden = true;

      if (key === "area") {
        state.area = val;
        state.listingsAreaFilter = val;
        updateAreaDashboard(val);
        syncAreaTabs(val);
      } else if (key === "type") {
        state.type = val;
      } else if (key === "tenure") {
        state.tenure = val;
      }
      applyListingFilters();
    });
  });

  document.addEventListener("click", function () {
    closeAllDropdowns(null);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAllDropdowns(null);
  });

  // Search box
  var searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      state.search = searchInput.value;
      applyListingFilters();
    });
  }

  // Map pins
  document.querySelectorAll("[data-select-area]").forEach(function (pin) {
    pin.addEventListener("click", function () {
      var area = pin.dataset.selectArea;
      state.area = area;
      state.listingsAreaFilter = area;
      updateAreaDashboard(area);
      syncAreaTabs(area);
      syncAreaDropdown(area);
      applyListingFilters();
    });
  });

  // Listing area tabs
  function syncAreaTabs(area) {
    document.querySelectorAll("[data-area-tab]").forEach(function (tab) {
      tab.setAttribute(
        "aria-pressed",
        tab.dataset.areaTab === area ? "true" : "false"
      );
    });
  }

  function syncAreaDropdown(area) {
    var dd = document.querySelector('.filter-dropdown[data-dropdown="area"]');
    if (!dd) return;
    var labelEl = dd.querySelector(".trigger-label");
    var opts = dd.querySelectorAll(".filter-option");
    opts.forEach(function (opt) {
      var match = opt.dataset.value === area;
      opt.setAttribute("aria-selected", match ? "true" : "false");
      if (match && labelEl) labelEl.textContent = opt.textContent;
    });
  }

  document.querySelectorAll("[data-area-tab]").forEach(function (tab) {
    tab.addEventListener("click", function () {
      var area = tab.dataset.areaTab || "All";
      state.listingsAreaFilter = area;
      syncAreaTabs(area);
      updateAreaDashboard(area);
      syncAreaDropdown(area);
      applyListingFilters();
    });
  });

  // Shortlist heart toggle
  var favBtn = document.getElementById("favoriteLocationBtn");
  if (favBtn) {
    favBtn.addEventListener("click", function () {
      var pressed = favBtn.getAttribute("aria-pressed") === "true";
      favBtn.setAttribute("aria-pressed", String(!pressed));
    });
  }

  // Request viewing buttons -> prefill enquiry form & scroll
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".request-viewing-btn");
    if (!btn) return;
    var prop = btn.dataset.property || "KLCC Residence";
    var input = document.getElementById("enquiryArea");
    var sec = document.getElementById("enquiry");
    if (input) input.value = prop;
    if (sec) sec.scrollIntoView({ behavior: "smooth" });
    if (input) setTimeout(function () { input.focus(); }, 350);
  });

  // Native <dialog> Add Sample Listing Modal
  var dialog = document.getElementById("addPropertyModal");
  var openModalBtn = document.getElementById("openAddModalBtn");
  var openModalBtn2 = document.getElementById("openAddModalBtn2");
  var closeModalBtn = document.getElementById("closeAddModalBtn");
  var cancelModalBtn = document.getElementById("cancelAddModalBtn");
  var addPropForm = document.getElementById("addPropertyForm");

  function openAddDialog() {
    if (dialog && typeof dialog.showModal === "function") {
      dialog.showModal();
    }
  }
  function closeAddDialog() {
    if (dialog && dialog.open) {
      dialog.close();
    }
  }

  if (openModalBtn) openModalBtn.addEventListener("click", openAddDialog);
  if (openModalBtn2) openModalBtn2.addEventListener("click", openAddDialog);
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeAddDialog);
  if (cancelModalBtn) cancelModalBtn.addEventListener("click", closeAddDialog);
  if (dialog) {
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) closeAddDialog();
    });
  }

  if (addPropForm) {
    addPropForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("newPropName").value.trim();
      var price = document.getElementById("newPropPrice").value.trim();
      var area = document.getElementById("newPropArea").value;
      var addr = document.getElementById("newPropAddress").value.trim();
      if (!name || !price || !addr) return;

      var grid = document.getElementById("listingsGrid");
      var article = document.createElement("article");
      article.className = "listing-card";
      article.dataset.area = area;
      article.dataset.type = "Condominium";
      article.dataset.tenure = "Freehold";

      var media = document.createElement("div");
      media.className = "listing-media";
      var img = document.createElement("img");
      img.src = "./img/demo/property-interior.webp";
      img.alt = name + " in " + area;
      img.width = 1600;
      img.height = 1067;
      img.loading = "lazy";
      var tag = document.createElement("span");
      tag.className = "listing-tag";
      tag.textContent = area + " • Sample";
      media.appendChild(img);
      media.appendChild(tag);

      var body = document.createElement("div");
      body.className = "listing-body";
      var priceEl = document.createElement("p");
      priceEl.className = "listing-price";
      priceEl.textContent = price.indexOf("RM") === 0 ? price : "RM " + price;
      var nameEl = document.createElement("h3");
      nameEl.className = "listing-name";
      nameEl.textContent = name;
      var addrEl = document.createElement("p");
      addrEl.className = "listing-addr";
      addrEl.textContent = addr;
      var specsEl = document.createElement("p");
      specsEl.className = "listing-specs";
      specsEl.textContent = "1,650 sq ft • 3 Beds • 2 Baths • Condominium";

      var ctaWrap = document.createElement("div");
      ctaWrap.className = "listing-cta";
      var ctaBtn = document.createElement("button");
      ctaBtn.type = "button";
      ctaBtn.className = "btn-listing request-viewing-btn";
      ctaBtn.dataset.property = name + " (" + area + ")";
      ctaBtn.textContent = "Request Viewing";
      ctaWrap.appendChild(ctaBtn);

      body.appendChild(priceEl);
      body.appendChild(nameEl);
      body.appendChild(addrEl);
      body.appendChild(specsEl);
      body.appendChild(ctaWrap);
      article.appendChild(media);
      article.appendChild(body);
      grid.insertBefore(article, grid.firstChild);

      addPropForm.reset();
      closeAddDialog();
      state.listingsAreaFilter = "All";
      syncAreaTabs("All");
      applyListingFilters();
      var listingsSec = document.getElementById("listings");
      if (listingsSec) listingsSec.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Homepage Preview Viewing Enquiry Form
  var enquiryForm = document.getElementById("enquiryForm");
  var enquiryStatus = document.getElementById("enquiryStatus");
  if (enquiryForm && enquiryStatus) {
    enquiryForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("visitorName").value.trim();
      var contact = document.getElementById("visitorContact").value.trim();
      var prop = document.getElementById("enquiryArea").value.trim();
      var consent = document.getElementById("enquiryConsent");
      if (!name || !contact) {
        enquiryStatus.textContent = "Please enter your name and mobile number or email address.";
        enquiryStatus.hidden = false;
        return;
      }
      if (consent && !consent.checked) {
        enquiryStatus.textContent = "Please tick the PDPA privacy consent box before sending.";
        enquiryStatus.hidden = false;
        return;
      }
      enquiryStatus.textContent =
        "Preview confirmation: enquiry noted for " +
        (prop || "KL property") +
        ". On the live site, enquiries go directly to Jessica Leong (leongjes@gmail.com) or via WhatsApp +6010-464 6088.";
      enquiryStatus.hidden = false;
      enquiryForm.reset();
    });
  }
})();
