namespace BE {

	/**
	 * The WebGL rendering context.
	 */
	export var gl: WebGLRenderingContext;

	/**
	 * Responsible for setting up a WebGL rendering context.
	 */
	export class GLUtilities {
		
		/**
		 * Initializes WebGL, potentially using the canvas with an assigned id matching the provided if it is defined.
		 * @param elementID The id of the element to search for.
		 */
		public static initialize(elementID?: string): HTMLCanvasElement {
			let canvas: HTMLCanvasElement;
			
			if (elementID !== undefined) {
				canvas = document.getElementById(elementID) as HTMLCanvasElement;
				if (canvas === undefined) {
					throw new Error("Cannot find a canvas element named: " + elementID);
				}
			} else {
				canvas = document.createElement("canvas") as HTMLCanvasElement;
				document.body.appendChild(canvas);
			}

			gl = canvas.getContext("webgl") as WebGLRenderingContext;
			if (gl === undefined) {
				throw new Error("Unable to initilize WebGL");
			}

			return canvas;
		}
	}
}