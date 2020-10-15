"use strict";
var engine;
// The main entry point to the application.
window.onload = function () {
    engine = new BE.Engine();
    engine.start();
};
window.onresize = function () {
    engine.resize();
};
var BE;
(function (BE) {
    /**
     * The main game engine class.
     */
    var Engine = /** @class */ (function () {
        /**
         * Creates a new engine.
         */
        function Engine() {
        }
        /**
         * Start the current instance of the engine.
         */
        Engine.prototype.start = function () {
            this._canvas = BE.GLUtilities.initialize();
            BE.gl.clearColor(0, 0, 0, 1);
            this.loadShaders();
            this._shader.use();
            // Load
            this._sprite = new BE.Sprite("test");
            this._sprite.load();
            this.resize();
            this.loop();
        };
        /**
         * Resizes canvas to fit window.
         */
        Engine.prototype.resize = function () {
            if (this._canvas !== undefined) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
                BE.gl.viewport(0, 0, this._canvas.width, this._canvas.height);
            }
        };
        Engine.prototype.loop = function () {
            BE.gl.clear(BE.gl.COLOR_BUFFER_BIT);
            // Set uniform
            var colorPosition = this._shader.getUniformLocation("u_color");
            BE.gl.uniform4f(colorPosition, 1, 0.5, 0, 1);
            this._sprite.draw();
            requestAnimationFrame(this.loop.bind(this));
        };
        Engine.prototype.loadShaders = function () {
            var vertexShaderSource = "\n\t\t\t\tattribute vec3 a_position;\n\n\t\t\t\tvoid main() {\n\t\t\t\t\tgl_Position = vec4(a_position, 1.0);\n\t\t\t\t}\n\t\t\t";
            var fragmentShaderSource = "\n\t\t\t\tprecision mediump float;\n\t\t\t\t\n\t\t\t\tuniform vec4 u_color;\n\n\t\t\t\tvoid main() {\n\t\t\t\t\tgl_FragColor = u_color;\n\t\t\t\t}\n\t\t\t";
            this._shader = new BE.Shader("basic", vertexShaderSource, fragmentShaderSource);
        };
        return Engine;
    }());
    BE.Engine = Engine;
})(BE || (BE = {}));
var BE;
(function (BE) {
    /**
     * Responsible for setting up a WebGL rendering context.
     */
    var GLUtilities = /** @class */ (function () {
        function GLUtilities() {
        }
        /**
         * Initializes WebGL, potentially using the canvas with an assigned id matching the provided if it is defined.
         * @param elementID The id of the element to search for.
         */
        GLUtilities.initialize = function (elementID) {
            var canvas;
            if (elementID !== undefined) {
                canvas = document.getElementById(elementID);
                if (canvas === undefined) {
                    throw new Error("Cannot find a canvas element named: " + elementID);
                }
            }
            else {
                canvas = document.createElement("canvas");
                document.body.appendChild(canvas);
            }
            BE.gl = canvas.getContext("webgl");
            if (BE.gl === undefined) {
                throw new Error("Unable to initilize WebGL");
            }
            return canvas;
        };
        return GLUtilities;
    }());
    BE.GLUtilities = GLUtilities;
})(BE || (BE = {}));
var BE;
(function (BE) {
    /**
     * THIS CLASS IS TO BE TREATED LIKE A STRUCT.
     * Represents the information needed for a GLBuffer attribute.
     */
    var AttributeInfo = /** @class */ (function () {
        function AttributeInfo() {
        }
        return AttributeInfo;
    }());
    BE.AttributeInfo = AttributeInfo;
    /**
     * Represents a WebGL Buffer.
     */
    var GLBuffer = /** @class */ (function () {
        /**
         * Creates a new GL buffer.
         * @param elementSize The size of each element in this buffer.
         * @param dataType The data type of this buffer. Default: gl.FLOAT
         * @param targetBufferType the buffer target type. Can be either gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER. Default: gl.ARRAY_BUFFER
         * @param mode The drawing mode of this buffer. (i.e gl.TRIANGLES or gl.LINES). Default: gl.TRIANGLES
         */
        function GLBuffer(elementSize, dataType, targetBufferType, mode) {
            if (dataType === void 0) { dataType = BE.gl.FLOAT; }
            if (targetBufferType === void 0) { targetBufferType = BE.gl.ARRAY_BUFFER; }
            if (mode === void 0) { mode = BE.gl.TRIANGLES; }
            this._hasAttributeLocation = false;
            this._data = [];
            this._attributes = [];
            this._elementSize = elementSize;
            this._dataType = dataType;
            this._targetBufferType = targetBufferType;
            this._mode = mode;
            // Determine byte size
            switch (this._dataType) {
                case BE.gl.FLOAT:
                case BE.gl.INT:
                case BE.gl.UNSIGNED_INT:
                    this._typeSize = 4;
                    break;
                case BE.gl.SHORT:
                case BE.gl.UNSIGNED_SHORT:
                    this._typeSize = 2;
                    break;
                case BE.gl.BYTE:
                case BE.gl.UNSIGNED_BYTE:
                    this._typeSize = 1;
                    break;
                default:
                    throw new Error("Unrecognized data type: " + dataType.toString());
            }
            this._stride = this._elementSize * this._typeSize;
            this._buffer = BE.gl.createBuffer();
        }
        /**
         * Destroys this buffer.
         */
        GLBuffer.prototype.destroy = function () {
            BE.gl.deleteBuffer(this._buffer);
        };
        /**
         * Binds this buffer.
         * @param normalized Indicates if the data should be normalized. Default: false
         */
        GLBuffer.prototype.bind = function (normalized) {
            if (normalized === void 0) { normalized = false; }
            BE.gl.bindBuffer(this._targetBufferType, this._buffer);
            if (this._hasAttributeLocation) {
                for (var _i = 0, _a = this._attributes; _i < _a.length; _i++) {
                    var it = _a[_i];
                    BE.gl.vertexAttribPointer(it.location, it.size, this._dataType, normalized, this._stride, it.offset * this._typeSize);
                    BE.gl.enableVertexAttribArray(it.location);
                }
            }
        };
        /**
         * Unbinds this buffer.
         */
        GLBuffer.prototype.unbind = function () {
            for (var _i = 0, _a = this._attributes; _i < _a.length; _i++) {
                var it = _a[_i];
                BE.gl.disableVertexAttribArray(it.location);
            }
            BE.gl.bindBuffer(BE.gl.ARRAY_BUFFER, this._buffer);
        };
        /**
         * Adds an attribute with the provided information to this buffer.
         * @param info The information to be added.
         */
        GLBuffer.prototype.addAttributeLocation = function (info) {
            this._hasAttributeLocation = true;
            this._attributes.push(info);
        };
        /**
         * Adds data to this.
         * @param data The data to be added.
         */
        GLBuffer.prototype.pushBackData = function (data) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var d = data_1[_i];
                this._data.push(d);
            }
        };
        /**
         * Uploads buffer's data to the GPU
         */
        GLBuffer.prototype.upload = function () {
            BE.gl.bindBuffer(BE.gl.ARRAY_BUFFER, this._buffer);
            // @ts-ignore
            var bufferData = undefined;
            switch (this._dataType) {
                case BE.gl.FLOAT:
                    bufferData = new Float32Array(this._data);
                    break;
                case BE.gl.INT:
                    bufferData = new Int32Array(this._data);
                    break;
                case BE.gl.UNSIGNED_INT:
                    bufferData = new Uint32Array(this._data);
                    break;
                case BE.gl.SHORT:
                    bufferData = new Int16Array(this._data);
                    break;
                case BE.gl.UNSIGNED_SHORT:
                    bufferData = new Uint16Array(this._data);
                    break;
                case BE.gl.BYTE:
                    bufferData = new Int8Array(this._data);
                    break;
                case BE.gl.UNSIGNED_BYTE:
                    bufferData = new Uint8Array(this._data);
                    break;
            }
            BE.gl.bufferData(this._targetBufferType, bufferData, BE.gl.STATIC_DRAW);
        };
        /**
         * Draws this buffer.
         */
        GLBuffer.prototype.draw = function () {
            if (this._targetBufferType === BE.gl.ARRAY_BUFFER) {
                BE.gl.drawArrays(this._mode, 0, this._data.length / this._elementSize);
            }
            else if (this._targetBufferType === BE.gl.ELEMENT_ARRAY_BUFFER) {
                BE.gl.drawElements(this._mode, this._data.length, this._dataType, 0);
            }
        };
        return GLBuffer;
    }());
    BE.GLBuffer = GLBuffer;
})(BE || (BE = {}));
var BE;
(function (BE) {
    var Shader = /** @class */ (function () {
        /**
         * Creates a new shader.
         * @param name The name of this shader.
         * @param vertexSource The source of the vertex shader.
         * @param fragmentSource The source of the fragment shader.
         */
        function Shader(name, vertexSource, fragmentSource) {
            this._attributes = {};
            this._uniforms = {};
            this._name = name;
            var vertexShader = this.loadShader(vertexSource, BE.gl.VERTEX_SHADER);
            var fragmentShader = this.loadShader(fragmentSource, BE.gl.FRAGMENT_SHADER);
            this.createProgram(vertexShader, fragmentShader);
            this.detectAttributes();
            this.detectUniforms();
        }
        Object.defineProperty(Shader.prototype, "name", {
            /**
             * The name of the shader
             */
            get: function () {
                return this._name;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Use this shader.
         */
        Shader.prototype.use = function () {
            BE.gl.useProgram(this._program);
        };
        /**
         * Gets the location of an attribute with the provided name.
         * @param name The name of the attribute whose location to retrieve.
         */
        Shader.prototype.getAttributeLocation = function (name) {
            if (this._attributes[name] === undefined) {
                throw new Error("Unable to find attribute named '" + name + "' in shader named: '" + this.name + "'");
            }
            return this._attributes[name];
        };
        /**
         * Gets the location of a uniform with the provided name.
         * @param name The name of the attribute whose location to retrieve.
         */
        Shader.prototype.getUniformLocation = function (name) {
            if (this._uniforms[name] === undefined) {
                throw new Error("Unable to find uniform named '" + name + "' in shader named: '" + this.name + "'");
            }
            return this._uniforms[name];
        };
        Shader.prototype.loadShader = function (source, shaderType) {
            var shader = BE.gl.createShader(shaderType);
            BE.gl.shaderSource(shader, source);
            BE.gl.compileShader(shader);
            var error = BE.gl.getShaderInfoLog(shader);
            if (error !== "") {
                throw new Error("Error compiling shader: '" + this._name + "': " + error);
            }
            return shader;
        };
        Shader.prototype.createProgram = function (vertexShader, fragmentShader) {
            this._program = BE.gl.createProgram();
            BE.gl.attachShader(this._program, vertexShader);
            BE.gl.attachShader(this._program, fragmentShader);
            BE.gl.linkProgram(this._program);
            var error = BE.gl.getProgramInfoLog(this._program);
            if (error !== "") {
                throw new Error("Error linking shader: '" + this._name + "': " + error);
            }
        };
        Shader.prototype.detectAttributes = function () {
            var attributeCount = BE.gl.getProgramParameter(this._program, BE.gl.ACTIVE_ATTRIBUTES);
            for (var i = 0; i < attributeCount; i++) {
                var info = BE.gl.getActiveAttrib(this._program, i);
                if (!info) {
                    break;
                }
                this._attributes[info.name] = BE.gl.getAttribLocation(this._program, info.name);
            }
        };
        Shader.prototype.detectUniforms = function () {
            var uniformCount = BE.gl.getProgramParameter(this._program, BE.gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < uniformCount; i++) {
                var info = BE.gl.getActiveUniform(this._program, i);
                if (!info) {
                    break;
                }
                this._uniforms[info.name] = BE.gl.getUniformLocation(this._program, info.name);
            }
        };
        return Shader;
    }());
    BE.Shader = Shader;
})(BE || (BE = {}));
var BE;
(function (BE) {
    var Sprite = /** @class */ (function () {
        /**
         *
         * @param name
         * @param width
         * @param height
         */
        function Sprite(name, width, height) {
            if (width === void 0) { width = 10; }
            if (height === void 0) { height = 10; }
            this._name = name;
            this._width = width;
            this._height = height;
        }
        Sprite.prototype.load = function () {
            this._buffer = new BE.GLBuffer(3);
            var positionAttribute = new BE.AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            this._buffer.addAttributeLocation(positionAttribute);
            var vertices = [
                //  X,   Y,   Z
                0, 0, 0,
                0, 0.5, 0,
                0.5, 0.5, 0,
                0.5, 0.5, 0,
                0.5, 0.0, 0,
                0, 0, 0
            ];
            this._buffer.pushBackData(vertices);
            this._buffer.upload();
            this._buffer.unbind();
        };
        Sprite.prototype.update = function (time) {
        };
        Sprite.prototype.draw = function () {
            this._buffer.bind();
            this._buffer.draw();
        };
        return Sprite;
    }());
    BE.Sprite = Sprite;
})(BE || (BE = {}));
