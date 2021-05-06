import * as seedrandom from 'seedrandom';
import { BaseRenderer } from './baseRenderer';
import gsap from 'gsap';
import P5 from 'p5';

const srandom = seedrandom('b');

export default class P5Renderer implements BaseRenderer{

    recording: boolean = false;
    colors = ['#0B688C', '#1EC6D9', '#30F2DF', '#F2B3B3'];
    backgroundColor = '#ffffff';

    canvas: HTMLCanvasElement;
    s: any;

    completeCallback: any;
    delta = 0;
    animating = true;

    width: number = 1920 / 2;
    height: number = 1080 / 2;

    size: number;

    x: number;
    y: number;

    frameCount = 0;
    totalFrames = 1000;

    constructor(w, h) {

        this.width = w;
        this.height = h;

        const sketch = (s) => {
            this.s = s;
            s.pixelDensity(1);
            s.setup = () => this.setup(s)
            s.draw = () => this.draw(s)
        }

        new P5(sketch);
    }

    protected setup(s) {
        let renderer = s.createCanvas(this.width, this.height);
        this.canvas = renderer.canvas;

        s.noiseSeed(99);
        let bg = s.color(this.backgroundColor);
        s.background(bg);
        s.rectMode(s.CENTER);

        //s.colorMode(s.HSB);

    }

    protected draw(s) {
        if (this.animating) { 
            this.frameCount += 5;

            let frameDelta = 2 * Math.PI * (this.frameCount % this.totalFrames) / this.totalFrames;

            //s.blendMode(s.BLEND);
            s.colorMode(s.RGB);
            let bg = s.color(this.backgroundColor);
            bg.setAlpha(100);
            s.background(bg);

            s.colorMode(s.HSB);

            //s.translate(-s.width / 2, -s.height / 2);

            let numpoints = 500;

            for (let i = 0; i < numpoints; i++) {
                let angle = 2 * Math.PI * i / numpoints;

                let x = (i / numpoints) * this.width;
                let y = this.height / 2;

                let size = s.sin(s.noise(frameDelta) + i) * 150;

                //s.blendMode(s.BURN);
                let hue = ((frameDelta + i) / Math.PI) * 360 % 360; //color rotates
                //s.fill(color);
                s.noFill();
                //s.noStroke();
                s.stroke(hue, 255, 255, 0.1);

                s.push();
                s.translate(x, y);
                s.rotate(angle + frameDelta);
                s.rect(0, 0, size, size);
                s.pop();


            }
            /*
            for (let i = 0; i < 30; i++) {

                for (let j = 0; j < numpoints; j++) {

                    let angle = 2 * Math.PI * j / numpoints;

                    let x = centerX + Math.sin(i + angle + frameDelta) * j * 14; //rotate circles
                    let y = centerY + Math.cos(i + angle + frameDelta) * j * 14;
                    //if (j > 1) {
                        s.circle(x, y, s.noise(Math.sin(i + j + frameDelta) * 2) * 40);
                    //}
                    
                    let a = s.color(this.colors[0]);
                    let b = s.color(this.colors[2]);

                    //let pct = j / numpoints;
                    let pct = Math.sin(j + frameDelta);
                    pct = s.map(pct, 0, 1, 0.3, 1.0);

                    let color = s.lerpColor(a, b, pct);

                    s.noStroke();
                    s.fill(color);

                }
            }
            */

            if (this.recording) {
                if (frameDelta == 0) {
                    this.completeCallback();
                }
            }
        }
    }

    protected getPolar = function(x, y, r, a) {
        // Get as radians
        var fa = a * (Math.PI / 180);
        
        // Convert coordinates
        var dx = r * Math.cos(fa);
        var dy = r * Math.sin(fa);
        
        // Add origin values (not necessary)
        var fx = x + dx;
        var fy = y + dy;
    
        return [fx, fy];
    }
    

    public render() {

    }

    public play() {
        this.frameCount = 0;
        this.recording = true;
        this.animating = true;
        let bg = this.s.color(this.backgroundColor);
        this.s.background(bg);
    }

    public stop() {
        this.animating = false;
    }

    public setCompleteCallback(completeCallback: any) {
        this.completeCallback = completeCallback;
    }

    public resize() {
        this.s.resizeCanvas(window.innerWidth, window.innerHeight);
        this.s.background(0, 0, 0, 255);
    }
}