import { gsap } from "gsap";

export const mousePointer = {
	mounted: function() {
		this.pointersTl = gsap
			.timeline()
			.to(this.$refs.mousePointerA, {
				scale: 0,
				duration: 0.1
			})
			.to(this.$refs.mousePointerB, {
				scale: 3,
				ease: "bounce",
				duration: 0.3,
			})
			.reverse();
	},
	created: function() {
		window.addEventListener("mousemove", this.mousePointerAttach);
	},
	destroyed: function() {
		window.removeEventListener("mousemove", this.mousePointerAttach);
	},
	methods: {
		mousePointerAttach(e) {
			gsap.to(this.$refs.mousePointerA, {
				x: e.clientX,
				y: e.clientY,
				autoAlpha: 1,
				duration: 0.5,
			});
			gsap.to(this.$refs.mousePointerB, {
				x: e.clientX,
				y: e.clientY,
				autoAlpha: 1,
				duration: 0.9,
			});
		},
		mousePointerEnter() {
			this.pointersTl.play();
			gsap.set(this.$refs.mousePointerA, { zIndex: -1 });
			gsap.set(this.$refs.mousePointerB, { zIndex: 0 });
		},
		mousePointerLeave() {
			this.pointersTl.reverse();
			gsap.set(this.$refs.mousePointerA, { zIndex: 2 });
			gsap.set(this.$refs.mousePointerB, { zIndex: 1 });
		},
	},
	beforeDestroy() {
		this.pointersTl.kill();
		this.pointersTl = null;
	},
};
