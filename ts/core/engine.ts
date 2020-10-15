namespace BE {

	/**
	 * The main game engine class.
	 */
	export class Engine {
			
		declare private _canvas: HTMLCanvasElement;
		declare private _shader: Shader;

		declare private _sprite: Sprite;

		/**
		 * Creates a new engine.
		 */
		public constructor() {
			
		}

		/**
		 * Start the current instance of the engine.
		 */
		public start(): void {
			this._canvas = GLUtilities.initialize();

			gl.clearColor(0, 0, 0, 1);

			this.loadShaders();
			this._shader.use();
			
			// Load
			this._sprite = new Sprite("test");

			this._sprite.load();

			this.resize();
			this.loop();
		}

		/**
		 * Resizes canvas to fit window.
		 */
		public resize(): void {
			if (this._canvas !== undefined) {
				this._canvas.width = window.innerWidth;
				this._canvas.height = window.innerHeight;

				gl.viewport(0, 0, this._canvas.width, this._canvas.height);
			}
		}

		private loop(): void {
			gl.clear(gl.COLOR_BUFFER_BIT);
			
			// Set uniform
			let colorPosition = this._shader.getUniformLocation("u_color");
			gl.uniform4f(colorPosition, 1, 0.5, 0, 1);

			this._sprite.draw();

			requestAnimationFrame(this.loop.bind(this));
		}

		private loadShaders(): void {
			let vertexShaderSource = `
				attribute vec3 a_position;

				void main() {
					gl_Position = vec4(a_position, 1.0);
				}
			`;

			let fragmentShaderSource = `
				precision mediump float;
				
				uniform vec4 u_color;

				void main() {
					gl_FragColor = u_color;
				}
			`;

			this._shader = new Shader("basic", vertexShaderSource, fragmentShaderSource);
		}
	}
}