"use strict";

/* 1. Заголовок: разбиваем на буквы, каждая появляется с задержкой.
   Вес шрифта меняется от тонкого к жирному (эффект «разной толщины»). */
const title = document.getElementById("title");
const text = title.textContent;
title.textContent = "";

[...text].forEach((char, i) => {
  const span = document.createElement("span");
  span.textContent = char;
  span.setAttribute("aria-hidden", "true");
  span.style.animationDelay = `${0.15 * i}s`;
  span.style.fontWeight = 300 + i * 100; // 300, 400, 500...
  title.appendChild(span);
});

/* 2. Шапка получает фон после прокрутки */
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 40);
});

/* 2.1 Бургер-меню */
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

function setMenu(open) {
  nav.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);   // блокируем прокрутку
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
}

burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
window.matchMedia("(min-width: 761px)").addEventListener("change", () => setMenu(false));

/* 3. Появление блоков при скролле (IntersectionObserver).
   threshold: 0.2 — класс добавляется, когда видно 20% элемента. */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target); // анимация один раз
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* 4. Форма записи: простая проверка и сообщение */
const form = document.getElementById("form");
const msg = document.getElementById("formMsg");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const phoneOk = /^[+\d][\d\s()-]{9,}$/.test(phone);

  if (!name || !phoneOk) {
    msg.textContent = "Введите имя и телефон, например +7 900 123-45-67.";
    msg.classList.add("error");
    return;
  }
  msg.classList.remove("error");
  msg.textContent = `${name}, спасибо! Мы позвоним и подтвердим запись.`;
  form.reset();
});