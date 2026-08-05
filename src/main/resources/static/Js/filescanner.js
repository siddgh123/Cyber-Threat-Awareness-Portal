const API_URL = "http://localhost:8080/api/scan";

const fileInput = document.getElementById("fs-file-input");
const browseBtn = document.getElementById("fs-browse-btn");
const scanBtn = document.getElementById("fs-scan-btn");
const clearBtn = document.getElementById("fs-clear-btn");

const emptyState = document.getElementById("fs-empty-state");
const fileChosen = document.getElementById("fs-file-chosen");

const fileName = document.getElementById("fs-file-name");
const fileSize = document.getElementById("fs-file-size");

const loadingCard = document.getElementById("fs-loading-card");
const resultArea = document.getElementById("fs-result-area");


// Browse button
browseBtn.addEventListener("click", () => {
    fileInput.click();
});


// File selected
fileInput.addEventListener("change", () => {

    if(fileInput.files.length===0)
        return;

    const file=fileInput.files[0];

    emptyState.style.display="none";
    fileChosen.style.display="flex";

    fileName.innerText=file.name;
    fileSize.innerText=(file.size/1024).toFixed(2)+" KB";

    scanBtn.disabled=false;
    clearBtn.disabled=false;

});


// Clear button
clearBtn.addEventListener("click",()=>{

    fileInput.value="";

    emptyState.style.display="block";
    fileChosen.style.display="none";

    scanBtn.disabled=true;
    clearBtn.disabled=true;

    resultArea.innerHTML="";

});


// Scan button
scanBtn.addEventListener("click",scanFile);


async function scanFile() {

    const file = fileInput.files[0];

    if (!file) {
        alert("Please choose a file.");
        return;
    }

    loadingCard.style.display = "block";
    resultArea.innerHTML = "";

    const formData = new FormData();
    formData.append("file", file);

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Scan failed");
        }

        const data = await response.json();

        console.log(data);

        loadingCard.style.display = "none";

        showResult(data);

    }
    catch (error) {

        loadingCard.style.display = "none";

        resultArea.innerHTML = `
            <div class="alert alert-danger">
                Unable to scan file.
            </div>
        `;

        console.error(error);

    }

}


function showResult(result) {

    const safe = result.safe === true;

    const color = safe ? "#00ff88" : "#ff3b3b";
    const status = safe ? "SAFE" : "DANGEROUS";

    resultArea.innerHTML = `
        <div class="card mt-4 bg-dark text-white border-0 shadow-lg">
            <div class="card-body">

                <h2 style="color:${color};font-weight:bold;">
                    ${safe ? "🛡 SAFE" : "⚠ DANGEROUS"}
                </h2>

                <p style="font-size:18px;">
                    ${result.message}
                </p>

                <hr>

                <p><strong>Malicious Engines:</strong> ${result.malicious}</p>

                <p><strong>Suspicious Engines:</strong> ${result.suspicious}</p>

            </div>
        </div>
    `;
}