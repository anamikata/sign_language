const URL = "https://teachablemachine.withgoogle.com/models/6k9kmqsbht/";
let model, webcam, labelContainer, maxPredictions;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  try {
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(320, 320, flip);
    await webcam.setup();
    await webcam.play();

    document.getElementById("webcam-container").innerHTML = "";
    document.getElementById("webcam-container").appendChild(webcam.canvas);

    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
      labelContainer.appendChild(document.createElement("div"));
    }

    window.requestAnimationFrame(loop);
    document.getElementById("start-button").disabled = true;
    document.getElementById("start-button").textContent = "Running";
  } catch (error) {
    console.error("Failed to load model or webcam:", error);
    alert("Unable to start the sign language demo. Please check webcam permissions and network access.");
  }
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction = `${prediction[i].className}: ${prediction[i].probability.toFixed(2)}`;
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}

const startButton = document.getElementById("start-button");
if (startButton) {
  startButton.addEventListener("click", init);
}

window.init = init;
