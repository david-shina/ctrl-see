document.addEventListener('DOMContentLoaded', function() {
    // Wait for CKEditor to be initialized
    const checkEditor = setInterval(() => {
        // Get the editor instance
        const editorElement = document.querySelector('.django_ckeditor_5');
        if (editorElement && window.django_ckeditor_5_editors) {
            clearInterval(checkEditor);
            initializeSpeechReader();
        }
    }, 100);

    function initializeSpeechReader() {
        const startButton = document.getElementById('startSpeech');
        const pauseButton = document.getElementById('pauseSpeech');
        const resumeButton = document.getElementById('resumeSpeech');
        const rateControl = document.getElementById('speechRate');
        
        const speechSynthesis = window.speechSynthesis;
        let currentUtterance = null;
        
        // Get the editor instance
        const editorId = document.querySelector('.django_ckeditor_5').id;
        const editor = window.django_ckeditor_5_editors[editorId];
        
        function stripHtmlTags(html) {
            const temp = document.createElement('div');
            temp.innerHTML = html;
            return temp.textContent || temp.innerText || '';
        }
        
        function speakText(text) {
            //speechSynthesis.cancel();
            currentUtterance = new SpeechSynthesisUtterance(text);
            currentUtterance.rate = parseFloat(rateControl.value);
            speechSynthesis.speak(currentUtterance);
        }
        
        function readText() {
            const editorContent = editor.getData();
            const textToRead = stripHtmlTags(editorContent).trim();
            
            if (textToRead) {
                speakText(textToRead);
            }
        }
        
        // Listen for editor changes
        editor.model.document.on('change:data', () => {
            const content = editor.getData();
            const plainText = stripHtmlTags(content);
            const words = plainText.trim().split(/\s+/);
            const lastWord = words[words.length - 1];
            
            if (lastWord) {
                speakText(lastWord);
            }
        });
        
        // Add button event listeners
        startButton.addEventListener('click', readText);
        
        pauseButton.addEventListener('click', () => {
            speechSynthesis.pause();
        });
        
        resumeButton.addEventListener('click', () => {
            speechSynthesis.resume();
        });
        
        rateControl.addEventListener('change', () => {
            if (currentUtterance) {
                currentUtterance.rate = parseFloat(rateControl.value);
            }
        });
    }
});