<template>
	<div>
		<section ref="s1" id="home">
			<div class="home-inner">
				<div class="svg-wrapper">
					<div class="svg-rect-bg" ref="bg"></div>
					<svg 
						ref="svg"
						version="1.1" 
						id="Слой_1" 
						xmlns="http://www.w3.org/2000/svg" 
						xmlns:xlink="http://www.w3.org/1999/xlink" 
						x="0px" y="0px"
						viewBox="0 0 1115 500" 
						style="enable-background:new 0 0 1115 500;" 
						xml:space="preserve"
						>
						<path d="M-0.4,0.1h173.7v39.5h-127v60.8h117.1v38.8H46.3V201h127v39.5H-0.4V0.1z"/>
						<path d="M396.5,160.8v79.6h-46.7v-69l-20.6-23h-74.8v92h-46.7V0.1h150.7l36.7,37.1V110l-23.3,23.7L396.5,160.8z M254.4,110h82.7
							l12-12V51.3l-12-12h-82.7L254.4,110L254.4,110z"/>
						<path d="M436,201V39.6l39.5-39.5H599l39.5,39.5V201L599,240.5H475.4L436,201z M574.3,200.6l17.5-17.5V57.5L574.3,40h-74.2
							l-17.5,17.5v125.6l17.5,17.5H574.3z"/>
						<path ref="p1" d="M1.2,448.2l121.9-110.7v-24l-11.2-11.2H57.1l-11.2,11.2v24h-46v-37.9L36.4,263h96.2l36.6,36.6V351L49,458v3.4h121.5V500H1.2
							V448.2z"/>
						<path d="M300.2,456H185.7v-46.4L291,263h55.2v153.7H375V456h-28.8v44h-46V456z M302.2,418.1V314.5h-1.4l-70.1,98.9v4.7H302.2z"/>
						<path d="M398.7,463.4v-30.1h46v15.6l11.9,11.8h57.6l11.8-11.8v-54.5l-19.3,19.3h-74.8l-36.6-36.6v-77.5l36.6-36.6h103.6l36.6,36.6
							v163.9L535.5,500H435.3L398.7,463.4z M504,374.4l22-22v-38.3l-11.8-11.8h-60.9l-11.9,11.8v48.4l11.9,11.9H504z"/>
						<path d="M603.9,448.2l121.9-110.7v-24l-11.2-11.2h-54.8l-11.2,11.2v24h-46v-37.9l36.6-36.6h96.2l36.6,36.6V351L651.6,458v3.4h121.5
							V500H603.9V448.2z"/>
						<path d="M844.6,312.1l-51.1,26.4v-42.3l60.3-33.2h36.9v237h-46V312.1H844.6z"/>
						<path d="M933,460.7V302.3l39.3-39.3h105l39.3,39.3v158.5l-39.3,39.3h-105L933,460.7z M1055.5,460.7l14.9-14.9V317.2l-14.9-14.9
							h-61.6L979,317.2v128.7l14.9,14.9h61.6V460.7z"/>
					</svg>
				</div>
			</div>
			<div class="home-outer">
				FRONT-END
				DEVELOPER
				MOSKOW / 3 YEARS
			</div>
		</section>
	</div>
</template>

<script>
// @ is an alias to /src

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
export default {
	name: 'Home',
	data(){
		return {
		}
	},
	methods: {
		
	},
	mounted() {
		let height = this.$refs.p1.getBoundingClientRect().height + 80 + 'px'
		let width = this.$refs.svg.getBoundingClientRect().width + 80  + 'px'
		gsap.set(this.$refs.bg, {height: height})
		gsap.fromTo(
			this.$refs.bg, 
			{
				width: 0,
				x: 120,
				force3D: true,
			},
			{
				width: width,
				x: -40,
				force3D: true,
				duration: 1.9,
				ease:"power3.inOut"
			},
		)
	}
}
</script>
<style lang="sass">
	section
		min-height: 100vh
		width: 100vw
		display: grid
		grid-template-rows: auto auto
		padding-left: 10rem
	.home-inner
		width: 100%
		max-width: 100%
		width: 100%
		margin-top: auto
	.svg-wrapper
		position: relative
		top: 0
		left: 0
		width: 67rem
		svg
			vertical-align: top
	.svg-rect-bg
		position: absolute
		bottom: -40px
		// left: -40px
		z-index: -1
		background-color: white
		transform: translate3d(35%,0,0)
</style>
