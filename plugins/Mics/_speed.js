/*
* @Author: DiegosonTech
* @BotName: Aztec-MD 
*/

const { getCpuSpeed, getUploadSpeed, calculatePing, getCPUSpeedDescription, getSystemInfo, getOSInfo, getAdditionalSystemInfo, getNetworkInfo, getStorageInfo, getUploadSpeedDescription } = require("../../lib/assiets/_speedSystem.js");
const os = require("os");
const speed = require("performance-now");
const { exec } = require("child_process");
const { Zenith } = require('../../lib/_cmd_sxntax.js');

Zenith(
   {
      usage: 'ping',
      category: 'Mics',
      desc: 'Check the speedy',
      filename: __filename
   }, async (vorterx, coax, react) => {
      
      await react("🏇");
      const cpuSpeedResult = { speed: getCpuSpeed() }; 
      const uploadSpeedInMbps = getUploadSpeed(); 

      const startTimestamp = speed();
      exec(`neofetch --stdout`, (error, stdout, stderr) => {
         const endTimestamp = speed();
         const latency = endTimestamp - startTimestamp;

         const child = stdout.toString("utf-8");
         const aztec = child.replace(/Memory:/, "Ram:");
         
         const cpuSpeedDescription = getCPUSpeedDescription(cpuSpeedResult.speed);
         const systemInfo = getSystemInfo();
         const uploadSpeedDescription = getUploadSpeedDescription(uploadSpeedInMbps);
         const osInfo = getOSInfo();
         const additionalInfo = getAdditionalSystemInfo();
         const networkInfo = getNetworkInfo();
         const storageInfo = getStorageInfo();

         coax.reply(`
         ${aztec}*🛑 Performance:* ${latency.toFixed(4)} ms
         *💻 CPU Speed:* ${cpuSpeedResult.speed} GHz
         *🚀 CPU Power:* ${cpuSpeedDescription}
         *🖥️ System:* ${systemInfo}
         *💿 OS Info:* ${osInfo}
         *🔍 Addit-Info:* ${additionalInfo}
         *🌐 Network:* ${networkInfo}
         *💽 Storage:* ${storageInfo}
         *📤 Upload Speed:* ${uploadSpeedInMbps} Mbps (${uploadSpeedDescription})
         *📍 Ping:* ${calculatePing(coax.messageTimestamp, Date.now())} _second(s)_`);
      });
   });
      
