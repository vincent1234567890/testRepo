// UMD (Universal Module Definition) returnExports.js
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    }
    else {
        root.eckBezier = factory();
    }
}(this, function () {
    "use strict";

    // Based on: http://math.hws.edu/eck/cs424/notes2013/canvas/bezier.html

    function Point2D (x, y) {
        this.x = x;
        this.y = y;
    }

    function createBezierCurveEditor (cubicCanvas, options) {
        const hideControls = false;
        const lockPairs = true;

        let cubicPoints;
        let cubicGraphics;

        options = Object.assign({
            // @consider Instead of canvasScale, it should be pointScale
            //           We simply scale the points on input, and un-scale them on output
            //           That way, handles and line thickness would stay constant at all scales
            canvasScale: 1.0,
            margin: 400,
            handleRadius: 5,
        }, options);

        const sceneWidth = 1366;
        const sceneHeight = 768;

        const canvasScale = options.canvasScale;
        const handleRadius = options.handleRadius;
        const margin = options.margin;

        const canvasWidth = (sceneWidth + 2 * margin) * canvasScale;
        const canvasHeight = (sceneHeight + 2 * margin) * canvasScale;

        cubicCanvas.width = canvasWidth;
        cubicCanvas.height = canvasHeight;

        console.log("cubicCanvas.width, canvasWidth:", cubicCanvas.width, canvasWidth);

        function cubicDraw () {
            cubicGraphics.fillStyle = "#aaaaaa";
            cubicGraphics.fillRect(0, 0, canvasWidth, canvasHeight);

            cubicGraphics.fillStyle = "#cccccc";
            const topLeftOuter = transformFromSceneToCanvas(-margin / 2, -margin / 2);
            const botRightOuter = transformFromSceneToCanvas(sceneWidth + margin / 2, sceneHeight + margin / 2);
            cubicGraphics.fillRect(topLeftOuter.x, topLeftOuter.y, botRightOuter.x - topLeftOuter.x, botRightOuter.y - topLeftOuter.y);

            cubicGraphics.fillStyle = "#eeeeee";
            const topLeft = transformFromSceneToCanvas(0, 0);
            const botRight = transformFromSceneToCanvas(sceneWidth, sceneHeight);
            cubicGraphics.fillRect(topLeft.x, topLeft.y, botRight.x - topLeft.x, botRight.y - topLeft.y);

            // Draw curve
            cubicGraphics.beginPath();
            cubicGraphics.moveTo(cubicPoints[0].x, cubicPoints[0].y);
            for (let i = 1; i < 10; i += 3) {
                cubicGraphics.bezierCurveTo(cubicPoints[i].x, cubicPoints[i].y,
                    cubicPoints[i + 1].x, cubicPoints[i + 1].y,
                    cubicPoints[i + 2].x, cubicPoints[i + 2].y);
            }
            cubicGraphics.lineWidth = 2;
            cubicGraphics.strokeStyle = "black";
            cubicGraphics.stroke();

            // Draw controls
            if (!hideControls) {
                cubicGraphics.lineWidth = 1;
                if (lockPairs) {
                    cubicGraphics.strokeStyle = "black";
                }
                else {
                    cubicGraphics.strokeStyle = "black";
                }
                for (let i = 0; i < 9; i++) {
                    if (i % 3 != 1) {
                        cubicGraphics.beginPath();
                        cubicGraphics.moveTo(cubicPoints[i].x + .5, cubicPoints[i].y + .5);
                        cubicGraphics.lineTo(cubicPoints[i + 1].x + .5, cubicPoints[i + 1].y + .5);
                        cubicGraphics.stroke();
                    }
                }
                for (let i = 0; i < 10; i++) {
                    const point = cubicPoints[i];
                    if (i % 3 == 0) {
                        const isStartOrEndPoint = (i === 0 || i === cubicPoints.length - 1);
                        const scenePoint = transformFromCanvasToScene(point.x, point.y);
                        console.log("scenePoint:", scenePoint);
                        const isOutsideArena = scenePoint.x < -margin / 2 || scenePoint.x > sceneWidth + margin / 2 || scenePoint.y < -margin / 2 || scenePoint.y > sceneHeight + margin / 2;
                        if (isStartOrEndPoint && !isOutsideArena) {
                            cubicGraphics.fillStyle = "#ff3333";
                        } else {
                            cubicGraphics.fillStyle = "green";
                        }
                        disk(cubicGraphics, cubicPoints[i].x, cubicPoints[i].y, handleRadius);
                    }
                    else {
                        cubicGraphics.fillStyle = "blue";
                        cubicGraphics.fillRect(cubicPoints[i].x - handleRadius, cubicPoints[i].y - handleRadius, 2 * handleRadius, 2 * handleRadius);
                    }
                }
            }
        }

        function disk (graphics, x, y, radius) {
            graphics.beginPath();
            graphics.arc(x, y, radius, 0, Math.PI * 2);
            graphics.fill();
        }

        function doLock () {
            if (lockPairs) {
                cubicPoints[4].x = 2 * cubicPoints[3].x - cubicPoints[2].x;
                cubicPoints[4].y = 2 * cubicPoints[3].y - cubicPoints[2].y;
                cubicPoints[7].x = 2 * cubicPoints[6].x - cubicPoints[5].x;
                cubicPoints[7].y = 2 * cubicPoints[6].y - cubicPoints[5].y;
            }
            cubicDraw();
        }


        let draggingCubic = false;
        let dragPointIndex;

        function doMouseUp (evt) {
            draggingCubic = false;
        }

        function transformFromSceneToCanvas (sx, sy) {
            return new Point2D((margin + sx) * canvasScale, (margin + sy) * canvasScale);
        }

        function transformFromCanvasToScene (cx, cy) {
            return new Point2D(cx / canvasScale - margin, cy / canvasScale - margin);
        }

        //function transformCanvasPointToScene (cx, cy) {
        //    return new Point2D(cx / marginScaleX / options.canvasScale - margin, cy / marginScaleY / options.canvasScale - margin);
        //}

        //function transformMouseEventToScene (evt) {
        //    const r = cubicCanvas.getBoundingClientRect();
        //    return transformCanvasPointToScene(evt.clientX - r.left, evt.clientY - r.top);
        //}

        function transformMouseEventToCanvas (evt) {
            const r = cubicCanvas.getBoundingClientRect();
            return new Point2D(evt.clientX - r.left, evt.clientY - r.top);
        }

        function doCubicMouseDown (evt) {
            if (draggingCubic || hideControls) {
                return;
            }
            const clickPoint = transformMouseEventToCanvas(evt);
            console.log("clickPoint:", clickPoint);
            for (let i = 9; i >= 0; i--) {
                const p = cubicPoints[i];
                if (Math.abs(p.x - clickPoint.x) <= handleRadius && Math.abs(p.y - clickPoint.y) <= handleRadius) {
                    draggingCubic = true;
                    dragPointIndex = i;
                    return;
                }
            }
        }

        function doCubicMouseMove (evt) {
            if (!draggingCubic) {
                return;
            }
            const clickPoint = transformMouseEventToCanvas(evt);
            let offsetX = clickPoint.x - cubicPoints[dragPointIndex].x;
            let offsetY = clickPoint.y - cubicPoints[dragPointIndex].y;
            cubicPoints[dragPointIndex].x = clickPoint.x;
            cubicPoints[dragPointIndex].y = clickPoint.y;
            if (dragPointIndex % 3 == 0) {
                if (dragPointIndex > 0) {
                    cubicPoints[dragPointIndex - 1].x += offsetX;
                    cubicPoints[dragPointIndex - 1].y += offsetY;
                }
                if (dragPointIndex < 9) {
                    cubicPoints[dragPointIndex + 1].x += offsetX;
                    cubicPoints[dragPointIndex + 1].y += offsetY;
                }
            }
            else if (lockPairs) {
                if (dragPointIndex == 2) {
                    cubicPoints[4].x = 2 * cubicPoints[3].x - cubicPoints[2].x;
                    cubicPoints[4].y = 2 * cubicPoints[3].y - cubicPoints[2].y;
                }
                else if (dragPointIndex == 4) {
                    cubicPoints[2].x = 2 * cubicPoints[3].x - cubicPoints[4].x;
                    cubicPoints[2].y = 2 * cubicPoints[3].y - cubicPoints[4].y;
                }
                else if (dragPointIndex == 5) {
                    cubicPoints[7].x = 2 * cubicPoints[6].x - cubicPoints[5].x;
                    cubicPoints[7].y = 2 * cubicPoints[6].y - cubicPoints[5].y;
                }
                else if (dragPointIndex == 7) {
                    cubicPoints[5].x = 2 * cubicPoints[6].x - cubicPoints[7].x;
                    cubicPoints[5].y = 2 * cubicPoints[6].y - cubicPoints[7].y;
                }
            }
            cubicDraw();
        }

        // Init
        try {
            cubicGraphics = cubicCanvas.getContext("2d");
        }
        catch (e) {
            console.warn("Oops... Sorry, your browser doesn't support the canvas element.", e);
            return;
        }
        //lockSelect = document.getElementById("lock");
        //lockSelect.checked = false;
        //lockSelect.onclick = doLock;
        //cubicHideSelect = document.getElementById("cubicHide");
        //cubicHideSelect.checked = false;
        //cubicHideSelect.onclick = function () {
        //    cubicDraw();
        //};
        cubicPoints = options.initialPoints || [
            new Point2D(50, 350), new Point2D(150, 450),
            new Point2D(150, 100), new Point2D(200, 100), new Point2D(250, 100),
            new Point2D(325, 300), new Point2D(325, 400), new Point2D(425, 400),
            new Point2D(475, 100), new Point2D(550, 175)
        ].map(
            point => new Point2D(
                point.x * sceneWidth / 700,
                point.y * sceneHeight/ 500
            )
        );
        // Within this object, we actually manipulate the points in canvas space
        cubicPoints = cubicPoints.map(point => transformFromSceneToCanvas(point.x, point.y));
        cubicDraw();
        document.addEventListener("mouseup", doMouseUp, false);
        cubicCanvas.addEventListener("mousedown", doCubicMouseDown, false);
        cubicCanvas.addEventListener("mousemove", doCubicMouseMove, false);

        // Cleanup to avoid memory leaks
        const cleanupIntervalId = setInterval(checkCleanup, 2000);
        function checkCleanup () {
            if (!cubicCanvas.parentNode) {
                console.info(`Cleaning up event listeners`);
                document.removeEventListener("mouseup", doMouseUp);
                clearInterval(cleanupIntervalId);
            }
        }

        return {
            getPoints: () => cubicPoints.map(point => transformFromCanvasToScene(point.x, point.y)),
        };
    }

    return {
        createBezierCurveEditor: createBezierCurveEditor,
    };
}));