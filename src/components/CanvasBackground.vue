<template>
	<div>
		<canvas  
			@click="click"
			ref="canvasWorks" 
			id="works-canvas--pg" 
			:style="{ width: '100%', height: '100%'}"
		></canvas>
	</div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { FlyControls } from "three/examples/jsm/controls/FlyControls"
require('three-fly-controls')(THREE);
import gsap from 'gsap'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
let	V_shader = `
		varying vec2 vUv;
		varying vec3 vecPos;
		varying vec3 v_position;

		uniform float u_time;
		uniform vec2 u_mouse;

		vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
		vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
		vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

		float cnoise(vec3 P){
			vec3 Pi0 = floor(P); 
			vec3 Pi1 = Pi0 + vec3(1.0); 
			Pi0 = mod(Pi0, 289.0);
			Pi1 = mod(Pi1, 289.0);
			vec3 Pf0 = fract(P); 
			vec3 Pf1 = Pf0 - vec3(1.0); 
			vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
			vec4 iy = vec4(Pi0.yy, Pi1.yy);
			vec4 iz0 = Pi0.zzzz;
			vec4 iz1 = Pi1.zzzz;
			vec4 ixy = permute(permute(ix) + iy);
			vec4 ixy0 = permute(ixy + iz0);
			vec4 ixy1 = permute(ixy + iz1);
			vec4 gx0 = ixy0 / 7.0;
			vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
			gx0 = fract(gx0);
			vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
			vec4 sz0 = step(gz0, vec4(0.0));
			gx0 -= sz0 * (step(0.0, gx0) - 0.5);
			gy0 -= sz0 * (step(0.0, gy0) - 0.5);
			vec4 gx1 = ixy1 / 7.0;
			vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
			gx1 = fract(gx1);
			vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
			vec4 sz1 = step(gz1, vec4(0.0));
			gx1 -= sz1 * (step(0.0, gx1) - 0.5);
			gy1 -= sz1 * (step(0.0, gy1) - 0.5);
			vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
			vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
			vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
			vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
			vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
			vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
			vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
			vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
			vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
			g000 *= norm0.x;
			g010 *= norm0.y;
			g100 *= norm0.z;
			g110 *= norm0.w;
			vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
			g001 *= norm1.x;
			g011 *= norm1.y;
			g101 *= norm1.z;
			g111 *= norm1.w;
			float n000 = dot(g000, Pf0);
			float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
			float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
			float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
			float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
			float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
			float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
			float n111 = dot(g111, Pf1);
			vec3 fade_xyz = fade(Pf0);
			vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
			vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
			float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
			return 2.2 * n_xyz;
		}

		void main() {
			vUv = uv;

			v_position = position.xyz;
			v_position.z = 40.0 + 40.*cnoise(vec3(v_position.x/130.,v_position.y/130.,u_time/100.));
			//v_position.z = sin(v_position.x / 80.)*15.;

			float dist = distance(u_mouse,v_position.xy);
			dist = (130. - clamp(dist,0.,130.))/130. ;

			v_position.z = (v_position.z*(1. - 0.) + v_position.z*0.)*sin(0.5 - dist/2.);
			v_position.z = 40. - v_position.z;

			vecPos = (modelViewMatrix * vec4(v_position, 1.)).xyz;

			gl_Position = projectionMatrix * vec4(vecPos, 1.0);
		}

	`,
	V_shader_texture = `
		varying vec2 vUv;
		varying vec3 vecPos;
		varying vec3 v_position;

		uniform float u_time;
		uniform vec2 u_mouse;
		
		vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
		vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
		vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

		float cnoise(vec3 P){
			vec3 Pi0 = floor(P); 
			vec3 Pi1 = Pi0 + vec3(1.0); 
			Pi0 = mod(Pi0, 289.0);
			Pi1 = mod(Pi1, 289.0);
			vec3 Pf0 = fract(P); 
			vec3 Pf1 = Pf0 - vec3(1.0); 
			vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
			vec4 iy = vec4(Pi0.yy, Pi1.yy);
			vec4 iz0 = Pi0.zzzz;
			vec4 iz1 = Pi1.zzzz;
			vec4 ixy = permute(permute(ix) + iy);
			vec4 ixy0 = permute(ixy + iz0);
			vec4 ixy1 = permute(ixy + iz1);
			vec4 gx0 = ixy0 / 7.0;
			vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
			gx0 = fract(gx0);
			vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
			vec4 sz0 = step(gz0, vec4(0.0));
			gx0 -= sz0 * (step(0.0, gx0) - 0.5);
			gy0 -= sz0 * (step(0.0, gy0) - 0.5);
			vec4 gx1 = ixy1 / 7.0;
			vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
			gx1 = fract(gx1);
			vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
			vec4 sz1 = step(gz1, vec4(0.0));
			gx1 -= sz1 * (step(0.0, gx1) - 0.5);
			gy1 -= sz1 * (step(0.0, gy1) - 0.5);
			vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
			vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
			vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
			vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
			vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
			vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
			vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
			vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
			vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
			g000 *= norm0.x;
			g010 *= norm0.y;
			g100 *= norm0.z;
			g110 *= norm0.w;
			vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
			g001 *= norm1.x;
			g011 *= norm1.y;
			g101 *= norm1.z;
			g111 *= norm1.w;
			float n000 = dot(g000, Pf0);
			float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
			float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
			float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
			float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
			float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
			float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
			float n111 = dot(g111, Pf1);
			vec3 fade_xyz = fade(Pf0);
			vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
			vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
			float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
			return 2.2 * n_xyz;
		}

		void main() {
			vUv = uv;
			v_position = position.xyz;
			v_position.z = 40.0 + 40.*cnoise(vec3(v_position.x/130.,v_position.y/130.,u_time/100.));
			//v_position.z = sin(v_position.x / 80.)*15.;

			float dist = distance(u_mouse,v_position.xy);
			dist = (130. - clamp(dist,0.,130.))/130. ;

			v_position.z = (v_position.z*(1. - 0.) + v_position.z*0.)*sin(0.5 - dist/2.);
			v_position.z = 40. - v_position.z;

			vecPos = (modelViewMatrix * vec4(v_position, 1.)).xyz;

			gl_Position = projectionMatrix * vec4(vecPos, 1.0);
		}

	`,
	F_shader = `

		varying vec3 v_position;
		varying vec2 vUv;

		uniform float u_time;
		uniform vec2 u_resolution;
		#define PI 3.14159265359

		float box(in vec2 _st, in vec2 _size){

			_size = vec2(0.5) - _size*0.5;
			vec2 uv = smoothstep(_size, _size+vec2(0.001), _st*0.6265);
			uv *= smoothstep(_size, _size+vec2(0.001), vec2(1.0)-_st*0.6265);
			return uv.x*uv.y;
		}

		float cross(in vec2 _st, float _size){
			return  box(_st, vec2(_size,_size/0.12)) +
					box(_st, vec2(_size/0.12,_size));
		}

		mat2 scale(vec2 _scale){
			return mat2(_scale.x,0.0,
										0.0,_scale.y);
		}

		void main(void) {
		
		vec2 st = (v_position.xy / u_resolution.xy )* 40.; //box size

		float koef = clamp(v_position.z/30.,0.,1.);

		vec2 grid = abs(fract(st - 0.5) - 0.5) / fwidth(st);
		float line = min(grid.x, grid.y);

		gl_FragColor = vec4(1. - koef,0.,0.,1. - line);

		}

	`,
	U_shader = `
		varying vec3 v_position;
		varying vec2 vUv;

		uniform float u_time;
		uniform vec2 u_resolution;
		#define PI 3.14159265359

		float box(in vec2 _st, in vec2 _size){

			_size = vec2(0.5) - _size*0.5;
			vec2 uv = smoothstep(_size, _size+vec2(0.001), _st*0.6265);
			uv *= smoothstep(_size, _size+vec2(0.001), vec2(1.0)-_st*0.6265);
			return uv.x*uv.y;
		}

		float cross(in vec2 _st, float _size){
			return  box(_st, vec2(_size,_size/0.12)) +
					box(_st, vec2(_size/0.12,_size));
		}

		mat2 scale(vec2 _scale){return mat2(_scale.x,0.0,0.0,_scale.y);}

		void main(void) {
		
			vec2 st = (v_position.xy / u_resolution.xy )* 40.; //box size

			float koef = clamp(v_position.z/3.,0.,1.);

			gl_FragColor = vec4(1. - koef,0.,0.,1.);

		}
	`,
	F_shader_cross = `

		varying vec3 v_position;
		varying vec2 vUv;

		uniform float u_time;
		uniform vec2 u_resolution;
		#define PI 3.14159265359

		float box(in vec2 _st, in vec2 _size){

			_size = vec2(0.5) - _size*0.5;
			vec2 uv  = smoothstep(_size, _size+vec2(0.001), _st *0.6         );
				uv *= smoothstep(_size, _size+vec2(0.001), vec2(1.0)-_st*0.6);
			return uv.x*uv.y;
		}

		float cross(in vec2 _st, float _size){
			return  box(_st, vec2(_size,_size/0.2)) +
					box(_st, vec2(_size/0.2,_size));
		}
		mat2 scale(vec2 _scale){
			return mat2(_scale.x,0.0,0.0,_scale.y);
		}
		void main(void) {
		
			vec2 st = v_position.xy/u_resolution.xy;
			vec3 color = vec3(0.0);

			st *= 40.0; 
			st = fract(st);

			//color = vec3(0.9922, 0.0434, 0.2549);
			color = vec3(0.,0.,0.);
			color += vec3(cross(st,0.018));

			float y = step( 1.,color.x);
			
			gl_FragColor = vec4(1. - color, y);

		}

	`,
	F_shader_texture = `

				varying vec3 v_position;
				varying vec2 vUv;
				uniform float u_time;
				uniform vec2 u_resolution;
				uniform sampler2D u_texture;
				#define PI 3.14159265359

				void main(void) {
				
					vec2 st = v_position.xy/u_resolution.xy;
					vec3 color = vec3(0.0);
					st *= 40.; 
					vec4 imgCurrent = texture2D(u_texture, vUv);
					gl_FragColor = imgCurrent;

				}

			`
