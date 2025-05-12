import argparse
from moviepy.editor import *
from gtts import gTTS
import tempfile

def generate_video(text, output_path):
    # Step 1: Generate Voiceover
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp_audio:
        tts = gTTS(text, lang='en')
        tts.save(tmp_audio.name)
        audio = AudioFileClip(tmp_audio.name)

    # Step 2: Create Text Animation
    text_clip = TextClip(
        text,
        fontsize=50,
        color="white",
        size=(1280, 720),
        bg_color="black",
    ).set_duration(audio.duration)

    # Step 3: Combine & Export
    final_clip = text_clip.set_audio(audio)
    final_clip.write_videofile(
        output_path,
        fps=24,
        codec="libx264",
        audio_codec="aac",
        threads=4,
    )

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    generate_video(args.text, args.output)
