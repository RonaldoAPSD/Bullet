namespace BE {

	/**
	 * Represents an asset loader.
	 */
	export interface IAssetLoader {

		/**
		 * The extentions supported by this asset loader.
		 */
		readonly supportedExtensions: string[];

		/**
		 * Loads an asset with the given name.
		 * @param assetName The name of the asset to be loaded.
		 */
		loadAsset(assetName: string): void;
	}
}