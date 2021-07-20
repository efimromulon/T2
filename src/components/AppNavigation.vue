<template>
	<nav id="nav">
		<ul class="nav-wrapper">
			<li class="nav-item" ref="topi1">
				<div class="nav-number">01</div>
				<div class="nav-letters">roman</div>
				<div class="nav-letters">efimov</div>
			</li>
			<li class="nav-item" ref="topi2">
				<div class="nav-number">02</div>
				<div class="nav-letters">freelance</div>
				<div class="nav-letters">developer</div>
			</li>
			<li class="nav-item" ref="topi3">
				<div class="nav-number">03</div>
				<div class="nav-letters">2018</div>
				<div class="nav-letters">/ 2021</div>
			</li>
			<li class="nav-item" ref="topi4">
				<div class="nav-number">04</div>
				<div class="nav-letters">
					<a href="https://vk.com/ephimov_roman" class="random-over _tb" @mouseenter="mouseoverlink">
						<span>v</span>
						<span>k</span>
						<span>o</span>
						<span>n</span>
						<span>t</span>
						<span>a</span>
						<span>k</span>
						<span>t</span>
						<span>e</span>
					</a>
				</div>
				<div class="nav-letters">
					<a href="https://github.com/efimromulon" class="random-over _tb" @mouseenter="mouseoverlink">
						<span>g</span>
						<span>i</span>
						<span>t</span>
						<span>h</span>
						<span>u</span>
						<span>b</span>
					</a>
				</div>
			</li>
			<li class="nav-item nav-contact" ref="topi5">
				<div class="nav-number">05</div>
				<div class="nav-letters">
					contact
					<span class="nav-contact--line">
						<span></span>
						<span></span>
					</span>
				</div>
			</li>
		</ul>
	</nav>
</template>
<script>
import gsap from 'gsap'
export default {
	name: 'AppNavigation',
	methods: {
		mouseoverlink(event){
			gsap.fromTo(event.target.children,
				{
					opacity: 0
				},
				{
					opacity: 1,
					stagger: {
						each: 0.05,
						from: "random",
						grid: "auto",
						ease: "power2.inOut"
					}
				}
			)
		},
	}
}
</script>