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
            outerMargin: 50,
            innerMargin: 200,
            handleRadius: 5,
        }, options);

        const sceneWidth = 1366;
        const sceneHeight = 768;

        const canvasScale = options.canvasScale;
        const handleRadius = options.handleRadius;
        const outerMargin = options.outerMargin;
        const innerMargin = options.innerMargin;

        const canvasWidth = (sceneWidth + 2 * outerMargin + 2 * innerMargin) * canvasScale;
        const canvasHeight = (sceneHeight + 2 * outerMargin + 2 * innerMargin) * canvasScale;

        cubicCanvas.width = canvasWidth;
        cubicCanvas.height = canvasHeight;

        console.log("cubicCanvas.width, canvasWidth:", cubicCanvas.width, canvasWidth);

        function cubicDraw () {
            cubicGraphics.fillStyle = "#aaaaaa";
            cubicGraphics.fillRect(0, 0, canvasWidth, canvasHeight);

            cubicGraphics.fillStyle = "#cccccc";
            const topLeftOuter = transformFromSceneToCanvas(-innerMargin, -innerMargin);
            const botRightOuter = transformFromSceneToCanvas(sceneWidth + innerMargin, sceneHeight + innerMargin);
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
                        //console.log("scenePoint:", scenePoint);
                        const isOutsideArena = scenePoint.x < -innerMargin || scenePoint.x > sceneWidth + innerMargin || scenePoint.y < -innerMargin || scenePoint.y > sceneHeight + innerMargin;
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
                for (let i = 0; i < cubicPoints.length; i++) {
                    lockCounterpart(i);
                }
            }
            cubicDraw();
        }

        function lockCounterpart (i) {
            if (i >= 2 && i <= cubicPoints.length - 3) {
                if ((i - 2) % 3 === 0) {
                    cubicPoints[i + 2].x = 2 * cubicPoints[i + 1].x - cubicPoints[i].x;
                    cubicPoints[i + 2].y = 2 * cubicPoints[i + 1].y - cubicPoints[i].y;
                }
                else if ((i - 2) % 3 === 2) {
                    cubicPoints[i - 2].x = 2 * cubicPoints[i - 1].x - cubicPoints[i].x;
                    cubicPoints[i - 2].y = 2 * cubicPoints[i - 1].y - cubicPoints[i].y;
                }
            }
        }

        let draggingCubic = false;
        let dragPointIndex;

        function doMouseUp (evt) {
            draggingCubic = false;
        }

        function transformFromSceneToCanvas (sx, sy) {
            return new Point2D((outerMargin + innerMargin + sx) * canvasScale, (outerMargin + innerMargin + sy) * canvasScale);
        }

        function transformFromCanvasToScene (cx, cy) {
            return new Point2D(cx / canvasScale - outerMargin - innerMargin, cy / canvasScale - outerMargin - innerMargin);
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
                lockCounterpart(dragPointIndex);
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
            new Point2D(-225, 550), new Point2D(185, 835),
            new Point2D(230, 430), new Point2D(465, 430), new Point2D(700, 430),
            new Point2D(840, 870), new Point2D(1070, 610), new Point2D(1295, 350),
            new Point2D(545, 285), new Point2D(700, -225)
        ];
        // Within this object, we actually manipulate the points in canvas space
        cubicPoints = cubicPoints.map(point => transformFromSceneToCanvas(point.x, point.y));
        doLock();
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