let textures = [new THREE.TextureLoader().load("1.jpg")]
let time = 0
let ii = 0
export default {
	name: 'CanvasBackground',
	props: {
		videoOptions: {
			type: Object
		}
	},
	data() {
		return {
			container: null,
			camera: null,
			renderer: null,
			controls: null,
			scene: null,
			P_uniforms: {
				u_time: 	{ type: 'f', value: 0.0 },	
				u_koef_1: 	{ type: 'f', value: 0.0 },
				u_mouse: 	{ type: 'vec2', value: new THREE.Vector2( 0, 0 ) },
				u_resolution: { type: 'vec2', value: [] },
				u_texture: { value: textures[0] }
			},
			ii: 0,
			store: {
				ww: window.innerWidth,
				wh: window.innerHeight,
				isDevice:
					navigator.userAgent.match(/Android/i) ||
					navigator.userAgent.match(/webOS/i) ||
					navigator.userAgent.match(/iPhone/i) ||
					navigator.userAgent.match(/iPad/i) ||
					navigator.userAgent.match(/iPod/i) ||
					navigator.userAgent.match(/BlackBerry/i) ||
					navigator.userAgent.match(/Windows Phone/i)
			},
			mouse_cur: new THREE.Vector2(),
			mouse_prv: { x: 0, y: 0 },
			p_mesh: null,
			PROXY_CAMERA: null,
			scene_proxy: null,
			vvv: false,
			tv: null,
			room: null,
			object: new THREE.Group(),
			spheresCount: 200,
			clock: new THREE.Clock(),
			ids: new Set(),
			distance: 0
		}
	},
	watch: {
		'videoOptions.play': {
			handler: function(val) {
				if(val) {
					this.$refs.video.play()
				} else {
					this.$refs.video.pause()
				}
			}
		},
		'videoOptions.mute': {
			handler: function(val) {
				this.$refs.video.muted = !this.$refs.video.muted
			}
		},
		vpos(newVal) {
			// console.log('vpos',newVal)
			// // this.PROXY_CAMERA.y= newVal;
			// gsap.to(this.PROXY_CAMERA, {
			// 	// repeat: -1,
			// 	duration: .6,
			// 	keyframes: [{
			// 		y: newVal
			// 	}],
			// 	// ease:"power3.inOut"
			// })
		}
	},
	mounted(){
		this.init()
		this.animate()
	},
	methods: {
		init() {
			this.container = this.$refs.canvasWorks
			this.scene = new THREE.Scene()
			this.scene.background = new THREE.Color(0xFFFFFF)
			let bg = this.scene.background
			this.raycaster = new THREE.Raycaster()
			this.scene_proxy = new Proxy({
				r: this.scene.background.r,
				g: this.scene.background.g,
				b: this.scene.background.b
			}, {
				set(target, key, value) {
					target[key] = value;
					if(target.r !== null) {
						bg.r = target.r;
					}
					if(target.g !== null) {
						bg.g = target.g;
					}
					if(target.b !== null) {
						bg.b = target.b;
					}
					return true;
				},
				get(target, key) {
					return target[key];
				}
			})
			
			const axesHelper = new THREE.AxesHelper( 50000 );
			this.scene.add( axesHelper );
			this.P_uniforms.u_resolution.value = [ window.screen.height, window.screen.height ];
			this.createCamera()
			this.createLight()
			this.createModel()
			this.createRenderer()
			this.createControls()
			this.onWindowResize()
			window.addEventListener("resize", this.onWindowResize)
			document.addEventListener('mousemove', this.onMouseMove, false);
		},
		onMouseMove(event) {
			event.preventDefault();
			this.mouse_cur.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			this.mouse_cur.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		},
		createCamera() {
			// this.camera = new THREE.PerspectiveCamera(
			// 	35,
			// 	window.innerWidth / window.innerHeight,
			// 	1,
			// 	20000
			// )
			// this.camera.position.set(0, 0, 1000)
			this.camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 20000);
			this.camera.position.set(0, 0, 2000);
			// this.camera.lookAt(new THREE.Vector3(0, 0, 0));
			// this.PROXY_CAMERA = new Proxy({
			// 	x: null,
			// 	y: null,
			// 	z: null
			// }, {
			// 	set(target, key, value) {
			// 		target[key] = value;
			// 		if(target.x !== null) {
			// 			camera.position.x = target.x;
			// 		}
			// 		if(target.y !== null) {
			// 			camera.position.y = target.y;
			// 		}
			// 		if(target.z !== null) {
			// 			camera.position.z = target.z;
			// 		}
			// 		return true;
			// 	},
			// 	get(target, key) {
			// 		return target[key];
			// 	}
			// })
		},
		createControls() {
			// this.controls = new OrbitControls(this.camera, this.renderer.domElement)
			// this.controls.enableDamping = true
			// this.controls.campingFactor = 0.25
			// this.controls.enableZoom = true
			// this.controls.autoRotate = true

			this.controls = new FlyControls( this.camera, this.renderer.domElement );

			this.controls.movementSpeed = 50;
			this.controls.domElement = this.renderer.domElement;
			this.controls.rollSpeed = 0.005;
			this.controls.autoForward = false;
			this.controls.dragToLook = false;
		},
		createLight() {
			const skyColor = 0xFF00FF;
			const groundColor = 0xFF00FF;
			const intensity = 2;
			const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);

			light.position.x = 0;
			light.position.y = 0;
			light.position.z = 180;
			this.scene.add( light )
			this.sphereSize = 50;
			let pointLightHelper = new THREE.PointLightHelper(
				light,
				this.sphereSize
			);
			this.scene.add( pointLightHelper )
		},
		createRenderer() {
			this.renderer = new THREE.WebGLRenderer({ canvas: this.container, alpha: true, antialias: true })
			this.renderer.setSize(window.innerWidth, window.innerHeight)
			this.renderer.setPixelRatio(window.devicePixelRatio)
			this.renderer.gammaFactor = 2.2
			this.renderer.physicallyCorrectLights = true

		},
		animate() {
			this.ii += 0.05;
			time++;
			this.object.updateMatrix();
			requestAnimationFrame(this.animate)
			this.render()
		},
		render() {
			const delta = this.clock.getDelta();
			this.controls.update(delta);
			this.scene.children.forEach( child => {
				if(child.type !== "Mesh") return
				let distance = this.controls.object.position.distanceTo(child.position);
				if(distance < 300) {
					child.material.color.setHex( 0xff0000 );
				} else {
					child.material.color.setHex( 0x000000 );
				}
			})
			this.renderer.render(this.scene, this.camera)
		},
		onWindowResize() {
			this.camera.aspect = window.innerWidth / window.innerHeight
			this.camera.updateProjectionMatrix()
			this.renderer.setSize(window.innerWidth, window.innerHeight)
		},
		getRandomInt(min, max) {
			return Math.random() * (max - min) + min;
		},
		createModel() {
			var material = new THREE.MeshLambertMaterial({
				color: Math.random() * 0xffffff,
				// specular: 0x333333,
				// shininess: 15
			});
			let spheres = [],
			obj = this.object

			for (var i = 0; i < 3; i++) {
				var mesh = new THREE.Mesh(new THREE.SphereGeometry(1.3, this.getRandomInt(3, 3), this.getRandomInt(2, 2)), material);

				mesh.position.set(this.getRandomInt(-1, 1), this.getRandomInt(-1, 1), this.getRandomInt(-1, 1)).normalize();
				mesh.position.multiplyScalar(Math.random() * 2500);

				mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);

				spheres[i] = {
					positionY: -1,
					mesh: mesh,
					meshInitPosX: mesh.position.x,
					meshInitPosY: mesh.position.y,
					meshInitPosZ: mesh.position.z,
					meshInitRotY: mesh.rotation.y
				};

				mesh.scale.x = mesh.scale.y = mesh.scale.z = this.getRandomInt(20, 50);
				// obj.add(mesh);
				this.scene.add( mesh );
			}
			obj.add(new THREE.BoxHelper(obj));
			// var mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material);
			// this.p_mesh = new THREE.Mesh( p_gmr, p_mat );
			// this.scene.add( mesh );
		},
		click() {
			// var clr = {value:0}
			// let hhh = this.scene.background
			// gsap.to(clr, {
			// 	value:1,
			// 	// repeat:-1,
			// 	duration: 6,
			// 	modifiers:{
			// 		value:function( v ) {
			// 			hhh.setHSL( v, 1, 0.5 )
					
			// 		}
			// 	},
			// })

			// this.PROXY_CAMERA.z = 1000;
			// gsap.to(this.PROXY_CAMERA, {
			// 	// repeat: -1,
			// 	duration: 3,
			// 	keyframes: [{
			// 		y: 100
			// 	}],
			// 	ease:"power3.inOut"
			// })
		}
	}
}
</script>