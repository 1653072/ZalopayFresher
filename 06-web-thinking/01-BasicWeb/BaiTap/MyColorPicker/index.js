$(document).ready(function() {
    // Function: Change value Red or Green or Blue to Hex
    var rgbToHex = function (rgb) { 
        var hex = Number(rgb).toString(16);
        if (hex.length < 2) {
             hex = "0" + hex;
        }
        return hex;
    };

    // Function: Compute and return hex value of R+G+B
    var fullColorHex = function(r,g,b) {   
        var hred = rgbToHex(r);
        var hgreen = rgbToHex(g);
        var hblue = rgbToHex(b);
        return (hred + hgreen + hblue);
    };

    // Function: Display color after changing
    function displayColorFunction(type) {
        var red = document.getElementById("sliderR").value;
        var green = document.getElementById("sliderG").value;
        var blue = document.getElementById("sliderB").value;

        switch (type) {
            case "red":
                document.getElementById("numR").innerHTML = red;
                document.getElementById("colorR").style.background = "rgb(" + red + ", 0, 0)";
                break;
            case "green":
                document.getElementById("numG").innerHTML = green;
                document.getElementById("colorG").style.background = "rgb(0, " + green + ", 0)";
                break;
            case "blue":
                document.getElementById("numB").innerHTML = blue;
                document.getElementById("colorB").style.background = "rgb(0, 0, " + blue + ")";
                break;
            default: break;
        }

        var hexColor = fullColorHex(red, green, blue);
        document.getElementById("displayColor").style.background = "#" + hexColor;
        document.getElementById("hexColor").innerHTML = "#" + hexColor;
    }

    // Use function
    document.getElementById("sliderR"). addEventListener("click", function() {
        displayColorFunction("red");
    });

    document.getElementById("sliderG"). addEventListener("click", function() {
        displayColorFunction("green");
    });

    document.getElementById("sliderB"). addEventListener("click", function() {
        displayColorFunction("blue");
    });
});