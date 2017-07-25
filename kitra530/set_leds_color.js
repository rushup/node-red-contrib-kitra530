module.exports = function(RED) {
    function LedRgbSet(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        var fs = require('fs');
        this.on('input', function(msg) {

            var r = (parseInt((config.color || msg.color), 16) & 0xff0000) >> 16;
            var g = (parseInt((config.color || msg.color), 16) & 0x00ff00) >> 8;
            var b = (parseInt((config.color || msg.color), 16) & 0x0000ff);


            fs.writeFileSync('/sys/class/leds/red/brightness', parseInt((r * (config.intensity || msg.intensity)) / 100));
            fs.writeFileSync('/sys/class/leds/green/brightness', parseInt((g * (config.intensity || msg.intensity)) / 100));
            fs.writeFileSync('/sys/class/leds/blue/brightness', parseInt((b * (config.intensity || msg.intensity)) / 100));



        });
    }
    RED.nodes.registerType("Set Leds Color", LedRgbSet);
}