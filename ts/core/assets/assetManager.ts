namespace BE {

	/**
	 * The Message code prefix for asset load notifications.
	 */
	export const MESSAGE_ASSET_LOADER_ASSET_LOADED = "MESSAGE_ASSET_LOADER_ASSET_LOADED:: "

	/**
	 * Manages all assests in the engine.
	 */
	export class AssetManager {

		private static _loaders: IAssetLoader[] = [];
		private static _loadedAssets: {[name: string]: IAsset} = {};

		private constructor() {

		}

		/**
		 * Initializes the manager.
		 */
		public static initialize(): void {
			AssetManager._loaders.push(new ImageAssetLoader());
		}

		/**
		 * Registers the provided loader with this asset manager.
		 * @param loader The loader to be registered.
		 */
		public static registerLoader(loader: IAssetLoader): void {
			AssetManager._loaders.push(loader);
		}

		/**
		 * A callback to be made from an asset loader when an asset is loaded.
		 * @param asset The loaded asset.
		 */
		public static onAssetLoaded(asset: IAsset): void {
			AssetManager._loadedAssets[asset.name] = asset;
			Message.send(MESSAGE_ASSET_LOADER_ASSET_LOADED + asset.name, this, asset);
		}

		/**
		 * Attemps to load an asset using ta registered asset loader.
		 * @param assetName The name/url of the asset to be loaded.
		 */
		public static loadAsset(assetName: string): void {
			let extention = assetName.split('.').pop()?.toLowerCase() as string;
			for (let l of AssetManager._loaders) {
				if (l.supportedExtensions.indexOf(extention) !== -1) {
					l.loadAsset(assetName);
					return;
				}
			}

			console.warn("Unable to load asset with extention " + extention + " because there is no loader associated with it.")
		}

		/**
		 * Indicates if an asset with the provided name has been loaded.
		 * @param assetName The asset name to check.
		 */
		public static isAssetLoaded(assetName: string): boolean {
			return AssetManager._loadedAssets[assetName] !== undefined;
		}

		/**
		 * Attemps to gfet an asset with the provaded name if found.
		 * @param assetName The name of the asset to get.
		 */
		public static getAsset(assetName: string): IAsset {
			if (AssetManager._loadedAssets[assetName] !== undefined) {
				return AssetManager._loadedAssets[assetName];
			} else {
				AssetManager.loadAsset(assetName);
			}

			// @ts-ignore
			return undefined;
		}
	}
}