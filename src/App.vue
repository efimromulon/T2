<template>
	<div id="app">
		<CanvasBackground/>
	</div>
</template>
<style lang="sass">
	.btn
		position: absolute
		z-index: 999
		width: 90px
		height: 35px
		background: #FF00FF
		top: 12px
		right: 12px
	.btn-2
		right: 112px
</style>
<script>
import CanvasBackground from '@/components/CanvasBackground'
// import AppNavigation from '@/components/AppNavigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// import { mousePointer } from "./mixins/mousePointer"

export default {
	name: 'App',
	components: {
		// AppNavigation,
		CanvasBackground
	},
	// mixins: [mousePointer],
	data() {
		return {
		}
	},
	methods: {
	},
	mounted() {
		// let height1;
		// let container = this.$refs.main
		// let body = this.$refs.viewport
		// function setHeight() {
		// 	height1 = container.clientHeight;
		// 	body.style.height = height1 + "px";
		// 	console.log('setHeight',height1)
		// }
		// ScrollTrigger.addEventListener("refreshInit", setHeight);

		// // smooth scrolling container
		// gsap.to(container, {
		// 	y: () => -(height1 - document.documentElement.clientHeight),
		// 	ease: "none",
		// 	scrollTrigger: {
		// 		trigger: this.$refs.viewport,
		// 		start: "top top",
		// 		end: "bottom bottom",
		// 		scrub: 1,
		// 		invalidateOnRefresh: true,
		// 		onUpdate: self => {
		// 			this.vpos = -(height1 - document.documentElement.clientHeight) * self.progress
		// 			console.log("progress:", self.progress.toFixed(3), "direction:", self, "velocity",);
		// 		}
		// 	}
		// });
	}
}
</script>