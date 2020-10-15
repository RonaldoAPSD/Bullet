
var engine: BE.Engine;

// The main entry point to the application.
window.onload = () => {
	engine = new BE.Engine();
	engine.start();
}

window.onresize = () => {
	engine.resize();
}