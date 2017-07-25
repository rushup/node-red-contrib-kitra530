module.exports = function(RED) {

    function SetAccel(config) {

        RED.nodes.createNode(this, config);

        var node = this;

        var fs = require('fs');
        var path = require('path');

        var iio_path = "/sys/bus/iio/devices/";
        var devpath_accel = "";
        var devpath_gyro = "";

        function getDirectories(srcpath) {
            return fs.readdirSync(srcpath);
        }

        var iio_dirs = getDirectories(iio_path);

        for (var i = 0; i < iio_dirs.length; i++)

        {
            var r = iio_dirs[i];

            try {

                var ret = fs.readFileSync(iio_path + r + "/name");

                if (ret.length > 0 && ret.indexOf("lsm6dsl_accel") >= 0) {
                    devpath_accel = iio_path + r;
                }
                if (ret.length > 0 && ret.indexOf("lsm6dsl_gyro") >= 0) {
                    devpath_gyro = iio_path + r;
                }
            } catch (err) {}
        }

        if (devpath_accel != "" && devpath_gyro != "") {



            node.status({
                fill: "green",
                shape: "dot",
                text: "Found"
            });

            this.on('input', function(msg) {

                try {
                    fs.writeFileSync(devpath_accel + "/sampling_frequency", parseInt(config.odr));

                    fs.writeFileSync(devpath_accel + "/event_tap_en", config.tap);
                    fs.writeFileSync(devpath_accel + "/event_dtap_en", config.dtap);
                    fs.writeFileSync(devpath_accel + "/event_tilt_en", config.tilt);
                    fs.writeFileSync(devpath_accel + "/event_tilt_en", config.pedometer);
                    fs.writeFileSync(devpath_accel + "/event_wakeup_en", config.wakeup);
                    fs.writeFileSync(devpath_accel + "/event_freefall_en", config.freefall);

                    node.send(msg);
                } catch (err) {
                    node.status({
                        fill: "red",
                        shape: "dot",
                        text: "Error get"
                    });
                }

            });

        } else
            node.status({
                fill: "red",
                shape: "dot",
                text: "Not found"
            });



    }

    RED.nodes.registerType("Set Accel", SetAccel);

}