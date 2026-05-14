(function() {
	const G = 0.9,
		F = 0.98,
		B = -0.3,
		VAC = 2.5;
	let e = [],
		a = null,
		l = {
			x: 0,
			y: 0
		},
		v = {
			x: 0,
			y: 0
		},
		isVac = false;
	window.addEventListener("contextmenu", e => e.preventDefault());
	window.addEventListener("mousedown", e => {
		if (e.button === 2) isVac = true;
	});
	window.addEventListener("mouseup", e => {
		if (e.button === 2) isVac = false;
	});
	const tags = ['h1', 'h2', 'h3', 'p', 'a', 'span', 'button', 'li'];
	tags.forEach(t => {
		document.querySelectorAll(t).forEach(el => {
			if (el.children.length > 0 || !el.innerText.trim()) return;
			const txt = el.innerText.split("");
			el.innerHTML = "";
			txt.forEach(char => {
				if (!char.trim()) return;
				const s = document.createElement("span");
				s.innerText = char;
				s.style.display = "inline-block";
				el.appendChild(s)
			})
		})
	});
	document.querySelectorAll("body *").forEach(t => {
		if (t.children.length > 0 || t.offsetWidth < 2) return;
		const r = t.getBoundingClientRect();
		const o = {
			node: t,
			x: r.left,
			y: r.top,
			vx: 0,
			vy: 0,
			w: r.width,
			h: r.height,
			isDragging: !1
		};
		Object.assign(t.style, {
			position: "fixed",
			left: r.left + "px",
			top: r.top + "px",
			zIndex: "2147483647",
			cursor: "grab",
			userSelect: "none",
			display: "inline-block"
		});
		t.addEventListener("mousedown", e => {
			if (e.button === 0) {
				e.preventDefault();
				e.stopPropagation();
				a = o;
				o.isDragging = !0;
				o.vx = o.vy = 0;
			}
		});
		e.push(o)
	});
	window.addEventListener("mousemove", e => {
		v = {
			x: e.clientX - l.x,
			y: e.clientY - l.y
		};
		l = {
			x: e.clientX,
			y: e.clientY
		};
		if (a) {
			a.x = e.clientX - a.w / 2;
			a.y = e.clientY - a.h / 2
		}
	});
	window.addEventListener("mouseup", () => {
		if (a) {
			a.isDragging = !1;
			a.vx = v.x;
			a.vy = v.y;
			a = null
		}
	});
	(function u() {
		const w = window.innerWidth,
			h = window.innerHeight;
		e.forEach(p => {
			if (!p.isDragging) {
				if (isVac) {
					const dx = l.x - p.x,
						dy = l.y - p.y,
						dist = Math.sqrt(dx * dx + dy * dy);
					if (dist < 500) {
						p.vx += dx / dist * VAC;
						p.vy += dy / dist * VAC;
						p.vx *= 0.95;
						p.vy *= 0.95;
					}
				}
				p.vy += G;
				p.vx *= F;
				p.vy *= F;
				p.x += p.vx;
				p.y += p.vy;
				if (p.y + p.h > h) {
					p.y = h - p.h;
					p.vy *= B;
					p.vx *= 0.5
				}
				if (p.x + p.w > w) {
					p.x = w - p.w;
					p.vx *= B
				} else if (p.x < 0) {
					p.x = 0;
					p.vx *= B
				}
			}
			p.node.style.left = p.x + "px";
			p.node.style.top = p.y + "px"
		});
		requestAnimationFrame(u)
	})()
})();
