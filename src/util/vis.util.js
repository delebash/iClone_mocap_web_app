import WebSocketClient from "./websocket_client";

const websockettoRoom = 'pythonclient'

const fingerLookupIndices = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
};

let ctx

export default class VisUtil {

    static drawHandPoint(y, x, r, color, pointSize) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
    }

    static drawHandKeypoints(videoCanvasCtx, keypoints, color) {
        ctx = videoCanvasCtx
        let wholeHand = []

        const keypointsArray = keypoints;
        const fingers = Object.keys(fingerLookupIndices);
        let data = {}
        for (let i = 0; i < fingers.length; i++) {
            const finger = fingers[i];
            const points = fingerLookupIndices[finger].map(idx => keypoints[idx])
            data.points = points
            data.finger = finger
            wholeHand.push(data)
            this.drawHandPath(points, false, color);
        }

        WebSocketClient.sendData(JSON.stringify(wholeHand), websockettoRoom)

        for (let i = 0; i < keypointsArray.length; i++) {
            const y = keypointsArray[i][0];
            const x = keypointsArray[i][1];
            this.drawHandPoint(x - 2, y - 2, 3);
        }


    }

    static drawHandPath(points, closePath, color) {
        const region = new Path2D();
        region.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            region.lineTo(point[0], point[1]);
        }
        if (closePath) {
            region.closePath();
        }
        ctx.stroke(region);
    }

}
