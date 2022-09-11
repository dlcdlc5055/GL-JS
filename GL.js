const IDLib = "sdkagvjlsdihjkldfshdsfhdsdfhbdfghfdgkmrnsdjgbdjhbsgfkhj"
const collisionPrecition = 2

function generatePointsRect(x, y, sizeX, sizeY, precision) {
    let arr = []
    for (let i = 0; i <= (sizeX / precision); i++) {
        for (let j = 0; j <= (sizeY / precision); j++) {
            arr.push({
                x: x + (i * precision),
                y: y + (j * precision)
            })
        }
    }
    return arr
}

class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y
        this.radius = radius;
        this.type = "circle";
    }
    difference(v1, v2) {
        if (isNaN(v1) || isNaN(v2))
            throw "Invalid Function Parameter"
        if (v1 > v2)
            return v1 - v2
        if (v1 < v2)
            return v2 - v1
        else
            return 0
    }
    distance(x1, y1, x2, y2) {
        if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
            throw "Invalid Function Parameter"
        }
        return Math.sqrt(Math.pow(this.difference(x1, x2), 2) + Math.pow(this.difference(y1, y2), 2))
    }
    test(item) {
        let precision = collisionPrecition
        switch (item.type) {
            case "circle":
                return this.distance(this.x, this.y, item.x, item.y) < (item.radius + this.radius)
            case "rect":
                let points = generatePointsRect(item.x, item.y, item.sizeX, item.sizeY, precision)
                for (let it of points)
                    if (this.distance(this.x, this.y, it.x, it.y) < this.radius)
                        return true
                return false
            case "roundedRect":
                return item.test(this)
            default:
                throw "Invalid Function Parameter"
        }
    }
    draw(GL, color) {
        if (GL.id != IDLib || typeof color != 'string')
            throw "Invalid Function Parameter"
        GL.draw.circle(this.x, this.y, this.radius, color)
    }
}

class Rect {
    constructor(x, y, sizeX, sizeY) {
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.type = "rect";
    }
    difference(v1, v2) {
        if (isNaN(v1) || isNaN(v2))
            throw "Invalid Function Parameter"
        if (v1 > v2)
            return v1 - v2
        if (v1 < v2)
            return v2 - v1
        else
            return 0
    }
    distance(x1, y1, x2, y2) {
        if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2))
            throw "Invalid Function Parameter"
        return Math.sqrt(Math.pow(this.difference(x1, x2), 2) + Math.pow(this.difference(y1, y2), 2))
    }
    test(item) {
        let precision = collisionPrecition
        switch (item.type) {
            case "circle":
                let points = generatePointsRect(this.x, this.y, this.sizeX, this.sizeY, precision)
                for (let it of points)
                    if (this.distance(it.x, it.y, item.x, item.y) < item.radius)
                        return true
                return false
            case "rect":
                let points1 = generatePointsRect(this.x, this.y, this.sizeX, this.sizeY, precision)
                let points2 = generatePointsRect(item.x, item.y, item.sizeX, item.sizeY, precision)
                for (let it of points2)
                    if (it.x > this.x && it.y > this.y && it.x < this.x + this.sizeX && it.y < this.y + this.sizeY)
                        return true
                for (let it of points1)
                    if (it.x > item.x && it.y > item.y && it.x < item.x + item.sizeX && it.y < item.y + item.sizeY)
                        return true
                return false
            case "roundedRect":
                return item.test(this)
            default:
                throw "Invalid Function Parameter"
        }
    }
    draw(GL, color) {
        if (GL.id != IDLib || typeof color != 'string')
            throw "Invalid Function Parameter"
        GL.draw.rect(this.x, this.y, this.sizeX, this.sizeY, color)
    }
}

class RoundRect {
    constructor(x, y, sizeX, sizeY, radius) {
        this.x = x;
        this.y = y
        this.radius = radius;
        this.sizeX = sizeX
        this.sizeY = sizeY
        this.type = "roundedRect";
    }
    difference(v1, v2) {
        if (isNaN(v1) || isNaN(v2))
            throw "Invalid Function Parameter"
        if (v1 > v2)
            return v1 - v2
        if (v1 < v2)
            return v2 - v1
        else
            return 0
    }
    distance(x1, y1, x2, y2) {
        if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2))
            throw "Invalid Function Parameter"
        return Math.sqrt(Math.pow(this.difference(x1, x2), 2) + Math.pow(this.difference(y1, y2), 2))
    }
    draw(GL, color) {
        if (GL.id != IDLib || typeof color != 'string')
            throw "Invalid Function Parameter"
        let items = this.getColisionItems()
        for (let it of items)
            it.draw(GL, color)
    }
    getColisionItems() {
        let arr = []
        let r = this.radius
        if (this.sizeX < this.sizeY && r > this.sizeX / 2)
            r = this.sizeX / 2
        else if (this.sizeX > this.sizeY && r > this.sizeY / 2)
            r = this.sizeY / 2
        else if (this.sizeX == this.sizeY && r > this.sizeY / 2)
            r = this.sizeX / 2
        arr.push(new Circle(this.x + r, this.y + r, r))
        arr.push(new Circle(this.x + this.sizeX - r, this.y + r, r))
        arr.push(new Circle(this.x + this.sizeX - r, this.y - r + this.sizeY, r))
        arr.push(new Circle(this.x + r, this.y - r + this.sizeY, r))
        arr.push(new Rect(this.x + r, this.y, this.sizeX - (2 * r), this.sizeY))
        arr.push(new Rect(this.x, this.y + r, this.sizeX, this.sizeY - (2 * r)))
        return arr
    }
    test(item) {
        let ThisItems = this.getColisionItems()
        switch (item.type) {
            case "circle":
                for (let it of ThisItems)
                    if (it.test(item))
                        return true
                return false
            case "rect":
                for (let it of ThisItems)
                    if (it.test(item))
                        return true
                return false
            case "roundedRect":
                let OutsideItems = item.getColisionItems()
                for (let i of ThisItems)
                    for (let j of OutsideItems)
                        if (i.test(j) || j.test(i))
                            return true
                return false
        }
    }
}

