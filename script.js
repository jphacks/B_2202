import { Camera } from "./camera.js";

// 画面幅の取得
const width = window.innerWidth;
const height = window.innerHeight;
let flag = 0;
let flag2 = 0;

let hand_1_x = 0;
let hand_1_y = 0;
let hand_1_z = 0;

let model_flag = 0;

let model100;
let model75;
let model50;
let model25;
let model_last;

// 現在のモデルが何番目なのかのカウント
let model_count = 0;

let delay_plus = 2;
let delay_time = 6;

// 手が認識されているかどうかのフラグ
let hand_entry = 0;

// ーーーーーーーーーーーーーーーーーーー
// 秒数に変換
function delay(n) {
  return new Promise(function (resolve) {
    setTimeout(resolve, n * 1000);
  });
}
// 時間を計測
async function myAsyncFunction() {
  //Do what you want here
  //console.log("Before the delay");

  await delay(delay_time);

  //console.log("After the delay");
  delay_time = delay_time + delay_plus;
  model_count += 1;
  console.log("model_count:" + model_count);
  if (model_count == 4) {
    delay_time = 3.0;
  }
  // hand_entry = 0;
  myAsyncFunction();
  //Do what you want here too
}

window.addEventListener("DOMContentLoaded", init1);

// 骨格の検出(mediapipe)
function init1() {
  // var window_w = window.innerWidth;
  // var window_h = window.innerHeight;
  console.log(width, height);
  let canvasElement;
  let canvasCtx;
  //初期化
  window.onload = function () {
    let videoElement = document.getElementById("input_video");
    canvasElement = document.getElementById("output_canvas");
    canvasCtx = canvasElement.getContext("2d");
    //HandTrackingを使用するための関連ファイルの取得と初期化
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    //手の認識に関するオプション
    hands.setOptions({
      selfieMode: true,
      maxNumHands: 2, //認識可能な手の最大数
      modelComplexity: 1, //精度に関する設定(0~1)
      minDetectionConfidence: 0.5, //手検出の信頼度
      minTrackingConfidence: 0.5, //手追跡の信頼度
      useCpuInference: false, //M1 MacのSafariの場合は1
    });

    //結果を処理する関数
    hands.onResults(recvResults);

    /*mediapipeでのカメラ呼び出し（定型文)*/

    //カメラの初期化
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        //カメラの画像を用いて手の検出を実行
        await hands.send({ image: videoElement });
      },
      width: width,
      height: height,
      backcamera: true,
    });
    //カメラの動作開始
    camera.start();
  };
  //手の検出結果を利用する
  function recvResults(results) {
    // let width = results.image.width;
    // let height = results.image.height;
    if (width != canvasElement.width) {
      canvasElement.width = width;
      canvasElement.height = height;
    }
    canvasCtx.save();
    canvasCtx.drawImage(results.image, 0, 0, width, height);
    //console.log(results.multiHandLandmarks); //手検出時に座標データを取得
    //console.log(results.multiHandLandmarks.length); //

    if (results.multiHandLandmarks.length >= 1) {
      if (hand_entry == 0) {
        // hand_entry = 1;
        // myAsyncFunction();
      }
      for (const landmarks of results.multiHandLandmarks) {
        //骨格の表示
        // drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
        //   color: "#00FF00",
        //   lineWidth: 2,
        // });
        // //関節の表示
        // drawConnectors(canvasCtx, landmarks, {
        //   color: "#FF0000",
        //   lineWidth: 1,
        //   radius: 2,
        // });
        // init2()を呼び出すためのフラグ
        flag = 1;
      }
      if (flag == 1 && flag2 == 0) {
        init2();
        myAsyncFunction();
        flag2 = 1;
      }
    } else {
      // hand_entry = 0;
      console.log("手をかざしてください");
    }

    canvasCtx.restore();
  }
}
//
//
// 3Dモデルの表示(three.js)
function init2() {
  // htmlからcanvasのclass名の取得
  const canvas = document.querySelector("#js-three");

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(20, width / height, 0.1, 10000);
  camera.position.set(0, 0, 30);
  // camera.rotation.z = 100;

  // OrbitControlsの読み込み
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  // ライトの作成
  const light = new THREE.AmbientLight(0xefefef, 1.0);
  scene.add(light);

  // GLTFLoaderの読み込み
  const loader = new THREE.GLTFLoader();
  // 使用するオブジェクトのパス
  // const url = "./bacteria.gltf";
  loader.load("./bacteria.gltf", (gltf) => {
    // 読み込み後に3D空間に追加
    model100 = gltf.scene;
    model.position.set(0, 0, 0);
    model_flag = 1;
  });

  loader.load("./bacteria75.gltf", (gltf) => {
    // 読み込み後に3D空間に追加
    model75 = gltf.scene;
    model75.position.set(0, 0, 0);
    model_flag = 1;
  });

  loader.load("./bacteria50.gltf", (gltf) => {
    // 読み込み後に3D空間に追加
    model50 = gltf.scene;
    model50.position.set(0, 0, 0);
    model_flag = 1;
  });

  loader.load("./bacteria25.gltf", (gltf) => {
    // 読み込み後に3D空間に追加
    model25 = gltf.scene;
    model25.position.set(0, 0, 0);
    model_flag = 1;
  });

  loader.load("./bacteria25.gltf", (gltf) => {
    // 読み込み後に3D空間に追加
    model_last = gltf.scene;
    model_last.position.set(0, 0, 0);
    model_flag = 1;
  });

  const tick = () => {
    // モデルの動作を設定
    if (model_flag != 0 && model_count == 0) {
      // model100.rotation.x += Math.random() / 10;
      // model100.rotation.x -= Math.random() / 10;
      model100.rotation.y += 0.01;
      // model100.rotation.y -= Math.random() / 10;
      // model100.rotation.y += Math.random() / 10;
      // model75.rotation.y += 0.01;
      // model75.rotation.z += 0.01;
    } else if (model_flag != 0 && model_count == 1) {
      // model75.rotation.x += 0.01;
      // model75.rotation.y += 0.01;
      model75.rotation.y -= Math.random() / 10;
      model75.rotation.y += Math.random() / 10;
      // model75.rotation.z += 0.01;
    } else if (model_flag != 0 && model_count == 2) {
      // model75.rotation.x += 0.01;
      model50.rotation.y += 0.01;
      model50.rotation.z += 0.01;
    } else if (model_flag != 0 && model_count == 3) {
      model25.rotation.x += Math.random() / 10;
      model25.rotation.x -= Math.random() / 10;
      model25.rotation.y -= Math.random() / 10;
    } else if (model_flag != 0 && model_count == 4) {
      model_last.rotation.y += 0.05;
      model_last.position.z -= 0.5;
      // model25.rotation.x += Math.random() / 10;
      // model25.rotation.x -= Math.random() / 10;
      // model25.rotation.y -= Math.random() / 10;
    }
    controls.update();

    if (model_count == 0) {
      scene.add(model100);
    } else if (model_count == 1) {
      scene.remove(model100);
      scene.add(model75);
      HP.value = 75;
    } else if (model_count == 2) {
      scene.remove(model75);
      scene.add(model50);
      HP.value = 50;
    } else if (model_count == 3) {
      scene.remove(model50);
      scene.add(model25);
      HP.value = 25;
    } else if (model_count == 4) {
      HP.value = 0;
      scene.remove(model25);
      scene.add(model_last);
    } else if (model_count == 5) {
      // HP.value = 0;
      // scene.add(model_last);
      window.location.href = "thankyou.html"; //画面遷移
      // scene.remove(model25);
    } else if (model_count == 6) {
      window.location.href = "thankyou.html"; //画面遷移
    }
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  // myAsyncFunction();
  tick();
}
