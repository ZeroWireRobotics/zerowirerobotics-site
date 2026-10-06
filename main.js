// Scroll reveals: each .reveal fades and rises into place the first time it
// scrolls into view. Without JS (or IntersectionObserver) everything simply
// shows - the hidden starting state only applies under html.js.
const reveals = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
	const observer = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
				observer.unobserve(entry.target);
			}
		}
	}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
	reveals.forEach((el) => observer.observe(el));
} else {
	reveals.forEach((el) => el.classList.add('is-visible'));
}

// Lightbox: the gallery links open their full-size photo in a <dialog>
// (Escape and a click outside the photo close it, arrow keys step through).
// Without JS the links just open the photo itself.
const lightbox = document.querySelector('.lightbox');
const items = [...document.querySelectorAll('.gallery-item')];

if (lightbox && items.length && typeof lightbox.showModal === 'function') {
	const photo = lightbox.querySelector('.lightbox-img');
	let current = 0;

	const show = (index) => {
		current = (index + items.length) % items.length;
		const thumb = items[current].querySelector('img');
		photo.src = items[current].href;
		photo.alt = thumb ? thumb.alt : '';
	};

	items.forEach((item, index) => {
		item.addEventListener('click', (event) => {
			event.preventDefault();
			show(index);
			lightbox.showModal();
			document.documentElement.classList.add('lightbox-open');
		});
	});

	lightbox.addEventListener('close', () => {
		document.documentElement.classList.remove('lightbox-open');
		items[current].focus();
	});

	// A click on the dark backdrop (the dialog itself, not its contents) closes.
	lightbox.addEventListener('click', (event) => {
		if (event.target === lightbox) lightbox.close();
	});

	lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
	lightbox.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
	lightbox.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));

	lightbox.addEventListener('keydown', (event) => {
		if (event.key === 'ArrowLeft') show(current - 1);
		if (event.key === 'ArrowRight') show(current + 1);
	});
}
