module.exports = function(RED) {

    function GetProximity(config) {

        RED.nodes.createNode(this, config);

        var node = this;

        var fs = require('fs');
        var path = require('path');

        var iio_path = "/sys/bus/iio/devices/";
        var devpath = "";



        function getDirectories(srcpath) {

            return fs.readdirSync(srcpath);

        }

        var iio_dirs = getDirectories(iio_path);


        for (var i = 0; i < iio_dirs.length; i++)

        {
            var r = iio_dirs[i];


            var ret = fs.readFileSync(iio_path + r + "/name");


            if (ret.length > 0 && ret.indexOf("vl53l0x") >= 0)

            {
                node.status({
                    fill: "green",
                    shape: "dot",
                    text: "Found"
                });

                devpath = iio_path + r;

                break;

            }

        }

        if (devpath != "") {

            this.on('input', function(msg) {

                msg.proximity = fs.readFileSync(devpath + "/in_proximity_input").toString();

                node.send(msg);

            });

        } else
            node.status({
                fill: "red",
                shape: "dot",
                text: "Not found"
            });



    }

    RED.nodes.registerType("Get Proximity", GetProximity);

}