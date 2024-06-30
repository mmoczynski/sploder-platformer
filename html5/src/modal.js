/**
 * Modal module
 * Written by @mmoczynski
 */

function Modal() {

    this.modal = document.createElement("div");
    this.modal.classList.add("modal");

    this.modalContainer = document.createElement("div");
    this.modalContainer.classList.add("modal-container");

    this.modal.appendChild(this.modalContainer);
}

Modal.alert = function(text, ondismiss = function() {}) {

    // Modal object
    var m = new Modal();

    // Modal body
    var body = document.createElement("div");
    body.classList.add("modal-body");
    body.classList.add("alert");
    body.innerText = text;
    m.modalContainer.appendChild(body);

    // Modal footer
    var modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-footer");
    m.modalContainer.appendChild(modalFooter);

    // Dismiss button
    var dismissButton = document.createElement("span");
    dismissButton.classList.add("dismiss-modal");
    dismissButton.classList.add("modal-button");
    dismissButton.innerText = "OK"
    modalFooter.appendChild(dismissButton);

    dismissButton.addEventListener("click", function(){
        document.body.removeChild(m.modal);
        ondismiss();
    })

    document.body.appendChild(m.modal);

    return m;
}

Modal.confirm = function(text, onconfirm = function() {}, oncancel = function(){} ) {

    // Modal object
    var m = new Modal();

    // Modal body
    var body = document.createElement("div");
    body.classList.add("modal-body");
    body.classList.add("alert");
    body.innerText = text;
    m.modalContainer.appendChild(body);

    // Modal footer
    var modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-footer");
    m.modalContainer.appendChild(modalFooter);

    // Cancel button
    var cancelButton = document.createElement("span");
    cancelButton.classList.add("cancel-modal");
    cancelButton.classList.add("modal-button");
    cancelButton.innerText = "Cancel"
    modalFooter.appendChild(cancelButton);

    cancelButton.addEventListener("click", function(){
        document.body.removeChild(m.modal);
        oncancel();
    });

    // Confirm
    var confirmButton = document.createElement("span");
    confirmButton.classList.add("confirm-modal");
    confirmButton.classList.add("modal-button");
    confirmButton.innerText = "OK"
    modalFooter.appendChild(confirmButton);

    confirmButton.addEventListener("click", function(){
        document.body.removeChild(m.modal);
        onconfirm();
    });

    document.body.appendChild(m.modal);

    return m;
}

/**
 * 
 * @param {string} text 
 * @param {Function} [onconfirm]
 * @param {Function} [oncancel] 
 * @param {string} [defaultValue] 
 * @returns 
 */

Modal.prompt = function(text, onconfirm = function() {}, oncancel = function() {}, defaultValue) {

    // Buffer for holding input text
    var inputText = defaultValue;

    // Modal object
    var m = new Modal();

    // Modal body
    var body = document.createElement("div");
    body.classList.add("modal-body");
    body.classList.add("alert");
    m.modalContainer.appendChild(body);

    // Modal Text section
    var textElm = document.createElement("div");
    textElm.innerText = text;
    textElm.classList.add("prompt-text");
    body.appendChild(textElm);

    // Modal input

    var input = document.createElement("input");
    input.type = "text";
    input.value = defaultValue;
    body.appendChild(input);

    input.addEventListener("input", function(){
        inputText = this.value;
    });

    // Modal footer
    var modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-footer");
    m.modalContainer.appendChild(modalFooter);

    // Cancel button
    var cancelButton = document.createElement("span");
    cancelButton.classList.add("cancel-modal");
    cancelButton.classList.add("modal-button");
    cancelButton.innerText = "Cancel"
    modalFooter.appendChild(cancelButton);

    cancelButton.addEventListener("click", function(){
        document.body.removeChild(m.modal);
        oncancel(inputText);
    });

    // Confirm
    var confirmButton = document.createElement("span");
    confirmButton.classList.add("confirm-modal");
    confirmButton.classList.add("modal-button");
    confirmButton.innerText = "OK"
    modalFooter.appendChild(confirmButton);

    confirmButton.addEventListener("click", function(){
        document.body.removeChild(m.modal);
        onconfirm(inputText);
    });

    document.body.appendChild(m.modal);

    return m;
}

export default Modal;