class Lib {
    id = IDLib
    constructor() {
        this.canvasSizeOverride = false;
        this.canvasSize = {
            x: 0,
            y: 0
        }
        this.body = document.getElementsByTagName("body")[0]
        this.performance = 0
        this.frametime = 0
        this.FPS = 0
        this.frameCounter = 0
        this.getMouseButtonRelesed(this.mouse.BUTTON_LEFT)
        this.getMouseButtonPressed(this.mouse.BUTTON_LEFT)
        this.getMouseButtonUp(this.mouse.BUTTON_LEFT)
        this.getMouseButtonDown(this.mouse.BUTTON_LEFT)
    }
    random = {
        int(min, max) {
            if (isNaN(min) || isNaN(max))
                throw "Invalid Function Parameter"
            if (min > max)
                return Math.round(max + (Math.random() * (min - max)))
            return Math.round(min + (Math.random() * (max - min)))
        },
        letter(uppercase = false) {
            if ((typeof uppercase != 'boolean'))
                throw "Invalid Function Parameter"
            const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
            let letter = alphabet[this.int(0, alphabet.length - 1)]
            if (uppercase)
                return letter.toUpperCase()
            return letter
        },
        bool(probability = .5) {
            if (isNaN(probability) || probability <= 0 || probability >= 1)
                throw "Invalid Function Parameter"
            return Math.random() > probability
        },
        float(min, max) {
            if (isNaN(min) || isNaN(max))
                throw "Invalid Function Parameter"
            if (min > max)
                return max + (Math.random() * (min - max))
            return min + (Math.random() * (max - min))
        }
    }
    keys = {
        KEY_A: 0,
        KEY_B: 1,
        KEY_C: 2,
        KEY_D: 3,
        KEY_E: 4,
        KEY_F: 5,
        KEY_G: 6,
        KEY_H: 7,
        KEY_I: 8,
        KEY_J: 9,
        KEY_K: 10,
        KEY_L: 11,
        KEY_M: 12,
        KEY_N: 13,
        KEY_O: 14,
        KEY_P: 15,
        KEY_Q: 16,
        KEY_R: 17,
        KEY_S: 18,
        KEY_T: 19,
        KEY_U: 20,
        KEY_V: 21,
        KEY_W: 22,
        KEY_X: 23,
        KEY_Y: 24,
        KEY_Z: 25,
        KEY_ENTER: 26,
        KEY_TAB: 27,
        KEY_CTRL: 28,
        KEY_UP: 29,
        KEY_DOWN: 30,
        KEY_LEFT: 31,
        KEY_RIGHT: 32,
        KEY_SPACE: 33,
        KEY_0: 34,
        KEY_1: 35,
        KEY_2: 36,
        KEY_3: 37,
        KEY_4: 38,
        KEY_5: 39,
        KEY_6: 40,
        KEY_7: 41,
        KEY_8: 42,
        KEY_9: 43,
        KEY_ESCAPE: 44,
        KEY_BACKSPACE: 45,
        KEY_ALT: 46,
        KEY_SHIFT: 47,
    }
    mouse = {
        reg: [{
            x: -500,
            y: -500,
        }, false, false, false, false],
        reg_p: [1, 1, 1],
        reg_r: [2, 2, 2],

        BUTTON_LEFT: 1,
        BUTTON_RIGHT: 2,
        BUTTON_MIDDLE: 4,
    }
    getMousePosition() {
        return this.mouse.reg[0]
    }
    getIfClick() {
        return this.mouse.reg[3]
    }
    getMouseButtonPressed(btn) {
        if (isNaN(btn))
            throw "Invalid Function Parameter"
        switch (btn) {
            case this.mouse.BUTTON_LEFT:
                return this.mouse.reg_p[this.mouse.BUTTON_LEFT - 1] == 0
            case this.mouse.BUTTON_RIGHT:
                return this.mouse.reg_p[this.mouse.BUTTON_RIGHT - 1] == 0
            case this.mouse.BUTTON_MIDDLE:
                return this.mouse.reg_p[this.mouse.BUTTON_MIDDLE - 1] == 0
            default:
                throw "Invalid Function Parameter"
        }
    }
    getMouseButtonRelesed(btn) {
        if (isNaN(btn))
            throw "Invalid Function Parameter"
        switch (btn) {
            case this.mouse.BUTTON_LEFT:
                return this.mouse.reg_r[this.mouse.BUTTON_LEFT - 1] == 0
            case this.mouse.BUTTON_RIGHT:
                return this.mouse.reg_r[this.mouse.BUTTON_RIGHT - 1] == 0
            case this.mouse.BUTTON_MIDDLE:
                return this.mouse.reg_r[this.mouse.BUTTON_MIDDLE - 1] == 0
            default:
                throw "Invalid Function Parameter"
        }
    }
    getMouseButtonDown(btn) {
        if (isNaN(btn))
            throw "Invalid Function Parameter"
        switch (btn) {
            case this.mouse.BUTTON_LEFT:
                return this.mouse.reg[this.mouse.BUTTON_LEFT]
            case this.mouse.BUTTON_RIGHT:
                return this.mouse.reg[this.mouse.BUTTON_RIGHT]
            case this.mouse.BUTTON_MIDDLE:
                return this.reg[this.mouse.BUTTON_MIDDLE]
            default:
                throw "Invalid Function Parameter"
        }
    }
    getMouseButtonUp(btn) {
        if (isNaN(btn))
            throw "Invalid Function Parameter"
        switch (btn) {
            case this.mouse.BUTTON_LEFT:
                return !this.mouse.reg[this.mouse.BUTTON_LEFT]
            case this.mouse.BUTTON_RIGHT:
                return !this.mouse.reg[this.mouse.BUTTON_RIGHT]
            case this.mouse.BUTTON_MIDDLE:
                return !this.mouse.reg[this.mouse.BUTTON_MIDDLE]
            default:
                throw "Invalid Function Parameter"
        }
    }
    input = {
        reg: [],
        reg_p: [],
        reg_r: [],
    }
    getKeyPressed(key) {
        if (isNaN(key) || key > 47 || key < 0)
            throw "Invalid Function Parameter"
        return this.input.reg_p[key] == 0
    }
    getKeyReleased(key) {
        if (isNaN(key) || key > 47 || key < 0)
            throw "Invalid Function Parameter"
        return this.input.reg_r[key] == 0
    }
    getKeyDown(key) {
        if (isNaN(key) || key > 47 || key < 0)
            throw "Invalid Function Parameter"
        return this.input.reg[key]
    }
    getKeyUp(key) {
        if (isNaN(key) || key > 47 || key < 0)
            throw "Invalid Function Parameter"
        return !this.input.reg[key]
    }
    collision = {
        getCircle(x, y, radius) {
            if (isNaN(x) || isNaN(y) || isNaN(radius))
                throw "Invalid Function Parameter"
            return new Circle(x, y, radius)
        },
        getRect(x, y, sizeX, sizeY, radius = 0) {
            if (isNaN(x) || isNaN(y) || isNaN(sizeX) || isNaN(sizeY) || isNaN(radius) || radius < 0)
                throw "Invalid Function Parameter"
            if (radius > 0)
                return new RoundRect(x, y, sizeX, sizeY, radius)
            return new Rect(x, y, sizeX, sizeY)
        },
    }
    getFrameTime() {
        return this.frametime
    }
    getFPS() {
        return this.FPS
    }
    aox = {
        copyObject(obj){
            return JSON.parse(JSON.stringify(obj))
        },
        getCanvasSize() {
            if (this.canvasSizeOverride)
                return this.canvasSize
            return {
                x: window.innerWidth,
                y: window.innerHeight
            }
        },
        getWindowSize() {
            return {
                x: window.innerWidth,
                y: window.innerHeight
            }
        },
        isStrEmpty(str) {
            return (!str || /^\s*$/.test(str));
        },
        getColor(r, g, b, a = 255) {
            if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
                throw "Invalid Function Parameter"
            if (r < 0)
                r = 0
            if (g < 0)
                g = 0
            if (b < 0)
                b = 0
            if (a < 0)
                a = 0
            if (r > 255)
                r = 255
            if (g > 255)
                g = 255
            if (b > 255)
                b = 255
            if (a > 255)
                a = 255
            let rStr = Math.round(r).toString(16)
            let gStr = Math.round(g).toString(16)
            let bStr = Math.round(b).toString(16)
            let aStr = Math.round(a).toString(16)
            if (aStr.length == 1)
                aStr = "0" + aStr
            if (rStr.length == 1)
                rStr = "0" + rStr
            if (gStr.length == 1)
                gStr = "0" + gStr
            if (bStr.length == 1)
                bStr = "0" + bStr
            return `#${rStr+gStr+bStr+aStr}`
        },
        getTextureSize(texture) {
            return {
                x: texture.naturalWidth,
                y: texture.naturalHeight,
            }
        },
        getVect(x, y) {
            return {
                x: x,
                y: y
            }
        },
        difference(v1, v2) {
            if (isNaN(v1) || isNaN(v2))
                throw "Invalid Function Parameter"
            if (v1 > v2)
                return v1 - v2
            if (v1 < v2)
                return v2 - v1
            else
                return 0
        },
        distance(x1, y1, x2, y2) {
            if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2))
                throw "Invalid Function Parameter"
            return Math.sqrt(Math.pow(this.difference(x1, x2), 2) + Math.pow(this.difference(y1, y2), 2))
        },
        moveAtAngle(x, y, angle, distance) {
            if (isNaN(x) || isNaN(y) || isNaN(distance) || isNaN(angle))
                throw "Invalid Function Parameter"
            let offsetX = Math.sin(angle) * distance
            let offsetY = Math.cos(angle) * distance
            return {
                x: x + offsetX,
                y: y + offsetY
            }
        },
        degreesToRadians(degrees) {
            if (isNaN(degrees))
                throw "Invalid Function Parameter"
            return degrees * (Math.PI / 180);
        },
    }
    draw = {
        rect(x, y, sizeX, sizeY, color, radius = 0, angle = 0, alignCenter = false) {
            if (isNaN(x) || isNaN(y) || isNaN(radius) || isNaN(sizeX) || isNaN(angle) || isNaN(sizeY) || radius < 0 || typeof color != 'string' || (typeof alignCenter != 'boolean'))
                throw "Invalid Function Parameter"
            this.ctx.fillStyle = color
            let d = angle * (Math.PI / 180)
            let buffer_x = 0
            let buffer_y = 0
            this.ctx.translate(x, y)
            this.ctx.rotate(d)
            if (alignCenter) {
                buffer_x -= sizeX / 2
                buffer_y -= sizeY / 2
            }
            if (radius != 0) {
                let r = radius
                if (sizeX < sizeY && r > sizeX / 2)
                    r = sizeX / 2
                else if (sizeX > sizeY && r > sizeY / 2)
                    r = sizeY / 2
                else if (sizeX == sizeY && r > sizeY / 2)
                    r = sizeX / 2
                this.ctx.fillRect(buffer_x + r, buffer_y, sizeX - (2 * r), sizeY)
                this.ctx.fillRect(buffer_x, buffer_y + r, sizeX, sizeY - (2 * r))
                this.circle(buffer_x + r, buffer_y + r, r, color)
                this.circle(buffer_x - r + sizeX, buffer_y + r, r, color)
                this.circle(buffer_x - r + sizeX, buffer_y - r + sizeY, r, color)
                this.circle(buffer_x + r, buffer_y - r + sizeY, r, color)
                this.ctx.rotate(-d)
                this.ctx.translate(-x, -y)
                return
            }
            this.ctx.fillRect(buffer_x, buffer_y, sizeX, sizeY)
            this.ctx.rotate(-d)
            this.ctx.translate(-x, -y)
        },
        circle(x, y, radius, color) {
            if (isNaN(x) || isNaN(y) || isNaN(radius) || typeof color != 'string')
                throw "Invalid Function Parameter"
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
            this.ctx.fill();
        },
        fillScreen(color) {
            if (typeof color != 'string')
                throw "Invalid Function Parameter"
            this.ctx.fillStyle = color
            this.ctx.fillRect(0, 0, 1000000, 1000000)
        },
        text(str, x, y, size, color, font = "Arial", angle = 0) {
            if (isNaN(x) || isNaN(y) || isNaN(angle) || isNaN(size) || typeof color != 'string' || typeof str != 'string' || typeof font != 'string')
                throw "Invalid Function Parameter"
            let d = angle * (Math.PI / 180)
            this.ctx.translate(x, y)
            this.ctx.rotate(d)
            this.ctx.fillStyle = color
            this.ctx.font = `normal ${size}px ${font},Arial`
            this.ctx.textAlign = "start"
            this.ctx.textBaseline = "alphabetic"
            this.ctx.direction = "ltr"
            this.ctx.fillText(str, 0, 0, undefined)
            this.ctx.rotate(-d)
            this.ctx.translate(-x, -y)
        },
        texture(texture, x, y, sizeX = 0, sizeY = 0, angle = 0, alignCenter = false) {
            if (isNaN(x) || isNaN(y) || isNaN(sizeX) || isNaN(sizeY) || isNaN(angle) || (sizeX > 0 && sizeY == 0) || (sizeY > 0 && sizeX == 0) || (typeof alignCenter != 'boolean'))
                throw "Invalid Function Parameter"
            let imageSize = {
                x: texture.naturalWidth,
                y: texture.naturalHeight,
            }
            let d = angle * (Math.PI / 180)
            this.ctx.translate(x, y)
            this.ctx.rotate(d)
            let height = sizeY > 0 ? sizeY : imageSize.y;
            let width = sizeX > 0 ? sizeX : imageSize.x;
            if (sizeX == 0 && sizeY == 0) {
                if (alignCenter)
                    this.ctx.drawImage(texture, -width / 2, -height / 2)
                else
                    this.ctx.drawImage(texture, 0, 0)
            } else if (sizeX > 0 && sizeY > 0) {
                if (alignCenter)
                    this.ctx.drawImage(texture, -width / 2, -height / 2, width, height)
                else
                    this.ctx.drawImage(texture, 0, 0, width, height)
            }
            this.ctx.rotate(-d)
            this.ctx.translate(-x, -y)
        },
        tile() {
            //todo
        },
        line(x1, y1, x2, y2, width, color, style = 0) {
            if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2) || isNaN(style) || style > 2 || style < 0 || typeof color != 'string')
                throw "Invalid Function Parameter"
            let styles = ["square", "round"]
            this.ctx.lineCap = styles[style]
            this.ctx.lineWidth = width
            this.ctx.strokeStyle = color
            this.ctx.beginPath()
            this.ctx.moveTo(x1, y1)
            this.ctx.lineTo(x2, y2)
            this.ctx.stroke();
            this.ctx.lineCap = styles[0]
        },
        AUTO: 0,
        LINE_ROUNDED: 1,
        LINE_SQUARE: 0,
    }
    fonts = {
        ARIAL: "Arial",
        TIMES_NEW_ROMAN: "Times New Roman",
        SANS_SERIF: "sans-serif",
        LUCIDA_CONSOLE: "Lucida Console",
        MONOSPACE: "monospace",
        COURIER_NEW: "Courier New",
        HELVETICA: "Helvetica",
        TIMES: "Times",
        SERIF: "serif",
    }
    colors = {
        WHITE: "white",
        GREEN: "green",
        BLUE: "blue",
        RED: "red",
        BLACK: "black",
        PURPLE: "purple",
        LIME: "lime",
        GRAY: "gray",
        YELLOW: "yellow",
        SKYBLUE: "skyblue",
        BROWN: "brown",
        CORAL: "coral",
        DARKGREEN: "darkgreen",
        DARKBLUE: "darkblue",
        GOLD: "gold",
        LIMEGREEN: "limegreen",
        OLIVE: "olive",
        PINK: "pink",
        SEAGREEN: "seagreen",
        SLATEBLUE: "slateblue",
        ROYALBLUE: "royalblue",
        SNOW: "snow",
        TOMATO: "tomato",
        TEAL: "teal",
        PALEGREEN: "palegreen",
        NAVY: "navy",
        CYAN: "cyan",
        GREENYELLOW: "greenyellow",
        FIREBRICK: "firebrick",
        DEEPPINK: "deeppink",
        DARKCYAN: "darkcyan",
        CRIMSON: "crimson",
        CHOCOLATE: "chocolate",
        BEIGE: "beige",
        DARKOLIVEGREEN: "darkolivegreen",
        DARKMAGENT: "darkmagenta",
        MAGENTA: "magenta",
        LINEN: "linen",
        ORANGE: "orange",
        DARKRED: "darkred",
        DARKSLATEBLUE: "darkslateblue",
        DARKSLATEGRAY: "darkslategray",
        DARKVIOLET: "darkviolet",
        FORESTGREEN: "forestgreen",
        GOLDENROD: "goldenrod",
        INDIGO: "indigo",
        VIOLET: "violet",
        LAWNGREEN: "lawngreen",
        DARKGRAY: "darkgray",
        LIGHTGRAY: "lightgray",
        LIGHTGREEN: "lightgreen",
        LIGHTPINK: "lightpink",
        LIGHTSKYBLUE: "lightskyblue",
        SEAGREEN: "seagreen",
        LIGHTSEAGREEN: "lightseagreen",
        LIGHTSTATEGRAY: "lightstategray",
        LIGHTYELLOW: "lightyellow",
        MIDNIGHTBLUE: "midnightblue",
        OLIVEDRAB: "olivedrab",
        ORANGERED: "orangered",
        PALEGREEN: "palegreen",
        PEACHPUFF: "peachpuff",
        ROSYBROWN: "rosybrown",
        STEALBLUE: "stealblue",
        TAN: "tan",
        SALMON: "salmon",
        LIGHTSALMON: "lightsalmon",
        PERU: "peru",
        MEDIUMSLATEBLUE: "mediumslateblue",
        MEDIUMVIOLETRED: "mediumvioletred",
        MEDIUMSEAGREEN: "mediumseagreen",
        MEDIUMSPRINGGREEN: "mediumspringgreen",
        MEDIUMBLUE: "mediumblue",
        MEDIUMAQUAMARINE: "mediumaquamarine",
        TURQUOISE: "turquoise",
        MEDIUMTURQUISE: "mediumturquoise",
        MISTYROSE: "mistyrose",
        NAVAJOWHITE: "navajowhite"
    }

    canvasResize(w = 0, h = 0) {
        if (isNaN(w) || isNaN(h))
            throw "Invalid Function Parameter"
        if (w !== 0 && h !== 0) {
            this.canvasSizeOverride = true
            this.canvas.width = w
            this.canvas.height = h
            this.canvasSize = {
                x: w,
                y: h
            }
        }
        if (!this.canvasSizeOverride) {
            this.canvas.width = window.innerWidth
            this.canvas.height = window.innerHeight
            this.canvasSize = {
                x: window.innerWidth,
                y: window.innerHeight
            }
        }
    }
    setCanvasSizeToScreenSize() {
        this.canvasSizeOverride = false
        this.canvas.width = w
        this.canvas.height = h
        this.canvasSize = {
            x: window.innerWidth,
            y: window.innerHeight
        }
    }
    setBackground(color) {
        document.getElementsByTagName("body")[0].style.backgroundColor = color
    }
    initApp(obj, fps = 60, w = 0, h = 0, background = "white") {
        if (typeof background != 'string')
            throw "Invalid Function Parameter"
        this.setBackground(background)
        const centerCanvas = () => {
            const screenW = window.innerWidth
            const screenH = window.innerHeight
            const canvasW = parseInt(this.canvas.style.width.slice(0, -2))
            const canvasH = parseInt(this.canvas.style.height.slice(0, -2))
            let x = 0
            let y = 0
            if (screenH > canvasH)
                y = (screenH - canvasH) / 2
            if (screenW > canvasW)
                x = (screenW - canvasW) / 2
            this.canvas.style.top = `${Math.round(y)}px`;
            this.canvas.style.left = `${Math.round(x)}px`;
        }
        const setProcessScreenSize = (w, h) => {
            if (isNaN(w) || isNaN(h))
                throw "Invalid Function Parameter"
            const screenW = window.innerWidth
            const screenH = window.innerHeight
            if (w == 0 || h == 0) {
                this.canvas.style.width = "100vw";
                this.canvas.style.height = "100vh";
            } else {
                let newW = 0
                let newH = 0
                if (w > h) {
                    newW = screenW
                    newH = screenW / (w / h)
                    if (newH > screenH) {
                        newH = screenH
                        newW = screenH / (h / w)
                    }
                } else if (w < h) {
                    newH = screenH
                    newW = screenH / (h / w)
                    if (newH > screenH) {
                        newH = screenH
                        newW = screenH / (h / w)
                    } else if (newW > screenW) {
                        newH = screenW * (h / w)
                        newW = screenW
                    }
                } else {
                    if (screenW < screenH) {
                        newH = screenW;
                        newW = screenW;
                    } else {
                        newH = screenH;
                        newW = screenH;
                    }
                }
                this.canvas.style.width = `${Math.round(newW)}px`;
                this.canvas.style.height = `${Math.round(newH)}px`;
            }
            centerCanvas()
        }

        const initScreen = (w = 0, h = 0) => {
            if (isNaN(w) || isNaN(h))
                throw "Invalid Function Parameter"
            const hideAll = () => {
                let all = document.querySelectorAll("body *")
                let body = document.querySelectorAll("body")[0]
                body.style.overflow = "hidden"
                for (let e of all)
                    e.style.opacity = "0"
            }
            hideAll()
            let canvas = document.createElement("canvas")
            if (this.canvas != undefined)
                this.canvas.remove()
            this.body.appendChild(canvas)
            canvas.style.opacity = "1"
            canvas.style.position = 'fixed';
            canvas.style.top = '0px';
            canvas.style.left = '0px';
            canvas.style.width = "100vw";
            canvas.style.height = "100vh";
            canvas.style.zIndex = "9999999999999999999";
            this.canvas = canvas

            window.addEventListener("resize", () => {
                this.canvasResize()
                setProcessScreenSize(this.canvasSizeOverride ? this.canvasSize.x : 0, this.canvasSizeOverride ? this.canvasSize.y : 0)
            })
            this.draw.ctx = canvas.getContext("2d");
            if (w != 0 && h != 0)
                this.canvasResize(w, h)
            else
                this.canvasResize()
            setProcessScreenSize(w, h)
        }
        const initRegs = () => {
            this.input.reg = []
            this.input.reg_p = []
            this.input.reg_r = []
            for (let i = 0; i < 48; i++)
                this.input.reg.push(false)
            for (let i = 0; i < 48; i++)
                this.input.reg_p.push(1)
            for (let i = 0; i < 48; i++)
                this.input.reg_r.push(2)
        }
        if (isNaN(fps))
            throw "Invalid Function Parameter"
        const isObject = (objToCheck) => {
            return typeof objToCheck === 'object' && objToCheck !== null
        }
        const isFunction=(functionToCheck) =>{
            return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
           }
        if (this.interval != undefined)
            clearInterval(this.interval)
        if (!isObject(obj)&& !isFunction(obj.render())&& !isFunction(obj.update()))
            throw "Invalid Function Parameter"
        initScreen(w, h)
        initRegs()
        const isPossiblePressed = (value, type, forPressed, mouse = false) => {
            //mouse
            if (mouse) {
                let item = forPressed ? this.mouse.reg_p[value] : this.mouse.reg_r[value]
                if ((!type && forPressed) || (type && !forPressed))
                    return true
                if (!forPressed)
                    return item == 2
                return item == 1
            }
            //keybord
            let item = forPressed ? this.input.reg_p[value] : this.input.reg_r[value]
            if ((!type && forPressed) || (type && !forPressed))
                return true
            if (!forPressed)
                return item == 2
            return item == 1
        }
        const onKeyUpOrDown = (value, key) => {
            const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            let valuePressed = value + 1
            if (key == " ") {
                this.input.reg[33] = value
                if (isPossiblePressed(33, value, true))
                    this.input.reg_p[33] = valuePressed
                if (isPossiblePressed(33, value, false))
                    this.input.reg_r[33] = valuePressed
                return
            }
            for (let i = 0; i < alphabet.length; i++)
                if (key == alphabet[i].toLowerCase()) {
                    this.input.reg[i] = value
                    if (isPossiblePressed(i, value, true))
                        this.input.reg_p[i] = valuePressed
                    if (isPossiblePressed(i, value, false))
                        this.input.reg_r[i] = valuePressed
                    return
                }
            for (let i = 0; i < 10; i++)
                if (i == key) {
                    this.input.reg[i + 34] = value
                    if (isPossiblePressed(i + 34, value, true))
                        this.input.reg_p[i + 34] = valuePressed
                    if (isPossiblePressed(i + 34, value, false))
                        this.input.reg_r[i + 34] = valuePressed
                    return
                }
            switch (key) {
                case "Escape":
                    this.input.reg[44] = value
                    if (isPossiblePressed(44, value, true))
                        this.input.reg_p[44] = valuePressed
                    if (isPossiblePressed(44, value, false))
                        this.input.reg_r[44] = valuePressed
                    return
                case "Tab":
                    this.input.reg[27] = value
                    if (isPossiblePressed(27, value, true))
                        this.input.reg_p[27] = valuePressed
                    if (isPossiblePressed(27, value, false))
                        this.input.reg_r[27] = valuePressed
                    return
                case "Backspace":
                    this.input.reg[45] = value
                    if (isPossiblePressed(45, value, true))
                        this.input.reg_p[45] = valuePressed
                    if (isPossiblePressed(45, value, false))
                        this.input.reg_r[45] = valuePressed
                    return
                case "Enter":
                    this.input.reg[26] = value
                    if (isPossiblePressed(26, value, true))
                        this.input.reg_p[26] = valuePressed
                    if (isPossiblePressed(26, value, false))
                        this.input.reg_r[26] = valuePressed
                    return
                case "Alt":
                    this.input.reg[46] = value
                    if (isPossiblePressed(46, value, true))
                        this.input.reg_p[46] = valuePressed
                    if (isPossiblePressed(46, value, false))
                        this.input.reg_r[46] = valuePressed
                    return
                case "Control":
                    this.input.reg[28] = value
                    if (isPossiblePressed(28, value, true))
                        this.input.reg_p[28] = valuePressed
                    if (isPossiblePressed(28, value, false))
                        this.input.reg_r[28] = valuePressed
                    return
                case "ArrowUp":
                    this.input.reg[29] = value
                    if (isPossiblePressed(29, value, true))
                        this.input.reg_p[29] = valuePressed
                    if (isPossiblePressed(29, value, false))
                        this.input.reg_r[29] = valuePressed
                    return
                case "ArrowDown":
                    this.input.reg[30] = value
                    if (isPossiblePressed(30, value, true))
                        this.input.reg_p[30] = valuePressed
                    if (isPossiblePressed(30, value, false))
                        this.input.reg_r[30] = valuePressed
                    return
                case "ArrowLeft":
                    this.input.reg[31] = value
                    if (isPossiblePressed(31, value, true))
                        this.input.reg_p[31] = valuePressed
                    if (isPossiblePressed(31, value, false))
                        this.input.reg_r[31] = valuePressed
                    return
                case "Shift":
                    this.input.reg[47] = value
                    if (isPossiblePressed(47, value, true))
                        this.input.reg_p[47] = valuePressed
                    if (isPossiblePressed(47, value, false))
                        this.input.reg_r[47] = valuePressed
                    return
                case "ArrowRight":
                    this.input.reg[32] = value
                    if (isPossiblePressed(32, value, true))
                        this.input.reg_p[32] = valuePressed
                    if (isPossiblePressed(32, value, false))
                        this.input.reg_r[32] = valuePressed
                    return
            }
        }
        const onMouseUpOrDown = (buttons, value) => {
            let valuePressed = value + 1
            if (buttons == 0) {
                this.mouse.reg[1] = value
                this.mouse.reg[2] = value
                this.mouse.reg[4] = value
                if (isPossiblePressed(3 - 1, value, true, true))
                    this.mouse.reg_p[3 - 1] = valuePressed
                if (isPossiblePressed(3 - 1, value, false, true))
                    this.mouse.reg_r[3 - 1] = valuePressed
                if (isPossiblePressed(1 - 1, value, true, true))
                    this.mouse.reg_p[1 - 1] = valuePressed
                if (isPossiblePressed(1 - 1, value, false, true))
                    this.mouse.reg_r[1 - 1] = valuePressed
                if (isPossiblePressed(2 - 1, value, true, true))
                    this.mouse.reg_p[2 - 1] = valuePressed
                if (isPossiblePressed(2 - 1, value, false, true))
                    this.mouse.reg_r[2 - 1] = valuePressed
                return
            }
            switch (buttons) {
                case this.mouse.BUTTON_LEFT:
                    this.mouse.reg[1] = value
                    if (isPossiblePressed(1 - 1, value, true, true))
                        this.mouse.reg_p[1 - 1] = valuePressed
                    if (isPossiblePressed(1 - 1, value, false, true))
                        this.mouse.reg_r[1 - 1] = valuePressed
                    break
                case this.mouse.BUTTON_RIGHT:
                    this.mouse.reg[2] = value
                    if (isPossiblePressed(2 - 1, value, true, true))
                        this.mouse.reg_p[2 - 1] = valuePressed
                    if (isPossiblePressed(2 - 1, value, false, true))
                        this.mouse.reg_r[2 - 1] = valuePressed
                    break
                case this.mouse.BUTTON_MIDDLE:
                    this.mouse.reg[4] = value
                    this.mouse.reg[4] = value
                    if (isPossiblePressed(3 - 1, value, true, true))
                        this.mouse.reg_p[3 - 1] = valuePressed
                    if (isPossiblePressed(3 - 1, value, false, true))
                        this.mouse.reg_r[3 - 1] = valuePressed
                    break
                case 3:
                    this.mouse.reg[2] = value
                    this.mouse.reg[1] = value
                    if (isPossiblePressed(1, value, true, true))
                        this.mouse.reg_p[1 - 1] = valuePressed
                    if (isPossiblePressed(1 - 1, value, false, true))
                        this.mouse.reg_r[1 - 1] = valuePressed
                    if (isPossiblePressed(2 - 1, value, true, true))
                        this.mouse.reg_p[2 - 1] = valuePressed
                    if (isPossiblePressed(2 - 1, value, false, true))
                        this.mouse.reg_r[2 - 1] = valuePressed
                    break
            }
        }
        const onMouseMove = (evt) => {
            var rect = this.canvas.getBoundingClientRect();
            this.mouse.reg[0].x = (evt.clientX - rect.left) / (rect.right - rect.left) * this.canvas.width
            this.mouse.reg[0].y = (evt.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.height
            this.mouse.reg[0].x = Math.round(this.mouse.reg[0].x)
            this.mouse.reg[0].y = Math.round(this.mouse.reg[0].y)
        }
        window.addEventListener("mousemove", (evt) => onMouseMove(evt))
        window.addEventListener("keydown", (e) => onKeyUpOrDown(true, e.key))
        window.addEventListener("keyup", (e) => onKeyUpOrDown(false, e.key))
        window.addEventListener("contextmenu", e => e.preventDefault());
        window.addEventListener("mousedown", (e) => onMouseUpOrDown(e.buttons, true))
        window.addEventListener("mouseup", (e) => onMouseUpOrDown(e.buttons, false))
        this.canvas.addEventListener("click", (e) => this.mouse.reg[3] = true)
        this.interval = setInterval(() => {
            obj.update()
            obj.render()
            this.mouse.reg[3] = false
            //keybord
            for (let i = 0; i < this.input.reg_p.length; i++) {
                //pressed
                if (this.input.reg_p[i] == 2)
                    this.input.reg_p[i] = 0
                else if (this.input.reg_p[i] == 1)
                    this.input.reg_p[i] = 1
                else
                    this.input.reg_p[i] = 3
                //relesed
                if (this.input.reg_r[i] == 1)
                    this.input.reg_r[i] = 0
                else if (this.input.reg_r[i] == 2)
                    this.input.reg_r[i] = 2
                else
                    this.input.reg_r[i] = 3
            }
            //mouse
            for (let i = 0; i < this.mouse.reg_p.length; i++) {
                //pressed
                if (this.mouse.reg_p[i] == 2)
                    this.mouse.reg_p[i] = 0
                else if (this.mouse.reg_p[i] == 1)
                    this.mouse.reg_p[i] = 1
                else
                    this.mouse.reg_p[i] = 3
                //relesed
                if (this.mouse.reg_r[i] == 1)
                    this.mouse.reg_r[i] = 0
                else if (this.mouse.reg_r[i] == 2)
                    this.mouse.reg_r[i] = 2
                else
                    this.mouse.reg_r[i] = 3
            }
            let time = performance.now() - this.performance
            this.performance = performance.now()
            this.frametime = time
            this.frameCounter += 1;
        }, 1000 / fps)
        setInterval(() => {
            this.FPS = this.frameCounter
            this.frameCounter = 0
        }, 1000)
    }
}

export default new Lib()
