namespace BE {

	/**
	 * Represents a 3-component vector.
	 */
	export class Vector3 {

		private _x: number;
		private _y: number;
		private _z: number;

		/**
		 * Creates a new vector 3.
		 * @param x The x component.
		 * @param y The y component.
		 * @param z The z component.
		 */
		public constructor(x: number = 0, y: number = 0, z: number = 0) {
			this._x = x;
			this._y = y;
			this._z = z;
		}

		/**
		 * The x component
		 */
		public get x(): number {
			return this._x;
		}

		/**
		 * Set the x component
		 */
		public set x(value: number) {
			this._x = value;
		}

		/**
		 * The y component
		 */
		public get y(): number {
			return this._y;
		}

		/**
		 * Set the y component
		 */
		public set y(value: number) {
			this._y = value;
		}
		
		/**
		 * The z component
		 */
		public get z(): number {
			return this._z;
		}

		/**
		 * Set the z component
		 */
		public set z(value: number) {
			this._z = value;
		}

		/**
		 * Returns the data of this vector as a number array.
		 */
		public toArray(): number[] {
			return [this._x, this._y, this._z];
		}

		/**
		 * Returns the data of this vector as a Float32Array.
		 */
		public toFloat32Array(): Float32Array {
			return new Float32Array(this.toArray());
		}
	}
}