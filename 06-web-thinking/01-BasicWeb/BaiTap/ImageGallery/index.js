document.addEventListener("DOMContentLoaded", function() {
    // Function: Load all images
    function readURLs() {
        clearAll();
        input = document.getElementById("fileURLs");
        if (input.files.length > 0) {
            setNumOfFiles(input.files.length);
            for (var i = 0; i < input.files.length; i++) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById("imageBox").innerHTML +=  "<div class=\"col-lg-3 col-md-6 col-sm-12 px-2 py-2 text-center\"><img src=\"" + e.target.result+ "\" alt=\"Picture " + (i+1) + "1\" class=\"img-thumbnail\"></div>";
                }
                reader.readAsDataURL(input.files[i]);
            }
        }
    }

    // Function: Clear all current image files
    function clearAll() {
        document.getElementById("imageBox").innerHTML = "";
        setNumOfFiles(0);
    }

    // Function: Set number of files
    function setNumOfFiles(number) {
        document.getElementById("numOfFiles").innerHTML = "Total: " + number + " files";
    }

    // Use functions
    document.getElementById("fileURLs").onchange = readURLs;
    document.getElementById("clearAllFiles").onclick = clearAll;
});