import $ from 'jquery';

/**
 * Active l'animation du compteur numérique lors du défilement (Scroll Spy)
 */
export function initCounterUp(selector: string = '.counter-value'): void {
  $(window).on('scroll.counterUp', function () {
    $(selector).each(function () {
      const $this = $(this);
      const countTo = parseInt($this.attr('data-count') || '0', 10);

      if (!$this.hasClass('counted') && isElementInViewport($this[0])) {
        $this.addClass('counted');
        $({ countNum: 0 }).animate(
          { countNum: countTo },
          {
            duration: 2000,
            easing: 'swing',
            step: function () {
              $this.text(Math.floor(this.countNum).toLocaleString());
            },
            complete: function () {
              $this.text(this.countNum.toLocaleString() + ($this.attr('data-suffix') || ''));
            },
          }
        );
      }
    });
  });
}

/**
 * Active le défilement doux (smooth scroll) sur les liens d'ancre
 */
export function initSmoothScroll(selector: string = 'a[href^="#"]'): void {
  $(document).off('click.smoothScroll').on('click.smoothScroll', selector, function (e) {
    const target = $(this.getAttribute('href') || '');
    if (target.length) {
      e.preventDefault();
      $('html, body').stop().animate(
        {
          scrollTop: target.offset()!.top - 80,
        },
        800
      );
    }
  });
}

/**
 * Effet Parallax subtil au scroll sur les éléments sélectionnés
 */
export function initParallax(selector: string = '.parallax-bg', speed: number = 0.3): void {
  $(window).on('scroll.parallax', function () {
    const scrollTop = $(window).scrollTop() || 0;
    $(selector).css('transform', `translateY(${scrollTop * speed}px)`);
  });
}

/**
 * Nettoyage des événements jQuery lors du démontage React
 */
export function cleanupJQueryEvents(): void {
  $(window).off('scroll.counterUp scroll.parallax');
  $(document).off('click.smoothScroll');
}

function isElementInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
