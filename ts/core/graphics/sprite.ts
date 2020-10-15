namespace BE {

	export class Sprite {

		private _name: string;
		private _width: number;
		private _height: number;

		declare private _buffer: GLBuffer;

		/**
		 * 
		 * @param name 
		 * @param width 
		 * @param height 
		 */
		public constructor(name: string, width: number = 10, height: number = 10) {
			this._name = name;
			this._width = width;
			this._height = height;
		}
		
		public load(): void {
			this._buffer = new GLBuffer(3);

			let positionAttribute = new AttributeInfo();
			positionAttribute.location = 0;
			positionAttribute.offset = 0;
			positionAttribute.size = 3;
			this._buffer.addAttributeLocation(positionAttribute);

			let vertices = [
				//  X,   Y,   Z
					0,   0,   0,
					0,   0.5, 0,
					0.5, 0.5, 0,

					0.5, 0.5, 0,
					0.5, 0.0, 0,
					0,   0,   0
			];

			this._buffer.pushBackData(vertices);
			this._buffer.upload();
			this._buffer.unbind();
		}

		public update(time: number): void {

		}
		
		public draw() {
			this._buffer.bind();
			this._buffer.draw();
		}
	}
}