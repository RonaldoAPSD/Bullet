namespace BE {

	/**
	 * Represents an image asset.
	 */
	export class ImageAsset implements IAsset {
		
		/**
		 * The name of this asset.
		 */
		public readonly name: string;
		
		/**
		 * The data of this asset.
		 */
		public readonly data: HTMLImageElement;

		/**
		 * Creates a new image asset.
		 * @param name The name of this asset.
		 * @param data The data of this asset.
		 */
		public constructor(name: string, data: HTMLImageElement) {
			this.name = name;
			this.data = data;
		}

		/**
		 * The width of this image asset.
		 */
		public get width(): number {
			return this.data.width;
		}

		/**
		 * The hieght of this image asset.
		 */
		public get height(): number {
			return this.data.height;
		}
	}

}