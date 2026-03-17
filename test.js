import { discover } from "loupedeck";
import { exec } from "node:child_process";
import { createCanvas } from "canvas";
//for simple access: https://github.com/foxxyz/loupedeck
//read the config file
import fs from "node:fs";
import { setTimeout } from "node:timers/promises";
var config = JSON.parse(fs.readFileSync("config.json", "utf8"));
console.log("mnau");
// Observe connect events
const loupedeck = await discover();
loupedeck.on("connect", async () => {
  console.info("Connection successful!");
  loupedeck.setBrightness(0.5);
  drawKeyColors(loupedeck);
});

var keyColors = config.keycolor;

async function drawKeyColors(loupedeck) {
  await loupedeck.drawScreen("center", (ctx) => {
    for (const [keyId, keyColor] of Object.entries(keyColors)) {
      drawKeyColor(ctx, Number(keyId), keyColor);
    }
  });
}
function drawKeyColor(ctx, id, color) {
    ctx.fillStyle = color;
    ctx.fillRect((id%4)*90, (Math.floor(id/4))*90, 90, 90);
}

// React to button presses;
loupedeck.on("down", ({ id }) => {
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
    },
  );
}
// React to knob turns
loupedeck.on("rotate", ({ id, delta }) => {
  console.info(`Knob ${id} rotated: ${delta}`);
});

async function shutdown() {
  console.log("Closing loupedeck connection");
  await loupedeck.close();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
