const filesInputArea = document.getElementById("files-click-drop");
const filesInput = document.getElementById("files-input")
const targetFormatForm = document.getElementById("target-format-form")
const convertButton = document.getElementById("convert-button")
filesInputArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    filesInputArea.classList.add('dragover');
});
filesInputArea.addEventListener('dragleave', () => {
    filesInputArea.classList.remove('dragover');
});
filesInputArea.addEventListener('drop', (e) => {
    e.preventDefault();
    filesInputArea.classList.remove('dragover');
    const imageFile = e.dataTransfer.files[0];
    HandleSelectedFile(imageFile);
});
filesInputArea.addEventListener('change', (e) => {
    const imageFile = e.target.files[0];
    HandleSelectedFile(imageFile);
});
targetFormatForm.addEventListener('change', (e) => {
    CheckConditionToEnableConvertButton();
});
convertButton.addEventListener("click", function() {
    WorkOutFile();
});

let clickCount = 0;
let clickTimer = null;
const footer = document.querySelector('footer');
const convertButtonContainer = document.getElementById("convert-button-container");
convertButtonContainer.addEventListener('click', function(event) {
    if(convertButton.disabled) {
        clickCount++;
        if (clickCount === 1) {
            clickTimer = setTimeout(function() {
                clickCount = 0;
            }, 500);
        } else if (clickCount === 3) {
            footer.style.visibility = "visible";
            clearTimeout(clickTimer);
            clickCount = 0;
        }
    }
}
)
const myHeart = document.getElementById("my-heart");
myHeart.addEventListener("click", function() {alert("最喜欢你了")});

function HandleSelectedFile(file) {
    const fileExtenstionName = file.name.split(".")[1];
    DrawOnCanvas(file);
    showTips(fileExtenstionName);
    CheckConditionToEnableConvertButton();
}

function WorkOutFile() {
    const targetFormat = GetTargetFormatandExtentionName()[0];
    const targetFormatExtensionName = GetTargetFormatandExtentionName()[1];
    ConvertAndDownloadImageFile(targetFormat, targetFormatExtensionName);
}

function CheckConditionToEnableConvertButton() {
    const fileSelected = filesInput.files.length > 0;
    const formatSelected = targetFormatForm.querySelector('input[name="target-format-radio"]:checked') !== null;
    convertButton.disabled = !(fileSelected && formatSelected);
}
function DrawOnCanvas(file) {
    const canvas = document.getElementById("canvas-image");
    const canvasContext = canvas.getContext("2d");
    const reader = new FileReader();
    if (!file) {
        return
    }
    reader.onload =function(e) {
        const image =new Image();
        image.onload = function() {
            canvas.width = image.width
            canvas.height = image.height
            canvasContext.drawImage(image, 0, 0)
        }
        image.src = e.target.result
    }
    reader.readAsDataURL(file)
}

function showTips(fileExtenstionName) {
    document.getElementById("files-input-tip-default").textContent = '已选择一个' + fileExtenstionName + '文件';
    document.getElementById("files-input-tip-hidden").style.display = "flex";
}

function GetTargetFormatandExtentionName() {
    const form = document.getElementById("target-format-form");
    const formData = new FormData(form);
    const targetFormat = formData.get("target-format-radio");
    const targetFormatExtensionName = targetFormat.split("/")[1];
    return [targetFormat, targetFormatExtensionName];
}

function ConvertAndDownloadImageFile(targetFormat, targetFormatExtensionName) {
    const canvas = document.getElementById("canvas-image");
    canvas.toBlob(function(blob) {
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "converted." + targetFormatExtensionName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link);
    }, targetFormat);
}