module.exports = function(RED) {

    function GetAccelEvent(config) {

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

            setInterval(function() {

                try {

                    var event = fs.readFileSync(devpath_accel + "/event_pop_buffer_dbg").toString();

                    var array = event.split(",");

                    var result = new Array();

                    var events = ["tap", "dtap", "tilt", "freefall", "step", "wakeup"];

                    for (var i = 0; i < events.length; i++) {
                        if (array[0].indexOf(events[i]) >= 0) {
                            var msg = {};
                            msg.event_type = "tap";
                            msg.event_extra = array[1];
                            msg.event_timestamp_ns = array[2];
                            result.push(msg);
                        } else
                            result.push(null);
                    }

                    node.send(result);

                } catch (err) {
                    node.log(err);
                }
            }, 100);

        } else
            node.status({
                fill: "red",
                shape: "dot",
                text: "Not found"
            });



    }

    RED.nodes.registerType("Get Accel Event", GetAccelEvent);

}