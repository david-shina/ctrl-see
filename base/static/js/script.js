document.addEventListener('DOMContentLoaded', function() {
    const textareas = document.querySelectorAll('textarea');
    const startButton = document.getElementById('startSpeech');
    const pauseButton = document.getElementById('pauseSpeech');
    const resumeButton = document.getElementById('resumeSpeech');
    const rateControl = document.getElementById('speechRate');

    let speechSynthesis = window.speechSynthesis;
    let currentUtterance = null;
    let lastWord = '';


    function stripHtmlTags(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || '';
    }

    function speakText(text){
        // Cancel any ongoing speech
        speechSynthesis.cancel();

        // Create a new utterance
        currentUtterance = new SpeechSynthesisUtterance(text);

        // Adjust speaking rate
        currentUtterance.rate = rateControl.value;

        // Speak the text
        speechSynthesis.speak(currentUtterance);

    }

    function readText() {
        // Combine text from all textareas, stripping HTML tags
        const textToRead = Array.from(textareas)
            .map(textarea => stripHtmlTags(textarea.value))
            .join(' ')
            .trim();

        if (textToRead) {
            speakText(textToRead);
        }
    }

    function handleTyping(event){
        const textarea = event.target;
        const cursorPosition = textarea.selectionStart;

        const typedChar = textarea.value.charAt(cursorPosition - 1);

        if (typedChar && typedChar !== ' '){
            speakText(typedChar);
        }

        if (typedChar === ' ' || /[,.!?]/.test(typedChar)) {
            const textBeforeCursor = textarea.value.substring(0, cursorPosition);
            const words = textBeforeCursor.trim().split(/\s+/);
            const lastWord = words[words.length - 1].replace(/[.,!?]$/, '');

            if (lastWord && lastWord !== ''){
                speakText(lastWord);
            }
        }

    }

    textareas.forEach(textarea => {
        textarea.addEventListener('input', handleTyping)
    });

    startButton.addEventListener('click', readText);

    pauseButton.addEventListener('click', () => {
        speechSynthesis.pause();
    });

    resumeButton.addEventListener('click', () => {
        speechSynthesis.resume();
    });

    rateControl.addEventListener('change', () => {
        if (currentUtterance) {
            // Update rate if text is currently being spoken
            currentUtterance.rate = rateControl.value;
        }
    });
});