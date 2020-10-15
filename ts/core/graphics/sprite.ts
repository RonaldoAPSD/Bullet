namespace BE {

	export class Sprite {

		private _name: string;
		private _width: number;
		private _height: number;

		declare private _buffer: GLBuffer;
		
		// TEMP
		public position: Vector3 = new Vector3();

		/**
		 * Creates a new sprite
		 * @param name Name of the sprite.
		 * @param width Width of the sprite. Default = 50;
		 * @param height Height of the sprite. Default = 50;
		 */
		public constructor(name: string, width: number = 50, height: number = 50) {
			this._name = name;
			this._width = width;
			this._height = height;
		}
		
		/**
		 * Performs loading routines on this sprite.
		 */
		public load(): void {
			this._buffer = new GLBuffer(3);

			let positionAttribute = new AttributeInfo();
			positionAttribute.location = 0;
			positionAttribute.offset = 0;
			positionAttribute.size = 3;
			this._buffer.addAttributeLocation(positionAttribute);

			let vertices = [
				//  X,   Y,   Z
					0,           0,            0,
					0,           this._height, 0,
					this._width, this._height, 0,

					this._width, this._height, 0,
					this._width, 0,            0,
					0,           0,            0
			];

			this._buffer.pushBackData(vertices);
			this._buffer.upload();
			this._buffer.unbind();
		}

		/**
		 * Performs update routines on this sprite
		 * @param time The delta time in milliseconds.
		 */
		public update(time: number): void {

		}
		
		/**
		 * Renders the sprite
		 */
		public render() {
			this._buffer.bind();
			this._buffer.render();
		}
	}
}