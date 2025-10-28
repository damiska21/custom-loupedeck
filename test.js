import { discover } from "loupedeck";
import { exec } from "node:child_process";
import fs from "node:fs";
var config = JSON.parse(fs.readFileSync("config.json", "utf8"));

// Detects and opens first connected device
const device = await discover();

// Observe connect events
device.on("connect", () => {
  console.info("Connection successful!");
});

// React to button presses
device.on("down", ({ id }) => {
  console.info(`Button pressed: ${id}`);
  switch (config.bindtype[id]) {
    case "shell":
      runApp(config.bindcommand[id]);
      break;

    default:
      break;
  }
});
function runApp(name) {
  exec(
    "zsh -lc " + name,
    {
      env: {
        ...process.env,
        WAYLAND_DISPLAY: "wayland-1",
        XDG_RUNTIME_DIR: "/run/user/1000",
        QT_QPA_PLATFORM: "wayland",
      },
    },
    (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        return;
      } else if (stderr) {
        console.log(stderr);
        return;
      }
      console.log(stdout);
    }
  );
}
// React to knob turns
device.on("rotate", ({ id, delta }) => {
  console.info(`Knob ${id} rotated: ${delta}`);
});
