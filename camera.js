const width = window.innerWidth;
const height = window.innerHeight;

export class Camera {
  constructor(videoElement, opt) {
    this.videoElement = videoElement;
    this.opt = opt;
  }
  async start() {
    // const w = this.opt.width || 1280;
    // const h = this.opt.height || 720;
    const w = width;
    const h = height;
    const video = {
      width: { ideal: w },
      height: { ideal: h },
      facingMode: this.opt.backcamera ? { ideal: "environment" } : "user",
    };
    await navigator.mediaDevices.getUserMedia({ video: true });
    const devs = await navigator.mediaDevices.enumerateDevices();
    const dev = devs.find(
      (d) =>
        d.kind == "videoinput" &&
        d.label.toLowerCase().indexOf("camera") >= 0 &&
        d.label.toLowerCase().indexOf("virtual") == -1
    );
    if (dev) {
      video.deviceId = dev.deviceId;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ video });
    //console.log(stream);
    this.videoElement.srcObject = stream;
    this.delay = 1000 / (this.opt.fps || 30);
    this.stream = stream;

    this.videoElement.playsInline = true;
    this.videoElement.autoplay = true;
    this.videoElement.play();
    this.active = true;
    this.endfunc = null;
    const f = async () => {
      if (!this.active) {
        if (this.endfunc) {
          this.endfunc();
        }
        return;
      }
      const v = this.videoElement;
      if (v.readyState == HTMLMediaElement.HAVE_ENOUGH_DATA) {
        await this.opt.onFrame();
      }
      setTimeout(f, this.delay);
    };
    f();
  }
  async stop() {
    return new Promise((resolve) => {
      this.videoElement.pause();
      if (this.stream) {
        this.stream.getVideoTracks().forEach((v) => v.stop());
        this.stream = null;
      }
      this.videoElement.srcObject = null;
      this.active = false;
      this.endfunc = resolve;
    });
  }
  async flip() {
    await this.stop();
    this.opt.backcamera = !this.opt.backcamera;
    await this.start();
  }
}
