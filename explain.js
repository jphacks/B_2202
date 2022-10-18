 mySwiper = new Swiper('.swiper-container', {
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    slidesPerView: 1,
});