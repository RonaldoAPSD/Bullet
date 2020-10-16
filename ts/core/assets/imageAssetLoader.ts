namespace BE {

	/**
	 * Represents an image asset loader
	 */
	export class ImageAssetLoader implements IAssetLoader{
		
		/**
		 * The extensions supported by this asset loader.
		 */
		public get supportedExtensions(): string[] {
			return ["png, gif, jpg"];
		}

		/**
		 * Loads an asset with the given name.
		 * @param assetName The name of the asset to be loaded.
		 */
		public loadAsset(assetName: string): void {
			let image: HTMLImageElement = new Image();
			image.onload = this.onImageLoaded.bind(this, assetName, image);
			image.src = assetName;
		}

		private onImageLoaded(assetName: string, image: HTMLImageElement): void {
			console.log("onImageLoaded: assetName/image ", assetName, image);
			let asset = new ImageAsset(assetName, image);
			AssetManager.onAssetLoaded(asset);			
		}
		
	}
}