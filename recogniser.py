import speech_recognition as sr
from subprocess import run
from sys import argv
from os import remove
file = argv[1]
inputfilepath = r"./recordings/"+file+".pcm"
outputfilepath = r"./recordings/"+file+".wav"

run(
    'ffmpeg -f s16le -ar 44.1k -ac 2 -acodec pcm_s16le -y -loglevel fatal -i '+inputfilepath+' '+outputfilepath,
    shell=True)
try:
    r = sr.Recognizer()
    with sr.AudioFile(outputfilepath) as source:
        a = r.recognize_google(r.record(source), language = 'ru-RU')
    print(a)
except Exception as a:
    with open('error', 'a') as file:
        file.write(f'{a}\n')
remove(inputfilepath)
remove(outputfilepath)