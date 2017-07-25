module.exports = function(RED) {

    function GetAccelRaw(config) {

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

                    var x = fs.readFileSync(devpath_accel + "/in_accel_x_raw").toString();
                    var y = fs.readFileSync(devpath_accel + "/in_accel_y_raw").toString();
                    var z = fs.readFileSync(devpath_accel + "/in_accel_z_raw").toString();

                    msg.accel_x_raw = x;
                    msg.accel_y_raw = y;
                    msg.accel_z_raw = z;

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

    RED.nodes.registerType("Get Accel Raw", GetAccelRaw);

}