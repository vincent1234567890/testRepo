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
            autoScaleDown: true,
            autoScaleUp: false,
        }, options);

        const sceneWidth = 1366;
        const sceneHeight = 768;

        let canvasScale = options.canvasScale;
        const handleRadius = options.handleRadius;
        const outerMargin = options.outerMargin;
        const innerMargin = options.innerMargin;

        if (options.autoScaleDown || options.autoScaleUp) {
            const parentNode = cubicCanvas.parentNode;
            if (parentNode) {
                const availableSpace = parentNode.clientWidth
                    - getCSSNumber(parentNode, 'marginLeft') - getCSSNumber(parentNode, 'marginRight')
                    - getCSSNumber(parentNode, 'paddingLeft') - getCSSNumber(parentNode, 'paddingRight');
                if (availableSpace > 0) {
                    const newCanvasScale = availableSpace / (sceneWidth + 2 * outerMargin + 2 * innerMargin);
                    if (options.autoScaleUp && newCanvasScale > canvasScale || options.autoScaleDown && newCanvasScale < canvasScale) {
                        canvasScale = newCanvasScale;
                    }
                }
            }
        }

        const canvasWidth = (sceneWidth + 2 * outerMargin + 2 * innerMargin) * canvasScale;
        const canvasHeight = (sceneHeight + 2 * outerMargin + 2 * innerMargin) * canvasScale;

        cubicCanvas.width = canvasWidth;
        cubicCanvas.height = canvasHeight;

        //console.log("cubicCanvas.width, canvasWidth:", cubicCanvas.width, canvasWidth);

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
            for (let i = 0; i < cubicPoints.length - 3; i += 3) {
                //cubicGraphics.bezierCurveTo(cubicPoints[i + 1].x, cubicPoints[i + 1].y,
                //    cubicPoints[i + 2].x, cubicPoints[i + 2].y,
                //    cubicPoints[i + 3].x, cubicPoints[i + 3].y);
                drawBezierCurve(
                    cubicGraphics,
                    cubicPoints[i    ].x, cubicPoints[i    ].y,
                    cubicPoints[i + 1].x, cubicPoints[i + 1].y,
                    cubicPoints[i + 2].x, cubicPoints[i + 2].y,
                    cubicPoints[i + 3].x, cubicPoints[i + 3].y
                );
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
                for (let i = 0; i < cubicPoints.length - 1; i++) {
                    if (i % 3 != 1) {
                        cubicGraphics.beginPath();
                        cubicGraphics.moveTo(cubicPoints[i].x + .5, cubicPoints[i].y + .5);
                        cubicGraphics.lineTo(cubicPoints[i + 1].x + .5, cubicPoints[i + 1].y + .5);
                        cubicGraphics.stroke();
                    }
                }
                for (let i = 0; i < cubicPoints.length; i++) {
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

        // Given one control point, will force the other control point to be opposite and identical to it (forces a smooth curve through path points)
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
            callCallback();
        }

        function callCallback () {
            if (options.callbackOnChange) {
                options.callbackOnChange(bezierCurveEditor.getPoints());
            }
        }

        function transformFromSceneToCanvas (sx, sy) {
            return new Point2D((outerMargin + innerMargin + sx) * canvasScale, canvasHeight - (outerMargin + innerMargin + sy) * canvasScale);
        }

        function transformFromCanvasToScene (cx, cy) {
            return new Point2D(cx / canvasScale - outerMargin - innerMargin, (canvasHeight - cy) / canvasScale - outerMargin - innerMargin);
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
            const clickedPointIndex = findClickedPoint(evt);
            if (clickedPointIndex >= 0) {
                draggingCubic = true;
                dragPointIndex = clickedPointIndex;
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
                // It is a path point.  Bring its control points with it
                if (dragPointIndex > 0) {
                    cubicPoints[dragPointIndex - 1].x += offsetX;
                    cubicPoints[dragPointIndex - 1].y += offsetY;
                }
                if (dragPointIndex < cubicPoints.length - 1) {
                    cubicPoints[dragPointIndex + 1].x += offsetX;
                    cubicPoints[dragPointIndex + 1].y += offsetY;
                }
            }
            else {
                // It is a control point.  Update the opposite control point if needed
                if (lockPairs) {
                    lockCounterpart(dragPointIndex);
                }
            }
            cubicDraw();
        }

        function doCubicDoubleClick (evt) {
            const clickedPointIndex = findClickedPoint(evt);
            if (clickedPointIndex > 0 && clickedPointIndex < cubicPoints.length - 1 && clickedPointIndex % 3 === 0) {
                cubicPoints.splice(clickedPointIndex - 1, 3);
                cubicDraw();
            } else {
                const positionOnPath = findPositionOnPath(evt);
                console.log("positionOnPath:", positionOnPath);
                if (positionOnPath) {
                    const i = positionOnPath.i;
                    const clickedPoint = positionOnPath.p;
                    const dirVector = positionOnPath.dirVector;

                    const leftDistance = distanceBetween(clickedPoint, cubicPoints[i]);
                    const rightDistance = distanceBetween(clickedPoint, cubicPoints[i + 3]);

                    cubicPoints.splice(i + 2, 0,
                        addVector(clickedPoint, multiplyVector(dirVector, -0.25 * leftDistance)),
                        clickedPoint,
                        addVector(clickedPoint, multiplyVector(dirVector, +0.25 * rightDistance))
                    );
                    doLock();
                    cubicDraw();
                }
            }
        }

        function findClickedPoint (evt) {
            const clickLocation = transformMouseEventToCanvas(evt);
            //console.log("clickLocation:", clickLocation);
            for (let i = cubicPoints.length - 1; i >= 0; i--) {
                const p = cubicPoints[i];
                if (Math.abs(p.x - clickLocation.x) <= handleRadius && Math.abs(p.y - clickLocation.y) <= handleRadius) {
                    return i;
                }
            }
            return -1;
        }

        function findPositionOnPath (evt) {
            const lineCollisionDistance = 4;
            const clickLocation = transformMouseEventToCanvas(evt);
            const p = {};
            for (let i = 0; i < cubicPoints.length - 3; i += 3) {
                const x0   = cubicPoints[i    ].x;
                const y0   = cubicPoints[i    ].y;
                const cp1x = cubicPoints[i + 1].x;
                const cp1y = cubicPoints[i + 1].y;
                const cp2x = cubicPoints[i + 2].x;
                const cp2y = cubicPoints[i + 2].y;
                const x1   = cubicPoints[i + 3].x;
                const y1   = cubicPoints[i + 3].y;
                for (let t = 0; t <= 1; t += 1/1000) {
                    getBezierPointAt(x0, y0, cp1x, cp1y, cp2x, cp2y, x1, y1, t, p);
                    if (Math.abs(p.x - clickLocation.x) <= lineCollisionDistance && Math.abs(p.y - clickLocation.y) <= lineCollisionDistance) {
                        // Calculate the direction at this point
                        const pAhead = getBezierPointAt(x0, y0, cp1x, cp1y, cp2x, cp2y, x1, y1, t + 0.0000001);
                        const dirVector = {x: pAhead.x - p.x, y: pAhead.y - p.y};

                        return {
                            i: i,
                            t: t,
                            p: p,
                            dirVector: normaliseVector(dirVector),
                        };
                    }
                }
            }
            return undefined;
        }

        function halfWayPoint (p1, p2) {
            return new Point2D((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
        }

        function magnitude (v) {
            return Math.sqrt(v.x * v.x + v.y * v.y);
        }

        function multiplyVector (v, scalar) {
            return {x: v.x * scalar, y: v.y * scalar};
        }

        function normaliseVector (v) {
            const mag = magnitude(v);
            return multiplyVector(v, 1 / mag);
        }

        function addVector (v1, v2) {
            return {x: v1.x + v2.x, y: v1.y + v2.y};
        }

        function distanceBetween (v1, v2) {
            return magnitude(addVector(v1, multiplyVector(v2, -1)));
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
        //doLock();
        cubicDraw();
        cubicCanvas.addEventListener("mousedown", doCubicMouseDown, false);
        cubicCanvas.addEventListener("mousemove", doCubicMouseMove, false);
        cubicCanvas.addEventListener("dblclick", doCubicDoubleClick, false);
        document.addEventListener("mouseup", doMouseUp, false);

        // Cleanup to avoid memory leaks
        const cleanupIntervalId = setInterval(checkCleanup, 2000);
        function checkCleanup () {
            if (!isInDocument(cubicCanvas)) {
                console.info(`Cleaning up event listeners`);
                cubicCanvas.removeEventListener("mousedown", doCubicMouseDown);
                cubicCanvas.removeEventListener("mousemove", doCubicMouseMove);
                document.removeEventListener("mouseup", doMouseUp);
                clearInterval(cleanupIntervalId);
            }
        }
        function isInDocument (node) {
            if (!node) {
                return false;
            }
            if (node.tagName === 'HTML') {
                return true;
            }
            return isInDocument(node.parentNode);
        }

        function drawBezierCurve (canvasContext, x0, y0, cp1x, cp1y, cp2x, cp2y, x1, y1) {
            canvasContext.moveTo(x0, y0);
            for (let t = 0; t <= 1; t += 1 / 32) {
                const p = getBezierPointAt(x0, y0, cp1x, cp1y, cp2x, cp2y, x1, y1, t);
                canvasContext.lineTo(p.x, p.y);
            }
        }

        function getBezierPointAt (x0, y0, cp1x, cp1y, cp2x, cp2y, x1, y1, t, p) {
            p = p || {};
            const at = 1 - t;
            p.x = at*at*at*x0 + 3*at*at*t*cp1x + 3*at*t*t*cp2x + t*t*t*x1;
            p.y = at*at*at*y0 + 3*at*at*t*cp1y + 3*at*t*t*cp2y + t*t*t*y1;
            return p;
        }

        const bezierCurveEditor = {
            getPoints: () => cubicPoints.map(point => transformFromCanvasToScene(point.x, point.y)),
        };
        return bezierCurveEditor;
    }

    function getCSSNumber (element, propertyName) {
        return parseFloat(getComputedStyle(element)[propertyName]);
    }

    return {
        createBezierCurveEditor: createBezierCurveEditor,
    };
}));