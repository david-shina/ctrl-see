from elevenlabs.client import ElevenLabs
from elevenlabs import play
from dotenv import load_dotenv
import os
import pydub
load_dotenv()

apiKey = os.getenv('ELEVENLABS_API_KEY')


pydub.AudioSegment.converter = 'C:/path/to/ffmpeg/bin/ffmpeg.exe'

client = ElevenLabs(
    api_key=apiKey
)

audio = client.text_to_speech.convert(
    text = 'My name is David',
    voice_id="JBFqnCBsd6RMkjVDRZzb",
    model_id="eleven_multilingual_v2",
    output_format="mp3_44100_128",
)

play(audio)